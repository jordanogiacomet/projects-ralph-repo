import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { JsonLd } from '@/components/JsonLd'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PostCard } from '@/components/PostCard'
import { Badge, Button, Container, SectionHeading } from '@/components/ui'
import {
  fallbackNewsExcerpt,
  formatDateLabel,
  mapPostToNewsPostCardItem,
  normalizeText,
  type NewsPostCardItem,
  richTextToPlainText,
  toISODate,
} from '@/lib/news'
import { getPayloadClient } from '@/lib/payload'
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildMetadata,
} from '@/lib/seo'
import type { Post } from '@/payload-types'

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

type NewsPostPageData = {
  id: string
  title: string
  slug: string
  excerpt: string
  imageUrl?: string
  authorName: string
  publishedAtLabel: string
  publishedAtISO?: string
  updatedAtISO?: string
  updatedAtLabel: string
  categories: string[]
  readingTimeLabel: string
  content?: unknown
  metaTitle: string
  metaDescription: string
  related: NewsPostCardItem[]
}

const siteOrigin =
  (process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/+$/, '') ||
  'https://www.apollogestao.com.br'

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
          className="font-semibold text-accent underline-offset-4 transition hover:text-accent-hover hover:underline"
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
        <h3 key={key} className="mt-10 font-display text-heading-xl font-semibold text-text-primary">
          {renderInline(node.children, `${key}-h3`)}
        </h3>
      )
    }

    if (tag === 'h4') {
      return (
        <h4 key={key} className="mt-8 text-xl font-semibold text-text-primary">
          {renderInline(node.children, `${key}-h4`)}
        </h4>
      )
    }

    return (
      <h2 key={key} className="mt-12 font-display text-heading-2xl font-semibold text-text-primary">
        {renderInline(node.children, `${key}-h2`)}
      </h2>
    )
  }

  if (node.type === 'quote') {
    return (
      <blockquote
        key={key}
        className="mt-8 rounded-panel border border-border bg-surface-secondary px-6 py-5 text-body-md italic text-text-primary shadow-soft"
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
            ? 'mt-6 list-decimal space-y-3 pl-6 text-body-md text-text-secondary'
            : 'mt-6 list-disc space-y-3 pl-6 text-body-md text-text-secondary'
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
      <p key={key} className="mt-6 text-body-lg leading-8 text-text-secondary">
        {renderInline(node.children, `${key}-p`)}
      </p>
    )
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    return (
      <p key={key} className="mt-6 text-body-lg leading-8 text-text-secondary">
        {renderInline(node.children, `${key}-fallback`)}
      </p>
    )
  }

  return null
}

function renderRichContent(value: unknown): ReactNode {
  const blocks = getRootChildren(value)

  if (blocks.length === 0) {
    return <p className="mt-6 text-body-lg leading-8 text-text-secondary">{fallbackNewsExcerpt}</p>
  }

  return blocks.map((node, index) => renderBlock(node, index))
}

async function getPostData(slug: string): Promise<NewsPostPageData | null> {
  try {
    const payload = await getPayloadClient()
    const [result, recentResult] = await Promise.all([
      payload.find({
        collection: 'posts',
        limit: 1,
        where: {
          and: [
            {
              slug: {
                equals: slug,
              },
            },
            {
              status: {
                equals: 'published',
              },
            },
          ],
        },
        depth: 1,
      }),
      payload.find({
        collection: 'posts',
        limit: 5,
        where: {
          status: {
            equals: 'published',
          },
        },
        sort: '-publishedAt',
        depth: 1,
      }),
    ])

    const post = result.docs[0] as Post | undefined
    if (!post) return null

    const summary = mapPostToNewsPostCardItem(post)
    const related = (recentResult.docs as Post[])
      .filter(
        (item) =>
          item.id !== post.id && typeof item.slug === 'string' && item.slug.length > 0,
      )
      .map(mapPostToNewsPostCardItem)
      .slice(0, 3)

    return {
      ...summary,
      updatedAtISO: toISODate(post.updatedAt),
      updatedAtLabel: formatDateLabel(post.updatedAt || post.createdAt),
      content: post.content,
      metaTitle: normalizeText(post.meta?.title) || `${summary.title} | Apollo Gestão`,
      metaDescription: normalizeText(post.meta?.description) || summary.excerpt,
      related,
    }
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostData(slug)

  if (!post) {
    return buildMetadata({
      path: '/news',
      fallbackTitle: 'Publicacao nao encontrada - Apollo Gestao',
      fallbackDescription: 'A publicacao solicitada nao foi encontrada.',
    })
  }

  return buildMetadata({
    path: `/news/${post.slug}`,
    title: post.metaTitle,
    description: post.metaDescription,
    image: post.imageUrl,
    type: 'article',
    fallbackTitle: `${post.title} | Apollo Gestao`,
    fallbackDescription: post.excerpt,
  })
}

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostData(slug)

  if (!post) {
    notFound()
  }

  const canonicalPath = `/news/${post.slug}`
  const shareUrl = `${siteOrigin}${canonicalPath}`
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(post.title)
  const encodedWhatsAppText = encodeURIComponent(`${post.title} ${shareUrl}`)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: post.title, path: canonicalPath },
  ])
  const articleJsonLd = buildArticleJsonLd({
    headline: post.title,
    description: post.metaDescription,
    path: canonicalPath,
    image: post.imageUrl,
    datePublished: post.publishedAtISO,
    dateModified: post.updatedAtISO || post.publishedAtISO,
    authorName: post.authorName,
  })

  const shareLinks = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedWhatsAppText}` },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
    },
  ]

  return (
    <div className="bg-bg-primary text-text-primary">
      <JsonLd id="news-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLd id="news-article-jsonld" data={articleJsonLd} />
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
                    <Link href="/news" className="hover:text-white">
                      News
                    </Link>
                  </li>
                  <li aria-hidden>›</li>
                  <li className="text-white">{post.title}</li>
                </ol>
              </nav>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                  News Apollo
                </Badge>
                {post.categories.slice(0, 2).map((category) => (
                  <Badge
                    key={category}
                    className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/74">{post.excerpt}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                    Publicacao
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{post.publishedAtLabel}</p>
                </div>
                <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                    Leitura
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{post.readingTimeLabel}</p>
                </div>
                <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                    Autor
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{post.authorName}</p>
                </div>
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
                  Resumo editorial
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                      Atualizado
                    </p>
                    <p className="mt-2 font-display text-heading-lg font-bold text-white">
                      {post.updatedAtLabel}
                    </p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                      Editorias
                    </p>
                    <p className="mt-2 font-display text-heading-lg font-bold text-white">
                      {post.categories.length > 0 ? post.categories.length : 1}
                    </p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                      Conversao
                    </p>
                    <p className="mt-2 font-display text-heading-lg font-bold text-white">
                      Leitura + acao
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-white/68">
                  O detalhe foi reorganizado para equilibrar imagem, metadata, leitura e proximos
                  passos sem tratar o artigo como um simples texto corrido.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-10 sm:-mt-14">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <article className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-strong">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-accent-light/60">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1280px) 62vw, (min-width: 768px) 100vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(8,14,26,0.96)_0%,rgba(12,22,38,0.88)_48%,rgba(0,86,166,0.62)_100%)]" />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(25deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0) 44%, rgba(255,255,255,0.2) 100%)',
                  }}
                  aria-hidden
                />
                {!post.imageUrl ? (
                  <div className="absolute inset-0 flex items-end p-8">
                    <div className="max-w-xl">
                      <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                        News Apollo
                      </p>
                      <p className="mt-4 font-display text-heading-2xl font-semibold text-white">
                        {post.title}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-border/80 bg-white px-6 py-6 sm:px-8">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Publicado
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {post.publishedAtLabel}
                    </p>
                  </div>
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Atualizado
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {post.updatedAtLabel}
                    </p>
                  </div>
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Autor
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">{post.authorName}</p>
                  </div>
                  <div className="rounded-card border border-border bg-surface-secondary p-4 shadow-soft">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                      Leitura
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {post.readingTimeLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-10 pt-8 sm:px-10 sm:pb-12">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Conteudo da publicacao
                </p>
                <div className="mt-6 max-w-none">
                  {renderRichContent(post.content || richTextToPlainText(post.excerpt))}
                </div>
              </div>
            </article>

            <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
              <section className="surface-muted rounded-panel p-6 sm:p-7">
                <h2 className="font-display text-heading-lg font-semibold text-text-primary">
                  Compartilhar este artigo
                </h2>
                <p className="mt-3 text-body-sm text-text-secondary">
                  Leve o conteudo para sua equipe ou compartilhe com quem participa da discussao.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {shareLinks.map((share) => (
                    <a
                      key={share.label}
                      href={share.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-pill border border-border bg-white px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/30 hover:text-accent"
                    >
                      {share.label}
                    </a>
                  ))}
                </div>
              </section>

              <NewsletterForm
                title="Receba novas leituras e materiais tecnicos."
                description="Entre na newsletter para acompanhar novos artigos, pontos de vista e materiais curatoriais da Apollo."
              />

              <section className="surface-muted rounded-panel p-6 sm:p-7">
                <h2 className="font-display text-heading-lg font-semibold text-text-primary">
                  Transforme a leitura em conversa consultiva
                </h2>
                <p className="mt-3 text-body-sm text-text-secondary">
                  Se o tema desta publicacao se conecta ao seu contexto, avance para um contato
                  consultivo ou complemente a leitura com a biblioteca gratuita da Apollo.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Button href="/contato" size="lg" className="rounded-pill">
                    Falar com especialistas
                  </Button>
                  <Button href="/conteudos" variant="outline" size="lg" className="rounded-pill">
                    Ver biblioteca gratuita
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>

      {post.related.length > 0 ? (
        <section className="section-space bg-bg-secondary">
          <Container>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Continue lendo"
                title="Outras publicacoes da editoria Apollo"
                description="Mais artigos recentes para manter a leitura editorial coesa e aprofundar o contexto."
                size="sm"
                className="max-w-2xl"
              />
              <Button href="/news" variant="outline" size="lg" className="rounded-pill">
                Voltar para News
              </Button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {post.related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  )
}
