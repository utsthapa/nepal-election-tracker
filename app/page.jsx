'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import PredictionMarkets from '../components/PredictionMarkets';
import { ELECTIONS } from '../data/historicalElections';

// Article card component
function ArticleCard({ title, excerpt, category, date, href, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="border-t-2 border-gray-200 pt-6 hover:border-red-600 transition-colors"
    >
      <Link href={href} className="block group">
        <div className="mb-3">
          <span className="text-xs font-bold tracking-widest uppercase text-red-600">
            {category}
          </span>
        </div>
        <h2 className="text-3xl font-display font-bold leading-tight mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
          {title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-3">{excerpt}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <time>{date}</time>
        </div>
      </Link>
    </motion.article>
  );
}

// 2022 Results widget
function ResultsWidget() {
  const election2022 = ELECTIONS[2022];
  if (!election2022) {
    return null;
  }

  return (
    <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-red-600 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-red-600" />
        <h3 className="text-sm font-bold tracking-widest uppercase text-red-600">2022 Results</h3>
      </div>

      <h4 className="text-2xl font-display font-bold mb-6">General Election Results</h4>

      <div className="space-y-3 mb-6">
        {Object.entries(election2022.results.Total)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([party, seats]) => (
            <div key={party} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{party}</span>
                  <span className="font-data font-bold">{seats}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${(seats / election2022.totalSeats) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      <Link
        href="/elections/2022"
        className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
      >
        Full Results & Analysis
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Article */}
        <div className="mb-20">
          <article className="mb-12">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-red-600 text-white mb-4">
                Featured Analysis
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight mb-4 text-gray-900">
              Nepal&apos;s Political Landscape in 2026: What the Data Tells Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4">
              As coalition politics continues to shape governance, new polling data reveals shifting
              voter sentiment across key constituencies. An in-depth analysis of what&apos;s driving
              change.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <time>February 12, 2026</time>
            </div>
          </article>
        </div>

        {/* Articles Grid */}
        <div className="mb-20">
          <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 mb-8 pb-3 border-b-2 border-red-600">
            Latest Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            <ArticleCard
              title="Understanding Nepal's Electoral System"
              excerpt="A deep dive into the mixed member proportional representation system and its impact on coalition formation."
              category="Explainer"
              date="February 10, 2026"
              href="/analysis/understanding-nepals-electoral-system"
              delay={0.2}
            />
            <ArticleCard
              title="Regional Voting Patterns Emerge"
              excerpt="How geography and identity politics continue to shape electoral outcomes across provinces."
              category="Data Analysis"
              date="February 9, 2026"
              href="/analysis/regional-voting-patterns"
              delay={0.3}
            />
            <ArticleCard
              title="Youth Voter Trends"
              excerpt="First-time voters could swing key constituencies in the next election."
              category="Demographics"
              date="February 8, 2026"
              href="/analysis/youth-voter-trends"
              delay={0.4}
            />
            <ArticleCard
              title="Coalition Stability Index"
              excerpt="Measuring government longevity through data-driven metrics."
              category="Methodology"
              date="February 7, 2026"
              href="/analysis/coalition-stability"
              delay={0.5}
            />
            <ArticleCard
              title="Madhesh Province Analysis"
              excerpt="The kingmaker region that determines national outcomes."
              category="Regional Focus"
              date="February 6, 2026"
              href="/analysis/madhesh-province-analysis"
              delay={0.6}
            />
            <ArticleCard
              title="Economic Voting Patterns"
              excerpt="How inflation and GDP growth correlate with electoral shifts."
              category="Economics"
              date="February 5, 2026"
              href="/analysis/economic-voting"
              delay={0.7}
            />
          </div>
        </div>

        {/* Widgets */}
        <div className="mb-20">
          <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 mb-8 pb-3 border-b-2 border-red-600">
            Data & Tools
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <ResultsWidget />
            </div>
            <PredictionMarkets type="kalshi" />
            <PredictionMarkets type="pm" />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">Explore Our Interactive Tools</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Run election simulations, analyze polling data, and explore demographic trends.
          </p>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors text-lg"
          >
            Launch Election Simulator
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
