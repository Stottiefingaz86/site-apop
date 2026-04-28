#!/usr/bin/env node
// The previous bulk script inserted `<SidebarPromos onOpenHub={openVipDrawer}/>`
// at every SidebarContent → TooltipProvider boundary. Some boundaries live in
// sub-components (CashRacesPage, PromosPage, SportsPage, etc.) that don't have
// `openVipDrawer` in scope, which throws a ReferenceError at runtime.
//
// This script walks each file, locates every inserted SidebarPromos block,
// determines its enclosing function, and if that function doesn't define
// `openVipDrawer`, drops the `onOpenHub={openVipDrawer}` prop from that block.
//
// Idempotent.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Same file list as the install script.
import { execSync } from 'node:child_process'
const grepOutput = execSync(
  "grep -l 'onOpenHub={openVipDrawer}' app -R 2>/dev/null || true",
  { cwd: ROOT, encoding: 'utf8' }
)
const FILES = grepOutput
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.endsWith('.tsx'))
  // Keep only the live page files (skip backups)
  .filter((l) => !l.endsWith('.backup') && !l.includes('.backup-'))

console.log(`Scanning ${FILES.length} files`)

let updated = 0

for (const rel of FILES) {
  const file = path.join(ROOT, rel)
  let src = fs.readFileSync(file, 'utf8')
  const before = src

  // Pre-compute every function declaration's start position so we can map
  // any line number back to its enclosing function quickly.
  const fnRegex = /^(?:export\s+)?function\s+(\w+)\s*\(/gm
  const fns = []
  let match
  while ((match = fnRegex.exec(src)) !== null) {
    fns.push({ name: match[1], start: match.index })
  }

  // Helper: find the function that contains the given character offset.
  function fnContaining(offset) {
    let current = null
    for (const fn of fns) {
      if (fn.start <= offset) current = fn
      else break
    }
    return current
  }

  // Helper: extract the body of a function (very loose — uses brace counting
  // from the first `{` after the function signature).
  function fnBody(fn) {
    if (!fn) return ''
    let i = src.indexOf('{', fn.start)
    if (i < 0) return ''
    let depth = 0
    const start = i
    for (; i < src.length; i++) {
      const ch = src[i]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) {
          return src.slice(start, i + 1)
        }
      }
    }
    return src.slice(start)
  }

  // Find every `onOpenHub={openVipDrawer}` occurrence and decide whether
  // its enclosing function has openVipDrawer in scope.
  const target = 'onOpenHub={openVipDrawer}'
  let changedSrc = ''
  let cursor = 0
  while (true) {
    const idx = src.indexOf(target, cursor)
    if (idx < 0) {
      changedSrc += src.slice(cursor)
      break
    }
    const fn = fnContaining(idx)
    const body = fnBody(fn)

    // Heuristic: openVipDrawer must be DEFINED here (not just referenced).
    // We accept either `const openVipDrawer = ` or destructured `, openVipDrawer,`.
    const defined =
      /\bconst\s+openVipDrawer\s*=/.test(body) ||
      /\bopenVipDrawer\s*[:,=]/.test(body)

    if (defined) {
      changedSrc += src.slice(cursor, idx + target.length)
      cursor = idx + target.length
    } else {
      // Strip the entire prop (including its preceding whitespace + newline).
      // Each block looks like:
      //   <SidebarPromos
      //     collapsed={...}
      //     onOpenHub={openVipDrawer}
      //   />
      // We need to remove just the line containing onOpenHub.
      const lineStart = src.lastIndexOf('\n', idx) + 1
      const lineEnd = src.indexOf('\n', idx)
      changedSrc += src.slice(cursor, lineStart) // keep up to start of line
      cursor = lineEnd + 1 // skip the entire line
    }
  }

  if (changedSrc !== before) {
    fs.writeFileSync(file, changedSrc)
    console.log(`UPDATED ${rel}`)
    updated++
  }
}

console.log(`\nDone. Updated ${updated} files.`)
