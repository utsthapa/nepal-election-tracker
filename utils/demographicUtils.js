// Demographic estimation utilities for Nepal constituencies
// Uses district-level Census 2021 data to estimate constituency demographics

import {
  DISTRICT_DEMOGRAPHICS,
  CONSTITUENCY_PROPORTIONS,
  AGE_GROUP_LABELS,
  PROVINCE_DEMOGRAPHICS
} from '../data/demographics';

/**
 * Get demographic data for a constituency by estimating from district-level data
 * @param {string} constituencyId - The constituency ID (e.g., 'P1-1')
 * @returns {Object} Estimated demographic data for the constituency
 */
export function getConstituencyDemographics(constituencyId) {
  const mapping = CONSTITUENCY_PROPORTIONS[constituencyId];

  if (!mapping) {
    console.warn(`No mapping found for constituency: ${constituencyId}`);
    return null;
  }

  const districtData = DISTRICT_DEMOGRAPHICS[mapping.district];

  if (!districtData) {
    console.warn(`No demographic data found for district: ${mapping.district}`);
    return null;
  }

  // Calculate estimated population for constituency
  const estimatedPopulation = Math.round(districtData.population * mapping.proportion);
  const estimatedMale = Math.round(districtData.male * mapping.proportion);
  const estimatedFemale = Math.round(districtData.female * mapping.proportion);

  // Handle multi-district constituencies (like Mugu-Humla)
  let secondDistrictData = null;
  if (mapping.secondDistrict && mapping.secondProportion) {
    secondDistrictData = DISTRICT_DEMOGRAPHICS[mapping.secondDistrict];
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
 * @param {string} districtName - Name of the district
 * @returns {Object} District demographic data
 */
export function getDistrictDemographics(districtName) {
  return DISTRICT_DEMOGRAPHICS[districtName] || null;
}

/**
 * Calculate age group population numbers from percentages
 * @param {number} totalPopulation - Total population
 * @param {Object} ageGroups - Age group percentages
 * @returns {Object} Age group population numbers
 */
export function calculateAgeGroupPopulations(totalPopulation, ageGroups) {
  const populations = {};
  for (const [group, percentage] of Object.entries(ageGroups)) {
    populations[group] = Math.round(totalPopulation * percentage);
  }
  return populations;
}

/**
 * Get voting-age population breakdown
 * @param {number} totalPopulation - Total population
 * @param {Object} ageGroups - Age group percentages
 * @returns {Object} Voting age breakdown
 */
export function getVotingAgeBreakdown(totalPopulation, ageGroups) {
  // Calculate 18+ population
  // Youth (15-29) includes 15-17 which is not voting age
  // Estimate: about 3/15 of the 15-29 group is under 18
  const youthVoting = ageGroups['15-29'] * (12/15); // Only 18-29

  return {
    youngVoters: Math.round(totalPopulation * youthVoting),
    primeAge: Math.round(totalPopulation * ageGroups['30-44']),
    middleAge: Math.round(totalPopulation * ageGroups['45-59']),
    seniors: Math.round(totalPopulation * ageGroups['60+']),
    totalVotingAge: Math.round(totalPopulation * (youthVoting + ageGroups['30-44'] + ageGroups['45-59'] + ageGroups['60+']))
  };
}

/**
 * Get youth index (percentage of population under 30)
 * @param {Object} ageGroups - Age group percentages
 * @returns {number} Youth index (0-1)
 */
export function getYouthIndex(ageGroups) {
  return ageGroups['0-14'] + ageGroups['15-29'];
}

/**
 * Get dependency ratio (children + elderly / working age)
 * @param {Object} ageGroups - Age group percentages
 * @returns {number} Dependency ratio
 */
export function getDependencyRatio(ageGroups) {
  const dependents = ageGroups['0-14'] + ageGroups['60+'];
  const workingAge = ageGroups['15-29'] + ageGroups['30-44'] + ageGroups['45-59'];
  return dependents / workingAge;
}

/**
 * Get age distribution comparison between constituency and national average
 * @param {Object} constituencyAgeGroups - Constituency age groups
 * @returns {Object} Comparison with national average
 */
export function compareToNationalAverage(constituencyAgeGroups) {
  // National average from Census 2021
  const nationalAverage = {
    '0-14': 0.275,
    '15-29': 0.268,
    '30-44': 0.195,
    '45-59': 0.152,
    '60+': 0.110
  };

  const comparison = {};
  for (const [group, percentage] of Object.entries(constituencyAgeGroups)) {
    const diff = percentage - nationalAverage[group];
    comparison[group] = {
      constituency: percentage,
      national: nationalAverage[group],
      difference: diff,
      status: diff > 0.02 ? 'above' : diff < -0.02 ? 'below' : 'average'
    };
  }
  return comparison;
}

/**
 * Format age data for chart display
 * @param {Object} ageGroups - Age group percentages
 * @param {number} totalPopulation - Total population (optional)
 * @returns {Array} Chart-ready data
 */
export function formatAgeDataForChart(ageGroups, totalPopulation = null) {
  return Object.entries(ageGroups).map(([group, percentage]) => ({
    group,
    label: AGE_GROUP_LABELS[group] || group,
    percentage: Math.round(percentage * 1000) / 10, // Convert to display percentage
    population: totalPopulation ? Math.round(totalPopulation * percentage) : null,
    color: getAgeGroupColor(group)
  }));
}

/**
 * Get color for age group visualization
 * @param {string} group - Age group key
 * @returns {string} Color hex code
 */
export function getAgeGroupColor(group) {
  const colors = {
    '0-14': '#60a5fa',   // Blue - children
    '15-29': '#34d399',  // Green - youth
    '30-44': '#fbbf24',  // Yellow - young adults
    '45-59': '#f97316',  // Orange - middle age
    '60+': '#ef4444'     // Red - elderly
  };
  return colors[group] || '#9ca3af';
}

/**
 * Get province-level demographics
 * @param {number} provinceId - Province number (1-7)
 * @returns {Object} Province demographics
 */
export function getProvinceDemographics(provinceId) {
  return PROVINCE_DEMOGRAPHICS[provinceId] || null;
}

/**
 * Calculate aggregate demographics for multiple constituencies
 * @param {Array} constituencyIds - Array of constituency IDs
 * @returns {Object} Aggregated demographics
 */
export function aggregateConstituencyDemographics(constituencyIds) {
  let totalPopulation = 0;
  let totalMale = 0;
  let totalFemale = 0;
  let weightedAgeGroups = { '0-14': 0, '15-29': 0, '30-44': 0, '45-59': 0, '60+': 0 };
  let weightedMedianAge = 0;
  let weightedLiteracy = 0;
  let weightedUrban = 0;

  const validConstituencies = [];

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

    for (const group of Object.keys(weightedAgeGroups)) {
      weightedAgeGroups[group] += demo.ageGroups[group] * weight;
    }

    weightedMedianAge += demo.medianAge * weight;
    weightedLiteracy += demo.literacyRate * weight;
    weightedUrban += demo.urbanPopulation * weight;
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
function weightedAverage(val1, val2, weight1, weight2) {
  const totalWeight = weight1 + weight2;
  return (val1 * weight1 + val2 * weight2) / totalWeight;
}

function averageAgeGroups(groups1, groups2, weight1, weight2) {
  const result = {};
  for (const key of Object.keys(groups1)) {
    result[key] = weightedAverage(groups1[key], groups2[key], weight1, weight2);
  }
  return result;
}

export default {
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
