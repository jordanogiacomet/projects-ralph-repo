'use client'

import { useState, type FormEvent } from 'react'

import { Badge, Button, Card, Input, SectionHeading } from '@/components/ui'
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
  const [email, setEmail] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setValidationMessage('Digite um e-mail valido para concluir a inscricao.')
      setSubmitState('idle')
      return
    }

    try {
      setValidationMessage(null)
      setSubmitState('submitting')

      const response = await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      if (response.ok) {
        setEmail('')
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
    <Card
      as="section"
      padding="lg"
      className={cn(
        'relative overflow-hidden border-border/90 bg-white/95 shadow-soft backdrop-blur-sm',
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
        <SectionHeading className="mt-5" size="sm" title={title} description={description} />

        <form
          className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={handleSubmit}
          noValidate
        >
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            label="E-mail"
            labelClassName="sr-only"
            placeholder="Seu melhor e-mail profissional"
            description="Usamos este cadastro para enviar artigos, leituras tecnicas e materiais curatoriais da Apollo."
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (validationMessage) {
                setValidationMessage(null)
              }
            }}
            error={validationMessage ?? undefined}
          />
          <Button
            type="submit"
            disabled={submitState === 'submitting'}
            size="lg"
            className="w-full rounded-pill sm:min-w-[15rem]"
          >
            {submitState === 'submitting' ? 'Inscrevendo...' : 'Quero receber atualizacoes'}
          </Button>
        </form>

        <div className="mt-4 min-h-5" aria-live="polite">
          {submitState === 'success' ? (
            <p className="text-sm text-emerald-700" role="status">
              Inscricao realizada com sucesso.
            </p>
          ) : null}
          {submitState === 'duplicate' ? (
            <p className="text-sm text-amber-700" role="status">
              Este e-mail ja esta inscrito na newsletter.
            </p>
          ) : null}
          {submitState === 'error' ? (
            <p className="text-sm text-red-700" role="alert">
              Nao foi possivel concluir agora. Tente novamente.
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
