'use client'

import { format } from 'date-fns'
import { BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { useLanguage } from '../../context/LanguageContext'
import { PARTIES } from '../../data/constituencies'

export default function PollsPageClient({ polls, trends }) {
  const { language, t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('nav.polls')}
          </h1>
          <p className="text-gray-700">
            {language === 'ne' 
              ? 'नेपाळको लागि नवीनतम सार्वजनिक राय मतदान र मतदान प्रवृत्ति'
              : 'Latest public opinion polls and polling trends for Nepal elections'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-800 uppercase tracking-wider">
                {t('content.poll')}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{polls.length}</p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-800 uppercase tracking-wider">
                {t('polls.sampleSize')}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {polls.reduce((sum, poll) => sum + poll.sampleSize, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-800 uppercase tracking-wider">
                {language === 'ne' ? 'औसत' : 'Average'}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {Object.keys(trends).length}
            </p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-800 uppercase tracking-wider">
                {t('polls.marginError')}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              ±{(polls.reduce((sum, poll) => sum + poll.marginError, 0) / polls.length).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Polling Trends */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'ne' ? 'मतदान प्रवृत्ति' : 'Polling Trends'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(trends)
              .sort((a, b) => b[1] - a[1])
              .map(([party, percentage]) => {
                const partyInfo = PARTIES[party]
                return (
                  <div key={party} className="bg-neutral rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: partyInfo?.color || '#6b7280' }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {partyInfo?.short || party}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Polls List */}
        <div className="space-y-4">
          {polls.map(poll => {
            const title = language === 'ne' && poll.titleNe ? poll.titleNe : poll.title
            const pollster = language === 'ne' && poll.pollsterNe ? poll.pollsterNe : poll.pollster
            const methodology = language === 'ne' && poll.methodologyNe ? poll.methodologyNe : poll.methodology
            const notes = language === 'ne' && poll.notesNe ? poll.notesNe : poll.notes

            return (
              <Link
                key={poll.id}
                href={`/polls/${poll.id}`}
                className="block bg-surface border border-neutral rounded-xl p-6 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-xs font-medium">
                        {poll.rating}
                      </span>
                      <span className="text-xs text-gray-800">
                        {format(new Date(poll.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {pollster}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-800 mb-1">
                      {t('polls.sampleSize')}: {poll.sampleSize}
                    </div>
                    <div className="text-xs text-gray-800">
                      {t('polls.marginError')}: ±{poll.marginError}%
                    </div>
                  </div>
                </div>

                {/* Results Bar */}
                <div className="flex h-8 rounded-full overflow-hidden bg-neutral">
                  {Object.entries(poll.results)
                    .sort((a, b) => b[1] - a[1])
                    .map(([party, percentage]) => {
                      const partyInfo = PARTIES[party]
                      return (
                        <div
                          key={party}
                          className="h-full transition-all hover:opacity-80"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: partyInfo?.color || '#6b7280',
                          }}
                          title={`${partyInfo?.short || party}: ${percentage}%`}
                        />
                      )
                    })}
                </div>

                {/* Methodology */}
                <div className="mt-4 pt-4 border-t border-neutral">
                  <p className="text-xs text-gray-800 mb-2">
                    {t('polls.methodology')}: {methodology}
                  </p>
                  {notes && (
                    <p className="text-sm text-gray-700">
                      {notes}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {polls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-700">
              {language === 'ne' ? 'कुनै मतदान फेला परेन' : 'No polls found'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
