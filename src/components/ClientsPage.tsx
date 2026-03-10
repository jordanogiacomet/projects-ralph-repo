'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState, type ReactNode } from 'react'

import { Badge, Button, Chip, Container, SectionHeading } from '@/components/ui'

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
const proofStats = [
  { value: '500+', label: 'marcas e grupos apoiados' },
  { value: '20+', label: 'anos de atuação consultiva' },
  { value: 'Brasil', label: 'operação com cobertura nacional' },
  { value: 'Multi', label: 'setores públicos e privados' },
]

const trustPoints = [
  'Projetos conduzidos com método, rastreabilidade e leitura executiva clara.',
  'Atuação em inventário, avaliação, governança de ativos e conformidade contábil.',
  'Portfólio multissetorial com demandas técnicas, operacionais e regulatórias distintas.',
]

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

  const activeFilterMeta = useMemo(
    () => filters.find((filter) => filter.key === activeFilter) ?? filters[0],
    [activeFilter, filters],
  )

  const segmentLabels = useMemo(() => {
    return filters.reduce<Record<string, string>>((labels, filter) => {
      labels[filter.key] = filter.label
      return labels
    }, {})
  }, [filters])

  const filteredClients = useMemo(() => {
    if (activeFilter === 'all') return clients
    return clients.filter((client) => client.segmentKey === activeFilter)
  }, [activeFilter, clients])

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(8,14,26,0.92) 0%, rgba(12,22,38,0.86) 42%, rgba(8,14,26,0.96) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 16% 18%, rgba(0, 86, 166, 0.38), transparent 34%), radial-gradient(circle at 82% 14%, rgba(255, 255, 255, 0.12), transparent 26%), radial-gradient(circle at 50% 90%, rgba(40, 167, 69, 0.12), transparent 28%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(180deg, rgba(8,14,26,0.52) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-3xl text-text-on-dark"
            >
              <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                Prova social e atuação multissetorial
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8">
                {renderHeroTitle(heroTitle)}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/72 sm:mt-6">{heroDescription}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#clientes-grid"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                  trailingIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                >
                  Explorar clientes
                </Button>
                <Button
                  href="/contato"
                  variant="ghost"
                  size="lg"
                  className="rounded-pill border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
                >
                  Falar com especialistas
                </Button>
              </div>
            </motion.div>

            <motion.aside
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
              }
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_65px_rgba(8,14,26,0.26)] backdrop-blur-sm sm:p-7"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%, rgba(0,86,166,0.16) 100%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                  Curadoria institucional
                </p>
                <p className="mt-4 text-body-md text-white/74">{introText}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {proofStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                    >
                      <p className="font-display text-heading-lg font-bold text-white">{stat.value}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>

      <section className="relative -mt-12 z-10 sm:-mt-16">
        <Container>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            className="relative overflow-hidden rounded-panel border border-border bg-white/95 p-5 shadow-[var(--shadow-strong)] backdrop-blur-sm sm:p-8"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 45%, rgba(15,23,42,0.04) 100%)',
              }}
              aria-hidden
            />

            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                  eyebrow="Filtro refinado"
                  title="Selecione o recorte que faz mais sentido para a sua leitura."
                  description="Os segmentos seguem o mesmo padrão visual do sistema e ajudam a explorar a base de clientes com mais clareza."
                  size="sm"
                  className="max-w-2xl"
                />

                <div className="rounded-card border border-border bg-surface-secondary px-4 py-3 shadow-soft sm:min-w-[240px]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Visão atual
                  </p>
                  <p className="mt-2 font-display text-heading-lg font-bold text-text-primary">
                    {activeFilterMeta?.label ?? 'Todos'}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {filteredClients.length} {filteredClients.length === 1 ? 'marca exibida' : 'marcas exibidas'}
                  </p>
                </div>
              </div>

              <div
                className="mt-6 overflow-x-auto pb-2"
                role="group"
                aria-label="Filtrar clientes por segmento"
              >
                <div className="inline-flex min-w-full gap-2 sm:min-w-0 sm:flex-wrap">
                  {filters.map((filter) => (
                    <Chip
                      key={filter.key}
                      active={activeFilter === filter.key}
                      count={filter.count}
                      aria-pressed={activeFilter === filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className="whitespace-nowrap"
                    >
                      {filter.label}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <section
        id="clientes-grid"
        className="relative overflow-hidden bg-bg-secondary py-section-loose"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 12% 18%, rgba(0,86,166,0.08), transparent 32%), radial-gradient(circle at 90% 82%, rgba(15,23,42,0.05), transparent 26%)',
          }}
          aria-hidden
        />

        <Container className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Grade de logos"
              title="Marcas apresentadas com mais espaço, contraste e legibilidade."
              description="O grid privilegia limpeza visual e leitura de marca sem perder densidade institucional."
              size="md"
              className="max-w-2xl"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" className="bg-accent-soft/80 text-accent-strong">
                {activeFilterMeta?.label ?? 'Todos os segmentos'}
              </Badge>
              <Badge className="border border-border bg-white text-text-secondary">
                {filteredClients.length} resultados
              </Badge>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <motion.article
                    key={client.id}
                    layout
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.24,
                            delay: Math.min(index * 0.025, 0.16),
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                    className="group relative overflow-hidden rounded-card border border-border/80 bg-white/96 p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-medium"
                  >
                    <div
                      className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 45%, rgba(15,23,42,0.06) 100%)',
                      }}
                      aria-hidden
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-3">
                        <Badge className="border border-accent/10 bg-accent-soft/70 text-accent-strong">
                          {segmentLabels[client.segmentKey] ?? 'Outros'}
                        </Badge>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                          Logo
                        </span>
                      </div>

                      <div className="mt-5 flex min-h-[152px] items-center justify-center rounded-[1.1rem] border border-border/70 bg-gradient-to-br from-slate-50 via-white to-slate-100/70 p-6">
                        {client.logoUrl ? (
                          <Image
                            src={client.logoUrl}
                            alt={client.name}
                            width={220}
                            height={96}
                            loading="lazy"
                            sizes="(max-width: 640px) 90vw, (max-width: 1280px) 42vw, 22vw"
                            className="h-16 w-auto max-w-full object-contain opacity-95 transition duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="text-center">
                            <span className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-pill bg-accent-soft px-3 text-base font-bold text-accent-strong">
                              {client.name.charAt(0)}
                            </span>
                            <p className="mt-4 text-sm font-semibold text-text-primary">{client.name}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-text-primary">
                          {client.name}
                        </p>
                        <span
                          className="mt-0.5 inline-flex min-h-9 min-w-9 items-center justify-center rounded-pill border border-border bg-surface-secondary text-text-muted transition duration-200 group-hover:border-accent/20 group-hover:text-accent"
                          aria-hidden
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M7 17L17 7M10 7h7v7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div
                  key="empty-state"
                  layout
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24 }}
                  className="sm:col-span-2 xl:col-span-4"
                >
                  <div className="rounded-panel border border-dashed border-border-strong bg-white/92 p-8 text-center shadow-soft">
                    <p className="font-display text-heading-lg font-semibold text-text-primary">
                      Nenhuma marca encontrada neste recorte.
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-body-md text-text-secondary">
                      Ajuste o filtro para visualizar clientes de outros segmentos e explorar toda a
                      base de prova social da Apollo.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-bg-dark-section py-section-loose">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(0,86,166,0.26), transparent 30%), radial-gradient(circle at 82% 78%, rgba(40,167,69,0.14), transparent 22%)',
          }}
          aria-hidden
        />

        <Container className="relative grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            className="max-w-xl text-white"
          >
            <Badge className="border border-white/12 bg-white/[0.08] text-white/76">
              Diagnóstico consultivo
            </Badge>
            <h2 className="mt-6 font-display text-display-sm font-extrabold tracking-tight text-white">
              Projetos que geram impacto real em governança patrimonial.
            </h2>
            <p className="mt-5 text-body-lg text-white/72">{lowerSectionText}</p>

            <div className="mt-8 grid gap-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-card border border-white/10 bg-white/[0.06] p-4 text-white/72"
                >
                  <span className="mt-0.5 inline-flex min-h-8 min-w-8 items-center justify-center rounded-pill bg-white/10 text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M5 12l4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <ContatoForm title="Fale com a Apollo Gestão" />
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export type { ClientCardItem, ClientSegmentFilter }
