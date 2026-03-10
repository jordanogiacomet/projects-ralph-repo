import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

type SolutionItem = {
  id: string
  title: string
  description: string
  href: string
  iconUrl?: string
  categoryLabel?: string
}

type SolutionCardVariant = 'compact' | 'feature'

type SolutionCardProps = {
  item: SolutionItem
  index?: number
  variant?: SolutionCardVariant
}

const cardDensityClasses: Record<
  SolutionCardVariant,
  { card: string; content: string; title: string; body: string }
> = {
  compact: {
    card: 'rounded-panel',
    content: 'p-5 sm:p-6',
    title: 'mt-3 text-xl',
    body: 'mt-3 text-sm',
  },
  feature: {
    card: 'rounded-[1.6rem]',
    content: 'p-6 sm:p-7',
    title: 'mt-4 font-display text-heading-lg tracking-tight',
    body: 'mt-4 text-body-md',
  },
}

export function SolutionCard({ item, index, variant = 'feature' }: SolutionCardProps) {
  const density = cardDensityClasses[variant]
  const categoryLabel = item.categoryLabel || 'Solucao Apollo'
  const previewIndex = index !== undefined ? String(index + 1).padStart(2, '0') : undefined

  return (
    <Link
      href={item.href}
      aria-label={`Explorar a solucao ${item.title}`}
      className={cn(
        'group block h-full transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 focus-visible:ring-offset-4',
        density.card,
      )}
    >
      <Card
        as="article"
        padding="none"
        className={cn(
          'relative flex h-full overflow-hidden border border-border/80 bg-white transition duration-300 group-hover:border-accent/18 group-hover:shadow-[var(--shadow-medium)] group-focus-visible:border-accent/18 group-focus-visible:shadow-[var(--shadow-medium)]',
          density.card,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              'linear-gradient(145deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 42%, rgba(15,23,42,0.06) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden
        />

        <div className={cn('relative flex h-full flex-col', density.content)}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-pill border border-accent/12 bg-accent-soft/60 px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                  {categoryLabel}
                </span>
                {previewIndex ? (
                  <span className="rounded-pill border border-border bg-surface-secondary px-2.5 py-1 text-label-sm font-bold uppercase tracking-[0.16em] text-text-muted">
                    {previewIndex}
                  </span>
                ) : null}
              </div>

              <h3 className={cn('font-bold text-text-primary', density.title)}>{item.title}</h3>
            </div>

            {item.iconUrl ? (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-accent/10 bg-accent-soft/65 shadow-[0_14px_30px_rgba(0,86,166,0.12)]">
                <Image
                  src={item.iconUrl}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  sizes="40px"
                  className="h-10 w-10 rounded object-cover"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-accent/12 bg-accent-soft/75 text-accent-strong shadow-[0_14px_30px_rgba(0,86,166,0.12)]">
                <span aria-hidden className="font-display text-xl font-bold">
                  {item.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <p className={cn('flex-1 leading-relaxed text-text-secondary', density.body)}>
            {item.description}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/80 pt-5">
            <span className="rounded-pill border border-border bg-surface-secondary px-3 py-1.5 text-label-sm font-semibold text-text-secondary transition duration-300 group-hover:border-accent/12 group-hover:bg-accent-soft/55 group-hover:text-accent-strong group-focus-visible:border-accent/12 group-focus-visible:bg-accent-soft/55 group-focus-visible:text-accent-strong">
              Escopo tecnico
            </span>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition duration-200 group-hover:text-accent-hover group-focus-visible:text-accent-hover">
              Explorar solucao
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export type { SolutionItem, SolutionCardVariant }
