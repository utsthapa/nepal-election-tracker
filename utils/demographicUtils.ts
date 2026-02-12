// Demographic estimation utilities for Nepal constituencies
// Uses district-level Census 2021 data to estimate constituency demographics

import {
  DISTRICT_DEMOGRAPHICS,
  CONSTITUENCY_PROPORTIONS,
  AGE_GROUP_LABELS,
  PROVINCE_DEMOGRAPHICS
} from '../data/demographics';
import { DEMOGRAPHIC_CONFIG } from '../lib/config';

/**
 * Get demographic data for a constituency by estimating from district-level data
 * @param constituencyId - The constituency ID (e.g., 'P1-1')
 * @returns Estimated demographic data for the constituency
 */
export function getConstituencyDemographics(constituencyId: string): any {
  const mapping = (CONSTITUENCY_PROPORTIONS as any)[constituencyId];

  if (!mapping) {
    return null;
  }

  const districtData = (DISTRICT_DEMOGRAPHICS as any)[mapping.district];

  if (!districtData) {
    return null;
  }

  // Calculate estimated population for constituency
  const estimatedPopulation = Math.round(districtData.population * mapping.proportion);
  const estimatedMale = Math.round(districtData.male * mapping.proportion);
  const estimatedFemale = Math.round(districtData.female * mapping.proportion);

  // Handle multi-district constituencies (like Mugu-Humla)
  let secondDistrictData = null;
  if (mapping.secondDistrict && mapping.secondProportion) {
    secondDistrictData = (DISTRICT_DEMOGRAPHICS as any)[mapping.secondDistrict];
    if (secondDistrictData) {
      const secondPop = Math.round(secondDistrictData.population * mapping.secondProportion);
      return {
        constituencyId,
        district: `${mapping.district}/${mapping.secondDistrict}`,
        estimatedPopulation: estimatedPopulation + secondPop,
        male: estimatedMale + Math.round(secondDistrictData.male * mapping.secondProportion),
        female: estimatedFemale + Math.round(secondDistrictData.female * mapping.secondProportion),
        // Average the age groups weighted by population
        ageGroups: averageAgeGroups(
          districtData.ageGroups,
          secondDistrictData.ageGroups,
          estimatedPopulation,
          secondPop
        ),
        medianAge: weightedAverage(districtData.medianAge, secondDistrictData.medianAge, estimatedPopulation, secondPop),
        literacyRate: weightedAverage(districtData.literacyRate, secondDistrictData.literacyRate, estimatedPopulation, secondPop),
        urbanPopulation: weightedAverage(districtData.urbanPopulation, secondDistrictData.urbanPopulation, estimatedPopulation, secondPop),
        voterEligible: weightedAverage(districtData.voterEligible, secondDistrictData.voterEligible, estimatedPopulation, secondPop),
        dataSource: 'Census 2021 (estimated)',
        confidence: 'medium'
      };
    }
  }

  return {
    constituencyId,
    district: mapping.district,
    estimatedPopulation,
    male: estimatedMale,
    female: estimatedFemale,
    ageGroups: { ...districtData.ageGroups },
    medianAge: districtData.medianAge,
    literacyRate: districtData.literacyRate,
    urbanPopulation: districtData.urbanPopulation,
    voterEligible: districtData.voterEligible,
    dataSource: 'Census 2021 (estimated)',
    confidence: mapping.proportion === 1.0 ? 'high' : 'medium'
  };
}

/**
 * Get district-level demographics directly
 * @param districtName - Name of the district
 * @returns District demographic data
 */
export function getDistrictDemographics(districtName: string): any {
  return (DISTRICT_DEMOGRAPHICS as any)[districtName] || null;
}

/**
 * Calculate age group population numbers from percentages
 * @param totalPopulation - Total population
 * @param ageGroups - Age group percentages
 * @returns Age group population numbers
 */
export function calculateAgeGroupPopulations(totalPopulation: number, ageGroups: any): any {
  const populations: any = {};
  for (const [group, percentage] of Object.entries(ageGroups)) {
    populations[group] = Math.round(totalPopulation * (percentage as number));
  }
  return populations;
}

/**
 * Get voting-age population breakdown
 * @param totalPopulation - Total population
 * @param ageGroups - Age group percentages
 * @returns Voting age breakdown
 */
export function getVotingAgeBreakdown(totalPopulation: number, ageGroups: any): any {
  if (!ageGroups || !totalPopulation) {
    return null;
  }

  // Calculate 18+ population
  // Youth (15-29) includes 15-17 which is not voting age
  // Estimate: about 3/15 of the 15-29 group is under 18
  const youthVoting = (ageGroups['15-29'] || 0) * DEMOGRAPHIC_CONFIG.VOTING_AGE_RATIO;

  return {
    youngVoters: Math.round(totalPopulation * youthVoting),
    primeAge: Math.round(totalPopulation * (ageGroups['30-44'] || 0)),
    middleAge: Math.round(totalPopulation * (ageGroups['45-59'] || 0)),
    seniors: Math.round(totalPopulation * (ageGroups['60+'] || 0)),
    totalVotingAge: Math.round(totalPopulation * (youthVoting + (ageGroups['30-44'] || 0) + (ageGroups['45-59'] || 0) + (ageGroups['60+'] || 0)))
  };
}

/**
 * Get youth index (percentage of population under 30)
 * @param ageGroups - Age group percentages
 * @returns Youth index (0-1)
 */
export function getYouthIndex(ageGroups: any): any {
  if (!ageGroups) return null;
  return (ageGroups['0-14'] || 0) + (ageGroups['15-29'] || 0);
}

/**
 * Get dependency ratio (children + elderly / working age)
 * @param ageGroups - Age group percentages
 * @returns Dependency ratio
 */
export function getDependencyRatio(ageGroups: any): any {
  if (!ageGroups) return null;

  const dependents = (ageGroups['0-14'] || 0) + (ageGroups['60+'] || 0);
  const workingAge = (ageGroups['15-29'] || 0) + (ageGroups['30-44'] || 0) + (ageGroups['45-59'] || 0);

  if (workingAge === 0) return null;
  return dependents / workingAge;
}

/**
 * Get age distribution comparison between constituency and national average
 * @param {Object} constituencyAgeGroups - Constituency age groups
 * @returns {Object} Comparison with national average
 */
export function compareToNationalAverage(constituencyAgeGroups: any): any {
  if (!constituencyAgeGroups) return null;

  const comparison: any = {};
  for (const [group, percentage] of Object.entries(constituencyAgeGroups)) {
    const nationalAvg = (DEMOGRAPHIC_CONFIG.NATIONAL_AGE_AVERAGE as any)[group] || 0;
    const diff = (percentage as number) - nationalAvg;
    comparison[group] = {
      constituency: percentage,
      national: nationalAvg,
      difference: diff,
      status: diff > DEMOGRAPHIC_CONFIG.COMPARISON_THRESHOLD ? 'above' : diff < -DEMOGRAPHIC_CONFIG.COMPARISON_THRESHOLD ? 'below' : 'average'
    };
  }
  return comparison;
}

/**
 * Format age data for chart display
 * @param ageGroups - Age group percentages
 * @param totalPopulation - Total population (optional)
 * @returns Chart-ready data
 */
export function formatAgeDataForChart(ageGroups: any, totalPopulation: number | null = null): any {
  return Object.entries(ageGroups).map(([group, percentage]) => ({
    group,
    label: (AGE_GROUP_LABELS as any)[group] || group,
    percentage: Math.round((percentage as number) * 1000) / 10, // Convert to display percentage
    population: totalPopulation ? Math.round(totalPopulation * (percentage as number)) : null,
    color: getAgeGroupColor(group)
  }));
}

/**
 * Get color for age group visualization
 * @param group - Age group key
 * @returns Color hex code
 */
export function getAgeGroupColor(group: string): string {
  return (DEMOGRAPHIC_CONFIG.AGE_GROUP_COLORS as any)[group] || '#9ca3af';
}

/**
 * Get province-level demographics
 * @param provinceId - Province number (1-7)
 * @returns Province demographics
 */
export function getProvinceDemographics(provinceId: number): any {
  return (PROVINCE_DEMOGRAPHICS as any)[provinceId] || null;
}

/**
 * Calculate aggregate demographics for multiple constituencies
 * @param constituencyIds - Array of constituency IDs
 * @returns Aggregated demographics
 */
export function aggregateConstituencyDemographics(constituencyIds: string[]): any {
  let totalPopulation = 0;
  let totalMale = 0;
  let totalFemale = 0;
  let weightedAgeGroups: any = { '0-14': 0, '15-29': 0, '30-44': 0, '45-59': 0, '60+': 0 };
  let weightedMedianAge = 0;
  let weightedLiteracy = 0;
  let weightedUrban = 0;

  const validConstituencies: any[] = [];

  for (const id of constituencyIds) {
    const demo = getConstituencyDemographics(id);
    if (demo) {
      validConstituencies.push(demo);
      totalPopulation += demo.estimatedPopulation;
      totalMale += demo.male;
      totalFemale += demo.female;
    }
  }

  if (validConstituencies.length === 0) return null;

  // Calculate weighted averages
  for (const demo of validConstituencies) {
    const weight = demo.estimatedPopulation / totalPopulation;

    if (demo.ageGroups) {
      for (const group of Object.keys(weightedAgeGroups)) {
        weightedAgeGroups[group] += (demo.ageGroups[group] || 0) * weight;
      }
    }

    weightedMedianAge += (demo.medianAge || 0) * weight;
    weightedLiteracy += (demo.literacyRate || 0) * weight;
    weightedUrban += (demo.urbanPopulation || 0) * weight;
  }

  return {
    totalPopulation,
    male: totalMale,
    female: totalFemale,
    ageGroups: weightedAgeGroups,
    medianAge: Math.round(weightedMedianAge * 10) / 10,
    literacyRate: Math.round(weightedLiteracy * 1000) / 1000,
    urbanPopulation: Math.round(weightedUrban * 1000) / 1000,
    constituencyCount: validConstituencies.length
  };
}

// Helper functions
function weightedAverage(val1: number, val2: number, weight1: number, weight2: number): number {
  const totalWeight = weight1 + weight2;
  return (val1 * weight1 + val2 * weight2) / totalWeight;
}

function averageAgeGroups(groups1: any, groups2: any, weight1: number, weight2: number): any {
  const result: any = {};
  for (const key of Object.keys(groups1)) {
    result[key] = weightedAverage(groups1[key], groups2[key], weight1, weight2);
  }
  return result;
}

const demographicUtils = {
  getConstituencyDemographics,
  getDistrictDemographics,
  calculateAgeGroupPopulations,
  getVotingAgeBreakdown,
  getYouthIndex,
  getDependencyRatio,
  compareToNationalAverage,
  formatAgeDataForChart,
  getAgeGroupColor,
  getProvinceDemographics,
  aggregateConstituencyDemographics
};

export default demographicUtils;
