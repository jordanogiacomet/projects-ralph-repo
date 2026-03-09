import Image from 'next/image'
import Link from 'next/link'

export type NewsPostCardItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl?: string
  authorName: string
  publishedAtLabel: string
}

type PostCardProps = {
  post: NewsPostCardItem
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/news/${post.slug}`} className="group block h-full">
        <div className="relative h-52 w-full overflow-hidden bg-accent-light">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(min-width: 1280px) 44vw, (min-width: 640px) 88vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent-light to-white text-sm font-semibold text-accent">
              Apollo Gestão
            </div>
          )}
        </div>

        <div className="flex h-[calc(100%-13rem)] flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
            {post.publishedAtLabel} · {post.authorName}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-text-primary transition group-hover:text-accent">
            {post.title}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{post.excerpt}</p>
          <span className="mt-6 inline-flex text-sm font-semibold text-accent transition group-hover:text-accent-hover">
            Ler publicação
          </span>
        </div>
      </Link>
    </article>
  )
}
