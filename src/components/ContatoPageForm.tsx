'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type ContactFormValues = {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

type SubmitState = 'idle' | 'success' | 'error'

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
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold sm:text-3xl">Fale com nossa equipe</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        Preencha o formulário abaixo e retornaremos o contato com a melhor solução para o seu cenário.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="contato-nome" className="mb-1.5 block text-sm font-medium text-text-primary">
            Nome
          </label>
          <input
            id="contato-nome"
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
          <label htmlFor="contato-email" className="mb-1.5 block text-sm font-medium text-text-primary">
            E-Mail
          </label>
          <input
            id="contato-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email', {
              required: 'Informe um e-mail válido.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
          <label htmlFor="contato-assunto" className="mb-1.5 block text-sm font-medium text-text-primary">
            Assunto
          </label>
          <input
            id="contato-assunto"
            type="text"
            aria-invalid={errors.assunto ? 'true' : 'false'}
            {...register('assunto', {
              required: 'Informe o assunto da mensagem.',
              minLength: {
                value: 3,
                message: 'Digite ao menos 3 caracteres.',
              },
            })}
            className="w-full rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
            placeholder="Ex: Dúvida sobre inventário patrimonial"
          />
          {errors.assunto ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.assunto.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contato-mensagem" className="mb-1.5 block text-sm font-medium text-text-primary">
            Mensagem
          </label>
          <textarea
            id="contato-mensagem"
            rows={5}
            aria-invalid={errors.mensagem ? 'true' : 'false'}
            {...register('mensagem', {
              required: 'Descreva sua necessidade.',
              minLength: {
                value: 10,
                message: 'Digite ao menos 10 caracteres.',
              },
            })}
            className="w-full resize-y rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
            placeholder="Conte-nos como podemos ajudar."
          />
          {errors.mensagem ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.mensagem.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-fit items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
        </button>

        {submitState === 'success' ? (
          <p className="text-sm text-emerald-600">Mensagem enviada com sucesso.</p>
        ) : null}
        {submitState === 'error' ? (
          <p className="text-sm text-red-600">Não foi possível enviar agora. Tente novamente.</p>
        ) : null}
      </form>
    </section>
  )
}
