import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PublicFormStatusTone = 'error' | 'success' | 'warning'

type PublicFormStatusProps = {
  ariaLive?: 'assertive' | 'off' | 'polite'
  children?: ReactNode
  className?: string
  role?: 'alert' | 'status'
  title: string
  tone: PublicFormStatusTone
}

const toneClasses: Record<PublicFormStatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50/95 text-amber-900',
  error: 'border-red-200 bg-red-50/95 text-red-900',
}

const iconClasses: Record<PublicFormStatusTone, string> = {
  success:
    'border border-white/80 bg-white/82 text-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
  warning:
    'border border-white/80 bg-white/82 text-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
  error:
    'border border-white/80 bg-white/82 text-red-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
}

function StatusIcon({ tone }: { tone: PublicFormStatusTone }) {
  if (tone === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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

  if (tone === 'warning') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 8v5m0 3h.01M10.29 3.86l-7.5 13A1 1 0 003.67 18h16.66a1 1 0 00.88-1.5l-7.5-13a1 1 0 00-1.74 0z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 8v5m0 4h.01M10.34 3.94L2.68 17.2A1.5 1.5 0 003.98 19h16.04a1.5 1.5 0 001.3-1.8L13.66 3.94a1.5 1.5 0 00-2.6 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PublicFormStatus({
  ariaLive,
  children,
  className,
  role,
  title,
  tone,
}: PublicFormStatusProps) {
  const resolvedRole = role ?? (tone === 'error' ? 'alert' : 'status')
  const resolvedAriaLive = ariaLive ?? (resolvedRole === 'alert' ? 'assertive' : 'polite')

  return (
    <div
      className={cn('rounded-[1.2rem] border px-4 py-3 sm:px-5', toneClasses[tone], className)}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            iconClasses[tone],
          )}
        >
          <StatusIcon tone={tone} />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {children ? <p className="mt-1 text-sm leading-relaxed opacity-90">{children}</p> : null}
        </div>
      </div>
    </div>
  )
}
