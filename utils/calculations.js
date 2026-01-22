/**
 * Election calculation utilities
 */

import { constituencies, INITIAL_NATIONAL, PARTIES } from '../data/constituencies';

/**
 * Calculate adjusted vote shares for a constituency based on global slider changes
 * @param {Object} baseline - Baseline results for constituency
 * @param {Object} globalShifts - Current global slider values { NC: 26, UML: 27, ... }
 * @param {Object} initialValues - Initial slider values (INITIAL_NATIONAL)
 * @returns {Object} Adjusted vote shares
 */
export function calculateAdjustedResults(baseline, globalShifts, initialValues = INITIAL_NATIONAL) {
  const parties = Object.keys(baseline);
  const adjusted = {};

  parties.forEach(party => {
    // Calculate shift: (current slider - initial slider) / 100
    const shift = (globalShifts[party] - initialValues[party]) / 100;
    // Apply shift to baseline, clamped between 0.01 and 0.99
    adjusted[party] = Math.max(0.01, Math.min(0.99, baseline[party] + shift));
  });

  // Normalize to sum to 1
  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  parties.forEach(party => {
    adjusted[party] = adjusted[party] / total;
  });

  return adjusted;
}

/**
 * Determine FPTP winner for a constituency
 * @param {Object} voteShares - Vote shares { NC: 0.35, UML: 0.30, ... }
 * @returns {Object} { winner: 'NC', margin: 0.05 }
 */
export function determineFPTPWinner(voteShares) {
  const sorted = Object.entries(voteShares).sort((a, b) => b[1] - a[1]);
  const winner = sorted[0][0];
  const winnerShare = sorted[0][1];
  const runnerUpShare = sorted.length > 1 ? sorted[1][1] : 0;
  const margin = winnerShare - runnerUpShare;

  return { winner, margin, share: winnerShare };
}

/**
 * Check if sliders are at baseline (no change from initial)
 */
function isAtBaseline(globalSliders, baselineValues = INITIAL_NATIONAL) {
  return Object.entries(globalSliders).every(([party, value]) =>
    Math.abs(value - baselineValues[party]) < 0.01
  );
}

/**
 * Calculate FPTP results for all constituencies
 * @param {Object} globalSliders - Current slider values
 * @param {Object} overrides - Manual overrides { 'KTM-4': { NC: 0.45, ... }, ... }
 * @returns {Object} Results per constituency
 */
export function calculateAllFPTPResults(globalSliders, overrides = {}, baselineValues = INITIAL_NATIONAL) {
  const results = {};
  const atBaseline = isAtBaseline(globalSliders, baselineValues);

  constituencies.forEach(constituency => {
    const id = constituency.id;

    // Check if this constituency has manual override
    if (overrides[id]) {
      const winner = determineFPTPWinner(overrides[id]);
      results[id] = {
        ...constituency,
        adjusted: overrides[id],
        ...winner,
        isOverridden: true,
      };
    } else if (atBaseline) {
      // Use actual 2022 results when sliders are at baseline
      results[id] = {
        ...constituency,
        adjusted: constituency.results2022,
        winner: constituency.winner2022,
        margin: constituency.margin,
        share: constituency.results2022[constituency.winner2022],
        isOverridden: false,
      };
    } else {
      // Apply global shifts
      const adjusted = calculateAdjustedResults(constituency.results2022, globalSliders, baselineValues);
      const winner = determineFPTPWinner(adjusted);
      results[id] = {
        ...constituency,
        adjusted,
        ...winner,
        isOverridden: false,
      };
    }
  });

  return results;
}

/**
 * Count FPTP seats by party
 * @param {Object} fptpResults - Results from calculateAllFPTPResults
 * @returns {Object} Seat counts { NC: 57, UML: 44, ... }
 */
export function countFPTPSeats(fptpResults) {
  const counts = {};
  // Initialize counts for all parties
  Object.keys(PARTIES).forEach(party => {
    counts[party] = 0;
  });

  Object.values(fptpResults).forEach(result => {
    if (counts.hasOwnProperty(result.winner)) {
      counts[result.winner]++;
    }
  });

  return counts;
}

/**
 * Zero-sum slider adjustment
 * When one slider changes, adjust others proportionally to maintain sum = 100
 * @param {Object} current - Current slider values
 * @param {string} changedParty - Party whose slider changed
 * @param {number} newValue - New value for changed slider
 * @returns {Object} New slider values summing to 100
 */
export function adjustZeroSumSliders(current, changedParty, newValue) {
  const parties = Object.keys(current);
  const otherParties = parties.filter(p => p !== changedParty);

  // Clamp new value between 0 and 100
  newValue = Math.max(0, Math.min(100, newValue));

  const oldValue = current[changedParty];
  const diff = newValue - oldValue;

  if (diff === 0) return { ...current };

  // Calculate sum of other parties
  const otherSum = otherParties.reduce((sum, p) => sum + current[p], 0);

  if (otherSum === 0) {
    // Edge case: all others are 0, distribute change equally
    const eachChange = -diff / otherParties.length;
    const result = { [changedParty]: newValue };
    otherParties.forEach(p => {
      result[p] = Math.max(0, eachChange);
    });
    return result;
  }

  // Distribute change proportionally among other parties
  const result = { [changedParty]: newValue };
  let remaining = 100 - newValue;

  otherParties.forEach((party, index) => {
    if (index === otherParties.length - 1) {
      // Last party gets whatever remains to ensure sum = 100
      result[party] = Math.max(0, remaining);
    } else {
      // Proportional distribution
      const proportion = current[party] / otherSum;
      const newPartyValue = Math.max(0, Math.round(proportion * (100 - newValue) * 10) / 10);
      result[party] = newPartyValue;
      remaining -= newPartyValue;
    }
  });

  return result;
}

/**
 * Get party color
 * @param {string} party - Party code
 * @returns {string} Hex color
 */
export function getPartyColor(party) {
  return PARTIES[party]?.color || '#6b7280';
}

/**
 * Get party display name
 * @param {string} party - Party code
 * @returns {string} Display name
 */
export function getPartyName(party) {
  return PARTIES[party]?.name || party;
}

/**
 * Calculate majority threshold
 * Total seats = 165 (FPTP) + 110 (PR) = 275
 * Majority = 138 (275/2 + 1)
 */
export const TOTAL_SEATS = 275;
export const FPTP_SEATS = 165;
export const PR_SEATS = 110;
export const MAJORITY_THRESHOLD = 138;

export default {
  calculateAdjustedResults,
  determineFPTPWinner,
  calculateAllFPTPResults,
  countFPTPSeats,
  adjustZeroSumSliders,
  getPartyColor,
  getPartyName,
  TOTAL_SEATS,
  FPTP_SEATS,
  PR_SEATS,
  MAJORITY_THRESHOLD,
};
