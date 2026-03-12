import { SolutionCategoryHubPage } from '@/components/SolutionCategoryHubPage'
import {
  generateSolutionCategoryMetadata,
  getSolutionCategoryPageData,
} from '@/lib/solutionCategories'

const categorySlug = 'controle-patrimonial'

export async function generateMetadata() {
  return generateSolutionCategoryMetadata(categorySlug)
}

export default async function ControlePatrimonialPage() {
  const pageData = await getSolutionCategoryPageData(categorySlug)

  return <SolutionCategoryHubPage {...pageData} />
}
