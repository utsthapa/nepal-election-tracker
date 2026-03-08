'use client';

import {
  Activity,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trophy,
  TrendingUp,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

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
  Independent: '#9ca3af',
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
  Independent: 'IND',
  Others: 'Others',
};

function StatusBadge({ status }) {
  const config = {
    counting: { text: 'COUNTING', bg: 'bg-red-600', pulse: true },
    declaring: { text: 'DECLARING RESULTS', bg: 'bg-amber-600', pulse: true },
    complete: { text: 'RESULTS FINAL', bg: 'bg-green-600', pulse: false },
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
    <div className="flex items-center gap-3 py-1">
      <span className="w-14 text-sm font-bold text-gray-700 shrink-0">{short}</span>
      <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden relative">
        {won > 0 && (
          <div
            className="h-full absolute left-0 top-0 rounded-l"
            style={{ width: `${(won / totalSeats) * 100}%`, backgroundColor: color }}
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
        {pct > 2 && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-sm">
            {total}
          </span>
        )}
      </div>
      <div className="w-24 text-right shrink-0 flex items-center justify-end gap-2">
        {won > 0 && (
          <span className="text-sm font-bold text-gray-900">
            <Trophy className="w-3 h-3 inline mr-0.5" />
            {won}
          </span>
        )}
        {leading > 0 && (
          <span className="text-sm text-gray-500">
            <TrendingUp className="w-3 h-3 inline mr-0.5" />
            {leading}
          </span>
        )}
      </div>
    </div>
  );
}

function ConstituencyDetail({ province, district, districtName, constituency, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `/api/results/constituency?province=${province}&district=${district}&constituency=${constituency}`
    )
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [province, district, constituency]);

  const label = `${districtName || district}-${constituency}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="font-bold text-lg">{label}</h3>
            <p className="text-gray-400 text-sm">Province {province}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          ) : data?.candidates?.length > 0 ? (
            <div className="space-y-3">
              {data.candidates.map((c, i) => {
                const color = PARTY_COLORS[c.party] || '#6b7280';
                const maxVotes = data.candidates[0]?.votes || 1;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded border ${c.status === 'won' ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">{c.party}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{c.votes.toLocaleString()}</p>
                        {c.status === 'won' && c.margin > 0 && (
                          <p className="text-xs text-green-600">+{c.margin.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(c.votes / maxVotes) * 100}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No candidate data available yet.</p>
          )}
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-400 rounded-b-lg">
          Source: Kantipur Election Tracker (ECN data)
        </div>
      </div>
    </div>
  );
}

function ProvinceSection({ name, parties, totalSeats, expanded, onToggle }) {
  if (!parties || parties.length === 0) return null;
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <h3 className="font-bold text-gray-900">{name}</h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expanded && (
        <div className="px-4 py-3 space-y-1">
          {parties.map(p => (
            <div key={p.name} className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">{PARTY_SHORT[p.name] || p.name}</span>
              <span className="flex items-center gap-3">
                {p.won > 0 && (
                  <span className="font-bold text-gray-900">
                    <Trophy className="w-3 h-3 inline mr-0.5" />
                    {p.won}
                  </span>
                )}
                {p.leading > 0 && (
                  <span className="text-gray-500">
                    <TrendingUp className="w-3 h-3 inline mr-0.5" />
                    {p.leading}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [expandedProvinces, setExpandedProvinces] = useState({});

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch {
      // keep existing data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  const toggleProvince = name => {
    setExpandedProvinces(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Activity className="w-6 h-6 text-red-600" />
            <h1 className="text-3xl font-display font-bold text-gray-900">2082 Election Results</h1>
            {data && <StatusBadge status={data.counting_status} />}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-gray-400 text-xs">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchResults}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        ) : data ? (
          <div className="space-y-10">
            {/* National Summary */}
            <section>
              <div className="flex items-center gap-4 mb-4 pb-2 border-b-2 border-red-600">
                <h2 className="text-sm font-bold tracking-widest uppercase text-red-600">
                  National Summary — House of Representatives
                </h2>
                <span className="text-sm text-gray-500">
                  {data.seats_declared} of {data.total_seats} declared
                </span>
              </div>
              <div className="space-y-1">
                {data.party_results?.map(p => (
                  <PartyBar
                    key={p.name}
                    name={p.name}
                    won={p.won}
                    leading={p.leading}
                    totalSeats={data.total_seats}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded inline-block" /> Won
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 opacity-50 rounded inline-block" /> Leading
                </span>
                <span className="ml-auto">165 seats needed for majority</span>
              </div>
            </section>

            {/* Key Contests */}
            {data.key_contests?.length > 0 && (
              <section>
                <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 mb-4 pb-2 border-b-2 border-red-600">
                  Key Contests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.key_contests.map((contest, i) => {
                    const color = PARTY_COLORS[contest.party] || '#6b7280';
                    return (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedConstituency({
                            province: contest.province,
                            district: contest.district,
                            districtName: contest.district_name,
                            constituency: contest.constituency,
                          })
                        }
                        className="text-left border border-gray-200 rounded-lg p-4 hover:border-red-400 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase text-gray-400">
                            {contest.label}
                          </span>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                        <p className="font-bold text-gray-900">{contest.candidate}</p>
                        <p className="text-sm text-gray-500">
                          {PARTY_SHORT[contest.party] || contest.party}
                        </p>
                        <p className="text-lg font-bold mt-1" style={{ color }}>
                          {contest.votes.toLocaleString()} votes
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Constituencies */}
            {data.constituencies?.length > 0 && (
              <section>
                <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 mb-4 pb-2 border-b-2 border-red-600">
                  All Constituencies ({data.constituencies.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {data.constituencies.map((c, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedConstituency({
                          province: c.province,
                          district: c.district,
                          districtName: c.district_name,
                          constituency: c.constituency,
                        })
                      }
                      className="text-left px-3 py-2 text-sm border border-gray-200 rounded hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-gray-900">
                        {(c.district_name || c.district).replace(/([a-z])([A-Z])/g, '$1 $2')}-
                        {c.constituency}
                      </span>
                      <span className="block text-xs text-gray-400">Province {c.province}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Provincial Results */}
            {data.provincial_results && Object.keys(data.provincial_results).length > 0 && (
              <section>
                <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 mb-4 pb-2 border-b-2 border-red-600">
                  Results by Province
                </h2>
                <div className="space-y-3">
                  {Object.entries(data.provincial_results).map(([name, parties]) => (
                    <ProvinceSection
                      key={name}
                      name={name}
                      parties={parties}
                      totalSeats={data.total_seats}
                      expanded={expandedProvinces[name]}
                      onToggle={() => toggleProvince(name)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Source */}
            <div className="text-center py-6 border-t border-gray-200 text-xs text-gray-400">
              Data sourced from {data.source_label || 'Kantipur Election Tracker (ECN data)'} ·
              Auto-refreshes every 30 seconds ·{' '}
              <a
                href="https://result.election.gov.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-600"
              >
                Official ECN Results
              </a>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Unable to load results. Please try again.</p>
        )}
      </main>
      <Footer />

      {/* Constituency Detail Modal */}
      {selectedConstituency && (
        <ConstituencyDetail
          province={selectedConstituency.province}
          district={selectedConstituency.district}
          districtName={selectedConstituency.districtName}
          constituency={selectedConstituency.constituency}
          onClose={() => setSelectedConstituency(null)}
        />
      )}
    </div>
  );
}
