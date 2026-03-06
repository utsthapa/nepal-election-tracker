'use client';

import { Activity, ArrowUpRight, RefreshCw, TrendingUp, Trophy } from 'lucide-react';
import Link from 'next/link';

import { useLiveResults } from '../hooks/useLiveResults';

const PARTY_COLORS = {
  'Rastriya Swatantra Party': '#3b82f6',
  'Nepali Congress': '#22c55e',
  'CPN-UML': '#ef4444',
  'Nepali Communist Party': '#dc2626',
  'Rastriya Prajatantra Party': '#8b5cf6',
  'Janata Samjbadi Party-Nepal': '#ec4899',
  'Shram Sanskriti Party': '#f59e0b',
  'Nepal Communist Party (Maoist)': '#991b1b',
  'Ujaylo Nepal Party': '#eab308',
  'Janamat Party': '#14b8a6',
  'Nagarik Unmukti Party': '#06b6d4',
  Others: '#6b7280',
};

const PARTY_SHORT = {
  'Rastriya Swatantra Party': 'RSP',
  'Nepali Congress': 'NC',
  'CPN-UML': 'UML',
  'Nepali Communist Party': 'NCP',
  'Rastriya Prajatantra Party': 'RPP',
  'Janata Samjbadi Party-Nepal': 'JSP-N',
  'Shram Sanskriti Party': 'SSP',
  'Nepal Communist Party (Maoist)': 'CPN-M',
  'Ujaylo Nepal Party': 'UNP',
  'Janamat Party': 'JP',
  'Nagarik Unmukti Party': 'NUP',
  'Rastriya Mukti Party Nepal (Ekal Chunab Chinha)': 'RMPN',
  Others: 'Others',
};

function StatusBadge({ status }) {
  const config = {
    counting: {
      text: 'COUNTING',
      bg: 'bg-red-600',
      pulse: true,
    },
    declaring: {
      text: 'DECLARING RESULTS',
      bg: 'bg-amber-600',
      pulse: true,
    },
    complete: {
      text: 'RESULTS FINAL',
      bg: 'bg-green-600',
      pulse: false,
    },
  };

  const c = config[status] || config.counting;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold tracking-wider text-white rounded ${c.bg}`}
    >
      {c.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}
      {c.text}
    </span>
  );
}

function PartyBar({ name, won, leading, totalSeats }) {
  const color = PARTY_COLORS[name] || '#6b7280';
  const short = PARTY_SHORT[name] || name;
  const total = won + leading;
  const pct = (total / totalSeats) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-sm font-bold text-gray-700 shrink-0">{short}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden relative">
        {won > 0 && (
          <div
            className="h-full absolute left-0 top-0 rounded-l"
            style={{
              width: `${(won / totalSeats) * 100}%`,
              backgroundColor: color,
            }}
          />
        )}
        {leading > 0 && (
          <div
            className="h-full absolute top-0 rounded-r opacity-50"
            style={{
              left: `${(won / totalSeats) * 100}%`,
              width: `${(leading / totalSeats) * 100}%`,
              backgroundColor: color,
            }}
          />
        )}
        {pct > 3 && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-sm">
            {total}
          </span>
        )}
      </div>
      <div className="w-20 text-right shrink-0">
        {won > 0 && (
          <span className="text-sm font-bold text-gray-900">
            <Trophy className="w-3 h-3 inline mr-0.5" />
            {won}
          </span>
        )}
        {leading > 0 && (
          <span className="text-sm text-gray-500 ml-1">
            <TrendingUp className="w-3 h-3 inline mr-0.5" />
            {leading}
          </span>
        )}
      </div>
    </div>
  );
}

export default function LiveResultsBanner() {
  const { data, error, loading, lastUpdated, refetch } = useLiveResults();

  if (loading && !data) {
    return (
      <div className="border-2 border-red-600 rounded-lg p-8 bg-white animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-6 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
        <p className="text-gray-500 text-sm">
          Live results temporarily unavailable.{' '}
          <button onClick={refetch} className="text-red-600 underline">
            Retry
          </button>
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { counting_status, total_seats, seats_declared, party_results } = data;

  return (
    <Link href="/results" className="block group">
      <div className="border-2 border-red-600 rounded-lg overflow-hidden bg-white group-hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-red-500" />
            <h3 className="text-white font-bold text-lg">2026 Election Results</h3>
            <StatusBadge status={counting_status} />
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-gray-400 text-xs">
                Updated{' '}
                {lastUpdated.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                refetch();
              }}
              className="text-gray-400 hover:text-white transition-colors"
              title="Refresh now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-6 text-sm">
          <span className="text-gray-500">
            <strong className="text-gray-900">{seats_declared}</strong> of {total_seats} seats
            declared
          </span>
          <span className="text-gray-500">
            <strong className="text-gray-900">{data.seats_with_leads}</strong> with leads
          </span>
          <span className="text-gray-400 text-xs">Refreshes every 30 seconds</span>
        </div>

        {/* Party bars */}
        <div className="px-6 py-4 space-y-2">
          {party_results.map(p => (
            <PartyBar
              key={p.name}
              name={p.name}
              won={p.won}
              leading={p.leading}
              totalSeats={total_seats}
            />
          ))}
          {party_results.length === 0 && (
            <p className="text-gray-500 text-sm py-2">
              No leads reported yet. Counting is underway.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 rounded inline-block" /> Won
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 opacity-50 rounded inline-block" /> Leading
          </span>
          <span className="ml-auto flex items-center gap-1 text-red-600 font-semibold group-hover:underline">
            View full results <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
