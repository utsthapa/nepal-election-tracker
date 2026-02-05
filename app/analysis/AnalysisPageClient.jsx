'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Tag, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AnalysisPageClient({ articles, categories, tags }) {
  const { language, t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('nav.analysis')}
          </h1>
          <p className="text-gray-400">
            {language === 'ne' 
              ? 'नेपाळको निर्वाचन विश्लेषण, पूर्वानुमान, र राजनीतिक टिप्पणी'
              : 'In-depth election analysis, forecasts, and political commentary for Nepal'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {t('content.article')}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{articles.length}</p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {t('meta.tags')}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{tags.length}</p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {t('category.forecasts')}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {articles.filter(a => a.category === 'forecasts').length}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'ne' ? 'श्रेणीहरू' : 'Categories'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/analysis"
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              {t('common.all')}
            </Link>
            {categories.map(category => (
              <Link
                key={category}
                href={`/analysis?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 bg-neutral text-gray-300 rounded-lg text-sm font-medium hover:bg-neutral/80 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => {
            const title = language === 'ne' && article.titleNe ? article.titleNe : article.title
            const excerpt = language === 'ne' && article.excerptNe ? article.excerptNe : article.excerpt

            return (
              <Link
                key={article.slug}
                href={`/analysis/${article.slug}`}
                className="group"
              >
                <article className="bg-surface border border-neutral rounded-xl overflow-hidden hover:border-blue-500/50 transition-all h-full flex flex-col">
                  {article.featuredImage && (
                    <div className="aspect-video bg-neutral overflow-hidden">
                      <img
                        src={article.featuredImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(article.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3 flex-1">
                      {excerpt}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      {article.readTime} {t('meta.readTime')}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
