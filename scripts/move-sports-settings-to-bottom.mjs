#!/usr/bin/env node
// Move the `{/* Settings */}` SidebarGroup in the sports sidebar from its
// position (just under SidebarPromos) down to the bottom of the same
// SidebarContent — i.e. underneath the Volleyball/SPORTS list, but still
// inside the closing </TooltipProvider></SidebarContent>.
//
// Idempotent: skips files where the Settings block already sits in the
// last 25 lines of its SidebarContent.

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Capture the entire `{/* Settings */}` SidebarGroup, including the leading
// whitespace + comment line.
const SETTINGS_BLOCK = /\n([ \t]*)\{\/\* Settings \*\/\}\n[ \t]*<SidebarGroup>[\s\S]*?<\/SidebarGroup>\n/

function listFiles() {
  const out = execSync(
    "grep -rl 'Settings \\*/}' app --include='*.tsx' --exclude='*.backup*'",
    { cwd: ROOT, encoding: 'utf8' }
  )
  return out
    .split('\n')
    .filter(Boolean)
    .filter(f => !f.includes('.backup'))
}

function processFile(rel) {
  const abs = path.join(ROOT, rel)
  const original = fs.readFileSync(abs, 'utf8')

  const m = original.match(SETTINGS_BLOCK)
  if (!m) return { rel, status: 'no-settings-block' }

  const indent = m[1]
  const block = m[0]

  // Position of the Settings block start
  const blockStart = m.index
  const blockEnd = blockStart + block.length

  // Find the first </TooltipProvider> followed (within whitespace) by
  // </SidebarContent> AFTER the Settings block. That is the bottom of
  // the sports sidebar.
  const tail = original.slice(blockEnd)
  const closeRe = /([ \t]*)<\/TooltipProvider>\s*(\{[^}]*\}\s*)?<\/SidebarContent>/
  const tailMatch = tail.match(closeRe)
  if (!tailMatch) return { rel, status: 'no-closing' }

  const insertAt = blockEnd + tailMatch.index
  const closeIndent = tailMatch[1]

  // Already at the bottom?  Skip if there is nothing significant between
  // blockEnd and insertAt other than whitespace.
  const between = tail.slice(0, tailMatch.index).trim()
  if (between.length === 0) {
    return { rel, status: 'already-bottom' }
  }

  // Build the new file:
  //   1. text up to blockStart
  //   2. text from blockEnd to insertAt
  //   3. block (re-indented to closeIndent)
  //   4. text from insertAt to end
  const before = original.slice(0, blockStart)
  const middle = original.slice(blockEnd, insertAt)
  const after = original.slice(insertAt)

  // Re-indent block lines so they line up with closeIndent
  const trimmedLeading = block.replace(/^\n/, '')
  const reIndented =
    '\n' +
    trimmedLeading
      .split('\n')
      .map(line => {
        if (line.length === 0) return line
        // Strip any leading whitespace up to indent length, then prepend closeIndent
        return line.replace(new RegExp(`^${indent}`), closeIndent)
      })
      .join('\n')

  const next = before + middle + reIndented + after
  fs.writeFileSync(abs, next)
  return { rel, status: 'moved' }
}

const files = listFiles()
const results = files.map(processFile)
const counts = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1
  return acc
}, {})
console.log(JSON.stringify(counts, null, 2))

for (const r of results) {
  if (r.status !== 'moved' && r.status !== 'already-bottom') {
    console.log(`${r.status}: ${r.rel}`)
  }
}
