import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { fallbackConteudos } from '@/lib/conteudos'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Conteudo } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type ConteudoCard = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
}

const fallbackImageUrl = '/images/conteudos/default-cover.svg'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/conteudos',
    fallbackTitle: 'Conteudos Gratuitos - Apollo Gestao',
    fallbackDescription:
      'Baixe e-books e materiais tecnicos gratuitos sobre controle patrimonial, avaliacao de ativos e conformidade contabil.',
  })
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

function withTruncatedText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

export default async function ConteudosPage() {
  let cards: ConteudoCard[] = fallbackConteudos.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
  }))

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'conteudos',
      limit: 24,
      sort: '-createdAt',
      depth: 1,
    })

    const mapped = (result.docs as Conteudo[])
      .filter((item) => typeof item.slug === 'string' && item.slug.length > 0)
      .map((item) => {
        const description =
          normalizeText(item.description) ||
          richTextToPlainText(item.content) ||
          'Material tecnico gratuito para apoiar decisoes patrimoniais.'

        return {
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          description: withTruncatedText(description, 180),
          imageUrl: mediaUrl(item.featuredImage) || fallbackImageUrl,
        }
      })

    if (mapped.length > 0) {
      cards = mapped
    }
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 14% 18%, rgba(0, 86, 166, 0.3), transparent 40%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.12), transparent 34%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-text-on-dark sm:px-6 lg:px-8 lg:py-20">
          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
            Conteudos gratuitos para evoluir sua gestao patrimonial
          </h1>
          <p className="mt-5 max-w-3xl text-base text-white/90 sm:text-lg">
            Explore materiais tecnicos com orientacoes praticas sobre inventario, depreciacao e
            conformidade contabil.
          </p>
        </div>
      </section>

      <section className="bg-bg-secondary py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="relative h-52 w-full overflow-hidden bg-accent-light">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                  <Link
                    href={`/conteudos/${item.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-accent transition hover:text-accent-hover"
                  >
                    Ver material
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
