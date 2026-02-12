/**
 * Type definitions for election results and calculations
 */

export interface ElectionResult {
  constituencyId: string;
  winner: string;
  votes: Record<string, number>;      // Party -> vote count
  totalVotes: number;
  margin: number;                     // Percentage margin
  turnout?: number;
  adjusted?: Record<string, number>;  // Adjusted vote shares
}

export interface FPTPResults {
  [constituencyId: string]: ElectionResult;
}

export interface PRAllocation {
  party: string;
  votes: number;
  voteShare: number;           // Percentage (0-100)
  seats: number;
  seatsFromVotes: number;      // Seats calculated from votes
  bonus?: number;              // Additional seats from adjustments
}

export interface PRResults {
  allocations: PRAllocation[];
  totalVotes: number;
  totalSeats: number;
  threshold: number;            // PR threshold (e.g., 0.03 for 3%)
  method: 'modified' | 'standard';
}

export interface SeatAllocation {
  party: string;
  fptpSeats: number;
  prSeats: number;
  totalSeats: number;
  voteShareFPTP: number;
  voteSharePR: number;
}

export interface ElectionSummary {
  fptpResults: FPTPResults;
  prResults: PRResults;
  seatAllocations: SeatAllocation[];
  totalSeats: number;
  majorityThreshold: number;
  governmentFormation: GovernmentFormation;
}

export interface GovernmentFormation {
  majority: boolean;
  leadingParty: string;
  leadingSeats: number;
  requiredForMajority: number;
  coalitionNeeded: boolean;
  possibleCoalitions?: Coalition[];
}

export interface Coalition {
  parties: string[];
  totalSeats: number;
  hasMajority: boolean;
  likelihood?: 'high' | 'medium' | 'low';
}

export interface VoteAdjustment {
  constituencyId: string;
  originalVotes: Record<string, number>;
  adjustedVotes: Record<string, number>;
  reason: string;
}

export interface SimulationParams {
  iterations: number;
  uncertainty: number;
  priorWeight: number;
  demographicSignals: boolean;
  coalitionHandicap?: number;
}

export interface SimulationResult {
  meanSeats: Record<string, number>;
  medianSeats: Record<string, number>;
  confidenceInterval95: Record<string, [number, number]>;
  winProbability: Record<string, number>;
  mostLikelyOutcome: SeatAllocation[];
}

export interface BayesianForecast {
  constituencyId: string;
  baselineVotes: Record<string, number>;
  priorAdjustment: Record<string, number>;
  demographicSignal: Record<string, number>;
  finalPrediction: Record<string, number>;
  uncertainty: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface PollData {
  id: string;
  date: string;
  pollster: string;
  sampleSize: number;
  results: Record<string, number>;
  margin?: number;
  methodology?: string;
}

export interface PollAggregation {
  polls: PollData[];
  weightedAverage: Record<string, number>;
  trend: Record<string, number>;      // Change from previous period
  lastUpdated: string;
}

export interface AllianceConfig {
  enabled: boolean;
  parties: string[];
  handicap: number;               // Vote loss percentage (0-100)
  targetConstituencies?: string[];
}

export interface SwitchingMatrix {
  [fromParty: string]: {
    [toParty: string]: number;  // Percentage of voters switching (0-100)
  };
}

export interface GlobalSliders {
  [party: string]: number;      // Vote share (0-100)
}

export interface ConstituencyOverride {
  [constituencyId: string]: Record<string, number>;  // Party -> vote share
}

export interface ElectionState {
  fptpSliders: GlobalSliders;
  prSliders: GlobalSliders;
  overrides: ConstituencyOverride;
  allianceConfig: AllianceConfig;
  switchingMatrix: SwitchingMatrix;
  selectedConstituency: string | null;
  prMethod: 'modified' | 'standard';
  year: number;
}
