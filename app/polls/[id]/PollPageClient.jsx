'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { PARTIES } from '../../../data/constituencies'
import { useLanguage } from '../../../context/LanguageContext'
import { ArrowLeft, TrendingUp, Users, AlertCircle, Calendar } from 'lucide-react'

export default function PollPageClient({ poll }) {
  const { language, t } = useLanguage()

  const title = language === 'ne' && poll.titleNe ? poll.titleNe : poll.title
  const pollster = language === 'ne' && poll.pollsterNe ? poll.pollsterNe : poll.pollster
  const methodology = language === 'ne' && poll.methodologyNe ? poll.methodologyNe : poll.methodology
  const notes = language === 'ne' && poll.notesNe ? poll.notesNe : poll.notes

  const sortedResults = Object.entries(poll.results).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/polls"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'ne' ? 'पछि जानुहोस्' : 'Back to Polls'}
        </Link>

        {/* Poll Header */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              poll.rating.startsWith('A') ? 'bg-green-500/20 text-green-400' :
              poll.rating.startsWith('B') ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {poll.rating}
            </span>
            <span className="text-sm text-gray-800">
              {format(new Date(poll.date), 'MMMM d, yyyy')}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            {title}
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            {pollster}
          </p>

          {/* Poll Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-800">
                  {t('polls.sampleSize')}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {poll.sampleSize.toLocaleString()}
              </p>
            </div>
            <div className="bg-neutral rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-800">
                  {t('polls.marginError')}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                ±{poll.marginError}%
              </p>
            </div>
            <div className="bg-neutral rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-800">
                  {t('meta.published')}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {format(new Date(poll.date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {t('polls.methodology')}
          </h2>
          <p className="text-gray-700 mb-4">
            {methodology}
          </p>
          {notes && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>{language === 'ne' ? 'टिप्पणी:' : 'Notes:'}</strong> {notes}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-surface border border-neutral rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {language === 'ne' ? 'नतिजाहरू' : 'Results'}
          </h2>

          {/* Bar Chart */}
          <div className="mb-8">
            <div className="flex h-12 rounded-full overflow-hidden bg-neutral">
              {sortedResults.map(([party, percentage]) => {
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
          </div>

          {/* Results Table */}
          <div className="space-y-3">
            {sortedResults.map(([party, percentage]) => {
              const partyInfo = PARTIES[party]
              return (
                <div
                  key={party}
                  className="flex items-center justify-between bg-neutral rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: partyInfo?.color || '#6b7280' }}
                    />
                    <div>
                      <p className="font-bold text-white">
                        {partyInfo?.short || party}
                      </p>
                      <p className="text-sm text-gray-700">
                        {partyInfo?.name || party}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      {percentage}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <strong>{language === 'ne' ? 'अस्वीकरण:' : 'Disclaimer:'}</strong> {language === 'ne'
              ? 'यो मतदान एक नमूना हो र वास्तविक निर्वाचन परिणाम परिनामलाई प्रतिबिम्बित गर्न सक्छ। मतदानहरूमा त्रुटि हुन्छ र यो जानकारी मात्र सन्दर्भको लागि प्रदान गरिएको हो।'
              : 'This poll is a sample and may not reflect actual election results. Polls have margins of error and this information is provided for reference purposes only.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
