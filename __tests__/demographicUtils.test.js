import { describe, it, expect } from 'vitest';
import {
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
  aggregateConstituencyDemographics,
} from '../utils/demographicUtils';

// ─── getDistrictDemographics ──────────────────────────────────────────────────

describe('getDistrictDemographics', () => {
  it('should return data for a known district', () => {
    const data = getDistrictDemographics('Kathmandu');
    expect(data).not.toBeNull();
    expect(data.population).toBeGreaterThan(0);
    expect(data.literacyRate).toBeGreaterThan(0);
  });

  it('should return null for an unknown district', () => {
    expect(getDistrictDemographics('Atlantis')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(getDistrictDemographics('')).toBeNull();
  });

  it('should include all expected fields', () => {
    const data = getDistrictDemographics('Jhapa');
    expect(data.population).toBeDefined();
    expect(data.male).toBeDefined();
    expect(data.female).toBeDefined();
    expect(data.ageGroups).toBeDefined();
    expect(data.medianAge).toBeDefined();
    expect(data.literacyRate).toBeDefined();
    expect(data.urbanPopulation).toBeDefined();
    expect(data.voterEligible).toBeDefined();
  });
});

// ─── getConstituencyDemographics ──────────────────────────────────────────────

describe('getConstituencyDemographics', () => {
  it('should return data for a known constituency', () => {
    const data = getConstituencyDemographics('P1-Jhapa-1');
    expect(data).not.toBeNull();
    expect(data.constituencyId).toBe('P1-Jhapa-1');
    expect(data.district).toBe('Jhapa');
  });

  it('should return null for unknown constituency', () => {
    expect(getConstituencyDemographics('FAKE-1')).toBeNull();
  });

  it('should estimate population using district proportion', () => {
    // Jhapa has 5 constituencies, each with proportion 0.2
    const data = getConstituencyDemographics('P1-Jhapa-1');
    const districtData = getDistrictDemographics('Jhapa');
    expect(data.estimatedPopulation).toBeCloseTo(districtData.population * 0.2, -2);
  });

  it('should return high confidence for proportion=1.0 constituencies', () => {
    // Taplejung has a single constituency with proportion 1
    const data = getConstituencyDemographics('P1-Taplejung-1');
    expect(data.confidence).toBe('high');
  });

  it('should return medium confidence for split constituencies', () => {
    const data = getConstituencyDemographics('P1-Jhapa-1');
    expect(data.confidence).toBe('medium');
  });

  it('should include Census 2021 data source', () => {
    const data = getConstituencyDemographics('P3-Kathmandu-1');
    expect(data.dataSource).toContain('Census 2021');
  });

  it('should copy district age groups for single-district constituencies', () => {
    const data = getConstituencyDemographics('P1-Taplejung-1');
    const district = getDistrictDemographics('Taplejung');
    expect(data.ageGroups['0-14']).toBe(district.ageGroups['0-14']);
    expect(data.ageGroups['60+']).toBe(district.ageGroups['60+']);
  });
});

// ─── calculateAgeGroupPopulations ─────────────────────────────────────────────

describe('calculateAgeGroupPopulations', () => {
  const ageGroups = { '0-14': 0.25, '15-29': 0.28, '30-44': 0.20, '45-59': 0.16, '60+': 0.11 };

  it('should calculate population numbers from percentages', () => {
    const pops = calculateAgeGroupPopulations(100000, ageGroups);
    expect(pops['0-14']).toBe(25000);
    expect(pops['15-29']).toBe(28000);
    expect(pops['30-44']).toBe(20000);
  });

  it('should round to nearest integer', () => {
    const pops = calculateAgeGroupPopulations(100001, ageGroups);
    // 100001 * 0.25 = 25000.25, rounds to 25000
    expect(Number.isInteger(pops['0-14'])).toBe(true);
  });

  it('should handle zero population', () => {
    const pops = calculateAgeGroupPopulations(0, ageGroups);
    expect(pops['0-14']).toBe(0);
  });

  it('should preserve all age group keys', () => {
    const pops = calculateAgeGroupPopulations(100000, ageGroups);
    expect(Object.keys(pops)).toEqual(Object.keys(ageGroups));
  });
});

// ─── getVotingAgeBreakdown ────────────────────────────────────────────────────

describe('getVotingAgeBreakdown', () => {
  const ageGroups = { '0-14': 0.25, '15-29': 0.28, '30-44': 0.20, '45-59': 0.16, '60+': 0.11 };

  it('should return voting age breakdown', () => {
    const result = getVotingAgeBreakdown(1000000, ageGroups);
    expect(result).not.toBeNull();
    expect(result.youngVoters).toBeGreaterThan(0);
    expect(result.primeAge).toBeGreaterThan(0);
    expect(result.middleAge).toBeGreaterThan(0);
    expect(result.seniors).toBeGreaterThan(0);
    expect(result.totalVotingAge).toBeGreaterThan(0);
  });

  it('should have totalVotingAge equal to sum of all groups', () => {
    const result = getVotingAgeBreakdown(1000000, ageGroups);
    const sum = result.youngVoters + result.primeAge + result.middleAge + result.seniors;
    expect(result.totalVotingAge).toBe(sum);
  });

  it('should reduce youth count (excludes 15-17 from 15-29)', () => {
    const result = getVotingAgeBreakdown(1000000, ageGroups);
    // Young voters should be less than full 15-29 group
    const full1529 = Math.round(1000000 * 0.28);
    expect(result.youngVoters).toBeLessThan(full1529);
  });

  it('should return null for null ageGroups', () => {
    expect(getVotingAgeBreakdown(1000000, null)).toBeNull();
  });

  it('should return null for zero population', () => {
    expect(getVotingAgeBreakdown(0, ageGroups)).toBeNull();
  });
});

// ─── getYouthIndex ────────────────────────────────────────────────────────────

describe('getYouthIndex', () => {
  it('should return sum of 0-14 and 15-29 groups', () => {
    const ageGroups = { '0-14': 0.25, '15-29': 0.28, '30-44': 0.20, '45-59': 0.16, '60+': 0.11 };
    expect(getYouthIndex(ageGroups)).toBeCloseTo(0.53, 5);
  });

  it('should return null for null input', () => {
    expect(getYouthIndex(null)).toBeNull();
  });

  it('should return 0 when both youth groups are 0', () => {
    const ageGroups = { '0-14': 0, '15-29': 0, '30-44': 0.5, '45-59': 0.3, '60+': 0.2 };
    expect(getYouthIndex(ageGroups)).toBe(0);
  });

  it('should handle missing keys gracefully', () => {
    const partial = { '30-44': 0.5 };
    expect(getYouthIndex(partial)).toBe(0);
  });
});

// ─── getDependencyRatio ───────────────────────────────────────────────────────

describe('getDependencyRatio', () => {
  it('should calculate correct dependency ratio', () => {
    const ageGroups = { '0-14': 0.25, '15-29': 0.28, '30-44': 0.20, '45-59': 0.16, '60+': 0.11 };
    const dependents = 0.25 + 0.11; // 0.36
    const working = 0.28 + 0.20 + 0.16; // 0.64
    expect(getDependencyRatio(ageGroups)).toBeCloseTo(dependents / working, 5);
  });

  it('should return null for null input', () => {
    expect(getDependencyRatio(null)).toBeNull();
  });

  it('should return null when working age is 0', () => {
    const ageGroups = { '0-14': 0.5, '15-29': 0, '30-44': 0, '45-59': 0, '60+': 0.5 };
    expect(getDependencyRatio(ageGroups)).toBeNull();
  });

  it('should return ratio > 0 for typical age distribution', () => {
    const jhapa = getDistrictDemographics('Jhapa');
    const ratio = getDependencyRatio(jhapa.ageGroups);
    expect(ratio).toBeGreaterThan(0);
    expect(ratio).toBeLessThan(2); // Reasonable upper bound
  });
});

// ─── compareToNationalAverage ─────────────────────────────────────────────────

describe('compareToNationalAverage', () => {
  it('should return comparison for each age group', () => {
    const ageGroups = { '0-14': 0.25, '15-29': 0.28, '30-44': 0.20, '45-59': 0.16, '60+': 0.11 };
    const result = compareToNationalAverage(ageGroups);
    expect(result).not.toBeNull();
    expect(Object.keys(result)).toEqual(Object.keys(ageGroups));
  });

  it('should include constituency, national, difference, and status', () => {
    const ageGroups = { '0-14': 0.30 }; // Above national average
    const result = compareToNationalAverage(ageGroups);
    expect(result['0-14'].constituency).toBe(0.30);
    expect(result['0-14'].national).toBeDefined();
    expect(result['0-14'].difference).toBeDefined();
    expect(['above', 'below', 'average']).toContain(result['0-14'].status);
  });

  it('should classify above-average correctly', () => {
    // National average for 0-14 is 0.275. 0.30 > 0.275 + 0.02 = 0.295, so above
    const ageGroups = { '0-14': 0.30 };
    const result = compareToNationalAverage(ageGroups);
    expect(result['0-14'].status).toBe('above');
  });

  it('should classify below-average correctly', () => {
    // National average for 0-14 is 0.275. 0.20 < 0.275 - 0.02 = 0.255, so below
    const ageGroups = { '0-14': 0.20 };
    const result = compareToNationalAverage(ageGroups);
    expect(result['0-14'].status).toBe('below');
  });

  it('should classify near-average correctly', () => {
    // National average for 0-14 is 0.275. 0.28 is within ±0.02
    const ageGroups = { '0-14': 0.28 };
    const result = compareToNationalAverage(ageGroups);
    expect(result['0-14'].status).toBe('average');
  });

  it('should return null for null input', () => {
    expect(compareToNationalAverage(null)).toBeNull();
  });
});

// ─── formatAgeDataForChart ────────────────────────────────────────────────────

describe('formatAgeDataForChart', () => {
  const ageGroups = { '0-14': 0.25, '15-29': 0.28, '30-44': 0.20, '45-59': 0.16, '60+': 0.11 };

  it('should return array with entries for each age group', () => {
    const data = formatAgeDataForChart(ageGroups);
    expect(data).toHaveLength(5);
  });

  it('should include group, label, percentage, and color', () => {
    const data = formatAgeDataForChart(ageGroups);
    data.forEach(entry => {
      expect(entry.group).toBeDefined();
      expect(entry.label).toBeDefined();
      expect(entry.percentage).toBeGreaterThanOrEqual(0);
      expect(entry.color).toMatch(/^#/);
    });
  });

  it('should convert decimals to display percentages', () => {
    const data = formatAgeDataForChart(ageGroups);
    const youth = data.find(d => d.group === '0-14');
    // 0.25 → 25.0%
    expect(youth.percentage).toBeCloseTo(25.0, 0);
  });

  it('should include population when totalPopulation provided', () => {
    const data = formatAgeDataForChart(ageGroups, 1000000);
    const youth = data.find(d => d.group === '0-14');
    expect(youth.population).toBe(250000);
  });

  it('should have null population when totalPopulation not provided', () => {
    const data = formatAgeDataForChart(ageGroups);
    data.forEach(entry => {
      expect(entry.population).toBeNull();
    });
  });
});

// ─── getAgeGroupColor ─────────────────────────────────────────────────────────

describe('getAgeGroupColor', () => {
  it('should return a hex color for known groups', () => {
    expect(getAgeGroupColor('0-14')).toMatch(/^#[0-9a-f]{6}$/);
    expect(getAgeGroupColor('15-29')).toMatch(/^#[0-9a-f]{6}$/);
    expect(getAgeGroupColor('60+')).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('should return fallback gray for unknown groups', () => {
    expect(getAgeGroupColor('unknown')).toBe('#9ca3af');
  });

  it('should return different colors for different groups', () => {
    const colors = ['0-14', '15-29', '30-44', '45-59', '60+'].map(getAgeGroupColor);
    expect(new Set(colors).size).toBe(5);
  });
});

// ─── getProvinceDemographics ──────────────────────────────────────────────────

describe('getProvinceDemographics', () => {
  it('should return data for provinces 1-7', () => {
    for (let i = 1; i <= 7; i++) {
      const data = getProvinceDemographics(i);
      expect(data).not.toBeNull();
      expect(data.population).toBeGreaterThan(0);
    }
  });

  it('should return null for province 0', () => {
    expect(getProvinceDemographics(0)).toBeNull();
  });

  it('should return null for province 8', () => {
    expect(getProvinceDemographics(8)).toBeNull();
  });

  it('should have Bagmati (3) as most urban province', () => {
    const provinces = [1, 2, 3, 4, 5, 6, 7].map(i => ({
      id: i,
      urban: getProvinceDemographics(i).urbanPopulation,
    }));
    const mostUrban = provinces.sort((a, b) => b.urban - a.urban)[0];
    expect(mostUrban.id).toBe(3);
  });

  it('should have Madhesh (2) as lowest literacy', () => {
    const provinces = [1, 2, 3, 4, 5, 6, 7].map(i => ({
      id: i,
      literacy: getProvinceDemographics(i).literacyRate,
    }));
    const lowestLiteracy = provinces.sort((a, b) => a.literacy - b.literacy)[0];
    expect(lowestLiteracy.id).toBe(2);
  });
});

// ─── aggregateConstituencyDemographics ────────────────────────────────────────

describe('aggregateConstituencyDemographics', () => {
  it('should aggregate multiple constituencies', () => {
    const result = aggregateConstituencyDemographics(['P1-Jhapa-1', 'P1-Jhapa-2']);
    expect(result).not.toBeNull();
    expect(result.constituencyCount).toBe(2);
  });

  it('should sum populations correctly', () => {
    const result = aggregateConstituencyDemographics(['P1-Jhapa-1', 'P1-Jhapa-2']);
    const c1 = getConstituencyDemographics('P1-Jhapa-1');
    const c2 = getConstituencyDemographics('P1-Jhapa-2');
    expect(result.totalPopulation).toBe(c1.estimatedPopulation + c2.estimatedPopulation);
  });

  it('should return null for empty array', () => {
    expect(aggregateConstituencyDemographics([])).toBeNull();
  });

  it('should return null for all invalid IDs', () => {
    expect(aggregateConstituencyDemographics(['FAKE-1', 'FAKE-2'])).toBeNull();
  });

  it('should skip invalid IDs and count only valid ones', () => {
    const result = aggregateConstituencyDemographics(['P1-Jhapa-1', 'FAKE-1']);
    expect(result.constituencyCount).toBe(1);
  });

  it('should produce weighted average age groups', () => {
    const result = aggregateConstituencyDemographics(['P1-Jhapa-1', 'P1-Jhapa-2']);
    // Both are same district/proportion, so age groups should match district
    const jhapa = getDistrictDemographics('Jhapa');
    expect(result.ageGroups['0-14']).toBeCloseTo(jhapa.ageGroups['0-14'], 2);
  });

  it('should include male and female totals', () => {
    const result = aggregateConstituencyDemographics(['P3-Kathmandu-1', 'P3-Kathmandu-2']);
    expect(result.male).toBeGreaterThan(0);
    expect(result.female).toBeGreaterThan(0);
    expect(result.male + result.female).toBe(result.totalPopulation);
  });
});
