/**
 * Type definitions for Nepal election constituencies
 */

export interface Constituency {
  id: string;                           // e.g., 'P1-1', 'P7-10'
  name: string;                         // Constituency name
  district: string;                     // District name
  province: number;                     // Province number (1-7)
  winner2022: string;                   // Winning party in 2022
  results2022: Record<string, number>;  // Party vote shares in 2022
  totalVotes2022: number;               // Total votes cast in 2022
  margin?: number;                      // Victory margin (percentage)
  turnout?: number;                     // Voter turnout (percentage)
  demographics?: Demographics;          // Demographic data
}

export interface Demographics {
  constituencyId: string;
  district: string;
  estimatedPopulation: number;
  male: number;
  female: number;
  ageGroups: AgeGroups;
  medianAge: number;
  literacyRate: number;
  urbanPopulation: number;
  voterEligible: number;
  dataSource: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AgeGroups {
  '0-14': number;
  '15-29': number;
  '30-44': number;
  '45-59': number;
  '60+': number;
}

export interface DistrictDemographics {
  population: number;
  male: number;
  female: number;
  ageGroups: AgeGroups;
  medianAge: number;
  literacyRate: number;
  urbanPopulation: number;
  voterEligible: number;
}

export interface ConstituencyMapping {
  district: string;
  proportion: number;
  secondDistrict?: string;
  secondProportion?: number;
}

export interface Party {
  id: string;
  name: string;
  nameNepali: string;
  color: string;
  logo?: string;
  founded?: number;
  ideology?: string;
}

export interface Province {
  id: number;
  name: string;
  nameNepali: string;
  capital: string;
  constituencies: number;
}

export interface HistoricalElection {
  year: number;
  type: 'HOR' | 'CA';
  totalSeats: number;
  fptpSeats: number;
  prSeats: number;
  turnout: number;
}

export interface ConstituencyLookup {
  [key: string]: Constituency;
}

export interface DemographicComparison {
  constituency: number;
  national: number;
  difference: number;
  status: 'above' | 'below' | 'average';
}

export interface VotingAgeBreakdown {
  youngVoters: number;      // 18-29
  primeAge: number;         // 30-44
  middleAge: number;        // 45-59
  seniors: number;          // 60+
  totalVotingAge: number;
}

export interface ChartAgeData {
  group: string;
  label: string;
  percentage: number;
  population: number | null;
  color: string;
}
