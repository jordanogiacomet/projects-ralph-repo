'use client'

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useForm } from 'react-hook-form'

import { Badge, Button, Card, Input, SectionHeading, Textarea } from '@/components/ui'
import { cn } from '@/lib/utils'

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
  description: string
  options: string[]
}

type StepConfig = {
  id: Step
  label: string
  title: string
  description: string
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: 'Avaliacoes patrimoniais',
    description:
      'Demandas de laudo, valoracao e revisao tecnica para ativos, imoveis, biologicos e maquinas.',
    options: [
      'Avaliacao de Ativos',
      'Avaliacao de Ativos Biologicos',
      'Avaliacao de Imoveis Urbanos e Rurais',
      'Avaliacao de Maquinas',
    ],
  },
  {
    title: 'Controle patrimonial',
    description:
      'Projetos de inventario, organizacao de base, processamento e identificacao patrimonial.',
    options: [
      'Organizacao Patrimonial',
      'Controle e Inventario de Estoques',
      'Processamento Patrimonial',
      'Etiquetas Patrimoniais Inteligentes',
    ],
  },
  {
    title: 'Consultoria e IFRS',
    description:
      'Frentes consultivas para impairment, vida util, arrendamentos, PPA e iniciativas correlatas.',
    options: [
      'Teste de Impairment',
      'Revisao da Vida Util',
      'Arrendamento Mercantil (CPC 06 / IFRS 16)',
      'Combinacao de Negocios (PPA) - CPC 15',
    ],
  },
]

const STEPS: StepConfig[] = [
  {
    id: 1,
    label: 'Escopo',
    title: 'Mapeie a demanda e o objetivo do projeto',
    description:
      'Selecione as frentes de trabalho e contextualize a finalidade, o volume e a localidade.',
  },
  {
    id: 2,
    label: 'Material de apoio',
    title: 'Anexe documentos que ajudem a qualificar o briefing',
    description:
      'Planilhas, memoriais e listas de ativos aceleram a analise, mas o anexo continua opcional.',
  },
  {
    id: 3,
    label: 'Contato',
    title: 'Informe quem deve receber o retorno comercial',
    description:
      'Usaremos esses dados para devolver o encaminhamento mais aderente ao seu cenario.',
  },
]

const STEP_NOTES: Record<
  Step,
  { eyebrow: string; title: string; description: string; notes: string[] }
> = {
  1: {
    eyebrow: 'Diagnostico inicial',
    title: 'Comece pelo escopo real da solicitacao',
    description:
      'Quanto mais preciso o recorte do projeto, mais consistente fica a estimativa comercial e tecnica.',
    notes: [
      'Agrupe apenas frentes que facam parte do mesmo movimento de contratacao.',
      'Explique a decisao que depende deste trabalho: auditoria, compliance, inventario, M&A ou revisao contabil.',
      'Se houver mais de uma unidade, sinalize isso ja nesta etapa.',
    ],
  },
  2: {
    eyebrow: 'Base documental',
    title: 'Envie o minimo necessario para reduzir retrabalho',
    description:
      'Um bom anexo elimina trocas iniciais e ajuda a Apollo a entender volume, tipologia e complexidade.',
    notes: [
      'Planilhas de ativos, memoriais ou listagens exportadas costumam ser os anexos mais uteis.',
      'Se o material ainda estiver incompleto, envie mesmo assim com a melhor versao disponivel.',
      'Arquivos sao registrados como metadata nesta etapa; a definicao de persistencia binaria continua fora do escopo.',
    ],
  },
  3: {
    eyebrow: 'Retorno comercial',
    title: 'Revise o resumo antes de enviar',
    description:
      'A equipe comercial usa este briefing para direcionar o retorno, pedir complementos e montar a proposta.',
    notes: [
      'Confirme se o e-mail informado e o canal correto para receber a devolutiva.',
      'Se houver urgencia ou janela curta de execucao, ela precisa aparecer no texto do briefing.',
      'A solicitacao segue para triagem comercial e tecnica apos o envio.',
    ],
  },
}

const FILE_GUIDES = [
  {
    title: 'Planilhas',
    description: 'XLS, XLSX ou TXT com base de ativos, amostras ou recortes de inventario.',
  },
  {
    title: 'Documentos',
    description: 'DOC, DOCX ou PDF com memoriais, escopo preliminar ou orientacoes do projeto.',
  },
  {
    title: 'Limite',
    description: 'Ate 10 MB por arquivo nesta etapa de briefing.',
  },
]

const ALLOWED_EXTENSIONS = new Set(['.txt', '.xls', '.xlsx', '.doc', '.docx', '.pdf'])

const FILE_ACCEPT =
  '.txt,.xls,.xlsx,.doc,.docx,.pdf,text/plain,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf'

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const hasSelectedService = (value: string[] | string | undefined): boolean => {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return false
}

const normalizeSelectedServices = (value: string[] | string | undefined): string[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) return [value]
  return []
}

const validateUploadFile = (file: File): string | null => {
  const extension = file.name.includes('.')
    ? `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
    : ''

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return 'Formato invalido. Envie .txt, .xls, .xlsx, .doc, .docx ou .pdf.'
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return 'O arquivo deve ter no maximo 10 MB.'
  }

  return null
}

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
    watch,
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

  const selectedServices = normalizeSelectedServices(watch('servicos'))
  const contactName = watch('nome')
  const contactEmail = watch('email')

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep)
  const currentStepConfig = STEPS[currentStepIndex]
  const currentStepNotes = STEP_NOTES[currentStep]
  const progressWidth = `${((currentStepIndex + 1) / STEPS.length) * 100}%`

  const contactSummary = [contactName?.trim(), contactEmail?.trim()].filter(Boolean).join(' • ')

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
    setSubmitState('idle')

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
    setSubmitState('idle')
  }

  const onSubmit = async (values: CotacaoFormValues) => {
    setSubmitState('idle')

    const payload = {
      formType: 'cotacao',
      data: {
        servicos: normalizeSelectedServices(values.servicos),
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
        throw new Error('Erro ao enviar cotacao')
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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.82fr)] lg:items-start">
      <Card
        as="section"
        padding="lg"
        className="relative overflow-hidden border-white/80 bg-white/96 shadow-[var(--shadow-strong)] backdrop-blur-sm"
        id="formulario-cotacao"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(155deg, rgba(0,86,166,0.06) 0%, rgba(255,255,255,0) 42%, rgba(15,23,42,0.05) 100%)',
          }}
          aria-hidden
        />

        <div className="relative">
          <div className="border-b border-border pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge tone="accent">Fluxo de cotacao</Badge>
              <p className="text-meta-sm font-medium text-text-muted">
                Etapa {currentStepIndex + 1} de {STEPS.length}
              </p>
            </div>

            <SectionHeading
              className="mt-5"
              eyebrow={currentStepConfig.label}
              title={currentStepConfig.title}
              description={currentStepConfig.description}
            />

            <div className="mt-5 overflow-hidden rounded-pill bg-bg-tertiary" aria-hidden>
              <div
                className="motion-transition motion-transition-emphasis h-2 rounded-pill bg-accent"
                style={{ width: progressWidth }}
              />
            </div>

            <ol className="mt-6 grid gap-3 lg:grid-cols-3" aria-label="Etapas do formulario de cotacao">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <li
                    key={step.id}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'rounded-[1.2rem] border px-4 py-4 transition',
                      isActive && 'border-accent bg-accent-soft/70 shadow-soft',
                      isCompleted && 'border-emerald-200 bg-emerald-50 text-emerald-900',
                      !isActive &&
                        !isCompleted &&
                        'border-border bg-surface-secondary text-text-secondary',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                          isActive && 'border-accent bg-accent text-white',
                          isCompleted && 'border-emerald-300 bg-emerald-600 text-white',
                          !isActive &&
                            !isCompleted &&
                            'border-border-strong bg-white text-text-secondary',
                        )}
                      >
                        {isCompleted ? <CheckIcon /> : step.id}
                      </span>
                      <div>
                        <p
                          className={cn(
                            'text-sm font-semibold',
                            isActive || isCompleted ? 'text-current' : 'text-text-primary',
                          )}
                        >
                          {step.label}
                        </p>
                        <p
                          className={cn(
                            'mt-1 text-xs leading-relaxed',
                            isActive
                              ? 'text-accent-strong/80'
                              : isCompleted
                                ? 'text-emerald-800/85'
                                : 'text-text-muted',
                          )}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <form className="mt-8 grid gap-8" onSubmit={handleSubmit(onSubmit)} noValidate>
            {currentStep === 1 ? (
              <div className="space-y-6">
                <div className="space-y-5">
                  {SERVICE_GROUPS.map((group) => {
                    const selectedInGroup = group.options.filter((option) =>
                      selectedServices.includes(option),
                    ).length

                    return (
                      <Card
                        key={group.title}
                        tone="muted"
                        padding="md"
                        className="border-border/80 bg-surface-secondary/90"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-text-primary">{group.title}</p>
                            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">
                              {group.description}
                            </p>
                          </div>
                          <Badge tone={selectedInGroup > 0 ? 'accent' : 'neutral'}>
                            {selectedInGroup > 0
                              ? `${selectedInGroup} selecionado${selectedInGroup > 1 ? 's' : ''}`
                              : 'Nenhum selecionado'}
                          </Badge>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {group.options.map((option) => {
                            const isSelected = selectedServices.includes(option)

                            return (
                              <label
                                key={option}
                                className={cn(
                                  'group motion-transition motion-lift-subtle relative flex min-h-[112px] cursor-pointer flex-col justify-between rounded-[1.1rem] border bg-white p-4',
                                  isSelected
                                    ? 'border-accent bg-accent-soft/75 shadow-soft'
                                    : 'border-border hover:border-accent/30 hover:bg-accent-light/35',
                                )}
                              >
                                <input
                                  type="checkbox"
                                  value={option}
                                  {...register('servicos', {
                                    validate: (value) =>
                                      hasSelectedService(value) ||
                                      'Selecione ao menos um servico para continuar.',
                                  })}
                                  className="sr-only"
                                />

                                <div className="flex items-start justify-between gap-3">
                                  <span className="text-sm font-semibold leading-relaxed text-text-primary">
                                    {option}
                                  </span>
                                  <span
                                    className={cn(
                                      'motion-transition inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                                      isSelected
                                        ? 'border-accent bg-accent text-white'
                                        : 'border-border bg-white text-transparent group-hover:border-accent/30',
                                    )}
                                  >
                                    <CheckIcon />
                                  </span>
                                </div>

                                <span
                                  className={cn(
                                    'mt-4 text-xs font-medium',
                                    isSelected ? 'text-accent-strong' : 'text-text-muted',
                                  )}
                                >
                                  {isSelected
                                    ? 'Incluido nesta solicitacao'
                                    : 'Selecionar frente de trabalho'}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </Card>
                    )
                  })}

                  {errors.servicos?.message ? (
                    <p className="text-meta-sm text-red-600" role="alert" id="cotacao-servicos-error">
                      {errors.servicos.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <Textarea
                    rows={5}
                    label="Qual a finalidade do projeto?"
                    error={errors.finalidade?.message}
                    wrapperClassName="lg:col-span-2"
                    description="Explique o objetivo da contratacao, como auditoria, inventario anual, revisao contabil ou apoio a M&A."
                    placeholder="Descreva o resultado que a sua equipe precisa viabilizar."
                    {...register('finalidade', {
                      required: 'Descreva a finalidade do projeto.',
                      minLength: {
                        value: 10,
                        message: 'Informe ao menos 10 caracteres.',
                      },
                    })}
                  />

                  <Textarea
                    rows={4}
                    label="Quantos ativos ou frentes estao envolvidos?"
                    error={errors.quantidadeAtivos?.message}
                    description="Inclua estimativa de volume, tipos de ativos e quantidade de unidades, se aplicavel."
                    placeholder="Ex: 2.300 ativos fixos em 4 unidades operacionais."
                    {...register('quantidadeAtivos', {
                      required: 'Informe uma estimativa da quantidade de ativos.',
                      minLength: {
                        value: 5,
                        message: 'Informe ao menos 5 caracteres.',
                      },
                    })}
                  />

                  <Textarea
                    rows={4}
                    label="Onde o trabalho sera realizado?"
                    error={errors.localTrabalho?.message}
                    description="Informe cidade, estado, unidade, operacao ou abrangencia geografica."
                    placeholder="Cidade, estado e eventuais filiais ou plantas envolvidas."
                    {...register('localTrabalho', {
                      required: 'Informe o local de execucao do trabalho.',
                      minLength: {
                        value: 3,
                        message: 'Informe ao menos 3 caracteres.',
                      },
                    })}
                  />
                </div>
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.82fr)]">
                  <Card
                    tone="default"
                    padding="lg"
                    role="presentation"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      'motion-transition relative overflow-hidden border-2 border-dashed',
                      isDragActive
                        ? 'border-accent bg-accent-soft/50 shadow-soft'
                        : 'border-border bg-white hover:border-accent/35',
                    )}
                  >
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(160deg, rgba(0,86,166,0.05) 0%, rgba(255,255,255,0) 44%, rgba(15,23,42,0.04) 100%)',
                      }}
                      aria-hidden
                    />

                    <div className="relative">
                      <Badge tone="accent">Anexo opcional</Badge>
                      <h3 className="mt-4 font-display text-heading-xl font-semibold text-text-primary">
                        Envie documentos que contextualizem o projeto
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                        Use esta etapa para anexar planilhas, listas de ativos, memoriais ou PDFs
                        que ajudem nossa equipe a dimensionar o escopo da cotacao.
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={FILE_ACCEPT}
                        onChange={handleFileInputChange}
                        className="sr-only"
                        aria-label="Upload de anexo para cotacao"
                      />

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Selecionar arquivo
                        </Button>
                        {selectedFile ? (
                          <Button type="button" variant="ghost" onClick={clearSelectedFile}>
                            Remover arquivo
                          </Button>
                        ) : null}
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {FILE_GUIDES.map((guide) => (
                          <div
                            key={guide.title}
                            className="rounded-card border border-border bg-white/88 p-4"
                          >
                            <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                              {guide.title}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                              {guide.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card tone="muted" padding="md" className="h-full border-border/80 bg-surface-secondary/90">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent">
                      O que ajuda
                    </p>

                    <ul className="mt-4 space-y-3">
                      {STEP_NOTES[2].notes.map((note) => (
                        <li key={note} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                            <CheckIcon />
                          </span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {selectedFile ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                    <div>
                      <p className="font-semibold">Arquivo selecionado</p>
                      <p className="mt-1 text-emerald-700/90">
                        {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    </div>
                    <Badge tone="success">Pronto para envio</Badge>
                  </div>
                ) : null}

                {fileError ? (
                  <p className="text-meta-sm text-red-600" role="alert">
                    {fileError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-border bg-surface-secondary/80 p-4">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      Servicos
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {selectedServices.length > 0
                        ? `${selectedServices.length} frente${selectedServices.length > 1 ? 's' : ''} selecionada${selectedServices.length > 1 ? 's' : ''}`
                        : 'Nenhum servico informado'}
                    </p>
                  </div>

                  <div className="rounded-[1.2rem] border border-border bg-surface-secondary/80 p-4">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      Anexo
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {selectedFile ? 'Arquivo anexado' : 'Sem anexo'}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-text-muted">
                      {selectedFile ? selectedFile.name : 'A etapa 2 pode ser mantida vazia.'}
                    </p>
                  </div>

                  <div className="rounded-[1.2rem] border border-border bg-surface-secondary/80 p-4">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      Contato
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">
                      {contactSummary || 'Preencha os campos abaixo'}
                    </p>
                  </div>
                </div>

                {selectedServices.length > 0 ? (
                  <div className="rounded-[1.2rem] border border-border bg-white px-4 py-4">
                    <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                      Frentes selecionadas
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedServices.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center rounded-pill border border-accent/15 bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-strong"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
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
                        value: EMAIL_PATTERN,
                        message: 'Digite um e-mail valido.',
                      },
                    })}
                  />

                  <Card
                    tone="muted"
                    padding="md"
                    className="sm:col-span-2 border-border/80 bg-surface-secondary/80"
                  >
                    <p className="text-sm leading-relaxed text-text-secondary">
                      Usaremos esses dados apenas para retornar esta solicitacao e, se necessario,
                      pedir complementos do briefing antes da proposta.
                    </p>
                  </Card>
                </div>
              </div>
            ) : null}

            <div className="border-t border-border pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-meta-sm text-text-muted">
                  Os campos obrigatorios sao validados antes do avancar entre as etapas para manter
                  o briefing claro, consistente e facil de revisar.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {currentStep > 1 ? (
                    <Button type="button" variant="outline" onClick={handlePreviousStep}>
                      Voltar
                    </Button>
                  ) : null}

                  {currentStep < 3 ? (
                    <Button type="button" onClick={handleNextStep} trailingIcon={<ArrowIcon />}>
                      Continuar
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} trailingIcon={<ArrowIcon />}>
                      {isSubmitting ? 'Enviando...' : 'Enviar solicitacao'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4" aria-live="polite">
                {submitState === 'success' ? (
                  <p
                    className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                    role="status"
                  >
                    Cotacao enviada com sucesso. Nossa equipe fara a triagem do briefing e retornara
                    em seguida.
                  </p>
                ) : null}

                {submitState === 'error' ? (
                  <p
                    className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                    role="alert"
                  >
                    Nao foi possivel enviar agora. Tente novamente em alguns minutos.
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </Card>

      <div className="space-y-5 lg:sticky lg:top-24">
        <Card tone="dark" padding="lg" className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 18% 18%, rgba(0,86,166,0.3), transparent 42%), linear-gradient(170deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            }}
            aria-hidden
          />

          <div className="relative">
            <Badge
              tone="dark"
              className="border border-white/10 bg-white/[0.08] text-white/78"
            >
              {currentStepNotes.eyebrow}
            </Badge>
            <h3 className="mt-5 font-display text-heading-xl font-semibold text-white">
              {currentStepNotes.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/74">
              {currentStepNotes.description}
            </p>

            <ul className="mt-6 space-y-3">
              {currentStepNotes.notes.map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm leading-relaxed text-white/74">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/92">
                    <CheckIcon />
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-white/62">
                  Resumo atual
                </p>
                <span className="text-xs font-medium text-white/42">
                  {selectedServices.length} servico{selectedServices.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/42">Escopo</p>
                  {selectedServices.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedServices.slice(0, 4).map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center rounded-pill border border-white/10 bg-white/[0.08] px-3 py-1 text-label-sm font-semibold text-white/82"
                        >
                          {service}
                        </span>
                      ))}
                      {selectedServices.length > 4 ? (
                        <span className="inline-flex items-center rounded-pill border border-white/10 bg-white/[0.08] px-3 py-1 text-label-sm font-semibold text-white/82">
                          +{selectedServices.length - 4} adicionais
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-white/62">Nenhum servico selecionado ainda.</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/42">Anexo</p>
                  <p className="mt-2 text-sm text-white/78">
                    {selectedFile ? selectedFile.name : 'Nenhum arquivo anexado.'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/42">Contato</p>
                  <p className="mt-2 text-sm text-white/78">
                    {contactSummary || 'Preencha na etapa final.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="md" className="border-accent/10 bg-accent-soft/45">
          <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
            Depois do envio
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            A Apollo cruza escopo, volume, localidade e material de apoio para devolver o
            encaminhamento comercial mais aderente ao contexto informado.
          </p>
        </Card>
      </div>
    </div>
  )
}
