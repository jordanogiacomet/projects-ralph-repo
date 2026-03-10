import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { JsonLd } from '@/components/JsonLd'
import { SolutionCard } from '@/components/SolutionCard'
import { Badge, Button, Card, Container, SectionHeading } from '@/components/ui'
import { getPayloadClient } from '@/lib/payload'
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import type { Solucoe, SolucaoCategory } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type RelatedSolution = {
  id: string
  title: string
  href: string
  description?: string
  iconUrl?: string
  categoryLabel?: string
}

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  text?: string
  tag?: string
  url?: string
  listType?: string
  format?: number | string
  [key: string]: unknown
}

type SolutionPageData = {
  title: string
  heroTitle: string
  breadcrumbTitle?: string
  categoryTitle: string
  description: string
  heroImage?: string
  content?: unknown
  metaTitle: string
  metaDescription: string
  relatedSolutions: RelatedSolution[]
  tags?: string[]
  categorySlug?: string
}

type SolutionDetailConfig = {
  categorySlug: string
  solutionSlug: string
  legacySolutionSlug?: string
  fallbackData: SolutionPageData
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

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => normalizeText(item))
    .filter((item, index, array) => Boolean(item) && array.indexOf(item) === index)
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
      stack.push(...(node as { children: unknown[] }).children)
    }

    if ('root' in node && (node as { root?: unknown }).root) {
      stack.push((node as { root: unknown }).root)
    }
  }

  return textParts.reverse().join(' ').replace(/\s+/g, ' ').trim()
}

function buildRelatedSolutionDescription(
  title: string,
  categoryTitle: string,
  description?: string,
): string {
  const normalizedDescription = normalizeText(description)

  if (normalizedDescription) {
    return normalizedDescription
  }

  return `Leitura complementar em ${categoryTitle.toLowerCase()} para aprofundar ${title.toLowerCase()} com a mesma abordagem consultiva da Apollo.`
}

function getRootChildren(value: unknown): LexicalNode[] {
  if (!value || typeof value !== 'object') return []

  const root = (value as { root?: unknown }).root
  if (!root || typeof root !== 'object') return []

  const children = (root as { children?: unknown }).children
  if (!Array.isArray(children)) return []

  return children.filter(
    (child): child is LexicalNode => typeof child === 'object' && child !== null,
  )
}

function applyTextFormat(node: LexicalNode, content: ReactNode): ReactNode {
  if (typeof node.format !== 'number' || !node.format) {
    return content
  }

  let formatted = content

  if (node.format & 16) {
    formatted = (
      <code className="rounded-md bg-surface-secondary px-1.5 py-0.5 font-mono text-[0.95em] text-text-primary">
        {formatted}
      </code>
    )
  }

  if (node.format & 128) {
    formatted = (
      <span className="rounded-md bg-accent-soft/80 px-1.5 py-0.5 text-accent-strong">
        {formatted}
      </span>
    )
  }

  if (node.format & 8) {
    formatted = <span className="underline decoration-accent/35 underline-offset-4">{formatted}</span>
  }

  if (node.format & 4) {
    formatted = <span className="line-through">{formatted}</span>
  }

  if (node.format & 2) {
    formatted = <em className="italic">{formatted}</em>
  }

  if (node.format & 1) {
    formatted = <strong className="font-semibold text-text-primary">{formatted}</strong>
  }

  return formatted
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
        <a
          key={key}
          href={href || '#'}
          className="font-medium text-accent underline decoration-accent/25 underline-offset-4 transition hover:text-accent-hover"
        >
          {renderInline(child.children, `${key}-link`) || 'Link'}
        </a>
      )
    }

    if (typeof child.text === 'string') {
      return <span key={key}>{applyTextFormat(child, child.text)}</span>
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
        <div key={key} className="mt-12">
          <div className="h-px w-14 bg-gradient-to-r from-accent/35 to-transparent" aria-hidden />
          <h3 className="mt-4 font-display text-heading-xl font-semibold tracking-tight text-text-primary">
            {renderInline(node.children, `${key}-h3`)}
          </h3>
        </div>
      )
    }

    if (tag === 'h4') {
      return (
        <h4 key={key} className="mt-10 font-display text-heading-lg font-semibold tracking-tight text-text-primary">
          {renderInline(node.children, `${key}-h4`)}
        </h4>
      )
    }

    return (
      <div key={key} className="mt-14">
        <div className="h-px w-20 bg-gradient-to-r from-accent/45 to-transparent" aria-hidden />
        <h2 className="mt-5 font-display text-heading-2xl font-semibold tracking-tight text-text-primary">
          {renderInline(node.children, `${key}-h2`)}
        </h2>
      </div>
    )
  }

  if (node.type === 'quote') {
    return (
      <Card
        key={key}
        padding="lg"
        className="mt-8 overflow-hidden border-accent/10 bg-[linear-gradient(135deg,rgba(0,86,166,0.08)_0%,rgba(255,255,255,0.98)_42%,rgba(15,23,42,0.04)_100%)]"
      >
        <blockquote>
          <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-accent/78">
            Callout tecnico
          </p>
          <div className="mt-4 text-body-md italic leading-8 text-text-primary">
            {renderInline(node.children, `${key}-quote`)}
          </div>
        </blockquote>
      </Card>
    )
  }

  if (node.type === 'list') {
    const listChildren = (node.children || []).filter((child) => child.type === 'listitem')
    const isNumbered = node.listType === 'number'
    const ListTag = isNumbered ? 'ol' : 'ul'

    return (
      <ListTag key={key} className="mt-8 space-y-3">
        {listChildren.map((item, itemIndex) => (
          <li key={`${key}-item-${itemIndex}`} className="list-none">
            <Card padding="sm" className="border-border/80 bg-surface-secondary/88">
              <div className="flex items-start gap-4">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/12 bg-accent-soft/70 text-label-sm font-bold uppercase tracking-[0.16em] text-accent-strong"
                  aria-hidden
                >
                  {isNumbered ? String(itemIndex + 1).padStart(2, '0') : '•'}
                </span>
                <div className="min-w-0 text-body-md leading-7 text-text-secondary">
                  {renderInline(item.children, `${key}-item-${itemIndex}`)}
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ListTag>
    )
  }

  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mt-7 text-body-md leading-8 text-text-secondary">
        {renderInline(node.children, `${key}-p`)}
      </p>
    )
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    return (
      <p key={key} className="mt-7 text-body-md leading-8 text-text-secondary">
        {renderInline(node.children, `${key}-fallback`)}
      </p>
    )
  }

  return null
}

function renderRichContent(value: unknown, fallbackText: string): ReactNode {
  const blocks = getRootChildren(value)

  if (blocks.length === 0) {
    return <p className="text-body-md leading-8 text-text-secondary">{fallbackText}</p>
  }

  return blocks.map((block, index) => renderBlock(block, index))
}

async function findSolutionBySlug(solutionSlug: string, legacySolutionSlug?: string) {
  const payload = await getPayloadClient()

  let solutionResult = await payload.find({
    collection: 'solucoes',
    limit: 1,
    where: { slug: { equals: solutionSlug } },
    depth: 2,
  })

  if (!solutionResult.docs[0] && legacySolutionSlug) {
    solutionResult = await payload.find({
      collection: 'solucoes',
      limit: 1,
      where: { slug: { equals: legacySolutionSlug } },
      depth: 2,
    })
  }

  return {
    payload,
    solution: solutionResult.docs[0] as Solucoe | undefined,
  }
}

async function getSolutionPageData(config: SolutionDetailConfig): Promise<SolutionPageData> {
  try {
    const { payload, solution } = await findSolutionBySlug(
      config.solutionSlug,
      config.legacySolutionSlug,
    )

    if (!solution) {
      return config.fallbackData
    }

    const category =
      solution.category && typeof solution.category === 'object'
        ? (solution.category as SolucaoCategory)
        : undefined

    const categoryId = category?.id
    let relatedSolutions = config.fallbackData.relatedSolutions

    if (categoryId) {
      const relatedResult = await payload.find({
        collection: 'solucoes',
        limit: 10,
        where: { category: { equals: categoryId } },
        sort: 'order',
        depth: 0,
      })

      const related = (relatedResult.docs as Solucoe[])
        .filter((item) => item.slug !== solution.slug)
        .slice(0, 3)
        .map((item) => ({
          id: item.slug,
          title: item.title,
          href: `/solucoes/${category?.slug || config.categorySlug}/${item.slug}`,
          description: buildRelatedSolutionDescription(
            item.title,
            category?.title || config.fallbackData.categoryTitle,
            item.shortDescription || undefined,
          ),
          iconUrl: mediaUrl(item.icon),
          categoryLabel: category?.title || config.fallbackData.categoryTitle,
        }))

      if (related.length > 0) {
        relatedSolutions = related
      }
    }

    const title = solution.title || config.fallbackData.title
    const fallbackHeroTitle = normalizeText(config.fallbackData.heroTitle)
    const description =
      normalizeText(solution.shortDescription) ||
      richTextToPlainText(solution.content) ||
      config.fallbackData.description
    const tags = normalizeStringArray(solution.tags)

    return {
      title,
      heroTitle:
        fallbackHeroTitle && fallbackHeroTitle !== config.fallbackData.title
          ? fallbackHeroTitle
          : title,
      breadcrumbTitle: config.fallbackData.breadcrumbTitle || title,
      categoryTitle: category?.title || config.fallbackData.categoryTitle,
      categorySlug: category?.slug || config.categorySlug,
      description,
      heroImage:
        mediaUrl(solution.meta?.image) || mediaUrl(solution.icon) || config.fallbackData.heroImage,
      content: solution.content || config.fallbackData.content,
      metaTitle: normalizeText(solution.meta?.title) || `${title} | Apollo Gestão`,
      metaDescription: normalizeText(solution.meta?.description) || description,
      relatedSolutions,
      tags: tags.length > 0 ? tags : config.fallbackData.tags,
    }
  } catch {
    // Payload may be unavailable during static build in sandboxed environments.
    return config.fallbackData
  }
}

export async function generateSolutionDetailMetadata(
  config: SolutionDetailConfig,
): Promise<Metadata> {
  const data = await getSolutionPageData(config)

  return buildMetadata({
    path: `/solucoes/${config.categorySlug}/${config.solutionSlug}`,
    title: data.metaTitle,
    description: data.metaDescription,
    image: data.heroImage,
    type: 'article',
    fallbackTitle: data.metaTitle,
    fallbackDescription: data.metaDescription,
  })
}

export async function SolutionDetailPage({ config }: { config: SolutionDetailConfig }) {
  const data = await getSolutionPageData(config)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Solucoes', path: '/solucoes' },
    {
      name: data.categoryTitle,
      path: `/solucoes/${data.categorySlug || config.categorySlug}`,
    },
    {
      name: data.breadcrumbTitle || data.title,
      path: `/solucoes/${config.categorySlug}/${config.solutionSlug}`,
    },
  ])
  const heroTags = (data.tags || []).slice(0, 3)
  const deliverySignals = [
    {
      label: 'Aplicacao',
      value: heroTags[0] || 'Escopo tecnico consultivo',
    },
    {
      label: 'Categoria',
      value: data.categoryTitle,
    },
    {
      label: 'Trilha',
      value:
        data.relatedSolutions.length > 0
          ? `${data.relatedSolutions.length} recomendacoes editoriais conectadas`
          : 'Portfolio Apollo',
    },
  ]
  const supportHighlights = [
    {
      title: 'Listas com leitura orientada',
      description:
        'Itens, etapas e comparacoes passam a funcionar como superficies de apoio em vez de texto corrido sem hierarquia.',
    },
    {
      title: 'Callouts com mais contexto',
      description:
        'Blocos ricos e destaques agora reforcam observacoes tecnicas sem competir com o fio principal da pagina.',
    },
    {
      title: 'Continuacao editorial mais clara',
      description:
        data.relatedSolutions.length > 0
          ? `A recomendacao final conecta ${data.relatedSolutions.length} solucoes correlatas com o mesmo tom consultivo.`
          : 'Os proximos passos comerciais seguem visiveis sem interromper a leitura tecnica.',
    },
  ]
  const detailMeta = [
    { label: 'Categoria', value: data.categoryTitle },
    {
      label: 'Relacionadas',
      value:
        data.relatedSolutions.length > 0
          ? `${data.relatedSolutions.length} solucoes correlatas`
          : 'Portfolio Apollo',
    },
    { label: 'Foco', value: heroTags[0] || 'Atuacao tecnica' },
  ]

  return (
    <div className="bg-bg-primary text-text-primary">
      <JsonLd id={`solution-breadcrumb-${config.solutionSlug}`} data={breadcrumbJsonLd} />

      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-24 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
        {data.heroImage ? (
          <div
            className="absolute inset-0 scale-[1.03] bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${data.heroImage})` }}
            aria-hidden
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(162deg, rgba(8,14,26,0.96) 0%, rgba(10,18,32,0.9) 42%, rgba(8,14,26,0.98) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 16% 18%, rgba(0,86,166,0.34), transparent 36%), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.1), transparent 24%), radial-gradient(circle at 52% 92%, rgba(40,167,69,0.12), transparent 28%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
            <div className="max-w-3xl text-text-on-dark">
              <nav aria-label="Breadcrumb" className="text-sm text-white/78">
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
                    <Link
                      href={`/solucoes/${data.categorySlug || config.categorySlug}`}
                      className="hover:text-white"
                    >
                      {data.categoryTitle}
                    </Link>
                  </li>
                  <li aria-hidden>›</li>
                  <li className="text-white">{data.breadcrumbTitle || data.title}</li>
                </ol>
              </nav>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                  {data.categoryTitle}
                </Badge>
                <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                  Solucao Apollo
                </Badge>
                {heroTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white">
                {data.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/74">{data.description}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/contato/cotacao"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Solicitar cotacao
                </Button>
                <Button
                  href="/contato"
                  variant="ghost"
                  size="lg"
                  className="rounded-pill border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
                >
                  Falar com especialista
                </Button>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_65px_rgba(8,14,26,0.26)] backdrop-blur-sm sm:p-7">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%, rgba(0,86,166,0.16) 100%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                  Radar da solucao
                </p>
                <h2 className="mt-4 font-display text-heading-xl font-semibold text-white">
                  Leitura consultiva com contexto, profundidade e continuidade.
                </h2>
                <p className="mt-4 text-body-sm leading-relaxed text-white/72">
                  Hero, blocos auxiliares e recomendacoes foram reorganizados para reforcar
                  autoridade tecnica sem transformar a pagina em um catalogo mecanico.
                </p>

                <div className="mt-6 space-y-3">
                  {deliverySignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="flex gap-3 rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]"
                    >
                      <div className="min-w-0">
                        <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/46">
                          {signal.label}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-white/72">
                          {signal.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-10 pb-24 sm:-mt-14 sm:pb-28">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <article className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-strong">
              {data.heroImage ? (
                <div className="relative h-52 overflow-hidden border-b border-border/80 sm:h-60">
                  <div
                    className="absolute inset-0 scale-[1.04] bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.heroImage})` }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(24deg, rgba(8,14,26,0.86) 0%, rgba(8,14,26,0.28) 42%, rgba(255,255,255,0.12) 100%)',
                    }}
                    aria-hidden
                  />
                  <div className="relative flex h-full items-end px-6 py-6 sm:px-8 sm:py-8">
                    <div className="max-w-xl text-white">
                      <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                        {data.categoryTitle}
                      </p>
                      <p className="mt-4 font-display text-heading-2xl font-semibold text-white">
                        {data.heroTitle}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="border-b border-border/80 px-6 py-6 sm:px-8">
                <SectionHeading
                  eyebrow="Leitura detalhada"
                  title="Escopo organizado para leitura tecnica"
                  description="O template agora controla melhor a largura de leitura, hierarquia tipografica e respiro entre contexto, conteudo e acao."
                />

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {detailMeta.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft"
                    >
                      <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>

                <Card
                  tone="dark"
                  padding="lg"
                  className="mt-8 overflow-hidden border-white/8 bg-[linear-gradient(145deg,rgba(10,18,32,0.96)_0%,rgba(15,23,42,0.94)_46%,rgba(0,86,166,0.18)_100%)]"
                >
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
                    <div>
                      <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                        Blocos auxiliares
                      </p>
                      <h3 className="mt-4 font-display text-heading-xl font-semibold text-white">
                        Listas, destaques e callouts agora sustentam a leitura principal.
                      </h3>
                      <p className="mt-4 text-body-sm leading-relaxed text-white/72">
                        O corpo tecnico segue com largura controlada, mas ganhou superficies de
                        apoio para comparacoes, observacoes e proximos passos sem perder o tom
                        institucional.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                      {supportHighlights.map((highlight) => (
                        <div
                          key={highlight.title}
                          className="rounded-card border border-white/10 bg-white/[0.05] p-4 shadow-[0_16px_34px_rgba(8,14,26,0.2)]"
                        >
                          <p className="text-sm font-semibold text-white">{highlight.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/68">
                            {highlight.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="px-6 py-8 sm:px-10 sm:py-10">
                <div className="mx-auto max-w-reading">
                  {renderRichContent(data.content, data.description)}
                </div>
              </div>
            </article>

            <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
              <Card padding="lg" className="border-accent/10 bg-white/94">
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent/80">
                  Proximo passo
                </p>
                <h2 className="mt-4 font-display text-heading-xl font-semibold text-text-primary">
                  Leve esta demanda para um briefing com a Apollo.
                </h2>
                <p className="mt-4 text-body-sm text-text-secondary">
                  Centralizamos o CTA em uma superficie propria para que a decisao comercial nao
                  dispute espaco com o corpo tecnico da pagina.
                </p>

                <div className="mt-6 grid gap-3">
                  <Button href="/contato/cotacao" variant="success" size="lg" fullWidth>
                    Solicitar cotacao
                  </Button>
                  <Button href="/contato" variant="outline" size="lg" fullWidth>
                    Falar com a equipe
                  </Button>
                </div>
              </Card>

              <Card padding="lg" tone="dark" className="overflow-hidden">
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/58">
                  Apoios da leitura
                </p>
                <h2 className="mt-4 font-display text-heading-lg font-semibold text-white">
                  Superficies auxiliares com mais clareza editorial.
                </h2>
                <p className="mt-3 text-body-sm text-white/72">
                  Os destaques da pagina foram separados em camadas claras para que conteudo,
                  contexto e acao avancem no mesmo ritmo.
                </p>

                <div className="mt-5 space-y-3">
                  {supportHighlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-card border border-white/10 bg-white/[0.05] p-4"
                    >
                      <p className="text-sm font-semibold text-white">{highlight.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/68">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {data.relatedSolutions.length > 0 ? (
        <section className="pb-24 sm:pb-28">
          <Container>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-surface-secondary/72 px-6 py-8 shadow-soft sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <SectionHeading
                eyebrow="Veja tambem"
                title="Recomendacoes para aprofundar esta frente"
                description="A area relacionada deixa de ser uma lista utilitaria e passa a orientar a proxima leitura com o mesmo acabamento editorial do restante da pagina."
              />

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {data.relatedSolutions.map((solution, index) => (
                  <SolutionCard
                    key={solution.id}
                    index={index}
                    variant="compact"
                    item={{
                      id: solution.id,
                      title: solution.title,
                      description: buildRelatedSolutionDescription(
                        solution.title,
                        solution.categoryLabel || data.categoryTitle,
                        solution.description,
                      ),
                      href: solution.href,
                      iconUrl: solution.iconUrl,
                      categoryLabel: solution.categoryLabel || data.categoryTitle,
                    }}
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  )
}

export type { RelatedSolution, SolutionDetailConfig, SolutionPageData }
