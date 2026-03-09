import { RepresentanteForm } from '@/components/RepresentanteForm'

const heroTitle = 'Seja um representante Apollo Gestão'
const heroSubtitle =
  'Buscamos parceiros comerciais para ampliar nossa presença regional com soluções de avaliação e controle patrimonial.'

export default function RepresentantePage() {
  return (
    <div className="bg-bg-primary text-text-primary">
      <section className="relative flex min-h-[56vh] items-center overflow-hidden bg-bg-dark-section">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(0, 86, 166, 0.4), transparent 44%), radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.14), transparent 36%), linear-gradient(140deg, rgba(9, 24, 48, 0.95), rgba(26, 26, 46, 0.9))',
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
          <RepresentanteForm />
        </div>
      </section>
    </div>
  )
}
