import AnalysisPageClient from './AnalysisPageClient'
import { getAllArticles, getAllCategories, getAllTags } from '../../lib/content'

export const metadata = {
  title: 'Analysis | NepaliSoch',
  description: 'In-depth election analysis, forecasts, and political commentary for Nepal.',
}

export default function AnalysisPage() {
  const articles = getAllArticles().map(({ content: _content, ...meta }) => meta)
  const categories = getAllCategories()
  const tags = getAllTags()

  return <AnalysisPageClient articles={articles} categories={categories} tags={tags} />
}
