import type { Metadata } from 'next'
import { cache } from 'react'

import {
  FOOTER_DEFAULT_SOCIAL_LINKS,
  FOOTER_DEFAULT_UNIDADES,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'

type MediaLike = {
  url?: string | null
}

type DefaultMeta = {
  title?: string
  description?: string
  image?: unknown
}

type SiteSettingsGlobal = {
  defaultMeta?: DefaultMeta
}

type FooterSocialLink = {
  url?: string
}

type FooterUnit = {
  name?: string
  state?: string
  address?: string
  phone?: string
  email?: string
}

type FooterGlobal = {
  socialLinks?: FooterSocialLink[]
  unidades?: FooterUnit[]
}

type SeoConfig = {
  siteOrigin: string
  defaultTitle: string
  defaultDescription: string
  defaultImage?: string
  socialLinks: string[]
  unidades: FooterUnit[]
}

type MetadataInput = {
  path: string
  title?: string
  description?: string
  image?: string
  fallbackTitle?: string
  fallbackDescription?: string
  type?: 'website' | 'article'
}

type OrganizationJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  sameAs?: string[]
}

type LocalBusinessJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  name: string
  url: string
  email?: string
  telephone?: string
  address: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressRegion?: string
    addressCountry: 'BR'
  }
}

type BreadcrumbItem = {
  name: string
  path: string
}

type ArticleJsonLdInput = {
  headline: string
  description: string
  path: string
  image?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}

const defaultSiteOrigin = 'https://www.apollogestao.com.br'

const hasString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

function normalizeText(value: unknown): string {
  if (!hasString(value)) return ''
  return value.replace(/\s+/g, ' ').trim()
}

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    const url = (media as MediaLike).url
    return hasString(url) ? url : undefined
  }

  return undefined
}

function normalizePath(path: string): string {
  if (!hasString(path)) return '/'
  if (/^https?:\/\//i.test(path)) return path
  return path.startsWith('/') ? path : `/${path}`
}

function pickFirst(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (hasString(value)) {
      return value
    }
  }

  return undefined
}

function mergeUnits(unidades?: FooterUnit[]): FooterUnit[] {
  if (!Array.isArray(unidades) || unidades.length === 0) {
    return FOOTER_DEFAULT_UNIDADES
  }

  return FOOTER_DEFAULT_UNIDADES.map((fallback, index) => {
    const current = unidades[index]

    if (!current) {
      return fallback
    }

    return {
      name: normalizeText(current.name) || fallback.name,
      state: normalizeText(current.state) || fallback.state,
      address: normalizeText(current.address) || fallback.address,
      phone: normalizeText(current.phone) || fallback.phone,
      email: normalizeText(current.email) || fallback.email,
    }
  })
}

export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (!hasString(configured)) return defaultSiteOrigin
  return configured.replace(/\/+$/, '')
}

const getSeoConfig = cache(async (): Promise<SeoConfig> => {
  const defaults: SeoConfig = {
    siteOrigin: getSiteOrigin(),
    defaultTitle: SITE_NAME,
    defaultDescription: SITE_DESCRIPTION,
    socialLinks: FOOTER_DEFAULT_SOCIAL_LINKS.map((item) => item.url).filter((url) => hasString(url)),
    unidades: FOOTER_DEFAULT_UNIDADES,
  }

  try {
    const payload = await getPayloadClient()
    const [siteSettingsResult, footerResult] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 1 }),
      payload.findGlobal({ slug: 'footer' }),
    ])

    const siteSettings = siteSettingsResult as unknown as SiteSettingsGlobal
    const footer = footerResult as unknown as FooterGlobal

    const globalTitle = normalizeText(siteSettings.defaultMeta?.title)
    const globalDescription = normalizeText(siteSettings.defaultMeta?.description)
    const globalImage = mediaUrl(siteSettings.defaultMeta?.image)

    const socialLinks = Array.isArray(footer.socialLinks)
      ? footer.socialLinks
          .map((item) => normalizeText(item.url))
          .filter((url) => hasString(url))
      : []

    return {
      siteOrigin: defaults.siteOrigin,
      defaultTitle: globalTitle || defaults.defaultTitle,
      defaultDescription: globalDescription || defaults.defaultDescription,
      defaultImage: globalImage || defaults.defaultImage,
      socialLinks: socialLinks.length > 0 ? socialLinks : defaults.socialLinks,
      unidades: mergeUnits(footer.unidades),
    }
  } catch {
    return defaults
  }
})

export function toAbsoluteUrl(path: string, siteOrigin = getSiteOrigin()): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = normalizePath(path)
  return `${siteOrigin}${normalizedPath}`
}

export async function buildMetadata(input: MetadataInput): Promise<Metadata> {
  const config = await getSeoConfig()
  const canonicalPath = normalizePath(input.path)

  const title =
    pickFirst(normalizeText(input.title), config.defaultTitle, normalizeText(input.fallbackTitle), SITE_NAME) ||
    SITE_NAME

  const description =
    pickFirst(
      normalizeText(input.description),
      config.defaultDescription,
      normalizeText(input.fallbackDescription),
      SITE_DESCRIPTION,
    ) || SITE_DESCRIPTION

  const image = pickFirst(normalizeText(input.image), config.defaultImage)

  return {
    metadataBase: new URL(config.siteOrigin),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'pt-BR': canonicalPath,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: input.type || 'website',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/apple-touch-icon.png',
    },
  }
}

export async function buildOrganizationAndLocalBusinessJsonLd(): Promise<{
  organization: OrganizationJsonLd
  locations: LocalBusinessJsonLd[]
}> {
  const config = await getSeoConfig()

  const organization: OrganizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: config.siteOrigin,
    logo: toAbsoluteUrl('/favicon.svg', config.siteOrigin),
    ...(config.socialLinks.length > 0 ? { sameAs: config.socialLinks } : {}),
  }

  const locations: LocalBusinessJsonLd[] = config.unidades.map((unit) => {
    const phoneDigits = normalizeText(unit.phone).replace(/[^\d+]/g, '')

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${SITE_NAME} ${normalizeText(unit.state) || ''}`.trim(),
      url: config.siteOrigin,
      ...(hasString(unit.email) ? { email: normalizeText(unit.email) } : {}),
      ...(hasString(phoneDigits)
        ? {
            telephone: phoneDigits.startsWith('+')
              ? phoneDigits
              : phoneDigits.startsWith('55')
                ? `+${phoneDigits}`
                : `+55${phoneDigits}`,
          }
        : {}),
      address: {
        '@type': 'PostalAddress',
        streetAddress: normalizeText(unit.address) || normalizeText(unit.name) || 'Brasil',
        ...(hasString(unit.state) ? { addressRegion: normalizeText(unit.state) } : {}),
        addressCountry: 'BR',
      },
    }
  })

  return {
    organization,
    locations,
  }
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: normalizeText(item.name),
      item: toAbsoluteUrl(item.path),
    })),
  }
}

export function buildArticleJsonLd(input: ArticleJsonLdInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: normalizeText(input.headline),
    description: normalizeText(input.description),
    mainEntityOfPage: toAbsoluteUrl(input.path),
    ...(hasString(input.image) ? { image: [toAbsoluteUrl(input.image)] } : {}),
    ...(hasString(input.datePublished) ? { datePublished: input.datePublished } : {}),
    ...(hasString(input.dateModified) ? { dateModified: input.dateModified } : {}),
    author: {
      '@type': 'Organization',
      name: normalizeText(input.authorName) || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/favicon.svg'),
      },
    },
  }
}
