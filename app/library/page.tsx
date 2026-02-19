'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconSearch,
  IconCopy,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconBallFootball,
  IconMessageCircle2,
  IconTicket,
  IconHeart,
  IconPalette,
  IconBolt,
  IconCloudRain,
  IconDeviceGamepad2,
  IconLayoutGrid,
  IconGripVertical,
  IconResize,
  IconCode,
  IconEye,
  IconFilter,
  IconDice,
  IconUsers,
  IconBackspace,
  IconShare,
  IconGift,
  IconBrandTelegram,
  IconX,
  IconTrophy,
  IconCircleCheck,
  IconCurrencyDollar,
  IconMinus,
  IconMaximize,
  IconUpload,
  IconTrash,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

// ── Real component imports (wrapped in try/catch safe wrappers) ──
// NOTE: These components are used in previews. If any crash during
// hydration the whole page goes blank, so we use lazy safe wrappers.
import dynamic from 'next/dynamic'

const StreakCounter = dynamic(() => import('@/components/vip/streak-counter').then(m => ({ default: m.StreakCounter })), { ssr: false })
const CashDropCode = dynamic(() => import('@/components/vip/cash-drop-code').then(m => ({ default: m.CashDropCode })), { ssr: false })
const ReloadClaim = dynamic(() => import('@/components/vip/reload-claim').then(m => ({ default: m.ReloadClaim })), { ssr: false })
const BetAndGet = dynamic(() => import('@/components/vip/bet-and-get').then(m => ({ default: m.BetAndGet })), { ssr: false })
const RainBackground = dynamic(() => import('@/components/rain-background').then(m => ({ default: m.RainBackground })), { ssr: false })
const InteractiveGridBackground = dynamic(() => import('@/components/interactive-grid-background').then(m => ({ default: m.InteractiveGridBackground })), { ssr: false })
const BetslipNumberPad = dynamic(() => import('@/components/betslip/number-pad').then(m => ({ default: m.BetslipNumberPad })), { ssr: false })

// ── AnimatedPillTabsPreview (static recreation) ─────────
function AnimatedPillTabsPreview() {
  const [active, setActive] = useState('For You')
  const tabs = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Live', 'Jackpots']
  return (
    <div className="w-full">
      <div className="inline-flex bg-white/5 p-0.5 h-auto gap-1 rounded-3xl relative items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              'relative z-10 rounded-2xl px-4 py-1 h-9 text-xs font-medium transition-colors duration-300 ease-in-out flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
              active === tab ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
            )}
          >
            {active === tab && (
              <motion.div
                layoutId="libraryActiveTab"
                className="absolute inset-0 rounded-2xl -z-10"
                style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── FamilyDrawerPreview (interactive bottom-sheet demo) ──
function FamilyDrawerPreview() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'default' | 'confirm'>('default')
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[320px] mx-auto rounded-xl border border-white/10 overflow-hidden"
      style={{ height: 320, backgroundColor: 'var(--ds-page-bg, #111)' }}
    >
      {/* Page behind the drawer */}
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-[10px] text-white/30 text-center">Page content behind the drawer</p>
        <button
          onClick={() => { setOpen(true); setView('default') }}
          className="px-4 py-2 rounded-full text-xs font-medium text-white cursor-pointer"
          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
        >
          Open Drawer
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setOpen(false); setView('default') }}
          />
        )}
      </AnimatePresence>

      {/* Bottom-sheet drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 bottom-0 z-20 rounded-t-[10px]"
            style={{ backgroundColor: 'var(--ds-card-bg, #1a1a1a)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 80 || info.velocity.y > 300) {
                setOpen(false)
                setView('default')
              }
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              {view === 'default' ? (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 space-y-3"
                >
                  <h3 className="text-sm font-semibold text-white mt-1">Place your bet</h3>
                  <p className="text-[11px] text-white/50">Liverpool ML · -150</p>
                  <div className="h-9 rounded-lg bg-white/5 border border-white/10 flex items-center px-3">
                    <span className="text-xs text-white/30">$</span>
                    <span className="text-xs text-white ml-1">10.00</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setOpen(false); setView('default') }}
                      className="flex-1 h-9 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setView('confirm')}
                      className="flex-1 h-9 rounded-lg text-[11px] text-white font-medium cursor-pointer"
                      style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                    >
                      Place Bet
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mt-2" style={{ backgroundColor: '#8BC34A' }}>
                    <IconCheck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-white">Bet Placed!</p>
                  <p className="text-[10px] text-white/40">Liverpool ML · $10.00</p>
                  <button
                    onClick={() => { setOpen(false); setView('default') }}
                    className="w-full h-9 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/50 font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── AccountDrawerPreview (interactive right-slide demo) ──
function AccountDrawerPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto rounded-xl border border-white/10 overflow-hidden"
      style={{ height: 300, backgroundColor: 'var(--ds-page-bg, #111)' }}
    >
      {/* Page behind */}
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-[10px] text-white/30 text-center">Main page content</p>
        <button
          onClick={() => setOpen(true)}
          className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
        >
          <span className="text-xs font-semibold text-white">CH</span>
        </button>
        <p className="text-[9px] text-white/20">Tap avatar to open</p>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Right-side drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-0 bottom-0 right-0 z-20 w-[220px] bg-white text-gray-900 border-l border-gray-200 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 60 || info.velocity.x > 200) setOpen(false)
            }}
          >
            {/* Header */}
            <div className="px-3 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-gray-600">CH</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900">Chris H.</div>
                <div className="text-[9px] text-gray-400">b1767721</div>
              </div>
              <button onClick={() => setOpen(false)} className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
                <IconX className="w-3 h-3 text-gray-500" />
              </button>
            </div>

            {/* Balance */}
            <div className="px-3 py-2.5 border-b border-gray-50">
              <div className="text-[9px] text-gray-400 uppercase tracking-wide">Balance</div>
              <div className="text-base font-bold text-gray-900">$1,234.56</div>
            </div>

            {/* Menu items */}
            <div className="flex-1 px-2 py-2 space-y-0.5 overflow-auto">
              {['My Bets', 'Deposit', 'Withdraw', 'Transactions', 'Bonus', 'Settings'].map((item) => (
                <div key={item} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-[11px] text-gray-700 font-medium">{item}</span>
                  <IconChevronRight className="w-3 h-3 ml-auto text-gray-300" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2.5 border-t border-gray-100">
              <button className="w-full h-8 rounded-lg bg-gray-100 text-[10px] font-medium text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── SideNavDrawerPreview (interactive left-slide demo) ───
function SideNavDrawerPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative w-full max-w-[360px] mx-auto rounded-xl border border-white/10 overflow-hidden"
      style={{ height: 300, backgroundColor: 'var(--ds-page-bg, #111)' }}
    >
      {/* Page behind */}
      <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
        <p className="text-[10px] text-white/30 text-center">Main page content</p>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-[11px] text-white/70 font-medium cursor-pointer hover:bg-white/15 transition-colors"
        >
          <IconLayoutGrid className="w-3.5 h-3.5" /> Menu
        </button>
        <p className="text-[9px] text-white/20">Tap to open · Drag to dismiss</p>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Left-side nav drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-0 bottom-0 left-0 z-20 w-[200px] flex flex-col border-r border-white/10"
            style={{ backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)' }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x < -60 || info.velocity.x < -200) setOpen(false)
            }}
          >
            {/* Sports nav items */}
            <div className="flex-1 px-2 py-3 space-y-0.5 overflow-auto">
              {[
                { icon: '/sports_icons/soccer.svg', label: 'Soccer', active: true },
                { icon: '/sports_icons/Basketball.svg', label: 'Basketball', active: false },
                { icon: '/sports_icons/football.svg', label: 'Football', active: false },
                { icon: '/sports_icons/tennis.svg', label: 'Tennis', active: false },
                { icon: '/sports_icons/Hockey.svg', label: 'Hockey', active: false },
                { icon: '/sports_icons/mma.svg', label: 'MMA', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all',
                    item.active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  style={item.active ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
                >
                  <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" />
                  <span>{item.label}</span>
                  <IconChevronRight className={cn('w-3 h-3 ml-auto', item.active ? 'text-white/60' : 'text-white/20')} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Error Boundary ────────────────────────────────────────
class LibraryErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 rounded-xl border border-red-500/30 bg-red-500/10 m-4">
          <h3 className="text-red-400 font-bold text-lg mb-2">Component Render Error</h3>
          <pre className="text-red-300 text-xs whitespace-pre-wrap">{this.state.error.message}</pre>
          <pre className="text-red-300/60 text-[10px] mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Types ──────────────────────────────────────────────────
interface ComponentEntry {
  id: string
  name: string
  description: string
  category: 'atoms' | 'components' | 'blocks'
  tags: string[]
  filePath: string
  preview: React.ReactNode
  codeSnippet: string
}

// ── Code Block with Copy ─────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0d0d0d]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
        <span className="text-[11px] font-mono text-white/40">{filename}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors"
        >
          {copied ? (
            <>
              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <IconCopy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono text-white/70 max-h-[400px] overflow-y-auto custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ── Component Card ──────────────────────────────────────
function ComponentCard({ entry }: { entry: ComponentEntry }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'preview' | 'code'>('preview')

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-white/[0.15] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">{entry.name}</h3>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 uppercase tracking-wider font-medium shrink-0">
              {entry.category}
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1">{entry.description}</p>
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          {/* Preview / Code toggle */}
          <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
            <button
              onClick={() => setView('preview')}
              className={cn(
                'flex items-center gap-1 px-2 h-full text-[10px] font-medium transition-all',
                view === 'preview' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              <IconEye className="w-3 h-3" />
              Preview
            </button>
            <div className="w-px h-3.5 bg-white/10" />
            <button
              onClick={() => setView('code')}
              className={cn(
                'flex items-center gap-1 px-2 h-full text-[10px] font-medium transition-all',
                view === 'code' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              )}
            >
              <IconCode className="w-3 h-3" />
              Code
            </button>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <IconChevronDown className="w-4 h-4 text-white/40" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 py-2 flex items-center gap-1.5 flex-wrap border-b border-white/[0.04]">
        {entry.tags.map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-white/30 font-mono">
            {tag}
          </span>
        ))}
        <span className="text-[9px] text-white/20 ml-auto font-mono">{entry.filePath}</span>
      </div>

      {/* Preview area (always visible) */}
      <div className="p-4">
        {view === 'preview' ? (
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4 min-h-[80px] max-h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar flex items-start justify-center">
            <div className="w-full overflow-visible">
              {entry.preview}
            </div>
          </div>
        ) : (
          <CodeBlock code={entry.codeSnippet} filename={entry.filePath} />
        )}
      </div>

      {/* Expandable full code */}
      <AnimatePresence>
        {isOpen && view === 'preview' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <CodeBlock code={entry.codeSnippet} filename={entry.filePath} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Component Registry ──────────────────────────────────
const LIBRARY: ComponentEntry[] = [

  // ═══════════════════════════════════════════════════════
  // COMPONENTS
  // ═══════════════════════════════════════════════════════

  {
    id: 'sub-nav-sports',
    name: 'Sports Sub Nav',
    description: 'Horizontal scrollable sport icon tabs with active indicator underline, brand-themed. Uses real SVG sport icons.',
    category: 'components',
    tags: ['navigation', 'sub-nav', 'sports', 'tabs', 'horizontal-scroll', 'icons'],
    filePath: 'app/sports/page.tsx (inline)',
    preview: (
      <div className="w-full rounded-lg" style={{ backgroundColor: 'var(--ds-nav-bg, #2D2E2C)' }}>
        <div className="pt-3 pb-4 px-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { icon: '/sports_icons/my-feed.svg', label: 'My Feed', active: false },
              { icon: '/sports_icons/soccer.svg', label: 'Soccer', active: true },
              { icon: '/sports_icons/Basketball.svg', label: 'Basketball', active: false },
              { icon: '/sports_icons/football.svg', label: 'Football', active: false },
              { icon: '/sports_icons/tennis.svg', label: 'Tennis', active: false },
              { icon: '/sports_icons/Hockey.svg', label: 'Hockey', active: false },
              { icon: '/sports_icons/mma.svg', label: 'MMA', active: false },
              { icon: '/sports_icons/baseball.svg', label: 'Baseball', active: false },
              { icon: '/sports_icons/table_tennis.svg', label: 'Table Tennis', active: false },
            ].map((sport) => (
              <button
                key={sport.label}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5 rounded-small transition-all duration-300 cursor-pointer flex-shrink-0 relative',
                  'hover:bg-white/5 active:bg-white/15',
                  sport.active && 'bg-white/10'
                )}
              >
                <img
                  src={sport.icon}
                  alt={sport.label}
                  width={20}
                  height={20}
                  className={cn(
                    'object-contain transition-opacity duration-300',
                    sport.active ? 'opacity-100' : 'opacity-70'
                  )}
                />
                <span className={cn(
                  'text-[10px] font-medium whitespace-nowrap transition-colors duration-300',
                  sport.active ? 'text-white' : 'text-white/70'
                )}>
                  {sport.label}
                </span>
                {/* Active underline indicator */}
                <div
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 -bottom-2 h-0.5 rounded-full transition-all duration-300 ease-in-out',
                    sport.active ? 'w-8 opacity-100' : 'w-0 opacity-0'
                  )}
                  style={sport.active ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : {}}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    codeSnippet: `{/* Sports Sub Nav — horizontal scrollable icons with active underline */}
<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
  {[
    { icon: '/sports_icons/soccer.svg', label: 'Soccer' },
    { icon: '/sports_icons/Basketball.svg', label: 'Basketball' },
    { icon: '/sports_icons/football.svg', label: 'Football' },
    // ... more sports
  ].map((sport) => {
    const isActive = sport.label === activeSport
    return (
      <button
        key={sport.label}
        onClick={() => setActiveSport(sport.label)}
        className={cn(
          "flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1.5",
          "rounded-small transition-all duration-300 cursor-pointer flex-shrink-0 relative",
          "hover:bg-white/5 active:bg-white/15",
          isActive && "bg-white/10"
        )}
      >
        <img src={sport.icon} alt={sport.label} width={20} height={20}
          className={cn("object-contain", isActive ? "opacity-100" : "opacity-70")} />
        <span className={cn("text-[10px] font-medium whitespace-nowrap",
          isActive ? "text-white" : "text-white/70")}>
          {sport.label}
        </span>
        {/* Red underline indicator */}
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 -bottom-2 h-0.5 rounded-full",
          "transition-all duration-300 ease-in-out",
          isActive ? "w-8 opacity-100" : "w-0 opacity-0"
        )} style={isActive ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : {}} />
      </button>
    )
  })}
</div>`,
  },
  {
    id: 'sub-nav-glass',
    name: 'Sub Nav (Glass Sticky)',
    description: 'Fixed glass-blur sub-navigation bar. Sits below the header, adjusts with sidebar state. Uses framer-motion for animated positioning.',
    category: 'components',
    tags: ['navigation', 'sub-nav', 'glass', 'blur', 'sticky', 'backdrop-filter', 'framer-motion'],
    filePath: 'app/sports/page.tsx (inline)',
    preview: (
      <div className="w-full rounded-lg overflow-hidden">
        <div
          className="backdrop-blur-xl border-b border-white/10 py-3 px-4"
          style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)' }}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {['All', 'Live', 'Starting Soon', 'Popular', 'Boosted', 'Trending'].map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  'px-3 py-1.5 rounded-small text-[12px] font-medium whitespace-nowrap transition-all shrink-0',
                  i === 0
                    ? 'text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                )}
                style={i === 0 ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    codeSnippet: `{/* Sticky Sub Nav with glass effect */}
<motion.div
  data-sub-nav
  className={cn(
    "fixed z-[100]",
    "backdrop-blur-xl border-b border-white/10 py-3 shadow-sm"
  )}
  style={{
    top: 64, // below header
    left: sidebarState === 'collapsed' ? '3rem' : '16rem',
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
  }}
>
  <div className="flex items-center gap-1.5 px-4">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={cn(
          "px-3 py-1.5 rounded-small text-xs font-medium",
          isActive
            ? "text-white"
            : "bg-white/5 text-white/60 hover:bg-white/10"
        )}
        style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}
      >
        {tab}
      </button>
    ))}
  </div>
</motion.div>

// Features:
// • Glassmorphism: bg rgba(26,26,26,0.6) + backdrop-blur-xl
// • Responsive: adjusts left offset based on sidebar state
// • Chat/Dock aware: right offset via CSS vars
// • Mobile: full-width with touch scroll`,
  },
  {
    id: 'sidebar-nav',
    name: 'Sidebar Navigation',
    description: 'Collapsible sidebar with sport icons (SVG), expandable sub-menus, tooltips when collapsed, and brand-themed active state.',
    category: 'blocks',
    tags: ['sidebar', 'navigation', 'collapsible', 'menu', 'sports', 'accordion', 'tooltip'],
    filePath: 'components/ui/sidebar.tsx + app/sports/',
    preview: (
      <div className="w-56 rounded-lg border border-white/10 overflow-hidden p-2 space-y-0.5" style={{ backgroundColor: 'var(--ds-sidebar-bg, #2d2d2d)' }}>
        {[
          { icon: '/sports_icons/soccer.svg', label: 'Soccer', active: true, expandable: true },
          { icon: '/sports_icons/Basketball.svg', label: 'Basketball', active: false, expandable: true },
          { icon: '/sports_icons/football.svg', label: 'Football', active: false, expandable: true },
          { icon: '/sports_icons/tennis.svg', label: 'Tennis', active: false, expandable: true },
          { icon: '/sports_icons/Hockey.svg', label: 'Hockey', active: false, expandable: true },
          { icon: '/sports_icons/mma.svg', label: 'MMA', active: false, expandable: false },
        ].map((item) => (
          <button
            key={item.label}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-small text-sm font-medium transition-all',
              item.active
                ? 'text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            )}
            style={item.active ? { backgroundColor: 'var(--ds-primary, #ee3536)' } : undefined}
          >
            <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
            <span className="flex items-center gap-1.5">{item.label}</span>
            {item.expandable && <IconChevronRight className={cn('w-4 h-4 ml-auto', item.active ? 'text-white/70' : 'text-white/30')} />}
          </button>
        ))}
      </div>
    ),
    codeSnippet: `import {
  Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarProvider, useSidebar,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sportsCategories.map((sport) => (
              <SidebarMenuItem key={sport.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      isActive={activeSport === sport.label}
                      onClick={() => handleSportClick(sport.label)}
                      className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium"
                      style={isActive ? {
                        backgroundColor: 'var(--ds-primary, #ee3536)'
                      } : undefined}
                    >
                      <img src={sport.icon} alt={sport.label} className="w-5 h-5 object-contain" />
                      <span>{sport.label}</span>
                      <IconChevronRight className="w-4 h-4 ml-auto" />
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {sidebarState === 'collapsed' && (
                    <TooltipContent side="right">
                      <p>{sport.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`,
  },
  {
    id: 'dynamic-island',
    name: 'Dynamic Island',
    description: 'Floating bottom nav bar — search, favorites, betslip (with count badge), and chat. Auto-hides on scroll down, appears on scroll up. Portal-based for z-index safety.',
    category: 'components',
    tags: ['navigation', 'mobile', 'bottom-nav', 'floating', 'animation', 'framer-motion', 'portal'],
    filePath: 'components/dynamic-island.tsx',
    preview: (
      <div className="flex flex-col items-center gap-3">
        {/* Actual rendered appearance */}
        <div className="flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl" style={{ backgroundColor: 'rgba(45,45,45,0.6)' }}>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <IconSearch className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <IconHeart className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
            <IconTicket className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}>3</span>
          </button>
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
            <IconMessageCircle2 className="w-[18px] h-[18px] text-white/70" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#2d2d2d] animate-pulse" />
          </button>
        </div>
        <span className="text-[9px] text-white/20">Hides on scroll ↓ · Appears on scroll ↑</span>
      </div>
    ),
    codeSnippet: `import DynamicIsland from '@/components/dynamic-island'

// Props:
// - onSearchClick, onFavoriteClick, onBetslipClick, onChatClick
// - isSearchActive, isFavoriteActive, isChatActive
// - betCount: number
// - showBetslip, showChat, showSearch, showFavorites: boolean

<DynamicIsland
  showBetslip={true}
  betCount={3}
  onSearchClick={() => setSearchOpen(true)}
  onBetslipClick={() => setBetslipOpen(true)}
/>

// Features:
// • Auto-hides on scroll down, reappears on scroll up
// • Rendered via React Portal (#dynamic-island-portal)
// • Integrates with global chatStore and betslipStore
// • Spring-animated entrance/exit via framer-motion
// • Betslip badge count from global or local state`,
  },
  {
    id: 'chat-nav-toggle',
    name: 'Chat Nav Toggle',
    description: 'Header button that toggles the global chat panel. Shows a green online pulse dot when chat is closed, red tint when open.',
    category: 'atoms',
    tags: ['button', 'chat', 'toggle', 'header', 'indicator', 'pulse'],
    filePath: 'components/chat/chat-nav-toggle.tsx',
    preview: (
      <div className="flex items-center gap-4">
        {/* Closed state */}
        <div className="flex flex-col items-center gap-1.5">
          <button className="flex items-center justify-center rounded-small h-[32px] w-[32px] bg-white/5 hover:bg-white/10 border border-transparent transition-colors relative cursor-pointer">
            <IconMessageCircle2 className="w-4 h-4 text-white/70" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#2d2d2d] animate-pulse" />
          </button>
          <span className="text-[9px] text-white/30">Closed</span>
        </div>
        {/* Open state */}
        <div className="flex flex-col items-center gap-1.5">
          <button className="flex items-center justify-center rounded-small h-[32px] w-[32px] bg-[#ee3536]/20 border border-[#ee3536]/40 hover:bg-[#ee3536]/30 transition-colors cursor-pointer">
            <IconMessageCircle2 className="w-4 h-4 text-[#ee3536]" strokeWidth={2} />
          </button>
          <span className="text-[9px] text-white/30">Open</span>
        </div>
      </div>
    ),
    codeSnippet: `import ChatNavToggle from '@/components/chat/chat-nav-toggle'

// Sits in the main nav header next to DEPOSIT button.
// Toggles the global chat panel via useChatStore.
<ChatNavToggle />

// States:
// • Closed: bg-white/5, green pulse dot (online indicator)
// • Open: bg-[#ee3536]/20, red border, red icon
// Uses rounded-small (design token)`,
  },
  {
    id: 'chat-header',
    name: 'Chat Room Header',
    description: 'Segmented room toggle (Sports Chat / Casino Chat) with online user count, user list toggle, and close button.',
    category: 'components',
    tags: ['chat', 'header', 'segmented-control', 'toggle', 'room-switch'],
    filePath: 'components/chat/chat-header.tsx',
    preview: (
      <div className="w-full border-b border-white/10">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            {/* Segmented toggle — exact match to real component */}
            <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
              <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium bg-white/10 text-white transition-all duration-150">
                <IconBallFootball className="w-3.5 h-3.5" strokeWidth={1.8} />
                Sports Chat
              </button>
              <div className="w-px h-3.5 bg-white/10 flex-shrink-0" />
              <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium text-white/40 hover:text-white/60 transition-all duration-150">
                <IconDice className="w-3.5 h-3.5" strokeWidth={1.8} />
                Casino Chat
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              1.2K
            </span>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
              <IconUsers className="w-3.5 h-3.5 text-white/40" strokeWidth={1.8} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
              <IconX className="w-3.5 h-3.5 text-white/40" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import ChatHeader from '@/components/chat/chat-header'

// Used inside ChatPanel. Integrates with useChatStore for room switching.
<ChatHeader onClose={() => setIsOpen(false)} />

// Sub-components:
// • Segmented toggle: Sports Chat (IconBallFootball) / Casino Chat (IconDice)
// • Online user count with green dot indicator
// • User list toggle button (IconUsers)
// • Close button (IconX)`,
  },
  {
    id: 'chat-rain-banner',
    name: 'Chat Rain Banner',
    description: 'Animated rain event banner — appears above chat input with countdown, join button, participant count, and animated rain drops.',
    category: 'components',
    tags: ['chat', 'rain', 'banner', 'animation', 'countdown', 'social'],
    filePath: 'components/chat/chat-rain-banner.tsx',
    preview: (
      <div className="w-full max-w-[340px]">
        <div className="mx-2 rounded-xl overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 shadow-lg shadow-blue-500/10">
          <div className="relative px-3 py-2.5">
            {/* Rain drops decoration — matches real component */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 bg-blue-400/40 rounded-full"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    left: `${3 + i * 10}%`,
                    top: '-10px',
                    animation: `rain-drop ${0.8 + Math.random() * 0.6}s linear infinite`,
                    animationDelay: `${Math.random() * 1}s`,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5 relative z-10">
              <IconCloudRain className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-blue-300">💧 Rain Event!</div>
                <div className="text-[10px] text-blue-300/60">$50.00 · 0:42 remaining · 12 joined</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[10px] font-semibold shrink-0 hover:bg-blue-600 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import ChatRainBanner from '@/components/chat/chat-rain-banner'

// Sits above the chat input. Self-manages via useChatStore.
<ChatRainBanner />

// Features:
// • Spring-animated entrance/exit (framer-motion)
// • Live countdown timer
// • Join button (one-click)
// • Animated rain drop decoration
// • Auto-resets on new rain events
// • Gradient: from-blue-500/15 to-cyan-500/15`,
  },

  // ── VIP Components (Real Imports) ──────────────────────

  {
    id: 'streak-counter',
    name: 'Streak Counter',
    description: 'Weekly login streak tracker with animated day pills, fire emoji, share button, and claimable reward. Uses framer-motion.',
    category: 'components',
    tags: ['vip', 'gamification', 'streak', 'reward', 'animation', 'framer-motion'],
    filePath: 'components/vip/streak-counter.tsx',
    preview: (
      <div className="w-full max-w-[340px] mx-auto">
        <StreakCounter
          streakDays={25}
          completedDays={[0, 1, 2, 3]}
          currentDayIndex={4}
          canClaimReward={false}
          rewardAmount={10}
        />
      </div>
    ),
    codeSnippet: `import { StreakCounter } from '@/components/vip/streak-counter'

<StreakCounter
  streakDays={25}
  completedDays={[0, 1, 2, 3]}
  currentDayIndex={4}
  canClaimReward={false}
  rewardAmount={10}
  onClaimReward={() => console.log('Claimed!')}
  onShare={() => console.log('Shared!')}
/>

// Props:
// streakDays: number — total consecutive days
// completedDays: number[] — indices of completed days (0=Mon, 6=Sun)
// currentDayIndex: number — which day is "today"
// canClaimReward: boolean — shows claim button when all 7 days done
// rewardAmount: number — dollar amount for weekly reward`,
  },
  {
    id: 'reload-claim',
    name: 'Reload Claim',
    description: 'VIP reload bonus card with live countdown timer (days/hours/minutes/seconds), day tracker with check marks, and claim button.',
    category: 'components',
    tags: ['vip', 'reload', 'countdown', 'timer', 'reward', 'claim'],
    filePath: 'components/vip/reload-claim.tsx',
    preview: (
      <div className="w-full max-w-[380px] mx-auto">
        <ReloadClaim
          reloadAmount={25.00}
          totalDays={5}
          completedDays={2}
          expiresAt="02/28/2026, 8:00 PM ET"
        />
      </div>
    ),
    codeSnippet: `import { ReloadClaim } from '@/components/vip/reload-claim'

<ReloadClaim
  reloadAmount={25.00}
  totalDays={5}
  completedDays={2}
  expiresAt="02/28/2026, 8:00 PM ET"
  onClaim={() => console.log('Claimed!')}
/>

// Props:
// reloadAmount: number — dollar amount to claim
// totalDays: number — total days required
// completedDays: number — how many days completed
// expiresAt: string — expiration date string
// onClaim: () => void — callback on claim`,
  },
  {
    id: 'cash-drop-code',
    name: 'Cash Drop Code',
    description: 'Promo code entry card with input field, claim button, success state, and Telegram join CTA. Uses framer-motion for animated states.',
    category: 'components',
    tags: ['vip', 'cash-drop', 'code-entry', 'reward', 'telegram', 'promo'],
    filePath: 'components/vip/cash-drop-code.tsx',
    preview: (
      <div className="w-full max-w-[380px] mx-auto">
        <CashDropCode telegramUrl="https://t.me/betonline" />
      </div>
    ),
    codeSnippet: `import { CashDropCode } from '@/components/vip/cash-drop-code'

<CashDropCode
  onClaim={(code) => console.log('Code:', code)}
  telegramUrl="https://t.me/betonline"
/>

// Features:
// • Text input with uppercase transform
// • Claim Now button (disabled when empty, gold when ready)
// • Animated success state with checkmark
// • Terms & Conditions link
// • Telegram join CTA card with gradient border`,
  },
  {
    id: 'bet-and-get',
    name: 'Bet & Get Missions',
    description: 'Mission-style reward cards with banner skeletons, progress bars, claim buttons, sub-tab filter (All / In Progress), and animated sorting.',
    category: 'blocks',
    tags: ['vip', 'missions', 'rewards', 'progress', 'gamification', 'framer-motion'],
    filePath: 'components/vip/bet-and-get.tsx',
    preview: (
      <div className="w-full max-w-[420px] mx-auto">
        <BetAndGet />
      </div>
    ),
    codeSnippet: `import { BetAndGet } from '@/components/vip/bet-and-get'

<BetAndGet />

// Self-contained component with built-in mission data.
// Mission states: not_started, in_progress, completed
// Each card shows:
// • Banner skeleton with shimmer animation
// • Title + description
// • Task with progress icon (IconCircleCheck)
// • Animated progress bar (gold, framer-motion)
// • Claim button (red when claimable, grey when locked)
// • Terms & Conditions link
// Sub-tabs: "All" / "In Progress" with animated underline indicator`,
  },

  // ── Animated Pill Tabs (Sub Nav) ────────────────────────

  {
    id: 'animate-tabs',
    name: 'Animated Pill Tabs',
    description: 'Radix-based tab bar with spring-animated pill indicator that slides between tabs. Brand-themed active background. Used across Sports, Casino, Promos, My Bonus, and more.',
    category: 'components',
    tags: ['tabs', 'sub-nav', 'navigation', 'animated', 'pill', 'spring', 'framer-motion', 'radix'],
    filePath: 'components/animate-ui/components/base/tabs.tsx',
    preview: (
      <AnimatedPillTabsPreview />
    ),
    codeSnippet: `import {
  Tabs as AnimateTabs,
  TabsList as AnimateTabsList,
  TabsTab,
} from '@/components/animate-ui/components/base/tabs'
import { motion } from 'framer-motion'

const [active, setActive] = useState('For You')
const tabs = ['For You', 'Slots', 'Bonus Buys', 'Megaways', 'Originals', 'Live']

<AnimateTabs value={active} onValueChange={setActive} className="w-full">
  <AnimateTabsList className="bg-white/5 p-0.5 h-auto gap-1 rounded-3xl border-0 relative">
    {tabs.map((tab) => (
      <TabsTab
        key={tab}
        value={tab}
        className="relative z-10 text-white/70 hover:text-white rounded-2xl px-4 py-1 h-9 text-xs font-medium data-[state=active]:text-white"
      >
        {active === tab && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-2xl -z-10"
            style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          />
        )}
        <span className="relative z-10">{tab}</span>
      </TabsTab>
    ))}
  </AnimateTabsList>
</AnimateTabs>

// Features:
// • Spring-animated pill (layoutId) slides between active tabs
// • Brand-themed: uses var(--ds-primary) for pill color
// • Rounded pill style (rounded-3xl container, rounded-2xl pills)
// • Works with Radix Tabs — keyboard-accessible
// • Used everywhere: page sub-nav, promos, bonus, race tabs`,
  },

  // ── Betslip ────────────────────────────────────────────

  {
    id: 'number-pad',
    name: 'Betslip Number Pad',
    description: 'iOS-style mobile number pad with quick-amount buttons ($5-$100). Uses onTouchEnd to prevent focus stealing. Light glass background.',
    category: 'components',
    tags: ['number-pad', 'mobile', 'input', 'touch', 'betslip', 'ios-style'],
    filePath: 'components/betslip/number-pad.tsx',
    preview: (
      <div className="w-full max-w-[300px] mx-auto rounded-lg overflow-hidden">
        <BetslipNumberPad
          onDigit={() => {}}
          onBackspace={() => {}}
          onDone={() => {}}
          onQuickAmount={() => {}}
        />
      </div>
    ),
    codeSnippet: `import { BetslipNumberPad } from '@/components/betslip/number-pad'

<BetslipNumberPad
  onDigit={(digit) => appendDigit(digit)}
  onBackspace={() => deleteLastDigit()}
  onDone={() => closeKeyboard()}
  onQuickAmount={(amount) => setStake(amount)}
/>

// Quick amounts: $5, $10, $25, $50, $100
// Uses onTouchEnd (not onClick) to prevent focus-stealing on mobile
// Glass background: rgba(255,255,255,0.78) + backdrop-blur-40px
// Prevents drag events from propagating (data-vaul-no-drag)`,
  },
  {
    id: 'betslip',
    name: 'Global Betslip',
    description: 'Family Drawer-based betslip with multi-bet support, parlay builder, custom number pad, and animated confirmation. White-themed card with glassmorphism header.',
    category: 'blocks',
    tags: ['betslip', 'drawer', 'family-drawer', 'betting', 'parlay', 'mobile'],
    filePath: 'components/betslip/global-betslip.tsx',
    preview: (
      <div className="w-full max-w-[320px] mx-auto rounded-xl border border-black/10 overflow-hidden bg-white shadow-lg">
        {/* Glassmorphism header — matches actual betslip */}
        <div className="px-3 py-2.5 flex items-center justify-between border-b border-black/5" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'saturate(180%) blur(20px)' }}>
          <div className="flex items-center gap-2">
            <div className="bg-[#424242] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-md">
              <span className="text-xs font-semibold text-white leading-none">2</span>
            </div>
            <h2 className="text-sm font-semibold text-black/90">Betslip</h2>
          </div>
          <button className="text-[10px] font-semibold uppercase tracking-wide text-black/60 flex items-center gap-1 px-2.5 py-1 rounded-md border border-black/20">
            <IconChevronDown className="w-3 h-3" /> MINIMIZE
          </button>
        </div>
        {/* Selections header */}
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] font-medium text-black/50 uppercase tracking-wide">2 Selections</div>
            <button className="text-[10px] font-medium text-red-400 uppercase tracking-wide px-2 py-0.5 rounded border border-red-200 inline-flex items-center gap-1">
              <IconTrash size={12} /> Remove All
            </button>
          </div>
          {/* Bet card 1 */}
          <div className="flex items-start gap-2.5 py-2.5 px-2.5 bg-[#f5f5f5] rounded-lg border border-black/[0.04] mb-1.5">
            <button className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center">
              <IconX className="w-3 h-3 text-black/50" strokeWidth={2.5} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">Liverpool ML</div>
              <div className="text-[10px] text-black/50 mb-0.5 leading-tight">Money Line</div>
              <div className="text-[10px] text-black/40 truncate leading-tight">Liverpool vs Arsenal</div>
            </div>
            <div className="flex-shrink-0 bg-black/[0.06] rounded-md px-2 py-1">
              <span className="text-[11px] font-semibold text-black/80 whitespace-nowrap">-150</span>
            </div>
            <div className="flex-shrink-0 w-[80px]">
              <div className="border border-black/10 rounded-lg h-[34px] flex items-center justify-end px-2 relative bg-white">
                <span className="absolute left-2 text-xs text-black/50">$</span>
                <span className="text-black font-medium text-sm pl-4 text-right">5.00</span>
              </div>
              <div className="text-[9px] text-black/50 text-right mt-0.5">To Win $3.33</div>
            </div>
          </div>
          {/* Bet card 2 */}
          <div className="flex items-start gap-2.5 py-2.5 px-2.5 bg-[#f5f5f5] rounded-lg border border-black/[0.04] mb-1.5">
            <button className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center">
              <IconX className="w-3 h-3 text-black/50" strokeWidth={2.5} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-black mb-0.5 truncate leading-tight">Over 2.5 Goals</div>
              <div className="text-[10px] text-black/50 mb-0.5 leading-tight">Total Goals</div>
              <div className="text-[10px] text-black/40 truncate leading-tight">Liverpool vs Arsenal</div>
            </div>
            <div className="flex-shrink-0 bg-black/[0.06] rounded-md px-2 py-1">
              <span className="text-[11px] font-semibold text-black/80 whitespace-nowrap">+120</span>
            </div>
            <div className="flex-shrink-0 w-[80px]">
              <div className="border border-black/10 rounded-lg h-[34px] flex items-center justify-end px-2 relative bg-white">
                <span className="absolute left-2 text-xs text-black/50">$</span>
                <span className="text-black font-medium text-sm pl-4 text-right">5.00</span>
              </div>
              <div className="text-[9px] text-black/50 text-right mt-0.5">To Win $6.00</div>
            </div>
          </div>
        </div>
        {/* Footer with total + Place Bet */}
        <div className="px-2 pb-2.5">
          <div className="flex items-center justify-between px-2 py-2 text-[11px]">
            <span className="text-black/50">Total Stake</span>
            <span className="text-black font-semibold">$10.00</span>
          </div>
          <div className="flex items-center justify-between px-2 pb-2 text-[11px]">
            <span className="text-black/50">Potential Win</span>
            <span className="font-semibold" style={{ color: '#8BC34A' }}>$9.33</span>
          </div>
          <button className="w-full py-3 rounded-lg text-white text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: '#8BC34A' }}>
            Place $10.00 Bet
          </button>
        </div>
      </div>
    ),
    codeSnippet: `import GlobalBetslip from '@/components/betslip/global-betslip'
import { BetslipNumberPad } from '@/components/betslip/number-pad'

// Mounted at layout level — available on all pages.
// Uses Family Drawer pattern with animated view transitions.
<GlobalBetslip />

// Features:
// • Multi-bet (single + parlay) support
// • Custom mobile number pad (BetslipNumberPad)
// • Animated confirmation view
// • Integrated with global betslipStore (Zustand)
// • Auto-hides on sports pages (sports has local betslip)
// • Listens for bet:copy-to-slip events from chat
// • Green accent for "Place Bet" CTA: var(--ds-accent-green)`,
  },

  // ── Chat Panel ─────────────────────────────────────────

  {
    id: 'chat-panel',
    name: 'Chat Panel',
    description: 'Full-featured chat with desktop (fixed side panel, 340px) and mobile (slide-up drawer with drag-to-dismiss). Includes messages, rain banner, user profiles, tip modal.',
    category: 'blocks',
    tags: ['chat', 'panel', 'drawer', 'desktop', 'mobile', 'messages', 'social', 'portal'],
    filePath: 'components/chat/chat-panel.tsx',
    preview: (
      <div className="w-full max-w-[340px] mx-auto rounded-lg border border-white/10 overflow-hidden" style={{ backgroundColor: 'var(--ds-page-bg, #1a1a1a)' }}>
        {/* Header — matches ChatHeader exactly */}
        <div className="flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden">
                <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium bg-white/10 text-white">
                  <IconBallFootball className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Sports Chat
                </button>
                <div className="w-px h-3.5 bg-white/10" />
                <button className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-medium text-white/40">
                  <IconDice className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Casino Chat
                </button>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 1.2K
            </span>
          </div>
        </div>
        {/* Messages */}
        <div className="p-3 space-y-2.5 max-h-[200px] overflow-y-auto">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">J</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-400 font-semibold">Jake92</span>
                <span className="text-[8px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">VIP</span>
              </div>
              <p className="text-[11px] text-white/60 mt-0.5">Big win on the parlay! 🎉</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">S</div>
            <div>
              <span className="text-[10px] text-purple-400 font-semibold">Sarah_VIP</span>
              <p className="text-[11px] text-white/60 mt-0.5">Anyone watching the Liverpool game?</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">M</div>
            <div>
              <span className="text-[10px] text-blue-400 font-semibold">Mike_Bets</span>
              <p className="text-[11px] text-white/60 mt-0.5">Just hit a 5-leg parlay 💰💰</p>
            </div>
          </div>
        </div>
        {/* Input */}
        <div className="px-3 py-2 border-t border-white/10">
          <div className="h-8 rounded-lg bg-white/5 border border-white/10 flex items-center px-3">
            <span className="text-[11px] text-white/30">Type a message...</span>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import ChatPanel from '@/components/chat/chat-panel'

// Auto-detects desktop (side panel) vs mobile (slide-up drawer).
// Rendered via GlobalChatWrapper for portal-based positioning.
<ChatPanel />

// Sub-components:
// • ChatHeader — room toggle + online count
// • ChatMessage — individual messages with user badges (VIP, MOD, etc.)
// • ChatInput — message input with emoji/GIF
// • ChatRainBanner — animated rain event join banner
// • ChatTipModal — user tipping overlay
// • ChatUserProfile — user profile drawer
// • ChatUserList — scrollable user directory

// Desktop: fixed right panel, 340px wide, full viewport height
// Mobile: slide-up drawer with drag-to-dismiss (framer-motion)`,
  },

  // ── Brand Switcher ─────────────────────────────────────

  {
    id: 'brand-switcher',
    name: 'Brand Switcher (Design Customizer)',
    description: 'Floating FAB that opens a popover with brand theme selection, product toggles per brand, JSON import, and "Our Library" CTA.',
    category: 'components',
    tags: ['brand', 'theme', 'switcher', 'customizer', 'design-tokens', 'fab', 'json-import'],
    filePath: 'components/design-customizer.tsx',
    preview: (
      <div className="flex items-center gap-4">
        {/* FAB */}
        <button className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl border border-white/20" style={{ backgroundColor: 'var(--ds-nav-bg, #1c1c1e)' }}>
          <IconPalette className="w-5 h-5 text-white/80" />
        </button>
        {/* Popover preview */}
        <div className="rounded-xl border border-white/10 p-3 w-52" style={{ backgroundColor: 'var(--ds-nav-bg, #1c1c1e)' }}>
          {[
            { name: 'BetOnline', color: '#ee3536', active: true },
            { name: 'Wild Casino', color: '#2faf16', active: false },
            { name: 'Super Slots', color: '#ffdf00', active: false },
          ].map((b) => (
            <div key={b.name} className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] transition-all',
              b.active ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5'
            )}>
              <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: b.color }} />
              {b.name}
              {b.active && <IconCheck className="w-3 h-3 ml-auto text-white/60" />}
            </div>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 space-y-1.5">
            <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 text-[10px] text-white/40 hover:bg-white/10 transition-colors">
              <IconUpload className="w-3 h-3" /> Upload JSON
            </button>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `import { DesignCustomizer, BRANDS } from '@/components/design-customizer'

// Mounted in layout.tsx — always available as floating FAB.
<DesignCustomizer />

// Brand tokens applied as CSS variables:
// --ds-primary, --ds-primary-hover, --ds-nav-bg,
// --ds-page-bg, --ds-sidebar-bg, --ds-card-bg,
// --ds-accent-green, --ds-primary-text

// JSON import format:
{
  "primary": "#ee3536",
  "primaryHover": "#dc2a2f",
  "navBg": "#2D2E2C",
  "pageBg": "#1a1a1a",
  "sidebarBg": "#2d2d2d",
  "cardBg": "#2d2d2d",
  "accentGreen": "#8ac500",
  "primaryTextBlack": false
}

// Features:
// • Brand list with live color preview dots
// • Per-brand product toggles (Sports, Casino, Poker, etc.)
// • JSON file upload to create custom brand tokens
// • "Our Library" CTA — navigates to /library
// • Persists selection to localStorage`,
  },

  // ── Backgrounds ────────────────────────────────────────

  {
    id: 'rain-background',
    name: 'Rain Background',
    description: 'Canvas-based animated rain with 3 depth layers, configurable intensity/angle/color, optional lightning flashes, fog, and vignette.',
    category: 'components',
    tags: ['background', 'animation', 'canvas', 'rain', 'effect', 'atmosphere', 'lightning'],
    filePath: 'components/rain-background.tsx',
    preview: (
      <div className="w-full rounded-lg overflow-hidden">
        <RainBackground
          className="h-40 w-full"
          count={100}
          intensity={1.2}
          angle={10}
          lightning={true}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-white/50 font-medium">Canvas rain with lightning</span>
          </div>
        </RainBackground>
      </div>
    ),
    codeSnippet: `import { RainBackground } from '@/components/rain-background'

<RainBackground
  count={150}        // base raindrop count
  intensity={1.2}    // rain intensity multiplier
  angle={5}          // degrees from vertical
  color="#ffffff"     // raindrop color
  lightning={true}    // enable lightning flashes
  className="h-screen w-full"
>
  {children}
</RainBackground>

// Features:
// • 3 depth layers (back, mid, front) with different speeds/opacity
// • ResizeObserver for responsive canvas
// • Lightning flashes on random intervals (3-8s)
// • Fog/mist gradient at bottom
// • Vignette radial overlay
// • Gradient background: #0c1018 → #1a1f2e → #151922`,
  },
  {
    id: 'interactive-grid',
    name: 'Interactive Grid Background',
    description: 'Canvas dot grid that highlights around the mouse cursor. Dots grow and change color based on proximity.',
    category: 'components',
    tags: ['background', 'canvas', 'interactive', 'grid', 'dots', 'hover', 'cursor'],
    filePath: 'components/interactive-grid-background.tsx',
    preview: (
      <div className="w-full rounded-lg overflow-hidden border border-white/10">
        <InteractiveGridBackground
          className="h-40 w-full"
          gridGap={30}
          dotSize={1.5}
          color="#737373"
          highlightColor="#FFFF00"
          radius={200}
        >
          <div className="flex items-center justify-center h-40">
            <span className="text-sm text-white/50 font-medium">Move cursor to highlight dots</span>
          </div>
        </InteractiveGridBackground>
      </div>
    ),
    codeSnippet: `import { InteractiveGridBackground } from '@/components/interactive-grid-background'

<InteractiveGridBackground
  gridGap={40}
  dotSize={1.5}
  color="#737373"       // base dot color
  highlightColor="#FFFF00" // highlight color near cursor
  radius={300}          // highlight radius in px
  className="h-screen w-full"
>
  {children}
</InteractiveGridBackground>

// Features:
// • Canvas-based rendering for performance
// • Dots grow and brighten near cursor
// • Color transitions from base → highlight color
// • Responsive via window resize listener
// • 30% base opacity for subtle background`,
  },

  // ── Sports Tracker ─────────────────────────────────────

  {
    id: 'sports-tracker-widget',
    name: 'Sports Tracker Widget',
    description: 'Draggable, dockable live sports tracker with STATSCORE integration. Multi-widget dock panel with animated reordering and resizable width.',
    category: 'blocks',
    tags: ['sports', 'tracker', 'widget', 'draggable', 'dockable', 'statscore', 'live', 'framer-motion'],
    filePath: 'components/sports-tracker-widget.tsx',
    preview: (
      <div className="flex items-center gap-4">
        {/* Floating widget */}
        <div className="w-64 rounded-lg border border-white/10 overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--ds-page-bg, #222222)' }}>
          <div className="px-3 py-2 flex items-center justify-between border-b border-white/10" style={{ background: 'color-mix(in srgb, var(--ds-page-bg, #222222) 85%, black)' }}>
            <div className="flex items-center gap-2">
              <IconGripVertical className="w-3 h-3 text-white/30 cursor-grab" />
              <span className="text-[10px] font-medium text-white/70">Liverpool vs Arsenal</span>
            </div>
            <div className="flex items-center gap-0.5">
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                <IconMinus className="w-3 h-3 text-white/40" />
              </button>
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                <IconMaximize className="w-3 h-3 text-white/40" />
              </button>
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
                <IconX className="w-3 h-3 text-white/40" />
              </button>
            </div>
          </div>
          <div className="p-4 flex items-center justify-center h-20">
            <div className="text-center">
              <div className="text-[10px] text-white/40 mb-1">Premier League · Live</div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white font-medium">LIV</span>
                <span className="text-xl font-bold text-white tabular-nums">2 - 1</span>
                <span className="text-[11px] text-white font-medium">ARS</span>
              </div>
              <div className="text-[9px] mt-1" style={{ color: 'var(--ds-accent-green, #8ac500)' }}>67&apos;</div>
            </div>
          </div>
        </div>
        {/* Dock indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-1.5 h-12 rounded-full bg-white/10 relative">
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-full" style={{ backgroundColor: 'var(--ds-primary, #ee3536)', opacity: 0.4 }} />
          </div>
          <span className="text-[8px] text-white/20 whitespace-nowrap">Drag → Dock</span>
        </div>
      </div>
    ),
    codeSnippet: `import { SportsTrackerWidget } from '@/components/sports-tracker-widget'
import { useWidgetDockStore } from '@/lib/store/widgetDockStore'

// Open a widget:
const { openWidget } = useWidgetDockStore()
openWidget({
  id: 12345,
  team1: 'Liverpool',
  team2: 'Arsenal',
  league: 'Premier League',
  country: 'England',
  isLive: true,
  statscoreEventId: 6188732,
  statscoreConfigId: '60dc694d4321eaff1879f0cf',
})

// Renders globally via WidgetDockManager (in GlobalChatWrapper).
// Features:
// • Draggable floating widgets (framer-motion drag)
// • Snap-to-dock with ghost preview (dashed outline)
// • Multi-widget dock panel (resizable width 220-500px)
// • Animated reordering via Reorder.Group
// • STATSCORE LivescorePro integration
// • Dock slides left of chat when chat is open
// • Zustand store: widgetDockStore`,
  },

  // ── Jackpot Overlay ────────────────────────────────────

  {
    id: 'jackpot-overlay',
    name: 'Jackpot Overlay',
    description: 'Full-screen jackpot celebration with gold rain (canvas), confetti burst, spinning odometer digits, and share-to-chat / close CTAs.',
    category: 'blocks',
    tags: ['casino', 'jackpot', 'overlay', 'confetti', 'animation', 'odometer', 'gold-rain'],
    filePath: 'components/casino/jackpot-overlay.tsx',
    preview: (
      <div className="w-full rounded-lg overflow-hidden border border-amber-500/20 relative" style={{ background: 'linear-gradient(to bottom, #1a0800, #0a0400)', height: '200px' }}>
        {/* Simulated gold particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-1.5 h-2 rounded-sm animate-pulse" style={{
              backgroundColor: ['#FFD700', '#FFA500', '#FFDF00', '#DAA520'][i % 4],
              left: `${8 + i * 8}%`,
              top: `${10 + Math.sin(i) * 30}%`,
              opacity: 0.3,
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center">
            <IconTrophy className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/40">Jackpot Winner</h2>
          <div className="text-3xl font-bold text-white tabular-nums">$250,000.00</div>
          <p className="text-[10px] text-white/40">Won on <span className="text-white/70 font-medium">Mega Fortune</span></p>
          <div className="flex items-center gap-2 mt-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-[10px] font-semibold">
              <IconShare className="w-3 h-3" /> Share to Chat
            </button>
            <button className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <IconX className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        </div>
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[200px] h-[200px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(238,53,54,0.05) 50%, transparent 70%)' }} />
        </div>
      </div>
    ),
    codeSnippet: `import { JackpotOverlay } from '@/components/casino/jackpot-overlay'

<JackpotOverlay
  visible={showJackpot}
  onClose={() => setShowJackpot(false)}
  onShareToChat={() => shareWinToChat()}
  gameName="Mega Fortune"
/>

// Animation sequence:
// Phase 1 (0.4s): Start digit spinning
// Phase 2 (0.6-1.8s): Scale up progressively
// Phase 3 (3.0s): Land digits + confetti burst
// Phase 4 (3.4s): Show Share/Close CTAs

// Features:
// • GoldRain — canvas particle animation
// • SpinDigit — odometer-style spinning columns
// • canvas-confetti — multi-burst celebration
// • Radial glow pulse on landing
// • Full-screen z-[99999] overlay`,
  },

  // ── Family Drawer ──────────────────────────────────────

  {
    id: 'account-drawer',
    name: 'Account Drawer',
    description: 'Right-side sliding drawer for user account details. White-themed with avatar, balance, and navigation menu. Swipe right to dismiss on mobile. Drag to interact.',
    category: 'components',
    tags: ['drawer', 'account', 'profile', 'slide', 'drag', 'mobile', 'vaul'],
    filePath: 'components/ui/drawer.tsx + app/page.tsx',
    preview: <AccountDrawerPreview />,
    codeSnippet: `import { Drawer, DrawerContent, DrawerHandle, DrawerHeader, DrawerClose } from '@/components/ui/drawer'

<Drawer
  open={accountDrawerOpen}
  onOpenChange={setAccountDrawerOpen}
  direction={isMobile ? "bottom" : "right"}
  shouldScaleBackground={false}
>
  <DrawerContent
    showOverlay={isMobile}
    className="w-full sm:max-w-md bg-white text-gray-900 flex flex-col border-l border-gray-200"
  >
    {isMobile && <DrawerHandle />}
    <DrawerHeader>
      <Avatar /> <span>Username</span>
    </DrawerHeader>
    {/* Balance, menu items, sign out */}
  </DrawerContent>
</Drawer>

// Features:
// • Mobile: slides up from bottom with drag handle
// • Desktop: slides in from right
// • Multi-view: account → notifications → settings
// • Uses vaul drawer primitives
// • White-themed for contrast with dark app`,
  },

  // ── Side Nav Drawer ──────────────────────────────────────

  {
    id: 'side-nav-drawer',
    name: 'Side Nav Drawer',
    description: 'Left-side mobile navigation drawer with sport categories. Uses vaul drawer with drag-to-dismiss. Brand-themed active states. Drag left to dismiss.',
    category: 'components',
    tags: ['drawer', 'sidebar', 'navigation', 'mobile', 'slide', 'drag', 'vaul', 'sports'],
    filePath: 'components/ui/sidebar.tsx',
    preview: <SideNavDrawerPreview />,
    codeSnippet: `import { Sidebar, SidebarContent, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { Drawer, DrawerContent } from '@/components/ui/drawer'

// On mobile, the Sidebar component automatically becomes a left-slide drawer:
<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarContent>
      {/* Sport categories with icons */}
      {sportsCategories.map((sport) => (
        <SidebarMenuButton
          isActive={activeSport === sport.label}
          style={isActive ? { backgroundColor: 'var(--ds-primary)' } : undefined}
        >
          <img src={sport.icon} />
          <span>{sport.label}</span>
        </SidebarMenuButton>
      ))}
    </SidebarContent>
  </Sidebar>
</SidebarProvider>

// Features:
// • Mobile: vaul drawer slides from left, drag to dismiss
// • Desktop: collapsible sidebar with tooltip icons
// • Brand-themed active states
// • Expandable sub-menus per sport
// • Shadow + backdrop for mobile overlay`,
  },

  // ── Family Drawer ────────────────────────────────────────

  {
    id: 'family-drawer',
    name: 'Family Drawer',
    description: 'Multi-view animated drawer system. Mobile uses vaul snap points, desktop uses panel mode. Views transition with shared layout animations. Try dragging the drawer down to dismiss.',
    category: 'components',
    tags: ['drawer', 'modal', 'mobile', 'vaul', 'animation', 'multi-view', 'drag'],
    filePath: 'components/ui/family-drawer.tsx',
    preview: <FamilyDrawerPreview />,
    codeSnippet: `import {
  FamilyDrawerRoot,
  FamilyDrawerContent,
  FamilyDrawerAnimatedWrapper,
  FamilyDrawerAnimatedContent,
  FamilyDrawerViewContent,
  useFamilyDrawer,
  type ViewsRegistry,
} from '@/components/ui/family-drawer'

// Register views:
const views: ViewsRegistry = {
  default: DefaultView,
  confirmation: ConfirmView,
}

// Usage:
<FamilyDrawerRoot views={views} open={isOpen}>
  <FamilyDrawerContent>
    <FamilyDrawerAnimatedWrapper>
      <FamilyDrawerAnimatedContent>
        <FamilyDrawerViewContent />
      </FamilyDrawerAnimatedContent>
    </FamilyDrawerAnimatedWrapper>
  </FamilyDrawerContent>
</FamilyDrawerRoot>

// Switch views inside any child:
const { switchView } = useFamilyDrawer()
switchView('confirmation')

// Features:
// • Auto-sizes to content
// • Shared layout animation between views
// • Mobile: vaul drawer with snap points
// • Desktop: centered panel/modal`,
  },
]

// ── Category Config ─────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All', icon: IconLayoutGrid },
  { id: 'atoms', label: 'Atoms', icon: IconBolt },
  { id: 'components', label: 'Components', icon: IconCode },
  { id: 'blocks', label: 'Blocks', icon: IconFilter },
] as const

// ── Page Component ──────────────────────────────────────
export default function LibraryPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = LIBRARY.filter((entry) => {
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
    const matchesSearch =
      !search ||
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Strip any lingering chat/dock padding from the library page
  useEffect(() => {
    const html = document.documentElement
    const hadChat = html.classList.contains('chat-open')
    const hadDock = html.classList.contains('dock-open')
    html.classList.remove('chat-open', 'dock-open')
    document.body.style.paddingRight = '0px'
    return () => {
      // Restore on leave if they were active
      if (hadChat) html.classList.add('chat-open')
      if (hadDock) html.classList.add('dock-open')
    }
  }, [])

  const atomCount = LIBRARY.filter((e) => e.category === 'atoms').length
  const componentCount = LIBRARY.filter((e) => e.category === 'components').length
  const blockCount = LIBRARY.filter((e) => e.category === 'blocks').length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ds-page-bg, #0a0a0a)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#0a0a0a]/80">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <IconArrowLeft className="w-5 h-5 text-white/60" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Our Library</h1>
              <p className="text-[11px] text-white/40">
                {LIBRARY.length} components · {atomCount} atoms · {componentCount} components · {blockCount} blocks
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                {cat.id !== 'all' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] ml-1">
                    {cat.id === 'atoms' ? atomCount : cat.id === 'components' ? componentCount : blockCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Results */}
        <LibraryErrorBoundary>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ComponentCard entry={entry} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-white/30 text-sm">No components match your search.</p>
            </div>
          )}
        </div>
        </LibraryErrorBoundary>
      </div>
    </div>
  )
}
