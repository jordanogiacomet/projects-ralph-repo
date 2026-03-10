type Unidade = {
  id?: string
  name?: string
  state?: string
  address?: string
  phone?: string
  email?: string
}

type FooterUnidadesProps = {
  unidades?: Unidade[]
}

export function FooterUnidades({ unidades }: FooterUnidadesProps) {
  if (!unidades || unidades.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/70">
        Dados das unidades ainda não configurados.
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {unidades.map((unidade, index) => (
        <article
          key={unidade.id || `${unidade.name || 'unidade'}-${index}`}
          className="rounded-[24px] border border-white/10 bg-[#0d1929]/72 p-5 shadow-[0_14px_30px_rgba(5,10,21,0.16)]"
        >
          <p className="text-label-sm font-semibold uppercase tracking-[0.22em] text-white/44">
            {unidade.state || 'Unidade'}
          </p>
          <h4 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
            {unidade.name || 'Unidade'}
          </h4>
          {unidade.address ? (
            <address className="mt-3 not-italic text-sm leading-6 text-white/72">
              {unidade.address}
            </address>
          ) : null}
          <div className="mt-4 space-y-1.5 text-sm">
            {unidade.phone ? (
              <a
                href={`tel:${unidade.phone.replace(/[^\d+]/g, '')}`}
                className="block text-white/88 transition hover:text-white focus-visible:outline-none focus-visible:underline focus-visible:decoration-white/40 focus-visible:underline-offset-4"
              >
                Tel: {unidade.phone}
              </a>
            ) : null}
            {unidade.email ? (
              <a
                href={`mailto:${unidade.email}`}
                className="block text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:underline focus-visible:decoration-white/30 focus-visible:underline-offset-4"
              >
                E-mail: {unidade.email}
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
