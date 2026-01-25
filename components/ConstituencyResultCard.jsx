import { Trophy, TrendingUp, Users } from 'lucide-react';
import { PARTIES } from '../data/constituencies';

export function ConstituencyResultCard({ constituency, coalitionParties = [] }) {
  const { name, winner2022, margin, results2022, totalVotes } = constituency;
  const winnerInfo = PARTIES[winner2022];

  // Sort parties by vote share
  const sortedResults = Object.entries(results2022)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate coalition share if parties selected
  const coalitionShare = coalitionParties.length > 0
    ? coalitionParties.reduce((sum, party) => sum + (results2022[party] || 0), 0)
    : 0;

  // Would coalition win?
  const topNonCoalition = sortedResults.find(([party]) => !coalitionParties.includes(party));
  const topNonCoalitionShare = topNonCoalition ? topNonCoalition[1] : 0;
  const coalitionWouldWin = coalitionShare > topNonCoalitionShare;
  const currentWinnerInCoalition = coalitionParties.includes(winner2022);

  return (
    <div className="bg-surface border border-neutral rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: winnerInfo?.color }}
          />
          <h3 className="font-semibold text-white">{name}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span style={{ color: winnerInfo?.color }}>
            {winnerInfo?.short || winner2022}
          </span>
        </div>
      </div>

      {/* Vote share bars */}
      <div className="space-y-2 mb-3">
        {sortedResults.map(([party, share]) => {
          const info = PARTIES[party];
          const isWinner = party === winner2022;
          const inCoalition = coalitionParties.includes(party);

          return (
            <div key={party} className="flex items-center gap-2">
              <span className="w-12 text-xs text-gray-400 font-mono">
                {info?.short || party}
              </span>
              <div className="flex-1 h-2 bg-neutral rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${share * 100}%`,
                    backgroundColor: info?.color,
                    opacity: inCoalition ? 1 : 0.6,
                  }}
                />
              </div>
              <span
                className={`w-12 text-xs font-mono text-right ${
                  isWinner ? 'text-white font-semibold' : 'text-gray-400'
                }`}
              >
                {(share * 100).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-neutral">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{totalVotes?.toLocaleString()} votes</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>Margin: {(margin * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Coalition analysis - only show if parties selected */}
      {coalitionParties.length >= 2 && (
        <div className={`mt-3 pt-3 border-t ${coalitionWouldWin && !currentWinnerInCoalition ? 'border-green-500/30' : 'border-neutral'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Coalition Share</span>
            <span className="text-sm font-mono font-semibold text-white">
              {(coalitionShare * 100).toFixed(1)}%
            </span>
          </div>
          {!currentWinnerInCoalition && (
            <div className="mt-1">
              {coalitionWouldWin ? (
                <span className="text-xs text-green-400 font-medium">
                  Coalition would flip this seat
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  Gap: {((topNonCoalitionShare - coalitionShare) * 100).toFixed(1)}% to flip
                </span>
              )}
            </div>
          )}
          {currentWinnerInCoalition && (
            <span className="text-xs text-blue-400">Coalition already holds this seat</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ConstituencyResultCard;
