import type { Metadata } from 'next'

import { CotacaoForm } from '@/components/CotacaoForm'
import { buildMetadata } from '@/lib/seo'

const heroTitle = 'Orçamento'
const heroSubtitle =
  'Descreva sua demanda com o máximo de contexto possível para que nossa equipe prepare uma proposta técnica e comercial aderente ao seu cenário.'

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
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-[56vh] items-center overflow-hidden bg-bg-dark-section">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 16% 20%, rgba(0, 86, 166, 0.38), transparent 44%), radial-gradient(circle at 82% 15%, rgba(255, 255, 255, 0.16), transparent 35%), linear-gradient(140deg, rgba(14, 26, 46, 0.95), rgba(26, 26, 46, 0.88))',
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 text-center text-text-on-dark sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/90 sm:text-lg">{heroSubtitle}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <CotacaoForm />
        </div>
      </section>
    </div>
  )
}
