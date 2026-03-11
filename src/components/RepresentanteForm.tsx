'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { PublicFormStatus } from '@/components/PublicFormStatus'
import { PublicFormSummary } from '@/components/PublicFormSummary'
import { Badge, Button, Card, Input, SectionHeading, Textarea } from '@/components/ui'

type RepresentanteFormValues = {
  nome: string
  email: string
  telefone: string
  empresa: string
  cidadeEstado: string
  segmentoAtuacao: string
  mensagem: string
}

type SubmitState = 'idle' | 'success' | 'error'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fitHighlights = [
  {
    title: 'Contato principal',
    description: 'Quem conduz a relacao comercial e qual o melhor canal para devolutiva.',
  },
  {
    title: 'Cobertura regional',
    description: 'Cidade, estado e raio de atuacao para calibrar agenda, proximidade e potencial.',
  },
  {
    title: 'Repertorio comercial',
    description: 'Segmentos, tipos de conta e experiencia com vendas consultivas ou tecnicas.',
  },
]

const reviewSteps = [
  {
    title: 'Triagem comercial',
    description: 'Avaliamos contexto de cobertura, aderencia e complementaridade com o mapa atual.',
  },
  {
    title: 'Leitura consultiva',
    description:
      'Buscamos parceiros capazes de qualificar demanda antes de transformar conversa em proposta.',
  },
  {
    title: 'Retorno do time Apollo',
    description:
      'Se houver aderencia, o time comercial entra em contato para alinhar proximos passos.',
  },
]

const hasValidPhone = (value: string): boolean => value.replace(/\D/g, '').length >= 10

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

export function RepresentanteForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RepresentanteFormValues>({
    mode: 'onBlur',
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      cidadeEstado: '',
      segmentoAtuacao: '',
      mensagem: '',
    },
  })

  const contactName = watch('nome')
  const companyName = watch('empresa')
  const coverageRegion = watch('cidadeEstado')
  const businessSegment = watch('segmentoAtuacao')

  const summaryItems = [
    {
      label: 'Responsavel',
      value: contactName?.trim() || null,
      fallback: 'Nome do contato principal ainda nao informado.',
    },
    {
      label: 'Empresa',
      value: companyName?.trim() || null,
      fallback: 'Empresa ainda nao informada.',
    },
    {
      label: 'Cobertura',
      value: coverageRegion?.trim() || null,
      fallback: 'Cidade e estado de atuacao ainda nao informados.',
    },
    {
      label: 'Segmento',
      value: businessSegment?.trim() || null,
      fallback: 'Segmento ou repertorio comercial ainda nao informado.',
    },
  ]

  const onSubmit = async (values: RepresentanteFormValues) => {
    setSubmitState('idle')

    const payload = {
      formType: 'representante',
      data: {
        nome: values.nome.trim(),
        email: values.email.trim(),
        telefone: values.telefone.trim(),
        empresa: values.empresa.trim(),
        cidadeEstado: values.cidadeEstado.trim(),
        segmentoAtuacao: values.segmentoAtuacao.trim(),
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
        throw new Error('Erro ao enviar formulario')
      }

      reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.82fr)] lg:items-start">
      <Card
        as="section"
        padding="lg"
        className="relative overflow-hidden border-white/80 bg-white/96 shadow-[var(--shadow-strong)] backdrop-blur-sm"
        id="formulario-representante"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(155deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 44%, rgba(15,23,42,0.05) 100%)',
          }}
          aria-hidden
        />

        <div className="relative">
          <div className="border-b border-border pb-6">
            <Badge tone="accent">Cadastro consultivo</Badge>
            <SectionHeading
              className="mt-5"
              eyebrow="Representacao comercial"
              title="Apresente sua cobertura, repertorio e contexto de atuacao"
              description="O formulario abaixo mantem o mesmo fluxo de envio, mas agora organiza melhor as informacoes que a Apollo usa para avaliar a parceria."
            />

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {fitHighlights.map((highlight) => (
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
          </div>

          <form className="mt-8 grid gap-8" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6 xl:grid-cols-2">
              <Card tone="muted" padding="md" className="border-border/80 bg-surface-secondary/90">
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Contato principal
                </p>
                <div className="mt-5 grid gap-4">
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
                        value: emailPattern,
                        message: 'Digite um e-mail valido.',
                      },
                    })}
                  />

                  <Input
                    type="tel"
                    autoComplete="tel"
                    label="Telefone"
                    error={errors.telefone?.message}
                    placeholder="(00) 00000-0000"
                    description="Use um numero com DDD para facilitar o retorno do time comercial."
                    {...register('telefone', {
                      required: 'Informe um telefone para contato.',
                      validate: (value) =>
                        hasValidPhone(value) || 'Digite um telefone com DDD valido.',
                    })}
                  />
                </div>
              </Card>

              <Card tone="muted" padding="md" className="border-border/80 bg-surface-secondary/90">
                <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Atuacao e cobertura
                </p>
                <div className="mt-5 grid gap-4">
                  <Input
                    type="text"
                    label="Empresa"
                    error={errors.empresa?.message}
                    placeholder="Nome da empresa"
                    {...register('empresa', {
                      required: 'Informe sua empresa.',
                      minLength: {
                        value: 2,
                        message: 'Digite ao menos 2 caracteres.',
                      },
                    })}
                  />

                  <Input
                    type="text"
                    label="Cidade e estado de atuacao"
                    error={errors.cidadeEstado?.message}
                    placeholder="Ex: Curitiba, PR"
                    description="Se a cobertura envolver mais de uma regiao, indique a base principal."
                    {...register('cidadeEstado', {
                      required: 'Informe a cidade e estado de atuacao.',
                      minLength: {
                        value: 3,
                        message: 'Digite ao menos 3 caracteres.',
                      },
                    })}
                  />

                  <Input
                    type="text"
                    label="Segmento de atuacao"
                    error={errors.segmentoAtuacao?.message}
                    placeholder="Ex: vendas tecnicas, consultoria, servicos B2B"
                    description="Compartilhe o tipo de conta, mercado ou frente comercial que voce domina."
                    {...register('segmentoAtuacao', {
                      required: 'Informe seu segmento de atuacao.',
                      minLength: {
                        value: 3,
                        message: 'Digite ao menos 3 caracteres.',
                      },
                    })}
                  />
                </div>
              </Card>
            </div>

            <Card tone="muted" padding="md" className="border-border/80 bg-surface-secondary/90">
              <p className="text-label-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
                Experiencia comercial
              </p>
              <Textarea
                rows={7}
                className="mt-5"
                label="Experiencia comercial e cobertura regional"
                error={errors.mensagem?.message}
                description="Descreva historico, carteira, tipo de relacionamento com decisores e o perfil de oportunidade que voce costuma desenvolver."
                placeholder="Explique sua experiencia, os segmentos com que trabalha, a regiao que cobre e como costuma estruturar a prospeccao."
                {...register('mensagem', {
                  required: 'Descreva sua experiencia para representacao.',
                  minLength: {
                    value: 20,
                    message: 'Digite ao menos 20 caracteres.',
                  },
                })}
              />
            </Card>

            <div className="rounded-[1.25rem] border border-border/80 bg-surface-secondary/72 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-meta-sm text-text-muted">
                  Ao enviar, o cadastro segue para triagem comercial. Quanto mais clara a
                  combinacao entre cobertura, segmento e experiencia, mais objetivo tende a ser o
                  retorno.
                </p>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  trailingIcon={<ArrowIcon />}
                  className="w-full sm:w-auto sm:shrink-0"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar cadastro'}
                </Button>
              </div>
            </div>

            {submitState === 'success' ? (
              <PublicFormStatus tone="success" title="Cadastro enviado">
                Recebemos seu cadastro e o time Apollo avaliara a aderencia da representacao.
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

      <div className="space-y-5 lg:sticky lg:top-28">
        <Card tone="dark" padding="lg" className="relative overflow-hidden border-white/10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 18% 14%, rgba(0,86,166,0.26), transparent 40%), linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
            }}
            aria-hidden
          />

          <div className="relative">
            <Badge tone="dark" className="border border-white/10 bg-white/[0.08] text-white/78">
              Triagem Apollo
            </Badge>
            <h3 className="mt-5 font-display text-heading-xl font-semibold text-white">
              Como o cadastro e lido pelo time comercial
            </h3>
            <ul className="mt-6 space-y-4">
              {reviewSteps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/68">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <PublicFormSummary
          title="Resumo do cadastro"
          items={summaryItems}
          footerTitle="Mais contexto, menos ruido"
          footerDescription="O objetivo desta pagina e qualificar melhor a conversa desde o primeiro envio, sem mudar o fluxo tecnico de recebimento do cadastro."
        />
      </div>
    </div>
  )
}
