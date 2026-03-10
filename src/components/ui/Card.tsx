import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type CardTone = 'default' | 'muted' | 'dark'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'
type CardTag = 'article' | 'aside' | 'div' | 'section'

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: CardTag
  interactive?: boolean
  padding?: CardPadding
  tone?: CardTone
}

const toneClasses: Record<CardTone, string> = {
  default: 'border border-border bg-surface-primary text-text-primary shadow-soft',
  muted: 'border border-border bg-surface-secondary text-text-primary shadow-soft',
  dark: 'border border-white/10 bg-bg-dark-elevated text-text-on-dark shadow-medium',
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-6 sm:p-8 lg:p-9',
}

export function Card({
  as = 'div',
  className,
  interactive = false,
  padding = 'md',
  tone = 'default',
  ...props
}: CardProps) {
  const Component = as as ElementType

  return (
    <Component
      className={cn(
        'rounded-panel',
        toneClasses[tone],
        paddingClasses[padding],
        interactive && 'motion-transition motion-lift-card hover:shadow-medium focus-within:shadow-medium',
        className,
      )}
      {...props}
    />
  )
}
