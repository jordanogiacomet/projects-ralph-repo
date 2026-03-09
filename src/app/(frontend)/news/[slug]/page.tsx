import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type { Post, User } from '@/payload-types'

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

type NewsPostPageData = {
  title: string
  slug: string
  excerpt: string
  imageUrl?: string
  authorName: string
  publishedAtLabel: string
  content?: unknown
  metaTitle: string
  metaDescription: string
}

const fallbackExcerpt = 'Conteúdo técnico sobre gestão e controle patrimonial.'
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://www.apollogestao.com.br'

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
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

function formatDateLabel(value: unknown): string {
  const source = normalizeText(value)
  if (!source) return 'Sem data'

  const date = new Date(source)
  if (Number.isNaN(date.getTime())) return 'Sem data'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function resolveAuthorName(author: Post['author']): string {
  if (author && typeof author === 'object') {
    const user = author as User
    const name = normalizeText(user.name)
    if (name) return name

    const email = normalizeText(user.email)
    if (email) return email
  }

  return 'Equipe Apollo Gestão'
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
      <blockquote
        key={key}
        className="mt-6 rounded-xl border-l-4 border-accent bg-accent-light/50 px-5 py-4 italic text-text-primary"
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

function renderRichContent(value: unknown): ReactNode {
  const blocks = getRootChildren(value)

  if (blocks.length === 0) {
    return <p className="mt-5 leading-relaxed text-text-secondary">{fallbackExcerpt}</p>
  }

  return blocks.map((node, index) => renderBlock(node, index))
}

async function getPostData(slug: string): Promise<NewsPostPageData | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
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
    })

    const post = result.docs[0] as Post | undefined
    if (!post) return null

    const excerpt =
      normalizeText(post.excerpt) || withTruncatedText(richTextToPlainText(post.content), 180) || fallbackExcerpt
    const title = post.title || 'Publicação'

    return {
      title,
      slug,
      excerpt,
      imageUrl: mediaUrl(post.featuredImage) || mediaUrl(post.meta?.image),
      authorName: resolveAuthorName(post.author),
      publishedAtLabel: formatDateLabel(post.publishedAt || post.createdAt),
      content: post.content,
      metaTitle: normalizeText(post.meta?.title) || `${title} | Apollo Gestão`,
      metaDescription: normalizeText(post.meta?.description) || excerpt,
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
    return {
      title: 'Publicação não encontrada | Apollo Gestão',
      description: 'A publicação solicitada não foi encontrada.',
    }
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `/news/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      url: `/news/${post.slug}`,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  }
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
      <section className="relative overflow-hidden bg-bg-dark-section">
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 16% 16%, rgba(0, 86, 166, 0.32), transparent 42%), radial-gradient(circle at 84% 18%, rgba(255, 255, 255, 0.12), transparent 34%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-text-on-dark sm:px-6 lg:px-8 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-white/80">
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

          <h1 className="mt-6 max-w-5xl text-3xl font-bold leading-tight sm:text-5xl">{post.title}</h1>

          <p className="mt-4 text-sm font-medium text-white/90">
            {post.publishedAtLabel} · {post.authorName}
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {post.imageUrl ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-accent-light shadow-sm">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-border bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-9">
            {renderRichContent(post.content)}

            <div className="mt-12 border-t border-border pt-7">
              <h2 className="text-lg font-semibold text-text-primary">Compartilhar em redes sociais</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {shareLinks.map((share) => (
                  <a
                    key={share.label}
                    href={share.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent hover:text-accent"
                  >
                    {share.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
