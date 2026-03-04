/**
 * Election calculation utilities
 */

import { constituencies, INITIAL_NATIONAL, PARTIES } from '../data/constituencies';
import { DISTRICT_DEMOGRAPHICS } from '../data/demographics';
import { applyRspNationalEntry } from './scenarios';

/**
 * Party-specific swing profiles: how vote gain concentrates by urbanization.
 * urbanBias: multiplier at urbanPop = 1.0, ruralBias: multiplier at urbanPop = 0.0.
 * Interpolated linearly from district census urbanPopulation.
 * Parties omitted here use a flat 1.0 multiplier (uniform national swing).
 *
 * RSP:    Born in Kathmandu; wins concentrated in Bagmati/urban constituencies
 * NC:     Majority of wins in rural hills (Gulmi, Gorkha, Mugu, Achham, Darchula)
 * Maoist: Almost entirely mountain/Karnali (Humla, Kalikot, Rolpa, Rukum, Jajarkot)
 * US:     Concentrated in Sudurpashchim & Karnali mountains (Bajhang, Doti, Dolpa, Salyan)
 */
const PARTY_SWING_PROFILES = {
  RSP: { urbanBias: 1.5, ruralBias: 0.7 },
  NC: { urbanBias: 0.85, ruralBias: 1.15 },
  Maoist: { urbanBias: 0.75, ruralBias: 1.30 },
  US: { urbanBias: 0.75, ruralBias: 1.30 },
};

/**
 * Get constituency swing multiplier for a party based on district urbanization.
 * Returns 1.0 for parties without a profile (uniform swing).
 */
function getSwingMultiplier(party, district) {
  const profile = PARTY_SWING_PROFILES[party];
  if (!profile || !district) return 1.0;
  const urbanRate = DISTRICT_DEMOGRAPHICS[district]?.urbanPopulation ?? 0.15;
  return profile.ruralBias + (profile.urbanBias - profile.ruralBias) * urbanRate;
}

/**
 * Apply alliance (gathabandan) vote transfer between two parties.
 * The higher-vote party receives the partner's votes with a handicap multiplier.
 * @param {Object} voteShares - Current vote shares that sum to 1
 * @param {Object} alliance - { enabled: boolean, parties: [A,B], handicap: percent }
 * @returns {Object} New vote shares with alliance transfer applied
 */
export function applyAllianceTransfer(voteShares, alliance) {
  if (!alliance?.enabled || !Array.isArray(alliance.parties) || alliance.parties.length !== 2) {
    return voteShares;
  }

  const [partyA, partyB] = alliance.parties;
  if (!(partyA in voteShares) || !(partyB in voteShares)) {
    return voteShares;
  }

  const handicapPct = Math.max(0, Math.min(100, alliance.handicap ?? 0));
  const efficiency = 1 - handicapPct / 100; // 0 = no transfer, 1 = full transfer

  const shareA = voteShares[partyA] ?? 0;
  const shareB = voteShares[partyB] ?? 0;

  if (shareA + shareB <= 0) {
    return voteShares;
  }

  const leader = shareA >= shareB ? partyA : partyB;
  const donor = leader === partyA ? partyB : partyA;

  const donorShare = voteShares[donor] ?? 0;
  const leaderShare = voteShares[leader] ?? 0;

  const transferAmount = donorShare * efficiency;
  const adjusted = { ...voteShares };

  // Donor stands down; leader gets donor votes minus handicap
  adjusted[leader] = leaderShare + transferAmount;
  adjusted[donor] = 0;

  // Re-normalize to keep totals consistent
  // Total after removing donor and applying handicap
  const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0) || 1;
  Object.keys(adjusted).forEach(party => {
    adjusted[party] = adjusted[party] / total;
  });

  return adjusted;
}

/**
 * Calculate adjusted vote shares for a constituency based on global slider changes
 * @param {Object} baseline - Baseline results for constituency
 * @param {Object} globalShifts - Current global slider values { NC: 26, UML: 27, ... }
 * @param {Object} initialValues - Initial slider values (INITIAL_NATIONAL)
 * @param {string|null} district - District name for urban/rural swing weighting (optional)
 * @returns {Object} Adjusted vote shares
 */
export function calculateAdjustedResults(baseline, globalShifts, initialValues = INITIAL_NATIONAL, district = null) {
  const parties = Object.keys(baseline);
  const adjusted = {};

  parties.forEach(party => {
    // Calculate shift: (current slider - initial slider) / 100
    const shift = (globalShifts[party] - initialValues[party]) / 100;
    // Apply geography-weighted multiplier (e.g. RSP grows more in urban areas)
    const multiplier = getSwingMultiplier(party, district);
    // Apply weighted shift to baseline, clamped between 0 and 1
    adjusted[party] = Math.max(0, Math.min(1, baseline[party] + shift * multiplier));
  });

  // Normalize to sum to 1
  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  if (total <= 0) {
    const equalShare = 1 / parties.length;
    parties.forEach(party => {
      adjusted[party] = equalShare;
    });
    return adjusted;
  }
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
  if (sorted.length === 0) {
    return { winner: null, margin: 0, share: 0 };
  }
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
  return Object.entries(globalSliders).every(
    ([party, value]) => Math.abs(value - baselineValues[party]) < 0.01
  );
}

/**
 * Calculate FPTP results for all constituencies
 * @param {Object} globalSliders - Current slider values
 * @param {Object} overrides - Manual overrides { 'KTM-4': { NC: 0.45, ... }, ... }
 * @param {Object} alliance - Optional alliance config to shift votes
 * @returns {Object} Results per constituency
 */
export function calculateAllFPTPResults(
  globalSliders,
  overrides = {},
  baselineValues = INITIAL_NATIONAL,
  alliance = null,
  useRspNationalBase = false
) {
  const results = {};
  const atBaseline = isAtBaseline(globalSliders, baselineValues);

  constituencies.forEach(constituency => {
    const id = constituency.id;
    let adjustedVotes;

    // Determine the baseline for this constituency
    // If useRspNationalBase is true, inject assumed 10.70% base
    let localizedBaseline = constituency.results2022;
    if (useRspNationalBase) {
      localizedBaseline = applyRspNationalEntry(localizedBaseline);
    }

    // Check if this constituency has manual override
    if (overrides[id]) {
      adjustedVotes = applyAllianceTransfer(overrides[id], alliance);
      const winner = determineFPTPWinner(adjustedVotes);
      results[id] = {
        ...constituency,
        adjusted: adjustedVotes,
        ...winner,
        margin: winner.margin,
        isOverridden: true,
      };
    } else if (atBaseline && !useRspNationalBase) {
      // Use actual 2022 results when sliders are at baseline AND no RSP base tweak
      adjustedVotes = applyAllianceTransfer(constituency.results2022, alliance);
      const winner = determineFPTPWinner(adjustedVotes);
      results[id] = {
        ...constituency,
        adjusted: adjustedVotes,
        winner: winner.winner,
        margin: winner.margin,
        share: winner.share,
        isOverridden: false,
      };
    } else {
      // Apply global shifts from the localized baseline
      adjustedVotes = calculateAdjustedResults(
        localizedBaseline,
        globalSliders,
        baselineValues,
        constituency.district
      );
      adjustedVotes = applyAllianceTransfer(adjustedVotes, alliance);
      const winner = determineFPTPWinner(adjustedVotes);
      results[id] = {
        ...constituency,
        adjusted: adjustedVotes,
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
  // Initialize counts for simulator parties and fold small parties into Others
  Object.keys(INITIAL_NATIONAL).forEach(party => {
    counts[party] = 0;
  });

  Object.values(fptpResults).forEach(result => {
    if (counts.hasOwnProperty(result.winner)) {
      counts[result.winner]++;
    } else if (counts.hasOwnProperty('Others')) {
      counts.Others++;
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
 * @param {Set|Array} lockedParties - Optional set/array of party keys that should not be adjusted
 * @returns {Object} New slider values summing to 100
 */
export function adjustZeroSumSliders(current, changedParty, newValue, lockedParties = []) {
  const locked = new Set(lockedParties);
  const parties = Object.keys(current);
  const unlockedParties = parties.filter(p => p !== changedParty && !locked.has(p));

  newValue = Math.max(0, Math.min(100, newValue));

  const oldValue = current[changedParty];
  const diff = newValue - oldValue;

  if (diff === 0) return { ...current };

  const unlockedSum = unlockedParties.reduce((sum, p) => sum + current[p], 0);

  if (unlockedSum === 0) {
    if (unlockedParties.length === 0) {
      return { ...current, [changedParty]: newValue };
    }
    const eachChange = -diff / unlockedParties.length;
    const result = { [changedParty]: newValue };
    parties.forEach(p => {
      if (locked.has(p) && p !== changedParty) {
        result[p] = current[p];
      } else if (p !== changedParty) {
        result[p] = Math.max(0, eachChange);
      }
    });
    return result;
  }

  const result = { [changedParty]: newValue };

  parties.forEach(p => {
    if (p === changedParty) return;
    if (locked.has(p)) {
      result[p] = current[p];
    }
  });

  const lockedSum = parties.filter(p => locked.has(p)).reduce((sum, p) => sum + current[p], 0);
  let remaining = 100 - newValue - lockedSum;

  unlockedParties.forEach((party, index) => {
    if (index === unlockedParties.length - 1) {
      result[party] = Math.max(0, remaining);
    } else {
      const proportion = current[party] / unlockedSum;
      const newPartyValue = Math.max(
        0,
        Math.round(proportion * (100 - newValue - lockedSum) * 10) / 10
      );
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
  applyAllianceTransfer,
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
