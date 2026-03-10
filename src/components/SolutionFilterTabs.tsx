'use client'

import { Chip } from '@/components/ui'

type SolutionFilter = {
  key: string
  label: string
  count: number
}

type SolutionFilterTabsProps = {
  filters: SolutionFilter[]
  activeFilter: string
  onChange: (key: string) => void
}

export function SolutionFilterTabs({ filters, activeFilter, onChange }: SolutionFilterTabsProps) {
  return (
    <div className="overflow-x-auto pb-2" role="toolbar" aria-label="Filtrar solucoes por frente">
      <div className="inline-flex min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <Chip
              key={filter.key}
              active={isActive}
              onClick={() => onChange(filter.key)}
              className={
                isActive
                  ? 'whitespace-nowrap px-4 py-2.5 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.1)]'
                  : 'whitespace-nowrap px-4 py-2.5 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.06)]'
              }
              count={filter.count}
              aria-pressed={isActive}
            >
              {filter.label}
            </Chip>
          )
        })}
      </div>
    </div>
  )
}

export type { SolutionFilter }
