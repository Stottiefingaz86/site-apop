'use client'

import { IconChevronDown } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type ReferralCodeFieldProps = {
  value: string
  onChange: (value: string) => void
  expanded: boolean
  onToggle: () => void
  inputClassName: string
}

export function ReferralCodeField({
  value,
  onChange,
  expanded,
  onToggle,
  inputClassName,
}: ReferralCodeFieldProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#2a2a2a]/90">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-medium text-white"
        aria-expanded={expanded}
      >
        <span>Referral Code (Optional)</span>
        <IconChevronDown
          className={cn('h-4 w-4 shrink-0 text-white/60 transition-transform', expanded && 'rotate-180')}
          aria-hidden
        />
      </button>
      {expanded ? (
        <div className="border-t border-white/10 px-3 pb-3 pt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter referral code"
            className={inputClassName}
            autoComplete="off"
            aria-label="Referral code (optional)"
          />
        </div>
      ) : null}
    </div>
  )
}
