import { motion } from 'framer-motion';
import { Target, AlertTriangle, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { PARTIES } from '../data/constituencies';

const TOTAL_SEATS = 275;
const MAJORITY = 138;

export function MajorityBar({ totalSeats, leadingParty }) {
  // Dynamic party colors for consistent accents
  const partyColors = {};
  const textColors = {};
  Object.keys(totalSeats).forEach(p => {
    partyColors[p] = PARTIES[p]?.color || '#6b7280';
    textColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  // Ordered parties by seat share
  const sortedParties = Object.entries(totalSeats)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, seats]) => seats > 0);

  const leadingSeats = leadingParty ? totalSeats[leadingParty] || 0 : 0;
  const runnerUpSeats = sortedParties[1]?.[1] || 0;
  const runnerUpId = sortedParties[1]?.[0];
  const leadGap = Math.max(leadingSeats - runnerUpSeats, 0);
  const hasMajority = leadingSeats >= MAJORITY;
  const seatsToMajority = Math.max(MAJORITY - leadingSeats, 0);
  const topParties = sortedParties.slice(0, 3);

  // Coalition search across 2-4 parties (limited to top 6 to avoid noise)
  const coalitionCandidates = sortedParties.slice(0, 6);
  const generateCombinations = (list, size, start = 0, path = [], results = []) => {
    if (path.length === size) {
      results.push([...path]);
      return results;
    }
    for (let i = start; i < list.length; i++) {
      path.push(list[i]);
      generateCombinations(list, size, i + 1, path, results);
      path.pop();
    }
    return results;
  };

  let coalitionCombos = [];
  if (!hasMajority && coalitionCandidates.length >= 2) {
    const maxSize = Math.min(4, coalitionCandidates.length);
    for (let size = 2; size <= maxSize; size++) {
      const combos = generateCombinations(coalitionCandidates, size);
      combos.forEach((combo) => {
        const seats = combo.reduce((sum, [, seatCount]) => sum + seatCount, 0);
        if (seats >= MAJORITY) {
          coalitionCombos.push({
            parties: combo.map(([id]) => id),
            seats,
            size,
          });
        }
      });
    }
  }

  coalitionCombos.sort((a, b) => {
    if (b.seats !== a.seats) return b.seats - a.seats;
    return a.size - b.size;
  });

  const coalitionCount = coalitionCombos.length;
  const coalitionPaths = coalitionCombos.slice(0, 6);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral bg-surface p-6">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(239,68,68,0.12),transparent_36%)]" />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-gray-500">
              <Sparkles className="h-4 w-4 text-amber-200" />
              <span>Path to Majority</span>
            </div>
            <p className="mt-1 text-xs font-mono text-gray-400">
              {TOTAL_SEATS} seats total · {MAJORITY} needed to govern
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 ${hasMajority ? 'bg-green-500/10 text-green-200' : 'bg-amber-500/10 text-amber-200'}`}>
              {hasMajority ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <span className="text-sm font-semibold">
                {hasMajority ? 'Stable majority' : 'Hung parliament'}
              </span>
            </div>
            {leadingParty && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColors[leadingParty] }} />
                <span className="text-sm font-semibold text-white">{formatPartyLabel(leadingParty)}</span>
                <span className="text-xs font-mono text-gray-400">{leadingSeats} seats</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-neutral/70 bg-neutral/40 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>0</span>
                <span className="flex items-center gap-2 text-white/70">
                  <Target className="h-3.5 w-3.5 text-amber-200" />
                  {MAJORITY} threshold
                </span>
                <span>{TOTAL_SEATS}</span>
              </div>
              <div className="relative mt-3 h-16 overflow-hidden rounded-full border border-white/5 bg-gradient-to-r from-white/5 via-white/0 to-white/5">
                <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_12%,rgba(255,255,255,0.08)_12%,rgba(255,255,255,0.08)_13%)]" />
                <div className="absolute inset-0 flex">
                  {sortedParties.map(([party, seats], index) => {
                    const percentage = (seats / TOTAL_SEATS) * 100;
                    return (
                      <motion.div
                        key={party}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: index * 0.08 }}
                        className="relative flex items-center justify-center"
                        style={{
                          backgroundColor: partyColors[party],
                          minWidth: seats > 0 ? '1.5rem' : 0,
                        }}
                      >
                        {percentage > 6 && (
                          <span className="text-xs font-bold text-white drop-shadow-sm">
                            {seats}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div
                  className="absolute inset-y-0 w-0.5 bg-white/80"
                  style={{ left: `${(MAJORITY / TOTAL_SEATS) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-neutral px-3 py-1 text-[11px] font-mono text-gray-100 shadow-lg">
                    Majority line
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 rounded-[4px] bg-white/80 shadow-lg" />
                </div>
              </div>
            </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Seat gap</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {hasMajority ? `+${leadingSeats - MAJORITY}` : seatsToMajority}
                  </p>
                <p className="text-xs font-mono text-gray-400">
                  {hasMajority ? 'above the 138 line' : 'needed to cross 138'}
                </p>
              </div>
                <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Lead</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {runnerUpSeats ? `${leadGap} seats` : '—'}
                  </p>
                  <p className="text-xs font-mono text-gray-400">
                    {runnerUpSeats
                    ? `${formatPartyLabel(leadingParty)} vs ${formatPartyLabel(runnerUpId)}`
                    : 'waiting for totals'}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Coalition paths</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {!hasMajority ? coalitionCount || 0 : 'N/A'}
                  </p>
                  <p className="text-xs font-mono text-gray-400">
                    {!hasMajority ? '2-4 party paths clearing 138' : 'not required with a majority'}
                  </p>
                </div>
              </div>

            <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Top parties</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {topParties.map(([party, seats]) => (
                  <span
                    key={party}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColors[party] }} />
                    <span className={`font-semibold ${textColors[party] || 'text-white'}`}>{formatPartyLabel(party)}</span>
                    <span className="text-xs font-mono text-gray-400">{seats} seats</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-xl border border-neutral/70 bg-neutral/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Coalition pathways</p>
                  <p className="text-xs font-mono text-gray-500">
                    {!hasMajority
                      ? coalitionCount
                        ? 'Closest 2-4 party routes to 138'
                        : 'No coalition clears the line yet'
                      : 'Single-party control in play'}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-500" />
              </div>

              {hasMajority ? (
                <div className="mt-4 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-3">
                  <div className="flex items-center gap-2 text-sm text-green-200">
                    <Check className="h-4 w-4" />
                    <span>{formatPartyLabel(leadingParty)} governs alone.</span>
                  </div>
                  <p className="mt-1 text-xs font-mono text-green-100/80">
                    Buffer of {leadingSeats - MAJORITY} seats over the threshold.
                  </p>
                </div>
              ) : coalitionCount ? (
                <div className="mt-4 space-y-3">
                  {coalitionPaths.map((coalition, index) => (
                    <div
                      key={`${coalition.parties.join('-')}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all hover:border-white/10 hover:bg-white/10"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {coalition.parties.map((party) => (
                          <div key={party} className="flex items-center gap-2 rounded-full bg-neutral/60 px-2 py-1">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColors[party] }} />
                            <span className={`text-xs font-semibold ${textColors[party] || 'text-white'}`}>
                              {formatPartyLabel(party)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white font-mono">{coalition.seats} seats</p>
                        <p className="text-[11px] font-mono text-gray-400">
                          {coalition.size}-party bloc · +{coalition.seats - MAJORITY} above majority
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-3 text-amber-100">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-semibold">No 2-4 party path clears 138 yet.</p>
                  <p className="text-xs font-mono text-amber-100/80">
                    Increase the front-runner or add more parties to reach the threshold.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MajorityBar;
