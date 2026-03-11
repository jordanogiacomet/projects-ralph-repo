import Link from 'next/link'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'inverted'
type ButtonSize = 'sm' | 'md' | 'lg'

type CommonButtonProps = {
  children: ReactNode
  className?: string
  fullWidth?: boolean
  href?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
}

type ButtonProps = CommonButtonProps &
  (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>)

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-accent bg-accent text-white shadow-soft hover:border-accent-hover hover:bg-accent-hover hover:shadow-medium',
  secondary:
    'border border-accent/10 bg-accent-light text-accent-strong shadow-[0_12px_28px_rgba(0,86,166,0.08)] hover:border-accent/18 hover:bg-highlight hover:shadow-soft',
  outline:
    'border border-border-strong bg-surface-primary text-text-primary shadow-[0_12px_28px_rgba(15,23,42,0.04)] hover:border-accent/28 hover:bg-accent-soft/55 hover:text-accent',
  ghost:
    'border border-transparent bg-transparent text-text-primary hover:border-accent/10 hover:bg-accent-light/70 hover:text-accent',
  success:
    'border border-cta-green bg-cta-green text-white shadow-soft hover:border-cta-green-hover hover:bg-cta-green-hover hover:shadow-medium',
  inverted:
    'border border-white/12 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm hover:border-white/18 hover:bg-white/[0.12] hover:text-white',
}

const focusRingClasses: Record<ButtonVariant, string> = {
  primary: 'focus-visible:ring-accent/15',
  secondary: 'focus-visible:ring-accent/15',
  outline: 'focus-visible:ring-accent/15',
  ghost: 'focus-visible:ring-accent/15',
  success: 'focus-visible:ring-accent/15',
  inverted: 'focus-visible:ring-white/15',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-5 text-sm',
  lg: 'min-h-14 px-6 text-base',
}

export function Button({
  children,
  className,
  fullWidth = false,
  href,
  leadingIcon,
  trailingIcon,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const classes = cn(
    'motion-transition motion-lift-subtle inline-flex items-center justify-center gap-2 rounded-button font-semibold tracking-[0.01em] focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:transform-none disabled:opacity-60',
    focusRingClasses[variant],
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {leadingIcon ? <span aria-hidden>{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden>{trailingIcon}</span> : null}
    </>
  )

  if (href) {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement>

    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    )
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
