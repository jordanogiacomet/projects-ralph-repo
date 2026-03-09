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
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
        Dados das unidades ainda não configurados.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {unidades.map((unidade, index) => (
        <article key={unidade.id || `${unidade.name || 'unidade'}-${index}`} className="rounded-xl border border-white/15 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-light">
            UNIDADE {unidade.state || unidade.name || ''}
          </p>
          <h4 className="mt-2 text-base font-semibold text-white">{unidade.name || 'Unidade'}</h4>
          {unidade.address && <p className="mt-2 text-sm text-white/80">{unidade.address}</p>}
          {unidade.phone && <p className="mt-2 text-sm text-white/90">Tel: {unidade.phone}</p>}
          {unidade.email && <p className="text-sm text-white/90">E-mail: {unidade.email}</p>}
        </article>
      ))}
    </div>
  )
}
