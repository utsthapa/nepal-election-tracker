/**
 * Demographic Electoral Prediction Calculator
 *
 * This module implements a weighted composition model for predicting
 * constituency-level election results based on demographic voting patterns.
 *
 * Core Algorithm:
 * Each constituency's predicted vote share = weighted average of:
 *   - 25% from age composition patterns
 *   - 25% from urban/rural composition
 *   - 25% from province affiliation
 *   - 25% from literacy level composition
 */

import type {
  DemographicVotingPatterns,
  DemographicTurnout,
  PartyVoteShares,
  ConstituencyPrediction,
  ValidationWarning,
  AgeGroup,
  EthnicGroup,
} from '@/types/demographics';

import { LiteracyBucket } from '@/types/demographics';

import { DISTRICT_DEMOGRAPHICS } from '@/data/demographics';
import { DISTRICT_ETHNICITY } from '@/data/ethnicDemographics';

// Tolerance for vote share normalization
const NORMALIZATION_TOLERANCE = 0.01; // 1%

/**
 * Classify a literacy rate into high/medium/low buckets
 */
export function classifyLiteracy(literacyRate: number): LiteracyBucket {
  if (literacyRate > 0.80) return LiteracyBucket.HIGH;
  if (literacyRate >= 0.70) return LiteracyBucket.MEDIUM;
  return LiteracyBucket.LOW;
}

/**
 * Validate party vote shares input
 * @returns Validation result with isValid flag and error message if invalid
 */
export function validateVoteSharesInput(shares: PartyVoteShares): { isValid: boolean; error?: string } {
  // Check if shares is a valid object
  if (!shares || typeof shares !== 'object') {
    return { isValid: false, error: 'Invalid vote shares: must be an object' };
  }

  const parties = Object.keys(shares);

  // Check if there are any parties
  if (parties.length === 0) {
    return { isValid: false, error: 'Invalid vote shares: no parties provided' };
  }

  // Check each party's share
  for (const [party, share] of Object.entries(shares)) {
    // Check for valid number
    if (typeof share !== 'number' || isNaN(share)) {
      return { isValid: false, error: `Invalid vote share for ${party}: must be a number` };
    }

    // Check for negative values
    if (share < 0) {
      return { isValid: false, error: `Invalid vote share for ${party}: cannot be negative (${share})` };
    }

    // Check for unreasonably high values (>100%)
    if (share > 100) {
      return { isValid: false, error: `Invalid vote share for ${party}: cannot exceed 100% (${share})` };
    }
  }

  return { isValid: true };
}

/**
 * Normalize vote shares to sum to exactly 100%
 */
export function normalizeVoteShares(shares: PartyVoteShares): PartyVoteShares {
  // Validate input first
  const validation = validateVoteSharesInput(shares);
  if (!validation.isValid) {
    console.warn('Validation failed in normalizeVoteShares:', validation.error);
    // Return original shares if validation fails
    return shares;
  }

  const total = Object.values(shares).reduce((sum, val) => sum + val, 0);

  if (Math.abs(total - 100) < NORMALIZATION_TOLERANCE) {
    return shares; // Already normalized
  }

  if (total === 0) {
    // Avoid division by zero - return equal shares
    const parties = Object.keys(shares);
    const equalShare = 100 / parties.length;
    return Object.fromEntries(parties.map(p => [p, equalShare]));
  }

  const normalized: PartyVoteShares = {};
  for (const [party, share] of Object.entries(shares)) {
    normalized[party] = (share / total) * 100;
  }

  return normalized;
}

/**
 * Map census age groups to voting age groups
 *
 * Census uses: 0-14, 15-29, 30-44, 45-59, 60+
 * Voting uses: 18-29, 30-44, 45-59, 60+
 *
 * We approximate by:
 * - Treating 15-29 as mostly 18-29 (adjusting for voter-eligible population)
 * - Using voterEligible percentage to filter out under-18
 */
function mapCensusAgeToVotingAge(
  censusAges: Record<string, number>,
  voterEligible: number
): Record<AgeGroup, number> {
  // Approximate distribution of voter-eligible population across age groups
  // Census '15-29' includes ages 15-17 who can't vote
  // We adjust by reducing the '18-29' weight proportionally

  const total1829 = censusAges['15-29'] || 0;
  const total3044 = censusAges['30-44'] || 0;
  const total4559 = censusAges['45-59'] || 0;
  const total60plus = censusAges['60+'] || 0;

  // Approximate: 18-29 is roughly 80% of 15-29 age group
  const adjusted1829 = total1829 * 0.80;

  const votingAgeTotal = adjusted1829 + total3044 + total4559 + total60plus;

  if (votingAgeTotal === 0) {
    // Fallback to equal distribution
    return {
      '18-29': 0.25,
      '30-44': 0.25,
      '45-59': 0.25,
      '60+': 0.25,
    };
  }

  return {
    '18-29': adjusted1829 / votingAgeTotal,
    '30-44': total3044 / votingAgeTotal,
    '45-59': total4559 / votingAgeTotal,
    '60+': total60plus / votingAgeTotal,
  };
}

/**
 * Calculate weighted vote shares from age composition
 */
function calculateAgeContribution(
  votingAgeDistribution: Record<AgeGroup, number>,
  agePatterns: DemographicVotingPatterns['age']
): PartyVoteShares {
  const parties = Object.keys(agePatterns['18-29']);
  const contribution: PartyVoteShares = Object.fromEntries(
    parties.map(p => [p, 0])
  );

  for (const [ageGroup, weight] of Object.entries(votingAgeDistribution) as [AgeGroup, number][]) {
    const pattern = agePatterns[ageGroup];
    for (const party of parties) {
      contribution[party] = (contribution[party] || 0) + pattern[party] * weight;
    }
  }

  return contribution;
}

/**
 * Calculate weighted vote shares from urban/rural composition
 */
function calculateUrbanRuralContribution(
  urbanPercent: number,
  urbanRuralPatterns: DemographicVotingPatterns['urbanRural']
): PartyVoteShares {
  const ruralPercent = 1 - urbanPercent;
  const parties = Object.keys(urbanRuralPatterns.urban);
  const contribution: PartyVoteShares = {};

  for (const party of parties) {
    contribution[party] =
      urbanRuralPatterns.urban[party] * urbanPercent +
      urbanRuralPatterns.rural[party] * ruralPercent;
  }

  return contribution;
}

/**
 * Calculate contribution from province affiliation
 */
function calculateProvinceContribution(
  province: number,
  provincePatterns: DemographicVotingPatterns['province']
): PartyVoteShares {
  return { ...provincePatterns[province as 1 | 2 | 3 | 4 | 5 | 6 | 7] };
}

/**
 * Calculate contribution from literacy level
 */
function calculateLiteracyContribution(
  literacyRate: number,
  literacyPatterns: DemographicVotingPatterns['literacy']
): PartyVoteShares {
  const bucket = classifyLiteracy(literacyRate);
  return { ...literacyPatterns[bucket] };
}

/**
 * Calculate weighted vote shares from ethnic composition
 */
function calculateEthnicityContribution(
  districtName: string,
  ethnicityPatterns: DemographicVotingPatterns['ethnicity']
): PartyVoteShares {
  if (!ethnicityPatterns) {
    return {};
  }

  const ethnicData = (DISTRICT_ETHNICITY as Record<string, Record<string, number>>)[districtName];
  if (!ethnicData) {
    // Fallback: equal weight across groups
    const groups = Object.keys(ethnicityPatterns) as EthnicGroup[];
    const equalWeight = 1 / groups.length;
    const parties = Object.keys(ethnicityPatterns[groups[0]]);
    const contribution: PartyVoteShares = Object.fromEntries(parties.map(p => [p, 0]));
    for (const group of groups) {
      for (const party of parties) {
        contribution[party] = (contribution[party] || 0) + (ethnicityPatterns[group]?.[party] || 0) * equalWeight;
      }
    }
    return contribution;
  }

  const groups = Object.keys(ethnicityPatterns) as EthnicGroup[];
  const parties = Object.keys(ethnicityPatterns[groups[0]]);
  const contribution: PartyVoteShares = Object.fromEntries(parties.map(p => [p, 0]));

  for (const group of groups) {
    const weight = ethnicData[group] || 0;
    const pattern = ethnicityPatterns[group];
    if (!pattern) continue;
    for (const party of parties) {
      contribution[party] = (contribution[party] || 0) + (pattern[party] || 0) * weight;
    }
  }

  return contribution;
}

/**
 * Demographic dimension identifiers
 */
export type DemographicDimension = 'age' | 'urbanRural' | 'province' | 'literacy' | 'ethnicity';

/**
 * Combine contributions — uses only the active dimension at 100% weight
 * Each dimension already applies real demographic percentages internally
 * (e.g., age uses voting-age distribution, urban/rural uses urbanization rate)
 */
function combineContributions(
  ageContribution: PartyVoteShares,
  urbanRuralContribution: PartyVoteShares,
  provinceContribution: PartyVoteShares,
  literacyContribution: PartyVoteShares,
  activeDimension: DemographicDimension = 'age',
  ethnicityContribution?: PartyVoteShares
): PartyVoteShares {
  const dimensionMap: Record<DemographicDimension, PartyVoteShares> = {
    age: ageContribution,
    urbanRural: urbanRuralContribution,
    province: provinceContribution,
    literacy: literacyContribution,
    ethnicity: ethnicityContribution || ageContribution,
  };

  return normalizeVoteShares({ ...dimensionMap[activeDimension] });
}

/**
 * Calculate expected turnout for a constituency based on active demographic dimension
 */
export function calculateConstituencyTurnout(
  constituency: { district: string; province: number },
  turnoutRates: DemographicTurnout,
  activeDimension: DemographicDimension = 'age'
): number {
  const demographics = (DISTRICT_DEMOGRAPHICS as Record<string, any>)[constituency.district];

  if (!demographics) {
    return 65.0;
  }

  if (activeDimension === 'age') {
    const votingAgeDistribution = mapCensusAgeToVotingAge(
      demographics.ageGroups,
      demographics.voterEligible
    );
    let ageTurnout = 0;
    for (const [ageGroup, weight] of Object.entries(votingAgeDistribution) as [AgeGroup, number][]) {
      ageTurnout += turnoutRates.age[ageGroup] * weight;
    }
    return ageTurnout;
  }

  if (activeDimension === 'urbanRural') {
    const urbanPercent = demographics.urbanPopulation;
    return turnoutRates.urbanRural.urban * urbanPercent +
           turnoutRates.urbanRural.rural * (1 - urbanPercent);
  }

  if (activeDimension === 'province') {
    return turnoutRates.province[constituency.province as 1 | 2 | 3 | 4 | 5 | 6 | 7];
  }

  if (activeDimension === 'ethnicity' && turnoutRates.ethnicity) {
    const ethnicData = (DISTRICT_ETHNICITY as Record<string, Record<string, number>>)[constituency.district];
    if (!ethnicData) return 65.0;
    let ethnicTurnout = 0;
    for (const [group, weight] of Object.entries(ethnicData)) {
      ethnicTurnout += (turnoutRates.ethnicity[group as keyof typeof turnoutRates.ethnicity] || 65) * weight;
    }
    return ethnicTurnout;
  }

  // literacy
  const literacyBucket = classifyLiteracy(demographics.literacyRate);
  return turnoutRates.literacy[literacyBucket];
}

/**
 * Calculate predicted vote shares for a single constituency
 */
export function calculateConstituencyVoteShares(
  constituency: { id: string; district: string; province: number; results2022?: Record<string, number> },
  patterns: DemographicVotingPatterns,
  turnoutRates: DemographicTurnout,
  activeDimension: DemographicDimension = 'age'
): ConstituencyPrediction {
  const demographics = (DISTRICT_DEMOGRAPHICS as Record<string, any>)[constituency.district];

  if (!demographics) {
    // No demographic data - return baseline
    console.warn(`No demographic data for district: ${constituency.district}`);
    return {
      constituencyId: constituency.id,
      voteShares: constituency.results2022 || {},
      turnout: 65.0,
    };
  }

  // Calculate voting age distribution
  const votingAgeDistribution = mapCensusAgeToVotingAge(
    demographics.ageGroups,
    demographics.voterEligible
  );

  // Calculate contributions from each dimension
  const ageContribution = calculateAgeContribution(
    votingAgeDistribution,
    patterns.age
  );

  const urbanRuralContribution = calculateUrbanRuralContribution(
    demographics.urbanPopulation,
    patterns.urbanRural
  );

  const provinceContribution = calculateProvinceContribution(
    constituency.province,
    patterns.province
  );

  const literacyContribution = calculateLiteracyContribution(
    demographics.literacyRate,
    patterns.literacy
  );

  // Calculate ethnicity contribution if patterns exist
  const ethnicityContribution = patterns.ethnicity
    ? calculateEthnicityContribution(constituency.district, patterns.ethnicity)
    : undefined;

  // Use only the active dimension's contribution
  const finalVoteShares = combineContributions(
    ageContribution,
    urbanRuralContribution,
    provinceContribution,
    literacyContribution,
    activeDimension,
    ethnicityContribution
  );

  // Calculate turnout from active dimension
  const turnout = calculateConstituencyTurnout(constituency, turnoutRates, activeDimension);

  return {
    constituencyId: constituency.id,
    voteShares: finalVoteShares,
    turnout,
    breakdown: {
      ageContribution,
      urbanRuralContribution,
      provinceContribution,
      literacyContribution,
    },
  };
}

/**
 * Apply demographic model to all constituencies
 */
export function applyDemographicModel(
  constituencies: Array<{ id: string; district: string; province: number; results2022?: Record<string, number> }>,
  patterns: DemographicVotingPatterns,
  turnoutRates: DemographicTurnout,
  activeDimension: DemographicDimension = 'age'
): ConstituencyPrediction[] {
  return constituencies.map(constituency =>
    calculateConstituencyVoteShares(constituency, patterns, turnoutRates, activeDimension)
  );
}

/**
 * Validate vote shares (warn if sum ≠ 100%)
 */
export function validateVoteShares(shares: PartyVoteShares): ValidationWarning | null {
  const total = Object.values(shares).reduce((sum, val) => sum + val, 0);

  if (Math.abs(total - 100) > 1.0) {
    return {
      dimension: 'vote_shares',
      segment: 'all',
      message: `Vote shares sum to ${total.toFixed(1)}% (should be 100%)`,
      severity: 'warning',
    };
  }

  // Check for extreme values
  for (const [party, share] of Object.entries(shares)) {
    if (share > 80) {
      return {
        dimension: 'vote_shares',
        segment: party,
        message: `${party} has ${share.toFixed(1)}% (unusually high)`,
        severity: 'warning',
      };
    }
  }

  return null;
}

/**
 * Validate turnout rate
 */
export function validateTurnout(rate: number): ValidationWarning | null {
  if (rate < 30) {
    return {
      dimension: 'turnout',
      segment: 'all',
      message: `Turnout of ${rate.toFixed(1)}% is unusually low`,
      severity: 'warning',
    };
  }

  if (rate > 90) {
    return {
      dimension: 'turnout',
      segment: 'all',
      message: `Turnout of ${rate.toFixed(1)}% is unusually high`,
      severity: 'warning',
    };
  }

  return null;
}

/**
 * Validate a complete constituency prediction
 */
export function validateConstituencyPrediction(
  prediction: ConstituencyPrediction
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const voteShareWarning = validateVoteShares(prediction.voteShares);
  if (voteShareWarning) warnings.push(voteShareWarning);

  const turnoutWarning = validateTurnout(prediction.turnout);
  if (turnoutWarning) warnings.push(turnoutWarning);

  return warnings;
}
