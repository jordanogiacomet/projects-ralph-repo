import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentDownloadPanel } from '@/components/ContentDownloadPanel'
import { getFallbackConteudoBySlug } from '@/lib/conteudos'
import { getPayloadClient } from '@/lib/payload'
import type { Conteudo } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
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

    const imageUrl = mediaUrl(doc.featuredImage) || mediaUrl(doc.meta?.image) || fallback?.imageUrl || fallbackImageUrl
    const downloadUrl = mediaUrl(doc.downloadFile) || fallback?.downloadUrl

    return {
      title,
      slug,
      description,
      imageUrl,
      downloadUrl,
      requiresEmail: doc.requiresEmail ?? fallback?.requiresEmail ?? false,
      metaTitle: normalizeText(doc.meta?.title) || fallback?.metaTitle || `${title} | Apollo Gestao`,
      metaDescription: normalizeText(doc.meta?.description) || fallback?.metaDescription || description,
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
    return {
      title: 'Conteudo nao encontrado | Apollo Gestao',
      description: 'O conteudo solicitado nao foi encontrado.',
    }
  }

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `/conteudos/${data.slug}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'article',
      url: `/conteudos/${data.slug}`,
      images: data.imageUrl ? [data.imageUrl] : undefined,
    },
  }
}

export default async function ConteudoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getConteudoData(slug)

  if (!data) {
    notFound()
  }

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
                <Link href="/conteudos" className="hover:text-white">
                  Conteudos
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li className="text-white">{data.title}</li>
            </ol>
          </nav>

          <h1 className="mt-6 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">{data.title}</h1>
          <p className="mt-5 max-w-3xl text-base text-white/90 sm:text-lg">{data.description}</p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full bg-accent-light">
              <Image
                src={data.imageUrl || fallbackImageUrl}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 65vw, 100vw"
              />
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold sm:text-3xl">Sobre este material</h2>
              <p className="mt-4 leading-relaxed text-text-secondary">{data.description}</p>
            </div>
          </article>

          <div className="h-fit">
            <ContentDownloadPanel
              title={data.title}
              slug={data.slug}
              requiresEmail={data.requiresEmail}
              downloadUrl={data.downloadUrl}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
