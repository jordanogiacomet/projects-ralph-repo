'use client'

import { useState, type FormEvent } from 'react'

import { Button, Card, Input, SectionHeading, Textarea } from '@/components/ui'

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
    <Card as="section" padding="lg">
      <SectionHeading
        size="sm"
        title={title}
        description="Envie sua mensagem e nossa equipe retorna com a melhor solução para o seu cenário."
      />

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <Input
          name="nome"
          type="text"
          required
          placeholder="Nome"
          autoComplete="name"
        />
        <Input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          autoComplete="email"
        />
        <Input
          name="assunto"
          type="text"
          required
          placeholder="Assunto"
        />
        <Textarea
          name="mensagem"
          required
          rows={4}
          placeholder="Mensagem"
        />
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button
            type="submit"
            disabled={submitState === 'submitting'}
            trailingIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            {submitState === 'submitting' ? 'Enviando...' : 'Enviar mensagem'}
          </Button>
        </div>
        {submitState === 'success' && (
          <p className="text-meta-sm text-emerald-600">Mensagem enviada com sucesso.</p>
        )}
        {submitState === 'error' && (
          <p className="text-meta-sm text-red-600">Não foi possível enviar agora. Tente novamente.</p>
        )}
      </form>
    </Card>
  )
}
