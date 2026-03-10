import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'consultoria-e-tecnologia',
  solutionSlug: 'combinacao-de-negocios-ppa-cpc-15',
  legacySolutionSlug: 'combinacao-de-negocios',
  fallbackData: {
    title: 'Combinação de Negócios',
    heroTitle: 'Combinação de Negócios (PPA) – CPC 15',
    breadcrumbTitle: 'Combinação de Negócios',
    categoryTitle: 'Consultoria e Tecnologia',
    description:
      'Conduzimos projetos de PPA (Purchase Price Allocation) em processos de combinação de negócios, apoiando a mensuração e alocação do preço de aquisição conforme CPC 15.',
    metaTitle: 'Combinação de Negócios (PPA) – CPC 15 | Apollo Gestão',
    metaDescription:
      'Serviço de Combinação de Negócios (PPA) da Apollo Gestão com metodologia técnica para alocação de preço de aquisição conforme CPC 15.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              {
                type: 'text',
                text: 'Estruturação técnica para processos de PPA com segurança contábil',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Avaliamos ativos e passivos adquiridos, identificamos intangíveis e apoiamos a mensuração a valor justo para estruturar a alocação do preço de aquisição em operações de M&A.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com abordagem aderente ao CPC 15, sua empresa melhora a qualidade das demonstrações financeiras, reduz riscos em auditorias e ganha base técnica para decisões estratégicas pós-transação.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'arrendamento-mercantil',
        title: 'Arrendamento Mercantil',
        href: '/solucoes/consultoria-e-tecnologia/arrendamento-mercantil',
      },
      {
        id: 'teste-de-impairment',
        title: 'Teste de Impairment',
        href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
      },
      {
        id: 'softwares',
        title: 'Softwares',
        href: '/solucoes/consultoria-e-tecnologia/softwares',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function CombinacaoDeNegociosPpaCpc15Page() {
  return <SolutionDetailPage config={config} />
}
