import { motion } from 'framer-motion';
import { Target, AlertTriangle, Check } from 'lucide-react';
import { PARTIES } from '../data/constituencies';

const TOTAL_SEATS = 275;
const MAJORITY = 138;

export function MajorityBar({ totalSeats, leadingParty }) {
  // Dynamic party colors
  const partyColors = {};
  const bgColors = {};
  const textColors = {};
  Object.keys(totalSeats).forEach(p => {
    partyColors[p] = PARTIES[p]?.color || '#6b7280';
    bgColors[p] = `bg-${p.toLowerCase()}`;
    textColors[p] = `text-${p.toLowerCase()}`;
  });

  // Sort parties by total seats
  const sortedParties = Object.entries(totalSeats)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, seats]) => seats > 0);

  const leadingSeats = totalSeats[leadingParty] || 0;
  const hasMajority = leadingSeats >= MAJORITY;
  const seatsToMajority = MAJORITY - leadingSeats;
  const majorityPosition = (MAJORITY / TOTAL_SEATS) * 100;

  // Calculate possible coalitions (favor fewer parties and minimal surplus)
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
  if (!hasMajority && coalitionCandidates.length >= 2) {
    const maxSize = Math.min(6, coalitionCandidates.length);
    for (let size = 2; size <= maxSize; size++) {
      const combos = generateCombinations(coalitionCandidates, size);
      combos.forEach((combo) => {
        const seats = combo.reduce((sum, [, seatCount]) => sum + seatCount, 0);
        if (seats >= MAJORITY) {
          winningCombos.push({
            parties: combo.map(([id]) => id),
            seats,
            size,
            surplus: seats - MAJORITY,
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

  const minimalCoalitionSize = winningCombos[0]?.size ?? null;
  const coalitionPaths = winningCombos.slice(0, Math.min(4, winningCombos.length));

  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-sans font-semibold text-white">
          Path to Majority
        </h2>
        <div className="flex items-center gap-2">
          <Target className={`w-4 h-4 ${hasMajority ? 'text-green-400' : 'text-gray-700'}`} />
          <span className="text-sm font-mono text-gray-700">
            {MAJORITY} needed
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-800 mb-4 font-mono">
        Total: {TOTAL_SEATS} seats (165 FPTP + 110 PR)
      </p>

      {/* Main Progress Bar */}
      <div className="relative mt-8 mb-2">
        {/* Majority line label - positioned above the bar */}
        <div
          className="absolute -top-6 z-30 pointer-events-none"
          style={{ left: `${majorityPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="bg-surface border border-neutral rounded px-2 py-0.5 whitespace-nowrap">
            <span className="text-xs font-mono text-white">{MAJORITY}</span>
          </div>
        </div>

        <div className="relative h-8 bg-neutral rounded-lg overflow-hidden">
          {/* Party segments - use absolute positioning for accurate widths */}
          {(() => {
            let cumulativePercent = 0;
            return sortedParties.map(([party, seats], index) => {
              const percentage = (seats / TOTAL_SEATS) * 100;
              const leftPosition = cumulativePercent;
              cumulativePercent += percentage;
              return (
                <motion.div
                  key={party}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="absolute inset-y-0 flex items-center justify-center z-0"
                  style={{
                    backgroundColor: partyColors[party],
                    left: `${leftPosition}%`,
                  }}
                >
                  {percentage > 5 && (
                    <span className="text-white text-xs font-bold font-mono">
                      {seats}
                    </span>
                  )}
                </motion.div>
              );
            });
          })()}

          {/* Majority line indicator inside the bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none"
            style={{ left: `${majorityPosition}%`, transform: 'translateX(-50%)' }}
          />
        </div>
      </div>

      {/* Status Message */}
      <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-neutral/30">
        {hasMajority ? (
          <>
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <p className={`font-medium ${textColors[leadingParty]}`}>
                {leadingParty} has majority!
              </p>
              <p className="text-xs text-gray-700">
                {leadingSeats} seats ({leadingSeats - MAJORITY} above threshold)
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-400">Hung Parliament</p>
              <p className="text-xs text-gray-700">
                {leadingParty} leads with {leadingSeats} seats, needs {seatsToMajority} more
              </p>
            </div>
          </>
        )}
      </div>

      {/* Coalition Possibilities */}
      {!hasMajority && coalitionPaths.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Top routes to 138 (starts at {minimalCoalitionSize || 2}-party blocs)
          </h4>
          <div className="space-y-2">
            {coalitionPaths.map((coalition, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-neutral/20"
              >
                <div className="flex items-center gap-2">
                  {coalition.parties.map((party, i) => (
                    <span key={party} className="flex items-center gap-1">
                      {i > 0 && <span className="text-gray-800">+</span>}
                      <div className={`w-2 h-2 rounded-full ${bgColors[party]}`} />
                      <span className={`text-sm ${textColors[party]}`}>{party}</span>
                    </span>
                  ))}
                </div>
                <span className="font-mono text-sm text-gray-700">
                  {coalition.seats} seats · +{coalition.surplus} over 138
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MajorityBar;
