/**
 * Demographic-based election calculations
 * Accounts for vote concentration and demographic affinity
 */

import { constituencies, INITIAL_NATIONAL, PARTIES } from '../data/constituencies';
import { DISTRICT_DEMOGRAPHICS } from '../data/demographics';
import {
  PARTY_DEMOGRAPHIC_PROFILES,
  calculateConstituencyVote,
  calculateVoteEfficiency,
} from '../data/partyDemographicProfiles';
import { applyAllianceTransfer, determineFPTPWinner } from './calculations';

/**
 * Calculate adjusted vote shares with demographic weighting
 * RSP at 40% national will have higher concentrations in urban/educated areas
 */
export function calculateDemographicAdjustedResults(
  constituency,
  globalSliders,
  baselineValues = INITIAL_NATIONAL,
  useDemographics = true
) {
  const { district, results2022 } = constituency;
  const parties = Object.keys(globalSliders);

  // Get demographic data for this district
  const demoData = DISTRICT_DEMOGRAPHICS[district] || {
    urbanPopulation: 0.3,
    literacyRate: 0.65,
    ageGroups: { '15-29': 0.25 },
  };

  const adjusted = {};
  let totalWeight = 0;

  parties.forEach(party => {
    const nationalShare = globalSliders[party] / 100;
    const profile = PARTY_DEMOGRAPHIC_PROFILES[party];

    if (!profile || !useDemographics) {
      // No profile - use uniform swing
      const baselineShare = results2022[party] || 0;
      const nationalShift = nationalShare - baselineValues[party] / 100;
      adjusted[party] = Math.max(0, baselineShare + nationalShift);
    } else {
      // Calculate demographic-adjusted vote
      const demoVote = calculateConstituencyVote(party, demoData, nationalShare * 100) / 100;
      adjusted[party] = demoVote;
    }
    totalWeight += adjusted[party];
  });

  // Normalize to sum to 1
  if (totalWeight > 0) {
    Object.keys(adjusted).forEach(party => {
      adjusted[party] = adjusted[party] / totalWeight;
    });
  }

  return adjusted;
}

/**
 * Calculate FPTP results with demographic weighting
 * This ensures RSP at 40% wins more seats than NC at 40%
 */
export function calculateDemographicFPTPResults(
  globalSliders,
  overrides = {},
  baselineValues = INITIAL_NATIONAL,
  alliance = null,
  useDemographics = true
) {
  const results = {};

  constituencies.forEach(constituency => {
    const id = constituency.id;
    let adjustedVotes;

    if (overrides[id]) {
      // Manual override takes precedence
      adjustedVotes = applyAllianceTransfer(overrides[id], alliance);
    } else if (useDemographics) {
      // Use demographic-adjusted calculation
      adjustedVotes = calculateDemographicAdjustedResults(
        constituency,
        globalSliders,
        baselineValues,
        true
      );
      adjustedVotes = applyAllianceTransfer(adjustedVotes, alliance);
    } else {
      // Fall back to uniform swing
      const { calculateAdjustedResults } = require('./calculations');
      adjustedVotes = calculateAdjustedResults(
        constituency.results2022,
        globalSliders,
        baselineValues
      );
      adjustedVotes = applyAllianceTransfer(adjustedVotes, alliance);
    }

    const winner = determineFPTPWinner(adjustedVotes);
    results[id] = {
      ...constituency,
      adjusted: adjustedVotes,
      winner: winner.winner,
      margin: winner.margin,
      share: winner.share,
      isOverridden: !!overrides[id],
    };
  });

  return results;
}

/**
 * Project seats for a party at a given national vote share
 * Accounts for vote efficiency (concentration)
 */
export function projectSeatsForVoteShare(party, targetVoteShare, totalSeats = 165) {
  const profile = PARTY_DEMOGRAPHIC_PROFILES[party];
  if (!profile) {
    // Default cube law
    return Math.round(totalSeats * Math.pow(targetVoteShare / 100, 3));
  }

  // Calculate efficiency-adjusted seat projection
  const efficiency = calculateVoteEfficiency(party, targetVoteShare);

  // Modified cube law: seats = total * (vote_share^2.5) * efficiency
  // This gives RSP more seats per vote due to concentration
  const seatRatio = Math.pow(targetVoteShare / 100, 2.5) * efficiency;

  return Math.round(totalSeats * seatRatio);
}

/**
 * Get scenario presets with realistic outcomes
 */
export const SCENARIO_PRESETS = {
  rsp_sweep: {
    name: 'RSP Sweep',
    description: 'RSP wins 40% - concentrated in urban areas',
    sliders: {
      RSP: 40,
      NC: 22,
      UML: 18,
      Maoist: 8,
      RPP: 5,
      JSPN: 3,
      Others: 4,
    },
    expectedSeats: {
      RSP: 65,
      NC: 35,
      UML: 28,
      Maoist: 12,
      RPP: 8,
      JSPN: 5,
      Others: 12,
    },
  },
  three_way_split: {
    name: 'Three-Way Split',
    description: 'NC, UML, RSP each around 25%',
    sliders: {
      NC: 26,
      UML: 24,
      RSP: 25,
      Maoist: 12,
      RPP: 6,
      JSPN: 4,
      Others: 3,
    },
    expectedSeats: {
      NC: 42,
      UML: 38,
      RSP: 45,
      Maoist: 20,
      RPP: 10,
      JSPN: 5,
      Others: 5,
    },
  },
  nc_majority: {
    name: 'NC Majority',
    description: 'NC at 38% with broad support',
    sliders: {
      NC: 38,
      UML: 22,
      RSP: 16,
      Maoist: 10,
      RPP: 6,
      JSPN: 4,
      Others: 4,
    },
    expectedSeats: {
      NC: 85,
      UML: 28,
      RSP: 18,
      Maoist: 15,
      RPP: 8,
      JSPN: 6,
      Others: 5,
    },
  },
};

export default {
  calculateDemographicAdjustedResults,
  calculateDemographicFPTPResults,
  projectSeatsForVoteShare,
  SCENARIO_PRESETS,
};
