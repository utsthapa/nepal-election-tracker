/**
 * Election calculation utilities
 */

import { constituencies, INITIAL_NATIONAL, PARTIES } from '../data/constituencies';
import { getSwingMultiplier } from '../../data/geographicClusters';

/**
 * Apply switching matrix to vote shares
 * Transfers a percentage of votes from one party to another
 * @param {Object} voteShares - Current vote shares { NC: 0.35, UML: 0.30, ... }
 * @param {Object} switchingMatrix - Nested switching matrix { "UML": { "RSP": 10 }, ... }
 * @returns {Object} New vote shares with switching applied
 */
export function applySwitchingMatrix(voteShares, switchingMatrix = {}) {
  if (!switchingMatrix || Object.keys(switchingMatrix).length === 0) {
    return voteShares;
  }

  const adjusted = { ...voteShares };

  // Apply switching from each source party
  Object.entries(switchingMatrix).forEach(([fromParty, targets]) => {
    if (!targets || typeof targets !== 'object') return;

    Object.entries(targets).forEach(([toParty, percentage]) => {
      const pct = Math.max(0, Math.min(100, percentage)) / 100;
      const fromShare = adjusted[fromParty] || 0;

      if (fromShare > 0 && pct > 0) {
        const transferAmount = fromShare * pct;
        adjusted[fromParty] = Math.max(0, adjusted[fromParty] - transferAmount);
        adjusted[toParty] = (adjusted[toParty] || 0) + transferAmount;
      }
    });
  });

  // Normalize to ensure total still equals 1
  const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0) || 1;
  Object.keys(adjusted).forEach(party => {
    adjusted[party] = adjusted[party] / total;
  });

  return adjusted;
}

/**
 * Apply alliance (gathabandan) vote transfer between two parties.
 * The higher-vote party receives partner's votes with a handicap multiplier.
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

  // If neither party has meaningful presence, skip
  if ((shareA + shareB) <= 0) {
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
 * @param {Object} options - Additional options for advanced features
 * @param {Object} options.constituency - Full constituency object (for incumbency decay)
 * @param {number} options.incumbencyDecay - Incumbency decay factor (0-1)
 * @param {number} options.rspProxyIntensity - RSP momentum intensity (0-1)
 * @param {Array<string>} options.fullSlateParties - Parties running full national slate
 *   FULL SLATE MODE: For parties that didn't contest all seats in 2022 (e.g., RSP ran in ~60% of
 *   constituencies) but will run a full slate in the next election. When enabled for a party:
 *   - Instead of adding swing to their (often 0%) 2022 baseline, uses their national slider % directly
 *   - This projects what would happen if they fielded candidates everywhere
 *   - Example: RSP at 30% national with full slate = ~30% in each constituency (minus local factors)
 *   - Without this mode, RSP at 30% national might only get ~30 seats because many constituencies
 *     have 0% baseline (no candidate ran there in 2022)
 * @returns {Object} Adjusted vote shares
 */
export function calculateAdjustedResults(
  baseline,
  globalShifts,
  initialValues = INITIAL_NATIONAL,
  options = {}
) {
  const {
    constituency = null,
    incumbencyDecay = 0,
    rspProxyIntensity = 0,
    fullSlateParties = [],
  } = options;

  const parties = Object.keys(baseline);
  const adjusted = { ...baseline };

  // === FEATURE 1: RSP Momentum (legacy - kept for backwards compatibility) ===
  // Projects RSP as a major national party running in all constituencies
  // At 100% intensity, RSP should get ~28-30% nationally (targeting ~80 FPTP seats)
  if (rspProxyIntensity > 0) {
    const rspActual2022 = baseline.RSP || 0;
    // Target: At 100% intensity, RSP gets ~28% vote share in each constituency
    // This accounts for RSP running full slate of candidates in next election
    const rspTargetShare = 0.28;

    // Interpolate between actual 2022 and target based on intensity
    const rspNewShare = rspActual2022 + (rspTargetShare - rspActual2022) * rspProxyIntensity;

    // Only apply if there's a meaningful increase
    if (rspNewShare > rspActual2022 + 0.001) {
      const rspAdjustment = rspNewShare - rspActual2022;
      const otherParties = parties.filter(p => p !== 'RSP');
      const otherTotal = otherParties.reduce((sum, p) => sum + adjusted[p], 0);

      if (otherTotal > 0.001) {
        // Take votes proportionally from other parties
        otherParties.forEach(party => {
          const proportion = adjusted[party] / otherTotal;
          adjusted[party] = Math.max(0.01, adjusted[party] - (proportion * rspAdjustment));
        });
        adjusted.RSP = rspNewShare;
      }
    }
  }

  // === FEATURE 2: Geographic Cluster Elasticity ===
  // Apply swing multiplier based on geographic cluster
  const swingMultiplier = constituency ? getSwingMultiplier(constituency.id) : 1.0;

  // Apply swing to all non-full-slate parties
  parties.forEach(party => {
    if (fullSlateParties.includes(party)) return; // Handle separately below

    const shift = (globalShifts[party] - initialValues[party]) / 100;
    const adjustedShift = shift * swingMultiplier;
    adjusted[party] = Math.max(0.01, Math.min(0.99, adjusted[party] + adjustedShift));
  });

  // === FEATURE 3: Full Slate Projection ===
  // For parties in fullSlateParties:
  // - If they DID RUN in 2022 (baseline >= 1%): apply normal swing (baseline + shift)
  // - If they DIDN'T RUN (baseline < 1%): use national share directly (no swing - it's already reflected)
  //
  // This handles parties like RSP that only ran in ~60% of constituencies in 2022.
  // It preserves local variation where they competed, but fills gaps with national performance.
  if (fullSlateParties.length > 0) {
    const sliderTotal = Object.values(globalShifts).reduce((sum, v) => sum + v, 0) || 100;

    fullSlateParties.forEach(party => {
      if (!parties.includes(party)) return;

      const baselineShare = baseline[party] || 0;
      const nationalShare = (globalShifts[party] || 0) / sliderTotal;
      const shift = (globalShifts[party] - initialValues[party]) / 100;
      const adjustedShift = shift * swingMultiplier;

      // Threshold: if party had < 1% in 2022, they effectively didn't run there
      const didNotRun = baselineShare < 0.01;

      let newShare;
      if (didNotRun) {
        // Party didn't run here - use national share directly
        // No additional swing because nationalShare already reflects the slider value
        newShare = nationalShare;
      } else {
        // Party did run here - normal swing from their 2022 baseline
        newShare = baselineShare + adjustedShift;
      }

      // Set full-slate party's share and scale others proportionally
      const otherParties = parties.filter(p => p !== party);
      const otherTotal = otherParties.reduce((sum, p) => sum + adjusted[p], 0);

      // The full-slate party gets their share; others share the remainder
      const remainingForOthers = 1 - newShare;

      if (otherTotal > 0.001 && remainingForOthers > 0.01) {
        const scaleFactor = remainingForOthers / otherTotal;
        otherParties.forEach(p => {
          adjusted[p] = Math.max(0.005, adjusted[p] * scaleFactor);
        });
      }

      adjusted[party] = Math.max(0.01, Math.min(0.99, newShare));
    });
  }

  // Normalize to sum to 1 (should already be close, but ensure exactness)
  const total = Object.values(adjusted).reduce((a, b) => a + b, 0);
  parties.forEach(party => {
    adjusted[party] = adjusted[party] / total;
  });
  
  // === FEATURE 3: Incumbency Decay (Selection Bias) ===
  // Apply incumbency penalty to 2022 winners
  if (incumbencyDecay > 0 && constituency && constituency.winner2022) {
    const incumbentParty = constituency.winner2022;
    const incumbentShare = adjusted[incumbentParty];
    
    if (incumbentShare > 0.01) {
      // Apply decay factor: at 100% frustration, incumbents lose 80% of advantage
      const decayFactor = 1 - (incumbencyDecay * 0.8);
      const decayedShare = incumbentShare * decayFactor;
      const decayedAmount = incumbentShare - decayedShare;
      
      // Redistribute decayed votes proportionally to other parties
      const otherParties = parties.filter(p => p !== incumbentParty);
      const otherTotal = otherParties.reduce((sum, p) => sum + adjusted[p], 0);
      
      if (otherTotal > 0.001) {
        otherParties.forEach(party => {
          const proportion = adjusted[party] / otherTotal;
          adjusted[party] = Math.max(0.01, Math.min(0.99, adjusted[party] + (proportion * decayedAmount)));
        });
        adjusted[incumbentParty] = decayedShare;
      }
    }
  }
  
  // Final normalization to ensure sum = 1
  const finalTotal = Object.values(adjusted).reduce((a, b) => a + b, 0);
  parties.forEach(party => {
    adjusted[party] = adjusted[party] / finalTotal;
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
  // Check if all parties are at baseline values
  const parties = Object.keys(baselineValues);
  return parties.every(party => {
    const diff = Math.abs((globalSliders[party] || 0) - (baselineValues[party] || 0));
    return diff < 0.01;
  });
}

/**
 * Calculate FPTP results for all constituencies
 * @param {Object} globalSliders - Current slider values
 * @param {Object} overrides - Manual overrides { 'KTM-4': { NC: 0.45, ... }, ... }
 * @param {Object} alliance - Optional alliance config to shift votes
 * @param {Object} switchingMatrix - Optional switching matrix for voter flow
 * @param {Object} advancedOptions - Advanced simulation options
 * @param {number} advancedOptions.incumbencyDecay - Incumbency decay factor (0-1)
 * @param {number} advancedOptions.rspProxyIntensity - RSP momentum intensity (0-1)
 * @param {Array<string>} advancedOptions.fullSlateParties - Parties running full national slate
 *   (see calculateAdjustedResults for detailed explanation)
 * @returns {Object} Results per constituency
 */
export function calculateAllFPTPResults(
  globalSliders,
  overrides = {},
  baselineValues = INITIAL_NATIONAL,
  alliance = null,
  switchingMatrix = null,
  advancedOptions = {},
) {
  const {
    incumbencyDecay = 0,
    rspProxyIntensity = 0,
    fullSlateParties = [],
  } = advancedOptions;
  
  const results = {};
  const atBaseline = isAtBaseline(globalSliders, baselineValues);
  
  constituencies.forEach(constituency => {
    const id = constituency.id;
    let adjustedVotes;
    
    // Check if this constituency has manual override
    if (overrides[id]) {
      adjustedVotes = overrides[id];
      adjustedVotes = applyAllianceTransfer(adjustedVotes, alliance);
      adjustedVotes = applySwitchingMatrix(adjustedVotes, switchingMatrix);
      const winner = determineFPTPWinner(adjustedVotes);
      results[id] = { ...constituency, adjusted: adjustedVotes, ...winner, isOverridden: true };
    } else if (atBaseline && incumbencyDecay === 0 && rspProxyIntensity === 0 && fullSlateParties.length === 0 && !alliance?.enabled && (!switchingMatrix || Object.keys(switchingMatrix).length === 0)) {
      // Use actual 2022 results only when sliders are at baseline AND no advanced options active
      // Use the actual winner from 2022, not recalculated
      results[id] = {
        ...constituency,
        adjusted: constituency.results2022,
        winner: constituency.winner2022,
        margin: constituency.margin || 0,
        share: constituency.results2022[constituency.winner2022] || 0,
        isOverridden: false,
      };
    } else {
      // Apply global shifts with advanced options
      adjustedVotes = calculateAdjustedResults(
        constituency.results2022,
        globalSliders,
        baselineValues,
        {
          constituency,
          incumbencyDecay,
          rspProxyIntensity,
          fullSlateParties,
        }
      );
      adjustedVotes = applyAllianceTransfer(adjustedVotes, alliance);
      adjustedVotes = applySwitchingMatrix(adjustedVotes, switchingMatrix);
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

  // Distribute the change proportionally among other parties
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

const calculations = {
  applyAllianceTransfer,
  applySwitchingMatrix,
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

export default calculations;
