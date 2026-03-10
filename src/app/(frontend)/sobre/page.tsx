import type { Metadata } from 'next'
import Link from 'next/link'
import { MissaoVisaoValores } from '@/components/MissaoVisaoValores'
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

const fallbackSlides = [
  {
    id: 'missao',
    title: 'Missão',
    description:
      'Proporcionar inteligência e segurança na gestão patrimonial para que empresas tomem decisões estratégicas com dados confiáveis.',
  },
  {
    id: 'visao',
    title: 'Visão',
    description:
      'Ser referência nacional em avaliações e controle patrimonial, unindo excelência técnica, inovação e proximidade com o cliente.',
  },
  {
    id: 'valores',
    title: 'Valores',
    description:
      'Ética, transparência, colaboração e compromisso com resultados sustentáveis de longo prazo para cada organização atendida.',
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

  const originText =
    richTextToPlainText(richBlocks[0]?.content) ||
    'A Apollo Gestão nasceu da inspiração no Deus Apollo, símbolo de luz, conhecimento e precisão. O nome também carrega a expressão GE, de Gestão Empreendedora, que representa nossa forma prática e estratégica de atuar com os ativos dos nossos clientes.'

  const historyText =
    richTextToPlainText(richBlocks[1]?.content) ||
    'Nossa história é construída com propósito: transformar o controle patrimonial em vantagem competitiva. Com metodologia própria e visão consultiva, entregamos diagnósticos técnicos, organização de dados e suporte para decisões com segurança e clareza.'

  const quoteText =
    ctaBlocks[0]?.description ||
    'Assim como Apollo guiava com clareza e direção, a Apollo Gestão orienta empresas para uma governança patrimonial inteligente e sustentável.'

  const slides =
    serviceCardsBlock?.cards
      ?.slice(0, 3)
      .map((card, index) => ({
        id: card.id || `sobre-slide-${index}`,
        title: card.title || fallbackSlides[index]?.title || 'Slide',
        description: card.description || fallbackSlides[index]?.description || '',
        backgroundImageUrl: mediaUrl(card.icon),
      })) || fallbackSlides

  const contactHeading = ctaBlocks[1]?.heading || 'Fique em contato'
  const contactDescription =
    ctaBlocks[1]?.description ||
    'Converse com a equipe da Apollo Gestão e descubra como podemos apoiar sua empresa com soluções patrimoniais sob medida.'
  const contactButtonLabel = ctaBlocks[1]?.buttonLabel || 'Ir para contato'
  const contactButtonLink = ctaBlocks[1]?.buttonLink || '/contato'

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${mediaUrl(pageData?.heroImage) || '/images/sobre-hero-placeholder.jpg'})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="font-display text-display-lg font-bold tracking-tight">
            {richTextToPlainText(pageData?.heroTitle) || (
              <>
                Conheça a história da <strong>Apollo Gestão</strong>
              </>
            )}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-body-lg text-white/90">
            {pageData?.heroSubtitle ? (
              pageData.heroSubtitle
            ) : (
              <>
                Se quiser ir rápido, vá sozinho, <strong>se quiser ir longe, vá acompanhado</strong>
              </>
            )}
          </p>
        </div>
      </section>

      <section className="bg-bg-secondary section-space">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <article className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-heading-2xl font-bold tracking-tight">Origem da Apollo Gestão</h2>
            <p className="mt-4 leading-relaxed text-text-secondary">{originText}</p>
          </article>
          <aside className="rounded-2xl border border-accent/20 bg-accent-light p-6 shadow-sm sm:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Citação</p>
            <blockquote className="mt-3 text-lg font-medium leading-relaxed text-text-primary sm:text-xl">
              “{quoteText}”
            </blockquote>
            <p className="mt-4 text-sm text-text-secondary">Referência mitológica a Apollo</p>
          </aside>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-heading-2xl font-bold tracking-tight">História e propósito</h2>
          <p className="mt-5 leading-relaxed text-text-secondary">{historyText}</p>
        </div>
      </section>

      <MissaoVisaoValores heading={serviceCardsBlock?.heading || 'Missão, Visão e Valores'} slides={slides} />

      <section className="bg-bg-secondary section-space">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-heading-2xl font-bold tracking-tight">{contactHeading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">{contactDescription}</p>
          <Link
            href={contactButtonLink}
            className="mt-8 inline-flex rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
          >
            {contactButtonLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
