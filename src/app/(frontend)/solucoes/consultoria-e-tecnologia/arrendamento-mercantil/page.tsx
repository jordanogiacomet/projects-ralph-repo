import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'consultoria-e-tecnologia',
  solutionSlug: 'arrendamento-mercantil',
  legacySolutionSlug: 'arrendamento-mercantil-cpc-06-ifrs-16',
  fallbackData: {
    title: 'Arrendamento Mercantil',
    heroTitle: 'Arrendamento Mercantil - CPC 06 (IFRS 16)',
    categoryTitle: 'Consultoria e Tecnologia',
    description:
      'Apoiamos sua empresa na aplicação do CPC 06 (IFRS 16) com modelagem técnica de contratos, cálculos consistentes e governança para reduzir riscos contábeis e de auditoria.',
    metaTitle: 'Arrendamento Mercantil - CPC 06 (IFRS 16) | Apollo Gestão',
    metaDescription:
      'Serviço de Arrendamento Mercantil da Apollo Gestão com suporte ao CPC 06 (IFRS 16), revisão de contratos e estruturação técnica para conformidade contábil.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              { type: 'text', text: 'Conformidade técnica para contratos de arrendamento' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Mapeamos contratos, classificações e premissas de mensuração para apoiar o reconhecimento correto de ativos e passivos de arrendamento, com base no CPC 06 (IFRS 16).',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com metodologia estruturada, sua empresa fortalece compliance, melhora a qualidade das demonstrações financeiras e reduz riscos em auditorias e fechamentos contábeis.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'revisao-da-vida-util',
        title: 'Revisão da Vida Útil',
        href: '/solucoes/consultoria-e-tecnologia/revisao-da-vida-util',
      },
      {
        id: 'ativos-inteligentes-rfid-e-rtls',
        title: 'Ativos Inteligentes RFID/RTLS',
        href: '/solucoes/consultoria-e-tecnologia/ativos-inteligentes-rfid-e-rtls',
      },
      {
        id: 'teste-de-impairment',
        title: 'Teste de Impairment',
        href: '/solucoes/consultoria-e-tecnologia/teste-de-impairment',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function ArrendamentoMercantilPage() {
  return <SolutionDetailPage config={config} />
}
