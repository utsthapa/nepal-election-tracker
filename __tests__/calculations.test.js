import { describe, it, expect } from 'vitest';
import {
  adjustZeroSumSliders,
  calculateAdjustedResults,
  determineFPTPWinner,
  applyAllianceTransfer,
  countFPTPSeats,
  calculateAllFPTPResults,
} from '../utils/calculations';

// ─── adjustZeroSumSliders ────────────────────────────────────────────────────

describe('adjustZeroSumSliders', () => {
  const base = { NC: 30, UML: 30, Maoist: 20, RSP: 10, Others: 10 };

  it('should always sum to 100 after adjustment', () => {
    const result = adjustZeroSumSliders(base, 'NC', 50);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  it('should set the changed party to the new value', () => {
    const result = adjustZeroSumSliders(base, 'RSP', 40);
    expect(result.RSP).toBeCloseTo(40, 1);
  });

  it('should redistribute proportionally among other parties', () => {
    // RSP goes from 10 → 40 (+30), others must shrink by 30 total
    const result = adjustZeroSumSliders(base, 'RSP', 40);
    // NC and UML were equal (30 each), so they should shrink equally
    expect(result.NC).toBeCloseTo(result.UML, 0);
    // Each other party should be smaller than before
    expect(result.NC).toBeLessThan(30);
    expect(result.Maoist).toBeLessThan(20);
  });

  it('should handle setting a party to 0', () => {
    const result = adjustZeroSumSliders(base, 'NC', 0);
    expect(result.NC).toBe(0);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  it('should handle setting a party to 100', () => {
    const result = adjustZeroSumSliders(base, 'NC', 100);
    expect(result.NC).toBe(100);
    // All others should be 0
    Object.entries(result).forEach(([party, val]) => {
      if (party !== 'NC') expect(val).toBe(0);
    });
  });

  it('should clamp values above 100 to 100', () => {
    const result = adjustZeroSumSliders(base, 'NC', 150);
    expect(result.NC).toBe(100);
  });

  it('should clamp values below 0 to 0', () => {
    const result = adjustZeroSumSliders(base, 'NC', -10);
    expect(result.NC).toBe(0);
  });

  it('should return a copy when value does not change', () => {
    const result = adjustZeroSumSliders(base, 'NC', 30);
    expect(result).toEqual(base);
    expect(result).not.toBe(base); // should be a new object
  });

  it('should handle edge case where all others are 0', () => {
    const edgeCase = { NC: 100, UML: 0, Maoist: 0, RSP: 0 };
    const result = adjustZeroSumSliders(edgeCase, 'NC', 60);
    expect(result.NC).toBe(60);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 1);
  });
});

// ─── determineFPTPWinner ─────────────────────────────────────────────────────

describe('determineFPTPWinner', () => {
  it('should identify the party with the highest vote share', () => {
    const result = determineFPTPWinner({ NC: 0.35, UML: 0.30, RSP: 0.20, Maoist: 0.15 });
    expect(result.winner).toBe('NC');
  });

  it('should calculate the correct margin', () => {
    const result = determineFPTPWinner({ NC: 0.40, UML: 0.35, RSP: 0.25 });
    expect(result.margin).toBeCloseTo(0.05, 5);
  });

  it('should return the winner share', () => {
    const result = determineFPTPWinner({ NC: 0.45, UML: 0.55 });
    expect(result.winner).toBe('UML');
    expect(result.share).toBeCloseTo(0.55, 5);
  });

  it('should handle a clear majority', () => {
    const result = determineFPTPWinner({ NC: 0.80, UML: 0.10, RSP: 0.10 });
    expect(result.winner).toBe('NC');
    expect(result.margin).toBeCloseTo(0.70, 5);
  });
});

// ─── applyAllianceTransfer ───────────────────────────────────────────────────

describe('applyAllianceTransfer', () => {
  const voteShares = { NC: 0.30, UML: 0.25, Maoist: 0.20, RSP: 0.15, Others: 0.10 };

  it('should return original shares when alliance is disabled', () => {
    const result = applyAllianceTransfer(voteShares, { enabled: false, parties: ['NC', 'Maoist'], handicap: 10 });
    expect(result).toEqual(voteShares);
  });

  it('should return original shares when alliance is null', () => {
    const result = applyAllianceTransfer(voteShares, null);
    expect(result).toEqual(voteShares);
  });

  it('should transfer votes from weaker to stronger party', () => {
    const result = applyAllianceTransfer(voteShares, {
      enabled: true,
      parties: ['NC', 'Maoist'],
      handicap: 0,
    });
    // NC (0.30) > Maoist (0.20), so NC is leader, Maoist is donor
    expect(result.Maoist).toBe(0);
    expect(result.NC).toBeGreaterThan(voteShares.NC);
  });

  it('should apply handicap to reduce transferred votes', () => {
    const noHandicap = applyAllianceTransfer(voteShares, {
      enabled: true,
      parties: ['NC', 'Maoist'],
      handicap: 0,
    });
    const withHandicap = applyAllianceTransfer(voteShares, {
      enabled: true,
      parties: ['NC', 'Maoist'],
      handicap: 50,
    });
    // With 50% handicap, leader gets fewer transferred votes
    expect(withHandicap.NC).toBeLessThan(noHandicap.NC);
  });

  it('should normalize results to sum to 1', () => {
    const result = applyAllianceTransfer(voteShares, {
      enabled: true,
      parties: ['NC', 'Maoist'],
      handicap: 20,
    });
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 3);
  });

  it('should handle alliance between parties not in shares', () => {
    const result = applyAllianceTransfer(voteShares, {
      enabled: true,
      parties: ['NC', 'FAKE'],
      handicap: 0,
    });
    expect(result).toEqual(voteShares);
  });
});

// ─── calculateAdjustedResults ────────────────────────────────────────────────

describe('calculateAdjustedResults', () => {
  const baseline = { NC: 0.30, UML: 0.35, Maoist: 0.20, RSP: 0.15 };
  const initial = { NC: 26, UML: 27, Maoist: 15, RSP: 12 };

  it('should return baseline-like results when sliders match initial', () => {
    const result = calculateAdjustedResults(baseline, initial, initial);
    // Should be close to baseline (normalized)
    expect(result.NC).toBeCloseTo(baseline.NC, 1);
  });

  it('should increase share when slider goes up', () => {
    const shifted = { ...initial, RSP: 22 }; // RSP +10
    const result = calculateAdjustedResults(baseline, shifted, initial);
    expect(result.RSP).toBeGreaterThan(baseline.RSP);
  });

  it('should always normalize to sum to 1', () => {
    const shifted = { NC: 40, UML: 30, Maoist: 15, RSP: 15 };
    const result = calculateAdjustedResults(baseline, shifted, initial);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 5);
  });
});

// ─── countFPTPSeats ──────────────────────────────────────────────────────────

describe('countFPTPSeats', () => {
  it('should count winners correctly', () => {
    const mockResults = {
      'P1-1': { winner: 'NC' },
      'P1-2': { winner: 'NC' },
      'P1-3': { winner: 'UML' },
      'P2-1': { winner: 'RSP' },
    };
    const counts = countFPTPSeats(mockResults);
    expect(counts.NC).toBe(2);
    expect(counts.UML).toBe(1);
    expect(counts.RSP).toBe(1);
  });

  it('should return 0 for parties with no wins', () => {
    const mockResults = {
      'P1-1': { winner: 'NC' },
    };
    const counts = countFPTPSeats(mockResults);
    expect(counts.Maoist).toBe(0);
    expect(counts.RPP).toBe(0);
  });
});
