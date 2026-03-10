import { useId, type SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  description?: string
  error?: string
  label?: string
  wrapperClassName?: string
}

export function Select({
  children,
  className,
  description,
  error,
  id,
  label,
  name,
  wrapperClassName,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? (name ? `${name}-${generatedId}` : generatedId)
  const descriptionId = description ? `${selectId}-description` : undefined
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div className={cn('grid gap-2', wrapperClassName)}>
      {label ? (
        <label htmlFor={selectId} className="text-label-sm font-semibold text-text-primary">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full appearance-none rounded-field border border-border bg-surface-primary px-4 py-3 pr-10 text-sm text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 focus:border-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {description ? (
        <p id={descriptionId} className="text-meta-sm text-text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-meta-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
