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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.14fr)_minmax(16rem,0.86fr)] lg:items-start">
            <div>
              <Badge tone="accent">Contato principal</Badge>
              <SectionHeading
                className="mt-5"
                eyebrow="Encaminhamento consultivo"
                size="md"
                title="Conte um pouco sobre a sua demanda"
                description="Descreva o contexto, a urgencia e o objetivo do projeto. Nossa equipe encaminha sua solicitacao para o especialista mais aderente."
              />
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary">
                O formulario abaixo concentra apenas o essencial para a triagem inicial, mantendo
                a mensagem principal em foco e reduzindo ruido visual na primeira leitura.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-accent/10 bg-accent-soft/58 p-5">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
                Ajuda no primeiro retorno
              </p>
              <div className="mt-4 space-y-4">
                {intakeHighlights.map((highlight, index) => (
                  <div
                    key={highlight.title}
                    className={index > 0 ? 'border-t border-accent/10 pt-4' : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-accent-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{highlight.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
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
              wrapperClassName="md:col-span-2"
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
              wrapperClassName="md:col-span-2"
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

          <div className="rounded-[1.35rem] border border-accent/12 bg-accent-soft/65 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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
                className="w-full sm:min-w-[15rem] sm:w-auto sm:shrink-0"
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
