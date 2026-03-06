'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_SEATS = 275;
const FPTP_SEATS = 165;
const PR_SEATS = 110;
const MAJORITY = 138;
const POLL_INTERVAL_MS = 30_000; // 30 seconds

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kathmandu',
    });
  } catch {
    return '—';
  }
}

function secsAgo(isoString) {
  if (!isoString) return null;
  const diff = Math.round((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Blinking "LIVE" badge */
function LiveBadge({ status }) {
  const isLive = status === 'live';
  if (!isLive) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-widest">
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
      Live
    </span>
  );
}

/** Seat meter — the signature bar like NYT election night */
function SeatMeter({ parties }) {
  const totalAllocated = parties.reduce((s, p) => s + p.total, 0);
  const scale = totalAllocated > 0 ? TOTAL_SEATS / Math.max(totalAllocated, TOTAL_SEATS) : 1;

  const majorityPct = (MAJORITY / TOTAL_SEATS) * 100;

  return (
    <div className="rounded-2xl border border-[rgb(219,211,196)] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2
            className="text-base font-bold text-[rgb(24,26,36)]"
            style={{ fontFamily: 'Lora, serif' }}
          >
            House of Representatives — Seat Count
          </h2>
          <p className="mt-0.5 font-mono text-xs text-[rgb(100,110,130)]">
            {TOTAL_SEATS} total · {MAJORITY} needed for majority
          </p>
        </div>
        <div className="text-right font-mono text-xs text-[rgb(100,110,130)]">
          <div>{FPTP_SEATS} FPTP + {PR_SEATS} PR seats</div>
        </div>
      </div>

      {/* The bar */}
      <div className="relative">
        {/* Majority line */}
        <div
          className="absolute top-0 bottom-0 z-10 w-0.5 bg-[rgb(24,26,36)]"
          style={{ left: `${majorityPct}%` }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[rgb(24,26,36)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
            {MAJORITY}
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-[rgb(100,110,130)]">
            majority
          </div>
        </div>

        {/* Stacked bar */}
        <div className="mt-5 flex h-10 overflow-hidden rounded-lg border border-[rgb(219,211,196)] bg-[rgb(250,249,246)]">
          {parties
            .filter(p => p.total > 0)
            .map(p => {
              const widthPct = (p.total / TOTAL_SEATS) * 100;
              return (
                <div
                  key={p.key}
                  className="relative h-full flex-shrink-0 overflow-hidden transition-all duration-700"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: p.color,
                  }}
                  title={`${p.name}: ${p.total} seats`}
                />
              );
            })}
        </div>

        {/* Seat labels under bar */}
        <div className="mb-2 mt-7 flex flex-wrap items-center gap-3">
          {parties
            .filter(p => p.total > 0)
            .map(p => (
              <div key={p.key} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="font-mono text-xs font-semibold text-[rgb(24,26,36)]">
                  {p.shortName}
                </span>
                <span className="font-mono text-xs text-[rgb(100,110,130)]">{p.total}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/** Progress indicator */
function ProgressBar({ progress }) {
  const pct = progress?.percentReported ?? 0;
  const reported = progress?.reportedConstituencies ?? 0;
  const total = progress?.totalConstituencies ?? 165;
  const decided = progress?.seatsDecided ?? 0;

  return (
    <div className="rounded-xl border border-[rgb(219,211,196)] bg-white px-5 py-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[rgb(100,110,130)]">
          Counting Progress
        </span>
        <span className="font-mono text-xs font-bold text-[rgb(24,26,36)]">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[rgb(219,211,196)]/40">
        <div
          className="h-full rounded-full bg-[#B91C1C] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-[rgb(100,110,130)]">
        <span>{reported} of {total} constituencies reporting</span>
        {decided > 0 && <span>{decided} seats decided</span>}
      </div>
    </div>
  );
}

/** Party results table */
function PartyTable({ parties, status }) {
  const isPreElection = status === 'pre-election';

  return (
    <div className="rounded-2xl border border-[rgb(219,211,196)] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[rgb(219,211,196)] px-5 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[rgb(24,26,36)]" style={{ fontFamily: 'Lora, serif' }}>
          Party Results
        </h2>
        {isPreElection && (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
            2022 baseline — live data not yet available
          </span>
        )}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 border-b border-[rgb(219,211,196)]/50 bg-[rgb(250,249,246)] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[rgb(100,110,130)]">
        <span>Party</span>
        <span className="text-right w-14">FPTP</span>
        <span className="text-right w-12">PR</span>
        <span className="text-right w-16">Leading</span>
        <span className="text-right w-16">Total</span>
      </div>

      {/* Party rows */}
      <div className="divide-y divide-[rgb(219,211,196)]/30">
        {parties.map((p, i) => {
          const isMajority = p.total >= MAJORITY;
          const rowBg = i === 0 ? 'bg-white' : 'bg-white';
          return (
            <div
              key={p.key}
              className={`grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-0 px-4 py-3 transition-colors hover:bg-[rgb(219,211,196)]/10 ${rowBg}`}
            >
              {/* Party name + bar */}
              <div className="flex min-w-0 items-center gap-3 pr-4">
                <span
                  className="h-4 w-1 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-sm text-[rgb(24,26,36)]">
                    {p.name}
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[rgb(219,211,196)]/40">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min((p.total / MAJORITY) * 100, 100)}%`,
                        backgroundColor: p.color,
                        opacity: 0.75,
                      }}
                    />
                  </div>
                </div>
                {isMajority && (
                  <span className="ml-2 flex-shrink-0 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    Majority
                  </span>
                )}
              </div>

              <span className="w-14 text-right font-mono text-sm text-[rgb(24,26,36)]">
                {p.fptp || '—'}
              </span>
              <span className="w-12 text-right font-mono text-sm text-[rgb(100,110,130)]">
                {p.pr || '—'}
              </span>
              <span className="w-16 text-right font-mono text-sm text-amber-600">
                {p.leading > 0 ? `+${p.leading}` : '—'}
              </span>
              <span className="w-16 text-right font-mono text-sm font-bold text-[rgb(24,26,36)]">
                {p.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Majority threshold row */}
      <div className="border-t border-[rgb(219,211,196)] bg-[rgb(250,249,246)] px-4 py-2 flex items-center justify-between font-mono text-xs text-[rgb(100,110,130)]">
        <span>Majority threshold: <strong className="text-[rgb(24,26,36)]">{MAJORITY} seats</strong></span>
        <span>Total: {TOTAL_SEATS} ({FPTP_SEATS} FPTP + {PR_SEATS} PR)</span>
      </div>
    </div>
  );
}

/** Coalition calculator */
function CoalitionPanel({ parties }) {
  const leader = parties[0];
  if (!leader || leader.total >= MAJORITY) return null;

  const seatsNeeded = MAJORITY - leader.total;
  const others = parties.slice(1);

  // Find smallest coalition that crosses majority
  const minCoalitions = [];
  for (let size = 1; size <= Math.min(4, others.length); size++) {
    // Greedy: take top N
    const top = others.slice(0, size);
    const combined = leader.total + top.reduce((s, p) => s + p.total, 0);
    if (combined >= MAJORITY) {
      minCoalitions.push({ parties: [leader, ...top], total: combined });
      break;
    }
  }

  return (
    <div className="rounded-2xl border border-[rgb(219,211,196)] bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-[rgb(24,26,36)]" style={{ fontFamily: 'Lora, serif' }}>
        Path to Majority
      </h3>
      <div className="mb-3 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
        <span className="font-mono text-2xl font-bold text-amber-700">{seatsNeeded}</span>
        <div>
          <div className="text-sm font-semibold text-amber-800">seats needed</div>
          <div className="font-mono text-xs text-amber-600">
            {leader.name} leads with {leader.total} seats
          </div>
        </div>
      </div>

      {minCoalitions.length > 0 ? (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[rgb(100,110,130)]">
            Smallest viable coalition
          </p>
          {minCoalitions.map((c, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-[rgb(219,211,196)] px-3 py-2"
            >
              {c.parties.map(p => (
                <span
                  key={p.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(219,211,196)] bg-[rgb(250,249,246)] px-2.5 py-1 text-xs font-semibold text-[rgb(24,26,36)]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.shortName}
                  <span className="font-mono text-[rgb(100,110,130)]">{p.total}</span>
                </span>
              ))}
              <span className="ml-auto font-mono text-sm font-bold text-green-700">
                = {c.total} seats
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[rgb(100,110,130)]">
          No coalition among top parties clears {MAJORITY} seats yet.
        </p>
      )}
    </div>
  );
}

/** Status / refresh control footer */
function StatusBar({ fetchedAt, status, polling, onRefresh, countdown }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgb(219,211,196)] bg-white px-5 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        {status === 'live' ? (
          <span className="flex items-center gap-1.5 text-green-600 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Results live from result.election.gov.np
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-600 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Showing 2022 baseline — election results not yet published
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-[rgb(100,110,130)]">
          Updated {secsAgo(fetchedAt)} (NST {formatTime(fetchedAt)})
        </span>
        {polling ? (
          <span className="font-mono text-xs text-[rgb(100,110,130)]">
            Next refresh in {countdown}s
          </span>
        ) : null}
        <button
          onClick={onRefresh}
          className="rounded-lg border border-[rgb(219,211,196)] bg-[rgb(250,249,246)] px-3 py-1.5 font-mono text-xs font-semibold text-[rgb(24,26,36)] hover:bg-[rgb(219,211,196)]/30 transition-colors"
        >
          Refresh now
        </button>
      </div>
    </div>
  );
}

/** Big number stat card */
function StatCard({ label, value, sub, color }) {
  return (
    <div className="rounded-xl border border-[rgb(219,211,196)] bg-white p-4 shadow-sm">
      <div className="font-mono text-[11px] uppercase tracking-wider text-[rgb(100,110,130)]">
        {label}
      </div>
      <div
        className="mt-1 font-mono text-3xl font-bold"
        style={{ color: color || 'rgb(24,26,36)' }}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 font-mono text-xs text-[rgb(100,110,130)]">{sub}</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveTracker({ initialData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(POLL_INTERVAL_MS / 1000);
  const countdownRef = useRef(null);
  const pollRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/live-results', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset and restart the countdown timer
  const resetCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(POLL_INTERVAL_MS / 1000);
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) return POLL_INTERVAL_MS / 1000;
        return c - 1;
      });
    }, 1000);
  }, []);

  // Set up polling
  useEffect(() => {
    resetCountdown();
    pollRef.current = setInterval(() => {
      fetchData();
      resetCountdown();
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchData, resetCountdown]);

  const handleManualRefresh = () => {
    clearInterval(pollRef.current);
    fetchData().then(() => {
      resetCountdown();
      pollRef.current = setInterval(() => {
        fetchData();
        resetCountdown();
      }, POLL_INTERVAL_MS);
    });
  };

  const parties = data?.parties ?? [];
  const progress = data?.progress;
  const status = data?.status ?? 'pre-election';
  const fetchedAt = data?.fetchedAt;
  const election = data?.election;

  const leader = parties[0];
  const runnerUp = parties[1];
  const totalDecided = parties.reduce((s, p) => s + p.fptp + p.pr, 0);

  return (
    <div className="min-h-screen bg-[rgb(250,249,246)]">
      {/* ── Page header ── */}
      <div className="border-b border-[rgb(219,211,196)] bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <LiveBadge status={status} />
                {loading && (
                  <span className="font-mono text-xs text-[rgb(100,110,130)]">Updating…</span>
                )}
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[rgb(24,26,36)]"
                style={{ fontFamily: 'Lora, serif' }}
              >
                Nepal Election Night
              </h1>
              <p className="mt-1 text-sm text-[rgb(100,110,130)]">
                {election?.name ?? 'House of Representatives Election 2082 BS'} ·{' '}
                <a
                  href="https://result.election.gov.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[rgb(24,26,36)] transition-colors"
                >
                  Official source: result.election.gov.np
                </a>
              </p>
            </div>

            <div className="text-right">
              <div className="font-mono text-xs text-[rgb(100,110,130)]">Election day</div>
              <div className="font-mono text-lg font-bold text-[rgb(24,26,36)]">
                2026 · BS 2082
              </div>
              <div className="mt-1 font-mono text-xs text-[rgb(100,110,130)]">
                {TOTAL_SEATS} seats · {MAJORITY} for majority
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 font-mono">
            Failed to load results: {error}. Showing last known data.
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Leading party"
            value={leader?.shortName ?? '—'}
            sub={leader ? `${leader.total} seats` : 'no data'}
            color={leader?.color}
          />
          <StatCard
            label="Runner-up"
            value={runnerUp?.shortName ?? '—'}
            sub={runnerUp ? `${runnerUp.total} seats` : 'no data'}
            color={runnerUp?.color}
          />
          <StatCard
            label="Majority at"
            value={MAJORITY}
            sub={
              leader
                ? leader.total >= MAJORITY
                  ? `${leader.shortName} has majority`
                  : `${leader.shortName} needs ${MAJORITY - leader.total} more`
                : `${MAJORITY} seats needed`
            }
            color="#B91C1C"
          />
          <StatCard
            label="Seats decided"
            value={totalDecided}
            sub={`of ${TOTAL_SEATS} total`}
          />
        </div>

        {/* ── Seat meter ── */}
        <SeatMeter parties={parties} />

        {/* ── Counting progress ── */}
        <ProgressBar progress={progress} />

        {/* ── Party table + coalition ── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <PartyTable parties={parties} status={status} />
          <CoalitionPanel parties={parties} />
        </div>

        {/* ── Source + refresh control ── */}
        <StatusBar
          fetchedAt={fetchedAt}
          status={status}
          polling
          onRefresh={handleManualRefresh}
          countdown={countdown}
        />

        {/* ── Methodology note ── */}
        <div className="rounded-xl border border-[rgb(219,211,196)] bg-white px-5 py-4 text-xs text-[rgb(100,110,130)] leading-relaxed">
          <strong className="font-semibold text-[rgb(24,26,36)]">About this tracker:</strong>{' '}
          Seat counts are fetched in real-time from the{' '}
          <a
            href="https://result.election.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[rgb(24,26,36)]"
          >
            Election Commission of Nepal's official results portal
          </a>{' '}
          every 30 seconds. FPTP seats are determined by simple plurality in 165 constituencies.
          PR seats are allocated via the Sainte-Laguë method among 110 proportional seats to
          parties crossing 3% threshold, adjusted for 33% female quota. The majority threshold
          is {MAJORITY} seats (more than half of {TOTAL_SEATS}).{' '}
          {status === 'pre-election'
            ? '2022 election results are shown as a baseline until live counting data is published.'
            : ''}
        </div>
      </div>
    </div>
  );
}
