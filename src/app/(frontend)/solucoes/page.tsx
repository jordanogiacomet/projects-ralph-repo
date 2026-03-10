import type { Metadata } from 'next'

import { SolutionsHubPage, type SolutionFilter } from '@/components/SolutionsHubPage'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type PageDoc = {
  heroTitle?: unknown
  meta?: {
    title?: string
    description?: string
    image?: unknown
  }
}

type MediaLike = {
  url?: string | null
}

type SolutionData = {
  id: string
  title: string
  description: string
  href: string
  iconUrl?: string
  filterKeys: string[]
}

const fallbackHeroTitle = 'Nós temos a solução completa para o gerenciamento de ativos'
const fallbackHeroDescription =
  'Da identificação ao controle e às avaliações técnicas, reunimos soluções integradas para elevar segurança, conformidade e performance patrimonial.'

const fallbackSolutions: SolutionData[] = [
  {
    id: 'identificacao-patrimonial',
    title: 'Identificação Patrimonial',
    description: 'Etiquetagem e padronização para rastreabilidade dos ativos.',
    href: '/solucoes/controle-patrimonial/identificacao-patrimonial',
    filterKeys: ['all', 'controle-patrimonial'],
  },
  {
    id: 'controle-e-inventario-de-estoques',
    title: 'Controle e Inventário de Estoques',
    description: 'Inventário técnico para maior acuracidade e governança de estoque.',
    href: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
    filterKeys: ['all', 'controle-patrimonial'],
  },
  {
    id: 'organizacao-patrimonial',
    title: 'Organização Patrimonial',
    description: 'Estruturação de base patrimonial com dados confiáveis.',
    href: '/solucoes/controle-patrimonial/organizacao-patrimonial',
    filterKeys: ['all', 'controle-patrimonial'],
  },
  {
    id: 'processamento-patrimonial',
    title: 'Processamento Patrimonial',
    description: 'Conciliação e saneamento de informações patrimoniais.',
    href: '/solucoes/controle-patrimonial/processamento-patrimonial',
    filterKeys: ['all', 'controle-patrimonial'],
  },
  {
    id: 'teste-de-impairment',
    title: 'Teste de Impairment',
    description: 'Análise de recuperabilidade em conformidade com normas contábeis.',
    href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
    filterKeys: ['all', 'consultoria-e-tecnologia', 'consultoria-ifrs'],
  },
  {
    id: 'revisao-da-vida-util',
    title: 'Revisão da Vida Útil',
    description: 'Revisões técnicas para aderência ao CPC 27 e melhor depreciação.',
    href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
    filterKeys: ['all', 'consultoria-e-tecnologia', 'consultoria-ifrs'],
  },
  {
    id: 'arrendamento-mercantil',
    title: 'Arrendamento Mercantil (CPC 06 / IFRS 16)',
    description: 'Modelagem e suporte para contratos de leasing e IFRS 16.',
    href: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil-cpc-06-ifrs-16',
    filterKeys: ['all', 'consultoria-e-tecnologia', 'consultoria-ifrs'],
  },
  {
    id: 'combinacao-de-negocios',
    title: 'Combinação de Negócios (PPA) – CPC 15',
    description: 'Alocação de preço de compra e suporte técnico para M&A.',
    href: '/solucoes/consultoria-e-tecnologia/combinacao-de-negocios-ppa-cpc-15',
    filterKeys: ['all', 'consultoria-e-tecnologia', 'consultoria-ifrs'],
  },
  {
    id: 'ativos-inteligentes-rfid-e-rtls',
    title: 'Ativos Inteligentes RFID e RTLS',
    description: 'Monitoramento em tempo real para ativos críticos.',
    href: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-e-rtls',
    filterKeys: ['all', 'consultoria-e-tecnologia', 'tecnologia'],
  },
  {
    id: 'softwares',
    title: 'Softwares',
    description: 'Plataformas para inventário, rastreio e gestão de ativos.',
    href: '/solucoes/consultoria-e-tecnologia/softwares',
    filterKeys: ['all', 'consultoria-e-tecnologia', 'tecnologia'],
  },
  {
    id: 'avaliacao-de-ativos',
    title: 'Avaliação de Ativos',
    description: 'Laudos técnicos para valor justo e suporte estratégico.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
    filterKeys: ['all', 'avaliacao-patrimonial'],
  },
  {
    id: 'avaliacao-de-ativos-biologicos',
    title: 'Avaliação de Ativos Biológicos',
    description: 'Valoração especializada para operações do agronegócio.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
    filterKeys: ['all', 'avaliacao-patrimonial'],
  },
  {
    id: 'avaliacao-de-imoveis-urbanos-e-rurais',
    title: 'Avaliação de Imóveis Urbanos e Rurais',
    description: 'Pareceres técnicos em conformidade com normas aplicáveis.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
    filterKeys: ['all', 'avaliacao-patrimonial'],
  },
  {
    id: 'avaliacao-de-maquinas',
    title: 'Avaliação de Máquinas',
    description: 'Diagnóstico técnico para ativos industriais e operacionais.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
    filterKeys: ['all', 'avaliacao-patrimonial'],
  },
]

const fixedFilterOrder = [
  { key: 'all', label: 'Todos' },
  { key: 'avaliacao-patrimonial', label: 'Avaliação Patrimonial' },
  { key: 'controle-patrimonial', label: 'Controle Patrimonial' },
  { key: 'consultoria-ifrs', label: 'Consultoria e IFRS' },
  { key: 'tecnologia', label: 'Tecnologia' },
]

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

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function buildFilterKeys(solution: Solucoe): string[] {
  const keys = new Set<string>(['all'])
  const categorySlug = typeof solution.category === 'object' ? solution.category.slug : ''
  const normalizedTags = (solution.tags || []).map((tag) => normalize(tag))

  if (categorySlug) {
    keys.add(categorySlug)
  }

  const hasTechTag = normalizedTags.some((tag) =>
    ['tecnologia', 'rfid', 'rtls', 'software', 'softwares', 'ativos inteligentes'].includes(tag),
  )
  const hasConsultoriaTag = normalizedTags.some((tag) =>
    ['ifrs', 'consultoria', 'arrendamento', 'impairment', 'vida util', 'cpc'].includes(tag),
  )

  if (categorySlug === 'consultoria-e-tecnologia') {
    if (hasTechTag) keys.add('tecnologia')
    if (hasConsultoriaTag || !hasTechTag) keys.add('consultoria-ifrs')
  } else {
    if (hasTechTag) keys.add('tecnologia')
    if (hasConsultoriaTag) keys.add('consultoria-ifrs')
  }

  return Array.from(keys)
}

function buildFilters(solutions: SolutionData[]): SolutionFilter[] {
  return fixedFilterOrder
    .map((filter) => {
      const count =
        filter.key === 'all'
          ? solutions.length
          : solutions.filter((solution) => solution.filterKeys.includes(filter.key)).length

      return {
        ...filter,
        count,
      }
    })
    .filter((filter) => filter.key === 'all' || filter.count > 0)
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
      where: { slug: { equals: 'solucoes' } },
      depth: 1,
    })

    const pageData = pageResult.docs[0] as PageDoc | undefined
    title = normalizeText(pageData?.meta?.title) || undefined
    description = normalizeText(pageData?.meta?.description) || undefined
    image = mediaUrl(pageData?.meta?.image)
  } catch {
    // Payload may be unavailable during static builds in sandboxed environments.
  }

  return buildMetadata({
    path: '/solucoes',
    title,
    description,
    image,
    fallbackTitle: 'Solucoes para Gestao Patrimonial',
    fallbackDescription:
      'Conheca as solucoes da Apollo Gestao para controle patrimonial, consultoria tecnica e avaliacao de ativos.',
  })
}

export default async function SolucoesPage() {
  let heroTitle = fallbackHeroTitle
  let heroDescription = fallbackHeroDescription
  let solutions = fallbackSolutions

  try {
    const payload = await getPayloadClient()
    const [pageResult, solutionsResult, categoriesResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: 1,
        where: { slug: { equals: 'solucoes' } },
      }),
      payload.find({
        collection: 'solucoes',
        limit: 100,
        sort: 'order',
        depth: 1,
      }),
      payload.find({
        collection: 'solucao-categories',
        limit: 100,
        sort: 'order',
      }),
    ])

    const pageData = pageResult.docs[0] as PageDoc | undefined
    heroTitle = richTextToPlainText(pageData?.heroTitle) || fallbackHeroTitle

    const categoriesById = new Map<number, SolucaoCategory>()
    for (const category of categoriesResult.docs as SolucaoCategory[]) {
      categoriesById.set(category.id, category)
    }

    const mapped: SolutionData[] = (solutionsResult.docs as Solucoe[]).flatMap((solution) => {
        const category =
          typeof solution.category === 'object'
            ? solution.category
            : categoriesById.get(solution.category)

        if (!category?.slug) return []

        return [
          {
          id: String(solution.id),
          title: solution.title,
          description: solution.shortDescription || 'Solução especializada para gestão de ativos.',
          href: `/solucoes/${category.slug}/${solution.slug}`,
          iconUrl: mediaUrl(solution.icon),
          filterKeys: buildFilterKeys({
            ...solution,
            category,
          }),
          },
        ]
      })

    if (mapped.length > 0) {
      solutions = mapped
    }
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  const filters = buildFilters(solutions)

  return (
    <SolutionsHubPage
      heroTitle={heroTitle}
      heroDescription={heroDescription}
      filters={filters}
      solutions={solutions}
    />
  )
}
