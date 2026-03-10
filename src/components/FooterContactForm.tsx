'use client'

import { useState, type FormEvent } from 'react'
import { Button, Card, Input, Textarea } from '@/components/ui'

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
    <Card
      tone="dark"
      className="overflow-hidden rounded-[32px] border-white/10 bg-white/[0.05] backdrop-blur-sm"
      padding="lg"
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">
            Atendimento consultivo
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-text-on-dark sm:text-[2rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Compartilhe o contexto do seu projeto e a equipe Apollo retorna com o direcionamento
            mais adequado.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="nome"
                type="text"
                required
                label="Nome"
                placeholder="Seu nome"
                labelClassName="text-white/82"
                className="border-white/10 bg-white/6 text-white placeholder:text-white/38 shadow-none focus:border-white/20 focus:ring-white/10"
              />
              <Input
                name="email"
                type="email"
                required
                label="E-mail"
                placeholder="voce@empresa.com.br"
                labelClassName="text-white/82"
                className="border-white/10 bg-white/6 text-white placeholder:text-white/38 shadow-none focus:border-white/20 focus:ring-white/10"
              />
            </div>

            <Input
              name="assunto"
              type="text"
              required
              label="Assunto"
              placeholder="Como podemos ajudar?"
              labelClassName="text-white/82"
              className="border-white/10 bg-white/6 text-white placeholder:text-white/38 shadow-none focus:border-white/20 focus:ring-white/10"
            />

            <Textarea
              name="mensagem"
              required
              rows={5}
              label="Mensagem"
              placeholder="Descreva objetivo, volume ou tipo de demanda."
              labelClassName="text-white/82"
              className="min-h-[156px] border-white/10 bg-white/6 text-white placeholder:text-white/38 shadow-none focus:border-white/20 focus:ring-white/10"
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                disabled={submitState === 'submitting'}
                variant="primary"
                className="rounded-pill px-6"
              >
                {submitState === 'submitting' ? 'Enviando...' : 'Enviar mensagem'}
              </Button>

              {submitState === 'success' ? (
                <p className="text-sm text-emerald-300">Mensagem enviada com sucesso.</p>
              ) : null}
              {submitState === 'error' ? (
                <p className="text-sm text-red-300">
                  Não foi possível enviar agora. Tente novamente.
                </p>
              ) : null}
            </div>
          </form>
        </div>

        <div className="hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08)_0%,rgba(0,86,166,0.2)_100%)] p-5 xl:block">
          <div className="h-full w-full rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
            <svg viewBox="0 0 320 220" className="h-full w-full text-white/72" aria-hidden="true">
              <rect
                x="20"
                y="30"
                width="280"
                height="160"
                rx="20"
                fill="currentColor"
                opacity="0.1"
              />
              <rect
                x="42"
                y="55"
                width="98"
                height="18"
                rx="5"
                fill="currentColor"
                opacity="0.38"
              />
              <rect
                x="42"
                y="86"
                width="236"
                height="10"
                rx="5"
                fill="currentColor"
                opacity="0.2"
              />
              <rect
                x="42"
                y="104"
                width="186"
                height="10"
                rx="5"
                fill="currentColor"
                opacity="0.2"
              />
              <rect
                x="42"
                y="132"
                width="138"
                height="34"
                rx="10"
                fill="currentColor"
                opacity="0.4"
              />
              <circle cx="246" cy="144" r="28" fill="currentColor" opacity="0.28" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  )
}
