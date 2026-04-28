#!/usr/bin/env node
// Replace the default SidebarMenuButton render path for the
// `id: 'Get Telegram'` entry with a custom Telegram-styled card
// (blue gradient + Join button) that mirrors the VIP Hub treatment.
//
// Idempotent: re-running is a no-op once the patched branch is present.

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SENTINEL = "if (itemId === 'Get Telegram')"

// Old needle: the canonical sequence at the bottom of the VIP-Rewards
// sidebar `.map(...)` callback that renders each item.  The script
// inserts the new branch directly above the existing `return (`.
const NEEDLE = /(\s*)const isActive = vipActiveSidebarItem === itemId\n(\s*)return \(/

const NEW_BLOCK = `$1const isActive = vipActiveSidebarItem === itemId
$1if (itemId === 'Get Telegram') {
$1  const isCollapsed = sidebarState === 'collapsed' && !isMobile
$1  return (
$1    <SidebarMenuItem key={itemId}>
$1      <Tooltip>
$1        <TooltipTrigger asChild>
$1          <a
$1            href="https://t.me/betonline"
$1            target="_blank"
$1            rel="noopener noreferrer"
$1            className={cn(
$1              "group flex items-center rounded-xl bg-gradient-to-r from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/20 hover:border-[#229ED9]/40 transition-all",
$1              isCollapsed ? "justify-center w-9 h-9 mx-auto p-0" : "gap-3 px-2.5 py-2"
$1            )}
$1          >
$1            <div className={cn(
$1              "rounded-lg bg-[#229ED9]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#229ED9]/30 transition-colors",
$1              isCollapsed ? "w-7 h-7" : "w-9 h-9"
$1            )}>
$1              <IconBrandTelegram className={cn(isCollapsed ? "w-4 h-4" : "w-5 h-5", "text-[#229ED9]")} />
$1            </div>
$1            {!isCollapsed && (
$1              <>
$1                <div className="flex-1 min-w-0">
$1                  <p className="text-xs font-semibold text-white leading-tight">Join our Telegram</p>
$1                  <p className="text-[11px] text-white/40 leading-snug truncate">Codes, promos & rewards</p>
$1                </div>
$1                <div className="flex-shrink-0">
$1                  <div className="px-2 py-1 rounded-md bg-[#229ED9] text-white text-[11px] font-semibold group-hover:bg-[#1a8bc2] transition-colors">
$1                    Join
$1                  </div>
$1                </div>
$1              </>
$1            )}
$1          </a>
$1        </TooltipTrigger>
$1        {isCollapsed && (
$1          <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
$1            <p>Join our Telegram</p>
$1          </TooltipContent>
$1        )}
$1      </Tooltip>
$1    </SidebarMenuItem>
$1  )
$1}
$2return (`

function ensureIconImport(src, name) {
  // already imported anywhere in the file?
  if (new RegExp(`\\b${name}\\b`).test(src)) return src
  return src.replace(/\{([^}]*?)\}\s*from '@tabler\/icons-react'/, (full, inside) => {
    const trimmed = inside.replace(/\s+$/, '')
    const sep = trimmed.endsWith(',') ? ' ' : ', '
    return `{${trimmed}${sep}${name} } from '@tabler/icons-react'`
  })
}

function listFiles() {
  const out = execSync(
    "grep -rl \"id: 'Get Telegram', icon: IconDownload, label: 'Get Telegram'\" app --include='*.tsx' --exclude='*.backup*'",
    { cwd: ROOT, encoding: 'utf8' }
  )
  return out
    .split('\n')
    .filter(Boolean)
    .filter(f => !f.includes('.backup'))
}

function processFile(rel) {
  const abs = path.join(ROOT, rel)
  let src = fs.readFileSync(abs, 'utf8')
  if (src.includes(SENTINEL)) return { rel, status: 'skipped' }
  if (!NEEDLE.test(src)) return { rel, status: 'no-match' }

  src = src.replace(NEEDLE, NEW_BLOCK)
  src = ensureIconImport(src, 'IconBrandTelegram')

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
