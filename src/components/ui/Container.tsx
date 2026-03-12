import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type ContainerSize = 'content' | 'reading' | 'wide' | 'full'
type ContainerTag = 'article' | 'div' | 'footer' | 'header' | 'main' | 'nav' | 'section'

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ContainerTag
  size?: ContainerSize
}

const sizeClasses: Record<ContainerSize, string> = {
  content: 'mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8',
  reading: 'mx-auto w-full max-w-reading px-4 sm:px-6',
  wide: 'mx-auto w-full max-w-wide px-4 sm:px-6 lg:px-8',
  full: 'w-full',
}

export function Container({
  as = 'div',
  className,
  size = 'content',
  ...props
}: ContainerProps) {
  const Component = as as ElementType

  return <Component className={cn(sizeClasses[size], className)} {...props} />
}
