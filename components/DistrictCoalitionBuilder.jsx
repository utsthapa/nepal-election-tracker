import { Target, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

import { PARTIES } from '../data/constituencies';

export function DistrictCoalitionBuilder({
  constituencies,
  selectedParties,
  onToggleParty,
}) {
  // Get parties that appear in this district
  const partyPool = useMemo(() => {
    const parties = new Set();
    constituencies.forEach((c) => {
      Object.keys(c.results2022).forEach((p) => {
        if (c.results2022[p] > 0.05) {parties.add(p);}
      });
    });
    return Array.from(parties)
      .filter((p) => PARTIES[p])
      .sort((a, b) => {
        const aShare = constituencies.reduce((sum, c) => sum + (c.results2022[a] || 0), 0);
        const bShare = constituencies.reduce((sum, c) => sum + (c.results2022[b] || 0), 0);
        return bShare - aShare;
      });
  }, [constituencies]);

  // Calculate coalition analysis
  const analysis = useMemo(() => {
    if (selectedParties.length < 2) {
      return { seatsHeld: 0, potentialFlips: 0, totalShare: 0, constituencies: [] };
    }

    let seatsHeld = 0;
    let potentialFlips = 0;
    let totalShare = 0;
    const constituencyAnalysis = [];

    constituencies.forEach((c) => {
      const coalitionShare = selectedParties.reduce(
        (sum, party) => sum + (c.results2022[party] || 0),
        0
      );
      totalShare += coalitionShare;

      const sortedResults = Object.entries(c.results2022).sort((a, b) => b[1] - a[1]);
      const currentWinner = sortedResults[0]?.[0];
      const currentWinnerInCoalition = selectedParties.includes(currentWinner);

      // Find top non-coalition party
      const topNonCoalition = sortedResults.find(
        ([party]) => !selectedParties.includes(party)
      );
      const topNonCoalitionShare = topNonCoalition ? topNonCoalition[1] : 0;
      const wouldWin = coalitionShare > topNonCoalitionShare;

      if (currentWinnerInCoalition) {
        seatsHeld++;
      } else if (wouldWin) {
        potentialFlips++;
      }

      constituencyAnalysis.push({
        ...c,
        coalitionShare,
        currentWinner,
        currentWinnerInCoalition,
        wouldWin,
        gap: topNonCoalitionShare - coalitionShare,
      });
    });

    const avgShare = totalShare / constituencies.length;

    return {
      seatsHeld,
      potentialFlips,
      avgShare,
      constituencies: constituencyAnalysis.sort((a, b) => a.gap - b.gap),
    };
  }, [constituencies, selectedParties]);

  const handleToggle = (party) => {
    const isSelected = selectedParties.includes(party);
    if (isSelected && selectedParties.length <= 2) {return;}
    if (!isSelected && selectedParties.length >= 4) {return;}
    onToggleParty(party);
  };

  return (
    <div className="bg-surface border border-neutral rounded-2xl p-6">
      <div className="mb-4">
        <p className="text-xs font-mono uppercase tracking-wider text-gray-800">
          Gathbandan Analysis
        </p>
        <h2 className="text-xl font-semibold text-white">
          Coalition Builder for this District
        </h2>
        <p className="text-sm text-gray-700 mt-1">
          Select 2-4 parties to see combined vote share and potential seat flips
        </p>
      </div>

      {/* Party selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
        {partyPool.map((party) => {
          const isSelected = selectedParties.includes(party);
          const maxReached = selectedParties.length >= 4;
          const minReached = selectedParties.length <= 2;
          const lockout = (maxReached && !isSelected) || (minReached && isSelected);
          const partyColor = PARTIES[party]?.color || '#94a3b8';

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
              } ${lockout ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                boxShadow: isSelected ? `0 8px 25px -12px ${partyColor}` : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: partyColor }}
                />
                <span className="text-sm text-gray-900 font-semibold">
                  {PARTIES[party]?.short || party}
                </span>
              </div>
              {isSelected && <CheckCircle className="w-4 h-4 text-green-400" />}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      {selectedParties.length >= 2 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-gray-800">
                Seats Held
              </p>
              <p className="text-2xl font-bold text-white mt-1">{analysis.seatsHeld}</p>
              <p className="text-xs font-mono text-gray-700">
                of {constituencies.length}
              </p>
            </div>
            <div className="rounded-xl border border-green-300 bg-green-100 p-3">
              <p className="text-[11px] uppercase tracking-wider text-green-800">
                Potential Flips
              </p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {analysis.potentialFlips}
              </p>
              <p className="text-xs font-mono text-green-700">seats could flip</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-gray-800">
                Total Possible
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {analysis.seatsHeld + analysis.potentialFlips}
              </p>
              <p className="text-xs font-mono text-gray-700">
                of {constituencies.length}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wider text-gray-800">
                Avg Vote Share
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {(analysis.avgShare * 100).toFixed(2)}%
              </p>
              <p className="text-xs font-mono text-gray-700">combined</p>
            </div>
          </div>

          {/* Constituency breakdown */}
          <div className="rounded-xl border border-neutral bg-neutral/40">
            <div className="px-4 py-3 border-b border-neutral flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-semibold text-white">
                  Per-Constituency Analysis
                </span>
              </div>
            </div>
            <div className="divide-y divide-neutral max-h-64 overflow-y-auto">
              {analysis.constituencies.map((c) => {
                const winnerColor = PARTIES[c.currentWinner]?.color || '#94a3b8';
                return (
                  <div
                    key={c.id}
                    className={`px-4 py-3 flex items-center justify-between ${
                      c.wouldWin && !c.currentWinnerInCoalition
                        ? 'bg-green-500/10'
                        : c.currentWinnerInCoalition
                        ? 'bg-blue-500/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: winnerColor }}
                      />
                      <span className="text-sm text-white font-medium">{c.name}</span>
                      {c.currentWinnerInCoalition && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                          Held
                        </span>
                      )}
                      {c.wouldWin && !c.currentWinnerInCoalition && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-900 border border-green-300">
                          Would Flip
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-gray-700">
                        Coalition: {(c.coalitionShare * 100).toFixed(2)}%
                      </span>
                      {!c.currentWinnerInCoalition && (
                        <span
                          className={
                            c.gap <= 0 ? 'text-green-400' : 'text-gray-800'
                          }
                        >
                          {c.gap <= 0 ? 'Wins' : `Gap: ${(c.gap * 100).toFixed(2)}%`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-700">
          Select at least 2 parties to see coalition analysis
        </div>
      )}
    </div>
  );
}

export default DistrictCoalitionBuilder;
