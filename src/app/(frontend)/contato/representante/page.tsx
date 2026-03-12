import type { Metadata } from 'next'

import { Badge, Button, Card, Container } from '@/components/ui'
import { RepresentanteForm } from '@/components/RepresentanteForm'
import { buildMetadata } from '@/lib/seo'

const heroTitle = 'Seja um representante Apollo Gestão'
const heroSubtitle =
  'Buscamos parceiros comerciais para ampliar nossa presença regional com soluções de avaliação e controle patrimonial.'

const heroChecklist = [
  'Cobertura regional clara, com leitura de mercado e capacidade de relacionamento consultivo.',
  'Experiencia em vendas tecnicas, servicos B2B ou frentes com decisores financeiros e operacionais.',
  'Disponibilidade para atuar como ponte comercial entre a demanda local e o time especialista da Apollo.',
]

const profilePillars = [
  {
    title: 'Cobertura regional',
    description:
      'Identifique cidade, estado e o raio real de atuacao para calibrar oportunidades e agendas.',
  },
  {
    title: 'Aderencia comercial',
    description:
      'Explique o segmento, o tipo de conta e o repertorio de dialogo comercial que voce ja domina.',
  },
  {
    title: 'Leitura consultiva',
    description:
      'A Apollo busca parceiros que entendam contexto, urgencia e profundidade tecnica antes de vender.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/contato/representante',
    fallbackTitle: 'Representante Apollo Gestao',
    fallbackDescription:
      'Cadastre-se para representar a Apollo Gestao e ampliar nossa atuacao em solucoes patrimoniais.',
  })
}

export default function RepresentantePage() {
  return (
    <div className="bg-bg-secondary text-text-primary">
      <section className="relative overflow-hidden bg-bg-dark-section text-text-on-dark">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,14,26,0.92) 0%, rgba(10,18,32,0.86) 42%, rgba(12,22,38,0.96) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(0,86,166,0.38), transparent 42%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.13), transparent 34%), linear-gradient(135deg, rgba(0,86,166,0.08) 0%, transparent 58%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10 grid gap-12 pb-20 pt-28 sm:pb-24 sm:pt-32 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] lg:items-end">
          <div className="max-w-3xl">
            <Badge tone="dark" className="border border-white/10 bg-white/[0.07] text-white/80">
              Programa de representantes
            </Badge>
            <h1 className="mt-6 font-display text-display-md font-extrabold tracking-[-0.04em] text-white sm:text-display-lg">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-body-md text-white/74 sm:text-body-lg">
              {heroSubtitle}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
              Este cadastro foi reposicionado como uma triagem comercial mais clara: primeiro o
              contexto de cobertura, depois a aderencia do perfil e por fim a experiencia comercial
              que sustenta a parceria.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button href="#formulario-representante" size="lg" trailingIcon={<ArrowIcon />}>
                Iniciar cadastro
              </Button>
              <Button
                href="/contato"
                variant="outline"
                size="lg"
                className="border-white/15 bg-white/[0.05] text-white hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
              >
                Voltar para contato
              </Button>
            </div>

            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
              Indicado para parceiros com leitura regional, acesso a decisores e capacidade de
              traduzir demandas consultivas em oportunidades qualificadas para a Apollo.
            </p>
          </div>

          <Card
            tone="dark"
            className="relative overflow-hidden border-white/10 bg-white/[0.06] backdrop-blur-sm"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 18% 14%, rgba(0,86,166,0.26), transparent 40%), linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              }}
              aria-hidden
            />

            <div className="relative">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-white/62">
                Perfil buscado
              </p>
              <h2 className="mt-4 font-display text-heading-2xl font-semibold text-white">
                Parcerias com leitura consultiva e cobertura comercial real.
              </h2>

              <ul className="mt-6 space-y-4">
                {heroChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/74"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/92">
                      <CheckIcon />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Container>
      </section>

      <Container className="relative -mt-10 sm:-mt-12">
        <Card className="relative overflow-hidden border-white/70 bg-white/95 shadow-[var(--shadow-strong)] backdrop-blur-sm">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(155deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 44%, rgba(15,23,42,0.05) 100%)',
            }}
            aria-hidden
          />

          <div className="relative grid gap-4 md:grid-cols-3">
            {profilePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[1.25rem] border border-border bg-white/88 p-4 sm:p-5"
              >
                <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent">
                  {pillar.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Container>

      <section className="pb-20 pt-10 sm:pb-24 sm:pt-14">
        <Container>
          <RepresentanteForm />
        </Container>
      </section>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
