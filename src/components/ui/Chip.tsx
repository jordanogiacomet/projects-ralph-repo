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
        'group motion-transition motion-lift-subtle relative inline-flex items-center gap-2 overflow-hidden rounded-pill border px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15',
        active
          ? 'border-accent bg-accent text-white shadow-soft'
          : 'border-border bg-surface-primary text-text-primary shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:border-accent/24 hover:bg-accent-light/80 hover:text-accent hover:shadow-soft',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0',
          active ? 'opacity-100' : 'group-hover:opacity-100 group-focus-visible:opacity-100',
        )}
        style={{
          background:
            'linear-gradient(140deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(0,86,166,0.06) 100%)',
        }}
        aria-hidden
      />
      {icon ? <span className="relative" aria-hidden>{icon}</span> : null}
      <span className="relative">{children}</span>
      {count !== undefined ? (
        <span
          className={cn(
            'motion-transition relative inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-label-sm font-bold',
            active
              ? 'bg-white/18 text-white'
              : 'bg-surface-muted text-text-secondary group-hover:bg-white/70 group-hover:text-accent-strong group-focus-visible:bg-white/70 group-focus-visible:text-accent-strong',
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}
