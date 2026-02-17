import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { PARTIES, INITIAL_NATIONAL } from '../data/constituencies';

const partyOrder = Object.keys(INITIAL_NATIONAL);

export function PRBlockChart({ prSeats, nationalVoteShares = {}, threshold = 3, method = 'modified' }) {
  const totalSeats = useMemo(() =>
    Object.values(prSeats).reduce((a, b) => a + b, 0),
    [prSeats]
  );

  const methodLabel = method === 'dhondt'
    ? "D'Hondt (1,2,3 divisors)"
    : 'Sainte-Laguë (1,3,5,7...)';

  // Dynamic color classes
  const bgColors = {};
  const textColors = {};
  Object.keys(PARTIES).forEach(p => {
    bgColors[p] = `bg-${p.toLowerCase()}`;
    textColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  // Memoize party sorting calculation
  const sortedParties = useMemo(() =>
    [...partyOrder].sort((a, b) => (prSeats[b] || 0) - (prSeats[a] || 0)),
    [prSeats]
  );

  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-sans font-semibold text-foreground">
          PR Allocation
        </h2>
        <span className="text-sm font-mono text-muted">
          {totalSeats} / 110 seats
        </span>
      </div>
      <p className="text-xs text-muted mb-4 font-mono">
        {methodLabel} • {threshold}% threshold (failed votes redistributed)
      </p>

      {/* Stacked Bar */}
      <div className="relative h-12 bg-neutral rounded-lg overflow-hidden mb-4">
        <div className="absolute inset-0 flex">
          {sortedParties.map((party, index) => {
            const seats = prSeats[party] || 0;
            const percentage = totalSeats > 0 ? (seats / 110) * 100 : 0;

            if (seats === 0) {return null;}

            return (
              <motion.div
                key={party}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${bgColors[party]} flex items-center justify-center relative group`}
                style={{ minWidth: seats > 0 ? '2rem' : 0 }}
              >
                {seats >= 5 && (
                  <span className="text-foreground text-sm font-bold font-mono">
                    {seats}
                  </span>
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface border border-neutral rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <span className="text-xs text-foreground">{PARTIES[party].name}: {seats}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Party Breakdown */}
      <div className="space-y-2">
        {partyOrder.map(party => {
          const seats = prSeats[party] || 0;
          const voteShare = (nationalVoteShares[party] || 0) * 100;
          const meetsThreshold = voteShare >= threshold;

          return (
            <div
              key={party}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                meetsThreshold ? 'bg-neutral/30' : 'bg-neutral/10 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${bgColors[party]}`} />
                <span className="text-sm text-foreground">{formatPartyLabel(party)}</span>
                {!meetsThreshold && (
                  <span className="text-xs text-red-400">(below {threshold}%)</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted">
                  {voteShare.toFixed(2)}% votes
                </span>
                <motion.span
                  key={seats}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className={`font-mono font-bold ${textColors[party]}`}
                >
                  {seats}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Threshold Indicator */}
      <div className="mt-4 pt-4 border-t border-neutral">
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Parties below {threshold}% threshold receive 0 PR seats</span>
        </div>
      </div>
    </div>
  );
}

export default PRBlockChart;
