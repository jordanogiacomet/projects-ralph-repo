'use client'

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
            <button
              key={filter.key}
              type="button"
              onClick={() => onChange(filter.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-white text-text-primary hover:border-accent/40 hover:bg-accent-light'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          )
        })}
      </div>
    </div>
  )
}

export type { SolutionFilter }
