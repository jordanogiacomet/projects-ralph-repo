import { SolutionCategoryHubPage } from '@/components/SolutionCategoryHubPage'
import {
  generateSolutionCategoryMetadata,
  getSolutionCategoryPageData,
} from '@/lib/solutionCategories'

const categorySlug = 'consultoria-e-tecnologia'

export async function generateMetadata() {
  return generateSolutionCategoryMetadata(categorySlug)
}

export default async function ConsultoriaETecnologiaPage() {
  const pageData = await getSolutionCategoryPageData(categorySlug)

  return <SolutionCategoryHubPage {...pageData} />
}
