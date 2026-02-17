'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header';
import { useLanguage } from '../../../context/LanguageContext';

export default function ArticlePageClient({ article, relatedArticles, htmlContent }) {
  const { language } = useLanguage();

  const title = language === 'ne' && article.titleNe ? article.titleNe : article.title;
  const excerpt = language === 'ne' && article.excerptNe ? article.excerptNe : article.excerpt;
  const author = language === 'ne' && article.authorNe ? article.authorNe : article.author;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Dark Background */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'ne' ? 'विश्लेषण' : 'Analysis'}
            </Link>
          </nav>

          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
              {article.category}
            </span>
            {article.tags?.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl">
            {excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-t border-slate-700 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{author}</div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {article.date && !isNaN(new Date(article.date).getTime())
                      ? format(new Date(article.date), 'MMMM d, yyyy')
                      : 'Date unavailable'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime} {language === 'ne' ? 'min' : 'min read'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="w-full bg-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] md:aspect-[3/1]">
              <Image
                src={article.featuredImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Body */}
        <article
          className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
            prose-blockquote:text-slate-700 prose-blockquote:italic
            prose-ul:my-6 prose-ol:my-6
            prose-li:text-slate-700 prose-li:mb-2
            prose-img:rounded-lg prose-img:my-8
            prose-hr:my-12 prose-hr:border-slate-200
            [&>table]:w-full [&>table]:border-collapse [&>table]:my-8
            [&>table>thead>tr>th]:bg-slate-100 [&>table>thead>tr>th]:text-slate-900 [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:p-4 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:border-b-2 [&>table>thead>tr>th]:border-slate-300
            [&>table>tbody>tr>td]:p-4 [&>table>tbody>tr>td]:text-slate-700 [&>table>tbody>tr>td]:border-b [&>table>tbody>tr>td]:border-slate-200
            [&>table>tbody>tr:hover>td]:bg-slate-50"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {language === 'ne' ? 'यो लेख साझा गर्नुहोस्' : 'Share this article'}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
                      '_blank'
                    );
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">Twitter</span>
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      '_blank'
                    );
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator?.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'ne' ? 'कपी' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              {language === 'ne' ? 'सम्बन्धित लेखहरू' : 'Related Articles'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => {
                const relatedTitle =
                  language === 'ne' && relatedArticle.titleNe
                    ? relatedArticle.titleNe
                    : relatedArticle.title;
                const relatedExcerpt =
                  language === 'ne' && relatedArticle.excerptNe
                    ? relatedArticle.excerptNe
                    : relatedArticle.excerpt;

                return (
                  <Link
                    key={relatedArticle.slug}
                    href={`/analysis/${relatedArticle.slug}`}
                    className="group block"
                  >
                    <article className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-lg hover:border-blue-300 transition-all h-full flex flex-col">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                        {relatedArticle.category}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedTitle}
                      </h4>
                      <p className="text-sm text-slate-600 line-clamp-3 flex-1 mb-4">
                        {relatedExcerpt}
                      </p>
                      <div className="text-xs text-slate-400">
                        {relatedArticle.date && !isNaN(new Date(relatedArticle.date).getTime())
                          ? format(new Date(relatedArticle.date), 'MMM d, yyyy')
                          : ''}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
