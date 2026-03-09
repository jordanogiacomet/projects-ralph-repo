import { ContatoForm } from '@/components/ContatoForm'
import { SolutionGrid, type SolutionItem } from '@/components/SolutionGrid'
import { getPayloadClient } from '@/lib/payload'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type SolutionData = SolutionItem

const categorySlug = 'consultoria-e-tecnologia'
const orderedSolutionSlugs = [
  'teste-de-impairment',
  'revisao-da-vida-util',
  'ativos-inteligentes-rfid-e-rtls',
  'arrendamento-mercantil-cpc-06-ifrs-16',
  'combinacao-de-negocios-ppa-cpc-15',
  'softwares',
]

const fallbackHeroSubtitle =
  'Integramos consultoria contábil e tecnologia para transformar a gestão patrimonial da sua empresa com precisão, conformidade e inovação.'

const fallbackSolutions: SolutionData[] = [
  {
    id: 'teste-de-impairment',
    title: 'Teste de Impairment',
    description: 'Análise de recuperabilidade de ativos conforme normas contábeis vigentes.',
    href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
  },
  {
    id: 'revisao-da-vida-util',
    title: 'Revisão da Vida Útil',
    description: 'Revisões técnicas para aderência ao CPC 27 e maior precisão de depreciação.',
    href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
  },
  {
    id: 'ativos-inteligentes-rfid-e-rtls',
    title: 'Ativos Inteligentes RFID/RTLS',
    description: 'Rastreamento e monitoramento de ativos em tempo real com tecnologia RFID/RTLS.',
    href: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-e-rtls',
  },
  {
    id: 'arrendamento-mercantil-cpc-06-ifrs-16',
    title: 'Arrendamento Mercantil',
    description: 'Suporte técnico para contratos de leasing e aderência ao CPC 06 / IFRS 16.',
    href: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil-cpc-06-ifrs-16',
  },
  {
    id: 'combinacao-de-negocios-ppa-cpc-15',
    title: 'Combinação de Negócios',
    description: 'Alocação de preço de compra (PPA) e apoio especializado em processos de M&A.',
    href: '/solucoes/consultoria-e-tecnologia/combinacao-de-negocios-ppa-cpc-15',
  },
  {
    id: 'softwares',
    title: 'Softwares',
    description: 'Plataformas para inventário, rastreabilidade e gestão integrada de ativos.',
    href: '/solucoes/consultoria-e-tecnologia/softwares',
  },
]

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
}

export default async function ConsultoriaETecnologiaPage() {
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
          description: solution.shortDescription || 'Solução especializada em consultoria e tecnologia patrimonial.',
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
                <strong>Consultoria e Tecnologia</strong> da sua empresa
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
              Converse com nosso time para desenhar uma estratégia combinando consultoria técnica e
              tecnologia para elevar o desempenho da sua gestão patrimonial.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <ContatoForm title="Converse com um especialista em Consultoria e Tecnologia" />
          </div>
        </div>
      </section>
    </div>
  )
}
