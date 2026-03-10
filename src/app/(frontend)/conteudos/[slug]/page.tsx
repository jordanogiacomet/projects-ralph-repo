import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { ContentDownloadPanel } from '@/components/ContentDownloadPanel'
import { JsonLd } from '@/components/JsonLd'
import { Button, Container, SectionHeading } from '@/components/ui'
import { fallbackConteudos, getFallbackConteudoBySlug } from '@/lib/conteudos'
import { getPayloadClient } from '@/lib/payload'
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import type { Conteudo } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  url?: string
  listType?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

type ConteudoPreview = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  requiresEmail: boolean
  formatLabel: string
}

type ConteudoPageData = {
  title: string
  slug: string
  description: string
  imageUrl: string
  downloadUrl?: string
  requiresEmail: boolean
  metaTitle: string
  metaDescription: string
  content?: unknown
  updatedAtLabel: string
  accessLabel: string
  formatLabel: string
  related: ConteudoPreview[]
}

const fallbackImageUrl = '/images/conteudos/default-cover.svg'

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

function withTruncatedText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

function resolveFormatLabel(title: string, slug: string): string {
  const source = `${title} ${slug}`.toLowerCase()

  if (source.includes('planilha')) {
    return 'Planilha'
  }

  if (source.includes('checklist')) {
    return 'Checklist'
  }

  if (source.includes('guia') || source.includes('ebook') || source.includes('e-book')) {
    return 'E-book'
  }

  return 'Material tecnico'
}

function formatDateLabel(value: unknown): string {
  const source = normalizeText(value)
  if (!source) return 'Curadoria Apollo'

  const date = new Date(source)
  if (Number.isNaN(date.getTime())) return 'Curadoria Apollo'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
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
        <a
          key={key}
          href={href || '#'}
          className="font-medium text-accent underline-offset-2 hover:underline"
        >
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
        <h3 key={key} className="mt-8 font-display text-heading-lg font-semibold text-text-primary">
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
      <h2 key={key} className="mt-8 font-display text-heading-2xl font-semibold text-text-primary">
        {renderInline(node.children, `${key}-h2`)}
      </h2>
    )
  }

  if (node.type === 'quote') {
    return (
      <blockquote
        key={key}
        className="mt-6 rounded-card border-l-4 border-accent bg-accent-light/50 px-5 py-4 italic text-text-primary"
      >
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
          <li key={`${key}-item-${itemIndex}`}>
            {renderInline(item.children, `${key}-item-${itemIndex}`)}
          </li>
        ))}
      </ListTag>
    )
  }

  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mt-5 text-body-md text-text-secondary">
        {renderInline(node.children, `${key}-p`)}
      </p>
    )
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    return (
      <p key={key} className="mt-5 text-body-md text-text-secondary">
        {renderInline(node.children, `${key}-fallback`)}
      </p>
    )
  }

  return null
}

function renderRichContent(value: unknown, fallbackText: string): ReactNode {
  const blocks = getRootChildren(value)

  if (blocks.length === 0) {
    return <p className="mt-5 text-body-md text-text-secondary">{fallbackText}</p>
  }

  return blocks.map((node, index) => renderBlock(node, index))
}

function buildFallbackRelated(slug: string): ConteudoPreview[] {
  return fallbackConteudos
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      requiresEmail: item.requiresEmail,
      formatLabel: resolveFormatLabel(item.title, item.slug),
    }))
}

function mapFallback(slug: string): ConteudoPageData | null {
  const fallback = getFallbackConteudoBySlug(slug)
  if (!fallback) return null

  return {
    title: fallback.title,
    slug: fallback.slug,
    description: fallback.description,
    imageUrl: fallback.imageUrl,
    downloadUrl: fallback.downloadUrl,
    requiresEmail: fallback.requiresEmail,
    metaTitle: fallback.metaTitle,
    metaDescription: fallback.metaDescription,
    content: undefined,
    updatedAtLabel: 'Curadoria Apollo',
    accessLabel: fallback.requiresEmail ? 'Liberacao por e-mail' : 'Download imediato',
    formatLabel: resolveFormatLabel(fallback.title, fallback.slug),
    related: buildFallbackRelated(slug),
  }
}

async function getConteudoData(slug: string): Promise<ConteudoPageData | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'conteudos',
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1,
    })

    const doc = result.docs[0] as Conteudo | undefined
    if (!doc) {
      return mapFallback(slug)
    }

    const fallback = getFallbackConteudoBySlug(slug)
    const title = doc.title || fallback?.title || 'Conteudo gratuito'
    const description =
      normalizeText(doc.description) ||
      richTextToPlainText(doc.content) ||
      fallback?.description ||
      'Material tecnico gratuito para apoiar decisoes patrimoniais.'

    const imageUrl =
      mediaUrl(doc.featuredImage) || mediaUrl(doc.meta?.image) || fallback?.imageUrl || fallbackImageUrl
    const downloadUrl = mediaUrl(doc.downloadFile) || fallback?.downloadUrl

    const relatedResult = await payload.find({
      collection: 'conteudos',
      limit: 4,
      sort: '-updatedAt',
      depth: 1,
    })

    const related = (relatedResult.docs as Conteudo[])
      .filter((item) => typeof item.slug === 'string' && item.slug.length > 0 && item.slug !== slug)
      .slice(0, 3)
      .map((item) => ({
        id: String(item.id),
        slug: item.slug as string,
        title: item.title,
        description:
          withTruncatedText(
            normalizeText(item.description) ||
              richTextToPlainText(item.content) ||
              'Material tecnico gratuito para apoiar decisoes patrimoniais.',
            150,
          ),
        imageUrl: mediaUrl(item.featuredImage) || fallbackImageUrl,
        requiresEmail: item.requiresEmail ?? false,
        formatLabel: resolveFormatLabel(item.title, item.slug as string),
      }))

    const requiresEmail = doc.requiresEmail ?? fallback?.requiresEmail ?? false

    return {
      title,
      slug,
      description,
      imageUrl,
      downloadUrl,
      requiresEmail,
      metaTitle: normalizeText(doc.meta?.title) || fallback?.metaTitle || `${title} | Apollo Gestao`,
      metaDescription: normalizeText(doc.meta?.description) || fallback?.metaDescription || description,
      content: doc.content,
      updatedAtLabel: formatDateLabel(doc.updatedAt || doc.createdAt),
      accessLabel: requiresEmail ? 'Liberacao por e-mail' : 'Download imediato',
      formatLabel: resolveFormatLabel(title, slug),
      related: related.length > 0 ? related : buildFallbackRelated(slug),
    }
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
    return mapFallback(slug)
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getConteudoData(slug)

  if (!data) {
    return buildMetadata({
      path: '/conteudos',
      fallbackTitle: 'Conteudo nao encontrado - Apollo Gestao',
      fallbackDescription: 'O conteudo solicitado nao foi encontrado.',
    })
  }

  return buildMetadata({
    path: `/conteudos/${data.slug}`,
    title: data.metaTitle,
    description: data.metaDescription,
    image: data.imageUrl,
    type: 'article',
    fallbackTitle: `${data.title} | Apollo Gestao`,
    fallbackDescription: data.description,
  })
}

export default async function ConteudoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getConteudoData(slug)

  if (!data) {
    notFound()
  }

  const canonicalPath = `/conteudos/${data.slug}`
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Conteudos', path: '/conteudos' },
    { name: data.title, path: canonicalPath },
  ])

  return (
    <div className="bg-bg-primary text-text-primary">
      <JsonLd id="conteudos-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-24 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(8,14,26,0.94) 0%, rgba(12,22,38,0.86) 42%, rgba(8,14,26,0.98) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 16% 18%, rgba(0, 86, 166, 0.34), transparent 36%), radial-gradient(circle at 82% 14%, rgba(255, 255, 255, 0.12), transparent 26%), radial-gradient(circle at 52% 92%, rgba(40, 167, 69, 0.12), transparent 28%)',
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
                    <Link href="/conteudos" className="hover:text-white">
                      Conteudos
                    </Link>
                  </li>
                  <li aria-hidden>›</li>
                  <li className="text-white">{data.title}</li>
                </ol>
              </nav>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-pill border border-white/12 bg-white/[0.08] px-3 py-1 text-label-sm font-semibold text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                  Biblioteca Apollo
                </span>
                <span className="inline-flex items-center rounded-pill border border-white/12 bg-white/[0.08] px-3 py-1 text-label-sm font-semibold text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                  {data.accessLabel}
                </span>
              </div>

              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white">
                {data.title}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/74">{data.description}</p>
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
                  Resumo do material
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                      Formato
                    </p>
                    <p className="mt-2 font-display text-heading-lg font-bold text-white">
                      {data.formatLabel}
                    </p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                      Acesso
                    </p>
                    <p className="mt-2 font-display text-heading-lg font-bold text-white">
                      {data.accessLabel}
                    </p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                      Atualizacao
                    </p>
                    <p className="mt-2 font-display text-heading-lg font-bold text-white">
                      {data.updatedAtLabel}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-white/68">
                  A pagina foi reorganizada para equilibrar contexto, leitura e conversao sem
                  sacrificar clareza editorial.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-10 sm:-mt-14">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-strong">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-accent-light/60">
                <Image
                  src={data.imageUrl || fallbackImageUrl}
                  alt={data.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 62vw, (min-width: 768px) 100vw, 100vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(25deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0) 44%, rgba(255,255,255,0.2) 100%)',
                  }}
                  aria-hidden
                />
              </div>

              <div className="border-t border-border/80 bg-white px-6 py-6 sm:px-8">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Formato
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">{data.formatLabel}</p>
                  </div>
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Acesso
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">{data.accessLabel}</p>
                  </div>
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Atualizacao
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">{data.updatedAtLabel}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Conteudo do material
                </p>
                <div className="mt-6 max-w-none">
                  {renderRichContent(data.content, data.description)}
                </div>
              </div>
            </article>

            <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
              <ContentDownloadPanel
                title={data.title}
                slug={data.slug}
                requiresEmail={data.requiresEmail}
                downloadUrl={data.downloadUrl}
              />

              <section className="surface-muted rounded-panel p-6 sm:p-7">
                <h2 className="font-display text-heading-lg font-semibold text-text-primary">
                  Quando este material ajuda
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                    <span>Quando a equipe precisa organizar a discussao tecnica antes de um projeto.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                    <span>Quando ha duvidas sobre inventario, avaliacao ou criterios contabilmente relevantes.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                    <span>Quando voce precisa compartilhar um insumo objetivo com financeiro, patrimonio ou auditoria.</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space bg-bg-secondary">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Continue explorando"
              title="Outros materiais da biblioteca Apollo"
              description="Amplie a leitura com outros downloads da mesma frente editorial."
              size="sm"
              className="max-w-2xl"
            />
            <Button href="/conteudos" variant="outline" size="lg" className="rounded-pill">
              Voltar para a biblioteca
            </Button>
          </div>

          {data.related.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.related.map((item) => (
                <article
                  key={item.id}
                  className="group motion-transition motion-lift-card relative overflow-hidden rounded-panel border border-border bg-white/95 p-5 shadow-soft hover:shadow-strong sm:p-6"
                >
                  <div
                    className="motion-transition absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.04) 100%)',
                    }}
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-pill bg-accent-light px-3 py-1 text-label-sm font-semibold text-accent-strong">
                        {item.formatLabel}
                      </span>
                      <span className="inline-flex items-center rounded-pill bg-surface-muted px-3 py-1 text-label-sm font-semibold text-text-secondary">
                        {item.requiresEmail ? 'Liberacao guiada' : 'Acesso direto'}
                      </span>
                    </div>

                    <div className="mt-5 flex items-start gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card border border-border bg-accent-light/70">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="motion-media-scale object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-heading-lg font-semibold text-text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-body-sm text-text-secondary">{item.description}</p>
                      </div>
                    </div>

                    <Button
                      href={`/conteudos/${item.slug}`}
                      variant="ghost"
                      size="sm"
                      className="mt-6 rounded-pill px-0 text-accent hover:bg-transparent hover:text-accent-hover"
                    >
                      Abrir material
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  )
}
