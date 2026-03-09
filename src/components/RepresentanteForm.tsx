'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

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

const hasValidPhone = (value: string): boolean => value.replace(/\D/g, '').length >= 10

export function RepresentanteForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const {
    register,
    handleSubmit,
    reset,
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
        throw new Error('Erro ao enviar formulário')
      }

      reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold sm:text-3xl">Cadastro de representante</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        Compartilhe seus dados e contexto de atuação. Nossa equipe avaliará o cadastro e entrará em
        contato.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="representante-nome"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Nome
            </label>
            <input
              id="representante-nome"
              type="text"
              autoComplete="name"
              aria-invalid={errors.nome ? 'true' : 'false'}
              {...register('nome', {
                required: 'Informe seu nome.',
                minLength: {
                  value: 2,
                  message: 'Digite ao menos 2 caracteres.',
                },
              })}
              className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="Seu nome completo"
            />
            {errors.nome ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.nome.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="representante-email"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              E-mail
            </label>
            <input
              id="representante-email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              {...register('email', {
                required: 'Informe um e-mail válido.',
                pattern: {
                  value: emailPattern,
                  message: 'Digite um e-mail válido.',
                },
              })}
              className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="voce@empresa.com"
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="representante-telefone"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Telefone
            </label>
            <input
              id="representante-telefone"
              type="tel"
              autoComplete="tel"
              aria-invalid={errors.telefone ? 'true' : 'false'}
              {...register('telefone', {
                required: 'Informe um telefone para contato.',
                validate: (value) =>
                  hasValidPhone(value) || 'Digite um telefone com DDD válido.',
              })}
              className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="(00) 00000-0000"
            />
            {errors.telefone ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.telefone.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="representante-empresa"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Empresa
            </label>
            <input
              id="representante-empresa"
              type="text"
              aria-invalid={errors.empresa ? 'true' : 'false'}
              {...register('empresa', {
                required: 'Informe sua empresa.',
                minLength: {
                  value: 2,
                  message: 'Digite ao menos 2 caracteres.',
                },
              })}
              className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="Nome da empresa"
            />
            {errors.empresa ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.empresa.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="representante-cidade-estado"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Cidade e estado de atuação
            </label>
            <input
              id="representante-cidade-estado"
              type="text"
              aria-invalid={errors.cidadeEstado ? 'true' : 'false'}
              {...register('cidadeEstado', {
                required: 'Informe a cidade e estado de atuação.',
                minLength: {
                  value: 3,
                  message: 'Digite ao menos 3 caracteres.',
                },
              })}
              className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="Ex: Curitiba, PR"
            />
            {errors.cidadeEstado ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.cidadeEstado.message}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="representante-segmento"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Segmento de atuação
            </label>
            <input
              id="representante-segmento"
              type="text"
              aria-invalid={errors.segmentoAtuacao ? 'true' : 'false'}
              {...register('segmentoAtuacao', {
                required: 'Informe seu segmento de atuação.',
                minLength: {
                  value: 3,
                  message: 'Digite ao menos 3 caracteres.',
                },
              })}
              className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="Ex: Consultoria, vendas técnicas, serviços B2B"
            />
            {errors.segmentoAtuacao ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.segmentoAtuacao.message}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="representante-mensagem"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Experiência comercial e cobertura regional
            </label>
            <textarea
              id="representante-mensagem"
              rows={5}
              aria-invalid={errors.mensagem ? 'true' : 'false'}
              {...register('mensagem', {
                required: 'Descreva sua experiência para representação.',
                minLength: {
                  value: 20,
                  message: 'Digite ao menos 20 caracteres.',
                },
              })}
              className="w-full resize-y rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
              placeholder="Descreva histórico de vendas, carteira de clientes e região de interesse."
            />
            {errors.mensagem ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {errors.mensagem.message}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-fit items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar cadastro'}
        </button>

        {submitState === 'success' ? (
          <p className="text-sm text-emerald-600">Cadastro enviado com sucesso.</p>
        ) : null}
        {submitState === 'error' ? (
          <p className="text-sm text-red-600">Não foi possível enviar agora. Tente novamente.</p>
        ) : null}
      </form>
    </section>
  )
}
