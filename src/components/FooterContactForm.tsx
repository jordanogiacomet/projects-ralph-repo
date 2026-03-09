'use client'

import { useState, type FormEvent } from 'react'

type FooterContactFormProps = {
  title?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function FooterContactForm({ title = 'Entre em contato' }: FooterContactFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      formType: 'contato',
      data: {
        nome: formData.get('nome'),
        email: formData.get('email'),
        assunto: formData.get('assunto'),
        mensagem: formData.get('mensagem'),
      },
    }

    try {
      setSubmitState('submitting')

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário')
      }

      form.reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div>
        <h3 className="text-2xl font-semibold text-text-on-dark">{title}</h3>
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <input
            name="nome"
            type="text"
            required
            placeholder="Nome"
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-text-on-dark placeholder:text-white/65 focus:border-accent focus:outline-none"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="E-Mail"
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-text-on-dark placeholder:text-white/65 focus:border-accent focus:outline-none"
          />
          <input
            name="assunto"
            type="text"
            required
            placeholder="Assunto"
            className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-text-on-dark placeholder:text-white/65 focus:border-accent focus:outline-none"
          />
          <textarea
            name="mensagem"
            required
            placeholder="Mensagem"
            rows={4}
            className="w-full resize-y rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-text-on-dark placeholder:text-white/65 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitState === 'submitting'}
            className="inline-flex w-fit items-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitState === 'submitting' ? 'Enviando...' : 'Enviar mensagem'}
          </button>
          {submitState === 'success' && (
            <p className="text-sm text-emerald-300">Mensagem enviada com sucesso.</p>
          )}
          {submitState === 'error' && (
            <p className="text-sm text-red-300">Não foi possível enviar agora. Tente novamente.</p>
          )}
        </form>
      </div>

      <div className="hidden rounded-xl bg-gradient-to-br from-accent/25 to-white/10 p-4 lg:block">
        <div className="h-full w-full rounded-lg border border-white/20 bg-white/5 p-4">
          <svg viewBox="0 0 320 220" className="h-full w-full text-white/75" aria-hidden="true">
            <rect x="20" y="30" width="280" height="160" rx="12" fill="currentColor" opacity="0.12" />
            <rect x="42" y="55" width="98" height="18" rx="4" fill="currentColor" opacity="0.4" />
            <rect x="42" y="86" width="236" height="10" rx="4" fill="currentColor" opacity="0.25" />
            <rect x="42" y="104" width="190" height="10" rx="4" fill="currentColor" opacity="0.25" />
            <rect x="42" y="132" width="128" height="28" rx="6" fill="currentColor" opacity="0.45" />
            <circle cx="248" cy="146" r="28" fill="currentColor" opacity="0.35" />
          </svg>
        </div>
      </div>
    </div>
  )
}
