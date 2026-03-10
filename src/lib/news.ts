import type { Post, User } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

export type NewsPostCardItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl?: string
  authorName: string
  publishedAtLabel: string
  publishedAtISO?: string
  categories: string[]
  readingTimeLabel: string
}

export const fallbackNewsExcerpt = 'Conteudo tecnico sobre gestao e controle patrimonial.'

export function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

export function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
}

export function richTextToPlainText(value: unknown): string {
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
  return `${value.slice(0, maxLength - 1).trimEnd()}...`
}

export function formatDateLabel(value: unknown): string {
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

export function toISODate(value: unknown): string | undefined {
  const source = normalizeText(value)
  if (!source) return undefined

  const date = new Date(source)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString()
}

export function resolveAuthorName(author: Post['author']): string {
  if (author && typeof author === 'object') {
    const user = author as User
    const name = normalizeText(user.name)
    if (name) return name

    const email = normalizeText(user.email)
    if (email) return email
  }

  return 'Equipe Apollo Gestão'
}

export function normalizeCategories(categories: Post['categories']): string[] {
  if (!Array.isArray(categories)) return []

  const unique = new Map<string, string>()

  for (const category of categories) {
    const value = normalizeText(category)
    if (!value) continue

    const key = value.toLocaleLowerCase('pt-BR')
    if (!unique.has(key)) {
      unique.set(key, value)
    }
  }

  return Array.from(unique.values())
}

export function getReadingTimeLabel(value: unknown): string {
  const source = typeof value === 'string' ? normalizeText(value) : richTextToPlainText(value)
  const wordCount = source.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 190))

  return `${minutes} min de leitura`
}

export function mapPostToNewsPostCardItem(post: Post): NewsPostCardItem {
  const excerpt =
    normalizeText(post.excerpt) ||
    withTruncatedText(richTextToPlainText(post.content), 180) ||
    fallbackNewsExcerpt

  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title || 'Publicacao',
    excerpt,
    imageUrl: mediaUrl(post.featuredImage) || mediaUrl(post.meta?.image),
    authorName: resolveAuthorName(post.author),
    publishedAtLabel: formatDateLabel(post.publishedAt || post.createdAt),
    publishedAtISO: toISODate(post.publishedAt || post.createdAt),
    categories: normalizeCategories(post.categories),
    readingTimeLabel: getReadingTimeLabel(richTextToPlainText(post.content) || excerpt),
  }
}
