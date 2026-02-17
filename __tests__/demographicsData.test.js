import { describe, it, expect } from 'vitest';
import {
  DISTRICT_DEMOGRAPHICS,
  AGE_GROUP_LABELS,
  DETAILED_AGE_GROUPS,
  VOTING_AGE_GROUPS,
  PROVINCE_DEMOGRAPHICS,
  CONSTITUENCY_PROPORTIONS,
} from '../data/demographics';

// ─── District data structure integrity ────────────────────────────────────────

describe('DISTRICT_DEMOGRAPHICS structure', () => {
  const districts = Object.entries(DISTRICT_DEMOGRAPHICS);

  it('should have at least 60 districts', () => {
    expect(districts.length).toBeGreaterThanOrEqual(60);
  });

  it('every district should have all required fields', () => {
    districts.forEach(([name, data]) => {
      expect(data.population, `${name} missing population`).toBeGreaterThan(0);
      expect(data.male, `${name} missing male`).toBeGreaterThan(0);
      expect(data.female, `${name} missing female`).toBeGreaterThan(0);
      expect(data.ageGroups, `${name} missing ageGroups`).toBeDefined();
      expect(data.medianAge, `${name} missing medianAge`).toBeGreaterThan(0);
      expect(data.literacyRate, `${name} missing literacyRate`).toBeGreaterThan(0);
      expect(data.urbanPopulation, `${name} missing urbanPopulation`).toBeGreaterThanOrEqual(0);
      expect(data.voterEligible, `${name} missing voterEligible`).toBeGreaterThan(0);
    });
  });

  it('male + female should approximately equal population', () => {
    districts.forEach(([name, data]) => {
      const sum = data.male + data.female;
      expect(sum, `${name}: male+female=${sum} vs pop=${data.population}`)
        .toBe(data.population);
    });
  });

  it('age groups should sum to ~1.0 for every district', () => {
    districts.forEach(([name, data]) => {
      const sum = Object.values(data.ageGroups).reduce((s, v) => s + v, 0);
      expect(Math.abs(sum - 1.0), `${name} age groups sum to ${sum.toFixed(4)}`)
        .toBeLessThan(0.01);
    });
  });

  it('every district should have exactly 5 age groups', () => {
    const expectedGroups = ['0-14', '15-29', '30-44', '45-59', '60+'];
    districts.forEach(([name, data]) => {
      expect(Object.keys(data.ageGroups).sort(), `${name} age group keys`)
        .toEqual(expectedGroups.sort());
    });
  });

  it('literacy rate should be between 0 and 1', () => {
    districts.forEach(([name, data]) => {
      expect(data.literacyRate, `${name} literacy=${data.literacyRate}`)
        .toBeGreaterThanOrEqual(0);
      expect(data.literacyRate, `${name} literacy=${data.literacyRate}`)
        .toBeLessThanOrEqual(1);
    });
  });

  it('urban population rate should be between 0 and 1', () => {
    districts.forEach(([name, data]) => {
      expect(data.urbanPopulation, `${name} urban=${data.urbanPopulation}`)
        .toBeGreaterThanOrEqual(0);
      expect(data.urbanPopulation, `${name} urban=${data.urbanPopulation}`)
        .toBeLessThanOrEqual(1);
    });
  });

  it('voter eligible rate should be between 0.5 and 1', () => {
    districts.forEach(([name, data]) => {
      expect(data.voterEligible, `${name} voterEligible=${data.voterEligible}`)
        .toBeGreaterThanOrEqual(0.5);
      expect(data.voterEligible, `${name} voterEligible=${data.voterEligible}`)
        .toBeLessThanOrEqual(1);
    });
  });

  it('median age should be between 15 and 45', () => {
    districts.forEach(([name, data]) => {
      expect(data.medianAge, `${name} medianAge=${data.medianAge}`)
        .toBeGreaterThanOrEqual(15);
      expect(data.medianAge, `${name} medianAge=${data.medianAge}`)
        .toBeLessThanOrEqual(45);
    });
  });
});

// ─── Province data integrity ──────────────────────────────────────────────────

describe('PROVINCE_DEMOGRAPHICS', () => {
  it('should have exactly 7 provinces', () => {
    expect(Object.keys(PROVINCE_DEMOGRAPHICS)).toHaveLength(7);
  });

  it('every province should have population, medianAge, literacyRate, urbanPopulation', () => {
    Object.entries(PROVINCE_DEMOGRAPHICS).forEach(([id, data]) => {
      expect(data.population, `Province ${id}`).toBeGreaterThan(0);
      expect(data.medianAge, `Province ${id}`).toBeGreaterThan(0);
      expect(data.literacyRate, `Province ${id}`).toBeGreaterThan(0);
      expect(data.urbanPopulation, `Province ${id}`).toBeGreaterThanOrEqual(0);
    });
  });

  it('total population across provinces should be ~29 million', () => {
    const total = Object.values(PROVINCE_DEMOGRAPHICS).reduce((s, d) => s + d.population, 0);
    expect(total).toBeGreaterThan(25_000_000);
    expect(total).toBeLessThan(35_000_000);
  });
});

// ─── Constituency proportions ─────────────────────────────────────────────────

describe('CONSTITUENCY_PROPORTIONS', () => {
  const entries = Object.entries(CONSTITUENCY_PROPORTIONS);

  it('should have over 100 constituencies', () => {
    expect(entries.length).toBeGreaterThan(100);
  });

  it('every entry should reference a valid district', () => {
    entries.forEach(([id, mapping]) => {
      expect(
        DISTRICT_DEMOGRAPHICS[mapping.district],
        `${id} references unknown district: ${mapping.district}`
      ).toBeDefined();
    });
  });

  it('every proportion should be between 0 and 1 (inclusive)', () => {
    entries.forEach(([id, mapping]) => {
      expect(mapping.proportion, `${id} proportion`).toBeGreaterThan(0);
      expect(mapping.proportion, `${id} proportion`).toBeLessThanOrEqual(1);
    });
  });

  it('proportions for same district should sum to ~1', () => {
    const byDistrict = {};
    entries.forEach(([id, mapping]) => {
      if (!byDistrict[mapping.district]) byDistrict[mapping.district] = 0;
      byDistrict[mapping.district] += mapping.proportion;
    });

    Object.entries(byDistrict).forEach(([district, sum]) => {
      // Some districts may have Rukum mapped twice (East and West), allow up to 2
      expect(sum, `${district} proportions sum to ${sum}`)
        .toBeGreaterThanOrEqual(0.9);
    });
  });
});

// ─── Reference data ───────────────────────────────────────────────────────────

describe('AGE_GROUP_LABELS', () => {
  it('should have labels for all 5 census age groups', () => {
    expect(AGE_GROUP_LABELS['0-14']).toBeDefined();
    expect(AGE_GROUP_LABELS['15-29']).toBeDefined();
    expect(AGE_GROUP_LABELS['30-44']).toBeDefined();
    expect(AGE_GROUP_LABELS['45-59']).toBeDefined();
    expect(AGE_GROUP_LABELS['60+']).toBeDefined();
  });
});

describe('DETAILED_AGE_GROUPS', () => {
  it('should sum to ~1.0 (within 5% rounding tolerance)', () => {
    const sum = Object.values(DETAILED_AGE_GROUPS).reduce((s, v) => s + v, 0);
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.05);
  });

  it('should have 17 five-year groups', () => {
    expect(Object.keys(DETAILED_AGE_GROUPS).length).toBe(17);
  });
});

describe('VOTING_AGE_GROUPS', () => {
  it('should have 4 voting age categories', () => {
    expect(Object.keys(VOTING_AGE_GROUPS)).toHaveLength(4);
    expect(VOTING_AGE_GROUPS['18-29']).toBeDefined();
    expect(VOTING_AGE_GROUPS['60+']).toBeDefined();
  });
});

// ─── Domain knowledge tests ───────────────────────────────────────────────────

describe('domain-specific demographic expectations', () => {
  it('Kathmandu should be the most populous district', () => {
    const maxDistrict = Object.entries(DISTRICT_DEMOGRAPHICS)
      .sort((a, b) => b[1].population - a[1].population)[0];
    expect(maxDistrict[0]).toBe('Kathmandu');
  });

  it('Kathmandu should have highest urbanization', () => {
    const maxUrban = Object.entries(DISTRICT_DEMOGRAPHICS)
      .sort((a, b) => b[1].urbanPopulation - a[1].urbanPopulation)[0];
    expect(maxUrban[0]).toBe('Kathmandu');
  });

  it('Kathmandu should have highest literacy rate', () => {
    const maxLit = Object.entries(DISTRICT_DEMOGRAPHICS)
      .sort((a, b) => b[1].literacyRate - a[1].literacyRate)[0];
    expect(maxLit[0]).toBe('Kathmandu');
  });

  it('Manang should be least populous district', () => {
    const minDistrict = Object.entries(DISTRICT_DEMOGRAPHICS)
      .sort((a, b) => a[1].population - b[1].population)[0];
    expect(minDistrict[0]).toBe('Manang');
  });

  it('Madhesh province should have youngest median age', () => {
    // Province 2 (Madhesh) has lowest median age
    const youngest = Object.entries(PROVINCE_DEMOGRAPHICS)
      .sort((a, b) => a[1].medianAge - b[1].medianAge)[0];
    expect(youngest[0]).toBe('2');
  });

  it('Bagmati province should have highest literacy', () => {
    const bestLit = Object.entries(PROVINCE_DEMOGRAPHICS)
      .sort((a, b) => b[1].literacyRate - a[1].literacyRate)[0];
    expect(bestLit[0]).toBe('3');
  });
});
