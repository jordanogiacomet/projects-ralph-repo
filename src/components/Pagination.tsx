'use client'

import { Button } from '@/components/ui'

type PaginationProps = {
  hasMore: boolean
  onLoadMore: () => void
  itemLabel?: string
  remainingCount?: number
}

export function Pagination({
  hasMore,
  itemLabel = 'itens',
  onLoadMore,
  remainingCount,
}: PaginationProps) {
  if (!hasMore) {
    return null
  }

  return (
    <div className="mt-10 rounded-panel border border-border/90 bg-white/92 p-5 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div>
        <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
          Continuar explorando
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          {remainingCount && remainingCount > 0
            ? `Ainda restam ${remainingCount} ${itemLabel} para leitura nesta listagem.`
            : `Carregue mais ${itemLabel} para continuar a navegacao.`}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={onLoadMore}
        className="mt-4 rounded-pill border-accent text-accent hover:bg-accent hover:text-white sm:mt-0"
      >
        Carregar mais
      </Button>
    </div>
  )
}
