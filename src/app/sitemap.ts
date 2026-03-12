import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getSiteOrigin } from '@/lib/seo'
import type { Conteudo, Page, Post, Solucoe, SolucaoCategory } from '@/payload-types'

const staticPublicPaths = [
  '/',
  '/sobre',
  '/solucoes',
  '/solucoes/controle-patrimonial',
  '/solucoes/consultoria-e-tecnologia',
  '/solucoes/avaliacao-patrimonial',
  '/clientes',
  '/contato',
  '/contato/cotacao',
  '/contato/representante',
  '/conteudos',
  '/news',
]

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed
}

function withLeadingSlash(path: string): string {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

function toAbsoluteUrl(path: string, siteOrigin: string): string {
  return `${siteOrigin}${withLeadingSlash(path)}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteOrigin = getSiteOrigin()
  const routes = new Map<string, MetadataRoute.Sitemap[number]>()

  const addRoute = (path: string, updatedAt?: unknown) => {
    const normalizedPath = withLeadingSlash(path)
    const url = toAbsoluteUrl(normalizedPath, siteOrigin)

    routes.set(url, {
      url,
      lastModified: parseDate(updatedAt),
      changeFrequency: 'weekly',
    })
  }

  for (const path of staticPublicPaths) {
    addRoute(path)
  }

  try {
    const payload = await getPayloadClient()

    const [pagesResult, categoryResult, solutionsResult, postsResult, conteudosResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: 200,
        depth: 0,
      }),
      payload.find({
        collection: 'solucao-categories',
        limit: 200,
        depth: 0,
      }),
      payload.find({
        collection: 'solucoes',
        limit: 500,
        depth: 1,
      }),
      payload.find({
        collection: 'posts',
        limit: 500,
        where: {
          status: {
            equals: 'published',
          },
        },
        depth: 0,
      }),
      payload.find({
        collection: 'conteudos',
        limit: 500,
        depth: 0,
      }),
    ])

    for (const page of pagesResult.docs as Page[]) {
      const slug = normalizeText(page.slug)
      if (!slug) continue

      const path = slug === 'home' ? '/' : `/${slug}`
      addRoute(path, page.updatedAt)
    }

    const categoryById = new Map<string, string>()

    for (const category of categoryResult.docs as SolucaoCategory[]) {
      const slug = normalizeText(category.slug)
      if (!slug) continue

      categoryById.set(String(category.id), slug)
      addRoute(`/solucoes/${slug}`, category.updatedAt)
    }

    for (const solution of solutionsResult.docs as Solucoe[]) {
      const solutionSlug = normalizeText(solution.slug)
      if (!solutionSlug) continue

      let categorySlug = ''

      if (solution.category && typeof solution.category === 'object') {
        categorySlug = normalizeText(solution.category.slug)
      } else if (typeof solution.category === 'number' || typeof solution.category === 'string') {
        categorySlug = categoryById.get(String(solution.category)) || ''
      }

      if (!categorySlug) continue

      addRoute(`/solucoes/${categorySlug}/${solutionSlug}`, solution.updatedAt)
    }

    for (const post of postsResult.docs as Post[]) {
      const slug = normalizeText(post.slug)
      if (!slug) continue

      addRoute(`/news/${slug}`, post.updatedAt)
    }

    for (const conteudo of conteudosResult.docs as Conteudo[]) {
      const slug = normalizeText(conteudo.slug)
      if (!slug) continue

      addRoute(`/conteudos/${slug}`, conteudo.updatedAt)
    }
  } catch {
    // Keep static routes when Payload is unavailable.
  }

  return Array.from(routes.values()).sort((a, b) => a.url.localeCompare(b.url))
}
