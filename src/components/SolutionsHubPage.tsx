'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { Badge, Button, Container, SectionHeading } from '@/components/ui'

import { ContatoForm } from './ContatoForm'
import { SolutionFilterTabs, type SolutionFilter } from './SolutionFilterTabs'
import { SolutionGrid, type SolutionItem } from './SolutionGrid'

type SolutionWithFilters = SolutionItem & {
  filterKeys: string[]
}

type SolutionsHubPageProps = {
  heroTitle: string
  heroDescription: string
  filters: SolutionFilter[]
  solutions: SolutionWithFilters[]
}

const highlightedHeroPhrase = 'solução completa'
const heroTrustPoints = [
  'Portifolio estruturado para operacao, conformidade e decisao executiva.',
  'Leitura por frente consultiva com filtros mais claros e densidade visual controlada.',
  'Mesma linguagem premium aplicada ao shell, homepage e agora ao hub de solucoes.',
]

const filterInsights: Record<string, { title: string; description: string }> = {
  all: {
    title: 'Visao completa do portifolio Apollo',
    description:
      'Explore o mapa completo das frentes patrimoniais e encontre a combinacao mais aderente ao seu contexto.',
  },
  'avaliacao-patrimonial': {
    title: 'Avaliacao patrimonial com leitura tecnica e executiva',
    description:
      'Laudos e pareceres estruturados para valoracao, governanca contabile regulatoria e suporte a decisoes criticas.',
  },
  'controle-patrimonial': {
    title: 'Controle patrimonial com base confiavel e rastreavel',
    description:
      'Inventario, identificacao e organizacao de ativos para sustentar rotina operacional e governanca continua.',
  },
  'consultoria-ifrs': {
    title: 'Consultoria e IFRS para cenarios tecnicos mais sensiveis',
    description:
      'Apoio especializado para impairment, vida util, arrendamento e outros recortes que exigem profundidade normativa.',
  },
  tecnologia: {
    title: 'Tecnologia aplicada a monitoramento, rastreio e escala',
    description:
      'Solucoes digitais e ativos inteligentes para expandir visibilidade, automacao e capacidade operacional.',
  },
}

const heroTrackOrder = ['controle-patrimonial', 'consultoria-ifrs', 'tecnologia', 'avaliacao-patrimonial']

function renderHeroTitle(title: string): ReactNode {
  const lowerTitle = title.toLocaleLowerCase('pt-BR')
  const startIndex = lowerTitle.indexOf(highlightedHeroPhrase)

  if (startIndex === -1) {
    return title
  }

  const endIndex = startIndex + highlightedHeroPhrase.length

  return (
    <>
      {title.slice(0, startIndex)}
      <strong>{title.slice(startIndex, endIndex)}</strong>
      {title.slice(endIndex)}
    </>
  )
}

export function SolutionsHubPage({ heroTitle, heroDescription, filters, solutions }: SolutionsHubPageProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const shouldReduceMotion = useReducedMotion()

  const filteredSolutions = useMemo(() => {
    if (activeFilter === 'all') return solutions
    return solutions.filter((solution) => solution.filterKeys.includes(activeFilter))
  }, [activeFilter, solutions])

  const activeFilterMeta = useMemo(
    () => filters.find((filter) => filter.key === activeFilter) ?? filters[0],
    [activeFilter, filters],
  )

  const activeInsight = filterInsights[activeFilter] ?? filterInsights.all

  const heroTracks = useMemo(() => {
    const lookup = new Map(filters.map((filter) => [filter.key, filter]))
    return heroTrackOrder
      .map((key) => lookup.get(key))
      .filter((filter): filter is SolutionFilter => Boolean(filter))
  }, [filters])

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(8,14,26,0.94) 0%, rgba(12,22,38,0.88) 42%, rgba(8,14,26,0.96) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(0,86,166,0.36), transparent 34%), radial-gradient(circle at 82% 12%, rgba(255,255,255,0.12), transparent 24%), radial-gradient(circle at 48% 88%, rgba(40,167,69,0.12), transparent 24%)',
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
                shouldReduceMotion ? { duration: 0 } : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-3xl text-text-on-dark"
            >
              <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                Portfolio de solucoes Apollo
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8">
                {renderHeroTitle(heroTitle)}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/72 sm:mt-6">{heroDescription}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#solucoes-grid"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Explorar solucoes
                </Button>
                <Button
                  href="/contato/cotacao"
                  variant="ghost"
                  size="lg"
                  className="rounded-pill border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
                >
                  Solicitar diagnostico
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroTrustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-card border border-white/10 bg-white/[0.05] p-4 text-sm leading-relaxed text-white/68 shadow-[0_14px_28px_rgba(8,14,26,0.18)] backdrop-blur-sm"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.aside
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
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
                  Mapa do portifolio
                </p>
                <p className="mt-4 text-body-md text-white/74">
                  O hub organiza as frentes da Apollo por escopo tecnico, com leitura mais clara para quem esta
                  avaliando prioridades operacionais, contabeis e estrategicas.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {heroTracks.map((track) => (
                    <div
                      key={track.key}
                      className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                    >
                      <p className="font-display text-heading-lg font-bold text-white">{track.count}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{track.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-card border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/52">
                    Cobertura atual
                  </p>
                  <p className="mt-3 font-display text-heading-xl font-bold text-white">
                    {solutions.length} solucoes especializadas
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/68">
                    Do diagnostico patrimonial a execucao em campo, com trilhas consultivas e operacionais que
                    podem ser combinadas conforme o contexto do cliente.
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-12 sm:-mt-16">
        <Container>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
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
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.92fr)] lg:items-end">
                <SectionHeading
                  eyebrow="Hub consultivo"
                  title="Filtre o portfolio por frente de trabalho e chegue mais rapido ao recorte certo."
                  description="A nova camada de navegacao prioriza clareza, contagem legivel e cards com mais respiro para ajudar na leitura institucional e comercial."
                  size="sm"
                  className="max-w-2xl"
                />

                <div className="rounded-card border border-border bg-surface-secondary px-4 py-4 shadow-soft sm:min-w-[240px]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                    Visao atual
                  </p>
                  <p className="mt-2 font-display text-heading-lg font-bold text-text-primary">
                    {activeFilterMeta?.label ?? 'Todas as solucoes'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{activeInsight.description}</p>
                </div>
              </div>

              <div className="mt-6">
                <SolutionFilterTabs filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-card border border-accent/10 bg-accent-soft/60 p-4">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                    Curadoria clara
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Cada frente ganhou leitura mais limpa para reduzir densidade e deixar a navegacao objetiva.
                  </p>
                </div>
                <div className="rounded-card border border-border bg-surface-primary p-4 shadow-soft">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                    Estado ativo
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Os filtros destacam o contexto selecionado sem perder legibilidade de contagem e hover.
                  </p>
                </div>
                <div className="rounded-card border border-border bg-surface-primary p-4 shadow-soft">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                    Grid premium
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Cards com proporcao mais equilibrada, hierarquia forte e CTA mais refinada para exploracao.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-bg-secondary py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Mapa de capacidades"
              title={activeInsight.title}
              description="O hub agora se comporta como uma vitrine consultiva: mais contexto visual, menos aparencia de catalogo mecanico e melhor leitura entre frentes."
              size="md"
              className="max-w-3xl"
            />

            <div className="rounded-card border border-border bg-white px-5 py-4 shadow-soft" aria-live="polite">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
                Solucoes exibidas
              </p>
              <p className="mt-2 font-display text-heading-xl font-bold text-text-primary">
                {filteredSolutions.length}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {activeFilterMeta?.label ?? 'Todas as solucoes'}
              </p>
            </div>
          </div>

          <div id="solucoes-grid" className="mt-10 sm:mt-12">
            <SolutionGrid items={filteredSolutions} variant="hub" />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Proximo passo"
              title="Converse com a equipe Apollo para montar a combinacao certa de solucoes."
              description="Se o seu desafio envolve inventario, valoracao, compliance contabil ou tecnologia aplicada, o contato consultivo ajuda a priorizar por impacto e urgencia."
              size="md"
            />

            <div className="mt-6 grid gap-3">
              <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                  Diagnostico inicial
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Descreva o contexto, a unidade e o tipo de ativo para acelerar a leitura tecnica da demanda.
                </p>
              </div>
              <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                  Escopo consultivo
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  A equipe ajuda a combinar servicos quando a jornada exige mais de uma frente patrimonial.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/contato/cotacao" size="lg" variant="primary">
                Solicitar proposta
              </Button>
              <Button href="/contato" size="lg" variant="outline">
                Ir para contato
              </Button>
            </div>
          </div>

          <ContatoForm title="Fale com a Apollo sobre sua operacao patrimonial" />
        </Container>
      </section>
    </div>
  )
}

export type { SolutionFilter, SolutionItem }
