import { useId, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  description?: string
  error?: string
  label?: string
  wrapperClassName?: string
}

export function Input({
  className,
  description,
  error,
  id,
  label,
  name,
  wrapperClassName,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? (name ? `${name}-${generatedId}` : generatedId)
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className={cn('grid gap-2', wrapperClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-label-sm font-semibold text-text-primary">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        name={name}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-field border border-border bg-surface-primary px-4 py-3 text-sm text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
          className,
        )}
        {...props}
      />
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
