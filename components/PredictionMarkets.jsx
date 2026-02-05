'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, ExternalLink, Activity, Clock, ArrowUpRight } from 'lucide-react'
import { getPredictionMarkets } from '../data/predictionMarkets'

export default function PredictionMarkets() {
  const [markets, setMarkets] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch prediction market data
    const fetchData = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setMarkets(getPredictionMarkets())
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral bg-surface/90 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[color:var(--accent-secondary)]" />
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b7280]">Prediction Markets</p>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral/40 rounded w-1/3"></div>
          <div className="h-8 bg-neutral/30 rounded w-full"></div>
          <div className="h-8 bg-neutral/30 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-neutral bg-surface/90 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[color:var(--accent-secondary)]" />
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b7280]">Prediction Markets</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#6b7280]">
          <Clock className="w-3 h-3" />
          <span>Live odds</span>
        </div>
      </div>

      <div className="space-y-4">
        {markets?.kalshi?.markets?.map((market) => (
          <MarketCard
            key={market.id}
            platform={markets.kalshi.name}
            platformUrl={markets.kalshi.url}
            market={market}
          />
        ))}

        {markets?.polymarket?.markets?.map((market) => (
          <MarketCard
            key={market.id}
            platform={markets.polymarket.name}
            platformUrl={markets.polymarket.url}
            market={market}
          />
        ))}
      </div>

      <div className="rounded-xl border border-neutral/70 bg-[#f8fafc] p-4 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b7280]">About these markets</p>
        <p className="text-sm text-[#374151]">
          Prediction markets aggregate collective wisdom about election outcomes. Prices reflect the probability of each outcome occurring.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/prediction-markets"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--accent-primary)] hover:underline"
          >
            View all markets
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <a
            href={markets?.kalshi?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--accent-primary)] hover:underline"
          >
            View on Kalshi
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={markets?.polymarket?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[color:var(--accent-primary)] hover:underline"
          >
            View on Polymarket
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

function MarketCard({ platform, platformUrl, market }) {
  const topOutcome = market.outcomes?.[0]

  return (
    <div className="rounded-xl border border-neutral/70 bg-white/80 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280] font-semibold">
              {platform}
            </span>
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--accent-primary)] hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <h4 className="text-sm font-display text-[#0f172a] leading-tight">
            {market.title}
          </h4>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
            {market.subtitle}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">Top pick</p>
            <p className="text-lg font-display text-[color:var(--accent-primary)]">
              {topOutcome?.name || '—'}
            </p>
            <p className="text-sm font-semibold text-[#0f172a]">
              {topOutcome ? `${(topOutcome.probability * 100).toFixed(0)}%` : '—'}
            </p>
          </div>
        </div>
      </div>

      {market.outcomes && market.outcomes.length > 0 && (
        <div className="space-y-2">
          {market.outcomes.slice(0, 3).map((outcome, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#0f172a]">{outcome.name}</span>
                  <span className="font-semibold text-[#0f172a]">
                    {(outcome.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent-primary)] to-[color:var(--accent-secondary)]"
                    style={{ width: `${outcome.probability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-neutral/50">
        <div className="flex items-center gap-2 text-xs text-[#6b7280]">
          <TrendingUp className="w-3 h-3" />
          <span>Vol: ${(market.volume / 1000).toFixed(0)}K</span>
        </div>
        <div className="text-[10px] text-[#6b7280]">
          Updated {new Date(market.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
