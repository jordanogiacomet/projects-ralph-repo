'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { Badge, Card, Chip } from '@/components/ui'

type SearchOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

type SearchResultItem = {
  id: string
  title: string
  href: string
  description?: string
}

type SearchGroup = {
  key: string
  label: string
  results: SearchResultItem[]
}

type SearchResponse = {
  query: string
  groups: SearchGroup[]
  total: number
}

const emptyResponse: SearchResponse = {
  query: '',
  groups: [],
  total: 0,
}

const searchTopics = [
  {
    label: 'Páginas institucionais',
    description: 'Sobre, clientes, contato e navegação institucional.',
  },
  {
    label: 'Soluções especializadas',
    description: 'Rotas comerciais e páginas de serviço detalhadas.',
  },
  {
    label: 'Conteúdos ricos',
    description: 'Materiais, downloads e páginas de aprofundamento.',
  },
  {
    label: 'Notícias e artigos',
    description: 'News, publicações editoriais e atualizações do site.',
  },
]

const suggestedQueries = ['controle patrimonial', 'avaliacao de ativos', 'cotacao', 'news']
const loadingPreviewGroups = [
  {
    label: 'Páginas e soluções',
    items: 2,
  },
  {
    label: 'Conteúdos e news',
    items: 3,
  },
]

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<SearchResponse>(emptyResponse)

  useEffect(() => {
    let focusTimeout: number | undefined

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      focusTimeout = window.setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setDebouncedQuery('')
      setIsLoading(false)
      setResponse(emptyResponse)
    }

    return () => {
      if (focusTimeout) {
        window.clearTimeout(focusTimeout)
      }
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !overlayRef.current) return

    const overlay = overlayRef.current

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableEls = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (focusableEls.length === 0) return

      const firstEl = focusableEls[0]
      const lastEl = focusableEls[focusableEls.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstEl) {
          event.preventDefault()
          lastEl?.focus()
        }
      } else if (document.activeElement === lastEl) {
        event.preventDefault()
        firstEl?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [isOpen, query])

  useEffect(() => {
    if (!isOpen) return

    if (!debouncedQuery) {
      setIsLoading(false)
      setResponse(emptyResponse)
      return
    }

    const controller = new AbortController()

    const search = async () => {
      setIsLoading(true)

      try {
        const searchParams = new URLSearchParams({ q: debouncedQuery })
        const result = await fetch(`/api/search?${searchParams.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!result.ok) {
          throw new Error(`Search request failed: ${result.status}`)
        }

        const data = (await result.json()) as Partial<SearchResponse>
        const groups = Array.isArray(data.groups) ? data.groups : []
        const sanitizedGroups = groups.map((group) => ({
          key: normalizeText(group.key) || 'results',
          label: normalizeText(group.label) || 'Resultados',
          results: Array.isArray(group.results) ? group.results : [],
        }))
        const total =
          typeof data.total === 'number'
            ? data.total
            : sanitizedGroups.reduce((sum, group) => sum + group.results.length, 0)

        setResponse({
          query: normalizeText(data.query) || debouncedQuery,
          groups: sanitizedGroups,
          total,
        })
      } catch (error) {
        if ((error as Error).name === 'AbortError') return

        setResponse({
          query: debouncedQuery,
          groups: [],
          total: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void search()

    return () => controller.abort()
  }, [debouncedQuery, isOpen])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDebouncedQuery(query.trim())
  }

  const runSuggestedSearch = (suggestedQuery: string) => {
    setQuery(suggestedQuery)
    setDebouncedQuery(suggestedQuery)
    inputRef.current?.focus()
  }

  const hasQuery = query.trim().length > 0
  const hasResults = response.total > 0
  const shouldShowEmptyState = hasQuery && !isLoading && !hasResults
  const loadingQuery = debouncedQuery || query.trim()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#07111e]/78 px-4 py-6 backdrop-blur-md sm:px-6 sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Busca no site"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <div className="mx-auto flex min-h-full w-full max-w-6xl items-start justify-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22 }}
              className="w-full"
            >
              <Card
                className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/96 p-0 shadow-[0_36px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl"
                padding="none"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,86,166,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]"
                />

                <div className="relative border-b border-border/70 bg-[linear-gradient(160deg,rgba(246,248,251,0.95)_0%,rgba(255,255,255,0.98)_56%,rgba(234,242,251,0.78)_100%)] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-3xl">
                      <Badge tone="accent">Busca no site</Badge>
                      <h2 className="mt-4 font-display text-heading-2xl font-semibold tracking-tight text-text-primary">
                        Encontre páginas, soluções e conteúdos com uma leitura mais guiada
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
                        Pesquise em toda a estrutura pública da Apollo com uma hierarquia mais clara
                        entre temas, rotas e resultados editoriais.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="motion-transition motion-lift-subtle inline-flex h-12 w-12 items-center justify-center rounded-pill border border-border/80 bg-white/72 text-text-secondary hover:border-accent/20 hover:bg-white hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                      aria-label="Fechar busca"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-5.5 w-5.5"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="relative grid lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
                  <aside className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.92)_0%,rgba(255,255,255,0.94)_100%)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                      Busca guiada
                    </p>
                    <h3 className="mt-3 font-display text-heading-lg font-semibold tracking-tight text-text-primary">
                      Navegue por intenção
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      Use a busca para cruzar páginas institucionais, rotas comerciais e conteúdo
                      editorial sem perder o contexto da navegação.
                    </p>

                    <div className="mt-6 space-y-3">
                      {searchTopics.map((topic) => (
                        <div
                          key={topic.label}
                          className="rounded-[22px] border border-border bg-white/80 px-4 py-4"
                        >
                          <p className="text-sm font-semibold tracking-[-0.02em] text-text-primary">
                            {topic.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">
                            {topic.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                        Sugestões rápidas
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {suggestedQueries.map((suggestion) => (
                          <Chip
                            key={suggestion}
                            active={query.trim().toLowerCase() === suggestion}
                            onClick={() => runSuggestedSearch(suggestion)}
                          >
                            {suggestion}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </aside>

                  <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="search-input" className="sr-only">
                        O que você procura?
                      </label>
                      <div className="relative overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                        <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-text-muted">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-5.5 w-5.5"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </span>
                        <input
                          ref={inputRef}
                          id="search-input"
                          name="q"
                          type="search"
                          placeholder="Busque por temas, serviços, páginas ou conteúdos..."
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          className="h-16 w-full bg-transparent pl-14 pr-20 text-base font-medium text-text-primary outline-none placeholder:text-text-muted sm:h-[4.5rem] sm:text-lg"
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="motion-transition motion-lift-subtle absolute inset-y-2 right-2 inline-flex items-center justify-center rounded-pill bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                          aria-label="Buscar"
                        >
                          Ir
                        </button>
                      </div>
                    </form>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted">
                      <span>Pesquise em páginas, notícias, soluções e conteúdos.</span>
                      {hasQuery ? (
                        <span aria-live="polite">
                          {isLoading
                            ? 'Buscando resultados...'
                            : hasResults
                              ? `${response.total} resultado${response.total === 1 ? '' : 's'}`
                              : 'Nenhum resultado'}
                        </span>
                      ) : (
                        <span>Digite um termo ou use uma sugestão rápida.</span>
                      )}
                    </div>

                    {isLoading ? (
                      <div
                        className="mt-4 rounded-[26px] border border-accent/12 bg-accent-soft/45 px-4 py-4 sm:px-5"
                        aria-live="polite"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-accent/12 bg-white text-accent shadow-sm">
                            <span
                              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent/18 border-t-accent"
                              aria-hidden
                            />
                          </span>
                          <div>
                            <p className="text-label-sm font-semibold uppercase tracking-[0.22em] text-accent-strong">
                              Atualizando resultados
                            </p>
                            <p className="mt-2 text-sm leading-6 text-text-secondary">
                              Buscando por &quot;{loadingQuery}&quot; em páginas, soluções,
                              conteúdos e publicações para manter a navegação orientada pelo mesmo
                              contexto da consulta.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1">
                      {!hasQuery ? (
                        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                          <div className="rounded-[28px] border border-border bg-surface-secondary/72 p-5">
                            <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                              Comece pela intenção
                            </p>
                            <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-text-primary">
                              Pesquise pelo problema, pela solução ou pela página que deseja abrir.
                            </p>
                            <p className="mt-3 text-sm leading-6 text-text-secondary">
                              A busca retorna resultados agrupados por tipo para facilitar leitura,
                              triagem e decisão sem perder o contexto do site.
                            </p>
                          </div>

                          <div className="rounded-[28px] border border-border bg-white p-5 shadow-soft">
                            <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                              Consultas sugeridas
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                              {suggestedQueries.map((suggestion) => (
                                <Chip
                                  key={`result-${suggestion}`}
                                  active={query.trim().toLowerCase() === suggestion}
                                  onClick={() => runSuggestedSearch(suggestion)}
                                >
                                  {suggestion}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {isLoading ? (
                        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                          {loadingPreviewGroups.map((group) => (
                            <div
                              key={group.label}
                              className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(248,250,252,0.92)_0%,rgba(255,255,255,0.98)_100%)] p-5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="h-3 w-28 rounded-full bg-border/80" />
                                  <div className="mt-3 h-5 w-40 rounded-full bg-border/80" />
                                </div>
                                <div className="h-8 w-8 rounded-pill bg-white shadow-sm" />
                              </div>

                              <div className="mt-5 space-y-3">
                                {Array.from({ length: group.items }).map((_, index) => (
                                  <div
                                    key={`${group.label}-${index}`}
                                    className="animate-pulse rounded-[22px] border border-border/80 bg-white px-4 py-4"
                                  >
                                    <div className="h-4 w-3/4 rounded-full bg-border/80" />
                                    <div className="mt-3 h-3 w-full rounded-full bg-border/70" />
                                    <div className="mt-2 h-3 w-5/6 rounded-full bg-border/60" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {shouldShowEmptyState ? (
                        <div className="rounded-[28px] border border-border bg-surface-secondary/72 px-5 py-8 text-center">
                          <p className="text-lg font-semibold tracking-[-0.02em] text-text-primary">
                            Nenhum resultado encontrado
                          </p>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Tente novos termos para buscar por &quot;
                            {response.query || query.trim()}
                            &quot;.
                          </p>
                          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                            {suggestedQueries.map((suggestion) => (
                              <Chip
                                key={`empty-${suggestion}`}
                                onClick={() => runSuggestedSearch(suggestion)}
                              >
                                {suggestion}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {!isLoading && hasResults ? (
                        <div className="space-y-5">
                          {response.groups.map((group) => (
                            <section
                              key={group.key}
                              className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(248,250,252,0.9)_0%,rgba(255,255,255,0.98)_100%)] p-4 sm:p-5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-label-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                                    Grupo de resultados
                                  </p>
                                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-text-primary">
                                    {group.label}
                                  </h3>
                                </div>
                                <span className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-pill bg-white px-2.5 text-label-sm font-semibold text-text-muted shadow-sm">
                                  {group.results.length}
                                </span>
                              </div>

                              <ul className="mt-4 grid gap-3">
                                {group.results.map((result) => (
                                  <li key={`${group.key}-${result.id}-${result.href}`}>
                                    <Link
                                      href={result.href}
                                      onClick={onClose}
                                      className="motion-transition motion-lift-subtle flex items-start justify-between gap-4 rounded-[22px] border border-border/70 bg-white px-4 py-4 hover:border-accent/25 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                                    >
                                      <div>
                                        <p className="text-base font-semibold tracking-[-0.02em] text-text-primary">
                                          {result.title}
                                        </p>
                                        {result.description ? (
                                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                                            {result.description}
                                          </p>
                                        ) : null}
                                      </div>
                                      <span
                                        className="motion-transition mt-1 text-text-muted"
                                        aria-hidden
                                      >
                                        &rarr;
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
