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

  // Calculate possible coalitions
  const coalitions = [];
  if (!hasMajority && sortedParties.length >= 2) {
    // Try two-party coalitions
    for (let i = 0; i < sortedParties.length; i++) {
      for (let j = i + 1; j < sortedParties.length; j++) {
        const combined = sortedParties[i][1] + sortedParties[j][1];
        if (combined >= MAJORITY) {
          coalitions.push({
            parties: [sortedParties[i][0], sortedParties[j][0]],
            seats: combined,
          });
        }
      }
    }
  }

  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-outfit font-semibold text-white">
          Path to Majority
        </h2>
        <div className="flex items-center gap-2">
          <Target className={`w-4 h-4 ${hasMajority ? 'text-green-400' : 'text-gray-400'}`} />
          <span className="text-sm font-mono text-gray-400">
            {MAJORITY} needed
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4 font-mono">
        Total: {TOTAL_SEATS} seats (165 FPTP + 110 PR)
      </p>

      {/* Main Progress Bar */}
      <div className="relative h-8 bg-neutral rounded-lg overflow-hidden mb-2">
        {/* Party segments */}
        <div className="absolute inset-0 flex">
          {sortedParties.map(([party, seats], index) => {
            const percentage = (seats / TOTAL_SEATS) * 100;
            return (
              <motion.div
                key={party}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${bgColors[party]} flex items-center justify-center`}
                style={{
                  backgroundColor: partyColors[party],
                  minWidth: seats > 0 ? '1.5rem' : 0,
                }}
              >
                {percentage > 5 && (
                  <span className="text-white text-xs font-bold font-mono">
                    {seats}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Majority line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
          style={{ left: `${(MAJORITY / TOTAL_SEATS) * 100}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-neutral rounded px-2 py-0.5">
            <span className="text-xs font-mono text-white">{MAJORITY}</span>
          </div>
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
              <p className="text-xs text-gray-400">
                {leadingSeats} seats ({leadingSeats - MAJORITY} above threshold)
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-400">Hung Parliament</p>
              <p className="text-xs text-gray-400">
                {leadingParty} leads with {leadingSeats} seats, needs {seatsToMajority} more
              </p>
            </div>
          </>
        )}
      </div>

      {/* Coalition Possibilities */}
      {!hasMajority && coalitions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Possible Coalitions
          </h4>
          <div className="space-y-2">
            {coalitions.slice(0, 3).map((coalition, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-neutral/20"
              >
                <div className="flex items-center gap-2">
                  {coalition.parties.map((party, i) => (
                    <span key={party} className="flex items-center gap-1">
                      {i > 0 && <span className="text-gray-500">+</span>}
                      <div className={`w-2 h-2 rounded-full ${bgColors[party]}`} />
                      <span className={`text-sm ${textColors[party]}`}>{party}</span>
                    </span>
                  ))}
                </div>
                <span className="font-mono text-sm text-gray-300">
                  {coalition.seats} seats
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
