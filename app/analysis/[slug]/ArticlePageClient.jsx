'use client'

import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { useLanguage } from '../../../context/LanguageContext'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'

export default function ArticlePageClient({ article, relatedArticles, children }) {
  const { language } = useLanguage()

  const title = language === 'ne' && article.titleNe ? article.titleNe : article.title
  const excerpt = language === 'ne' && article.excerptNe ? article.excerptNe : article.excerpt
  const author = language === 'ne' && article.authorNe ? article.authorNe : article.author

  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'ne' ? 'पछि जानुहोस्' : 'Back to Analysis'}
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              {article.category}
            </span>
            {article.tags && article.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-neutral text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>

          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            {excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} {language === 'ne' ? 'मिनेट पढ्ने' : 'min read'}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden relative aspect-video">
            <Image
              src={article.featuredImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-12">
          {children}
        </div>

        {/* Share Section */}
        <div className="border-t border-neutral pt-8 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              {language === 'ne' ? 'साझा गर्नुहोस्' : 'Share this article'}
            </h3>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-neutral hover:bg-neutral/80 rounded-lg text-sm font-medium transition-colors"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
                  }
                }}
              >
                Twitter
              </button>
              <button
                className="px-4 py-2 bg-neutral hover:bg-neutral/80 rounded-lg text-sm font-medium transition-colors"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                  }
                }}
              >
                Facebook
              </button>
              <button
                className="px-4 py-2 bg-neutral hover:bg-neutral/80 rounded-lg text-sm font-medium transition-colors"
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator?.clipboard) {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
              >
                {language === 'ne' ? 'कपी' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-neutral pt-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              {language === 'ne' ? 'सम्बन्धित लेखहरू' : 'Related Articles'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => {
                const relatedTitle = language === 'ne' && relatedArticle.titleNe 
                  ? relatedArticle.titleNe 
                  : relatedArticle.title
                const relatedExcerpt = language === 'ne' && relatedArticle.excerptNe 
                  ? relatedArticle.excerptNe 
                  : relatedArticle.excerpt

                return (
                  <Link
                    key={relatedArticle.slug}
                    href={`/analysis/${relatedArticle.slug}`}
                    className="group"
                  >
                    <article className="bg-surface border border-neutral rounded-xl p-4 hover:border-blue-500/50 transition-all h-full flex flex-col">
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {relatedTitle}
                      </h4>
                      <p className="text-sm text-gray-700 line-clamp-3 flex-1">
                        {relatedExcerpt}
                      </p>
                      <div className="text-xs text-gray-800 mt-2">
                        {format(new Date(relatedArticle.date), 'MMM d, yyyy')}
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
