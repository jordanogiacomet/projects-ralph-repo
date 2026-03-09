'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Pagination } from '@/components/Pagination'
import { PostCard, type NewsPostCardItem } from '@/components/PostCard'

type PostListProps = {
  posts: NewsPostCardItem[]
}

const PAGE_SIZE = 6
const ebookHref = '/conteudos/e-book-identificacao-patrimonial'

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export function PostList({ posts }: PostListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredPosts = useMemo(() => {
    const query = normalize(searchTerm)
    if (!query) return posts

    return posts.filter((post) => {
      const haystack = normalize(`${post.title} ${post.excerpt} ${post.authorName}`)
      return haystack.includes(query)
    })
  }, [searchTerm, posts])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchTerm])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:px-8">
      <div>
        {visiblePosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text-primary">Nenhuma publicação encontrada</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {posts.length === 0
                ? 'Ainda não publicamos conteúdos no blog. Novos artigos aparecerão aqui em breve.'
                : 'Ajuste os termos da busca no painel lateral para encontrar outras publicações.'}
            </p>
          </article>
        )}

        <Pagination hasMore={hasMore} onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)} />
      </div>

      <aside className="hidden lg:block" aria-label="Filtros e destaque de conteúdo">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <label htmlFor="news-search" className="text-sm font-semibold text-text-primary">
              Buscar no blog
            </label>
            <input
              id="news-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
              placeholder="Digite um tema, autor ou palavra-chave"
              className="mt-3 w-full rounded-xl border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
            />
            <p className="mt-2 text-xs text-text-secondary">
              {filteredPosts.length} publicação{filteredPosts.length === 1 ? '' : 'ões'} encontrada
              {filteredPosts.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-bg-dark-section text-white shadow-sm">
            <div
              className="pointer-events-none h-24"
              style={{
                background:
                  'radial-gradient(circle at 20% 30%, rgba(0, 86, 166, 0.55), transparent 45%), radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.18), transparent 36%)',
              }}
              aria-hidden
            />
            <div className="p-5 pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Material gratuito</p>
              <h3 className="mt-2 text-xl font-bold leading-tight">
                E-book de Identificação Patrimonial
              </h3>
              <p className="mt-3 text-sm text-white/85">
                Baixe um guia prático para estruturar identificação, rastreabilidade e controle de
                ativos.
              </p>
              <Link
                href={ebookHref}
                className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent-light"
              >
                Baixar e-book
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
