'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import confetti from 'canvas-confetti'
import { IconX } from '@tabler/icons-react'

// ─────────────────────────────────────────────────────────────────────────────
// Wheel configuration
// ─────────────────────────────────────────────────────────────────────────────

interface SpinPrize {
  /** Display label, e.g. "$50" */
  label: string
  /** Numeric value used for the win screen / claim payload */
  value: number
  /** Slice background color */
  color: string
  /** Probability weight — higher = more likely. Big prizes get small weights. */
  weight: number
}

// 8 slices, on-brand palette: betRed / charcoal / gold / betNavy alternating.
// Weights bias toward the smaller cash values so the big prizes feel rare.
const COLOR_RED = '#ee3536'      // betRed/500
const COLOR_BLACK = '#1a1a1a'    // near-charcoal (deep)
const COLOR_GOLD = '#f5b400'     // brand gold accent
const COLOR_NAVY = '#2d6f88'     // betNavy/500

const PRIZES: SpinPrize[] = [
  { label: '$5',     value: 5,     color: COLOR_RED,   weight: 28 },
  { label: '$50',    value: 50,    color: COLOR_GOLD,  weight: 14 },
  { label: '$10',    value: 10,    color: COLOR_NAVY,  weight: 24 },
  { label: '$250',   value: 250,   color: COLOR_BLACK, weight: 6  },
  { label: '$25',    value: 25,    color: COLOR_RED,   weight: 16 },
  { label: '$500',   value: 500,   color: COLOR_GOLD,  weight: 3  },
  { label: '$15',    value: 15,    color: COLOR_NAVY,  weight: 22 },
  { label: '$1,000', value: 1000,  color: COLOR_BLACK, weight: 1  },
]

const SEGMENT_COUNT = PRIZES.length
const SEGMENT_DEG = 360 / SEGMENT_COUNT
const WHEEL_RADIUS = 220
const WHEEL_INNER_RADIUS = 60

// Spin animation timing (kept here so the handler and the wheel SVG agree).
// Longer + heavily back-loaded ease so the wheel slows progressively and
// gently creeps to land on the winning slice.
const SPIN_DURATION_MS = 6800
const SPIN_BASE_TURNS = 8
const SPIN_EASE: [number, number, number, number] = [0.08, 0.55, 0.05, 1]

// Some slice colors are too dark to read as a confetti/halo accent (e.g.
// black). Map them to a visible "spotlight" version of the brand palette.
function accentFor(color: string): string {
  if (color === COLOR_BLACK) return COLOR_GOLD
  return color
}

function pickWeightedIndex(): number {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight
    if (r <= 0) return i
  }
  return PRIZES.length - 1
}

// SVG wedge path for a slice centered at angle = i * SEGMENT_DEG (top = 0deg).
function wedgePath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180
  const x1o = cx + rOuter * Math.cos(toRad(startDeg))
  const y1o = cy + rOuter * Math.sin(toRad(startDeg))
  const x2o = cx + rOuter * Math.cos(toRad(endDeg))
  const y2o = cy + rOuter * Math.sin(toRad(endDeg))
  const x1i = cx + rInner * Math.cos(toRad(startDeg))
  const y1i = cy + rInner * Math.sin(toRad(startDeg))
  const x2i = cx + rInner * Math.cos(toRad(endDeg))
  const y2i = cy + rInner * Math.sin(toRad(endDeg))
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1
  return [
    `M ${x1i} ${y1i}`,
    `L ${x1o} ${y1o}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x1i} ${y1i}`,
    'Z',
  ].join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated gold rain background (matches JackpotOverlay vibe)
// ─────────────────────────────────────────────────────────────────────────────

function GoldRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = 0
    const particles: Array<{
      x: number; y: number; size: number; speed: number
      opacity: number; rotation: number; rotSpeed: number
      wobble: number; wobbleSpeed: number; color: string
    }> = []
    const colors = ['#FFD700', '#FFA500', '#FFDF00', '#DAA520', '#FFB347', '#E8B923']

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.setTransform(2, 0, 0, 2, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight * -2,
        size: Math.random() * 4 + 1.5,
        speed: Math.random() * 1.6 + 0.8,
        opacity: Math.random() * 0.45 + 0.1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 3,
        wobble: Math.random() * 50,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let time = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      time += 1
      particles.forEach((p) => {
        ctx.save()
        const wobbleX = Math.sin(time * p.wobbleSpeed + p.wobble) * 25
        ctx.translate(p.x + wobbleX, p.y)
        ctx.rotate((p.rotation + time * p.rotSpeed) * (Math.PI / 180))
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
        p.y += p.speed
        if (p.y > canvas.offsetHeight + 20) {
          p.y = -20
          p.x = Math.random() * canvas.offsetWidth
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      // z-index: 0 so the canvas paints inside its parent's stacking context
      // but BELOW positioned siblings. The popup card wraps content in a
      // relative-positioned container with z-index 1, so this stays in the
      // background.
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Wheel (SVG)
// ─────────────────────────────────────────────────────────────────────────────

interface WheelProps {
  rotation: number
  spinning: boolean
  /** Whether to show the wobbling pointer at the top */
  showPointer?: boolean
}

function WheelSVG({ rotation, spinning, showPointer = true }: WheelProps) {
  // Animate the SVG `transform` ATTRIBUTE imperatively. SVG attribute
  // transforms pivot around (0,0) in user-space by default — exactly the
  // wheel's centre — so we sidestep the CSS `transform-box`/`transform-origin`
  // issues that prevented `motion.g` from rotating reliably across browsers.
  const wheelGroupRef = useRef<SVGGElement>(null)
  const currentRotationRef = useRef(0)

  useEffect(() => {
    const el = wheelGroupRef.current
    if (!el) return

    if (!spinning) {
      // Snap to 0 (or whatever the latest committed value is) on reset.
      el.setAttribute('transform', `rotate(${rotation})`)
      currentRotationRef.current = rotation
      return
    }

    const start = currentRotationRef.current
    const controls = animate(start, rotation, {
      duration: SPIN_DURATION_MS / 1000,
      ease: SPIN_EASE,
      onUpdate: (latest) => {
        el.setAttribute('transform', `rotate(${latest})`)
        currentRotationRef.current = latest
      },
    })

    return () => controls.stop()
  }, [rotation, spinning])

  const slices = useMemo(() => {
    return PRIZES.map((prize, i) => {
      const startDeg = i * SEGMENT_DEG - SEGMENT_DEG / 2
      const endDeg = i * SEGMENT_DEG + SEGMENT_DEG / 2
      return {
        prize,
        path: wedgePath(0, 0, WHEEL_RADIUS, WHEEL_INNER_RADIUS, startDeg, endDeg),
        labelAngle: i * SEGMENT_DEG,
      }
    })
  }, [])

  // Rim "LED" bulbs nestled inside the dark rim ring. Multi-colour palette —
  // each bulb is one of four hues so the rim feels like a fairy-light strip.
  const bulbs = useMemo(() => {
    const count = 24
    const palette = ['#FFD700', '#ee3536', '#ffffff', '#5cd0ff'] // gold / red / white / cyan
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 - Math.PI / 2
      const r = WHEEL_RADIUS + 17
      return {
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        i,
        color: palette[i % palette.length],
      }
    })
  }, [])

  // Total view radius (wheel + neon halo + bulbs + drop shadow)
  const VIEW = WHEEL_RADIUS + 48

  return (
    <svg
      viewBox={`-${VIEW} -${VIEW} ${VIEW * 2} ${VIEW * 2}`}
      className="block w-full h-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Flat dark rim — a single mostly-uniform colour with a soft
            inner/outer fade. Modern, no chiseled bevel or chrome highlights. */}
        <radialGradient
          id="rim3D"
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r={WHEEL_RADIUS + 28}
        >
          <stop offset={(WHEEL_RADIUS) / (WHEEL_RADIUS + 28)} stopColor="#0a0a0a" />
          <stop offset={(WHEEL_RADIUS + 4) / (WHEEL_RADIUS + 28)} stopColor="#1a1d22" />
          <stop offset={(WHEEL_RADIUS + 24) / (WHEEL_RADIUS + 28)} stopColor="#15181c" />
          <stop offset={1} stopColor="#000000" />
        </radialGradient>

        {/* Slice depth — radial vignette: darker near hub, slight highlight at
            the outer edge. Gives slices a 3D wedge feel without bevels. */}
        <radialGradient
          id="sliceDepth"
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r={WHEEL_RADIUS}
        >
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="92%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Soft glass dome — top-half highlight that does NOT rotate with the
            wheel. Subtle so it reads as ambient lighting, not a Y2K lens. */}
        <radialGradient id="domeHighlight" cx="50%" cy="6%" r="78%" fx="50%" fy="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="68%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </radialGradient>

        {/* Bulb glow filter */}
        <filter id="bulbGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Outer neon halo blur */}
        <filter id="neonBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

      </defs>

      {/* ─── Outer pulsing neon halo (BetOnline red) ─── */}
      <motion.circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS + 30}
        fill="none"
        stroke="#ee3536"
        strokeWidth={4}
        filter="url(#neonBlur)"
        animate={{ opacity: [0.55, 0.95, 0.55] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS + 36}
        fill="none"
        stroke="#FFD700"
        strokeWidth={2}
        filter="url(#neonBlur)"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      {/* ─── Flat dark rim ─── */}
      <circle cx={0} cy={0} r={WHEEL_RADIUS + 28} fill="url(#rim3D)" />
      {/* Subtle inner edge stroke so the slice circle reads cleanly */}
      <circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS + 1}
        fill="none"
        stroke="#000000"
        strokeWidth={1}
      />

      {/* ─── Multi-colour LED bulbs nestled in the dark rim ─── */}
      {bulbs.map((b) => {
        // Vary timing per-bulb for an organic chase pattern. Pairing duration
        // with begin offset gives the rim a "fairy-light" twinkle rather than
        // a uniform pulse.
        const dur = (0.9 + (b.i * 0.13) % 1.6).toFixed(2)
        const begin = ((b.i * 0.17) % 1.4).toFixed(2)
        return (
          <g key={b.i}>
            {/* Dark recessed socket */}
            <circle cx={b.x} cy={b.y} r={6.5} fill="#000000" />
            <circle
              cx={b.x}
              cy={b.y}
              r={6.5}
              fill="none"
              stroke="#3a3f49"
              strokeWidth={0.8}
            />
            {/* Glowing coloured bulb */}
            <circle
              cx={b.x}
              cy={b.y}
              r={4.4}
              fill={b.color}
              filter="url(#bulbGlow)"
            >
              <animate
                attributeName="opacity"
                values="0.15;1;0.15"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.5;1"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
              <animate
                attributeName="r"
                values="3.6;4.6;3.6"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Bright pin-prick highlight that twinkles in sync */}
            <circle cx={b.x - 1} cy={b.y - 1} r={1.4} fill="#ffffff">
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )
      })}

      {/* ─── Wheel body — rotates via SVG transform attribute (imperative) ─── */}
      <g ref={wheelGroupRef} transform={`rotate(${currentRotationRef.current})`}>
        {/* Slice fills */}
        {slices.map((s, i) => (
          <path
            key={`slice-${i}`}
            d={s.path}
            fill={s.prize.color}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1}
          />
        ))}

        {/* Per-slice depth shading (one shape over all slices) */}
        <circle cx={0} cy={0} r={WHEEL_RADIUS} fill="url(#sliceDepth)" pointerEvents="none" />

        {/* Slice dividers — dark steel, low contrast (slices speak for
            themselves, dividers just frame them) */}
        {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
          const a = (i * SEGMENT_DEG - SEGMENT_DEG / 2 - 90) * (Math.PI / 180)
          const x1 = Math.cos(a) * WHEEL_INNER_RADIUS
          const y1 = Math.sin(a) * WHEEL_INNER_RADIUS
          const x2 = Math.cos(a) * WHEEL_RADIUS
          const y2 = Math.sin(a) * WHEEL_RADIUS
          return (
            <line
              key={`spoke-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0f1216"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.85}
            />
          )
        })}

        {/* Labels */}
        {slices.map((s, i) => {
          const labelRadius = (WHEEL_RADIUS + WHEEL_INNER_RADIUS) / 2 + 14
          return (
            <g key={`label-${i}`} transform={`rotate(${s.labelAngle})`}>
              <text
                x={0}
                y={-labelRadius}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={s.prize.label.length > 4 ? 22 : 28}
                fontWeight={900}
                style={{
                  fontFamily: 'var(--font-figtree), sans-serif',
                  letterSpacing: '-0.02em',
                  paintOrder: 'stroke',
                  stroke: 'rgba(0,0,0,0.7)',
                  strokeWidth: 3.5,
                  strokeLinejoin: 'round',
                }}
              >
                {s.prize.label}
              </text>
            </g>
          )
        })}

        {/* Inner separator ring around the hub — dark frame */}
        <circle cx={0} cy={0} r={WHEEL_INNER_RADIUS + 5} fill="#000000" />
        <circle
          cx={0}
          cy={0}
          r={WHEEL_INNER_RADIUS + 5}
          fill="none"
          stroke="#3a3f49"
          strokeOpacity={0.9}
          strokeWidth={1.2}
        />
      </g>

      {/* ─── Soft glass dome highlight (does NOT rotate with the wheel) ─── */}
      <circle
        cx={0}
        cy={0}
        r={WHEEL_RADIUS}
        fill="url(#domeHighlight)"
        pointerEvents="none"
      />

      {/* ─── Center hub — flat dark disc behind the SPIN button ─── */}
      <circle cx={0} cy={0} r={WHEEL_INNER_RADIUS + 1} fill="#000000" />
      <circle cx={0} cy={0} r={WHEEL_INNER_RADIUS} fill="#1a1d22" />

      {/* ─── Pointer at the very top of the wheel ─── */}
      {showPointer && (
        <PointerSVG spinning={spinning} />
      )}
    </svg>
  )
}

// Pointer: gold map-pin shape with a circular hole. Sits with its tip well
// inside the slice band so it visibly marks the winning wedge. Bobs gently
// when idle and wobbles like a peg-tick pointer while the wheel is spinning.
function PointerSVG({ spinning }: { spinning: boolean }) {
  const R_HEAD = 22
  const POINT_Y = R_HEAD + 22 // tip extends 22 below the head centre
  const HOLE_R = 8
  // Drop the tip ~30 units inside the rim so the pin clearly overlaps the
  // slice band rather than perching on the edge.
  const tipTargetY = -(WHEEL_RADIUS - 30)
  const translateY = tipTargetY - POINT_Y

  return (
    <g transform={`translate(0 ${translateY})`}>
      {/* Idle bob — gentle vertical breathing when not spinning. */}
      <motion.g
        animate={spinning ? { y: 0 } : { y: [0, -4, 0] }}
        transition={
          spinning
            ? { duration: 0.25, ease: 'easeOut' }
            : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Wobble — kicked-by-pegs effect while spinning, pivots from the
            top of the head so the tip swings naturally. */}
        <motion.g
          animate={spinning ? { rotate: [0, -7, 0, -7, 0] } : { rotate: 0 }}
          transition={
            spinning
              ? { duration: 0.32, repeat: Infinity, ease: 'easeOut' }
              : { duration: 0.3, ease: 'easeOut' }
          }
          style={{ transformBox: 'fill-box', transformOrigin: 'center top' }}
        >
          {/* Map-pin shape: round head + tapered tip + circular hole.
              fillRule="evenodd" turns the inner sub-path into a real cutout. */}
          <path
            d={[
              `M 0 ${POINT_Y}`,
              `L ${-Math.cos(Math.PI / 6) * R_HEAD} ${Math.sin(Math.PI / 6) * R_HEAD}`,
              `A ${R_HEAD} ${R_HEAD} 0 1 1 ${Math.cos(Math.PI / 6) * R_HEAD} ${Math.sin(Math.PI / 6) * R_HEAD}`,
              `Z`,
              `M ${HOLE_R} 0`,
              `A ${HOLE_R} ${HOLE_R} 0 1 0 ${-HOLE_R} 0`,
              `A ${HOLE_R} ${HOLE_R} 0 1 0 ${HOLE_R} 0`,
              `Z`,
            ].join(' ')}
            fill="#FFD700"
            fillRule="evenodd"
            stroke="#9a6a00"
            strokeWidth={2}
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(255,200,0,0.45))' }}
          />
        </motion.g>
      </motion.g>
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Twinkling sparkle layer — only mounted on the win frame
// ─────────────────────────────────────────────────────────────────────────────

function SparkleOverlay({ active, accentColor }: { active: boolean; accentColor: string }) {
  // Generate sparkle positions/timings once; remount per-win is cheap enough
  // and we want fresh randomization on every win.
  const sparkles = useMemo(() => {
    if (!active) return []
    return Array.from({ length: 38 }, (_, i) => {
      const useAccent = Math.random() < 0.25
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 18,
        delay: Math.random() * 1.6,
        duration: 0.9 + Math.random() * 1.4,
        repeatDelay: Math.random() * 1.4,
        color: useAccent ? accentColor : Math.random() > 0.5 ? '#FFE38A' : '#ffffff',
      }
    })
  }, [active, accentColor])

  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: 'easeInOut',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={s.size}
            height={s.size}
            style={{ filter: `drop-shadow(0 0 8px ${s.color})` }}
          >
            {/* 4-point sparkle / glint */}
            <path
              d="M12 1.5 L13.5 10.5 L22.5 12 L13.5 13.5 L12 22.5 L10.5 13.5 L1.5 12 L10.5 10.5 Z"
              fill={s.color}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup
// ─────────────────────────────────────────────────────────────────────────────

interface DailySpinPopupProps {
  visible: boolean
  onClose: () => void
  /** Called with the prize once the user claims after a spin. */
  onClaim?: (prize: SpinPrize) => void
}

type Phase = 'idle' | 'spinning' | 'won'

export function DailySpinPopup({ visible, onClose, onClaim }: DailySpinPopupProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [rotation, setRotation] = useState(0)
  const [winningIndex, setWinningIndex] = useState<number | null>(null)
  const confettiFiredRef = useRef(false)

  // Reset everything when the popup is closed
  useEffect(() => {
    if (!visible) {
      setPhase('idle')
      setRotation(0)
      setWinningIndex(null)
      confettiFiredRef.current = false
    }
  }, [visible])

  const fireConfetti = useCallback((accentColor: string) => {
    if (confettiFiredRef.current) return
    confettiFiredRef.current = true

    // Mix the prize's slice color into the palette so the confetti feels
    // tied to what the user actually won.
    const colors = [
      '#FFD700',
      '#FFDF00',
      '#FACC15',
      '#FFA500',
      '#ffffff',
      accentColor,
      accentColor,
    ]

    // Star + sparkle emoji shapes alongside the standard square/circle for a
    // glittery, "magical" feel.
    // canvas-confetti's `shapeFromText` returns a Shape object that can be
    // mixed into the `shapes` array.
    let starShape: unknown = 'square'
    let sparkleShape: unknown = 'circle'
    try {
      starShape = (confetti as unknown as {
        shapeFromText: (opts: { text: string; scalar?: number }) => unknown
      }).shapeFromText({ text: '⭐', scalar: 2 })
      sparkleShape = (confetti as unknown as {
        shapeFromText: (opts: { text: string; scalar?: number }) => unknown
      }).shapeFromText({ text: '✨', scalar: 2 })
    } catch {
      // older versions — fall back to default shapes silently
    }
    const shapes = ['square', 'circle', starShape, sparkleShape] as never[]

    const defaults = {
      spread: 360,
      ticks: 160,
      zIndex: 100000,
      colors,
      shapes,
    }

    // Big initial center burst — the "WIN!" hit
    confetti({
      ...defaults,
      particleCount: 160,
      startVelocity: 50,
      scalar: 1.3,
      origin: { x: 0.5, y: 0.42 },
    })

    // Side cannons firing inward
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 70,
        angle: 60,
        startVelocity: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
      })
      confetti({
        ...defaults,
        particleCount: 70,
        angle: 120,
        startVelocity: 60,
        spread: 70,
        origin: { x: 1, y: 0.65 },
      })
    }, 200)

    // Slow, big star rain from above
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 60,
        startVelocity: 35,
        scalar: 1.7,
        gravity: 0.7,
        origin: { x: 0.5, y: 0.25 },
      })
    }, 500)

    // Wide sparkle wave
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 90,
        startVelocity: 32,
        scalar: 1.1,
        gravity: 0.55,
        origin: { x: 0.5, y: 0.45 },
      })
    }, 900)

    // Final accent-colored pop
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 80,
        startVelocity: 65,
        scalar: 1.4,
        colors: [accentColor, '#FFD700', '#ffffff'],
        origin: { x: 0.5, y: 0.5 },
      })
    }, 1400)

    // Lingering sparkle drift
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        startVelocity: 20,
        scalar: 1.6,
        gravity: 0.4,
        ticks: 220,
        origin: { x: 0.5, y: 0.3 },
      })
    }, 2100)
  }, [])

  const handleSpin = useCallback(() => {
    if (phase !== 'idle') return
    const winIdx = pickWeightedIndex()
    setWinningIndex(winIdx)
    // Rotate clockwise by N full turns + offset so segment `winIdx` ends up at
    // the top pointer. Segment center is at i * SEGMENT_DEG (top = 0). Rotation
    // is clockwise positive, so to bring segment i to the top we need
    // rotation ≡ -i*SEGMENT_DEG (mod 360). Add some randomness within the slice
    // (±30% of slice width) to feel non-deterministic.
    const slack = (Math.random() - 0.5) * SEGMENT_DEG * 0.6
    const target = SPIN_BASE_TURNS * 360 - winIdx * SEGMENT_DEG + slack
    setPhase('spinning')
    setRotation(target)

    // Fire the win effects shortly after the wheel finishes its slow creep.
    setTimeout(() => {
      setPhase('won')
      fireConfetti(accentFor(PRIZES[winIdx].color))
    }, SPIN_DURATION_MS + 120)
  }, [phase, fireConfetti])

  const winningPrize = winningIndex != null ? PRIZES[winningIndex] : null

  const handleClaim = useCallback(() => {
    if (winningPrize) onClaim?.(winningPrize)
    onClose()
  }, [winningPrize, onClaim, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
          role="dialog"
          aria-modal="true"
          aria-label="Daily spin"
        >
          {/* Backdrop — light translucent dim so the homepage stays visible
              behind the dialog. Click outside to close while idle. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 backdrop-blur-[2px]"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={phase === 'idle' ? onClose : undefined}
          />

          {/* ─── Card / dialog ─── */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 22 }}
            className="relative z-10 flex flex-col items-center w-[min(94vw,460px)] rounded-[28px] px-5 pt-7 pb-6 overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(28,18,18,0.96) 0%, rgba(14,10,10,0.97) 60%, rgba(8,8,10,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow:
                '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(238,53,54,0.18), 0 0 60px rgba(238,53,54,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold rain inside the card — clipped by the card's
                overflow-hidden + rounded corners. Sits behind all content. */}
            <GoldRain />

            {/* In-card win effects — flash + sparkles scoped to the card so
                they don't cover the page behind the dialog */}
            <AnimatePresence>
              {phase === 'won' && (
                <motion.div
                  key="win-flash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.85, 0, 0.4, 0] }}
                  transition={{ duration: 0.9, times: [0, 0.12, 0.3, 0.5, 1], ease: 'easeOut' }}
                  className="absolute inset-0 pointer-events-none bg-white rounded-[28px]"
                  style={{ zIndex: 30 }}
                />
              )}
            </AnimatePresence>
            <SparkleOverlay
              active={phase === 'won'}
              accentColor={winningPrize ? accentFor(winningPrize.color) : '#FFD700'}
            />

            {/* Close button — pinned to card */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center transition-all active:scale-95"
              style={{ zIndex: 40 }}
            >
              <IconX className="w-4 h-4" />
            </button>

            {/* Content stack — relative + positive z-index keeps it above
                the absolutely-positioned GoldRain canvas behind it */}
            <div className="relative w-full flex flex-col items-center pt-2" style={{ zIndex: 1 }}>
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-white text-3xl sm:text-4xl font-bold text-center tracking-tight"
              style={{ fontFamily: 'var(--font-figtree), sans-serif' }}
            >
              {phase === 'won' && winningPrize ? (
                <motion.span
                  className="inline-block"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: [0.6, 1.18, 1], opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  You won{' '}
                  <motion.span
                    className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 bg-clip-text text-transparent inline-block"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                  >
                    {winningPrize.label}
                  </motion.span>
                  !
                </motion.span>
              ) : (
                <>
                  Daily Spin For{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                    Cash
                  </span>
                </>
              )}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.4 }}
              className="text-white/55 text-sm text-center mt-2 mb-5"
            >
              {phase === 'won'
                ? 'Claim your reward — credited straight to your balance.'
                : 'One free spin every day. Tap the button to play.'}
            </motion.p>

            {/* Wheel — pointer is rendered inside the SVG so it stays
                pixel-perfect centred on the wheel at every viewport size. */}
            <div className="relative w-full aspect-square mx-auto" style={{ maxWidth: 360 }}>
              {/* Win halo — colored glow over the winning slice (top of wheel) */}
              <AnimatePresence>
                {phase === 'won' && winningPrize && (() => {
                  const haloColor = accentFor(winningPrize.color)
                  return (
                    <motion.div
                      key="win-halo"
                      className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                      style={{
                        top: '4%',
                        width: '42%',
                        aspectRatio: '1 / 1',
                        background: `radial-gradient(circle, ${haloColor}cc 0%, ${haloColor}55 35%, transparent 70%)`,
                        filter: 'blur(2px)',
                        zIndex: 2,
                      }}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: [0, 1, 0.7, 0.85], scale: [0.4, 1.4, 1, 1.1] }}
                      transition={{ duration: 1.4, ease: 'easeOut' }}
                    />
                  )
                })()}
              </AnimatePresence>

              {/* Wheel (pointer is baked in, fixed at top centre) */}
              <WheelSVG rotation={rotation} spinning={phase === 'spinning'} />

              {/* SPIN button — flat, modern, minimal styling */}
              <button
                type="button"
                onClick={handleSpin}
                disabled={phase !== 'idle'}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-label={phase === 'idle' ? 'Spin the wheel' : phase === 'spinning' ? 'Spinning…' : 'Spin complete'}
                style={{ width: '23%', aspectRatio: '1 / 1' }}
              >
                <motion.div
                  animate={phase === 'idle' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold tracking-[0.16em] uppercase select-none"
                  style={{
                    fontSize: 'clamp(11px, 2.4vw, 14px)',
                    background: '#ffffff',
                    color: '#0a0a0a',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
                    cursor: phase === 'idle' ? 'pointer' : 'default',
                    opacity: phase === 'spinning' ? 0.85 : 1,
                  }}
                >
                  SPIN
                </motion.div>
              </button>
            </div>

            {/* Footer status / claim — idle uses the in-wheel SPIN button, so
                we only render content while spinning or after a win. */}
            <div className="w-full mt-4 flex flex-col items-center gap-3 min-h-[2.5rem]">
              <AnimatePresence mode="wait">
                {phase === 'spinning' && (
                  <motion.div
                    key="cta-spinning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/50 text-sm tracking-wide"
                  >
                    Good luck…
                  </motion.div>
                )}
                {phase === 'won' && winningPrize && (
                  <motion.div
                    key="cta-won"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className="w-full flex flex-col items-center"
                  >
                    <button
                      type="button"
                      onClick={handleClaim}
                      className="w-full max-w-xs px-6 py-3 rounded-xl font-semibold text-[15px] tracking-tight transition-colors hover:bg-[rgba(238,53,54,0.08)] active:bg-[rgba(238,53,54,0.14)]"
                      style={{
                        background: 'transparent',
                        color: '#ee3536',
                        border: '1.5px solid #ee3536',
                      }}
                    >
                      Claim {winningPrize.label}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DailySpinPopup
