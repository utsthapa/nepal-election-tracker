/**
 * Demographic-based electoral prediction types
 *
 * This module defines the type structure for modeling voting patterns
 * by demographic segments (age, urban/rural, province, literacy)
 */

// Literacy classification buckets
export enum LiteracyBucket {
  HIGH = 'high',    // >80% literacy rate
  MEDIUM = 'medium', // 70-80% literacy rate
  LOW = 'low'        // <70% literacy rate
}

// Ethnic group segments for voting analysis
export type EthnicGroup = 'brahminChhetri' | 'janajati' | 'madhesi' | 'dalit' | 'tharu' | 'muslim' | 'newar' | 'others';

// Age group segments for voting analysis
export type AgeGroup = '18-29' | '30-44' | '45-59' | '60+';

// Urban/Rural classification
export type UrbanRural = 'urban' | 'rural';

// Province identifiers (1-7)
export type Province = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Vote share percentages for each party
 * Key: Party abbreviation (e.g., 'NC', 'UML', 'RSP')
 * Value: Percentage of votes (0-100)
 *
 * Sum should equal 100 for normalized shares
 */
export type PartyVoteShares = {
  [partyAbbreviation: string]: number;
};

/**
 * Voting patterns by age group
 * Each age segment has independent party preferences
 */
export type AgeVotingPatterns = {
  [key in AgeGroup]: PartyVoteShares;
};

/**
 * Voting patterns by urban/rural classification
 */
export type UrbanRuralVotingPatterns = {
  [key in UrbanRural]: PartyVoteShares;
};

/**
 * Voting patterns by province
 */
export type ProvinceVotingPatterns = {
  [key in Province]: PartyVoteShares;
};

/**
 * Voting patterns by literacy level
 */
export type LiteracyVotingPatterns = {
  [key in LiteracyBucket]: PartyVoteShares;
};

/**
 * Voting patterns by ethnic group
 */
export type EthnicityVotingPatterns = {
  [key in EthnicGroup]: PartyVoteShares;
};

/**
 * Complete demographic voting pattern configuration
 *
 * Each dimension is modeled independently to avoid
 * combinatorial explosion of segments
 */
export interface DemographicVotingPatterns {
  age: AgeVotingPatterns;
  urbanRural: UrbanRuralVotingPatterns;
  province: ProvinceVotingPatterns;
  literacy: LiteracyVotingPatterns;
  ethnicity?: EthnicityVotingPatterns;
}

/**
 * Turnout rates by age group (0-100)
 */
export type AgeTurnout = {
  [key in AgeGroup]: number;
};

/**
 * Turnout rates by urban/rural
 */
export type UrbanRuralTurnout = {
  [key in UrbanRural]: number;
};

/**
 * Turnout rates by province
 */
export type ProvinceTurnout = {
  [key in Province]: number;
};

/**
 * Turnout rates by literacy level
 */
export type LiteracyTurnout = {
  [key in LiteracyBucket]: number;
};

/**
 * Turnout rates by ethnic group
 */
export type EthnicityTurnout = {
  [key in EthnicGroup]: number;
};

/**
 * Complete demographic turnout configuration
 */
export interface DemographicTurnout {
  age: AgeTurnout;
  urbanRural: UrbanRuralTurnout;
  province: ProvinceTurnout;
  literacy: LiteracyTurnout;
  ethnicity?: EthnicityTurnout;
}

/**
 * A complete scenario with patterns and turnout
 * Can be preset or user-defined
 */
export interface DemographicScenario {
  id: string;
  name: string;
  description: string;
  patterns: DemographicVotingPatterns;
  turnout: DemographicTurnout;
  isPreset?: boolean; // true for built-in scenarios
  createdAt?: string; // ISO timestamp for user scenarios
}

/**
 * Prediction result for a single constituency
 */
export interface ConstituencyPrediction {
  constituencyId: string;
  voteShares: PartyVoteShares;
  turnout: number;
  breakdown?: {
    // Optional: contribution from each dimension
    ageContribution: PartyVoteShares;
    urbanRuralContribution: PartyVoteShares;
    provinceContribution: PartyVoteShares;
    literacyContribution: PartyVoteShares;
  };
}

/**
 * Validation warning for demographic inputs
 */
export interface ValidationWarning {
  dimension: string;
  segment: string;
  message: string;
  severity: 'warning' | 'error';
}
