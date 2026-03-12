import type { Metadata } from 'next'

import { CotacaoForm } from '@/components/CotacaoForm'
import { Badge, Button, Card, Container } from '@/components/ui'
import { buildMetadata } from '@/lib/seo'

const heroTitle = 'Solicite uma proposta tecnica aderente ao seu cenario'
const heroSubtitle =
  'Compartilhe escopo, volume, localidade e material de apoio para que a Apollo estruture um retorno tecnico e comercial mais preciso.'

const heroChecklist = [
  'Contexto claro da demanda, da motivacao do projeto e do nivel de urgencia.',
  'Volume estimado de ativos, unidades, plantas ou frentes envolvidas.',
  'Planilhas, memoriais ou documentos que ajudem a equipe a entender a complexidade.',
]

const intakePillars = [
  {
    title: 'Escopo e objetivo',
    description:
      'Mapeie a frente de trabalho e a decisao que depende da proposta para evitar retornos genericos.',
  },
  {
    title: 'Volume e localidade',
    description:
      'Quantidade de ativos, quantidade de unidades e abrangencia geografica ajudam no dimensionamento.',
  },
  {
    title: 'Base documental',
    description:
      'Anexos sao opcionais, mas aceleram a triagem comercial e tecnica quando ja existem materiais de apoio.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: '/contato/cotacao',
    fallbackTitle: 'Orcamento - Apollo Gestao',
    fallbackDescription:
      'Solicite um orcamento tecnico para projetos de avaliacao e controle patrimonial.',
  })
}

export default function CotacaoPage() {
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
              'radial-gradient(circle at 15% 20%, rgba(0,86,166,0.36), transparent 42%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.12), transparent 34%), linear-gradient(135deg, rgba(0,86,166,0.08) 0%, transparent 58%)',
          }}
          aria-hidden
        />

        <Container className="relative z-10 grid gap-12 pb-20 pt-28 sm:pb-24 sm:pt-32 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] lg:items-end">
          <div className="max-w-3xl">
            <Badge tone="dark" className="border border-white/10 bg-white/[0.07] text-white/80">
              Fluxo comercial Apollo
            </Badge>
            <h1 className="mt-6 font-display text-display-md font-extrabold tracking-[-0.04em] text-white sm:text-display-lg">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-body-md text-white/74 sm:text-body-lg">
              {heroSubtitle}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
              Este formulario foi reorganizado como um briefing consultivo: primeiro o escopo,
              depois o material de apoio e por fim o contato de retorno.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button href="#formulario-cotacao" size="lg" trailingIcon={<ArrowIcon />}>
                Iniciar briefing
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
              Indicado para projetos de avaliacao patrimonial, inventario, organizacao de base de
              ativos, impairment, revisao de vida util e outras demandas consultivas da Apollo.
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
                O que agiliza a analise
              </p>
              <h2 className="mt-4 font-display text-heading-2xl font-semibold text-white">
                Um briefing melhor reduz retrabalho logo na primeira troca.
              </h2>

              <ul className="mt-6 space-y-4">
                {heroChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/74">
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
            {intakePillars.map((pillar) => (
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
          <CotacaoForm />
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
