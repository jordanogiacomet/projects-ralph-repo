export type NavChildItem = {
  label: string
  link?: string
  id?: string
}

export type NavChild = {
  label: string
  link?: string
  description?: string
  children?: NavChildItem[]
  id?: string
}

export type NavItem = {
  label: string
  link?: string
  children?: NavChild[]
  id?: string
}

export type SocialLink = {
  platform?: string
  url?: string
  id?: string
}

export type CTAButton = {
  label?: string
  link?: string
}

type RawNavChildItem = {
  label?: unknown
  link?: unknown
  id?: unknown
}

type RawNavChild = {
  label?: unknown
  link?: unknown
  description?: unknown
  children?: unknown
  subItems?: unknown
  id?: unknown
}

type RawNavItem = {
  label?: unknown
  link?: unknown
  children?: unknown
  id?: unknown
}

type RawCTAButton = {
  label?: unknown
  link?: unknown
}

type RawSocialLink = {
  platform?: unknown
  url?: unknown
  id?: unknown
}

type RawHeaderGlobal = {
  navItems?: unknown
  ctaButton?: unknown
  socialLinks?: unknown
}

export const fallbackNavItems: NavItem[] = [
  {
    id: 'solucoes',
    label: 'Soluções',
    link: '/solucoes',
    children: [
      {
        id: 'controle-patrimonial',
        label: 'Controle Patrimonial',
        link: '/solucoes/controle-patrimonial',
        children: [
          {
            id: 'identificacao-patrimonial',
            label: 'Identificação Patrimonial',
            link: '/solucoes/controle-patrimonial/etiquetas-patrimoniais-inteligentes',
          },
          {
            id: 'inventario-estoques',
            label: 'Inventário de Estoques',
            link: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
          },
          {
            id: 'organizacao-patrimonial',
            label: 'Organização Patrimonial',
            link: '/solucoes/controle-patrimonial/organizacao-patrimonial',
          },
          {
            id: 'processamento-patrimonial',
            label: 'Processamento Patrimonial',
            link: '/solucoes/controle-patrimonial/processamento-patrimonial',
          },
        ],
      },
      {
        id: 'consultoria-tecnologia',
        label: 'Consultoria e Tecnologia',
        link: '/solucoes/consultoria-e-tecnologia',
        children: [
          {
            id: 'teste-impairment',
            label: 'Teste de Impairment',
            link: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
          },
          {
            id: 'revisao-vida-util',
            label: 'Revisão da Vida Útil',
            link: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
          },
          {
            id: 'ativos-inteligentes',
            label: 'Ativos Inteligentes RFID/RTLS',
            link: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-rtls',
          },
          {
            id: 'arrendamento-mercantil',
            label: 'Arrendamento Mercantil',
            link: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil',
          },
          {
            id: 'combinacao-negocios',
            label: 'Combinação de Negócios',
            link: '/solucoes/consultoria-e-tecnologia/combinacao-de-negocios-ppa-cpc-15',
          },
          {
            id: 'softwares',
            label: 'Softwares',
            link: '/solucoes/consultoria-e-tecnologia/softwares',
          },
        ],
      },
      {
        id: 'avaliacao-patrimonial',
        label: 'Avaliação Patrimonial',
        link: '/solucoes/avaliacao-patrimonial',
        children: [
          {
            id: 'avaliacao-ativos',
            label: 'Avaliação de Ativos',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
          },
          {
            id: 'avaliacao-biologicos',
            label: 'Avaliação de Ativos Biológicos',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
          },
          {
            id: 'avaliacao-imoveis',
            label: 'Avaliação de Imóveis',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-imoveis-urbanos-e-rurais',
          },
          {
            id: 'avaliacao-maquinas',
            label: 'Avaliação de Máquinas',
            link: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
          },
        ],
      },
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    link: '/clientes',
  },
  {
    id: 'contato',
    label: 'Contato',
    children: [
      {
        id: 'cotacao',
        label: 'Cotação',
        link: '/contato/cotacao',
      },
      {
        id: 'representante',
        label: 'Representante',
        link: '/contato/representante',
      },
    ],
  },
  {
    id: 'sobre',
    label: 'Sobre',
    link: '/sobre',
  },
  {
    id: 'conteudos',
    label: 'Conteúdos',
    link: '/conteudos',
  },
  {
    id: 'news',
    label: 'News',
    link: '/news',
  },
  {
    id: 'home',
    label: 'Home',
    link: '/',
  },
]

export const fallbackCTAButton: CTAButton = {
  label: 'Cotação',
  link: '/contato/cotacao',
}

export const fallbackSocialLinks: SocialLink[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com',
  },
  {
    id: 'facebook',
    platform: 'facebook',
    url: 'https://www.facebook.com',
  },
  {
    id: 'youtube',
    platform: 'youtube',
    url: 'https://www.youtube.com',
  },
  {
    id: 'whatsapp',
    platform: 'whatsapp',
    url: 'https://wa.me/5500000000000',
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    url: 'https://www.linkedin.com',
  },
  {
    id: 'x',
    platform: 'x',
    url: 'https://x.com',
  },
]

function text(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function normalizeNavChildItems(value: unknown): NavChildItem[] | undefined {
  if (!Array.isArray(value)) return undefined

  const items: NavChildItem[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const raw = item as RawNavChildItem
    const label = text(raw.label)

    if (!label) continue

    const normalized: NavChildItem = { label }
    const id = text(raw.id)
    const link = text(raw.link)

    if (id) normalized.id = id
    if (link) normalized.link = link

    items.push(normalized)
  }

  return items.length > 0 ? items : undefined
}

function normalizeNavChildren(value: unknown): NavChild[] | undefined {
  if (!Array.isArray(value)) return undefined

  const children: NavChild[] = []

  for (const child of value) {
    if (!child || typeof child !== 'object') continue
    const raw = child as RawNavChild
    const label = text(raw.label)

    if (!label) continue

    const normalized: NavChild = { label }
    const id = text(raw.id)
    const link = text(raw.link)
    const description = text(raw.description)
    const nestedItems = normalizeNavChildItems(raw.children) || normalizeNavChildItems(raw.subItems)

    if (id) normalized.id = id
    if (link) normalized.link = link
    if (description) normalized.description = description
    if (nestedItems) normalized.children = nestedItems

    children.push(normalized)
  }

  return children.length > 0 ? children : undefined
}

function normalizeNavItems(value: unknown): NavItem[] {
  if (!Array.isArray(value)) return []

  const items: NavItem[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const raw = item as RawNavItem
    const label = text(raw.label)

    if (!label) continue

    const normalized: NavItem = { label }
    const id = text(raw.id)
    const link = text(raw.link)
    const children = normalizeNavChildren(raw.children)

    if (id) normalized.id = id
    if (link) normalized.link = link
    if (children) normalized.children = children

    items.push(normalized)
  }

  return items
}

function normalizeCTAButton(value: unknown): CTAButton | undefined {
  if (!value || typeof value !== 'object') return undefined

  const raw = value as RawCTAButton
  const label = text(raw.label)
  const link = text(raw.link)

  if (!label || !link) return undefined

  return { label, link }
}

function normalizeSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return []

  const links: SocialLink[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const raw = item as RawSocialLink
    const platform = text(raw.platform)
    const url = text(raw.url)

    if (!platform || !url) continue

    const normalized: SocialLink = { platform, url }
    const id = text(raw.id)

    if (id) normalized.id = id

    links.push(normalized)
  }

  return links
}

export function resolveHeaderData(headerData: unknown): {
  navItems: NavItem[]
  ctaButton: CTAButton
  socialLinks: SocialLink[]
} {
  const header =
    headerData && typeof headerData === 'object' ? (headerData as RawHeaderGlobal) : undefined

  const navItems = normalizeNavItems(header?.navItems)
  const ctaButton = normalizeCTAButton(header?.ctaButton)
  const socialLinks = normalizeSocialLinks(header?.socialLinks)

  return {
    navItems: navItems.length > 0 ? navItems : fallbackNavItems,
    ctaButton: ctaButton ?? fallbackCTAButton,
    socialLinks: socialLinks.length > 0 ? socialLinks : fallbackSocialLinks,
  }
}

export function normalizePathname(pathname: string | null | undefined): string {
  if (!pathname) return ''
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function matchesPath(pathname: string, href?: string): boolean {
  if (!href) return false

  const normalizedPath = normalizePathname(pathname)
  const normalizedHref = normalizePathname(href)

  if (!normalizedHref) return false
  if (normalizedHref === '/') return normalizedPath === '/'

  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`)
}

function navChildMatchesPath(child: NavChild, pathname: string): boolean {
  if (matchesPath(pathname, child.link)) return true

  return child.children?.some((item) => matchesPath(pathname, item.link)) ?? false
}

export function navItemMatchesPath(item: NavItem, pathname: string): boolean {
  if (matchesPath(pathname, item.link)) return true

  return item.children?.some((child) => navChildMatchesPath(child, pathname)) ?? false
}
