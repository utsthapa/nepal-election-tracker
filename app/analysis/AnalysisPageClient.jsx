'use client';

import { format } from 'date-fns';
import { Calendar, Tag, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { useLanguage } from '../../context/LanguageContext';

export default function AnalysisPageClient({ articles, categories, tags }) {
  const { language } = useLanguage();

  // Get featured article (first one)
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {language === 'ne' ? 'विश्लेषण' : 'Analysis'}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              {language === 'ne'
                ? 'नेपालको निर्वाचन विश्लेषण, पूर्वानुमान, र राजनीतिक टिप्पणी'
                : "Data-driven election analysis, forecasts, and political commentary for Nepal. We dig into the numbers so you don't have to."}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12 border-b border-slate-200 pb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-500 uppercase tracking-wide">
                {language === 'ne' ? 'लेखहरू' : 'Articles'}
              </span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">{articles.length}</p>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Tag className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-500 uppercase tracking-wide">
                {language === 'ne' ? 'ट्यागहरू' : 'Topics'}
              </span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">{tags.length}</p>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-500 uppercase tracking-wide">
                {language === 'ne' ? 'अपडेट' : 'Updated'}
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {format(new Date(), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/analysis"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {language === 'ne' ? 'सबै' : 'All'}
            </Link>
            {categories.map(category => (
              <Link
                key={category}
                href={`/analysis?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              {language === 'ne' ? 'विशेष लेख' : 'Featured'}
            </h2>
            <Link href={`/analysis/${featuredArticle.slug}`} className="group block">
              <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredArticle.featuredImage && (
                    <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px]">
                      <Image
                        src={featuredArticle.featuredImage}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4 w-fit">
                      {featuredArticle.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredArticle.date && !isNaN(new Date(featuredArticle.date).getTime())
                          ? format(new Date(featuredArticle.date), 'MMM d, yyyy')
                          : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredArticle.readTime} {language === 'ne' ? 'min' : 'min read'}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            {language === 'ne' ? 'सबै लेखहरू' : 'All Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map(article => {
              const title = language === 'ne' && article.titleNe ? article.titleNe : article.title;
              const excerpt =
                language === 'ne' && article.excerptNe ? article.excerptNe : article.excerpt;

              return (
                <Link key={article.slug} href={`/analysis/${article.slug}`} className="group">
                  <article className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all h-full flex flex-col">
                    {article.featuredImage && (
                      <div className="aspect-video bg-slate-100 overflow-hidden relative">
                        <Image
                          src={article.featuredImage}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 flex-1 mb-4">{excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                          {article.date && !isNaN(new Date(article.date).getTime())
                            ? format(new Date(article.date), 'MMM d, yyyy')
                            : ''}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          {language === 'ne' ? 'पढ्नुहोस्' : 'Read'}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
