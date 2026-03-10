'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Badge, Card } from '@/components/ui'

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
  'Páginas institucionais',
  'Soluções especializadas',
  'Conteúdos ricos',
  'Notícias e artigos',
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDebouncedQuery(query.trim())
  }

  const hasQuery = query.trim().length > 0
  const hasResults = response.total > 0
  const shouldShowEmptyState = hasQuery && !isLoading && !hasResults

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#07111e]/74 px-4 py-6 backdrop-blur-md sm:px-6 sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Busca no site"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22 }}
              className="w-full"
            >
              <Card
                className="overflow-hidden rounded-[32px] border border-white/70 bg-white/95 p-0 shadow-[0_32px_80px_rgba(15,23,42,0.26)] backdrop-blur-xl"
                padding="none"
              >
                <div className="border-b border-border/70 bg-[linear-gradient(160deg,rgba(246,248,251,0.95)_0%,rgba(255,255,255,0.98)_56%,rgba(234,242,251,0.78)_100%)] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <Badge tone="accent">Busca no site</Badge>
                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-text-primary sm:text-[2.35rem]">
                        Encontre páginas, soluções, notícias e conteúdos com mais rapidez
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
                        Digite termos livres para pesquisar em toda a estrutura pública da Apollo.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-white/70 text-text-secondary transition hover:border-accent/20 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
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

                  <form onSubmit={handleSubmit} className="mt-6">
                    <label htmlFor="search-input" className="sr-only">
                      O que você procura?
                    </label>
                    <div className="relative overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
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
                        className="h-16 w-full bg-transparent pl-14 pr-16 text-base font-medium text-text-primary outline-none placeholder:text-text-muted sm:text-lg"
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        className="absolute inset-y-2 right-2 inline-flex items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                        aria-label="Buscar"
                      >
                        Ir
                      </button>
                    </div>
                  </form>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted">
                    <span>Pesquise em páginas, notícias, soluções e conteúdos.</span>
                    {hasQuery ? (
                      <span>
                        {isLoading
                          ? 'Buscando resultados...'
                          : hasResults
                            ? `${response.total} resultado${response.total === 1 ? '' : 's'}`
                            : 'Nenhum resultado'}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="max-h-[62vh] overflow-y-auto p-6 sm:p-8">
                  {!hasQuery ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {searchTopics.map((topic) => (
                        <div
                          key={topic}
                          className="rounded-[22px] border border-border bg-surface-secondary/80 px-4 py-4 text-sm font-medium text-text-secondary"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3 py-10 text-text-secondary">
                      <span
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-muted/30 border-t-text-secondary"
                        aria-hidden
                      />
                      <span className="text-sm">Buscando resultados...</span>
                    </div>
                  ) : null}

                  {shouldShowEmptyState ? (
                    <div className="rounded-[24px] border border-border bg-surface-secondary/70 px-5 py-8 text-center">
                      <p className="text-lg font-semibold tracking-[-0.02em] text-text-primary">
                        Nenhum resultado encontrado
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        Tente novos termos para buscar por &quot;{response.query || query.trim()}
                        &quot;.
                      </p>
                    </div>
                  ) : null}

                  {!isLoading && hasResults ? (
                    <div className="space-y-5">
                      {response.groups.map((group) => (
                        <section
                          key={group.key}
                          className="rounded-[26px] border border-border bg-surface-secondary/70 p-4 sm:p-5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                              {group.label}
                            </h3>
                            <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-pill bg-white px-2.5 text-[11px] font-semibold text-text-muted shadow-sm">
                              {group.results.length}
                            </span>
                          </div>
                          <ul className="mt-4 grid gap-3">
                            {group.results.map((result) => (
                              <li key={`${group.key}-${result.id}-${result.href}`}>
                                <Link
                                  href={result.href}
                                  onClick={onClose}
                                  className="block rounded-[22px] border border-border/70 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15"
                                >
                                  <p className="text-base font-semibold tracking-[-0.02em] text-text-primary">
                                    {result.title}
                                  </p>
                                  {result.description ? (
                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                                      {result.description}
                                    </p>
                                  ) : null}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
