'use client'

import { getLatestForecast } from '../../../data/forecasts'
import { PARTIES } from '../../../data/constituencies'
import { useLanguage } from '../../../context/LanguageContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, AlertCircle, Info } from 'lucide-react'

export default function ForecastPage() {
  const { language, t } = useLanguage()
  const forecast = getLatestForecast()

  if (!forecast) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-700">
          {language === 'ne' ? 'कुनै पूर्वानुमान फेला परेन' : 'No forecast available'}
        </p>
      </div>
    )
  }

  const sortedProjections = Object.entries(forecast.projections).sort((a, b) => b[1].seats - a[1].seats)
  const totalSeats = Object.values(forecast.projections).reduce((sum, p) => sum + p.seats, 0)
  const majority = Math.ceil(totalSeats / 2)

  const chartData = sortedProjections.map(([party, data]) => ({
    party,
    seats: data.seats,
    probability: data.probability,
    color: PARTIES[party]?.color || '#6b7280',
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ne' ? 'निर्वाचन पूर्वानुमान' : 'Election Forecast'}
          </h1>
          <p className="text-gray-700">
            {forecast.election}
          </p>
        </div>

        {/* Methodology Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === 'ne' ? 'पद्धति' : 'Methodology'}
              </h3>
              <p className="text-sm text-gray-700">
                {language === 'ne' ? forecast.methodologyNe : forecast.methodology}
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-700">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {language === 'ne' ? 'अपडेट:' : 'Last updated:'} {forecast.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {language === 'ne' ? 'सिट पूर्वानुमान' : 'Seat Projections'}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="party" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => PARTIES[value]?.short || value}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value, name, props) => {
                  const party = props.payload.party
                  return [
                    `${PARTIES[party]?.name || party}:`,
                    `${value} seats`,
                    `${(props.payload.probability * 100).toFixed(1)}% probability`
                  ]
                }}
              />
              <Legend />
              <Bar dataKey="seats" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Majority Line */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {language === 'ne' ? 'बहुमत आवश्यकता' : 'Majority Threshold'}
              </h3>
              <p className="text-2xl font-bold text-green-400">
                {majority} {language === 'ne' ? 'सिट' : 'seats'}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                {language === 'ne' 
                  ? 'सरकार बनाउन {majority} सिट आवश्यक छ'
                  : `Needed to form government: ${majority} seats`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Party Projections */}
        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {language === 'ne' ? 'दल-वार पूर्वानुमान' : 'Party Projections'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedProjections.map(([party, data]) => {
              const partyInfo = PARTIES[party]
              const isAboveMajority = data.seats >= majority

              return (
                <div
                  key={party}
                  className={`rounded-xl p-4 ${
                    isAboveMajority 
                      ? 'bg-green-500/10 border-2 border-green-500/50' 
                      : 'bg-neutral border border-neutral'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: partyInfo?.color || '#6b7280' }}
                    />
                    <span className="font-bold text-white">
                      {partyInfo?.short || party}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-700">
                        {language === 'ne' ? 'पूर्वानुमान' : 'Projection'}
                      </span>
                      <span className="text-3xl font-bold text-white">
                        {data.seats}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-700">
                        {language === 'ne' ? 'दायरा' : 'Range'}
                      </span>
                      <span className="text-lg text-gray-700">
                        {data.range[0]} - {data.range[1]}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-700">
                        {language === 'ne' ? 'सम्भावना' : 'Probability'}
                      </span>
                      <span className="text-lg text-gray-700">
                        {(data.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scenarios */}
        {forecast.scenarios && forecast.scenarios.length > 0 && (
          <div className="bg-surface border border-neutral rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === 'ne' ? 'परिदृश्यहरू' : 'Scenarios'}
            </h2>
            <div className="space-y-4">
              {forecast.scenarios.map((scenario, index) => {
                const scenarioName = language === 'ne' && scenario.nameNe ? scenario.nameNe : scenario.name
                const scenarioDesc = language === 'ne' && scenario.descriptionNe ? scenario.descriptionNe : scenario.description
                const winnerInfo = PARTIES[scenario.winner]

                return (
                  <div key={index} className="bg-neutral rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {scenarioName}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {scenarioDesc}
                        </p>
                      </div>
                      {winnerInfo && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: winnerInfo.color }}
                          />
                          <span className="text-sm font-bold text-blue-400">
                            {winnerInfo.short} {language === 'ne' ? 'जित्छ' : 'wins'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex h-8 rounded-full overflow-hidden bg-neutral">
                      {Object.entries(scenario.seats)
                        .sort((a, b) => b[1] - a[1])
                        .map(([party, seats]) => {
                          const partyInfo = PARTIES[party]
                          return (
                            <div
                              key={party}
                              className="h-full transition-all hover:opacity-80"
                              style={{
                                width: `${(seats / totalSeats) * 100}%`,
                                backgroundColor: partyInfo?.color || '#6b7280',
                              }}
                              title={`${partyInfo?.short || party}: ${seats} seats`}
                            />
                          )
                        })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <strong>{language === 'ne' ? 'अस्वीकरण:' : 'Disclaimer:'}</strong> {language === 'ne'
              ? 'यो पूर्वानुमान सांख्यिक मोडेलहरूमा आधारित छ र वास्तविक परिणामा भिन्न हुन सक्छ। मतदान र जनसांख्यिकी परिवर्तनहरू अपडेट हुन सक्छन्।'
              : 'This forecast is based on statistical models and may not reflect actual election results. Polls and demographics can change over time.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
