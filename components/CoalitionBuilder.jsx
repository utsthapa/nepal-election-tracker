import { useMemo, useState } from 'react';
import { Users, Target, RotateCcw } from 'lucide-react';
import { PARTIES } from '../data/constituencies';
import { MAJORITY_THRESHOLD, TOTAL_SEATS } from '../utils/calculations';

function formatPartyLabel(partyId) {
  const info = PARTIES[partyId];
  return info ? `${info.short} (${info.name})` : partyId;
}

export function CoalitionBuilder({ totalSeats, fptpResults }) {
  const [selectedParties, setSelectedParties] = useState([]);
  const partyPool = useMemo(() => {
    return Object.keys(PARTIES).sort((a, b) => (totalSeats[b] || 0) - (totalSeats[a] || 0));
  }, [totalSeats]);

  const handleToggle = (party) => {
    setSelectedParties((current) => {
      const isSelected = current.includes(party);

      if (isSelected) {
        return current.filter((p) => p !== party);
      }
      if (current.length >= 4) return current;
      return [...current, party];
    });
  };

  const handleClearAll = () => {
    setSelectedParties([]);
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

  const progressPercent = Math.min((coalitionTotals.combinedSeats / TOTAL_SEATS) * 100, 100);
  const majorityMarker = (MAJORITY_THRESHOLD / TOTAL_SEATS) * 100;

  return (
    <div className="bg-surface border border-neutral rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-gray-500">Coalition Builder</p>
          <h2 className="text-xl font-semibold text-white">Pick a bloc, see their path</h2>
          <p className="text-sm text-gray-400 mt-1">
            Select 2-4 parties to stack their FPTP and PR totals and see if they cross {MAJORITY_THRESHOLD}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-neutral bg-neutral/60 px-4 py-2">
            <Users className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-200 font-semibold">{selectedParties.length} parties</span>
          </div>
          {selectedParties.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-xl border border-neutral bg-neutral/40 px-3 py-2 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Party chooser */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {partyPool.map((party) => {
          const isSelected = selectedParties.includes(party);
          const maxReached = selectedParties.length >= 4;
          const lockout = maxReached && !isSelected;
          const partyColor = PARTIES[party]?.color || '#94a3b8';
          const seats = totalSeats[party] || 0;
          return (
            <button
              key={party}
              type="button"
              onClick={() => handleToggle(party)}
              disabled={lockout}
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
              <span className={`text-xs font-mono ${lockout ? 'text-gray-600' : 'text-gray-400'}`}>{seats} seats</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500 font-mono">
        Pick up to 4 parties (ordered by seats). {selectedParties.length >= 4 ? 'Max reached.' : selectedParties.length === 0 ? 'Tap to select.' : 'Tap to add/remove.'}
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
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
    </div>
  );
}

export default CoalitionBuilder;
