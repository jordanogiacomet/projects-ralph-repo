import type { Metadata } from 'next'

import { NewsletterForm } from '@/components/NewsletterForm'
import { PostList } from '@/components/PostList'
import type { NewsPostCardItem } from '@/components/PostCard'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Post, User } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

const fallbackExcerpt = 'Conteúdo técnico sobre gestão e controle patrimonial.'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/news',
    fallbackTitle: 'News - Apollo Gestao',
    fallbackDescription:
      'Acompanhe as publicacoes mais recentes da Apollo Gestao sobre avaliacao, inventario e governanca de ativos.',
  })
}

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

async function getNewsPosts(): Promise<NewsPostCardItem[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      limit: 100,
      where: {
        status: {
          equals: 'published',
        },
      },
      sort: '-publishedAt',
      depth: 1,
    })

    return (result.docs as Post[])
      .filter((post) => typeof post.slug === 'string' && post.slug.length > 0)
      .map((post) => {
        const excerpt =
          normalizeText(post.excerpt) ||
          withTruncatedText(richTextToPlainText(post.content), 180) ||
          fallbackExcerpt

        return {
          id: String(post.id),
          slug: post.slug,
          title: post.title,
          excerpt,
          imageUrl: mediaUrl(post.featuredImage) || mediaUrl(post.meta?.image),
          authorName: resolveAuthorName(post.author),
          publishedAtLabel: formatDateLabel(post.publishedAt || post.createdAt),
        }
      })
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
    return []
  }
}

export default async function NewsPage() {
  const posts = await getNewsPosts()

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section">
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(0, 86, 166, 0.36), transparent 44%), radial-gradient(circle at 84% 16%, rgba(255, 255, 255, 0.12), transparent 34%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-text-on-dark sm:px-6 lg:px-8 lg:py-20">
          <h1 className="max-w-5xl text-3xl font-bold leading-tight sm:text-5xl">
            Fique bem informado: <strong>Nossas recentes publicações</strong>
          </h1>
          <p className="mt-5 max-w-3xl text-base text-white/90 sm:text-lg">
            Insights e orientações técnicas para apoiar decisões em avaliação, inventário e
            governança patrimonial.
          </p>
        </div>
      </section>

      <section className="bg-bg-secondary py-14 sm:py-16">
        <PostList posts={posts} />
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Receba nossas atualizações por e-mail</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            Inscreva-se para receber novos artigos e materiais técnicos da Apollo Gestão.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
