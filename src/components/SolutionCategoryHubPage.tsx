'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { Badge, Button, Card, Container, SectionHeading } from '@/components/ui'
import type { SolutionCategoryPageData } from '@/lib/solutionCategories'

import { ContatoForm } from './ContatoForm'
import { SolutionFilterTabs } from './SolutionFilterTabs'
import { SolutionGrid } from './SolutionGrid'

type SolutionCategoryHubPageProps = SolutionCategoryPageData

export function SolutionCategoryHubPage({
  categoryLabel,
  categoryFilters,
  ctaChecklist,
  ctaChecklistTitle,
  ctaDescription,
  ctaTitle,
  contactDescription,
  contactTitle,
  eyebrow,
  gridDescription,
  gridTitle,
  heroDescription,
  heroImage,
  heroSignals,
  heroStats,
  heroSummary,
  heroTitle,
  introDescription,
  introPillars,
  introTitle,
  slug,
  solutions,
}: SolutionCategoryHubPageProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
        {heroImage ? (
          <div
            className="absolute inset-0 scale-[1.04] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(165deg, rgba(8,14,26,0.95) 0%, rgba(10,18,32,0.88) 46%, rgba(8,14,26,0.96) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 20%, rgba(0,86,166,0.32), transparent 34%), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.1), transparent 22%), radial-gradient(circle at 50% 88%, rgba(40,167,69,0.12), transparent 24%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(180deg, rgba(8,14,26,0.54) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)] lg:items-end">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-3xl text-text-on-dark"
            >
              <Badge className="border border-white/12 bg-white/[0.08] text-white/80 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                {eyebrow}
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/72 sm:mt-6">{heroDescription}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#solucoes-grid"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Explorar esta frente
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

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className="rounded-card border border-white/10 bg-white/[0.05] p-4 text-white shadow-[0_14px_28px_rgba(8,14,26,0.18)] backdrop-blur-sm"
                  >
                    <p className="font-display text-heading-lg font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">{stat.label}</p>
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
                  Leitura da frente
                </p>
                <p className="mt-4 text-body-md text-white/74">{heroSummary}</p>

                <div className="mt-6 space-y-3">
                  {heroSignals.map((signal) => (
                    <div
                      key={signal}
                      className="flex gap-3 rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                    >
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-cta-green"
                        aria-hidden
                      />
                      <p className="text-sm leading-relaxed text-white/68">{signal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-12 pb-20 sm:-mt-16 sm:pb-24">
        <Container>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            className="relative overflow-hidden rounded-panel border border-border bg-white/96 p-5 shadow-[var(--shadow-strong)] backdrop-blur-sm sm:p-8 lg:p-10"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 45%, rgba(15,23,42,0.04) 100%)',
              }}
              aria-hidden
            />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
              <SectionHeading
                eyebrow={`${categoryLabel} em foco`}
                title={introTitle}
                description={introDescription}
              />

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {introPillars.map((pillar) => (
                  <Card
                    key={pillar.title}
                    padding="md"
                    className="border-accent/10 bg-white/88 shadow-[var(--shadow-soft)]"
                  >
                    <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent/80">
                      {pillar.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {pillar.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <section id="solucoes-grid" className="bg-bg-secondary py-20 sm:py-24">
        <Container>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
            className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(280px,0.98fr)] lg:items-end"
          >
            <SectionHeading
              eyebrow="Mapa da frente"
              title={gridTitle}
              description={gridDescription}
            />

            <Card padding="lg" className="border-accent/10 bg-white/90">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent/80">
                Cobertura desta frente
              </p>
              <p className="mt-3 font-display text-heading-xl font-bold text-text-primary">
                {solutions.length} caminhos especializados
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Cada pagina detalha escopo, linguagem tecnica e proximos passos para aprofundar a
                conversa com a Apollo sem perder clareza comercial.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.48, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
            }
            className="mt-8 rounded-panel border border-border/80 bg-white/92 p-5 shadow-[var(--shadow-soft)] sm:p-6"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-center">
              <div>
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Navegue entre frentes
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  O mesmo sistema de filtros do hub principal agora organiza a troca entre
                  categorias e o retorno ao portfolio completo.
                </p>
              </div>

              <SolutionFilterTabs
                filters={categoryFilters}
                activeFilter={slug}
                ariaLabel="Navegar entre frentes de solucao"
              />
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
            }
            className="mt-10"
          >
            <SolutionGrid items={solutions} variant="hub" />
          </motion.div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-bg-dark-section py-20 sm:py-24">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(155deg, rgba(8,14,26,0.96) 0%, rgba(12,22,38,0.92) 48%, rgba(8,14,26,0.98) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(0,86,166,0.28), transparent 32%), radial-gradient(circle at 78% 80%, rgba(40,167,69,0.1), transparent 24%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] lg:items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
              }
              className="max-w-3xl text-white"
            >
              <Badge className="border border-white/12 bg-white/[0.08] text-white/78">
                {categoryLabel}
              </Badge>
              <h2 className="mt-6 font-display text-display-sm font-extrabold tracking-tight text-white sm:text-display-md">
                {ctaTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-body-lg text-white/72">{ctaDescription}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/contato/cotacao"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Solicitar diagnostico
                </Button>
                <Button
                  href="/solucoes"
                  variant="ghost"
                  size="lg"
                  className="rounded-pill border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
                >
                  Ver portfolio completo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <Card tone="dark" padding="lg" className="relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 42%, rgba(0,86,166,0.14) 100%)',
                  }}
                  aria-hidden
                />

                <div className="relative">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/56">
                    {ctaChecklistTitle}
                  </p>
                  <div className="mt-5 space-y-3">
                    {ctaChecklist.map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-card border border-white/10 bg-black/10 p-4"
                      >
                        <span
                          className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-xs font-semibold text-white"
                          aria-hidden
                        >
                          +
                        </span>
                        <p className="text-sm leading-relaxed text-white/72">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Contato consultivo"
            title="Planeje a proxima etapa com a Apollo"
            description={contactDescription}
          />

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
            className="mx-auto mt-10 max-w-5xl"
          >
            <ContatoForm title={contactTitle} />
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
