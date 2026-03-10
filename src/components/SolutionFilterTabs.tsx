'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'

type SolutionFilter = {
  key: string
  label: string
  count?: number
  href?: string
}

type SolutionFilterTabsProps = {
  filters: SolutionFilter[]
  activeFilter: string
  onChange?: (key: string) => void
  className?: string
  ariaLabel?: string
}

const railItemClassName =
  'group relative inline-flex min-h-[3.5rem] items-center gap-3 overflow-hidden rounded-[1.15rem] border px-4 py-3 text-left transition duration-200 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15'

function renderFilterContent(filter: SolutionFilter, isActive: boolean) {
  return (
    <>
      <span
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition duration-200',
          isActive ? 'opacity-100' : 'group-hover:opacity-100 group-focus-visible:opacity-100',
        )}
        style={{
          background:
            'linear-gradient(140deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 42%, rgba(15,23,42,0.04) 100%)',
        }}
        aria-hidden
      />
      <span className="relative flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            'h-2.5 w-2.5 shrink-0 rounded-full transition duration-200',
            isActive ? 'bg-accent' : 'bg-border group-hover:bg-accent/45 group-focus-visible:bg-accent/45',
          )}
          aria-hidden
        />
        <span className="min-w-0">
          <span
            className={cn(
              'block text-sm font-semibold',
              isActive
                ? 'text-text-primary'
                : 'text-text-secondary group-hover:text-text-primary group-focus-visible:text-text-primary',
            )}
          >
            {filter.label}
          </span>
        </span>
      </span>
      {filter.count !== undefined ? (
        <span
          className={cn(
            'relative inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-label-sm font-bold transition duration-200',
            isActive
              ? 'bg-accent text-white shadow-[0_10px_24px_rgba(0,86,166,0.18)]'
              : 'bg-surface-secondary text-text-muted group-hover:bg-accent-soft/70 group-hover:text-accent-strong group-focus-visible:bg-accent-soft/70 group-focus-visible:text-accent-strong',
          )}
        >
          {filter.count}
        </span>
      ) : null}
    </>
  )
}

export function SolutionFilterTabs({
  filters,
  activeFilter,
  ariaLabel = 'Filtrar solucoes por frente',
  className,
  onChange,
}: SolutionFilterTabsProps) {
  const isNavigationRail = filters.some((filter) => filter.href) && !onChange
  const Wrapper = isNavigationRail ? 'nav' : 'div'

  return (
    <Wrapper
      className={cn('overflow-x-auto pb-2', className)}
      role={isNavigationRail ? undefined : 'toolbar'}
      aria-label={ariaLabel}
    >
      <div className="inline-flex min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          const itemClassName = cn(
            railItemClassName,
            isActive
              ? 'border-accent/18 bg-white text-text-primary shadow-[var(--shadow-soft)]'
              : 'border-border/80 bg-surface-primary/95 text-text-secondary shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-accent/20 focus-visible:border-accent/20',
          )

          if (filter.href) {
            return (
              <Link
                key={filter.key}
                href={filter.href}
                aria-current={isActive ? 'page' : undefined}
                className={itemClassName}
              >
                {renderFilterContent(filter, isActive)}
              </Link>
            )
          }

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onChange?.(filter.key)}
              className={itemClassName}
              aria-pressed={isActive}
            >
              {renderFilterContent(filter, isActive)}
            </button>
          )
        })}
      </div>
    </Wrapper>
  )
}

export type { SolutionFilter }
