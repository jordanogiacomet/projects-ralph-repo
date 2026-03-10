import { useId, type TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  description?: string
  error?: string
  label?: string
  labelClassName?: string
  wrapperClassName?: string
}

export function Textarea({
  className,
  description,
  error,
  id,
  label,
  labelClassName,
  name,
  wrapperClassName,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? (name ? `${name}-${generatedId}` : generatedId)
  const descriptionId = description ? `${textareaId}-description` : undefined
  const errorId = error ? `${textareaId}-error` : undefined

  return (
    <div className={cn('grid gap-2', wrapperClassName)}>
      {label ? (
        <label
          htmlFor={textareaId}
          className={cn('text-label-sm font-semibold text-text-primary', labelClassName)}
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        name={name}
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'motion-transition min-h-32 w-full resize-y rounded-field border border-border bg-surface-primary px-4 py-3 text-sm text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10',
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
