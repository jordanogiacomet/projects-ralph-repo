'use client'

import { useState, type FormEvent } from 'react'

type ContatoFormProps = {
  title?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function ContatoForm({ title = 'Solicite um contato' }: ContatoFormProps) {
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
        headers: { 'Content-Type': 'application/json' },
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
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">
        Envie sua mensagem e nossa equipe retorna com a melhor solução para o seu cenário.
      </p>

      <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
        <input
          name="nome"
          type="text"
          required
          placeholder="Nome"
          className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
        />
        <input
          name="assunto"
          type="text"
          required
          placeholder="Assunto"
          className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
        />
        <textarea
          name="mensagem"
          required
          rows={4}
          placeholder="Mensagem"
          className="w-full resize-y rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex w-fit items-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === 'submitting' ? 'Enviando...' : 'Enviar mensagem'}
        </button>
        {submitState === 'success' && (
          <p className="text-sm text-emerald-600">Mensagem enviada com sucesso.</p>
        )}
        {submitState === 'error' && (
          <p className="text-sm text-red-600">Não foi possível enviar agora. Tente novamente.</p>
        )}
      </form>
    </section>
  )
}
