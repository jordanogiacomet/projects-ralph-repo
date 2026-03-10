'use client'

import { useState, type FormEvent } from 'react'

import { Badge, Button, Input } from '@/components/ui'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type ContentDownloadPanelProps = {
  title: string
  slug: string
  requiresEmail: boolean
  downloadUrl?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContentDownloadPanel({
  title,
  slug,
  requiresEmail,
  downloadUrl,
}: ContentDownloadPanelProps) {
  const [email, setEmail] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [downloadReleased, setDownloadReleased] = useState(!requiresEmail)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)

  const accessHighlights = requiresEmail
    ? [
        'Registro simples para liberar o arquivo imediatamente.',
        'Fluxo pensado para qualificar interesse sem quebrar a leitura.',
        'Download ideal para compartilhar com times financeiro, patrimonial e auditoria.',
      ]
    : [
        'Arquivo disponivel para download imediato.',
        'Mesmo padrao visual e editorial da biblioteca Apollo.',
        'Material pronto para circular entre equipes tecnicas e executivas.',
      ]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!downloadUrl) return

    const normalizedEmail = email.trim().toLowerCase()

    if (!emailPattern.test(normalizedEmail)) {
      setValidationMessage('Digite um e-mail valido para liberar o download.')
      return
    }

    setValidationMessage(null)
    setSubmitState('submitting')

    const payload = {
      formType: 'contato',
      data: {
        nome: 'Lead Conteudos',
        email: normalizedEmail,
        assunto: `Download de material - ${title}`,
        mensagem: `Solicitacao de download do material ${title} (${slug}).`,
        origem: 'conteudos',
        conteudoSlug: slug,
        conteudoTitulo: title,
      },
    }

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Falha ao registrar lead')
      }

      setSubmitState('success')
      setDownloadReleased(true)
    } catch {
      setSubmitState('error')
    }
  }

  if (!downloadUrl) {
    return (
      <section className="surface-muted overflow-hidden rounded-panel p-6 sm:p-7">
        <Badge tone="accent">Arquivo em preparacao</Badge>
        <h2 className="mt-4 font-display text-heading-lg font-semibold text-text-primary sm:text-heading-xl">
          Solicite este material diretamente a nossa equipe.
        </h2>
        <p className="mt-3 text-body-md text-text-secondary">
          Este conteudo ainda nao possui arquivo publicado. Se ele for relevante para o seu
          contexto, direcionamos a melhor alternativa por contato consultivo.
        </p>
        <Button href="/contato" size="lg" className="mt-6 rounded-pill">
          Solicitar material
        </Button>
      </section>
    )
  }

  if (!requiresEmail || downloadReleased) {
    return (
      <section className="relative overflow-hidden rounded-panel border border-border bg-white p-6 shadow-strong sm:p-7">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(145deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 44%, rgba(40,167,69,0.08) 100%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <Badge tone="success">
            {submitState === 'success' ? 'Acesso liberado' : 'Download disponivel'}
          </Badge>
          <h2 className="mt-4 font-display text-heading-lg font-semibold text-text-primary sm:text-heading-xl">
            Baixar material
          </h2>
          <p className="mt-3 text-body-md text-text-secondary">
            O arquivo ja esta pronto para ser acessado. Use o botao abaixo para abrir o material.
          </p>

          <div className="mt-6 space-y-3">
            {accessHighlights.map((highlight) => (
              <div
                key={highlight}
                className="flex gap-3 rounded-card border border-border bg-surface-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary"
              >
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cta-green" aria-hidden />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <a
            href={downloadUrl}
            className="mt-6 inline-flex min-h-14 items-center justify-center rounded-pill bg-accent px-6 text-base font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-px hover:bg-accent-hover"
          >
            Baixar material
          </a>

          {submitState === 'success' ? (
            <p className="mt-3 text-meta-sm font-medium text-emerald-700" role="status">
              E-mail registrado com sucesso.
            </p>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-panel border border-border bg-white p-6 shadow-strong sm:p-7">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 44%, rgba(15,23,42,0.05) 100%)',
        }}
        aria-hidden
      />
      <div className="relative">
        <Badge tone="accent">Acesso por e-mail</Badge>
        <h2 className="mt-4 font-display text-heading-lg font-semibold text-text-primary sm:text-heading-xl">
          Receber material
        </h2>
        <p className="mt-3 text-body-md text-text-secondary">
          Informe seu e-mail para liberar o download imediato deste conteudo sem sair da pagina.
        </p>

        <div className="mt-6 space-y-3">
          {accessHighlights.map((highlight) => (
            <div
              key={highlight}
              className="flex gap-3 rounded-card border border-border bg-surface-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary"
            >
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            id="conteudo-email"
            name="email"
            type="email"
            required
            label="E-mail"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (validationMessage) {
                setValidationMessage(null)
              }
            }}
            placeholder="voce@empresa.com"
            description="Usamos este registro apenas para liberar o arquivo e qualificar o interesse pelo material."
            error={validationMessage ?? undefined}
          />

          {submitState === 'error' ? (
            <p className="text-meta-sm font-medium text-red-600" role="alert">
              Nao foi possivel liberar o download agora. Tente novamente.
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="rounded-pill"
            disabled={submitState === 'submitting'}
          >
            {submitState === 'submitting' ? 'Liberando...' : 'Liberar download'}
          </Button>
        </form>
      </div>
    </section>
  )
}
