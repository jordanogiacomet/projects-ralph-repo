import { ContatoForm } from '@/components/ContatoForm'
import { SolutionGrid, type SolutionItem } from '@/components/SolutionGrid'
import { getPayloadClient } from '@/lib/payload'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type SolutionData = SolutionItem

const categorySlug = 'avaliacao-patrimonial'
const orderedSolutionSlugs = [
  'avaliacao-de-ativos',
  'avaliacao-de-ativos-biologicos',
  'avaliacao-de-imoveis-urbanos-e-rurais',
  'avaliacao-de-maquinas',
]

const fallbackHeroSubtitle =
  'Realizamos avaliações patrimoniais com metodologia técnica e aderência normativa para apoiar decisões estratégicas e garantir segurança contábil.'

const fallbackSolutions: SolutionData[] = [
  {
    id: 'avaliacao-de-ativos',
    title: 'Avaliação de Ativos',
    description: 'Laudos técnicos para mensuração de ativos com precisão, rastreabilidade e respaldo contábil.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
  },
  {
    id: 'avaliacao-de-ativos-biologicos',
    title: 'Avaliação de Ativos Biológicos',
    description: 'Modelagem e valuation de ativos biológicos alinhados aos critérios técnicos e regulatórios.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
  },
  {
    id: 'avaliacao-de-imoveis-urbanos-e-rurais',
    title: 'Avaliação de Imóveis Urbanos e Rurais',
    description: 'Avaliação imobiliária para ativos urbanos e rurais com base em normas e evidências de mercado.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
  },
  {
    id: 'avaliacao-de-maquinas',
    title: 'Avaliação de Máquinas',
    description: 'Parecer técnico para máquinas e equipamentos, considerando estado, mercado e vida útil.',
    href: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
  },
]

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
}

export default async function AvaliacaoPatrimonialPage() {
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
        limit: 30,
        where: { category: { equals: category.id } },
        sort: 'order',
        depth: 1,
      })

      const mappedBySlug = new Map<string, SolutionData>()

      for (const solution of solutionsResult.docs as Solucoe[]) {
        if (!orderedSolutionSlugs.includes(solution.slug)) continue

        const iconUrl = mediaUrl(solution.icon)
        mappedBySlug.set(solution.slug, {
          id: solution.slug,
          title: solution.title,
          description: solution.shortDescription || 'Solução especializada em avaliação patrimonial.',
          href: `/solucoes/${categorySlug}/${solution.slug}`,
          ...(iconUrl ? { iconUrl } : {}),
        })
      }

      const orderedSolutions = orderedSolutionSlugs
        .map((slug) => mappedBySlug.get(slug))
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
                Nós temos a <strong>solução completa</strong> para a{' '}
                <strong>Avaliação Patrimonial</strong> da sua empresa
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
              Conte com nosso time para desenvolver uma avaliação patrimonial técnica, confiável e alinhada
              às necessidades do seu negócio.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <ContatoForm title="Converse com um especialista em Avaliação Patrimonial" />
          </div>
        </div>
      </section>
    </div>
  )
}
