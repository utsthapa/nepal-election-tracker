/**
 * Battleground / Marginal Seat utilities
 * Identifies close races and vulnerable seats from FPTP results
 */

/**
 * Get battleground seats where the margin is below threshold
 * @param {Object} fptpResults - Results from calculateAllFPTPResults
 * @param {number} threshold - Max margin to qualify as battleground (default 0.05 = 5%)
 * @returns {Array} Sorted array of close seats (tightest first)
 */
export function getBattlegroundSeats(fptpResults, threshold = 0.05) {
  const battlegrounds = [];

  Object.entries(fptpResults).forEach(([id, result]) => {
    if (result.margin <= threshold) {
      // Find the runner-up
      const sorted = Object.entries(result.adjusted || result.results2022 || {})
        .sort((a, b) => b[1] - a[1]);

      battlegrounds.push({
        id,
        name: result.name,
        district: result.district,
        province: result.province,
        winner: result.winner,
        runnerUp: sorted.length > 1 ? sorted[1][0] : null,
        margin: result.margin,
        heat: classifyMarginHeat(result.margin),
        winnerShare: sorted[0]?.[1] || 0,
        runnerUpShare: sorted[1]?.[1] || 0,
      });
    }
  });

  // Sort tightest margins first
  battlegrounds.sort((a, b) => a.margin - b.margin);
  return battlegrounds;
}

/**
 * Classify margin into heat categories
 * @param {number} margin - Vote share margin (0-1)
 * @returns {'critical'|'tight'|'competitive'} Heat classification
 */
export function classifyMarginHeat(margin) {
  if (margin < 0.02) return 'critical';
  if (margin < 0.035) return 'tight';
  return 'competitive';
}

/**
 * Count vulnerable seats per party
 * @param {Array} battlegrounds - Output of getBattlegroundSeats
 * @returns {Object} { NC: 5, UML: 3, ... }
 */
export function countVulnerableSeats(battlegrounds) {
  const counts = {};
  battlegrounds.forEach(seat => {
    counts[seat.winner] = (counts[seat.winner] || 0) + 1;
  });
  return counts;
}
