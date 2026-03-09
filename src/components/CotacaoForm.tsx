'use client'

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useForm } from 'react-hook-form'

type CotacaoFormValues = {
  servicos: string[]
  finalidade: string
  quantidadeAtivos: string
  localTrabalho: string
  nome: string
  email: string
}

type SubmitState = 'idle' | 'success' | 'error'

type Step = 1 | 2 | 3

type ServiceGroup = {
  title: string
  options: string[]
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: 'Avaliações Patrimoniais',
    options: [
      'Avaliação de Ativos',
      'Avaliação de Ativos Biológicos',
      'Avaliação de Imóveis Urbanos e Rurais',
      'Avaliação de Máquinas',
    ],
  },
  {
    title: 'Controle Patrimonial',
    options: [
      'Organização Patrimonial',
      'Controle e Inventário de Estoques',
      'Processamento Patrimonial',
      'Etiquetas Patrimoniais Inteligentes',
    ],
  },
  {
    title: 'Consultoria e IFRS',
    options: [
      'Teste de Impairment',
      'Revisão da Vida Útil',
      'Arrendamento Mercantil (CPC 06 / IFRS 16)',
      'Combinação de Negócios (PPA) - CPC 15',
    ],
  },
]

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Serviços' },
  { id: 2, label: 'Anexo' },
  { id: 3, label: 'Contato' },
]

const ALLOWED_EXTENSIONS = new Set(['.txt', '.xls', '.xlsx', '.doc', '.docx', '.pdf'])

const FILE_ACCEPT =
  '.txt,.xls,.xlsx,.doc,.docx,.pdf,text/plain,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf'

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024

const hasSelectedService = (value: string[] | string | undefined): boolean => {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return false
}

const validateUploadFile = (file: File): string | null => {
  const extension = file.name.includes('.')
    ? `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
    : ''

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return 'Formato inválido. Envie .txt, .xls, .xlsx, .doc, .docx ou .pdf.'
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return 'O arquivo deve ter no máximo 10 MB.'
  }

  return null
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function CotacaoForm() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CotacaoFormValues>({
    mode: 'onBlur',
    defaultValues: {
      servicos: [],
      finalidade: '',
      quantidadeAtivos: '',
      localTrabalho: '',
      nome: '',
      email: '',
    },
  })

  const handleNextStep = async () => {
    setSubmitState('idle')

    if (currentStep === 1) {
      const isValid = await trigger(['servicos', 'finalidade', 'quantidadeAtivos', 'localTrabalho'])
      if (!isValid) return
    }

    if (currentStep < 3) {
      setCurrentStep((previousStep) => (previousStep + 1) as Step)
    }
  }

  const handlePreviousStep = () => {
    setSubmitState('idle')

    if (currentStep > 1) {
      setCurrentStep((previousStep) => (previousStep - 1) as Step)
    }
  }

  const updateSelectedFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null)
      setFileError(null)
      return
    }

    const validationMessage = validateUploadFile(file)

    if (validationMessage) {
      setSelectedFile(null)
      setFileError(validationMessage)
      return
    }

    setSelectedFile(file)
    setFileError(null)
  }

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    updateSelectedFile(file)
    event.target.value = ''
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragActive(false)
    const file = event.dataTransfer.files?.[0] ?? null
    updateSelectedFile(file)
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setFileError(null)
  }

  const onSubmit = async (values: CotacaoFormValues) => {
    setSubmitState('idle')

    const payload = {
      formType: 'cotacao',
      data: {
        servicos: values.servicos,
        finalidade: values.finalidade.trim(),
        quantidadeAtivos: values.quantidadeAtivos.trim(),
        localTrabalho: values.localTrabalho.trim(),
        nome: values.nome.trim(),
        email: values.email.trim(),
        anexo: selectedFile
          ? {
              nome: selectedFile.name,
              tamanhoBytes: selectedFile.size,
              tipo: selectedFile.type || 'application/octet-stream',
            }
          : null,
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
        throw new Error('Erro ao enviar cotação')
      }

      reset()
      clearSelectedFile()
      setCurrentStep(1)
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold sm:text-3xl">Solicitar cotação</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        Avance pelas etapas para detalhar sua demanda. Quanto mais contexto, mais precisa será nossa
        proposta.
      </p>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Etapas do formulário de cotação">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <li
              key={step.id}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'border-accent bg-accent-light text-accent'
                  : isCompleted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-border bg-bg-secondary text-text-secondary'
              }`}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
                {step.id}
              </span>
              {step.label}
            </li>
          )
        })}
      </ol>

      <form className="mt-6 grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        {currentStep === 1 ? (
          <div className="space-y-6">
            <div className="grid gap-4">
              {SERVICE_GROUPS.map((group) => (
                <fieldset key={group.title} className="rounded-xl border border-border p-4">
                  <legend className="px-1 text-sm font-semibold text-text-primary">{group.title}</legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {group.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-start gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-text-primary"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          {...register('servicos', {
                            validate: (value) =>
                              hasSelectedService(value) || 'Selecione ao menos um serviço para continuar.',
                          })}
                          className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              {errors.servicos?.message ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.servicos.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4">
              <div>
                <label htmlFor="cotacao-finalidade" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Qual a finalidade?
                </label>
                <p className="mb-1.5 text-xs text-text-secondary">
                  Exemplo: atendimento a auditoria, revisão contábil, inventário anual ou apoio a M&amp;A.
                </p>
                <textarea
                  id="cotacao-finalidade"
                  rows={4}
                  aria-invalid={errors.finalidade ? 'true' : 'false'}
                  {...register('finalidade', {
                    required: 'Descreva a finalidade do projeto.',
                    minLength: {
                      value: 10,
                      message: 'Informe ao menos 10 caracteres.',
                    },
                  })}
                  className="w-full resize-y rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
                  placeholder="Descreva o objetivo principal da cotação."
                />
                {errors.finalidade ? (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.finalidade.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="cotacao-quantidade-ativos"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Quantos ativos?
                </label>
                <p className="mb-1.5 text-xs text-text-secondary">
                  Informe uma estimativa de volume, tipos de ativos e eventuais filiais envolvidas.
                </p>
                <textarea
                  id="cotacao-quantidade-ativos"
                  rows={4}
                  aria-invalid={errors.quantidadeAtivos ? 'true' : 'false'}
                  {...register('quantidadeAtivos', {
                    required: 'Informe uma estimativa da quantidade de ativos.',
                    minLength: {
                      value: 5,
                      message: 'Informe ao menos 5 caracteres.',
                    },
                  })}
                  className="w-full resize-y rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
                  placeholder="Ex: 2.300 ativos fixos em 4 unidades."
                />
                {errors.quantidadeAtivos ? (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.quantidadeAtivos.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="cotacao-local" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Onde será realizado o trabalho?
                </label>
                <textarea
                  id="cotacao-local"
                  rows={3}
                  aria-invalid={errors.localTrabalho ? 'true' : 'false'}
                  {...register('localTrabalho', {
                    required: 'Informe o local de execução do trabalho.',
                    minLength: {
                      value: 3,
                      message: 'Informe ao menos 3 caracteres.',
                    },
                  })}
                  className="w-full resize-y rounded-md border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/80 focus:border-accent focus:outline-none"
                  placeholder="Cidade, estado e unidades envolvidas."
                />
                {errors.localTrabalho ? (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.localTrabalho.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Upload de arquivo</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Envie arquivos de apoio (texto, Excel, Word ou PDF) para complementar o briefing.
              </p>
            </div>

            <div
              role="presentation"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
                isDragActive
                  ? 'border-accent bg-accent-light'
                  : 'border-border bg-bg-secondary/60 hover:border-accent/45'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_ACCEPT}
                onChange={handleFileInputChange}
                className="sr-only"
                aria-label="Upload de anexo para cotação"
              />

              <p className="text-sm font-medium text-text-primary">Arraste e solte o arquivo aqui</p>
              <p className="mt-1 text-xs text-text-secondary">ou</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center rounded-md border border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent/5"
              >
                Selecionar arquivo
              </button>
              <p className="mt-3 text-xs text-text-secondary">Formatos permitidos: TXT, XLS, XLSX, DOC, DOCX e PDF (até 10 MB).</p>
            </div>

            {selectedFile ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p>
                  <span className="font-medium">Arquivo selecionado:</span> {selectedFile.name} (
                  {formatFileSize(selectedFile.size)})
                </p>
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-semibold transition hover:bg-white"
                >
                  Remover
                </button>
              </div>
            ) : null}

            {fileError ? (
              <p className="text-xs text-red-600" role="alert">
                {fileError}
              </p>
            ) : null}
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold text-text-primary">Dados de contato</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Campos obrigatórios para retorno da equipe comercial.
              </p>
            </div>

            <div>
              <label htmlFor="cotacao-nome" className="mb-1.5 block text-sm font-medium text-text-primary">
                Nome
              </label>
              <input
                id="cotacao-nome"
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
              <label htmlFor="cotacao-email" className="mb-1.5 block text-sm font-medium text-text-primary">
                E-mail
              </label>
              <input
                id="cotacao-email"
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
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="inline-flex w-fit items-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-bg-secondary"
            >
              Voltar
            </button>
          ) : (
            <span aria-hidden className="hidden sm:inline" />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex w-fit items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Próxima etapa
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-fit items-center rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
            </button>
          )}
        </div>

        {submitState === 'success' ? (
          <p className="text-sm text-emerald-600">Cotação enviada com sucesso. Em breve entraremos em contato.</p>
        ) : null}
        {submitState === 'error' ? (
          <p className="text-sm text-red-600">Não foi possível enviar agora. Tente novamente em alguns minutos.</p>
        ) : null}
      </form>
    </section>
  )
}
