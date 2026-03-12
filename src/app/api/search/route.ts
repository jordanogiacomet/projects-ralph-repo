import { NextRequest, NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import type { Conteudo, Page, Post, Solucoe } from '@/payload-types'

export const dynamic = 'force-dynamic'

const RESULTS_PER_GROUP = 6

type SearchGroupKey = 'pages' | 'posts' | 'solucoes' | 'conteudos'

type SearchResultItem = {
  id: string
  title: string
  href: string
  description?: string
}

type SearchGroup = {
  key: SearchGroupKey
  label: string
  results: SearchResultItem[]
}

type SearchResponse = {
  query: string
  groups: SearchGroup[]
  total: number
}

const groupLabels: Record<SearchGroupKey, string> = {
  pages: 'Páginas',
  posts: 'News',
  solucoes: 'Soluções',
  conteudos: 'Conteúdos',
}

const staticPageRouteBySlug: Record<string, string> = {
  home: '/',
  inicio: '/',
  cotacao: '/contato/cotacao',
  representante: '/contato/representante',
}

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''

  return value.replace(/\s+/g, ' ').trim()
}

function pageHrefFromSlug(slug: string): string {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '')
  if (!normalizedSlug) return '/'

  const staticRoute = staticPageRouteBySlug[normalizedSlug]
  if (staticRoute) return staticRoute

  return `/${normalizedSlug}`
}

function solutionHref(solution: Solucoe): string {
  const normalizedSlug = normalizeText(solution.slug)
  if (!normalizedSlug) return '/solucoes'

  if (solution.category && typeof solution.category === 'object') {
    const categorySlug = normalizeText(solution.category.slug)
    if (categorySlug) {
      return `/solucoes/${categorySlug}/${normalizedSlug}`
    }
  }

  return '/solucoes'
}

function buildResponse(query: string, groups: SearchGroup[]): SearchResponse {
  const nonEmptyGroups = groups.filter((group) => group.results.length > 0)

  return {
    query,
    groups: nonEmptyGroups,
    total: nonEmptyGroups.reduce((sum, group) => sum + group.results.length, 0),
  }
}

export async function GET(request: NextRequest) {
  const query = normalizeText(request.nextUrl.searchParams.get('q')).slice(0, 120)

  if (!query) {
    return NextResponse.json<SearchResponse>({
      query: '',
      groups: [],
      total: 0,
    })
  }

  try {
    const payload = await getPayloadClient()

    const [pagesResult, postsResult, solutionsResult, contentsResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: RESULTS_PER_GROUP,
        sort: 'title',
        where: {
          or: [
            { title: { like: query } },
            { slug: { like: query } },
            { heroSubtitle: { like: query } },
          ],
        },
      }),
      payload.find({
        collection: 'posts',
        depth: 1,
        limit: RESULTS_PER_GROUP,
        sort: '-publishedAt',
        where: {
          and: [
            { status: { equals: 'published' } },
            {
              or: [
                { title: { like: query } },
                { slug: { like: query } },
                { excerpt: { like: query } },
              ],
            },
          ],
        },
      }),
      payload.find({
        collection: 'solucoes',
        depth: 1,
        limit: RESULTS_PER_GROUP,
        sort: 'order',
        where: {
          or: [
            { title: { like: query } },
            { slug: { like: query } },
            { shortDescription: { like: query } },
          ],
        },
      }),
      payload.find({
        collection: 'conteudos',
        limit: RESULTS_PER_GROUP,
        sort: '-createdAt',
        where: {
          or: [
            { title: { like: query } },
            { slug: { like: query } },
            { description: { like: query } },
          ],
        },
      }),
    ])

    const pageItems: SearchResultItem[] = (pagesResult.docs as Page[])
      .filter((page) => normalizeText(page.slug).length > 0)
      .map((page) => ({
        id: String(page.id),
        title: normalizeText(page.title) || 'Página',
        href: pageHrefFromSlug(page.slug),
        description: normalizeText(page.meta?.description) || normalizeText(page.heroSubtitle),
      }))

    const postItems: SearchResultItem[] = (postsResult.docs as Post[])
      .filter((post) => normalizeText(post.slug).length > 0)
      .map((post) => ({
        id: String(post.id),
        title: normalizeText(post.title) || 'Post',
        href: `/news/${post.slug}`,
        description: normalizeText(post.excerpt),
      }))

    const solutionItems: SearchResultItem[] = (solutionsResult.docs as Solucoe[])
      .filter((solution) => normalizeText(solution.slug).length > 0)
      .map((solution) => ({
        id: String(solution.id),
        title: normalizeText(solution.title) || 'Solução',
        href: solutionHref(solution),
        description: normalizeText(solution.shortDescription),
      }))

    const contentItems: SearchResultItem[] = (contentsResult.docs as Conteudo[])
      .filter((content) => normalizeText(content.slug).length > 0)
      .map((content) => ({
        id: String(content.id),
        title: normalizeText(content.title) || 'Conteúdo',
        href: `/conteudos/${content.slug}`,
        description: normalizeText(content.description),
      }))

    const response = buildResponse(query, [
      { key: 'pages', label: groupLabels.pages, results: pageItems },
      { key: 'posts', label: groupLabels.posts, results: postItems },
      { key: 'solucoes', label: groupLabels.solucoes, results: solutionItems },
      { key: 'conteudos', label: groupLabels.conteudos, results: contentItems },
    ])

    return NextResponse.json<SearchResponse>(response, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json<SearchResponse>(
      {
        query,
        groups: [],
        total: 0,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
        status: 200,
      },
    )
  }
}
