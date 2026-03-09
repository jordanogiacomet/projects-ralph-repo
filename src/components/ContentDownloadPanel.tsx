'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

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
      <section className="rounded-2xl border border-border bg-bg-secondary p-6 sm:p-7">
        <h2 className="text-xl font-bold sm:text-2xl">Download em preparacao</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
          Este material ainda nao possui arquivo publicado. Fale com nossa equipe para receber o
          conteudo.
        </p>
        <Link
          href="/contato"
          className="mt-5 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Solicitar material
        </Link>
      </section>
    )
  }

  if (!requiresEmail || downloadReleased) {
    return (
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-7">
        <h2 className="text-xl font-bold sm:text-2xl">Download liberado</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
          Clique no botao abaixo para acessar o material.
        </p>
        <a
          href={downloadUrl}
          className="mt-5 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Baixar material
        </a>
        {submitState === 'success' ? (
          <p className="mt-3 text-sm text-emerald-600">E-mail registrado com sucesso.</p>
        ) : null}
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-7">
      <h2 className="text-xl font-bold sm:text-2xl">Receber material por e-mail</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        Informe seu e-mail para liberar o download imediato deste conteudo.
      </p>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit} noValidate>
        <label htmlFor="conteudo-email" className="text-sm font-medium text-text-primary">
          E-mail
        </label>
        <input
          id="conteudo-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@empresa.com"
          className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
        />

        {validationMessage ? (
          <p className="text-sm text-red-600" role="alert">
            {validationMessage}
          </p>
        ) : null}
        {submitState === 'error' ? (
          <p className="text-sm text-red-600" role="alert">
            Nao foi possivel liberar o download agora. Tente novamente.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex w-fit items-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === 'submitting' ? 'Liberando...' : 'Liberar download'}
        </button>
      </form>
    </section>
  )
}
