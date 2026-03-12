import type { Metadata } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type PageDoc = {
  meta?: {
    title?: string
    description?: string
    image?: unknown
  }
}

type SolutionCategoryMetric = {
  value: string
  label: string
}

type SolutionCategoryPillar = {
  title: string
  description: string
}

type SolutionCategorySolution = {
  id: string
  title: string
  description: string
  href: string
  iconUrl?: string
  categoryLabel?: string
}

type SolutionCategoryFilterLink = {
  key: string
  label: string
  href: string
  count: number
}

type SolutionCategoryStory = {
  eyebrow: string
  heroTitle: string
  heroSummary: string
  heroSignals: string[]
  heroStats: SolutionCategoryMetric[]
  introTitle: string
  introDescription: string
  introPillars: SolutionCategoryPillar[]
  gridTitle: string
  gridDescription: string
  ctaTitle: string
  ctaDescription: string
  ctaChecklistTitle: string
  ctaChecklist: string[]
  contactTitle: string
  contactDescription: string
}

type SolutionCategoryConfig = {
  slug: SolutionCategorySlug
  path: string
  fallbackCategoryTitle: string
  fallbackDescription: string
  orderedSolutionSlugs: string[]
  fallbackSolutions: SolutionCategorySolution[]
  story: SolutionCategoryStory
}

export type SolutionCategorySlug =
  | 'avaliacao-patrimonial'
  | 'controle-patrimonial'
  | 'consultoria-e-tecnologia'

export type SolutionCategoryPageData = SolutionCategoryStory & {
  slug: SolutionCategorySlug
  categoryLabel: string
  categoryFilters: SolutionCategoryFilterLink[]
  heroTitle: string
  heroDescription: string
  heroImage?: string
  heroStats: SolutionCategoryMetric[]
  solutions: SolutionCategorySolution[]
}

const solutionCategoryConfigs: Record<SolutionCategorySlug, SolutionCategoryConfig> = {
  'avaliacao-patrimonial': {
    slug: 'avaliacao-patrimonial',
    path: '/solucoes/avaliacao-patrimonial',
    fallbackCategoryTitle: 'Avaliacao Patrimonial',
    fallbackDescription:
      'Realizamos avaliacoes patrimoniais com metodologia tecnica e aderencia normativa para apoiar decisoes estrategicas e garantir seguranca contabil.',
    orderedSolutionSlugs: [
      'avaliacao-de-ativos',
      'avaliacao-de-ativos-biologicos',
      'avaliacao-de-imoveis-urbanos-e-rurais',
      'avaliacao-de-maquinas',
    ],
    fallbackSolutions: [
      {
        id: 'avaliacao-de-ativos',
        title: 'Avaliacao de Ativos',
        description:
          'Laudos tecnicos para mensuracao de ativos com precisao, rastreabilidade e respaldo contabil.',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
      },
      {
        id: 'avaliacao-de-ativos-biologicos',
        title: 'Avaliacao de Ativos Biologicos',
        description:
          'Modelagem e valuation de ativos biologicos alinhados aos criterios tecnicos e regulatorios.',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
      },
      {
        id: 'avaliacao-de-imoveis-urbanos-e-rurais',
        title: 'Avaliacao de Imoveis Urbanos e Rurais',
        description:
          'Avaliacao imobiliaria para ativos urbanos e rurais com base em normas e evidencias de mercado.',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
      },
      {
        id: 'avaliacao-de-maquinas',
        title: 'Avaliacao de Maquinas',
        description:
          'Parecer tecnico para maquinas e equipamentos, considerando estado, mercado e vida util.',
        href: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
      },
    ],
    story: {
      eyebrow: 'Avaliacao patrimonial',
      heroTitle: 'Avaliacao patrimonial para decisoes contabeis, regulatorias e estrategicas',
      heroSummary:
        'A Apollo organiza laudos, pareceres e leitura executiva para contextos em que valor, risco e governanca precisam aparecer com clareza.',
      heroSignals: [
        'Valuation e laudos para auditoria, compliance e operacoes corporativas.',
        'Leitura combinada de ativos, imoveis e maquinario com criterio tecnico consistente.',
        'Narrativa mais clara para decisores que precisam defender premissas e resultados.',
      ],
      heroStats: [
        { value: 'CPC / IFRS', label: 'referencias tecnicas que orientam as entregas' },
        { value: 'Valor justo', label: 'base para revisoes, transacoes e governanca' },
      ],
      introTitle:
        'Transformamos uma demanda tecnica em uma frente narrativa para auditoria, governanca e investimento.',
      introDescription:
        'A pagina organiza a avaliacao patrimonial como uma trilha consultiva: escopo, criterio e profundidade ficam mais claros antes mesmo da primeira conversa comercial.',
      introPillars: [
        {
          title: 'Mensuracao defendavel',
          description:
            'Premissas, evidencias e metodologia apresentados com mais clareza para times tecnicos e executivos.',
        },
        {
          title: 'Escopo certo para cada ativo',
          description:
            'Frentes separadas por natureza patrimonial para acelerar o entendimento do recorte ideal.',
        },
        {
          title: 'Leitura comercial madura',
          description:
            'O hub aproxima valor percebido e rigor tecnico sem soar burocratico ou mecanico.',
        },
      ],
      gridTitle: 'Escolha o recorte de avaliacao mais aderente ao momento da operacao.',
      gridDescription:
        'Cada pagina aprofunda o tipo de ativo, a aplicacao e a linguagem de entrega para facilitar comparacao e encaminhamento comercial.',
      ctaTitle:
        'Quando a companhia precisa sustentar valor, revisao ou transacao, a frente certa encurta o caminho.',
      ctaDescription:
        'A Apollo ajuda a traduzir uma exigencia tecnica em uma decisao mais segura para auditoria, compliance, reorganizacao societaria ou atualizacao patrimonial.',
      ctaChecklistTitle: 'Cenarios em que esta frente ganha prioridade',
      ctaChecklist: [
        'Reestruturacoes, M&A ou reorganizacoes societarias com impacto patrimonial relevante.',
        'Auditorias, revisoes contabeis ou governanca que exigem premissas mais defendaveis.',
        'Atualizacao de valor justo, vida util ou referencia de mercado para ativos criticos.',
      ],
      contactTitle: 'Converse com um especialista em Avaliacao Patrimonial',
      contactDescription:
        'Compartilhe o contexto da avaliacao para que a equipe Apollo aponte o recorte tecnico e a melhor linha de aprofundamento.',
    },
  },
  'controle-patrimonial': {
    slug: 'controle-patrimonial',
    path: '/solucoes/controle-patrimonial',
    fallbackCategoryTitle: 'Controle Patrimonial',
    fallbackDescription:
      'Oferecemos as melhores solucoes de forma completa para garantir organizacao, rastreabilidade e governanca dos ativos da sua empresa.',
    orderedSolutionSlugs: [
      'etiquetas-patrimoniais-inteligentes',
      'controle-e-inventario-de-estoques',
      'organizacao-patrimonial',
      'processamento-patrimonial',
    ],
    fallbackSolutions: [
      {
        id: 'etiquetas-patrimoniais-inteligentes',
        title: 'Etiquetas Patrimoniais Inteligentes',
        description: 'Etiquetagem tecnica e padronizacao para rastreabilidade completa dos bens.',
        href: '/solucoes/controle-patrimonial/etiquetas-patrimoniais-inteligentes',
      },
      {
        id: 'controle-e-inventario-de-estoques',
        title: 'Inventario de Estoques',
        description:
          'Inventario fisico com metodologia tecnica para elevar acuracidade e controle.',
        href: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
      },
      {
        id: 'organizacao-patrimonial',
        title: 'Organizacao Patrimonial',
        description: 'Estruturacao e saneamento da base patrimonial para decisoes mais seguras.',
        href: '/solucoes/controle-patrimonial/organizacao-patrimonial',
      },
      {
        id: 'processamento-patrimonial',
        title: 'Processamento Patrimonial',
        description: 'Processamento tecnico de dados para conformidade e consistencia contabil.',
        href: '/solucoes/controle-patrimonial/processamento-patrimonial',
      },
    ],
    story: {
      eyebrow: 'Controle patrimonial',
      heroTitle: 'Controle patrimonial com base confiavel para operar, auditar e escalar',
      heroSummary:
        'Esta frente conecta inventario, identificacao, organizacao e tratamento de base para que o patrimonio deixe de ser um ponto cego operacional.',
      heroSignals: [
        'Visibilidade de ativos para rotinas de campo, auditoria e governanca continua.',
        'Rastreabilidade tecnica com menos friccao entre operacao, financeiro e controladoria.',
        'Base patrimonial preparada para ganhar escala sem acumular inconsistencias.',
      ],
      heroStats: [
        { value: 'Campo + base', label: 'operacao e saneamento tratados como uma mesma trilha' },
        { value: 'Rastreabilidade', label: 'identificacao e dados com leitura mais clara' },
      ],
      introTitle:
        'Abertura consultiva para uma frente que precisa parecer organizada antes mesmo da execucao.',
      introDescription:
        'O novo hub trata controle patrimonial como um dominio completo, com hierarquia visual mais calma e narrativa mais aderente a quem busca previsibilidade operacional.',
      introPillars: [
        {
          title: 'Mapeamento com metodo',
          description:
            'A pagina deixa mais claro onde a Apollo entra para estruturar inventario, saneamento e governanca.',
        },
        {
          title: 'Operacao que conversa com dados',
          description:
            'Os servicos aparecem como uma trilha integrada, e nao como um conjunto de etapas soltas.',
        },
        {
          title: 'Valor percebido mais alto',
          description:
            'O tratamento visual aproxima o hub de uma plataforma consultiva premium, sem perder tom institucional.',
        },
      ],
      gridTitle:
        'Navegue pelas frentes que estruturam base, rastreio e confiabilidade patrimonial.',
      gridDescription:
        'As paginas detalhadas mostram onde cada recorte entra na rotina da empresa e como ele se conecta ao restante da operacao patrimonial.',
      ctaTitle:
        'Quanto mais cedo a base patrimonial fica confiavel, menor o custo de corrigir a operacao depois.',
      ctaDescription:
        'A Apollo apoia empresas que precisam sair de controles fragmentados para uma camada patrimonial mais rastreavel, organizada e pronta para governanca.',
      ctaChecklistTitle: 'Momentos em que a frente pede acao imediata',
      ctaChecklist: [
        'Inventarios recorrentes com baixa acuracidade ou pouca visibilidade sobre os bens.',
        'Bases legadas, conciliacoes manuais e dificuldade para localizar ativos criticos.',
        'Projetos de organizacao, etiquetagem ou processamento patrimonial em varias unidades.',
      ],
      contactTitle: 'Converse com um especialista em Controle Patrimonial',
      contactDescription:
        'Explique o contexto operacional e a equipe Apollo indica a frente mais adequada para estruturar a base patrimonial da empresa.',
    },
  },
  'consultoria-e-tecnologia': {
    slug: 'consultoria-e-tecnologia',
    path: '/solucoes/consultoria-e-tecnologia',
    fallbackCategoryTitle: 'Consultoria e Tecnologia',
    fallbackDescription:
      'Integramos consultoria contabil e tecnologia para transformar a gestao patrimonial da sua empresa com precisao, conformidade e inovacao.',
    orderedSolutionSlugs: [
      'teste-de-impairment',
      'revisao-da-vida-util',
      'ativos-inteligentes-rfid-e-rtls',
      'arrendamento-mercantil-cpc-06-ifrs-16',
      'combinacao-de-negocios-ppa-cpc-15',
      'softwares',
    ],
    fallbackSolutions: [
      {
        id: 'teste-de-impairment',
        title: 'Teste de Impairment',
        description: 'Analise de recuperabilidade de ativos conforme normas contabeis vigentes.',
        href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
      },
      {
        id: 'revisao-da-vida-util',
        title: 'Revisao da Vida Util',
        description: 'Revisoes tecnicas para aderencia ao CPC 27 e maior precisao de depreciacao.',
        href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
      },
      {
        id: 'ativos-inteligentes-rfid-e-rtls',
        title: 'Ativos Inteligentes RFID/RTLS',
        description:
          'Rastreamento e monitoramento de ativos em tempo real com tecnologia RFID/RTLS.',
        href: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-e-rtls',
      },
      {
        id: 'arrendamento-mercantil-cpc-06-ifrs-16',
        title: 'Arrendamento Mercantil',
        description: 'Suporte tecnico para contratos de leasing e aderencia ao CPC 06 / IFRS 16.',
        href: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil-cpc-06-ifrs-16',
      },
      {
        id: 'combinacao-de-negocios-ppa-cpc-15',
        title: 'Combinacao de Negocios',
        description: 'Alocacao de preco de compra (PPA) e apoio especializado em processos de M&A.',
        href: '/solucoes/consultoria-e-tecnologia/combinacao-de-negocios-ppa-cpc-15',
      },
      {
        id: 'softwares',
        title: 'Softwares',
        description: 'Plataformas para inventario, rastreabilidade e gestao integrada de ativos.',
        href: '/solucoes/consultoria-e-tecnologia/softwares',
      },
    ],
    story: {
      eyebrow: 'Consultoria e tecnologia',
      heroTitle: 'Consultoria e tecnologia para frentes patrimoniais de maior complexidade',
      heroSummary:
        'A Apollo combina profundidade normativa e camada tecnologica para cenarios em que compliance, performance e escala precisam evoluir juntos.',
      heroSignals: [
        'Leitura mais clara para temas como impairment, vida util, arrendamento e combinacao de negocios.',
        'Tecnologia aplicada a rastreio, monitoramento e plataformas operacionais de apoio patrimonial.',
        'Composicao mais madura entre rigor tecnico e percepcao de produto contemporaneo.',
      ],
      heroStats: [
        { value: 'IFRS + tecnologia', label: 'consultoria e plataforma convivendo no mesmo hub' },
        {
          value: 'Alta complexidade',
          label: 'frentes para decisoes sensiveis e contextos regulados',
        },
      ],
      introTitle:
        'Uma abertura mais narrativa para o dominio em que profundidade tecnica e produto precisam andar juntos.',
      introDescription:
        'O hub passa a apresentar esta categoria como uma frente sofisticada de consultoria, tecnologia e suporte a decisoes, com composicao mais premium e hierarquia mais calma.',
      introPillars: [
        {
          title: 'Consultoria especializada',
          description:
            'Os temas normativos ganham enquadramento mais claro para decisores e equipes tecnicas.',
        },
        {
          title: 'Tecnologia aplicada',
          description:
            'A camada digital deixa de parecer acessorio e passa a compor a proposta de valor com mais conviccao.',
        },
        {
          title: 'Narrativa mais coesa',
          description:
            'A experiencia conversa melhor com homepage, shell e hub principal de solucoes.',
        },
      ],
      gridTitle:
        'Explore os recortes que combinam suporte normativo, profundidade analitica e capacidade operacional.',
      gridDescription:
        'Cada pagina detalha um tipo de desafio patrimonial e mostra como a Apollo combina metodo consultivo e tecnologia para responder a ele.',
      ctaTitle:
        'Quando o contexto exige mais profundidade do que um servico isolado, esta frente organiza a conversa certa.',
      ctaDescription:
        'A Apollo estrutura projetos para empresas que precisam lidar com temas contabeis sensiveis, plataformas de apoio e decisoes patrimoniais com impacto transversal.',
      ctaChecklistTitle: 'Demandas que normalmente entram por esta frente',
      ctaChecklist: [
        'Revisoes de recuperabilidade, vida util, leasing ou combinacao de negocios com impacto contabil relevante.',
        'Projetos que unem diagnostico tecnico e necessidade de instrumentacao tecnologica.',
        'Empresas que precisam ganhar escala, monitoramento ou governanca sobre ativos criticos.',
      ],
      contactTitle: 'Converse com um especialista em Consultoria e Tecnologia',
      contactDescription:
        'Compartilhe o recorte tecnico ou tecnologico em analise para que a equipe Apollo proponha o melhor caminho de aprofundamento.',
    },
  },
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

function normalizeForComparison(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function isLegacyHeroTitle(value: string): boolean {
  return normalizeForComparison(value).includes('solucao completa')
}

function withCategoryLabel(
  items: SolutionCategorySolution[],
  categoryLabel: string,
): SolutionCategorySolution[] {
  return items.map((item) => ({
    ...item,
    categoryLabel,
  }))
}

function buildCategoryFilters(
  activeSlug: SolutionCategorySlug,
  activeLabel: string,
  activeCount: number,
): SolutionCategoryFilterLink[] {
  const totalCount = Object.values(solutionCategoryConfigs).reduce(
    (sum, config) => sum + config.orderedSolutionSlugs.length,
    0,
  )

  return [
    {
      key: 'all',
      label: 'Portfolio completo',
      href: '/solucoes',
      count: totalCount,
    },
    ...Object.values(solutionCategoryConfigs).map((config) => ({
      key: config.slug,
      label: config.slug === activeSlug ? activeLabel : config.fallbackCategoryTitle,
      href: config.path,
      count: config.slug === activeSlug ? activeCount : config.orderedSolutionSlugs.length,
    })),
  ]
}

export function getSolutionCategoryConfig(slug: SolutionCategorySlug) {
  return solutionCategoryConfigs[slug]
}

export async function generateSolutionCategoryMetadata(
  slug: SolutionCategorySlug,
): Promise<Metadata> {
  const config = getSolutionCategoryConfig(slug)

  let title: string | undefined
  let description: string | undefined
  let image: string | undefined

  try {
    const payload = await getPayloadClient()
    const [pageResult, categoryResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: 1,
        where: { slug: { equals: slug } },
        depth: 1,
      }),
      payload.find({
        collection: 'solucao-categories',
        limit: 1,
        where: { slug: { equals: slug } },
        depth: 1,
      }),
    ])

    const pageData = pageResult.docs[0] as PageDoc | undefined
    const category = categoryResult.docs[0] as SolucaoCategory | undefined

    title = normalizeText(pageData?.meta?.title) || normalizeText(category?.title) || undefined
    description =
      normalizeText(pageData?.meta?.description) ||
      normalizeText(category?.description) ||
      undefined
    image = mediaUrl(pageData?.meta?.image) || mediaUrl(category?.heroImage)
  } catch {
    // Payload may be unavailable during static builds in sandboxed environments.
  }

  return buildMetadata({
    path: config.path,
    title,
    description,
    image,
    fallbackTitle: config.fallbackCategoryTitle,
    fallbackDescription: config.fallbackDescription,
  })
}

export async function getSolutionCategoryPageData(
  slug: SolutionCategorySlug,
): Promise<SolutionCategoryPageData> {
  const config = getSolutionCategoryConfig(slug)

  let categoryLabel = config.fallbackCategoryTitle
  let heroTitle = config.story.heroTitle
  let heroDescription = config.fallbackDescription
  let heroImage: string | undefined
  let solutions = withCategoryLabel(config.fallbackSolutions, categoryLabel)

  try {
    const payload = await getPayloadClient()
    const categoryResult = await payload.find({
      collection: 'solucao-categories',
      limit: 1,
      where: { slug: { equals: slug } },
      depth: 1,
    })

    const category = categoryResult.docs[0] as SolucaoCategory | undefined

    if (category?.id) {
      categoryLabel = normalizeText(category.title) || config.fallbackCategoryTitle

      const candidateHeroTitle = normalizeText(category.heroTitle)
      heroTitle =
        candidateHeroTitle && !isLegacyHeroTitle(candidateHeroTitle)
          ? candidateHeroTitle
          : config.story.heroTitle
      heroDescription = normalizeText(category.description) || config.fallbackDescription
      heroImage = mediaUrl(category.heroImage)

      const solutionsResult = await payload.find({
        collection: 'solucoes',
        limit: 30,
        where: { category: { equals: category.id } },
        sort: 'order',
        depth: 1,
      })

      const fallbackBySlug = new Map(
        config.fallbackSolutions.map((solution) => [solution.id, solution]),
      )
      const fetchedBySlug = new Map<string, SolutionCategorySolution>()

      for (const solution of solutionsResult.docs as Solucoe[]) {
        if (!config.orderedSolutionSlugs.includes(solution.slug)) continue

        const fallback = fallbackBySlug.get(solution.slug)
        fetchedBySlug.set(solution.slug, {
          id: solution.slug,
          title: normalizeText(solution.title) || fallback?.title || 'Solucao Apollo',
          description:
            normalizeText(solution.shortDescription) ||
            fallback?.description ||
            'Solucao especializada para esta frente consultiva.',
          href: `/solucoes/${slug}/${solution.slug}`,
          iconUrl: mediaUrl(solution.icon),
          categoryLabel,
        })
      }

      const orderedSolutions = config.orderedSolutionSlugs
        .map((solutionSlug) => fetchedBySlug.get(solutionSlug) ?? fallbackBySlug.get(solutionSlug))
        .filter((solution): solution is SolutionCategorySolution => Boolean(solution))

      if (orderedSolutions.length > 0) {
        solutions = withCategoryLabel(orderedSolutions, categoryLabel)
      }
    }
  } catch {
    // Payload may be unavailable during static builds in sandboxed environments.
  }

  return {
    ...config.story,
    slug,
    categoryLabel,
    categoryFilters: buildCategoryFilters(slug, categoryLabel, solutions.length),
    heroTitle,
    heroDescription,
    heroImage,
    solutions,
    heroStats: [
      {
        value: String(solutions.length).padStart(2, '0'),
        label: 'solucoes nesta frente',
      },
      ...config.story.heroStats,
    ],
  }
}
