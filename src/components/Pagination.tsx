'use client'

import { Button } from '@/components/ui'

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
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={onLoadMore}
        className="rounded-pill border-accent text-accent hover:bg-accent hover:text-white"
      >
        Carregar mais
      </Button>
    </div>
  )
}
