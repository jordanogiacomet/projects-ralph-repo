import type { ReactNode } from 'react'

import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

type PublicFormSummaryItem = {
  fallback: string
  label: string
  value?: null | string
}

type PublicFormSummaryProps = {
  children?: ReactNode
  className?: string
  footerDescription?: string
  footerTitle?: string
  items: PublicFormSummaryItem[]
  title: string
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PublicFormSummary({
  children,
  className,
  footerDescription,
  footerTitle,
  items,
  title,
}: PublicFormSummaryProps) {
  return (
    <Card className={cn('border-white/70 bg-white/92 shadow-soft', className)}>
      <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
        {title}
      </p>

      <dl className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              {item.label}
            </dt>
            <dd
              className={cn(
                'mt-1 text-sm leading-relaxed',
                item.value ? 'text-text-primary' : 'text-text-secondary',
              )}
            >
              {item.value || item.fallback}
            </dd>
          </div>
        ))}
      </dl>

      {children ? (
        <div className="mt-6 rounded-[1.25rem] border border-border/80 bg-surface-secondary/72 p-4">
          {children}
        </div>
      ) : null}

      {footerTitle && footerDescription ? (
        <div className="mt-6 rounded-[1.25rem] border border-accent/10 bg-accent-soft/55 p-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-accent-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
            >
              <CheckIcon />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{footerTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {footerDescription}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
