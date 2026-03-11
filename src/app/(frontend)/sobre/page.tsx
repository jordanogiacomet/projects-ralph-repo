import type { Metadata } from 'next'

import { MissaoVisaoValores } from '@/components/MissaoVisaoValores'
import { Badge, Button, Card, Container, SectionHeading } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type MediaLike = {
  url?: string | null
}

type LayoutBlock = {
  blockType?: string
  [key: string]: unknown
}

type AboutPageDoc = {
  heroTitle?: unknown
  heroSubtitle?: string
  heroImage?: unknown
  heroCTALabel?: string
  heroCTALink?: string
  layout?: LayoutBlock[]
  meta?: {
    title?: string
    description?: string
    image?: unknown
  }
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
      stack.push(...(node as { children: unknown[] }).children)
    }

    if ('root' in node && (node as { root?: unknown }).root) {
      stack.push((node as { root: unknown }).root)
    }
  }

  return textParts.reverse().join(' ').replace(/\s+/g, ' ').trim()
}

function excerptText(value: string, maxLength: number): string {
  const normalizedValue = normalizeText(value)

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength).trimEnd()}...`
}

const fallbackSlides = [
  {
    id: 'missao',
    title: 'Missao',
    description:
      'Proporcionar inteligencia e seguranca na gestao patrimonial para que empresas tomem decisoes estrategicas com dados confiaveis.',
  },
  {
    id: 'visao',
    title: 'Visao',
    description:
      'Ser referencia nacional em avaliacoes e controle patrimonial, unindo excelencia tecnica, inovacao e proximidade com o cliente.',
  },
  {
    id: 'valores',
    title: 'Valores',
    description:
      'Etica, transparencia, colaboracao e compromisso com resultados sustentaveis de longo prazo para cada organizacao atendida.',
  },
]

const institutionalStats = [
  { value: '20+', label: 'anos de atuacao consultiva' },
  { value: '500+', label: 'clientes e grupos apoiados' },
  { value: 'Brasil', label: 'operacao com cobertura nacional' },
  { value: 'Tecnica', label: 'leitura patrimonial e executiva' },
]

const heroHighlights = [
  {
    label: 'Clareza institucional',
    description:
      'A pagina sobre agora acompanha a mesma hierarquia visual das rotas principais do redesign.',
  },
  {
    label: 'Metodo consultivo',
    description:
      'Apollo conecta contexto, diagnostico e continuidade operacional sem perder objetividade comercial.',
  },
  {
    label: 'Entrega madura',
    description:
      'Tipografia, superficies e CTA passam a refletir melhor o posicionamento premium da marca.',
  },
]

const deliveryPillars = [
  {
    title: 'Leitura executiva',
    description:
      'Projetos tecnicos sao apresentados com contexto, prioridades e caminho de decisao para liderancas.',
  },
  {
    title: 'Campo e governanca',
    description:
      'Inventario, avaliacao e organizacao de base se conectam a uma visao continua de controle patrimonial.',
  },
  {
    title: 'Parceria de longo prazo',
    description:
      'A relacao com o cliente e tratada como continuidade consultiva, e nao como entrega isolada.',
  },
]

async function getSobrePageDoc(): Promise<AboutPageDoc | undefined> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: 'sobre' } },
    })

    return result.docs[0] as AboutPageDoc | undefined
  } catch {
    return undefined
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getSobrePageDoc()

  return buildMetadata({
    path: '/sobre',
    title: pageData?.meta?.title,
    description: pageData?.meta?.description,
    image: mediaUrl(pageData?.meta?.image) || mediaUrl(pageData?.heroImage),
    fallbackTitle: 'Sobre a Apollo Gestao',
    fallbackDescription:
      'Conheca a historia, missao e valores da Apollo Gestao em avaliacoes e controle patrimonial.',
  })
}

export default async function SobrePage() {
  const pageData = await getSobrePageDoc()

  const layout: LayoutBlock[] = pageData?.layout || []
  const richBlocks = layout.filter((block) => block.blockType === 'richContentBlock') as {
    content?: unknown
  }[]
  const ctaBlocks = layout.filter((block) => block.blockType === 'ctaBlock') as {
    heading?: string
    description?: string
    buttonLabel?: string
    buttonLink?: string
  }[]
  const serviceCardsBlock = layout.find((block) => block.blockType === 'serviceCardsBlock') as
    | {
        heading?: string
        cards?: {
          id?: string
          title?: string
          description?: string
          icon?: unknown
        }[]
      }
    | undefined

  const heroTitle =
    richTextToPlainText(pageData?.heroTitle) || 'Conheca a historia da Apollo Gestao'
  const heroSubtitle =
    normalizeText(pageData?.heroSubtitle) ||
    'Uma empresa orientada por clareza, metodo e proximidade para apoiar gestao patrimonial, avaliacao e governanca com seguranca.'
  const heroImageUrl = mediaUrl(pageData?.heroImage)
  const heroCtaLabel = normalizeText(pageData?.heroCTALabel) || 'Falar com especialistas'
  const heroCtaLink = normalizeText(pageData?.heroCTALink) || '/contato'

  const originText =
    richTextToPlainText(richBlocks[0]?.content) ||
    'A Apollo Gestao nasceu da inspiracao no Deus Apollo, simbolo de luz, conhecimento e precisao. O nome tambem carrega a expressao GE, de Gestao Empreendedora, que representa nossa forma pratica e estrategica de atuar com os ativos dos nossos clientes.'

  const historyText =
    richTextToPlainText(richBlocks[1]?.content) ||
    'Nossa historia e construida com proposito: transformar o controle patrimonial em vantagem competitiva. Com metodologia propria e visao consultiva, entregamos diagnosticos tecnicos, organizacao de dados e suporte para decisoes com seguranca e clareza.'

  const quoteText =
    normalizeText(ctaBlocks[0]?.description) ||
    'Assim como Apollo guiava com clareza e direcao, a Apollo Gestao orienta empresas para uma governanca patrimonial inteligente e sustentavel.'

  const slides =
    serviceCardsBlock?.cards?.slice(0, 3).map((card, index) => ({
      id: card.id || `sobre-slide-${index}`,
      title: card.title || fallbackSlides[index]?.title || 'Slide',
      description: card.description || fallbackSlides[index]?.description || '',
      backgroundImageUrl: mediaUrl(card.icon),
    })) || fallbackSlides

  const contactHeading = normalizeText(ctaBlocks[1]?.heading) || 'Fique em contato'
  const contactDescription =
    normalizeText(ctaBlocks[1]?.description) ||
    'Converse com a equipe da Apollo Gestao e descubra como podemos apoiar sua empresa com solucoes patrimoniais sob medida.'
  const contactButtonLabel = normalizeText(ctaBlocks[1]?.buttonLabel) || 'Ir para contato'
  const contactButtonLink = normalizeText(ctaBlocks[1]?.buttonLink) || '/contato'

  const identityCards = [
    {
      eyebrow: 'Origem',
      title: 'O nome Apollo traduz luz, conhecimento e precisao aplicados a ativos e governanca.',
      description: excerptText(originText, 180),
    },
    {
      eyebrow: 'Historia',
      title:
        'A empresa evoluiu para transformar controle patrimonial em leitura tecnica acionavel.',
      description: excerptText(historyText, 180),
    },
    {
      eyebrow: 'Direcao',
      title: 'A identidade institucional continua seria, consultiva e orientada a longo prazo.',
      description: excerptText(quoteText, 170),
    },
  ]

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
        {heroImageUrl ? (
          <div
            className="absolute inset-0 scale-[1.04] bg-cover bg-center opacity-28"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(164deg, rgba(8,14,26,0.96) 0%, rgba(10,18,32,0.9) 42%, rgba(8,14,26,0.98) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(0,86,166,0.34), transparent 36%), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.1), transparent 24%), radial-gradient(circle at 48% 88%, rgba(40,167,69,0.12), transparent 26%)',
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
            <div className="max-w-3xl text-text-on-dark">
              <Badge className="border border-white/12 bg-white/[0.08] text-white/80 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                Institucional Apollo
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8 sm:text-display-lg">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/72 sm:mt-6">{heroSubtitle}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={heroCtaLink}
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  {heroCtaLabel}
                </Button>
                <Button
                  href="/solucoes"
                  variant="inverted"
                  size="lg"
                  className="rounded-pill"
                >
                  Explorar solucoes
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-card border border-white/10 bg-white/[0.05] p-4 text-white shadow-[0_14px_28px_rgba(8,14,26,0.18)] backdrop-blur-sm"
                  >
                    <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/52">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>
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
                    'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%, rgba(0,86,166,0.16) 100%)',
                }}
                aria-hidden
              />

              <div className="relative">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                  Leitura institucional
                </p>
                <h2 className="mt-4 font-display text-heading-xl font-semibold text-white">
                  Uma marca guiada por clareza, metodo e compromisso de longo prazo.
                </h2>
                <p className="mt-4 text-body-sm leading-relaxed text-white/72">
                  {excerptText(originText, 210)}
                </p>

                <div className="mt-6 rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/48">
                    Direcao da marca
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/74">
                    &quot;{quoteText}&quot;
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {institutionalStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-card border border-white/10 bg-white/[0.05] p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                    >
                      <p className="font-display text-heading-lg font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-12 pb-[var(--space-section-loose)] sm:-mt-16">
        <Container>
          <div className="relative overflow-hidden rounded-panel border border-border bg-white/96 p-5 shadow-[var(--shadow-strong)] backdrop-blur-sm sm:p-8 lg:p-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 45%, rgba(15,23,42,0.04) 100%)',
              }}
              aria-hidden
            />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
              <SectionHeading
                eyebrow="Trajetoria Apollo"
                title="A pagina sobre agora acompanha a maturidade visual das rotas principais."
                description="A revisao troca o bloco institucional antigo por uma composicao com mais hierarquia, melhor controle de spacing e uma leitura mais consultiva da marca."
              />

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {identityCards.map((card) => (
                  <Card
                    key={card.eyebrow}
                    padding="md"
                    className="border-accent/10 bg-white/90 shadow-[var(--shadow-soft)]"
                  >
                    <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent/80">
                      {card.eyebrow}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-text-primary">
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {card.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bg-secondary section-space-loose">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-start">
          <Card padding="lg" className="bg-white/94">
            <SectionHeading
              eyebrow="Historia e proposito"
              title="Uma empresa orientada por metodo, proximidade e continuidade."
              description="A narrativa institucional ganha um ritmo mais claro entre contexto, principios e proximos passos, sem perder sobriedade."
            />

            <p className="mt-6 text-body-md leading-8 text-text-secondary">{historyText}</p>

            <div className="mt-8 rounded-card border border-accent/10 bg-accent-soft/60 p-5">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
                Direcao institucional
              </p>
              <p className="mt-3 text-body-md leading-7 text-text-primary">
                &quot;{quoteText}&quot;
              </p>
            </div>
          </Card>

          <div className="grid gap-5">
            <Card tone="dark" padding="lg" className="relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 18% 14%, rgba(0,86,166,0.26), transparent 40%), linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                }}
                aria-hidden
              />

              <div className="relative">
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                  Indicadores institucionais
                </p>
                <h2 className="mt-4 font-display text-heading-xl font-semibold text-white">
                  A marca comunica experiencia, escala e profundidade tecnica sem virar uma vitrine
                  generica.
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {institutionalStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-card border border-white/10 bg-white/[0.05] p-4"
                    >
                      <p className="font-display text-heading-lg font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card padding="lg" className="bg-white/94">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
                Entrega Apollo
              </p>
              <div className="mt-5 space-y-3">
                {deliveryPillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-card border border-border bg-surface-secondary/86 p-4 shadow-soft"
                  >
                    <p className="text-sm font-semibold text-text-primary">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <MissaoVisaoValores
        heading={serviceCardsBlock?.heading || 'Missao, Visao e Valores'}
        slides={slides}
      />

      <section className="relative overflow-hidden bg-bg-dark-section section-space-loose">
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

        <Container className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)] lg:items-center">
          <div className="max-w-3xl text-white">
            <Badge className="border border-white/12 bg-white/[0.08] text-white/78">
              Relacionamento consultivo
            </Badge>
            <h2 className="mt-6 font-display text-display-sm font-extrabold tracking-tight text-white sm:text-display-md">
              {contactHeading}
            </h2>
            <p className="mt-5 max-w-2xl text-body-lg text-white/72">{contactDescription}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href={contactButtonLink}
                variant="success"
                size="lg"
                className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
              >
                {contactButtonLabel}
              </Button>
              <Button
                href="/contato/cotacao"
                variant="inverted"
                size="lg"
                className="rounded-pill"
              >
                Solicitar cotacao
              </Button>
            </div>
          </div>

          <Card
            tone="dark"
            padding="lg"
            className="relative overflow-hidden border-white/10 bg-white/[0.06] backdrop-blur-sm"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%, rgba(0,86,166,0.16) 100%)',
              }}
              aria-hidden
            />

            <div className="relative">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                Como a conversa comeca
              </p>
              <div className="mt-5 space-y-3">
                {deliveryPillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                  >
                    <p className="text-sm font-semibold text-white">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  )
}
