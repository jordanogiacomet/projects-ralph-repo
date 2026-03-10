import type { Metadata } from 'next'

import {
  SolutionDetailPage,
  generateSolutionDetailMetadata,
  type SolutionDetailConfig,
} from '@/components/SolutionDetailPage'

const config = {
  categorySlug: 'controle-patrimonial',
  solutionSlug: 'etiquetas-patrimoniais-inteligentes',
  fallbackData: {
    title: 'Etiquetas Patrimoniais Inteligentes',
    heroTitle: 'Etiquetas Patrimoniais Inteligentes',
    categoryTitle: 'Controle Patrimonial',
    description:
      'Desenvolvemos soluções de etiquetagem patrimonial para identificação precisa dos ativos, elevando rastreabilidade, controle operacional e confiabilidade dos inventários.',
    metaTitle: 'Etiquetas Patrimoniais Inteligentes | Apollo Gestão',
    metaDescription:
      'Serviço de Etiquetas Patrimoniais Inteligentes da Apollo Gestão para identificação técnica de ativos com durabilidade, padronização e rastreabilidade.',
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
                text: 'Identificação patrimonial com padrão técnico e alta durabilidade',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Fornecemos etiquetas patrimoniais adequadas ao ambiente de uso, com materiais e especificações que suportam rotina operacional, auditorias e inventários frequentes.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Com identificação padronizada dos ativos, sua empresa ganha agilidade para conciliação física-contábil, redução de perdas e maior governança patrimonial.',
              },
            ],
          },
        ],
      },
    },
    relatedSolutions: [
      {
        id: 'organizacao-patrimonial',
        title: 'Organização Patrimonial',
        href: '/solucoes/controle-patrimonial/organizacao-patrimonial',
      },
      {
        id: 'controle-e-inventario-de-estoques',
        title: 'Controle e Inventário de Estoques',
        href: '/solucoes/controle-patrimonial/controle-e-inventario-de-estoques',
      },
      {
        id: 'processamento-patrimonial',
        title: 'Processamento Patrimonial',
        href: '/solucoes/controle-patrimonial/processamento-patrimonial',
      },
    ],
  },
} satisfies SolutionDetailConfig

export async function generateMetadata(): Promise<Metadata> {
  return generateSolutionDetailMetadata(config)
}

export default function EtiquetasPatrimoniaisInteligentesPage() {
  return <SolutionDetailPage config={config} />
}
