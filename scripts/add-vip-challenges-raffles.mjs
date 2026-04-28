#!/usr/bin/env node
// Add `Challenges` and `Raffles` items to the VIP rewards sidebar
// menu on every page that has the existing Cash Races / Contests /
// Refer A Friend trio.  Idempotent: re-running is a no-op.

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const NEEDLE = /(\{\s*id:\s*'Contests',\s*icon:\s*IconTrophy,\s*label:\s*'Contests'\s*\},)\s*\n(\s*)(\{\s*id:\s*'Refer A Friend',\s*icon:\s*IconUserPlus,\s*label:\s*'Refer A Friend'\s*\},?)/

const SENTINEL = "id: 'Challenges',"

const ICON_IMPORTS = ['IconFlame', 'IconTicket']

function ensureIconImport(src, name) {
  if (new RegExp(`\\b${name}\\b`).test(src.split('\n').slice(0, 200).join('\n'))) return src
  // Add to first @tabler/icons-react import block
  return src.replace(/from '@tabler\/icons-react'/, (m, offset) => {
    // Walk backwards from the match to find the opening `{`
    return m
  }).replace(/\{([^}]*?)\}\s*from '@tabler\/icons-react'/, (full, inside) => {
    if (new RegExp(`\\b${name}\\b`).test(inside)) return full
    const trimmed = inside.replace(/\s+$/, '')
    const sep = trimmed.endsWith(',') ? ' ' : ', '
    return `{${trimmed}${sep}${name} } from '@tabler/icons-react'`
  })
}

function listFiles() {
  const out = execSync(
    "grep -rl \"Contests', icon: IconTrophy\" app --include='*.tsx' --exclude='*.backup*'",
    { cwd: ROOT, encoding: 'utf8' }
  )
  return out.split('\n').filter(Boolean).filter(f => !f.includes('.backup'))
}

function processFile(rel) {
  const abs = path.join(ROOT, rel)
  let src = fs.readFileSync(abs, 'utf8')
  if (src.includes(SENTINEL)) return { rel, status: 'skipped' }
  if (!NEEDLE.test(src)) return { rel, status: 'no-match' }

  src = src.replace(NEEDLE, (_m, contests, indent, refer) =>
    `${contests}\n${indent}{ id: 'Challenges', icon: IconFlame, label: 'Challenges' },\n${indent}{ id: 'Raffles', icon: IconTicket, label: 'Raffles' },\n${indent}${refer}`
  )

  for (const icon of ICON_IMPORTS) src = ensureIconImport(src, icon)

  fs.writeFileSync(abs, src)
  return { rel, status: 'updated' }
}

const files = listFiles()
const results = files.map(processFile)
const counts = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1
  return acc
}, {})
console.log(JSON.stringify(counts, null, 2))
const noMatch = results.filter(r => r.status === 'no-match')
if (noMatch.length) console.log('No-match files:', noMatch.map(r => r.rel))
