'use client'

type PaginationProps = {
  hasMore: boolean
  onLoadMore: () => void
}

export function Pagination({ hasMore, onLoadMore }: PaginationProps) {
  if (!hasMore) {
    return null
  }

  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        className="inline-flex items-center rounded-full border border-accent bg-white px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white"
      >
        Carregar mais
      </button>
    </div>
  )
}
