import type { Metadata } from 'next'

import { PostList } from '@/components/PostList'
import { Badge, Button, Container } from '@/components/ui'
import {
  mapPostToNewsPostCardItem,
  type NewsPostCardItem,
} from '@/lib/news'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import type { Post } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/news',
    fallbackTitle: 'News - Apollo Gestao',
    fallbackDescription:
      'Acompanhe as publicacoes mais recentes da Apollo Gestao sobre avaliacao, inventario e governanca de ativos.',
  })
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
      .map(mapPostToNewsPostCardItem)
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
    return []
  }
}

export default async function NewsPage() {
  const posts = await getNewsPosts()
  const categoryCount = new Set(posts.flatMap((post) => post.categories)).size
  const authorCount = new Set(posts.map((post) => post.authorName)).size
  const latestDate = posts[0]?.publishedAtLabel || 'Acervo em atualizacao'

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36">
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
              'radial-gradient(circle at 14% 18%, rgba(0, 86, 166, 0.36), transparent 34%), radial-gradient(circle at 82% 14%, rgba(255, 255, 255, 0.12), transparent 26%), radial-gradient(circle at 48% 92%, rgba(40, 167, 69, 0.12), transparent 28%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(180deg, rgba(8,14,26,0.5) 0%, transparent 100%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
            <div className="max-w-3xl text-text-on-dark">
              <Badge className="border border-white/12 bg-white/[0.08] text-white/78 shadow-[0_14px_35px_rgba(8,14,26,0.2)]">
                News Apollo
              </Badge>
              <h1 className="mt-6 font-display text-display-md font-extrabold tracking-tight text-white sm:mt-8">
                Artigos, analises e pontos de vista para liderar decisoes patrimoniais com mais
                clareza.
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-white/74 sm:mt-6">
                O hub de News foi reorganizado como um acervo editorial mais premium: melhor
                hierarquia, metadata mais clara, superfícies mais maduras e leitura mais fluida
                entre listagem e detalhe.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#news-archive"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Explorar artigos
                </Button>
                <Button
                  href="/contato"
                  variant="inverted"
                  size="lg"
                  className="rounded-pill"
                >
                  Falar com especialistas
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
                  Radar editorial
                </p>
                <p className="mt-4 text-body-md text-white/74">
                  O novo desenho aproxima o blog da linguagem do restante da fase 2: mais respiro,
                  melhor valor percebido e um fluxo editorial mais consistente em desktop e mobile.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="font-display text-heading-lg font-bold text-white">
                      {posts.length}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">artigos ativos</p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="font-display text-heading-lg font-bold text-white">
                      {categoryCount}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">temas mapeados</p>
                  </div>
                  <div className="rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                    <p className="font-display text-heading-lg font-bold text-white">
                      {authorCount}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">vozes ativas</p>
                  </div>
                </div>

                <div className="mt-6 rounded-card border border-white/10 bg-black/10 p-4 shadow-[0_14px_28px_rgba(8,14,26,0.18)]">
                  <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/48">
                    Ultima atualizacao editorial
                  </p>
                  <p className="mt-2 font-display text-heading-lg font-bold text-white">
                    {latestDate}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section id="news-archive" className="relative z-10 -mt-12 sm:-mt-16">
        <Container>
          <PostList posts={posts} />
        </Container>
      </section>

      <section className="section-space bg-bg-secondary">
        <Container>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-bg-dark-section p-8 text-white shadow-strong sm:p-10 lg:p-12">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(8,14,26,0.96) 0%, rgba(8,14,26,0.88) 44%, rgba(0,86,166,0.22) 100%)',
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 16% 18%, rgba(255,255,255,0.08), transparent 24%), radial-gradient(circle at 82% 82%, rgba(40,167,69,0.14), transparent 28%)',
              }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-label-sm font-semibold uppercase tracking-[0.2em] text-white/58">
                  Conversa consultiva
                </p>
                <h2 className="mt-4 font-display text-heading-2xl font-semibold text-white sm:text-heading-3xl">
                  Se um tema do acervo toca o seu contexto, leve a conversa para um plano de ação.
                </h2>
                <p className="mt-4 text-body-md text-white/72">
                  Use o hub como ponto de partida e aprofunde com o time da Apollo ou com a
                  biblioteca gratuita de materiais.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/contato"
                  variant="success"
                  size="lg"
                  className="rounded-pill shadow-[0_18px_40px_rgba(31,138,56,0.24)]"
                >
                  Falar com especialistas
                </Button>
                <Button
                  href="/conteudos"
                  variant="inverted"
                  size="lg"
                  className="rounded-pill"
                >
                  Ver biblioteca
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
