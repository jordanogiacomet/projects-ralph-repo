'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, Input, SectionHeading, Textarea } from '@/components/ui'

type ContactFormValues = {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

type SubmitState = 'idle' | 'success' | 'error'

const intakeHighlights = [
  {
    title: 'Contexto do projeto',
    description: 'Explique a frente de trabalho, a unidade ou o tipo de ativo envolvido.',
  },
  {
    title: 'Objetivo esperado',
    description: 'Compartilhe a decisao, entrega ou resultado que voce precisa viabilizar.',
  },
  {
    title: 'Prazo e urgencia',
    description: 'Se houver data critica ou demanda imediata, sinalize isso logo na primeira mensagem.',
  },
]

export function ContatoPageForm() {
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
    setSubmitState('idle')

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
        headers: {
          'Content-Type': 'application/json',
        },
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
    <Card as="section" padding="lg" className="relative overflow-hidden" id="formulario-contato">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.05) 100%)',
        }}
        aria-hidden
      />

      <div className="relative">
        <SectionHeading
          eyebrow="Contato principal"
          size="lg"
          title="Conte um pouco sobre a sua demanda"
          description="Descreva o contexto, a urgencia e o objetivo do projeto. Nossa equipe encaminha sua solicitacao para o especialista mais aderente."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
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
            description="Se houver area, unidade ou tipo de projeto, informe isso aqui."
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
            rows={7}
            label="Mensagem"
            error={errors.mensagem?.message}
            wrapperClassName="sm:col-span-2"
            description="Inclua objetivo, volume estimado, localidade e qualquer prazo relevante."
            placeholder="Conte-nos como podemos ajudar."
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
              Ao enviar, sua mensagem segue para a equipe da Apollo responsavel por orientar o
              proximo passo do atendimento.
            </p>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              trailingIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
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

          {submitState === 'success' ? (
            <p className="text-sm text-emerald-600 sm:col-span-2" role="status" aria-live="polite">
              Mensagem enviada com sucesso.
            </p>
          ) : null}
          {submitState === 'error' ? (
            <p className="text-sm text-red-600 sm:col-span-2" role="alert">
              Nao foi possivel enviar agora. Tente novamente.
            </p>
          ) : null}
        </form>
      </div>
    </Card>
  )
}
