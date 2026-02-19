import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';

import ArticlePageClient from './ArticlePageClient';
import { getArticleBySlug, getRelatedArticles, getArticlesFromDir } from '../../../lib/content';
import { generateArticleMetadata } from '../../../lib/metadata';

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

// Convert <Callout> MDX components to styled HTML before markdown processing
function preprocessCallouts(source) {
  return source.replace(
    /<Callout\s+type="(\w+)"\s+title="([^"]*)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, title, content) => {
      const colors = {
        info: { bg: '#f0f9ff', border: '#0ea5e9', titleColor: '#0c4a6e' },
        warning: { bg: '#fef9c3', border: '#fde68a', titleColor: '#a16207' },
        success: { bg: '#dcfce7', border: '#86efac', titleColor: '#15803d' },
        error: { bg: '#fee2e2', border: '#fca5a5', titleColor: '#b91c1c' },
      };
      const c = colors[type] || colors.info;
      return `<div style="background:${c.bg};border:1px solid ${c.border};border-radius:8px;padding:24px;margin:24px 0"><h4 style="font-size:18px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.05em;color:#0f172a">${title}</h4><div style="font-size:16px;line-height:1.6;color:#334155">${content}</div></div>`;
    }
  );
}

// Convert <PullQuote> MDX components to styled HTML
function preprocessPullQuotes(source) {
  return source.replace(/<PullQuote>\s*([\s\S]*?)\s*<\/PullQuote>/g, (_, content) => {
    return `<blockquote style="border-left:4px solid #6366f1;background:#fafafa;padding:24px 32px;margin:32px 0;font-family:Georgia,serif;font-style:italic;font-size:22px;line-height:1.4;color:#1e293b"><p style="margin:0">${content}</p></blockquote>`;
  });
}

// Convert <Sidebar> MDX components to styled HTML
function preprocessSidebars(source) {
  return source.replace(
    /<Sidebar\s+title="([^"]*)">\s*([\s\S]*?)\s*<\/Sidebar>/g,
    (_, title, content) => {
      return `<aside style="background:#fefce8;border:1px solid #fef3c7;border-radius:8px;padding:20px;margin:24px 0"><h4 style="font-size:16px;font-weight:600;margin:0 0 12px 0;color:#78350f;display:flex;align-items:center;gap:8px">ℹ️ ${title}</h4><div style="font-size:15px;line-height:1.6;color:#451a03">${content}</div></aside>`;
    }
  );
}

// Render MDX/Markdown to HTML string
async function mdxToHtml(source) {
  // Pre-process MDX components to HTML
  let processed = source;
  processed = preprocessCallouts(processed);
  processed = preprocessPullQuotes(processed);
  processed = preprocessSidebars(processed);

  const { unified } = await import('unified');
  const { default: remarkParse } = await import('remark-parse');
  const { default: remarkRehype } = await import('remark-rehype');
  const { default: rehypeStringify } = await import('rehype-stringify');
  const { default: rehypeRaw } = await import('rehype-raw');

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(processed);

  return String(result);
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

  // Convert MDX/Markdown to HTML with remark-gfm for table support
  const htmlContent = await mdxToHtml(content);

  return (
    <ArticlePageClient
      article={articleMeta}
      relatedArticles={relatedArticles}
      htmlContent={htmlContent}
    />
  );
}
