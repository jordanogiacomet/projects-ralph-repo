import { SolutionCategoryHubPage } from '@/components/SolutionCategoryHubPage'
import {
  generateSolutionCategoryMetadata,
  getSolutionCategoryPageData,
} from '@/lib/solutionCategories'

const categorySlug = 'avaliacao-patrimonial'

export async function generateMetadata() {
  return generateSolutionCategoryMetadata(categorySlug)
}

export default async function AvaliacaoPatrimonialPage() {
  const pageData = await getSolutionCategoryPageData(categorySlug)

  return <SolutionCategoryHubPage {...pageData} />
}
