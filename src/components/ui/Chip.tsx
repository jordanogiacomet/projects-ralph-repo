import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  count?: number | string
  icon?: ReactNode
}

export function Chip({
  active = false,
  children,
  className,
  count,
  icon,
  type = 'button',
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
        active
          ? 'border-accent bg-accent text-white shadow-soft'
          : 'border-border bg-surface-primary text-text-primary hover:border-accent/30 hover:bg-accent-light hover:text-accent',
        className,
      )}
      {...props}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span>{children}</span>
      {count !== undefined ? (
        <span
          className={cn(
            'inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold',
            active ? 'bg-white/18 text-white' : 'bg-surface-muted text-text-secondary',
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
