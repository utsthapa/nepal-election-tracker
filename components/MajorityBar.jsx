import { AlertTriangle, Check, Sparkles } from 'lucide-react';
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

  // Coalition search prioritizing the fewest parties that can clear majority (search 2-6 party combos)
  const coalitionCandidates = sortedParties.slice(0, 8);
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

  const winningCombos = [];
  let minimalCoalitionSize = null;
  if (!hasMajority && coalitionCandidates.length >= 2) {
    const maxSize = Math.min(6, coalitionCandidates.length);
    for (let size = 2; size <= maxSize; size++) {
      const combos = generateCombinations(coalitionCandidates, size);
      combos.forEach((combo) => {
        const seats = combo.reduce((sum, [, seatCount]) => sum + seatCount, 0);
        if (seats >= MAJORITY) {
          winningCombos.push({
            seats,
            size,
            surplus: seats - MAJORITY,
            parties: combo.map(([id]) => id),
          });
        }
      });
    }
  }

  winningCombos.sort((a, b) => {
    if (a.size !== b.size) return a.size - b.size;
    if (a.surplus !== b.surplus) return a.surplus - b.surplus;
    return b.seats - a.seats;
  });
  minimalCoalitionSize = winningCombos[0]?.size ?? null;

  const coalitionCount = winningCombos.length;
  const coalitionPaths = winningCombos.slice(0, Math.min(3, winningCombos.length));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral bg-surface p-6">
      <div className="relative space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted">
              <Sparkles className="h-4 w-4 text-amber-200" />
              <span>Path to Majority</span>
            </div>
            <p className="mt-1 text-xs font-mono text-muted">
              {TOTAL_SEATS} seats total · {MAJORITY} needed to govern
            </p>
          </div>
          <div className={`flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 ${hasMajority ? 'bg-green-500/10 text-green-200' : 'bg-amber-500/10 text-amber-200'}`}>
            {hasMajority ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span className="text-sm font-semibold">
              {hasMajority ? 'Stable majority' : 'Hung parliament'}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">Leading</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColors[leadingParty] }} />
              <p className="text-lg font-bold text-foreground">{leadingSeats}</p>
            </div>
            <p className="text-xs font-mono text-muted">{formatPartyLabel(leadingParty)}</p>
          </div>
          <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">Seat gap</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {hasMajority ? `+${leadingSeats - MAJORITY}` : seatsToMajority}
            </p>
            <p className="text-xs font-mono text-muted">
              {hasMajority ? 'above 138' : 'to reach 138'}
            </p>
          </div>
          <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">Lead</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {runnerUpSeats ? `${leadGap}` : '—'}
            </p>
            <p className="text-xs font-mono text-muted">
              {runnerUpSeats ? `vs ${formatPartyLabel(runnerUpId)}` : 'waiting'}
            </p>
          </div>
          <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">Coalitions</p>
            <p className="mt-1 text-lg font-bold text-foreground">
              {!hasMajority ? coalitionCount : '—'}
            </p>
            <p className="text-xs font-mono text-muted">
              {!hasMajority ? 'viable paths' : 'not needed'}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted">Top parties</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {topParties.map(([party, seats]) => (
              <span
                key={party}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColors[party] }} />
                <span className="font-semibold text-foreground">{formatPartyLabel(party)}</span>
                <span className="text-xs font-mono text-muted">{seats}</span>
              </span>
            ))}
          </div>
        </div>

        {!hasMajority && coalitionCount > 0 && (
          <div className="rounded-lg border border-neutral/60 bg-neutral/30 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">Top coalition paths</p>
            <div className="mt-2 space-y-2">
              {coalitionPaths.map((coalition, index) => (
                <div
                  key={`${coalition.parties.join('-')}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {coalition.parties.map((party) => (
                      <span
                        key={party}
                        className="inline-flex items-center gap-1.5 rounded-full bg-neutral/60 px-2 py-1 text-xs"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: partyColors[party] }} />
                        <span className="font-semibold text-foreground">{PARTIES[party]?.short || party}</span>
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground font-mono">{coalition.seats}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasMajority && coalitionCount === 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-3 text-amber-100">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <p className="text-sm">No coalition clears 138 yet. Increase the leading party or add more parties.</p>
          </div>
        )}

        {hasMajority && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-3 text-green-200">
            <Check className="h-4 w-4" />
            <p className="text-sm">{formatPartyLabel(leadingParty)} governs alone with a {leadingSeats - MAJORITY} seat buffer.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MajorityBar;
