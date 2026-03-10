import Image from 'next/image'
import Link from 'next/link'

import type { NewsPostCardItem } from '@/lib/news'
import { cn } from '@/lib/utils'

type PostCardProps = {
  post: NewsPostCardItem
  priority?: boolean
  variant?: 'featured' | 'standard'
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-accent/10 bg-accent-light px-3 py-1 text-label-sm font-semibold text-accent-strong">
      {label}
    </span>
  )
}

export function PostCard({ post, priority = false, variant = 'standard' }: PostCardProps) {
  const categoryLabels = post.categories.slice(0, variant === 'featured' ? 3 : 2)
  const hasImage = Boolean(post.imageUrl)

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-strong transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(8,14,26,0.12)]">
        <div
          className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,86,166,0.08) 0%, rgba(255,255,255,0) 46%, rgba(15,23,42,0.04) 100%)',
          }}
          aria-hidden
        />
        <Link
          href={`/news/${post.slug}`}
          className="relative grid h-full gap-0 lg:grid-cols-[minmax(280px,0.96fr)_minmax(0,1.04fr)]"
        >
          <div className="relative min-h-[280px] overflow-hidden bg-bg-dark-section">
            {hasImage ? (
              <Image
                src={post.imageUrl as string}
                alt={post.title}
                fill
                priority={priority}
                sizes="(min-width: 1280px) 36vw, (min-width: 1024px) 42vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            ) : null}
            <div
              className={cn(
                'absolute inset-0',
                hasImage
                  ? 'bg-gradient-to-br from-slate-950/18 via-slate-900/8 to-transparent'
                  : 'bg-[linear-gradient(145deg,rgba(8,14,26,0.98)_0%,rgba(12,22,38,0.92)_48%,rgba(0,86,166,0.72)_100%)]',
              )}
              aria-hidden
            />
            {!hasImage ? (
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                <span className="inline-flex w-fit items-center rounded-pill border border-white/12 bg-white/[0.08] px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.2em] text-white/74">
                  News Apollo
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                    Destaque editorial
                  </p>
                  <p className="mt-4 max-w-xs font-display text-heading-xl font-semibold leading-tight text-white">
                    {post.title}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {categoryLabels.length > 0 ? (
                categoryLabels.map((category) => <CategoryBadge key={category} label={category} />)
              ) : (
                <CategoryBadge label="News Apollo" />
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-meta-sm text-text-muted">
              <span>{post.publishedAtLabel}</span>
              <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
              <span>{post.readingTimeLabel}</span>
            </div>

            <h2 className="mt-5 font-display text-heading-2xl font-semibold leading-tight text-text-primary transition duration-200 group-hover:text-accent">
              {post.title}
            </h2>
            <p className="mt-4 max-w-2xl text-body-md text-text-secondary">{post.excerpt}</p>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
              <div className="min-w-0">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Por
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">{post.authorName}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition duration-200 group-hover:text-accent-hover">
                Ler reportagem
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="group relative overflow-hidden rounded-panel border border-border bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-strong">
      <div
        className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.04) 100%)',
        }}
        aria-hidden
      />
      <Link href={`/news/${post.slug}`} className="relative flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-accent-light/60">
          {hasImage ? (
            <Image
              src={post.imageUrl as string}
              alt={post.title}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 44vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-end bg-[linear-gradient(145deg,rgba(8,14,26,0.96)_0%,rgba(12,22,38,0.88)_48%,rgba(0,86,166,0.62)_100%)] p-6">
              <span className="inline-flex items-center rounded-pill border border-white/12 bg-white/[0.08] px-3 py-1 text-label-sm font-semibold uppercase tracking-[0.2em] text-white/78">
                News Apollo
              </span>
            </div>
          )}
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/18 to-transparent"
            aria-hidden
          />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex flex-wrap gap-2">
            {categoryLabels.length > 0 ? (
              categoryLabels.map((category) => <CategoryBadge key={category} label={category} />)
            ) : (
              <CategoryBadge label="Editorial Apollo" />
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-meta-sm text-text-muted">
            <span>{post.publishedAtLabel}</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
            <span>{post.readingTimeLabel}</span>
          </div>

          <h2 className="mt-5 font-display text-heading-xl font-semibold leading-tight text-text-primary transition duration-200 group-hover:text-accent">
            {post.title}
          </h2>
          <p className="mt-4 flex-1 text-body-sm text-text-secondary">{post.excerpt}</p>

          <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
            <div className="min-w-0">
              <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                Autor
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-text-primary">
                {post.authorName}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition duration-200 group-hover:text-accent-hover">
              Ler artigo
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
