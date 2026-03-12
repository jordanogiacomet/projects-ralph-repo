import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type SectionHeadingAlign = 'center' | 'left'
type SectionHeadingSize = 'sm' | 'md' | 'lg'

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  align?: SectionHeadingAlign
  description?: string
  eyebrow?: string
  size?: SectionHeadingSize
  title: string
  titleClassName?: string
}

const titleSizes: Record<SectionHeadingSize, string> = {
  sm: 'text-heading-lg sm:text-heading-xl',
  md: 'text-heading-xl sm:text-heading-2xl',
  lg: 'text-display-sm sm:text-display-md',
}

export function SectionHeading({
  align = 'left',
  className,
  description,
  eyebrow,
  size = 'md',
  title,
  titleClassName,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'space-y-3',
        align === 'center' && 'mx-auto max-w-3xl text-center',
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn('font-display font-semibold text-display-balance', titleSizes[size], titleClassName)}>
        {title}
      </h2>
      {description ? (
        <p className={cn('max-w-2xl text-body-md text-text-secondary', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
