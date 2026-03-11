'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { PublicFormStatus } from '@/components/PublicFormStatus'
import { Badge, Button, Card, Input, SectionHeading, Textarea } from '@/components/ui'

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

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
    <Card
      as="section"
      padding="lg"
      className="relative overflow-hidden border-white/80 bg-white/96 shadow-[var(--shadow-strong)] backdrop-blur-sm"
      id="formulario-contato"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(0,86,166,0.07) 0%, rgba(255,255,255,0) 48%, rgba(15,23,42,0.05) 100%)',
        }}
        aria-hidden
      />

      <div className="relative">
        <div className="border-b border-border pb-7">
          <div className="max-w-3xl">
            <Badge tone="accent">Contato principal</Badge>
            <SectionHeading
              className="mt-5"
              eyebrow="Encaminhamento consultivo"
              size="md"
              title="Conte um pouco sobre a sua demanda"
              description="Descreva o contexto, a urgencia e o objetivo do projeto. Nossa equipe encaminha sua solicitacao para o especialista mais aderente."
            />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary">
              O formulario abaixo concentra apenas o essencial para a triagem inicial, mantendo a
              leitura em uma unica coluna e deixando o direcionamento mais claro desde o primeiro
              contato.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {intakeHighlights.map((highlight, index) => (
                <span
                  key={highlight.title}
                  className="inline-flex items-center gap-2 rounded-pill border border-accent/10 bg-accent-soft/48 px-3.5 py-2 text-sm text-text-secondary"
                >
                  <span className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    0{index + 1}
                  </span>
                  <span className="font-medium text-text-primary">{highlight.title}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-5">
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
          </div>

          <div className="rounded-[1.35rem] border border-accent/12 bg-[linear-gradient(135deg,rgba(234,242,251,0.78)_0%,rgba(255,255,255,0.96)_100%)] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
                  Proximo passo
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Ao enviar, sua mensagem segue para a equipe da Apollo responsavel por orientar o
                  proximo passo do atendimento com o contexto necessario logo no primeiro retorno.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full lg:min-w-[16rem] lg:w-auto lg:shrink-0"
                trailingIcon={<ArrowIcon />}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
              </Button>
            </div>
          </div>

          {submitState === 'success' ? (
            <PublicFormStatus tone="success" title="Mensagem enviada">
              Recebemos sua solicitacao e a equipe Apollo fara o encaminhamento adequado.
            </PublicFormStatus>
          ) : null}
          {submitState === 'error' ? (
            <PublicFormStatus tone="error" title="Envio indisponivel">
              Nao foi possivel enviar agora. Tente novamente em alguns minutos.
            </PublicFormStatus>
          ) : null}
        </form>
      </div>
    </Card>
  )
}
