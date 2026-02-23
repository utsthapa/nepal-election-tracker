import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getArticleBySlug, getRelatedArticles, getArticlesFromDir } from '../../../lib/content';
import { generateArticleMetadata } from '../../../lib/metadata';
import { MDXArticleComponents } from '../mdx-components';

// Generate static params for all analysis articles
export async function generateStaticParams() {
  const articles = getArticlesFromDir('analysis');
  return articles.map(article => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug('analysis', slug);

  if (!article) {
    return {
      title: 'Article Not Found | NepaliSoch',
    };
  }

  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug('analysis', slug);

  if (!article) {
    notFound();
  }

  const { content, ...articleMeta } = article;
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3).map(
    ({ content: _content, ...rest }) => rest
  );

  return (
    <ArticlePageClient article={articleMeta} relatedArticles={relatedArticles} content={content} />
  );
}
