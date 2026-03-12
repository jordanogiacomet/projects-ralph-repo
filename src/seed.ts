import { getPayload, type Payload } from 'payload'

import config from './payload.config'
import {
  FOOTER_DEFAULT_COPYRIGHT,
  FOOTER_DEFAULT_SOCIAL_LINKS,
  FOOTER_DEFAULT_UNIDADES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SETTINGS_DEFAULT_COOKIE_TEXT,
  SITE_SETTINGS_DEFAULT_WHATSAPP_MESSAGE,
  SITE_SETTINGS_DEFAULT_WHATSAPP_NUMBER,
} from './lib/constants'

type SeedStats = {
  created: number
  skipped: number
  globalsSeeded: number
  globalsSkipped: number
}

type SlugCollection = 'solucao-categories' | 'solucoes' | 'cliente-segmentos' | 'pages' | 'conteudos'

type SluggedDoc = {
  id: number | string
  slug?: string | null
}

type SolutionCategorySeed = {
  title: string
  slug: string
  description: string
  heroTitle: string
  order: number
}

type SolutionSeed = {
  title: string
  slug: string
  shortDescription: string
  categorySlug: string
  tags: string[]
  order: number
}

type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'whatsapp' | 'linkedin' | 'x'

type SeedSocialLink = {
  platform: SocialPlatform
  url: string
}

const validSocialPlatforms = new Set<SocialPlatform>([
  'instagram',
  'facebook',
  'youtube',
  'whatsapp',
  'linkedin',
  'x',
])

const seedSocialLinks: SeedSocialLink[] = FOOTER_DEFAULT_SOCIAL_LINKS.flatMap((link) => {
  if (typeof link.platform !== 'string' || typeof link.url !== 'string') return []

  const platform = link.platform as SocialPlatform
  if (!validSocialPlatforms.has(platform)) return []

  return [{ platform, url: link.url }]
})

const solutionCategories: SolutionCategorySeed[] = [
  {
    title: 'Controle Patrimonial',
    slug: 'controle-patrimonial',
    description:
      'Oferecemos as melhores soluções de forma completa para garantir organização, rastreabilidade e governança dos ativos da sua empresa.',
    heroTitle: 'Solução completa para o Controle Patrimonial da sua empresa',
    order: 1,
  },
  {
    title: 'Consultoria e Tecnologia',
    slug: 'consultoria-e-tecnologia',
    description:
      'Integramos consultoria contábil e tecnologia para transformar a gestão patrimonial da sua empresa com precisão, conformidade e inovação.',
    heroTitle: 'Solução completa para Consultoria e Tecnologia patrimonial',
    order: 2,
  },
  {
    title: 'Avaliação Patrimonial',
    slug: 'avaliacao-patrimonial',
    description:
      'Realizamos avaliações patrimoniais com metodologia técnica e aderência normativa para apoiar decisões estratégicas e garantir segurança contábil.',
    heroTitle: 'Solução completa para Avaliação Patrimonial da sua empresa',
    order: 3,
  },
]

const solutions: SolutionSeed[] = [
  {
    title: 'Etiquetas Patrimoniais Inteligentes',
    slug: 'etiquetas-patrimoniais-inteligentes',
    shortDescription: 'Etiquetagem técnica e padronização para rastreabilidade completa dos bens.',
    categorySlug: 'controle-patrimonial',
    tags: ['controle patrimonial', 'inventario'],
    order: 1,
  },
  {
    title: 'Controle e Inventário de Estoques',
    slug: 'controle-e-inventario-de-estoques',
    shortDescription: 'Inventário físico com metodologia técnica para elevar acuracidade e controle.',
    categorySlug: 'controle-patrimonial',
    tags: ['controle patrimonial', 'inventario'],
    order: 2,
  },
  {
    title: 'Organização Patrimonial',
    slug: 'organizacao-patrimonial',
    shortDescription: 'Estruturação e saneamento da base patrimonial para decisões mais seguras.',
    categorySlug: 'controle-patrimonial',
    tags: ['controle patrimonial', 'governanca'],
    order: 3,
  },
  {
    title: 'Processamento Patrimonial',
    slug: 'processamento-patrimonial',
    shortDescription: 'Processamento técnico de dados para conformidade e consistência contábil.',
    categorySlug: 'controle-patrimonial',
    tags: ['controle patrimonial', 'contabilidade'],
    order: 4,
  },
  {
    title: 'Teste de Impairment',
    slug: 'teste-de-impairment',
    shortDescription: 'Análise de recuperabilidade de ativos conforme normas contábeis vigentes.',
    categorySlug: 'consultoria-e-tecnologia',
    tags: ['consultoria', 'ifrs', 'impairment'],
    order: 1,
  },
  {
    title: 'Revisão da Vida Útil',
    slug: 'revisao-da-vida-util',
    shortDescription: 'Revisões técnicas para aderência ao CPC 27 e maior precisão de depreciação.',
    categorySlug: 'consultoria-e-tecnologia',
    tags: ['consultoria', 'ifrs', 'cpc 27'],
    order: 2,
  },
  {
    title: 'Ativos Inteligentes RFID e RTLS',
    slug: 'ativos-inteligentes-rfid-rtls',
    shortDescription: 'Rastreamento e monitoramento de ativos em tempo real com tecnologia RFID/RTLS.',
    categorySlug: 'consultoria-e-tecnologia',
    tags: ['tecnologia', 'rfid', 'rtls'],
    order: 3,
  },
  {
    title: 'Arrendamento Mercantil (CPC 06 / IFRS 16)',
    slug: 'arrendamento-mercantil',
    shortDescription: 'Suporte técnico para contratos de leasing e aderência ao CPC 06 / IFRS 16.',
    categorySlug: 'consultoria-e-tecnologia',
    tags: ['consultoria', 'ifrs', 'arrendamento'],
    order: 4,
  },
  {
    title: 'Combinação de Negócios (PPA) – CPC 15',
    slug: 'combinacao-de-negocios-ppa-cpc-15',
    shortDescription: 'Alocação de preço de compra (PPA) e apoio especializado em processos de M&A.',
    categorySlug: 'consultoria-e-tecnologia',
    tags: ['consultoria', 'ifrs', 'ppa'],
    order: 5,
  },
  {
    title: 'Softwares',
    slug: 'softwares',
    shortDescription: 'Plataformas para inventário, rastreabilidade e gestão integrada de ativos.',
    categorySlug: 'consultoria-e-tecnologia',
    tags: ['tecnologia', 'software'],
    order: 6,
  },
  {
    title: 'Avaliação de Ativos',
    slug: 'avaliacao-de-ativos',
    shortDescription: 'Laudos técnicos para mensuração de ativos com precisão e respaldo contábil.',
    categorySlug: 'avaliacao-patrimonial',
    tags: ['avaliacao'],
    order: 1,
  },
  {
    title: 'Avaliação de Ativos Biológicos',
    slug: 'avaliacao-de-ativos-biologicos',
    shortDescription: 'Modelagem e valuation de ativos biológicos com critérios técnicos e regulatórios.',
    categorySlug: 'avaliacao-patrimonial',
    tags: ['avaliacao', 'agronegocio'],
    order: 2,
  },
  {
    title: 'Avaliação de Imóveis Urbanos e Rurais',
    slug: 'avaliacao-de-imoveis-urbanos-e-rurais',
    shortDescription: 'Avaliação imobiliária para ativos urbanos e rurais com base em normas de mercado.',
    categorySlug: 'avaliacao-patrimonial',
    tags: ['avaliacao', 'imoveis'],
    order: 3,
  },
  {
    title: 'Avaliação de Máquinas',
    slug: 'avaliacao-de-maquinas',
    shortDescription: 'Parecer técnico para máquinas e equipamentos com análise de vida útil e mercado.',
    categorySlug: 'avaliacao-patrimonial',
    tags: ['avaliacao', 'maquinas'],
    order: 4,
  },
]

const clientSegments = [
  'Agência',
  'Agrícola',
  'Alimentação',
  'Armas e Acessórios',
  'Autopeças',
  'Cerâmica',
  'Combustível',
  'Construção',
  'Educação',
  'Eletrodomésticos',
  'Eletrônicos',
  'Energia',
  'Esportes',
  'Eventos',
  'Governo',
  'Hotel',
  'Implementos Agrícolas',
  'Logística',
  'Metalurgia',
  'Móveis',
  'Papel e Celulose',
  'Polímeros',
  'Químicos',
  'Rodovias',
  'Saúde',
  'Serviços Financeiros',
  'Tecnologia',
  'Transporte',
  'Utensílios Domésticos',
  'Varejo',
  'Vestuário',
  'Vidros',
]

const basePages = [
  {
    title: 'Home',
    slug: 'home',
    heroType: 'fullscreen',
    heroSubtitle:
      'Gerenciamento inteligente dos ativos da sua empresa com avaliações e controle patrimonial.',
    showContactForm: true,
    meta: {
      title: 'Apollo Gestão - Avaliações e Controle Patrimonial',
      description:
        'Soluções completas em avaliação, controle patrimonial, consultoria e tecnologia para gestão de ativos.',
    },
  },
  {
    title: 'Sobre',
    slug: 'sobre',
    heroType: 'fullscreen',
    heroSubtitle: 'Conheça a trajetória da Apollo Gestão e nossa atuação técnica em todo o Brasil.',
    showContactForm: true,
    meta: {
      title: 'Sobre a Apollo Gestão',
      description:
        'História, propósito e diferenciais da Apollo Gestão em projetos de avaliação e controle patrimonial.',
    },
  },
  {
    title: 'Contato',
    slug: 'contato',
    heroType: 'fullscreen',
    heroSubtitle:
      'Fale com nossa equipe para tirar dúvidas e estruturar a melhor solução para a sua empresa.',
    showContactForm: true,
    meta: {
      title: 'Contato - Apollo Gestão',
      description: 'Entre em contato com a Apollo Gestão.',
    },
  },
  {
    title: 'Cotação',
    slug: 'cotacao',
    heroType: 'small',
    heroSubtitle:
      'Solicite uma proposta técnica e comercial para avaliação e controle patrimonial.',
    showContactForm: false,
    meta: {
      title: 'Orçamento - Apollo Gestão',
      description: 'Solicite um orçamento para serviços da Apollo Gestão.',
    },
  },
  {
    title: 'Representante',
    slug: 'representante',
    heroType: 'small',
    heroSubtitle: 'Cadastre-se para atuar como representante comercial da Apollo Gestão.',
    showContactForm: false,
    meta: {
      title: 'Representante - Apollo Gestão',
      description: 'Página de cadastro para representantes comerciais.',
    },
  },
  {
    title: 'Conteúdos',
    slug: 'conteudos',
    heroType: 'small',
    heroSubtitle:
      'Materiais técnicos gratuitos sobre gestão patrimonial, inventário e conformidade contábil.',
    showContactForm: true,
    meta: {
      title: 'Conteúdos Gratuitos - Apollo Gestão',
      description:
        'Baixe e-books e planilhas técnicas da Apollo Gestão para apoiar sua gestão patrimonial.',
    },
  },
]

const initialContents = [
  {
    title: '[EBOOK Gratuito] Guia da Identificação Patrimonial',
    slug: 'e-book-identificacao-patrimonial',
    description:
      'Material introdutório com boas práticas para iniciar e padronizar o processo de identificação patrimonial.',
    requiresEmail: true,
    meta: {
      title: 'E-book de Identificação Patrimonial',
      description:
        'Baixe gratuitamente o guia da Apollo Gestão para implementar identificação patrimonial com metodologia técnica.',
    },
  },
  {
    title: 'Planilha de Cálculo da Vida Útil de Imobilizado - CPC 27',
    slug: 'planilha-vida-util-cpc-27',
    description:
      'Planilha prática para apoiar revisões de vida útil e depreciação com base nos critérios do CPC 27.',
    requiresEmail: true,
    meta: {
      title: 'Planilha de Vida Útil - CPC 27',
      description:
        'Faça o download da planilha gratuita para cálculo de vida útil de ativos imobilizados.',
    },
  },
]

const headerSeed = {
  navItems: [
    {
      label: 'Soluções',
      link: '/solucoes',
      children: [
        {
          label: 'Controle Patrimonial',
          link: '/solucoes/controle-patrimonial',
          subItems: [
            {
              label: 'Etiquetas Patrimoniais Inteligentes',
              link: '/solucoes/controle-patrimonial/etiquetas-patrimoniais-inteligentes',
            },
            {
              label: 'Controle e Inventário de Estoques',
              link: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
            },
            {
              label: 'Organização Patrimonial',
              link: '/solucoes/controle-patrimonial/organizacao-patrimonial',
            },
            {
              label: 'Processamento Patrimonial',
              link: '/solucoes/controle-patrimonial/processamento-patrimonial',
            },
          ],
        },
        {
          label: 'Consultoria e Tecnologia',
          link: '/solucoes/consultoria-e-tecnologia',
          subItems: [
            {
              label: 'Teste de Impairment',
              link: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
            },
            {
              label: 'Revisão da Vida Útil',
              link: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
            },
            {
              label: 'Ativos Inteligentes RFID/RTLS',
              link: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-rtls',
            },
            {
              label: 'Arrendamento Mercantil',
              link: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil',
            },
            {
              label: 'Combinação de Negócios',
              link: '/solucoes/consultoria-e-tecnologia/combinacao-de-negocios-ppa-cpc-15',
            },
            {
              label: 'Softwares',
              link: '/solucoes/consultoria-e-tecnologia/softwares',
            },
          ],
        },
        {
          label: 'Avaliação Patrimonial',
          link: '/solucoes/avaliacao-patrimonial',
          subItems: [
            {
              label: 'Avaliação de Ativos',
              link: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
            },
            {
              label: 'Avaliação de Ativos Biológicos',
              link: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
            },
            {
              label: 'Avaliação de Imóveis Urbanos e Rurais',
              link: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
            },
            {
              label: 'Avaliação de Máquinas',
              link: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
            },
          ],
        },
      ],
    },
    {
      label: 'Clientes',
      link: '/clientes',
    },
    {
      label: 'Contato',
      children: [
        {
          label: 'Cotação',
          link: '/contato/cotacao',
        },
        {
          label: 'Representante',
          link: '/contato/representante',
        },
      ],
    },
    {
      label: 'Sobre',
      link: '/sobre',
    },
    {
      label: 'Conteúdos',
      link: '/conteudos',
    },
    {
      label: 'News',
      link: '/news',
    },
    {
      label: 'Home',
      link: '/',
    },
  ],
  ctaButton: {
    label: 'Cotação',
    link: '/contato/cotacao',
  },
  socialLinks: seedSocialLinks,
}

const footerSeed = {
  unidades: FOOTER_DEFAULT_UNIDADES,
  socialLinks: seedSocialLinks,
  copyrightText: FOOTER_DEFAULT_COPYRIGHT,
}

const siteSettingsSeed = {
  whatsappNumber: SITE_SETTINGS_DEFAULT_WHATSAPP_NUMBER,
  whatsappMessage: SITE_SETTINGS_DEFAULT_WHATSAPP_MESSAGE,
  cookieConsentText: SITE_SETTINGS_DEFAULT_COOKIE_TEXT,
  defaultMeta: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  analyticsId: '',
  maintenanceMode: false,
}

function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function findBySlug(payload: Payload, collection: SlugCollection, slug: string) {
  const result = await payload.find({
    collection,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 0,
  })

  const existing = result.docs[0] as SluggedDoc | undefined
  if (!existing?.id) return null

  return existing
}

async function ensureDoc(
  payload: Payload,
  collection: SlugCollection,
  slug: string,
  data: Record<string, unknown>,
  stats: SeedStats,
) {
  const existing = await findBySlug(payload, collection, slug)

  if (existing) {
    stats.skipped += 1
    return existing
  }

  const created = await (payload.create as (args: unknown) => Promise<unknown>)({
    collection,
    data,
    depth: 0,
  })

  stats.created += 1
  return created as SluggedDoc
}

async function seedHeaderGlobal(payload: Payload, stats: SeedStats) {
  const current = await payload.findGlobal({
    slug: 'header',
    depth: 0,
  })

  const hasNav = Array.isArray((current as { navItems?: unknown[] }).navItems)
    ? ((current as { navItems?: unknown[] }).navItems?.length || 0) > 0
    : false
  const hasSocial = Array.isArray((current as { socialLinks?: unknown[] }).socialLinks)
    ? ((current as { socialLinks?: unknown[] }).socialLinks?.length || 0) > 0
    : false
  const cta = (current as { ctaButton?: { label?: string; link?: string } }).ctaButton
  const hasCTA = Boolean(cta?.label && cta?.link)

  if (hasNav || hasSocial || hasCTA) {
    stats.globalsSkipped += 1
    return
  }

  await (payload.updateGlobal as (args: unknown) => Promise<unknown>)({
    slug: 'header',
    data: headerSeed,
    depth: 0,
  })

  stats.globalsSeeded += 1
}

async function seedFooterGlobal(payload: Payload, stats: SeedStats) {
  const current = await payload.findGlobal({
    slug: 'footer',
    depth: 0,
  })

  const hasUnits = Array.isArray((current as { unidades?: unknown[] }).unidades)
    ? ((current as { unidades?: unknown[] }).unidades?.length || 0) > 0
    : false
  const hasSocial = Array.isArray((current as { socialLinks?: unknown[] }).socialLinks)
    ? ((current as { socialLinks?: unknown[] }).socialLinks?.length || 0) > 0
    : false
  const hasCopyright =
    typeof (current as { copyrightText?: unknown }).copyrightText === 'string' &&
    (current as { copyrightText?: string }).copyrightText?.trim().length !== 0

  if (hasUnits || hasSocial || hasCopyright) {
    stats.globalsSkipped += 1
    return
  }

  await (payload.updateGlobal as (args: unknown) => Promise<unknown>)({
    slug: 'footer',
    data: footerSeed,
    depth: 0,
  })

  stats.globalsSeeded += 1
}

async function seedSiteSettingsGlobal(payload: Payload, stats: SeedStats) {
  const current = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })

  const hasWhatsapp =
    typeof (current as { whatsappNumber?: unknown }).whatsappNumber === 'string' &&
    (current as { whatsappNumber?: string }).whatsappNumber?.trim().length !== 0
  const hasCookie =
    typeof (current as { cookieConsentText?: unknown }).cookieConsentText === 'string' &&
    (current as { cookieConsentText?: string }).cookieConsentText?.trim().length !== 0

  if (hasWhatsapp || hasCookie) {
    stats.globalsSkipped += 1
    return
  }

  await (payload.updateGlobal as (args: unknown) => Promise<unknown>)({
    slug: 'site-settings',
    data: siteSettingsSeed,
    depth: 0,
  })

  stats.globalsSeeded += 1
}

async function seedData(payload: Payload, stats: SeedStats) {
  const categoryIds = new Map<string, number | string>()

  for (const category of solutionCategories) {
    const categoryDoc = await ensureDoc(
      payload,
      'solucao-categories',
      category.slug,
      {
        title: category.title,
        slug: category.slug,
        description: category.description,
        heroTitle: category.heroTitle,
        order: category.order,
      },
      stats,
    )

    categoryIds.set(category.slug, categoryDoc.id)
  }

  for (const solution of solutions) {
    const categoryId = categoryIds.get(solution.categorySlug)
    if (!categoryId) {
      throw new Error(`Missing category id for slug "${solution.categorySlug}"`)
    }

    await ensureDoc(
      payload,
      'solucoes',
      solution.slug,
      {
        title: solution.title,
        slug: solution.slug,
        shortDescription: solution.shortDescription,
        category: categoryId,
        tags: solution.tags,
        order: solution.order,
      },
      stats,
    )
  }

  for (const segmentTitle of clientSegments) {
    const slug = toSlug(segmentTitle)
    await ensureDoc(
      payload,
      'cliente-segmentos',
      slug,
      {
        title: segmentTitle,
        slug,
      },
      stats,
    )
  }

  for (const page of basePages) {
    await ensureDoc(
      payload,
      'pages',
      page.slug,
      {
        title: page.title,
        slug: page.slug,
        heroType: page.heroType,
        heroSubtitle: page.heroSubtitle,
        showContactForm: page.showContactForm,
        meta: page.meta,
      },
      stats,
    )
  }

  for (const content of initialContents) {
    await ensureDoc(
      payload,
      'conteudos',
      content.slug,
      {
        title: content.title,
        slug: content.slug,
        description: content.description,
        requiresEmail: content.requiresEmail,
        meta: content.meta,
      },
      stats,
    )
  }
}

async function main() {
  const stats: SeedStats = {
    created: 0,
    skipped: 0,
    globalsSeeded: 0,
    globalsSkipped: 0,
  }

  const payload = await getPayload({ config })

  try {
    await seedData(payload, stats)
    await seedHeaderGlobal(payload, stats)
    await seedFooterGlobal(payload, stats)
    await seedSiteSettingsGlobal(payload, stats)

    console.log('Seed completed.')
    console.log(`Documents created: ${stats.created}`)
    console.log(`Documents skipped (already existed): ${stats.skipped}`)
    console.log(`Globals seeded: ${stats.globalsSeeded}`)
    console.log(`Globals skipped (already configured): ${stats.globalsSkipped}`)
  } finally {
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  console.error('Seed failed.')
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(error)
  }
  process.exitCode = 1
}
