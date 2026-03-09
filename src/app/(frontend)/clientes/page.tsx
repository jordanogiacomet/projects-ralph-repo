import {
  ClientsPage,
  type ClientCardItem,
  type ClientSegmentFilter,
} from '@/components/ClientsPage'
import { getPayloadClient } from '@/lib/payload'
import type { Cliente, ClienteSegmento } from '@/payload-types'

type MediaLike = {
  url?: string | null
}

type SegmentData = {
  id: string
  key: string
  label: string
}

const heroTitle = 'Conheça alguns dos nossos Principais Clientes'
const heroDescription =
  'Atuamos em projetos de avaliação, controle patrimonial e consultoria técnica para empresas de diversos portes e segmentos.'
const introText =
  'Com metodologias próprias e equipe especializada, já apoiamos organizações públicas e privadas em jornadas de inventário, governança de ativos e conformidade contábil em todo o Brasil.'
const lowerSectionText =
  'Cada projeto é estruturado de forma personalizada para o contexto operacional do cliente. Compartilhe seu cenário e vamos construir juntos um plano técnico para aumentar precisão, segurança e eficiência na gestão patrimonial.'

const fallbackSegments: SegmentData[] = [
  { id: 'agencia', key: 'agencia', label: 'Agência' },
  { id: 'agricola', key: 'agricola', label: 'Agrícola' },
  { id: 'alimentacao', key: 'alimentacao', label: 'Alimentação' },
  { id: 'educacao', key: 'educacao', label: 'Educação' },
  { id: 'energia', key: 'energia', label: 'Energia' },
  { id: 'industria', key: 'industria', label: 'Indústria' },
  { id: 'saude', key: 'saude', label: 'Saúde' },
  { id: 'varejo', key: 'varejo', label: 'Varejo' },
]

const fallbackClients: ClientCardItem[] = [
  { id: 'grupo-sul-logistica', name: 'Grupo Sul Logística', segmentKey: 'industria' },
  { id: 'rede-vida-plena', name: 'Rede Vida Plena', segmentKey: 'saude' },
  { id: 'cooperativa-vale-verde', name: 'Cooperativa Vale Verde', segmentKey: 'agricola' },
  { id: 'nova-escola-brasil', name: 'Nova Escola Brasil', segmentKey: 'educacao' },
  { id: 'market-center', name: 'Market Center', segmentKey: 'varejo' },
  { id: 'energia-nacional', name: 'Energia Nacional', segmentKey: 'energia' },
  { id: 'solucoes-criativas', name: 'Soluções Criativas', segmentKey: 'agencia' },
  { id: 'alimentos-campo-bom', name: 'Alimentos Campo Bom', segmentKey: 'alimentacao' },
  { id: 'atlas-fabril', name: 'Atlas Fabril', segmentKey: 'industria' },
  { id: 'hospital-serra-azul', name: 'Hospital Serra Azul', segmentKey: 'saude' },
  { id: 'grupo-central-varejo', name: 'Grupo Central Varejo', segmentKey: 'varejo' },
  { id: 'plataforma-educa', name: 'Plataforma Educa', segmentKey: 'educacao' },
]

function mediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as MediaLike).url || undefined
  }

  return undefined
}

function normalizeSegmentKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildFilters(clients: ClientCardItem[], segments: SegmentData[]): ClientSegmentFilter[] {
  const filters: ClientSegmentFilter[] = [{ key: 'all', label: 'Todos', count: clients.length }]

  for (const segment of segments) {
    filters.push({
      key: segment.key,
      label: segment.label,
      count: clients.filter((client) => client.segmentKey === segment.key).length,
    })
  }

  return filters
}

export default async function ClientesPageRoute() {
  let clients = fallbackClients
  let segments = fallbackSegments

  try {
    const payload = await getPayloadClient()
    const [segmentResult, clientsResult] = await Promise.all([
      payload.find({
        collection: 'cliente-segmentos',
        limit: 200,
        sort: 'title',
      }),
      payload.find({
        collection: 'clientes',
        limit: 500,
        sort: 'order',
        depth: 1,
      }),
    ])

    const mappedSegments = new Map<string, SegmentData>()
    const mappedSegmentsById = new Map<string, SegmentData>()

    for (const segment of segmentResult.docs as ClienteSegmento[]) {
      const key = segment.slug || normalizeSegmentKey(segment.title)
      const mappedSegment: SegmentData = {
        id: String(segment.id),
        key,
        label: segment.title,
      }

      mappedSegments.set(mappedSegment.key, mappedSegment)
      mappedSegmentsById.set(mappedSegment.id, mappedSegment)
    }

    const mappedClients: ClientCardItem[] = (clientsResult.docs as Cliente[]).map((client) => {
      let segment: SegmentData | undefined
      const relationship = client.segmento

      if (typeof relationship === 'object' && relationship) {
        const relationTitle = relationship.title || 'Outros'
        const relationKey = relationship.slug || normalizeSegmentKey(relationTitle)
        segment = {
          id: String(relationship.id),
          key: relationKey,
          label: relationTitle,
        }
      } else if (typeof relationship === 'number' || typeof relationship === 'string') {
        segment = mappedSegmentsById.get(String(relationship))
      }

      if (!segment) {
        segment = { id: 'outros', key: 'outros', label: 'Outros' }
      }

      if (!mappedSegments.has(segment.key)) {
        mappedSegments.set(segment.key, segment)
      }

      return {
        id: String(client.id),
        name: client.name,
        logoUrl: mediaUrl(client.logo),
        segmentKey: segment.key,
      }
    })

    const sortedSegments = Array.from(mappedSegments.values()).sort((a, b) =>
      a.label.localeCompare(b.label, 'pt-BR'),
    )

    if (sortedSegments.length > 0) {
      segments = sortedSegments
    }

    if (mappedClients.length > 0) {
      clients = mappedClients
    }
  } catch {
    // Payload can be unavailable during static build in sandboxed environments.
  }

  const filters = buildFilters(clients, segments)

  return (
    <ClientsPage
      heroTitle={heroTitle}
      heroDescription={heroDescription}
      introText={introText}
      lowerSectionText={lowerSectionText}
      filters={filters}
      clients={clients}
    />
  )
}
