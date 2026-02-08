import { notFound } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles } from '../../../lib/content'
import { generateArticleMetadata } from '../../../lib/metadata'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '../../../components/mdx/MDXComponents'
import ArticlePageClient from './ArticlePageClient'

export async function generateMetadata({ params }) {
  const article = getArticleBySlug('analysis', params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found | NepaliSoch',
    }
  }

  return generateArticleMetadata(article)
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug('analysis', params.slug)

  if (!article) {
    notFound()
  }

  const { content, ...articleMeta } = article
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3).map(({ content, ...rest }) => rest)

  return (
    <ArticlePageClient article={articleMeta} relatedArticles={relatedArticles}>
      <MDXRemote
        source={content}
        components={mdxComponents}
      />
    </ArticlePageClient>
  )
}
