#!/usr/bin/env node
// The previous Telegram-card script accidentally inserted a blank line
// between every line of the Get Telegram branch.  Walk every file that
// has the patched branch and collapse any empty lines that occur INSIDE
// the `if (itemId === 'Get Telegram') { ... }` block down to a single
// newline.

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function listFiles() {
  const out = execSync(
    "grep -rl \"if (itemId === 'Get Telegram')\" app --include='*.tsx' --exclude='*.backup*'",
    { cwd: ROOT, encoding: 'utf8' }
  )
  return out
    .split('\n')
    .filter(Boolean)
    .filter(f => !f.includes('.backup'))
}

function processFile(rel) {
  const abs = path.join(ROOT, rel)
  const src = fs.readFileSync(abs, 'utf8')
  const lines = src.split('\n')

  // Find the start of the Get Telegram branch
  const startIdx = lines.findIndex(l => /if \(itemId === 'Get Telegram'\) \{/.test(l))
  if (startIdx === -1) return { rel, status: 'no-start' }

  // Walk forward, tracking brace depth, until we close the `if {` block.
  // We start with depth=1 because the matched line opened a `{`.
  let depth = 1
  let endIdx = -1
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i]
    for (const ch of line) {
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) {
          endIdx = i
          break
        }
      }
    }
    if (endIdx !== -1) break
  }
  if (endIdx === -1) return { rel, status: 'no-end' }

  // Detect malformation: count blank lines inside the branch
  let blanks = 0
  for (let i = startIdx + 1; i < endIdx; i++) {
    if (lines[i].trim() === '') blanks++
  }
  if (blanks < 5) return { rel, status: 'already-clean' }

  // Drop blank lines between startIdx and endIdx (inclusive of body, exclusive of fences)
  const before = lines.slice(0, startIdx + 1)
  const body = lines.slice(startIdx + 1, endIdx).filter(l => l.trim() !== '')
  const after = lines.slice(endIdx)

  const next = [...before, ...body, ...after].join('\n')
  fs.writeFileSync(abs, next)
  return { rel, status: 'fixed' }
}

const files = listFiles()
const results = files.map(processFile)
const counts = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1
  return acc
}, {})
console.log(JSON.stringify(counts, null, 2))
const odd = results.filter(r => !['fixed', 'already-clean'].includes(r.status))
if (odd.length) console.log('Odd files:', odd)
