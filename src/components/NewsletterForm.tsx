'use client'

import { useState, type FormEvent } from 'react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

export function NewsletterForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') || '')
      .trim()
      .toLowerCase()

    if (!email) {
      setSubmitState('error')
      return
    }

    try {
      setSubmitState('submitting')

      const response = await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        form.reset()
        setSubmitState('success')
        return
      }

      if (response.status === 400 || response.status === 409) {
        setSubmitState('duplicate')
        return
      }

      setSubmitState('error')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          E-mail
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Seu melhor e-mail"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitState === 'submitting' ? 'Inscrevendo...' : 'Inscreva-se'}
        </button>
      </form>

      {submitState === 'success' ? (
        <p className="mt-3 text-sm text-emerald-700">Inscrição realizada com sucesso.</p>
      ) : null}
      {submitState === 'duplicate' ? (
        <p className="mt-3 text-sm text-amber-700">Este e-mail já está inscrito em nossa newsletter.</p>
      ) : null}
      {submitState === 'error' ? (
        <p className="mt-3 text-sm text-red-700">Não foi possível concluir agora. Tente novamente.</p>
      ) : null}
    </div>
  )
}
