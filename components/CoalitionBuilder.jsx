import { useMemo, useState } from 'react';
import { Users, Target, MapPin, ArrowRight, ShieldHalf } from 'lucide-react';
import { PARTIES } from '../data/constituencies';
import { MAJORITY_THRESHOLD, TOTAL_SEATS } from '../utils/calculations';

const PARTY_POOL = Object.keys(PARTIES);

function formatPartyLabel(partyId) {
  const info = PARTIES[partyId];
  return info ? `${info.short} (${info.name})` : partyId;
}

export function CoalitionBuilder({ totalSeats, fptpResults }) {
  const [selectedParties, setSelectedParties] = useState(['NC', 'UML', 'Maoist']);

  const handleToggle = (party) => {
    setSelectedParties((current) => {
      const isSelected = current.includes(party);

      // Enforce 2-4 party window
      if (isSelected) {
        if (current.length <= 2) return current;
        return current.filter((p) => p !== party);
      }
      if (current.length >= 4) return current;
      return [...current, party];
    });
  };

  const coalitionTotals = useMemo(() => {
    const combinedSeats = selectedParties.reduce((sum, party) => sum + (totalSeats[party] || 0), 0);

    let fptp = 0;
    Object.values(fptpResults).forEach((result) => {
      if (selectedParties.includes(result.winner)) {
        fptp += 1;
      }
    });

    const pr = combinedSeats - fptp;
    const seatsNeeded = Math.max(0, MAJORITY_THRESHOLD - combinedSeats);

    return { combinedSeats, fptp, pr, seatsNeeded };
  }, [selectedParties, totalSeats, fptpResults]);

  const targetSeats = useMemo(() => {
    const targets = [];

    Object.values(fptpResults).forEach((result) => {
      const adjusted = result.adjusted || {};
      const coalitionShare = selectedParties.reduce((sum, party) => sum + (adjusted[party] || 0), 0);
      const sortedShares = Object.entries(adjusted).sort((a, b) => b[1] - a[1]);
      const leaderParty = sortedShares[0]?.[0];
      const leaderShare = sortedShares[0]?.[1] || 0;

      const coalitionHoldingSeat = selectedParties.includes(leaderParty);
      if (coalitionHoldingSeat) return;

      const marginToFlip = Math.max(0, leaderShare - coalitionShare);

      targets.push({
        id: result.id,
        name: result.name,
        province: result.province,
        district: result.district,
        currentWinner: result.winner,
        leaderShare,
        coalitionShare,
        marginToFlip,
      });
    });

    targets.sort((a, b) => a.marginToFlip - b.marginToFlip);
    return targets;
  }, [selectedParties, fptpResults]);

  const shortlist = useMemo(() => {
    if (targetSeats.length === 0) return [];
    const count = coalitionTotals.seatsNeeded > 0
      ? Math.max(6, coalitionTotals.seatsNeeded)
      : 6;
    return targetSeats.slice(0, count);
  }, [targetSeats, coalitionTotals.seatsNeeded]);

  const progressPercent = Math.min((coalitionTotals.combinedSeats / TOTAL_SEATS) * 100, 100);
  const majorityMarker = (MAJORITY_THRESHOLD / TOTAL_SEATS) * 100;

  return (
    <div className="bg-surface border border-neutral rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-gray-500">Coalition Builder</p>
          <h2 className="text-xl font-semibold text-white">Pick a bloc, see their path</h2>
          <p className="text-sm text-gray-400 mt-1">
            Select 2–4 parties to stack their FPTP and PR totals, then target close constituencies to cross {MAJORITY_THRESHOLD}.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-neutral bg-neutral/60 px-4 py-2">
          <Users className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-gray-200 font-semibold">{selectedParties.length} parties</span>
        </div>
      </div>

      {/* Party chooser */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {PARTY_POOL.map((party) => {
          const isSelected = selectedParties.includes(party);
          const partyColor = PARTIES[party]?.color || '#94a3b8';
          const seats = totalSeats[party] || 0;
          return (
            <button
              key={party}
              type="button"
              onClick={() => handleToggle(party)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-all ${
                isSelected
                  ? 'bg-white/10 border-white/30 shadow-lg'
                  : 'bg-neutral/40 border-neutral hover:border-neutral/80'
              }`}
              style={{ boxShadow: isSelected ? `0 12px 35px -18px ${partyColor}` : undefined }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: partyColor }} />
                <span className="text-sm text-gray-100 font-semibold">{PARTIES[party]?.short || party}</span>
              </div>
              <span className="text-xs font-mono text-gray-400">{seats} seats</span>
            </button>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Combined seats</p>
          <p className="text-2xl font-bold text-white mt-1">{coalitionTotals.combinedSeats}</p>
          <p className="text-xs font-mono text-gray-400">Across FPTP + PR</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-amber-200">To majority</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-amber-100">
              {coalitionTotals.seatsNeeded === 0 ? 'Locked' : coalitionTotals.seatsNeeded}
            </p>
            <Target className="w-4 h-4 text-amber-200" />
          </div>
          <p className="text-xs font-mono text-amber-100/80">
            {coalitionTotals.seatsNeeded === 0 ? 'Clears 138' : 'Seats to reach 138'}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">FPTP vs PR</p>
          <p className="text-2xl font-bold text-white mt-1">
            {coalitionTotals.fptp} / {Math.max(coalitionTotals.pr, 0)}
          </p>
          <p className="text-xs font-mono text-gray-400">Constituency / List seats</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Targets nearby</p>
          <p className="text-2xl font-bold text-white mt-1">{targetSeats.length}</p>
          <p className="text-xs font-mono text-gray-400">Seats within reach</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
          <span>0</span>
          <span>{MAJORITY_THRESHOLD} needed</span>
          <span>{TOTAL_SEATS}</span>
        </div>
        <div className="relative h-4 rounded-full border border-white/10 bg-neutral overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-blue-400"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-white/80"
            style={{ left: `${majorityMarker}%` }}
          />
        </div>
      </div>

      {/* Target constituencies */}
      <div className="mt-6 rounded-xl border border-neutral bg-neutral/40">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral">
          <div className="flex items-center gap-2">
            <ShieldHalf className="w-4 h-4 text-gray-300" />
            <div>
              <p className="text-sm font-semibold text-white">Target constituencies</p>
              <p className="text-xs text-gray-400">Closest seats the bloc does not hold</p>
            </div>
          </div>
          <span className="text-xs font-mono text-gray-400">
            Showing top {shortlist.length || 0} of {targetSeats.length}
          </span>
        </div>

        {shortlist.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-400">
            No near-miss seats right now. Try deselecting or adjusting sliders.
          </div>
        ) : (
          <div className="divide-y divide-neutral">
            {shortlist.map((seat, index) => {
              const currentWinnerColor = PARTIES[seat.currentWinner]?.color || '#94a3b8';
              const isPriority = coalitionTotals.seatsNeeded > 0 && index < coalitionTotals.seatsNeeded;
              const gapPercent = (seat.marginToFlip * 100).toFixed(1);
              return (
                <div
                  key={seat.id}
                  className={`px-4 py-3 flex items-center justify-between ${isPriority ? 'bg-emerald-500/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: currentWinnerColor }} />
                      <p className="text-sm font-semibold text-white">{seat.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>Province {seat.province}</span>
                    </div>
                    {isPriority && (
                      <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Priority pick
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-400 font-mono text-right">
                      <div>Bloc: {(seat.coalitionShare * 100).toFixed(1)}%</div>
                      <div>Leader: {(seat.leaderShare * 100).toFixed(1)}%</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-white">
                      <span className="text-xs text-gray-400">Gap</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className={gapPercent <= 3 ? 'text-amber-200' : 'text-gray-100'}>
                        {gapPercent}% pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoalitionBuilder;
