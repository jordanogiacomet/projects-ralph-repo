import Link from 'next/link'
import { ContatoPageForm } from '@/components/ContatoPageForm'
import { FOOTER_DEFAULT_UNIDADES } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'

type MediaLike = {
  url?: string | null
}

type PageDoc = {
  heroTitle?: unknown
  heroSubtitle?: string
  heroImage?: unknown
}

type Unidade = {
  id?: string
  name?: string
  state?: string
  address?: string
  phone?: string
  email?: string
}

type FooterGlobalData = {
  unidades?: Unidade[]
}

const fallbackHeroTitle = 'Entre em contato com a Apollo Gestão'
const fallbackHeroSubtitle =
  'Nossa equipe está pronta para apoiar sua empresa em projetos de avaliação, controle patrimonial e consultoria técnica.'
const fallbackHeroImageUrl = '/images/contato-hero-placeholder.jpg'

const hasString = (value?: string): value is string =>
  typeof value === 'string' && value.trim().length > 0

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

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
}

function phoneHref(phone?: string): string | undefined {
  if (!hasString(phone)) return undefined

  const digits = phone.replace(/\D/g, '')

  if (!digits) return undefined

  if (digits.startsWith('55')) {
    return `tel:+${digits}`
  }

  return `tel:+55${digits}`
}

function mergeUnits(unidades?: Unidade[]): Unidade[] {
  if (!Array.isArray(unidades) || unidades.length === 0) {
    return FOOTER_DEFAULT_UNIDADES
  }

  return FOOTER_DEFAULT_UNIDADES.map((defaultUnit, index) => {
    const unit = unidades[index]

    if (!unit) {
      return defaultUnit
    }

    return {
      name: hasString(unit.name) ? unit.name : defaultUnit.name,
      state: hasString(unit.state) ? unit.state : defaultUnit.state,
      address: hasString(unit.address) ? unit.address : defaultUnit.address,
      phone: hasString(unit.phone) ? unit.phone : defaultUnit.phone,
      email: hasString(unit.email) ? unit.email : defaultUnit.email,
    }
  })
}

export default async function ContatoPage() {
  let heroTitle = fallbackHeroTitle
  let heroSubtitle = fallbackHeroSubtitle
  let heroImageUrl = fallbackHeroImageUrl
  let unidades: Unidade[] = FOOTER_DEFAULT_UNIDADES

  try {
    const payload = await getPayloadClient()
    const [pageResult, footerGlobal] = await Promise.all([
      payload.find({
        collection: 'pages',
        limit: 1,
        where: { slug: { equals: 'contato' } },
      }),
      payload.findGlobal({ slug: 'footer' }),
    ])

    const pageData = pageResult.docs[0] as PageDoc | undefined
    const footerData = footerGlobal as unknown as FooterGlobalData

    heroTitle = richTextToPlainText(pageData?.heroTitle) || fallbackHeroTitle
    heroSubtitle = pageData?.heroSubtitle || fallbackHeroSubtitle
    heroImageUrl = mediaUrl(pageData?.heroImage) || fallbackHeroImageUrl
    unidades = mergeUnits(footerData.unidades)
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-[56vh] items-center overflow-hidden bg-bg-dark-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(0, 86, 166, 0.36), transparent 42%), radial-gradient(circle at 85% 18%, rgba(255, 255, 255, 0.14), transparent 35%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/90 sm:text-lg">{heroSubtitle}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <ContatoPageForm />

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold sm:text-3xl">Nossas unidades</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                Atendimento com equipes especializadas no Rio Grande do Sul, Santa Catarina e São
                Paulo.
              </p>

              <div className="mt-6 grid gap-4">
                {unidades.map((unit, index) => (
                  <article key={unit.id || `${unit.state}-${index}`} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-text-primary">
                        {unit.name || 'Apollo Gestão'}
                      </h3>
                      <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
                        {unit.state || 'BR'}
                      </span>
                    </div>
                    {hasString(unit.address) ? (
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{unit.address}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      {hasString(unit.phone) ? (
                        <a
                          href={phoneHref(unit.phone)}
                          className="font-medium text-accent transition-colors hover:text-accent-hover"
                        >
                          {unit.phone}
                        </a>
                      ) : null}
                      {hasString(unit.email) ? (
                        <a
                          href={`mailto:${unit.email}`}
                          className="font-medium text-accent transition-colors hover:text-accent-hover"
                        >
                          {unit.email}
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-accent/20 bg-accent-light p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold sm:text-2xl">Precisa de outro atendimento?</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                Acesse os formulários específicos para cotação comercial ou cadastro de
                representante.
              </p>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/contato/cotacao"
                  className="inline-flex items-center justify-between rounded-md border border-accent/25 bg-white px-4 py-3 text-sm font-semibold text-accent transition hover:border-accent/40 hover:bg-accent/5"
                >
                  Ir para Cotação
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/contato/representante"
                  className="inline-flex items-center justify-between rounded-md border border-accent/25 bg-white px-4 py-3 text-sm font-semibold text-accent transition hover:border-accent/40 hover:bg-accent/5"
                >
                  Ir para Representante
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  )
}
