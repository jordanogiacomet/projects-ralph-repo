import type { Metadata } from 'next'
import Link from 'next/link'
import { ContatoPageForm } from '@/components/ContatoPageForm'
import { Badge, Button, Card, SectionHeading } from '@/components/ui'
import { FOOTER_DEFAULT_UNIDADES } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type MediaLike = {
  url?: string | null
}

type PageDoc = {
  heroTitle?: unknown
  heroSubtitle?: string
  heroImage?: unknown
  heroCTALabel?: string
  heroCTALink?: string
  meta?: {
    title?: string
    description?: string
    image?: unknown
  }
}

type Unidade = {
  id?: string
  name?: string
  state?: string
  address?: string
  phone?: string
  email?: string
}

type FooterGlobalData = {
  unidades?: Unidade[]
}

const fallbackHeroTitle = 'Entre em contato com a Apollo Gestão'
const fallbackHeroSubtitle =
  'Nossa equipe está pronta para apoiar sua empresa em projetos de avaliação, controle patrimonial e consultoria técnica.'
const fallbackHeroCtaLabel = 'Solicitar cotação'
const fallbackHeroCtaLink = '/contato/cotacao'

const contactRouteOptions = [
  {
    href: '/contato/cotacao',
    eyebrow: 'Fluxo comercial',
    title: 'Solicitar cotação',
    description:
      'Encaminhe escopo, volume estimado e prazo para receber uma proposta tecnica e comercial.',
  },
  {
    href: '/contato/representante',
    eyebrow: 'Parcerias',
    title: 'Cadastro de representante',
    description:
      'Use o fluxo dedicado para relacionamento comercial e expansao regional da Apollo.',
  },
]

const messageGuidance = [
  {
    title: 'Qual frente voce precisa acionar',
    description:
      'Conte se a demanda envolve avaliacao, controle patrimonial, inventario, consultoria ou tecnologia.',
  },
  {
    title: 'Onde o projeto acontece',
    description:
      'Informe a cidade, unidade ou operacao impactada para orientarmos o atendimento regional.',
  },
  {
    title: 'Qual decisao depende disso',
    description:
      'Compartilhe o objetivo do trabalho e qualquer prazo critico para priorizacao do retorno.',
  },
]

const hasString = (value?: string): value is string =>
  typeof value === 'string' && value.trim().length > 0

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

function phoneHref(phone?: string): string | undefined {
  if (!hasString(phone)) return undefined

  const digits = phone.replace(/\D/g, '')

  if (!digits) return undefined

  if (digits.startsWith('55')) {
    return `tel:+${digits}`
  }

  return `tel:+55${digits}`
}

function mergeUnits(unidades?: Unidade[]): Unidade[] {
  if (!Array.isArray(unidades) || unidades.length === 0) {
    return FOOTER_DEFAULT_UNIDADES
  }

  return FOOTER_DEFAULT_UNIDADES.map((defaultUnit, index) => {
    const unit = unidades[index]

    if (!unit) {
      return defaultUnit
    }

    return {
      name: hasString(unit.name) ? unit.name : defaultUnit.name,
      state: hasString(unit.state) ? unit.state : defaultUnit.state,
      address: hasString(unit.address) ? unit.address : defaultUnit.address,
      phone: hasString(unit.phone) ? unit.phone : defaultUnit.phone,
      email: hasString(unit.email) ? unit.email : defaultUnit.email,
    }
  })
}

export async function generateMetadata(): Promise<Metadata> {
  let title: string | undefined
  let description: string | undefined
  let image: string | undefined

  try {
    const payload = await getPayloadClient()
    const pageResult = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: 'contato' } },
      depth: 1,
    })

    const pageData = pageResult.docs[0] as PageDoc | undefined
    title = normalizeText(pageData?.meta?.title) || undefined
    description = normalizeText(pageData?.meta?.description) || undefined
    image = mediaUrl(pageData?.meta?.image) || mediaUrl(pageData?.heroImage)
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  return buildMetadata({
    path: '/contato',
    title,
    description,
    image,
    fallbackTitle: 'Contato - Apollo Gestao',
    fallbackDescription:
      'Entre em contato com a Apollo Gestao para avaliacao patrimonial, controle de ativos e consultoria tecnica.',
  })
}

export default async function ContatoPage() {
  let heroTitle = fallbackHeroTitle
  let heroSubtitle = fallbackHeroSubtitle
  let heroImageUrl: string | undefined
  let heroCtaLabel = fallbackHeroCtaLabel
  let heroCtaLink = fallbackHeroCtaLink
  let unidades: Unidade[] = FOOTER_DEFAULT_UNIDADES

  try {
    const payload = await getPayloadClient()
    const [pageResult, footerGlobal] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: 1,
        where: { slug: { equals: 'contato' } },
      }),
      payload.findGlobal({ slug: 'footer' }),
    ])

    const pageData = pageResult.docs[0] as PageDoc | undefined
    const footerData = footerGlobal as unknown as FooterGlobalData

    heroTitle = richTextToPlainText(pageData?.heroTitle) || fallbackHeroTitle
    heroSubtitle = normalizeText(pageData?.heroSubtitle) || fallbackHeroSubtitle
    heroImageUrl = mediaUrl(pageData?.heroImage)
    heroCtaLabel = normalizeText(pageData?.heroCTALabel) || fallbackHeroCtaLabel
    heroCtaLink = normalizeText(pageData?.heroCTALink) || fallbackHeroCtaLink
    unidades = mergeUnits(footerData.unidades)
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  const coverageStates = Array.from(
    new Set(
      unidades
        .map((unit) => (hasString(unit.state) ? unit.state.trim() : ''))
        .filter((state) => state.length > 0),
    ),
  )
  const coverageLabel =
    coverageStates.length > 0 ? coverageStates.join(' • ') : 'Atendimento nacional'
  const heroHighlights = [
    {
      label: 'Atendimento consultivo',
      description: 'Encaminhamento para demandas tecnicas, institucionais e comerciais.',
    },
    {
      label: 'Presenca regional',
      description: `Operacao coordenada com equipes em ${coverageStates.join(', ') || 'multiplas regioes'}.`,
    },
    {
      label: 'Fluxos dedicados',
      description: 'Contato geral, cotacao e representante com entradas claras para cada necessidade.',
    },
  ]

  return (
    <div className="bg-bg-secondary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section text-text-on-dark">
        {heroImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,14,26,0.9) 0%, rgba(10,18,32,0.82) 44%, rgba(12,22,38,0.94) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(0,86,166,0.34), transparent 42%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.12), transparent 34%), linear-gradient(135deg, rgba(0,86,166,0.08) 0%, transparent 56%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid max-w-content gap-12 px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-end lg:px-12 lg:pb-24">
          <div className="max-w-3xl">
            <Badge tone="dark" className="border border-white/10 bg-white/[0.07] text-white/80">
              Contato Apollo
            </Badge>
            <h1 className="mt-6 font-display text-display-md font-extrabold tracking-[-0.04em] text-white sm:text-display-lg">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-body-md text-white/72 sm:text-body-lg">
              {heroSubtitle}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
              Compartilhe o contexto do projeto, a localidade e o objetivo esperado. Nossa equipe
              direciona o atendimento de forma consultiva e objetiva.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button
                href={heroCtaLink}
                variant="success"
                size="lg"
                trailingIcon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                {heroCtaLabel}
              </Button>
              <Button
                href="#formulario-contato"
                variant="outline"
                size="lg"
                className="border-white/15 bg-white/[0.05] text-white hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
              >
                Enviar mensagem
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroHighlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                >
                  <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/50">
                    {highlight.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/72">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Card
            as="aside"
            tone="dark"
            padding="lg"
            className="relative overflow-hidden border-white/10 bg-white/[0.06] backdrop-blur-sm"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 42%, rgba(0,86,166,0.16) 100%)',
              }}
              aria-hidden
            />
            <div className="relative">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                Encaminhamentos
              </p>
              <h2 className="mt-4 text-heading-xl font-semibold text-white">
                Escolha o fluxo mais adequado para a sua necessidade.
              </h2>
              <p className="mt-3 max-w-xl text-body-sm text-white/68">
                O contato principal funciona como porta de entrada geral. Para propostas comerciais
                estruturadas ou relacionamento com representantes, use os atalhos abaixo.
              </p>

              <div className="mt-8 grid gap-3">
                {contactRouteOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="group motion-transition motion-lift-subtle rounded-[1.3rem] border border-white/12 bg-white/[0.05] p-5 hover:border-white/24 hover:bg-white/[0.09]"
                  >
                    <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                      {option.eyebrow}
                    </p>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-white">{option.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/68">
                          {option.description}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="motion-transition mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/72 group-hover:border-white/20 group-hover:bg-white/[0.12]"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                    Cobertura
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/72">{coverageLabel}</p>
                </div>
                <div>
                  <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                    Direcionamento
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/72">
                    Triagem clara para demandas tecnicas, institucionais e comerciais.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="relative -mt-8 pb-section-loose sm:-mt-10">
        <div className="mx-auto grid max-w-content gap-6 px-6 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-start lg:gap-7 lg:px-12 xl:grid-cols-[minmax(0,1.26fr)_minmax(19rem,0.74fr)]">
          <ContatoPageForm />

          <aside className="space-y-5 lg:pt-3">
            <Card
              as="section"
              padding="md"
              className="relative overflow-hidden border-border/80 bg-white/92"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 55%, rgba(15,23,42,0.04) 100%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <SectionHeading
                  eyebrow="Como agilizar o retorno"
                  size="sm"
                  title="Envie informacoes que ajudem na triagem ja no primeiro contato."
                  description="Alguns detalhes tornam o encaminhamento mais rapido e preciso, especialmente em demandas tecnicas ou com varias unidades envolvidas."
                />

                <div className="mt-6 divide-y divide-border/70">
                  {messageGuidance.map((item, index) => (
                    <div
                      key={item.title}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong">
                          0{index + 1}
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-text-primary">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card as="section" padding="lg" className="relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 52%, rgba(15,23,42,0.04) 100%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <SectionHeading
                  eyebrow="Unidades Apollo"
                  size="sm"
                  title="Atendimento regional com coordenacao integrada."
                  description="Equipes especializadas no Rio Grande do Sul, Santa Catarina e Sao Paulo, com capacidade de encaminhar projetos de forma coordenada."
                />

                <div className="mt-8 grid gap-4">
                  {unidades.map((unit, index) => (
                    <article
                      key={unit.id || `${unit.state}-${index}`}
                      className="rounded-[1.3rem] border border-border bg-white/85 p-4 shadow-[var(--shadow-soft)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-text-primary">
                            {unit.name || 'Apollo Gestão'}
                          </h3>
                          {hasString(unit.address) ? (
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                              {unit.address}
                            </p>
                          ) : null}
                        </div>
                        <Badge tone="accent">{unit.state || 'BR'}</Badge>
                      </div>

                      <div className="mt-4 grid gap-3">
                        {hasString(unit.phone) ? (
                          <a
                            href={phoneHref(unit.phone)}
                            className="motion-transition inline-flex items-center gap-3 text-sm font-medium text-accent hover:text-accent-hover"
                          >
                            <span
                              aria-hidden
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent-strong"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.77.62 2.62a2 2 0 01-.45 2.11L8.01 9.99a16 16 0 006 6l1.54-1.29a2 2 0 012.11-.45c.85.29 1.72.5 2.62.62A2 2 0 0122 16.92z"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span>{unit.phone}</span>
                          </a>
                        ) : null}

                        {hasString(unit.email) ? (
                          <a
                            href={`mailto:${unit.email}`}
                            className="motion-transition inline-flex items-center gap-3 text-sm font-medium text-accent hover:text-accent-hover"
                          >
                            <span
                              aria-hidden
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent-strong"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0 2l8 5 8-5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span className="break-all">{unit.email}</span>
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  )
}
