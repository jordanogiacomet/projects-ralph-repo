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
      <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 text-sm text-white/70">
        Dados das unidades ainda não configurados.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {unidades.map((unidade, index) => (
        <article
          key={unidade.id || `${unidade.name || 'unidade'}-${index}`}
          className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/44">
            {unidade.state || 'Unidade'}
          </p>
          <h4 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
            {unidade.name || 'Unidade'}
          </h4>
          {unidade.address ? (
            <p className="mt-3 text-sm leading-6 text-white/72">{unidade.address}</p>
          ) : null}
          {unidade.phone ? (
            <p className="mt-4 text-sm text-white/88">Tel: {unidade.phone}</p>
          ) : null}
          {unidade.email ? (
            <p className="mt-1 text-sm text-white/72">E-mail: {unidade.email}</p>
          ) : null}
        </article>
      ))}
    </div>
  )
}
