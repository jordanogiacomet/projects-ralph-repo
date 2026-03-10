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
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <Chip
              key={filter.key}
              active={isActive}
              onClick={() => onChange(filter.key)}
              className="whitespace-nowrap"
              count={filter.count}
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
