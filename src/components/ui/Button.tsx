import Link from 'next/link'
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success'
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
  primary: 'bg-accent text-white shadow-soft hover:bg-accent-hover',
  secondary: 'border border-accent/10 bg-accent-light text-accent-strong hover:bg-highlight',
  outline: 'border border-border-strong bg-surface-primary text-text-primary hover:border-accent/30 hover:text-accent',
  ghost: 'bg-transparent text-text-primary hover:bg-accent-light hover:text-accent',
  success: 'bg-cta-green text-white shadow-soft hover:bg-cta-green-hover',
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
    'motion-transition motion-lift-subtle inline-flex items-center justify-center gap-2 rounded-button font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 disabled:pointer-events-none disabled:transform-none disabled:opacity-60',
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
