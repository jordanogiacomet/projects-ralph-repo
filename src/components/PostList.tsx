'use client'

import { useEffect, useMemo, useState } from 'react'

import { NewsletterForm } from '@/components/NewsletterForm'
import { Pagination } from '@/components/Pagination'
import { EditorialEmptyState } from '@/components/EditorialEmptyState'
import { PostCard } from '@/components/PostCard'
import { Button, Card, Chip, Input, SectionHeading } from '@/components/ui'
import type { NewsPostCardItem } from '@/lib/news'

type PostListProps = {
  posts: NewsPostCardItem[]
}

const PAGE_SIZE = 4
const ebookHref = '/conteudos/e-book-identificacao-patrimonial'

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export function PostList({ posts }: PostListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const categories = useMemo(() => {
    const counts = new Map<string, number>()

    for (const post of posts) {
      for (const category of post.categories) {
        counts.set(category, (counts.get(category) || 0) + 1)
      }
    }

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], 'pt-BR'))
      .map(([label, count]) => ({ label, count }))
  }, [posts])

  const filteredPosts = useMemo(() => {
    const query = normalize(searchTerm)
    const activeCategoryKey = normalize(activeCategory)

    return posts.filter((post) => {
      const haystack = normalize(
        `${post.title} ${post.excerpt} ${post.authorName} ${post.categories.join(' ')}`,
      )
      const matchesQuery = !query || haystack.includes(query)
      const matchesCategory =
        activeCategory === 'all' ||
        post.categories.some((category) => normalize(category) === activeCategoryKey)

      return matchesQuery && matchesCategory
    })
  }, [activeCategory, posts, searchTerm])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeCategory, searchTerm])

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)
  const visiblePosts = remainingPosts.slice(0, visibleCount)
  const hasMore = visibleCount < remainingPosts.length
  const hasFilters = searchTerm.trim().length > 0 || activeCategory !== 'all'
  const totalCategories = categories.length
  const totalAuthors = new Set(posts.map((post) => post.authorName)).size
  const latestPost = posts[0]
  const isEmptyResult = !featuredPost
  const emptyTitle = posts.length === 0 ? 'Nenhuma publicacao encontrada' : 'Nenhum resultado para a busca atual'
  const emptyDescription =
    posts.length === 0
      ? 'A editoria ainda esta em formacao. Novos artigos aparecerao aqui em breve.'
      : 'Ajuste a busca ou o tema ativo para encontrar outras publicacoes do acervo.'

  const resetFilters = () => {
    setSearchTerm('')
    setActiveCategory('all')
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
      <div className="space-y-8">
        <div className="surface-muted rounded-panel p-5 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Arquivo editorial"
              title="Leituras recentes para orientar decisoes patrimoniais com mais contexto."
              description="Filtre por tema e navegue por artigos organizados como um acervo editorial, nao apenas como uma listagem cronologica."
              size="sm"
              className="max-w-3xl"
            />
            {hasFilters ? (
              <Button
                type="button"
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                className="rounded-pill"
              >
                Limpar filtros
              </Button>
            ) : (
              <p className="text-sm text-text-secondary">
                {filteredPosts.length} artigo{filteredPosts.length === 1 ? '' : 's'} visiveis
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <Input
              id="news-search"
              label="Buscar no acervo"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
              placeholder="Tema, autor ou palavra-chave"
            />

            <Card padding="sm" className="bg-white/80">
              <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                Visao atual
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-card border border-border bg-surface-secondary p-3">
                  <p className="font-display text-heading-lg font-semibold text-text-primary">
                    {filteredPosts.length}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">artigos filtrados</p>
                </div>
                <div className="rounded-card border border-border bg-surface-secondary p-3">
                  <p className="font-display text-heading-lg font-semibold text-text-primary">
                    {activeCategory === 'all' ? 'Todas' : activeCategory}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">editorias ativas</p>
                </div>
              </div>
            </Card>
          </div>

          {categories.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Chip active={activeCategory === 'all'} count={posts.length} onClick={() => setActiveCategory('all')}>
                Todas
              </Chip>
              {categories.map((category) => (
                <Chip
                  key={category.label}
                  active={activeCategory === category.label}
                  count={category.count}
                  onClick={() => setActiveCategory(category.label)}
                >
                  {category.label}
                </Chip>
              ))}
            </div>
          ) : null}

          {isEmptyResult ? (
            <div className="mt-6 rounded-card border border-accent/12 bg-accent-soft/70 p-4 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Recuperacao rapida
                  </p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">{emptyTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{emptyDescription}</p>
                </div>
                <div className="flex flex-col gap-3 sm:min-w-[220px]">
                  {hasFilters ? (
                    <Button
                      type="button"
                      onClick={resetFilters}
                      variant="outline"
                      size="sm"
                      className="rounded-pill"
                    >
                      Limpar filtros
                    </Button>
                  ) : (
                    <Button href={ebookHref} variant="secondary" size="sm" className="rounded-pill">
                      Explorar materiais gratuitos
                    </Button>
                  )}
                  <Button href="/contato" variant="ghost" size="sm" className="rounded-pill">
                    Falar com especialistas
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {featuredPost ? (
          <section>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Em destaque"
                title="A principal leitura desta janela editorial."
                description="Abertura com maior hierarquia para o artigo mais recente dentro da selecao atual."
                size="sm"
                className="max-w-2xl"
              />
              <p className="text-sm text-text-secondary">
                Atualizado em {featuredPost.publishedAtLabel}
              </p>
            </div>
            <div className="mt-6">
              <PostCard post={featuredPost} variant="featured" priority />
            </div>
          </section>
        ) : null}

        {visiblePosts.length > 0 ? (
          <section>
            <SectionHeading
              eyebrow="Mais leituras"
              title="Outros artigos recentes da editoria Apollo."
              description="Cartoes com metadata mais rica e uma composicao mais editorial para sustentar a exploracao do acervo."
              size="sm"
              className="max-w-2xl"
            />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              hasMore={hasMore}
              itemLabel="artigos"
              onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
              remainingCount={remainingPosts.length - visibleCount}
            />
          </section>
        ) : null}

        {isEmptyResult ? (
          <EditorialEmptyState
            eyebrow={posts.length === 0 ? 'Editoria em formacao' : 'Sem resultados'}
            title={emptyTitle}
            description={emptyDescription}
            primaryAction={
              hasFilters
                ? {
                    label: 'Limpar filtros',
                    onClick: resetFilters,
                  }
                : {
                    label: 'Explorar materiais gratuitos',
                    href: ebookHref,
                    variant: 'outline',
                  }
            }
            secondaryAction={{
              label: 'Falar com especialistas',
              href: '/contato',
              variant: 'ghost',
            }}
          />
        ) : null}
      </div>

      <aside className="space-y-5 xl:sticky xl:top-32 xl:self-start" aria-label="Painel editorial">
        <Card tone="dark" className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 36%, rgba(0,86,166,0.18) 100%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/56">
              Radar editorial
            </p>
            <h2 className="mt-4 font-display text-heading-xl font-semibold text-white">
              Um apoio lateral que organiza o acervo, em vez de parecer um bloco solto.
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-card border border-white/10 bg-black/10 p-4">
                <p className="font-display text-heading-lg font-bold text-white">{posts.length}</p>
                <p className="mt-2 text-sm text-white/62">artigos ativos</p>
              </div>
              <div className="rounded-card border border-white/10 bg-black/10 p-4">
                <p className="font-display text-heading-lg font-bold text-white">{totalCategories}</p>
                <p className="mt-2 text-sm text-white/62">temas mapeados</p>
              </div>
              <div className="rounded-card border border-white/10 bg-black/10 p-4">
                <p className="font-display text-heading-lg font-bold text-white">{totalAuthors}</p>
                <p className="mt-2 text-sm text-white/62">autorias visiveis</p>
              </div>
              <div className="rounded-card border border-white/10 bg-black/10 p-4">
                <p className="font-display text-sm font-bold text-white">
                  {latestPost ? latestPost.publishedAtLabel : 'Em breve'}
                </p>
                <p className="mt-2 text-sm text-white/62">ultimo destaque</p>
              </div>
            </div>
          </div>
        </Card>

        <NewsletterForm compact />

        <Card tone="muted" className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 40%, rgba(15,23,42,0.04) 100%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
              Leitura complementar
            </p>
            <h2 className="mt-4 font-display text-heading-lg font-semibold text-text-primary">
              Amplie a conversa com materiais praticos e apoio consultivo.
            </h2>
            <p className="mt-4 text-body-sm text-text-secondary">
              Combine os artigos do hub com a biblioteca gratuita da Apollo ou fale diretamente com
              o time para traduzir o tema ao seu contexto operacional.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button href={ebookHref} variant="secondary" size="lg" className="rounded-pill">
                Explorar materiais
              </Button>
              <Button href="/contato" variant="outline" size="lg" className="rounded-pill">
                Falar com especialistas
              </Button>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  )
}
