import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type RelatedSolution = {
  id: string
  title: string
  href: string
}

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  text?: string
  tag?: string
  url?: string
  [key: string]: unknown
}

type SolutionPageData = {
  title: string
  heroTitle: string
  categoryTitle: string
  description: string
  heroImage?: string
  content?: unknown
  metaTitle: string
  metaDescription: string
  relatedSolutions: RelatedSolution[]
}

const categorySlug = 'avaliacao-patrimonial'
const solutionSlug = 'avaliacao-de-imoveis-urbanos-e-rurais'

const fallbackData: SolutionPageData = {
  title: 'Avaliação de Imóveis Urbanos e Rurais',
  heroTitle: 'Avaliação de Imóveis Urbanos e Rurais',
  categoryTitle: 'Avaliação Patrimonial',
  description:
    'Realizamos avaliações imobiliárias urbanas e rurais com metodologia técnica, aderência normativa e suporte especializado para decisões patrimoniais seguras.',
  metaTitle: 'Avaliação de Imóveis Urbanos e Rurais | Apollo Gestão',
  metaDescription:
    'Serviço de Avaliação de Imóveis Urbanos e Rurais da Apollo Gestão com laudos técnicos, análise de mercado e suporte para compliance e gestão patrimonial.',
  content: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          tag: 'h2',
          children: [
            {
              type: 'text',
              text: 'Avaliação imobiliária com segurança técnica e aderência às normas',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Conduzimos avaliações de imóveis urbanos e rurais com inspeção técnica, estudo de mercado e análise das características específicas de cada ativo.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Os laudos entregues apoiam auditorias, operações societárias, garantias e tomadas de decisão com maior confiabilidade patrimonial.',
            },
          ],
        },
      ],
    },
  },
  relatedSolutions: [
    {
      id: 'avaliacao-de-ativos',
      title: 'Avaliação de Ativos',
      href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos',
    },
    {
      id: 'avaliacao-de-ativos-biologicos',
      title: 'Avaliação de Ativos Biológicos',
      href: '/solucoes/avaliacao-patrimonial/avaliacao-de-ativos-biologicos',
    },
    {
      id: 'avaliacao-de-maquinas',
      title: 'Avaliação de Máquinas',
      href: '/solucoes/avaliacao-patrimonial/avaliacao-de-maquinas',
    },
  ],
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

function getRootChildren(value: unknown): LexicalNode[] {
  if (!value || typeof value !== 'object') return []

  const root = (value as { root?: unknown }).root
  if (!root || typeof root !== 'object') return []

  const children = (root as { children?: unknown }).children
  if (!Array.isArray(children)) return []

  return children.filter((child): child is LexicalNode => typeof child === 'object' && child !== null)
}

function renderInline(children: LexicalNode[] | undefined, keyPrefix: string): ReactNode {
  if (!children || children.length === 0) return null

  return children.map((child, index) => {
    const key = `${keyPrefix}-${index}`

    if (child.type === 'linebreak') {
      return <br key={key} />
    }

    if (child.type === 'link') {
      const href = normalizeText(child.url)
      return (
        <a key={key} href={href || '#'} className="text-accent underline-offset-2 hover:underline">
          {renderInline(child.children, `${key}-link`) || 'Link'}
        </a>
      )
    }

    if (typeof child.text === 'string') {
      return <span key={key}>{child.text}</span>
    }

    if (Array.isArray(child.children)) {
      return <span key={key}>{renderInline(child.children, `${key}-nested`)}</span>
    }

    return null
  })
}

function renderBlock(node: LexicalNode, index: number): ReactNode {
  const key = `block-${index}`

  if (node.type === 'heading') {
    const tag = normalizeText(node.tag).toLowerCase()

    if (tag === 'h3') {
      return (
        <h3 key={key} className="mt-8 text-2xl font-bold text-text-primary">
          {renderInline(node.children, `${key}-h3`)}
        </h3>
      )
    }

    if (tag === 'h4') {
      return (
        <h4 key={key} className="mt-7 text-xl font-semibold text-text-primary">
          {renderInline(node.children, `${key}-h4`)}
        </h4>
      )
    }

    return (
      <h2 key={key} className="mt-8 text-3xl font-bold text-text-primary">
        {renderInline(node.children, `${key}-h2`)}
      </h2>
    )
  }

  if (node.type === 'quote') {
    return (
      <blockquote key={key} className="mt-6 rounded-xl border-l-4 border-accent bg-accent-light/50 px-5 py-4 italic text-text-primary">
        {renderInline(node.children, `${key}-quote`)}
      </blockquote>
    )
  }

  if (node.type === 'list') {
    const listChildren = (node.children || []).filter((child) => child.type === 'listitem')
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'

    return (
      <ListTag
        key={key}
        className={
          node.listType === 'number'
            ? 'mt-5 list-decimal space-y-2 pl-6 text-text-secondary'
            : 'mt-5 list-disc space-y-2 pl-6 text-text-secondary'
        }
      >
        {listChildren.map((item, itemIndex) => (
          <li key={`${key}-item-${itemIndex}`}>{renderInline(item.children, `${key}-item-${itemIndex}`)}</li>
        ))}
      </ListTag>
    )
  }

  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mt-5 leading-relaxed text-text-secondary">
        {renderInline(node.children, `${key}-p`)}
      </p>
    )
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    return (
      <p key={key} className="mt-5 leading-relaxed text-text-secondary">
        {renderInline(node.children, `${key}-fallback`)}
      </p>
    )
  }

  return null
}

async function getSolutionPageData(): Promise<SolutionPageData> {
  try {
    const payload = await getPayloadClient()

    const solutionResult = await payload.find({
      collection: 'solucoes',
      limit: 1,
      where: { slug: { equals: solutionSlug } },
      depth: 2,
    })

    const solution = solutionResult.docs[0] as Solucoe | undefined
    if (!solution) {
      return fallbackData
    }

    const category =
      solution.category && typeof solution.category === 'object' ? (solution.category as SolucaoCategory) : undefined

    const categoryId = category?.id

    let relatedSolutions = fallbackData.relatedSolutions

    if (categoryId) {
      const relatedResult = await payload.find({
        collection: 'solucoes',
        limit: 10,
        where: { category: { equals: categoryId } },
        sort: 'order',
        depth: 0,
      })

      const related = (relatedResult.docs as Solucoe[])
        .filter((item) => item.slug !== solutionSlug)
        .slice(0, 3)
        .map((item) => ({
          id: item.slug,
          title: item.title,
          href: `/solucoes/${categorySlug}/${item.slug}`,
        }))

      if (related.length > 0) {
        relatedSolutions = related
      }
    }

    const title = solution.title || fallbackData.title
    const description =
      normalizeText(solution.shortDescription) || richTextToPlainText(solution.content) || fallbackData.description

    return {
      title,
      heroTitle: title,
      categoryTitle: category?.title || fallbackData.categoryTitle,
      description,
      heroImage: mediaUrl(solution.icon),
      content: solution.content || fallbackData.content,
      metaTitle: normalizeText(solution.meta?.title) || `${title} | Apollo Gestão`,
      metaDescription: normalizeText(solution.meta?.description) || description,
      relatedSolutions,
    }
  } catch {
    // Payload may be unavailable during static build in sandboxed environments.
    return fallbackData
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSolutionPageData()

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `/solucoes/${categorySlug}/${solutionSlug}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'article',
      url: `/solucoes/${categorySlug}/${solutionSlug}`,
    },
  }
}

export default async function AvaliacaoDeImoveisUrbanosERuraisPage() {
  const data = await getSolutionPageData()
  const contentBlocks = getRootChildren(data.content)

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-bg-dark-section">
        {data.heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.heroImage})` }}
            aria-hidden
          />
        ) : null}
        <div className="absolute inset-0 bg-black/65" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 18%, rgba(0, 86, 166, 0.30), transparent 42%), radial-gradient(circle at 84% 16%, rgba(255, 255, 255, 0.10), transparent 34%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/80">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <Link href="/solucoes" className="hover:text-white">
                  Soluções
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <Link href="/solucoes/avaliacao-patrimonial" className="hover:text-white">
                  {data.categoryTitle}
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li className="text-white">{data.title}</li>
            </ol>
          </nav>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-text-on-dark sm:text-5xl lg:text-6xl">
            {data.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-base text-white/90 sm:text-lg">{data.description}</p>
          <Link
            href="/contato/cotacao"
            className="mt-8 inline-flex rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
          >
            Solicitar Cotação
          </Link>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <article className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            {contentBlocks.length > 0 ? (
              contentBlocks.map((block, index) => renderBlock(block, index))
            ) : (
              <p className="leading-relaxed text-text-secondary">{fallbackData.description}</p>
            )}
          </article>

          <aside className="h-fit rounded-2xl border border-border bg-bg-secondary p-6 sm:p-7">
            <h2 className="text-xl font-bold">Veja também</h2>
            <ul className="mt-4 space-y-3">
              {data.relatedSolutions.map((solution) => (
                <li key={solution.id}>
                  <Link
                    href={solution.href}
                    className="block rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-text-primary transition hover:border-accent hover:text-accent"
                  >
                    {solution.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  )
}
