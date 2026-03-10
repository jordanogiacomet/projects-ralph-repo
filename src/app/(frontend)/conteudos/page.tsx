import type { Metadata } from 'next'
import Image from 'next/image'

import { Badge, Button, Container, SectionHeading } from '@/components/ui'
import { fallbackConteudos } from '@/lib/conteudos'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Conteudo } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type ConteudoCard = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  requiresEmail: boolean
  formatLabel: string
}

const fallbackImageUrl = '/images/conteudos/default-cover.svg'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/conteudos',
    fallbackTitle: 'Conteudos Gratuitos - Apollo Gestao',
    fallbackDescription:
      'Baixe e-books e materiais tecnicos gratuitos sobre controle patrimonial, avaliacao de ativos e conformidade contabil.',
  })
}

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
}

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function richTextToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''

  const stack: unknown[] = [value]
  const textParts: string[] = []

  while (stack.length > 0) {
    const node = stack.pop()
    if (!node || typeof node !== 'object') continue

    if ('text' in node && typeof (node as { text?: unknown }).text === 'string') {
      textParts.push((node as { text: string }).text)
    }

    if ('children' in node && Array.isArray((node as { children?: unknown[] }).children)) {
      stack.push(...((node as { children: unknown[] }).children))
    }

    if ('root' in node && (node as { root?: unknown }).root) {
      stack.push((node as { root: unknown }).root)
    }
  }

  return textParts.reverse().join(' ').replace(/\s+/g, ' ').trim()
}

function withTruncatedText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

function resolveFormatLabel(title: string, slug: string): string {
  const source = `${title} ${slug}`.toLowerCase()

  if (source.includes('planilha')) {
    return 'Planilha'
  }

  if (source.includes('checklist')) {
    return 'Checklist'
  }

  if (source.includes('guia') || source.includes('ebook') || source.includes('e-book')) {
    return 'E-book'
  }

  return 'Material tecnico'
}

export default async function ConteudosPage() {
  let cards: ConteudoCard[] = fallbackConteudos.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    requiresEmail: item.requiresEmail,
    formatLabel: resolveFormatLabel(item.title, item.slug),
  }))

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'conteudos',
      limit: 24,
      sort: '-createdAt',
      depth: 1,
    })

    const mapped = (result.docs as Conteudo[])
      .filter((item) => typeof item.slug === 'string' && item.slug.length > 0)
      .map((item) => {
        const description =
          normalizeText(item.description) ||
          richTextToPlainText(item.content) ||
          'Material tecnico gratuito para apoiar decisoes patrimoniais.'

        return {
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          description: withTruncatedText(description, 200),
          imageUrl: mediaUrl(item.featuredImage) || fallbackImageUrl,
          requiresEmail: item.requiresEmail ?? false,
          formatLabel: resolveFormatLabel(item.title, item.slug),
        }
      })

    if (mapped.length > 0) {
      cards = mapped
    }
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  const featuredCard = cards[0]
  const remainingCards = cards.slice(1)
  const gatedCount = cards.filter((item) => item.requiresEmail).length
  const directCount = cards.length - gatedCount

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(8,14,26,0.94) 0%, rgba(12,22,38,0.86) 42%, rgba(8,14,26,0.98) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(0, 86, 166, 0.38), transparent 34%), radial-gradient(circle at 82% 14%, rgba(255, 255, 255, 0.12), transparent 26%), radial-gradient(circle at 50% 92%, rgba(40, 167, 69, 0.14), transparent 28%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(180deg, rgba(8,14,26,0.5) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
            <div className="max-w-3xl text-text-on-dark">
              <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                Biblioteca tecnica Apollo
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8">
                Materiais gratuitos para orientar decisoes patrimoniais com mais clareza.
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/74 sm:mt-6">
                Explore e-books, planilhas e materiais de apoio pensados para equipes que precisam
                alinhar operacao, contabilidade, compliance e governanca de ativos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#materiais-grid"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Explorar biblioteca
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
            </div>

            <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_65px_rgba(8,14,26,0.26)] backdrop-blur-sm sm:p-7">
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
                  Curadoria editorial
                </p>
                <p className="mt-4 text-body-md text-white/74">
                  Cada material foi organizado para apoiar leituras tecnicas mais objetivas e
                  acelerar conversas entre patrimonio, financeiro, auditoria e operacao.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="font-display text-heading-lg font-bold text-white">
                      {cards.length}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">materiais ativos</p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="font-display text-heading-lg font-bold text-white">
                      {gatedCount}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">com liberacao guiada</p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="font-display text-heading-lg font-bold text-white">
                      {directCount}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">com acesso direto</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-12 sm:-mt-16">
        <Container>
          <div className="relative overflow-hidden rounded-panel border border-border bg-white/95 p-5 shadow-strong backdrop-blur-sm sm:p-8">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 45%, rgba(15,23,42,0.04) 100%)',
              }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Biblioteca de materiais"
                title="Escolha o formato mais aderente ao seu momento operacional."
                description="Os materiais agora seguem uma leitura mais editorial, com cards mais fortes, hierarquia mais limpa e uma jornada de download mais clara."
                size="sm"
                className="max-w-2xl"
              />

              <div className="rounded-card border border-border bg-surface-secondary px-4 py-4 shadow-soft sm:min-w-[280px]">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Fluxo de acesso
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Downloads diretos e materiais com registro de e-mail compartilham a mesma camada
                  de conversao, sem quebrar a experiencia de leitura.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="materiais-grid" className="section-space-loose bg-bg-secondary">
        <Container>
          {featuredCard ? (
            <div className="space-y-8">
              <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-white shadow-strong">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 44%, rgba(15,23,42,0.05) 100%)',
                  }}
                  aria-hidden
                />
                <div className="grid gap-0 lg:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)]">
                  <div className="relative min-h-[320px] overflow-hidden bg-accent-light/60">
                    <Image
                      src={featuredCard.imageUrl}
                      alt={featuredCard.title}
                      fill
                      className="motion-media-scale object-cover"
                      sizes="(min-width: 1024px) 42vw, 100vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(25deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0) 44%, rgba(255,255,255,0.22) 100%)',
                      }}
                      aria-hidden
                    />
                  </div>

                  <div className="relative p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="accent">{featuredCard.formatLabel}</Badge>
                      <Badge
                        tone={featuredCard.requiresEmail ? 'dark' : 'success'}
                        className={featuredCard.requiresEmail ? 'bg-bg-dark-elevated text-white' : undefined}
                      >
                        {featuredCard.requiresEmail ? 'Liberacao por e-mail' : 'Download imediato'}
                      </Badge>
                    </div>

                    <h2 className="mt-6 font-display text-heading-2xl font-semibold text-text-primary sm:max-w-2xl">
                      {featuredCard.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-body-md text-text-secondary">
                      {featuredCard.description}
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                        <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                          Uso recomendado
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          Apoiar alinhamentos entre patrimonio, contabilidade, operacao e
                          compliance com um insumo objetivo.
                        </p>
                      </div>
                      <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                        <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                          Experiencia
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          {featuredCard.requiresEmail
                            ? 'Registro simples de e-mail antes da liberacao do arquivo.'
                            : 'Acesso direto ao arquivo a partir da pagina do material.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button
                        href={`/conteudos/${featuredCard.slug}`}
                        size="lg"
                        className="rounded-pill"
                      >
                        Ver material
                      </Button>
                      <Button
                        href="/contato"
                        variant="outline"
                        size="lg"
                        className="rounded-pill"
                      >
                        Solicitar orientacao
                      </Button>
                    </div>
                  </div>
                </div>
              </article>

              {remainingCards.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {remainingCards.map((item) => (
                    <article
                      key={item.id}
                      className="group motion-transition motion-lift-card relative overflow-hidden rounded-panel border border-border bg-white/95 p-5 shadow-soft hover:shadow-strong sm:p-6"
                    >
                      <div
                        className="motion-transition absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.04) 100%)',
                        }}
                        aria-hidden
                      />
                      <div className="relative">
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="accent">{item.formatLabel}</Badge>
                          <Badge tone={item.requiresEmail ? 'neutral' : 'success'}>
                            {item.requiresEmail ? 'Liberacao guiada' : 'Acesso direto'}
                          </Badge>
                        </div>

                        <div className="mt-5 flex items-start gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card border border-border bg-accent-light/70">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="motion-media-scale object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display text-heading-lg font-semibold text-text-primary">
                              {item.title}
                            </h3>
                            <p className="mt-3 text-body-sm text-text-secondary">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                          <span className="text-meta-sm text-text-muted">
                            {item.requiresEmail ? 'Download com qualificacao leve' : 'Pronto para baixar'}
                          </span>
                          <Button
                            href={`/conteudos/${item.slug}`}
                            variant="ghost"
                            size="sm"
                            className="rounded-pill px-0 text-accent hover:bg-transparent hover:text-accent-hover"
                          >
                            Abrir material
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-panel border border-border bg-white p-8 shadow-soft">
              <p className="font-display text-heading-lg font-semibold text-text-primary">
                Nenhum material publicado no momento.
              </p>
              <p className="mt-3 max-w-2xl text-body-md text-text-secondary">
                Assim que novos materiais forem disponibilizados, eles aparecerao nesta
                biblioteca.
              </p>
            </div>
          )}
        </Container>
      </section>

      <section className="relative overflow-hidden bg-bg-dark-section section-space">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(0, 86, 166, 0.28), transparent 36%), radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.1), transparent 28%)',
          }}
          aria-hidden
        />
        <Container className="relative z-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl text-white">
              <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                Apoio consultivo
              </p>
              <h2 className="mt-4 font-display text-heading-2xl font-semibold text-white">
                Precisa de um material mais aderente ao seu contexto?
              </h2>
              <p className="mt-4 text-body-md text-white/72">
                A equipe da Apollo pode orientar a escolha do conteudo certo ou aprofundar a
                conversa a partir do seu cenario patrimonial, contabil ou operacional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                href="/contato"
                variant="success"
                size="lg"
                className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
              >
                Solicitar conversa tecnica
              </Button>
              <Button
                href="/solucoes"
                variant="ghost"
                size="lg"
                className="rounded-pill border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
              >
                Explorar solucoes
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
