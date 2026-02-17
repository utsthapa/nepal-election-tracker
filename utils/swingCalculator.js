/**
 * Uniform Swing Model
 * Applies national swing percentages to constituency-level results
 */

import { determineFPTPWinner } from './calculations';

/**
 * Apply uniform swing to FPTP results
 * @param {Object} fptpResults - Current FPTP results from calculateAllFPTPResults
 * @param {Object} swingPcts - Swing per party in percentage points { NC: 5, UML: -3, ... }
 * @returns {Object} New fptpResults with shifted shares and recalculated winners
 */
export function applyUniformSwing(fptpResults, swingPcts) {
  const swung = {};

  Object.entries(fptpResults).forEach(([id, result]) => {
    const baseVotes = result.adjusted || result.results2022 || {};
    const shifted = {};

    // Apply swing (convert percentage points to decimal: 5% → 0.05)
    Object.entries(baseVotes).forEach(([party, share]) => {
      const swing = (swingPcts[party] || 0) / 100;
      shifted[party] = Math.max(0, share + swing);
    });

    // Renormalize to sum to 1
    const total = Object.values(shifted).reduce((sum, v) => sum + v, 0);
    if (total > 0) {
      Object.keys(shifted).forEach(party => {
        shifted[party] = shifted[party] / total;
      });
    }

    const winner = determineFPTPWinner(shifted);

    swung[id] = {
      ...result,
      adjusted: shifted,
      winner: winner.winner,
      margin: winner.margin,
      share: winner.share,
    };
  });

  return swung;
}

/**
 * Calculate seat changes between baseline and swung results
 * @param {Object} baselineSeats - { NC: 57, UML: 44, ... }
 * @param {Object} swungSeats - { NC: 62, UML: 40, ... }
 * @returns {Object} { NC: +5, UML: -4, ... }
 */
export function calculateSeatChanges(baselineSeats, swungSeats) {
  const changes = {};
  const allParties = new Set([
    ...Object.keys(baselineSeats),
    ...Object.keys(swungSeats),
  ]);

  allParties.forEach(party => {
    const diff = (swungSeats[party] || 0) - (baselineSeats[party] || 0);
    if (diff !== 0) {
      changes[party] = diff;
    }
  });

  return changes;
}
