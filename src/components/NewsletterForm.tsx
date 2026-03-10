'use client'

import { useState, type FormEvent } from 'react'

import { Badge, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

type SubmitState = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

type NewsletterFormProps = {
  className?: string
  description?: string
  title?: string
}

export function NewsletterForm({
  className,
  description = 'Inscreva-se para receber novas leituras, artigos tecnicos e materiais curatoriais da Apollo Gestão.',
  title = 'Receba novos artigos da Apollo por e-mail.',
}: NewsletterFormProps) {
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
    <div
      className={cn(
        'relative overflow-hidden rounded-panel border border-border bg-white/95 p-6 shadow-soft backdrop-blur-sm sm:p-7',
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 42%, rgba(15,23,42,0.04) 100%)',
        }}
        aria-hidden
      />
      <div className="relative">
        <Badge tone="accent">Newsletter Apollo</Badge>
        <h2 className="mt-5 font-display text-heading-lg font-semibold text-text-primary">{title}</h2>
        <p className="mt-3 text-body-sm text-text-secondary">{description}</p>

        <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">
            E-mail
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Seu melhor e-mail profissional"
            className="w-full rounded-field border border-border bg-surface-primary px-4 py-3 text-sm text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-200 placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
          <Button
            type="submit"
            disabled={submitState === 'submitting'}
            size="lg"
            className="w-full rounded-pill"
          >
            {submitState === 'submitting' ? 'Inscrevendo...' : 'Quero receber atualizacoes'}
          </Button>
        </form>

        <div className="mt-4 min-h-5" aria-live="polite">
          {submitState === 'success' ? (
            <p className="text-sm text-emerald-700">Inscricao realizada com sucesso.</p>
          ) : null}
          {submitState === 'duplicate' ? (
            <p className="text-sm text-amber-700">Este e-mail ja esta inscrito na newsletter.</p>
          ) : null}
          {submitState === 'error' ? (
            <p className="text-sm text-red-700">Nao foi possivel concluir agora. Tente novamente.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
