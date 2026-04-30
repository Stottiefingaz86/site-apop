'use client'

import React, { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconChevronDown, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface RedeemPromoCodeProps {
  /** Whether the row starts in the expanded state. */
  defaultOpen?: boolean
  /** Called when the user submits a code. Resolve to true on success, false on failure. */
  onRedeem?: (code: string) => Promise<boolean> | boolean
  className?: string
}

export function RedeemPromoCode({
  defaultOpen = false,
  onRedeem,
  className,
}: RedeemPromoCodeProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = code.trim()
      if (!trimmed) {
        setStatus('error')
        setErrorMessage('Enter a promo code first.')
        return
      }
      setSubmitting(true)
      setStatus('idle')
      setErrorMessage(null)
      try {
        const result = onRedeem ? await onRedeem(trimmed) : true
        if (result) {
          setStatus('success')
          setCode('')
          window.setTimeout(() => setStatus('idle'), 2400)
        } else {
          setStatus('error')
          setErrorMessage('That code is invalid or expired.')
        }
      } catch {
        setStatus('error')
        setErrorMessage('Something went wrong. Try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [code, onRedeem]
  )

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.04] transition-colors"
      >
        <span className="text-sm font-semibold text-white">Redeem a promo code</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40"
        >
          <IconChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="px-4 pb-4 pt-1 space-y-2">
              <div className="flex items-stretch gap-2">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    if (status !== 'idle') {
                      setStatus('idle')
                      setErrorMessage(null)
                    }
                  }}
                  placeholder="Enter code"
                  spellCheck={false}
                  autoCapitalize="characters"
                  className={cn(
                    'flex-1 h-10 px-3 rounded-md text-sm text-white placeholder:text-white/30',
                    'bg-white/[0.04] border focus:outline-none transition-colors',
                    status === 'error'
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-white/10 focus:border-white/25'
                  )}
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting || code.trim().length === 0}
                  style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                  className={cn(
                    'h-10 px-4 rounded-md text-xs font-bold uppercase tracking-wider',
                    'text-white hover:brightness-110 transition-[filter] duration-150',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100'
                  )}
                >
                  {submitting ? 'Redeeming…' : 'Redeem'}
                </button>
              </div>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-xs text-emerald-400"
                  >
                    <IconCheck className="w-3.5 h-3.5" />
                    Code redeemed successfully.
                  </motion.div>
                )}
                {status === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-red-400"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RedeemPromoCode
