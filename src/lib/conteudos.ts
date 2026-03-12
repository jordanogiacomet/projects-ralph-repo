export type FallbackConteudo = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  downloadUrl: string
  requiresEmail: boolean
  metaTitle: string
  metaDescription: string
}

export const fallbackConteudos: FallbackConteudo[] = [
  {
    id: 'fallback-ebook-identificacao',
    slug: 'e-book-identificacao-patrimonial',
    title: 'E-book de Identificacao Patrimonial',
    description:
      'Material introdutorio com boas praticas para identificar, classificar e rastrear ativos com padrao tecnico.',
    imageUrl: '/images/conteudos/ebook-identificacao-patrimonial.svg',
    downloadUrl: '/downloads/e-book-identificacao-patrimonial.txt',
    requiresEmail: true,
    metaTitle: 'E-book de Identificacao Patrimonial | Apollo Gestao',
    metaDescription:
      'Baixe gratuitamente o e-book de Identificacao Patrimonial e acelere a organizacao dos ativos da sua empresa.',
  },
  {
    id: 'fallback-planilha-cpc27',
    slug: 'planilha-vida-util-cpc-27',
    title: 'Planilha de Vida Util CPC 27',
    description:
      'Template pratico para apoiar revisoes de vida util, valor residual e depreciacao em conformidade com o CPC 27.',
    imageUrl: '/images/conteudos/planilha-vida-util-cpc-27.svg',
    downloadUrl: '/downloads/planilha-vida-util-cpc-27.csv',
    requiresEmail: false,
    metaTitle: 'Planilha de Vida Util CPC 27 | Apollo Gestao',
    metaDescription:
      'Download gratuito da planilha de Vida Util CPC 27 para apoiar analises tecnicas de depreciacao.',
  },
]

const fallbackBySlug = new Map(fallbackConteudos.map((conteudo) => [conteudo.slug, conteudo]))

export function getFallbackConteudoBySlug(slug: string): FallbackConteudo | undefined {
  return fallbackBySlug.get(slug)
}
