'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-dark-section/95"
          role="dialog"
          aria-modal="true"
          aria-label="Busca no site"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-text-on-dark hover:text-accent-light transition-colors"
            aria-label="Fechar busca"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-3xl px-6">
            <form onSubmit={handleSubmit}>
              <label htmlFor="search-input" className="block text-text-on-dark text-lg mb-4 text-center">
                O que você procura?
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="search-input"
                  name="q"
                  type="search"
                  placeholder="Digite sua busca..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent border-b-2 border-text-on-dark/30 focus:border-accent text-text-on-dark text-2xl py-4 px-2 outline-none placeholder:text-text-on-dark/40 transition-colors"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-on-dark hover:text-accent transition-colors"
                  aria-label="Buscar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="mt-6 max-h-[58vh] overflow-y-auto pr-1">
              {!hasQuery && (
                <p className="text-center text-sm text-text-on-dark/70">
                  Pesquise em páginas, notícias, soluções e conteúdos.
                </p>
              )}

              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-8 text-text-on-dark/80">
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-text-on-dark/30 border-t-text-on-dark"
                    aria-hidden
                  />
                  <span className="text-sm">Buscando resultados...</span>
                </div>
              )}

              {shouldShowEmptyState && (
                <p className="rounded-xl border border-text-on-dark/20 bg-text-on-dark/5 px-4 py-5 text-center text-sm text-text-on-dark/80">
                  Nenhum resultado encontrado para &quot;{response.query || query.trim()}&quot;.
                </p>
              )}

              {!isLoading && hasResults && (
                <div className="space-y-5">
                  {response.groups.map((group) => (
                    <section
                      key={group.key}
                      className="rounded-2xl border border-text-on-dark/20 bg-text-on-dark/5 p-3 sm:p-4"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-text-on-dark/70">
                        {group.label}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {group.results.map((result) => (
                          <li key={`${group.key}-${result.id}-${result.href}`}>
                            <Link
                              href={result.href}
                              onClick={onClose}
                              className="block rounded-xl border border-transparent px-3 py-2.5 transition hover:border-accent/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                              <p className="text-base font-semibold text-text-on-dark">{result.title}</p>
                              {result.description && (
                                <p className="mt-1 line-clamp-2 text-sm text-text-on-dark/75">
                                  {result.description}
                                </p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
