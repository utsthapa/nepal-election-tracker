import { describe, it, expect } from 'vitest';
import {
  classifyLiteracy,
  normalizeVoteShares,
  calculateConstituencyVoteShares,
  calculateConstituencyTurnout,
  applyDemographicModel,
} from '../utils/demographicCalculator';

// ─── classifyLiteracy ────────────────────────────────────────────────────────

describe('classifyLiteracy', () => {
  it('should classify rate > 80% as high', () => {
    expect(classifyLiteracy(0.85)).toBe('high');
    expect(classifyLiteracy(0.95)).toBe('high');
  });

  it('should classify rate 70-80% as medium', () => {
    expect(classifyLiteracy(0.70)).toBe('medium');
    expect(classifyLiteracy(0.75)).toBe('medium');
    expect(classifyLiteracy(0.80)).toBe('medium');
  });

  it('should classify rate < 70% as low', () => {
    expect(classifyLiteracy(0.50)).toBe('low');
    expect(classifyLiteracy(0.69)).toBe('low');
  });

  it('should handle boundary at 0.80 as medium (not strictly greater)', () => {
    // 0.80 is NOT > 0.80, so it should be medium
    expect(classifyLiteracy(0.80)).toBe('medium');
  });

  it('should handle 0.81 as high', () => {
    expect(classifyLiteracy(0.81)).toBe('high');
  });
});

// ─── normalizeVoteShares ─────────────────────────────────────────────────────

describe('normalizeVoteShares', () => {
  it('should return shares unchanged if already summing to 100', () => {
    const input = { NC: 40, UML: 35, RSP: 25 };
    const result = normalizeVoteShares(input);
    expect(result).toEqual(input);
  });

  it('should normalize shares that sum to 200 down to 100', () => {
    const input = { NC: 80, UML: 70, RSP: 50 }; // sum = 200
    const result = normalizeVoteShares(input);
    expect(result.NC).toBeCloseTo(40, 1);
    expect(result.UML).toBeCloseTo(35, 1);
    expect(result.RSP).toBeCloseTo(25, 1);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  it('should normalize shares that sum to 50 up to 100', () => {
    const input = { NC: 25, UML: 15, RSP: 10 }; // sum = 50
    const result = normalizeVoteShares(input);
    expect(result.NC).toBeCloseTo(50, 1);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  it('should handle all-zero shares by distributing equally', () => {
    const input = { NC: 0, UML: 0, RSP: 0 };
    const result = normalizeVoteShares(input);
    const equalShare = 100 / 3;
    expect(result.NC).toBeCloseTo(equalShare, 1);
    expect(result.UML).toBeCloseTo(equalShare, 1);
    expect(result.RSP).toBeCloseTo(equalShare, 1);
  });

  it('should not modify shares within tolerance (1%)', () => {
    const input = { NC: 40.3, UML: 35.2, RSP: 24.5 }; // sum = 100.0
    const result = normalizeVoteShares(input);
    expect(result.NC).toBeCloseTo(40.3, 1);
  });
});

// ─── calculateConstituencyVoteShares (single-dimension mode) ─────────────────

describe('calculateConstituencyVoteShares', () => {
  const patterns = {
    age: {
      '18-29': { NC: 15, UML: 20, RSP: 40, Maoist: 10, Others: 15 },
      '30-44': { NC: 25, UML: 30, RSP: 15, Maoist: 15, Others: 15 },
      '45-59': { NC: 30, UML: 35, RSP: 8, Maoist: 12, Others: 15 },
      '60+':   { NC: 35, UML: 35, RSP: 5, Maoist: 10, Others: 15 },
    },
    urbanRural: {
      urban: { NC: 20, UML: 22, RSP: 30, Maoist: 10, Others: 18 },
      rural: { NC: 28, UML: 35, RSP: 8, Maoist: 15, Others: 14 },
    },
    province: {
      1: { NC: 20, UML: 35, RSP: 12, Maoist: 15, Others: 18 },
      2: { NC: 18, UML: 30, RSP: 8, Maoist: 10, Others: 34 },
      3: { NC: 26, UML: 28, RSP: 15, Maoist: 12, Others: 19 },
      4: { NC: 25, UML: 28, RSP: 10, Maoist: 12, Others: 25 },
      5: { NC: 24, UML: 30, RSP: 10, Maoist: 14, Others: 22 },
      6: { NC: 22, UML: 32, RSP: 8, Maoist: 14, Others: 24 },
      7: { NC: 28, UML: 28, RSP: 10, Maoist: 10, Others: 24 },
    },
    literacy: {
      high:   { NC: 24, UML: 27, RSP: 18, Maoist: 10, Others: 21 },
      medium: { NC: 23, UML: 30, RSP: 12, Maoist: 14, Others: 21 },
      low:    { NC: 22, UML: 33, RSP: 6, Maoist: 16, Others: 23 },
    },
  };

  const turnout = {
    age: { '18-29': 58, '30-44': 68, '45-59': 72, '60+': 70 },
    urbanRural: { urban: 64, rural: 66 },
    province: { 1: 68, 2: 62, 3: 66, 4: 64, 5: 65, 6: 67, 7: 70 },
    literacy: { high: 66, medium: 65, low: 63 },
  };

  // Jhapa is a real district with known demographics
  const jhapa = { id: 'P1-Jhapa-1', district: 'Jhapa', province: 1 };

  it('should return a prediction with voteShares summing to 100', () => {
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    const total = Object.values(pred.voteShares).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 0);
  });

  it('should return different predictions for different dimensions', () => {
    const agePred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    const provPred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'province');
    // Province mode uses Province 1 pattern directly; age mode blends by age distribution
    expect(agePred.voteShares.RSP).not.toBeCloseTo(provPred.voteShares.RSP, 0);
  });

  it('should use province pattern directly in province mode', () => {
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'province');
    // Province 1 pattern: UML=35, NC=20, RSP=12
    expect(pred.voteShares.UML).toBeCloseTo(35, 0);
    expect(pred.voteShares.NC).toBeCloseTo(20, 0);
  });

  it('should include turnout in the prediction', () => {
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'province');
    // Province 1 turnout = 68
    expect(pred.turnout).toBeCloseTo(68, 0);
  });

  it('should fallback gracefully for unknown districts', () => {
    const unknown = { id: 'FAKE-1', district: 'Atlantis', province: 1 };
    const pred = calculateConstituencyVoteShares(unknown, patterns, turnout, 'age');
    expect(pred.constituencyId).toBe('FAKE-1');
    expect(pred.turnout).toBe(65); // fallback turnout
  });

  it('should include breakdown in results', () => {
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    expect(pred.breakdown).toBeDefined();
    expect(pred.breakdown.ageContribution).toBeDefined();
    expect(pred.breakdown.provinceContribution).toBeDefined();
  });

  it('should weight youth-heavy constituency toward youth patterns in age mode', () => {
    // Jhapa has a relatively young population
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    // RSP is 40% among youth, 5% among seniors — a young-skewing district should give RSP > 15%
    expect(pred.voteShares.RSP).toBeGreaterThan(15);
  });
});

// ─── calculateConstituencyTurnout (single-dimension) ─────────────────────────

describe('calculateConstituencyTurnout', () => {
  const turnout = {
    age: { '18-29': 50, '30-44': 70, '45-59': 80, '60+': 75 },
    urbanRural: { urban: 60, rural: 70 },
    province: { 1: 68, 2: 62, 3: 66, 4: 64, 5: 65, 6: 67, 7: 70 },
    literacy: { high: 66, medium: 65, low: 63 },
  };

  const jhapa = { district: 'Jhapa', province: 1 };

  it('should return province turnout directly in province mode', () => {
    const result = calculateConstituencyTurnout(jhapa, turnout, 'province');
    expect(result).toBe(68);
  });

  it('should return age-weighted turnout in age mode', () => {
    const result = calculateConstituencyTurnout(jhapa, turnout, 'age');
    // Should be between min (50) and max (80) age turnout
    expect(result).toBeGreaterThan(50);
    expect(result).toBeLessThan(80);
  });

  it('should return urban/rural weighted turnout', () => {
    // Jhapa urbanPopulation = 0.285
    const result = calculateConstituencyTurnout(jhapa, turnout, 'urbanRural');
    // Expected: 0.285 * 60 + 0.715 * 70 = 17.1 + 50.05 = 67.15
    expect(result).toBeCloseTo(67.15, 0);
  });

  it('should fallback to 65 for unknown district', () => {
    const result = calculateConstituencyTurnout({ district: 'Nowhere', province: 1 }, turnout, 'age');
    expect(result).toBe(65);
  });
});

// ─── applyDemographicModel ───────────────────────────────────────────────────

describe('applyDemographicModel', () => {
  const patterns = {
    age: {
      '18-29': { NC: 20, UML: 30, RSP: 30, Others: 20 },
      '30-44': { NC: 25, UML: 30, RSP: 20, Others: 25 },
      '45-59': { NC: 30, UML: 35, RSP: 10, Others: 25 },
      '60+':   { NC: 35, UML: 35, RSP: 5, Others: 25 },
    },
    urbanRural: {
      urban: { NC: 25, UML: 25, RSP: 25, Others: 25 },
      rural: { NC: 25, UML: 35, RSP: 10, Others: 30 },
    },
    province: {
      1: { NC: 20, UML: 35, RSP: 15, Others: 30 },
      2: { NC: 20, UML: 30, RSP: 10, Others: 40 },
      3: { NC: 26, UML: 28, RSP: 15, Others: 31 },
      4: { NC: 25, UML: 28, RSP: 10, Others: 37 },
      5: { NC: 24, UML: 30, RSP: 10, Others: 36 },
      6: { NC: 22, UML: 32, RSP: 8, Others: 38 },
      7: { NC: 28, UML: 28, RSP: 10, Others: 34 },
    },
    literacy: {
      high:   { NC: 25, UML: 27, RSP: 18, Others: 30 },
      medium: { NC: 23, UML: 30, RSP: 12, Others: 35 },
      low:    { NC: 22, UML: 33, RSP: 6, Others: 39 },
    },
  };

  const turnout = {
    age: { '18-29': 58, '30-44': 68, '45-59': 72, '60+': 70 },
    urbanRural: { urban: 64, rural: 66 },
    province: { 1: 68, 2: 62, 3: 66, 4: 64, 5: 65, 6: 67, 7: 70 },
    literacy: { high: 66, medium: 65, low: 63 },
  };

  const testConstituencies = [
    { id: 'P1-Jhapa-1', district: 'Jhapa', province: 1 },
    { id: 'P3-Kathmandu-1', district: 'Kathmandu', province: 3 },
  ];

  it('should return a prediction for each constituency', () => {
    const results = applyDemographicModel(testConstituencies, patterns, turnout, 'age');
    expect(results).toHaveLength(2);
    expect(results[0].constituencyId).toBe('P1-Jhapa-1');
    expect(results[1].constituencyId).toBe('P3-Kathmandu-1');
  });

  it('should produce different results for different constituencies', () => {
    const results = applyDemographicModel(testConstituencies, patterns, turnout, 'urbanRural');
    // Kathmandu is much more urban than Jhapa, so RSP should be higher there
    const jhapa = results.find(r => r.constituencyId === 'P1-Jhapa-1');
    const ktm = results.find(r => r.constituencyId === 'P3-Kathmandu-1');
    expect(ktm.voteShares.RSP).toBeGreaterThan(jhapa.voteShares.RSP);
  });

  it('should produce valid vote shares for every constituency', () => {
    const results = applyDemographicModel(testConstituencies, patterns, turnout, 'literacy');
    results.forEach(pred => {
      const total = Object.values(pred.voteShares).reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(100, 0);
    });
  });
});
