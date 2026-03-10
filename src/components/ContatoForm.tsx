'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Badge, Button, Card, Input, SectionHeading, Textarea } from '@/components/ui'

type ContatoFormProps = {
  title?: string
}

type ContactFormValues = {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const intakeHighlights = [
  {
    title: 'Contexto objetivo',
    description: 'Explique a frente de trabalho, o tipo de ativo ou a unidade envolvida.',
  },
  {
    title: 'Decisao em jogo',
    description: 'Diga qual devolutiva ou encaminhamento voce precisa viabilizar.',
  },
  {
    title: 'Prazo e urgencia',
    description: 'Se houver data critica, auditoria ou janela curta, sinalize no primeiro contato.',
  },
]

export function ContatoForm({ title = 'Solicite um contato' }: ContatoFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    mode: 'onBlur',
    defaultValues: {
      nome: '',
      email: '',
      assunto: '',
      mensagem: '',
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState('submitting')

    const payload = {
      formType: 'contato',
      data: {
        nome: values.nome.trim(),
        email: values.email.trim(),
        assunto: values.assunto.trim(),
        mensagem: values.mensagem.trim(),
      },
    }

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário')
      }

      reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <Card as="section" padding="lg" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.05) 100%)',
        }}
        aria-hidden
      />

      <div className="relative">
        <Badge tone="accent">Contato consultivo</Badge>
        <SectionHeading
          className="mt-5"
          size="sm"
          title={title}
          description="Compartilhe o contexto da demanda para que a equipe Apollo encaminhe o retorno mais aderente."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {intakeHighlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-[1.25rem] border border-accent/10 bg-accent-soft/55 p-4"
            >
              <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {highlight.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            type="text"
            autoComplete="name"
            label="Nome"
            error={errors.nome?.message}
            placeholder="Seu nome completo"
            {...register('nome', {
              required: 'Informe seu nome.',
              minLength: {
                value: 2,
                message: 'Digite ao menos 2 caracteres.',
              },
            })}
          />
          <Input
            type="email"
            autoComplete="email"
            label="E-mail corporativo"
            error={errors.email?.message}
            placeholder="voce@empresa.com"
            {...register('email', {
              required: 'Informe um e-mail valido.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Digite um e-mail valido.',
              },
            })}
          />
          <Input
            type="text"
            label="Assunto"
            error={errors.assunto?.message}
            wrapperClassName="sm:col-span-2"
            description="Se houver area, unidade ou frente de trabalho, informe isso aqui."
            placeholder="Ex: apoio para inventario patrimonial"
            {...register('assunto', {
              required: 'Informe o assunto da mensagem.',
              minLength: {
                value: 3,
                message: 'Digite ao menos 3 caracteres.',
              },
            })}
          />
          <Textarea
            rows={6}
            label="Mensagem"
            error={errors.mensagem?.message}
            wrapperClassName="sm:col-span-2"
            description="Inclua objetivo, localidade, volume estimado e qualquer prazo relevante."
            placeholder="Conte-nos como a Apollo pode ajudar."
            {...register('mensagem', {
              required: 'Descreva sua necessidade.',
              minLength: {
                value: 10,
                message: 'Digite ao menos 10 caracteres.',
              },
            })}
          />
          <div className="flex flex-col gap-4 border-t border-border pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-meta-sm text-text-muted">
              Ao enviar, sua mensagem segue para a equipe responsavel por direcionar o proximo passo
              do atendimento.
            </p>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              trailingIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </div>
          {submitState === 'success' && (
            <p
              className="text-meta-sm text-emerald-600 sm:col-span-2"
              role="status"
              aria-live="polite"
            >
              Mensagem enviada com sucesso.
            </p>
          )}
          {submitState === 'error' && (
            <p className="text-meta-sm text-red-600 sm:col-span-2" role="alert">
              Nao foi possivel enviar agora. Tente novamente.
            </p>
          )}
        </form>
      </div>
    </Card>
  )
}
