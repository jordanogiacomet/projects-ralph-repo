import { HomePage } from '@/components/HomePage'
import { getPayloadClient } from '@/lib/payload'

type MediaLike = {
  url?: string | null
}

type LayoutBlock = {
  blockType?: string
  [key: string]: unknown
}

type HomePageDoc = {
  heroTitle?: unknown
  heroSubtitle?: string
  heroImage?: unknown
  heroCTALabel?: string
  heroCTALink?: string
  layout?: LayoutBlock[]
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

const fallbackServices = [
  {
    id: 'avaliacoes',
    title: 'Avaliações Patrimoniais',
    description:
      'Laudos e análises técnicas para suportar decisões estratégicas, contábeis e regulatórias.',
    link: '/solucoes/avaliacao-patrimonial',
  },
  {
    id: 'controle',
    title: 'Controle Patrimonial',
    description:
      'Inventário, identificação e governança do ciclo de vida dos ativos com dados confiáveis.',
    link: '/solucoes/controle-patrimonial',
  },
  {
    id: 'consultoria',
    title: 'Consultoria e Tecnologia',
    description:
      'Projetos especializados e soluções tecnológicas para elevar eficiência e conformidade.',
    link: '/solucoes/consultoria-e-tecnologia',
  },
]

export default async function Home() {
  let pageData: HomePageDoc | undefined

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      limit: 1,
      where: { slug: { equals: 'home' } },
    })

    pageData = result.docs[0] as HomePageDoc | undefined
  } catch {
    // Payload may not be reachable during build time in sandboxed environments.
  }

  const layout: LayoutBlock[] = pageData?.layout || []
  const serviceCardsBlock = layout.find((block) => block.blockType === 'serviceCardsBlock') as
    | {
        heading?: string
        cards?: {
          id?: string
          title?: string
          description?: string
          link?: string
          icon?: unknown
        }[]
      }
    | undefined
  const ctaBlocks = layout.filter((block) => block.blockType === 'ctaBlock') as {
    heading?: string
    description?: string
    buttonLabel?: string
    buttonLink?: string
  }[]
  const videoBlock = layout.find((block) => block.blockType === 'videoBlock') as
    | { url?: string }
    | undefined
  const imageTextBlock = layout.find((block) => block.blockType === 'imageTextBlock') as
    | { image?: unknown; content?: unknown }
    | undefined

  const services =
    serviceCardsBlock?.cards
      ?.slice(0, 3)
      .map((card, index) => ({
        id: card.id || `service-${index}`,
        title: card.title || fallbackServices[index]?.title || 'Serviço',
        description:
          card.description ||
          fallbackServices[index]?.description ||
          'Soluções para gestão patrimonial.',
        link: card.link || fallbackServices[index]?.link || '/solucoes',
        iconUrl: mediaUrl(card.icon),
      })) || fallbackServices

  return (
    <HomePage
      hero={{
        title:
          richTextToPlainText(pageData?.heroTitle) ||
          'Gerenciamento inteligente dos ativos da sua empresa. Avaliações e Controle Patrimonial de verdade',
        subtitle:
          pageData?.heroSubtitle ||
          'Daqui para frente conte com a Apollo Gestão',
        ctaLabel: pageData?.heroCTALabel || 'Quero um orçamento',
        ctaLink: pageData?.heroCTALink || '/contato/cotacao',
        backgroundImageUrl: mediaUrl(pageData?.heroImage),
        overlayOpacity: 55,
      }}
      servicesHeading={serviceCardsBlock?.heading || 'Nossas soluções para sua empresa'}
      services={services}
      partnerSection={{
        heading:
          ctaBlocks[0]?.heading || 'Seu parceiro em Gestão Patrimonial',
        description:
          ctaBlocks[0]?.description ||
          'Atuamos com metodologia comprovada para garantir confiabilidade dos dados patrimoniais e apoiar decisões estratégicas com segurança.',
        buttonLabel: ctaBlocks[0]?.buttonLabel || 'Quero um orçamento',
        buttonLink: ctaBlocks[0]?.buttonLink || '/contato/cotacao',
      }}
      aboutSection={{
        heading:
          ctaBlocks[1]?.heading || 'Quem é a Apollo? O que nós fazemos?',
        description:
          ctaBlocks[1]?.description ||
          richTextToPlainText(imageTextBlock?.content) ||
          'Somos especialistas em avaliações e controle patrimonial, com atuação consultiva para transformar gestão de ativos em vantagem competitiva.',
        buttonLabel: ctaBlocks[1]?.buttonLabel || 'Saiba mais...',
        buttonLink: ctaBlocks[1]?.buttonLink || '/sobre',
        mediaUrl: mediaUrl(imageTextBlock?.image),
        videoUrl: videoBlock?.url,
      }}
    />
  )
}
