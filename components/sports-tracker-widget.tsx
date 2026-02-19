'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconGripVertical, IconMinus, IconMaximize } from '@tabler/icons-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChatStore } from '@/lib/store/chatStore'

interface TrackerEvent {
  id: number
  team1: string
  team2: string
  league: string
  country: string
  score?: { team1: number; team2: number }
  minute?: string
  isLive?: boolean
  statscoreWidgetId?: string
  statscoreEventId?: number
}

interface SportsTrackerWidgetProps {
  event: TrackerEvent | null
  onClose: () => void
  sidebarWidth?: number
}

const CHAT_WIDTH = 340
const SUB_NAV_HEIGHT = 44
const HEADER_HEIGHT = 64
const SAFE_PADDING = 8
const SNAP_THRESHOLD = 80

const STATSCORE_WIDGET_LOADER_URL = 'https://wgt-s3-cdn.statscore.com/widget-loader/widget-loader.js'

function loadStatscoreWidgetLoader(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { reject(new Error('SSR')); return }
    const existing = document.getElementById('statscore-widget-loader')
    if (existing) { resolve(); return }
    const script = document.createElement('script')
    script.id = 'statscore-widget-loader'
    script.src = STATSCORE_WIDGET_LOADER_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load STATSCORE widget-loader'))
    document.head.appendChild(script)
  })
}

/** Set/clear CSS var so chat panel knows to offset its top */
function setTrackerAboveChatHeight(height: number | null) {
  if (height !== null && height > 0) {
    document.documentElement.style.setProperty('--tracker-above-chat-height', `${height}px`)
  } else {
    document.documentElement.style.removeProperty('--tracker-above-chat-height')
  }
}

/** Set/clear a flag so the chat panel can remove its top border when connected */
function setTrackerDockedFlag(docked: boolean) {
  if (docked) {
    document.documentElement.style.setProperty('--tracker-is-docked', '1')
  } else {
    document.documentElement.style.removeProperty('--tracker-is-docked')
  }
}

const DOCKED_MIN_HEIGHT = 120
const DOCKED_DEFAULT_HEIGHT = 360
const DOCKED_MAX_HEIGHT_RATIO = 0.65

export function SportsTrackerWidget({ event, onClose, sidebarWidth = 0 }: SportsTrackerWidgetProps) {
  const isMobile = useIsMobile()
  const isChatOpen = useChatStore((s) => s.isOpen)
  const containerRef = useRef<HTMLDivElement>(null)
  const statscoreContainerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number; offsetX: number; offsetY: number }>({
    isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0
  })

  const NORMAL_WIDTH = isMobile ? 340 : 420
  const WIDGET_HEIGHT_COLLAPSED = 52

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('Live')
  const [initialized, setInitialized] = useState(false)
  const [isDockedAboveChat, setIsDockedAboveChat] = useState(false)
  const [showSnapGhost, setShowSnapGhost] = useState(false)
  const [dockedHeight, setDockedHeight] = useState(DOCKED_DEFAULT_HEIGHT)
  const [statscoreStatus, setStatscoreStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')

  const resizeRef = useRef<{ isResizing: boolean; startY: number; startHeight: number }>({
    isResizing: false, startY: 0, startHeight: DOCKED_DEFAULT_HEIGHT
  })

  const WIDGET_WIDTH = isDockedAboveChat ? CHAT_WIDTH : NORMAL_WIDTH

  const getChatOffset = useCallback(() => {
    if (isMobile) return 0
    return isChatOpen ? CHAT_WIDTH : 0
  }, [isMobile, isChatOpen])

  // ── STATSCORE Widget Loader Integration ──
  useEffect(() => {
    if (!event?.statscoreWidgetId || !event?.statscoreEventId) return
    if (isMinimized) return
    const el = statscoreContainerRef.current
    if (!el) return
    let cancelled = false
    setStatscoreStatus('loading')
    const containerId = `statscore-lmp-${event.id}`
    el.id = containerId
    el.setAttribute('data-widget-id', event.statscoreWidgetId)
    el.setAttribute('data-event-id', String(event.statscoreEventId))
    el.setAttribute('data-lang', 'en')
    el.classList.add('statscore-widget')
    const initWidget = async () => {
      try {
        await loadStatscoreWidgetLoader()
        if (cancelled) return
        await new Promise(resolve => setTimeout(resolve, 500))
        if (!cancelled) {
          if (el.children.length > 0) {
            setStatscoreStatus('loaded')
          } else {
            window.dispatchEvent(new Event('load'))
            document.dispatchEvent(new Event('DOMContentLoaded'))
            await new Promise(resolve => setTimeout(resolve, 1000))
            if (!cancelled) {
              setStatscoreStatus(el.children.length > 0 ? 'loaded' : 'error')
            }
          }
        }
      } catch (err) {
        console.warn('STATSCORE widget-loader failed:', err)
        if (!cancelled) setStatscoreStatus('error')
      }
    }
    const timer = setTimeout(initWidget, 100)
    return () => {
      cancelled = true
      clearTimeout(timer)
      if (el) {
        el.innerHTML = ''
        el.removeAttribute('data-widget-id')
        el.removeAttribute('data-event-id')
        el.removeAttribute('data-lang')
        el.classList.remove('statscore-widget')
      }
    }
  }, [event?.statscoreWidgetId, event?.statscoreEventId, event?.id, isMinimized])

  useEffect(() => { if (!event) setStatscoreStatus('idle') }, [event])

  // Initialize position
  useEffect(() => {
    if (event && !initialized) {
      const effectiveSidebarWidth = isMobile ? 0 : sidebarWidth
      const chatOffset = getChatOffset()
      const x = Math.max(
        effectiveSidebarWidth + SAFE_PADDING,
        window.innerWidth - NORMAL_WIDTH - SAFE_PADDING - 20 - chatOffset
      )
      const y = HEADER_HEIGHT + SUB_NAV_HEIGHT + SAFE_PADDING + (isMobile ? 40 : 0)
      setPosition({ x, y })
      setInitialized(true)
    }
    if (!event) {
      setInitialized(false)
      setIsDockedAboveChat(false)
      setTrackerAboveChatHeight(null)
      setTrackerDockedFlag(false)
    }
  }, [event, initialized, isMobile, sidebarWidth, getChatOffset])

  // ── KEY FIX: Push chat down during ghost preview AND when docked ──
  // When the ghost is showing (during drag), proactively set the CSS var
  // so the chat shrinks in real-time. When docked, the ResizeObserver takes over.
  useEffect(() => {
    if (isDockedAboveChat) {
      // Docked: handled by ResizeObserver below
      return
    }
    if (showSnapGhost) {
      // Ghost preview: push chat down by the expected docked height
      setTrackerAboveChatHeight(dockedHeight)
    } else {
      // Neither ghost nor docked — clear
      setTrackerAboveChatHeight(null)
    }
  }, [showSnapGhost, isDockedAboveChat, dockedHeight])

  // Track widget height when docked above chat (ResizeObserver for accuracy)
  useEffect(() => {
    if (!isDockedAboveChat || !containerRef.current) {
      setTrackerDockedFlag(false)
      return
    }
    setTrackerDockedFlag(true)
    const el = containerRef.current
    const updateHeight = () => setTrackerAboveChatHeight(el.getBoundingClientRect().height)
    const ro = new ResizeObserver(updateHeight)
    ro.observe(el)
    updateHeight()
    return () => { ro.disconnect(); setTrackerDockedFlag(false) }
  }, [isDockedAboveChat, isMinimized, dockedHeight])

  // Un-dock when chat closes
  useEffect(() => {
    if (!isChatOpen && isDockedAboveChat) {
      setIsDockedAboveChat(false)
      setTrackerAboveChatHeight(null)
      setTrackerDockedFlag(false)
      setShowSnapGhost(false)
      setPosition(prev => ({
        x: Math.max(SAFE_PADDING, window.innerWidth - NORMAL_WIDTH - SAFE_PADDING - 20),
        y: prev.y
      }))
    }
  }, [isChatOpen, isDockedAboveChat])

  // Clean up on unmount
  useEffect(() => {
    return () => { setTrackerAboveChatHeight(null); setTrackerDockedFlag(false) }
  }, [])

  // Constrain position
  const constrainPosition = useCallback((x: number, y: number, shouldSnap = false): { x: number; y: number; snapped: boolean } => {
    const effectiveSidebarWidth = isMobile ? 0 : sidebarWidth
    const chatOffset = getChatOffset()
    const width = NORMAL_WIDTH
    const minX = effectiveSidebarWidth + SAFE_PADDING
    const minY = HEADER_HEIGHT + SAFE_PADDING
    const maxX = window.innerWidth - width - SAFE_PADDING - chatOffset
    const maxY = window.innerHeight - WIDGET_HEIGHT_COLLAPSED - SAFE_PADDING

    const newX = Math.max(minX, Math.min(maxX, x))
    const newY = Math.max(minY, Math.min(maxY, y))
    let snapped = false

    if (shouldSnap && isChatOpen && !isMobile) {
      const chatLeftEdge = window.innerWidth - CHAT_WIDTH
      const widgetRightEdge = newX + width
      if (widgetRightEdge >= chatLeftEdge - SNAP_THRESHOLD) {
        snapped = true
      }
    }

    return { x: newX, y: newY, snapped }
  }, [isMobile, sidebarWidth, NORMAL_WIDTH, getChatOffset, isChatOpen])

  // Mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = isDockedAboveChat ? (window.innerWidth - CHAT_WIDTH - NORMAL_WIDTH - SAFE_PADDING) : position.x
    const startY = isDockedAboveChat ? (HEADER_HEIGHT + SAFE_PADDING) : position.y
    if (isDockedAboveChat) {
      setIsDockedAboveChat(false)
      setTrackerDockedFlag(false)
      setPosition({ x: startX, y: startY })
    }
    dragRef.current = { isDragging: true, startX: e.clientX, startY: e.clientY, offsetX: startX, offsetY: startY }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return
      const result = constrainPosition(
        dragRef.current.offsetX + (e.clientX - dragRef.current.startX),
        dragRef.current.offsetY + (e.clientY - dragRef.current.startY),
        true
      )
      setPosition({ x: result.x, y: result.y })
      setShowSnapGhost(result.snapped)
    }
    const handleMouseUp = (e: MouseEvent) => {
      dragRef.current.isDragging = false
      const result = constrainPosition(
        dragRef.current.offsetX + (e.clientX - dragRef.current.startX),
        dragRef.current.offsetY + (e.clientY - dragRef.current.startY),
        true
      )
      if (result.snapped) {
        setIsDockedAboveChat(true)
      }
      setShowSnapGhost(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [position, constrainPosition, isDockedAboveChat, NORMAL_WIDTH])

  // Touch drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const startX = isDockedAboveChat ? (window.innerWidth - CHAT_WIDTH - NORMAL_WIDTH - SAFE_PADDING) : position.x
    const startY = isDockedAboveChat ? (HEADER_HEIGHT + SAFE_PADDING) : position.y
    if (isDockedAboveChat) {
      setIsDockedAboveChat(false)
      setTrackerDockedFlag(false)
      setPosition({ x: startX, y: startY })
    }
    dragRef.current = { isDragging: true, startX: touch.clientX, startY: touch.clientY, offsetX: startX, offsetY: startY }

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging) return
      e.preventDefault()
      const t = e.touches[0]
      const result = constrainPosition(
        dragRef.current.offsetX + (t.clientX - dragRef.current.startX),
        dragRef.current.offsetY + (t.clientY - dragRef.current.startY),
        true
      )
      setPosition({ x: result.x, y: result.y })
      setShowSnapGhost(result.snapped)
    }
    const handleTouchEnd = (e: TouchEvent) => {
      dragRef.current.isDragging = false
      const t = e.changedTouches[0]
      const result = constrainPosition(
        dragRef.current.offsetX + (t.clientX - dragRef.current.startX),
        dragRef.current.offsetY + (t.clientY - dragRef.current.startY),
        true
      )
      if (result.snapped) {
        setIsDockedAboveChat(true)
      }
      setShowSnapGhost(false)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }, [position, constrainPosition, isDockedAboveChat, NORMAL_WIDTH])

  // Resize handle for docked mode
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { isResizing: true, startY: e.clientY, startHeight: dockedHeight }
    const handleResizeMove = (e: MouseEvent) => {
      if (!resizeRef.current.isResizing) return
      const dy = e.clientY - resizeRef.current.startY
      const maxH = window.innerHeight * DOCKED_MAX_HEIGHT_RATIO
      setDockedHeight(Math.max(DOCKED_MIN_HEIGHT, Math.min(maxH, resizeRef.current.startHeight + dy)))
    }
    const handleResizeUp = () => {
      resizeRef.current.isResizing = false
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeUp)
    }
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeUp)
  }, [dockedHeight])

  const handleResizeTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    const touch = e.touches[0]
    resizeRef.current = { isResizing: true, startY: touch.clientY, startHeight: dockedHeight }
    const handleResizeMove = (e: TouchEvent) => {
      if (!resizeRef.current.isResizing) return
      e.preventDefault()
      const t = e.touches[0]
      const dy = t.clientY - resizeRef.current.startY
      const maxH = window.innerHeight * DOCKED_MAX_HEIGHT_RATIO
      setDockedHeight(Math.max(DOCKED_MIN_HEIGHT, Math.min(maxH, resizeRef.current.startHeight + dy)))
    }
    const handleResizeUp = () => {
      resizeRef.current.isResizing = false
      document.removeEventListener('touchmove', handleResizeMove)
      document.removeEventListener('touchend', handleResizeUp)
    }
    document.addEventListener('touchmove', handleResizeMove, { passive: false })
    document.addEventListener('touchend', handleResizeUp)
  }, [dockedHeight])

  // Update position when sidebar width changes
  useEffect(() => {
    if (event && initialized && !isDockedAboveChat) {
      setPosition(prev => {
        const result = constrainPosition(prev.x, prev.y)
        return { x: result.x, y: result.y }
      })
    }
  }, [sidebarWidth, constrainPosition, event, initialized, isDockedAboveChat])

  const tabs = ['Live', 'Lineups', 'H2H', 'Incidents', 'Stats', 'Standings']
  const hasStatscoreConfig = !!(event?.statscoreWidgetId && event?.statscoreEventId)

  if (!event) return null

  const widgetBg = 'var(--ds-page-bg, #222222)'
  const widgetBgDarker = 'color-mix(in srgb, var(--ds-page-bg, #222222) 85%, black)'

  // ── Z-index: when docked or ghost showing, must be ABOVE the chat (z-[200]) ──
  const widgetZIndex = isDockedAboveChat ? 'z-[201]' : 'z-[93]'
  const ghostZIndex = 'z-[201]' // ghost must be above chat too

  const dockedStyle: React.CSSProperties = isDockedAboveChat ? {
    right: 0,
    top: HEADER_HEIGHT,
    left: 'auto',
    width: CHAT_WIDTH,
    height: isMinimized ? WIDGET_HEIGHT_COLLAPSED : dockedHeight,
    maxHeight: isMinimized ? WIDGET_HEIGHT_COLLAPSED : dockedHeight,
    willChange: 'auto',
    borderRadius: '0px',
  } : {
    left: position.x,
    top: position.y,
    width: WIDGET_WIDTH,
    maxHeight: isMinimized ? WIDGET_HEIGHT_COLLAPSED : (isMobile ? '60vh' : '70vh'),
    willChange: 'transform',
  }

  // Content max-height when docked (subtract header + resize handle)
  const dockedContentMaxH = dockedHeight - WIDGET_HEIGHT_COLLAPSED - 12

  return (
    <>
      {/* ── Snap Ghost Preview — shows above chat when dragging near ── */}
      <AnimatePresence>
        {showSnapGhost && !isDockedAboveChat && isChatOpen && !isMobile && (
          <motion.div
            key="snap-ghost"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`fixed ${ghostZIndex} pointer-events-none`}
            style={{
              right: 0,
              top: HEADER_HEIGHT,
              width: CHAT_WIDTH,
              height: dockedHeight,
              border: '2px dashed rgba(255,255,255,0.3)',
              borderBottom: '2px dashed rgba(255,255,255,0.15)',
              borderRadius: '0px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2 opacity-70">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[11px] text-white/40 font-medium">Release to dock here</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Widget ── */}
      <AnimatePresence>
        {event && (
          <motion.div
            ref={containerRef}
            key="tracker-widget"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`fixed ${widgetZIndex} shadow-2xl shadow-black/50 overflow-hidden ${isDockedAboveChat ? 'border-l border-white/10' : 'rounded-lg'}`}
            style={dockedStyle}
          >
            {/* Drag Handle / Header */}
            <div
              className="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
              style={{ backgroundColor: widgetBg }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="flex items-center gap-2 min-w-0">
                <IconGripVertical className="w-4 h-4 text-white/30 flex-shrink-0" />
                <div className="flex items-center gap-1.5 min-w-0">
                  {event.isLive && (
                    <div className="flex items-center gap-1 bg-[#ee3536]/20 border border-[#ee3536]/50 rounded px-1 py-0.5">
                      <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                      <span className="text-[8px] font-bold text-[#ee3536] uppercase">Live</span>
                    </div>
                  )}
                  <span className="text-[11px] font-medium text-white truncate">
                    {event.team1} vs {event.team2}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }} className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  {isMinimized ? <IconMaximize className="w-3.5 h-3.5" /> : <IconMinus className="w-3.5 h-3.5" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onClose() }} className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors">
                  <IconX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content — hidden when minimized */}
            {!isMinimized && (
              <>
                {hasStatscoreConfig ? (
                  <div className="overflow-y-auto" style={{ backgroundColor: widgetBg, maxHeight: isDockedAboveChat ? dockedContentMaxH : (isMobile ? 'calc(60vh - 52px)' : 'calc(70vh - 52px)') }}>
                    <div
                      ref={statscoreContainerRef}
                      className="w-full statscore-widget"
                      style={{ minHeight: isMobile ? 280 : 380 }}
                    />
                    {statscoreStatus === 'loading' && (
                      <div className="absolute inset-0 top-[40px] flex flex-col items-center justify-center z-10" style={{ backgroundColor: widgetBg }}>
                        <div className="w-6 h-6 border-2 border-white/20 border-t-[#ee3536] rounded-full animate-spin mb-2" />
                        <span className="text-[10px] text-white/40">Loading STATSCORE tracker...</span>
                      </div>
                    )}
                    {statscoreStatus === 'error' && (
                      <div className="absolute inset-0 top-[40px] flex flex-col items-center justify-center z-10 px-4" style={{ backgroundColor: widgetBg }}>
                        <span className="text-[11px] text-white/50 mb-1 text-center">STATSCORE widget couldn&apos;t load</span>
                        <span className="text-[9px] text-white/30 mb-3 text-center">Ensure your domain is whitelisted and widget ID is valid</span>
                        <button onClick={() => setStatscoreStatus('idle')} className="text-[10px] text-[#ee3536] hover:text-[#ee3536]/80 underline">Retry</button>
                      </div>
                    )}
                    <div className="flex items-center justify-center py-1.5 border-t border-white/5" style={{ backgroundColor: widgetBg }}>
                      <span className="text-[8px] text-white/20 tracking-wider uppercase">Powered by STATSCORE</span>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-y-auto" style={{ backgroundColor: widgetBg, maxHeight: isDockedAboveChat ? dockedContentMaxH : (isMobile ? 'calc(60vh - 52px)' : 'calc(70vh - 52px)') }}>
                    {/* Competition Info */}
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5" style={{ backgroundColor: widgetBgDarker }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-3 rounded-sm bg-white/10 flex items-center justify-center">
                          <span className="text-[6px]">🏴</span>
                        </div>
                        <span className="text-[10px] text-white/60">{event.country}, {event.league}</span>
                      </div>
                      <span className="text-[10px] text-white/40">
                        {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Scoreboard */}
                    <div className="px-4 py-3" style={{ backgroundColor: widgetBg }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white/70">{event.team1.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <span className="text-sm font-medium text-white truncate">{event.team1}</span>
                        </div>
                        <div className="flex flex-col items-center mx-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white tabular-nums">{event.score?.team1 ?? 0}</span>
                            <span className="text-lg text-white/30">:</span>
                            <span className="text-2xl font-bold text-white tabular-nums">{event.score?.team2 ?? 0}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-[#ee3536] rounded-full animate-pulse" />
                            <span className="text-[10px] font-semibold text-[#ee3536]">{event.minute || "45'"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <span className="text-sm font-medium text-white truncate text-right">{event.team2}</span>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white/70">{event.team2.substring(0, 2).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#00ffa5] font-semibold">1</span>
                          <span className="text-[10px] text-white/40">⚽</span>
                          <span className="text-[10px] text-[#ff00ed] font-semibold">3</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#00ffa5] font-semibold">2</span>
                          <span className="text-[10px] text-white/40">🟨</span>
                          <span className="text-[10px] text-[#ff00ed] font-semibold">1</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#00ffa5] font-semibold">0</span>
                          <span className="text-[10px] text-white/40">🟥</span>
                          <span className="text-[10px] text-[#ff00ed] font-semibold">0</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="px-3 py-2" style={{ backgroundColor: widgetBgDarker }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#00ffa5]" />
                          <span className="text-[9px] text-white/50">{event.team1.substring(0, 3).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#ff00ed]" />
                          <span className="text-[9px] text-white/50">{event.team2.substring(0, 3).toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00ffa5]/30 to-[#00ffa5]/10 rounded-full" style={{ width: '50%' }} />
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white/60" style={{ left: '50%' }} />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[8px] text-white/30">0&apos;</span>
                        <span className="text-[8px] text-white/30">45&apos;</span>
                        <span className="text-[8px] text-white/30">90&apos;</span>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center border-b border-white/10 overflow-x-auto scrollbar-hide" style={{ backgroundColor: widgetBgDarker }}>
                      {tabs.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-2 text-[10px] font-medium whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-[#00ffa5]' : 'text-white/50 hover:text-white/70'}`}
                        >
                          {tab}
                          {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ffa5]" />}
                        </button>
                      ))}
                    </div>

                    {/* Live Pitch */}
                    {activeTab === 'Live' && (
                      <div className="relative bg-[#1a3a1a] overflow-hidden" style={{ height: isDockedAboveChat ? 120 : (isMobile ? 140 : 180) }}>
                        <svg viewBox="0 0 100 65" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                          <rect x="0" y="0" width="100" height="65" fill="#1a5c1a" />
                          <rect x="2" y="2" width="96" height="61" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <line x1="50" y1="2" x2="50" y2="63" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <circle cx="50" cy="32.5" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <circle cx="50" cy="32.5" r="0.8" fill="rgba(255,255,255,0.4)" />
                          <rect x="2" y="15" width="14" height="35" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <rect x="2" y="22" width="5" height="21" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <rect x="84" y="15" width="14" height="35" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <rect x="93" y="22" width="5" height="21" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                          <circle cx="62" cy="28" r="1.2" fill="white" opacity="0.9">
                            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <ellipse cx="60" cy="30" rx="12" ry="8" fill="rgba(255,0,237,0.08)" />
                          <ellipse cx="38" cy="35" rx="10" ry="7" fill="rgba(0,255,165,0.06)" />
                        </svg>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-[10px] font-semibold text-[#00ffa5]">45%</span>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                            <div className="bg-[#00ffa5]/60 h-full" style={{ width: '45%' }} />
                            <div className="bg-[#ff00ed]/60 h-full" style={{ width: '55%' }} />
                          </div>
                          <span className="text-[10px] font-semibold text-[#ff00ed]">55%</span>
                        </div>
                      </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'Stats' && (
                      <div className="px-3 py-2 space-y-2">
                        {[
                          { label: 'Ball Possession', home: 45, away: 55 },
                          { label: 'Shots on Target', home: 3, away: 7 },
                          { label: 'Shots', home: 8, away: 14 },
                          { label: 'Corners', home: 1, away: 3 },
                          { label: 'Fouls', home: 8, away: 6 },
                          { label: 'Offsides', home: 1, away: 2 },
                        ].map(stat => (
                          <div key={stat.label} className="space-y-0.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-semibold text-[#00ffa5] tabular-nums">{stat.home}{stat.label === 'Ball Possession' ? '%' : ''}</span>
                              <span className="text-[9px] text-white/50">{stat.label}</span>
                              <span className="text-[10px] font-semibold text-[#ff00ed] tabular-nums">{stat.away}{stat.label === 'Ball Possession' ? '%' : ''}</span>
                            </div>
                            <div className="flex gap-0.5 h-1">
                              <div className="flex-1 bg-white/5 rounded-full overflow-hidden flex justify-end">
                                <div className="bg-[#00ffa5]/50 h-full rounded-full" style={{ width: `${(stat.home / (stat.home + stat.away)) * 100}%` }} />
                              </div>
                              <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="bg-[#ff00ed]/50 h-full rounded-full" style={{ width: `${(stat.away / (stat.home + stat.away)) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Incidents Tab */}
                    {activeTab === 'Incidents' && (
                      <div className="px-3 py-2 space-y-1.5">
                        {[
                          { time: "12'", type: '⚽', player: 'Cunha', team: 'home' },
                          { time: "23'", type: '⚽', player: 'Saka', team: 'away' },
                          { time: "34'", type: '🟨', player: 'Lemina', team: 'home' },
                          { time: "41'", type: '⚽', player: 'Havertz', team: 'away' },
                          { time: "45'", type: '🟨', player: 'Strand Larsen', team: 'home' },
                          { time: "52'", type: '⚽', player: 'Neto', team: 'home' },
                          { time: "67'", type: '🟨', player: 'Rice', team: 'away' },
                        ].map((incident, i) => (
                          <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded ${incident.team === 'home' ? 'bg-[#00ffa5]/5' : 'bg-[#ff00ed]/5'}`}>
                            <span className="text-[10px] text-white/40 w-6 text-right tabular-nums">{incident.time}</span>
                            <span className="text-xs">{incident.type}</span>
                            <span className="text-[11px] text-white/80">{incident.player}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ml-auto ${incident.team === 'home' ? 'bg-[#00ffa5]' : 'bg-[#ff00ed]'}`} />
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'Lineups' && (
                      <div className="px-3 py-2"><div className="text-center text-[10px] text-white/40 py-4">Lineups will be available closer to kick-off</div></div>
                    )}

                    {activeTab === 'H2H' && (
                      <div className="px-3 py-2 space-y-1.5">
                        <p className="text-[10px] text-white/50 mb-2">Last 5 meetings</p>
                        {[
                          { date: '18/02/26', home: event.team1, away: event.team2, score: '2-2' },
                          { date: '04/11/25', home: event.team2, away: event.team1, score: '3-0' },
                          { date: '20/04/25', home: event.team1, away: event.team2, score: '0-1' },
                          { date: '02/12/24', home: event.team2, away: event.team1, score: '2-1' },
                          { date: '20/04/24', home: event.team1, away: event.team2, score: '2-0' },
                        ].map((match, i) => (
                          <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.02] rounded">
                            <span className="text-[9px] text-white/30 w-14">{match.date}</span>
                            <span className="text-[10px] text-white/70 flex-1 text-right truncate">{match.home}</span>
                            <span className="text-[10px] font-bold text-white px-2 bg-white/5 rounded">{match.score}</span>
                            <span className="text-[10px] text-white/70 flex-1 truncate">{match.away}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'Standings' && (
                      <div className="px-3 py-2"><div className="text-center text-[10px] text-white/40 py-4">Standings data loading...</div></div>
                    )}

                    <div className="flex items-center justify-center py-1.5 border-t border-white/5" style={{ backgroundColor: widgetBg }}>
                      <span className="text-[8px] text-white/20 tracking-wider uppercase">Powered by STATSCORE</span>
                    </div>
                  </div>
                )}

                {/* ── Resize handle when docked ── */}
                {isDockedAboveChat && (
                  <div
                    className="flex items-center justify-center cursor-row-resize select-none group border-t border-white/10 hover:border-white/20 transition-colors"
                    style={{ height: 12, backgroundColor: widgetBg }}
                    onMouseDown={handleResizeMouseDown}
                    onTouchStart={handleResizeTouchStart}
                  >
                    <div className="w-8 h-1 rounded-full bg-white/15 group-hover:bg-white/30 transition-colors" />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
