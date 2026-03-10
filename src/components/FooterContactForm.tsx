'use client'

import { useState, type FormEvent } from 'react'
import { Badge, Button, Card, Input, Textarea } from '@/components/ui'

type FooterContactFormProps = {
  title?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function FooterContactForm({ title = 'Entre em contato' }: FooterContactFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const guidanceItems = [
    'Tipo de ativo, frente de trabalho ou demanda principal.',
    'Região, unidade ou operação envolvida no projeto.',
    'Prazo, contexto e objetivo esperado para o retorno.',
  ]

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
      className="overflow-hidden rounded-[32px] border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.95))] shadow-[0_28px_65px_rgba(3,9,19,0.24)]"
      padding="lg"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div>
          <Badge tone="accent">Contato direto</Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-text-primary sm:text-[2rem]">
            {title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Compartilhe o contexto da demanda para que a equipe Apollo responda com orientação mais
            precisa, técnica e objetiva.
          </p>

          <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="nome"
                type="text"
                required
                label="Nome"
                placeholder="Seu nome"
                className="border-border/80 bg-white shadow-none focus:border-accent/35 focus:ring-accent/10"
              />
              <Input
                name="email"
                type="email"
                required
                label="E-mail"
                placeholder="voce@empresa.com.br"
                className="border-border/80 bg-white shadow-none focus:border-accent/35 focus:ring-accent/10"
              />
            </div>

            <Input
              name="assunto"
              type="text"
              required
              label="Assunto"
              placeholder="Como podemos ajudar?"
              className="border-border/80 bg-white shadow-none focus:border-accent/35 focus:ring-accent/10"
            />

            <Textarea
              name="mensagem"
              required
              rows={5}
              label="Mensagem"
              placeholder="Descreva objetivo, volume ou tipo de demanda."
              className="min-h-[156px] border-border/80 bg-white shadow-none focus:border-accent/35 focus:ring-accent/10"
            />

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs leading-5 text-text-muted">
                  Quanto mais contexto sobre escopo, unidade e prazo, mais assertivo tende a ser o
                  primeiro retorno.
                </p>
                {submitState === 'success' ? (
                  <p className="text-sm text-emerald-700">Mensagem enviada com sucesso.</p>
                ) : null}
                {submitState === 'error' ? (
                  <p className="text-sm text-red-600">
                    Não foi possível enviar agora. Tente novamente.
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={submitState === 'submitting'}
                variant="primary"
                className="rounded-pill px-6 sm:shrink-0"
              >
                {submitState === 'submitting' ? 'Enviando...' : 'Enviar mensagem'}
              </Button>
            </div>
          </form>
        </div>

        <aside className="hidden rounded-[28px] border border-border/80 bg-white/72 p-5 lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
            Inclua na mensagem
          </p>
          <ul className="mt-5 space-y-3">
            {guidanceItems.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-text-secondary">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-[22px] border border-accent/10 bg-accent-soft/55 p-4">
            <p className="text-sm font-semibold text-text-primary">
              Fluxo mais leve, resposta mais clara
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              O formulário continua simples, mas agora orienta melhor o envio para reduzir ruído e
              acelerar o direcionamento inicial.
            </p>
          </div>
        </aside>
      </div>
    </Card>
  )
}
