import type { Metadata } from 'next'

import { ContatoForm } from '@/components/ContatoForm'
import { SolutionGrid, type SolutionItem } from '@/components/SolutionGrid'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type SolutionData = SolutionItem

type PageDoc = {
  meta?: {
    title?: string
    description?: string
    image?: unknown
  }
}

const categorySlug = 'controle-patrimonial'
const orderedSolutionIds = [
  'identificacao-patrimonial',
  'controle-e-inventario-de-estoques',
  'organizacao-patrimonial',
  'processamento-patrimonial',
]

const fallbackHeroSubtitle =
  'Oferecemos as melhores soluções de forma completa para garantir organização, rastreabilidade e governança dos ativos da sua empresa.'

const fallbackSolutions: SolutionData[] = [
  {
    id: 'identificacao-patrimonial',
    title: 'Identificação Patrimonial',
    description: 'Etiquetagem técnica e padronização para rastreabilidade completa dos bens.',
    href: '/solucoes/controle-patrimonial/identificacao-patrimonial',
  },
  {
    id: 'controle-e-inventario-de-estoques',
    title: 'Inventário de Estoques',
    description: 'Inventário físico com metodologia técnica para elevar acuracidade e controle.',
    href: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
  },
  {
    id: 'organizacao-patrimonial',
    title: 'Organização Patrimonial',
    description: 'Estruturação e saneamento da base patrimonial para decisões mais seguras.',
    href: '/solucoes/controle-patrimonial/organizacao-patrimonial',
  },
  {
    id: 'processamento-patrimonial',
    title: 'Processamento Patrimonial',
    description: 'Processamento técnico de dados para conformidade e consistência contábil.',
    href: '/solucoes/controle-patrimonial/processamento-patrimonial',
  },
]

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

export async function generateMetadata(): Promise<Metadata> {
  let title: string | undefined
  let description: string | undefined
  let image: string | undefined

  try {
    const payload = await getPayloadClient()
    const [pageResult, categoryResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: 1,
        where: { slug: { equals: categorySlug } },
        depth: 1,
      }),
      payload.find({
        collection: 'solucao-categories',
        limit: 1,
        where: { slug: { equals: categorySlug } },
        depth: 1,
      }),
    ])

    const pageData = pageResult.docs[0] as PageDoc | undefined
    const category = categoryResult.docs[0] as SolucaoCategory | undefined

    title = normalizeText(pageData?.meta?.title) || normalizeText(category?.title) || undefined
    description = normalizeText(pageData?.meta?.description) || normalizeText(category?.description) || undefined
    image = mediaUrl(pageData?.meta?.image) || mediaUrl(category?.heroImage)
  } catch {
    // Payload may be unavailable during static builds in sandboxed environments.
  }

  return buildMetadata({
    path: '/solucoes/controle-patrimonial',
    title,
    description,
    image,
    fallbackTitle: 'Controle Patrimonial',
    fallbackDescription: fallbackHeroSubtitle,
  })
}

export default async function ControlePatrimonialPage() {
  let categoryTitle: string | undefined
  let categorySubtitle = fallbackHeroSubtitle
  let categoryHeroImage: string | undefined
  let solutions = fallbackSolutions

  try {
    const payload = await getPayloadClient()
    const categoryResult = await payload.find({
      collection: 'solucao-categories',
      limit: 1,
      where: { slug: { equals: categorySlug } },
      depth: 1,
    })

    const category = categoryResult.docs[0] as SolucaoCategory | undefined

    if (category?.id) {
      categoryTitle = category.heroTitle || category.title
      categorySubtitle = category.description || fallbackHeroSubtitle
      categoryHeroImage = mediaUrl(category.heroImage)

      const solutionsResult = await payload.find({
        collection: 'solucoes',
        limit: 20,
        where: { category: { equals: category.id } },
        sort: 'order',
        depth: 1,
      })

      const mappedById = new Map<string, SolutionData>()

      for (const solution of solutionsResult.docs as Solucoe[]) {
        if (!orderedSolutionIds.includes(solution.slug)) continue

        const iconUrl = mediaUrl(solution.icon)
        mappedById.set(solution.slug, {
          id: solution.slug,
          title: solution.title,
          description: solution.shortDescription || 'Solução especializada em controle patrimonial.',
          href: `/solucoes/${categorySlug}/${solution.slug}`,
          ...(iconUrl ? { iconUrl } : {}),
        })
      }

      const orderedSolutions = orderedSolutionIds
        .map((id) => mappedById.get(id))
        .filter((solution): solution is SolutionData => Boolean(solution))

      if (orderedSolutions.length > 0) {
        solutions = orderedSolutions
      }
    }
  } catch {
    // Payload may be unavailable during static builds in sandboxed environments.
  }

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-screen items-center overflow-hidden bg-bg-dark-section">
        {categoryHeroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${categoryHeroImage})` }}
            aria-hidden
          />
        ) : null}
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(0, 86, 166, 0.28), transparent 44%), radial-gradient(circle at 80% 12%, rgba(255, 255, 255, 0.08), transparent 32%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {categoryTitle || (
              <>
                Nós temos a <strong>solução completa</strong> para o{' '}
                <strong>Controle Patrimonial</strong> da sua empresa
              </>
            )}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/90 sm:text-lg">{categorySubtitle}</p>
        </div>
      </section>

      <section className="bg-bg-secondary py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SolutionGrid items={solutions} />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Fique em contato</h2>
            <p className="mx-auto mt-4 max-w-3xl text-text-secondary">
              Fale com nossa equipe para estruturar o Controle Patrimonial da sua empresa com metodologia,
              tecnologia e segurança em todas as etapas.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <ContatoForm title="Converse com um especialista em Controle Patrimonial" />
          </div>
        </div>
      </section>
    </div>
  )
}
