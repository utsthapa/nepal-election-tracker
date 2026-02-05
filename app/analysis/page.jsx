import { getAllArticles, getAllCategories, getAllTags } from '../../lib/content'
import AnalysisPageClient from './AnalysisPageClient'

export const metadata = {
  title: 'Analysis | Nepal Votes',
  description: 'In-depth election analysis, forecasts, and political commentary for Nepal.',
}

export default function AnalysisPage() {
  const articles = getAllArticles().map(({ content, ...meta }) => meta)
  const categories = getAllCategories()
  const tags = getAllTags()

  return <AnalysisPageClient articles={articles} categories={categories} tags={tags} />
}
