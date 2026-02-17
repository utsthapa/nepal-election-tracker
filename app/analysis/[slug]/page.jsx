import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'

import ArticlePageClient from './ArticlePageClient'
import { getArticleBySlug, getRelatedArticles, getArticlesFromDir } from '../../../lib/content'
import { generateArticleMetadata } from '../../../lib/metadata'

// Generate static params for all analysis articles
export async function generateStaticParams() {
  const articles = getArticlesFromDir('analysis')
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getArticleBySlug('analysis', slug)

  if (!article) {
    return {
      title: 'Article Not Found | NepaliSoch',
    }
  }

  return generateArticleMetadata(article)
}

// Convert <Callout> MDX components to styled HTML before markdown processing
function preprocessCallouts(source) {
  return source.replace(
    /<Callout\s+type="(\w+)"\s+title="([^"]*)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, title, content) => {
      const colors = {
        info: { bg: '#dbeafe', border: '#93c5fd', icon: 'text-blue-700', titleColor: '#1d4ed8' },
        warning: { bg: '#fef9c3', border: '#fde68a', icon: 'text-yellow-700', titleColor: '#a16207' },
        success: { bg: '#dcfce7', border: '#86efac', icon: 'text-green-700', titleColor: '#15803d' },
        error: { bg: '#fee2e2', border: '#fca5a5', icon: 'text-red-700', titleColor: '#b91c1c' },
      }
      const c = colors[type] || colors.info
      return `<div style="background:${c.bg};border:1px solid ${c.border};border-radius:8px;padding:16px;margin:16px 0"><strong style="color:${c.titleColor};display:block;margin-bottom:4px">${title}</strong><span style="color:#374151;font-size:14px">${content}</span></div>`
    }
  )
}

// Render MDX/Markdown to HTML string
async function mdxToHtml(source) {
  // Pre-process MDX components to HTML
  const processed = preprocessCallouts(source)

  const { unified } = await import('unified')
  const { default: remarkParse } = await import('remark-parse')
  const { default: remarkRehype } = await import('remark-rehype')
  const { default: rehypeStringify } = await import('rehype-stringify')
  const { default: rehypeRaw } = await import('rehype-raw')

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(processed)

  return String(result)
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const article = getArticleBySlug('analysis', slug)

  if (!article) {
    notFound()
  }

  const { content, ...articleMeta } = article
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3).map(({ content: _content, ...rest }) => rest)

  // Convert MDX/Markdown to HTML with remark-gfm for table support
  const htmlContent = await mdxToHtml(content)

  return (
    <ArticlePageClient
      article={articleMeta}
      relatedArticles={relatedArticles}
      htmlContent={htmlContent}
    />
  )
}
