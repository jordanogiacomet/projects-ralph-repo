'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState, type ReactNode } from 'react'
import { ContatoForm } from './ContatoForm'

type ClientSegmentFilter = {
  key: string
  label: string
  count: number
}

type ClientCardItem = {
  id: string
  name: string
  logoUrl?: string
  segmentKey: string
}

type ClientsPageProps = {
  heroTitle: string
  heroDescription: string
  introText: string
  lowerSectionText: string
  filters: ClientSegmentFilter[]
  clients: ClientCardItem[]
}

const highlightedTitlePhrase = 'Principais Clientes'

function renderHeroTitle(title: string): ReactNode {
  const start = title.indexOf(highlightedTitlePhrase)

  if (start === -1) {
    return title
  }

  const end = start + highlightedTitlePhrase.length

  return (
    <>
      {title.slice(0, start)}
      <strong>{title.slice(start, end)}</strong>
      {title.slice(end)}
    </>
  )
}

export function ClientsPage({
  heroTitle,
  heroDescription,
  introText,
  lowerSectionText,
  filters,
  clients,
}: ClientsPageProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const shouldReduceMotion = useReducedMotion()

  const filteredClients = useMemo(() => {
    if (activeFilter === 'all') return clients
    return clients.filter((client) => client.segmentKey === activeFilter)
  }, [activeFilter, clients])

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-[62vh] items-center overflow-hidden bg-bg-dark-section">
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 22%, rgba(0, 86, 166, 0.34), transparent 43%), radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.12), transparent 34%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{renderHeroTitle(heroTitle)}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/90 sm:text-lg">{heroDescription}</p>
        </div>
      </section>

      <section className="bg-bg-secondary py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-4xl text-center text-base leading-relaxed text-text-secondary sm:text-lg">
            {introText}
          </p>

          <div className="mt-8 overflow-x-auto pb-2">
            <div className="inline-flex min-w-full gap-2 sm:min-w-0">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.key

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-white text-text-primary hover:border-accent/45 hover:bg-accent-light'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                )
              })}
            </div>
          </div>

          <motion.div layout className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {filteredClients.map((client) => (
                <motion.article
                  key={client.id}
                  layout
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                  className="flex min-h-[146px] flex-col items-center justify-center rounded-xl border border-border bg-white p-4 text-center shadow-sm"
                >
                  {client.logoUrl ? (
                    <Image
                      src={client.logoUrl}
                      alt={client.name}
                      width={180}
                      height={72}
                      loading="lazy"
                      sizes="(max-width: 768px) 40vw, (max-width: 1280px) 20vw, 14vw"
                      className="h-16 w-full object-contain"
                    />
                  ) : (
                    <span className="line-clamp-2 text-sm font-semibold text-text-primary">{client.name}</span>
                  )}
                  {client.logoUrl ? (
                    <p className="mt-3 line-clamp-2 text-xs font-medium text-text-secondary">{client.name}</p>
                  ) : null}
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:px-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Projetos que geram impacto real</h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">{lowerSectionText}</p>
          </div>
          <ContatoForm title="Fale com a Apollo Gestão" />
        </div>
      </section>
    </div>
  )
}

export type { ClientCardItem, ClientSegmentFilter }
