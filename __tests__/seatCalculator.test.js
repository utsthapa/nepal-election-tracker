import { describe, it, expect } from 'vitest';
import { calculateRequiredSwing } from '../utils/seatCalculator';

/**
 * Build a minimal FPTP results fixture.
 * applyUniformSwing uses `result.adjusted || result.results2022`.
 * countFPTPSeats reads `.winner` from each constituency.
 */

// NC wins both constituencies easily
const ncDominantFptp = {
  'C1': {
    results2022: { NC: 0.55, UML: 0.30, RSP: 0.15 },
    winner: 'NC',
    margin: 0.25,
    totalVotes: 50000,
  },
  'C2': {
    results2022: { NC: 0.60, UML: 0.25, RSP: 0.15 },
    winner: 'NC',
    margin: 0.35,
    totalVotes: 60000,
  },
};

// UML wins both; NC has near-zero share
const umlDominantFptp = {
  'C1': {
    results2022: { NC: 0.05, UML: 0.70, RSP: 0.25 },
    winner: 'UML',
    margin: 0.65,
    totalVotes: 50000,
  },
  'C2': {
    results2022: { NC: 0.05, UML: 0.75, RSP: 0.20 },
    winner: 'UML',
    margin: 0.70,
    totalVotes: 60000,
  },
};

// NC wins 1, UML wins 1
const splitFptp = {
  'C1': {
    results2022: { NC: 0.55, UML: 0.30, RSP: 0.15 },
    winner: 'NC',
    margin: 0.25,
    totalVotes: 50000,
  },
  'C2': {
    results2022: { NC: 0.30, UML: 0.55, RSP: 0.15 },
    winner: 'UML',
    margin: 0.25,
    totalVotes: 55000,
  },
};

// ─── calculateRequiredSwing ──────────────────────────────────────────────────

describe('calculateRequiredSwing', () => {
  it('already at or above target → requiredSwing: 0, possible: true', () => {
    const currentSeats = { NC: 2, UML: 0 };
    const result = calculateRequiredSwing('NC', 2, ncDominantFptp, currentSeats);
    expect(result.requiredSwing).toBe(0);
    expect(result.possible).toBe(true);
    expect(result.achievedSeats).toBeGreaterThanOrEqual(2);
  });

  it('above target → requiredSwing: 0', () => {
    const currentSeats = { NC: 3, UML: 0 };
    const result = calculateRequiredSwing('NC', 1, ncDominantFptp, currentSeats);
    expect(result.requiredSwing).toBe(0);
    expect(result.possible).toBe(true);
  });

  it('needs swing → returns positive requiredSwing', () => {
    const currentSeats = { NC: 1, UML: 1 };
    // NC needs 2 seats but only has 1; should need some positive swing
    const result = calculateRequiredSwing('NC', 2, splitFptp, currentSeats);
    expect(result.possible).toBe(true);
    expect(result.requiredSwing).toBeGreaterThan(0);
    expect(result.achievedSeats).toBeGreaterThanOrEqual(2);
  });

  it('achievedSeats always >= targetSeats when possible: true', () => {
    const currentSeats = { NC: 1, UML: 1 };
    const result = calculateRequiredSwing('NC', 2, splitFptp, currentSeats);
    if (result.possible) {
      expect(result.achievedSeats).toBeGreaterThanOrEqual(2);
    }
  });

  it('impossible target → possible: false', () => {
    // Only 2 constituencies exist, so NC can never reach 3 FPTP seats
    const currentSeats = { NC: 0, UML: 2 };
    const result = calculateRequiredSwing('NC', 3, umlDominantFptp, currentSeats);
    expect(result.possible).toBe(false);
  });

  it('impossible → requiredSwing is 30 (the search ceiling)', () => {
    const currentSeats = { NC: 0, UML: 2 };
    const result = calculateRequiredSwing('NC', 3, umlDominantFptp, currentSeats);
    expect(result.requiredSwing).toBe(30);
  });

  it('party with zero seats and target 0 → requiredSwing: 0, possible: true', () => {
    // Already "at" target (0 seats needed, 0 seats held)
    const currentSeats = { NC: 0, UML: 2 };
    const result = calculateRequiredSwing('NC', 0, umlDominantFptp, currentSeats);
    expect(result.requiredSwing).toBe(0);
    expect(result.possible).toBe(true);
  });

  it('requiredSwing is a number rounded to 1 decimal place', () => {
    const currentSeats = { NC: 1, UML: 1 };
    const result = calculateRequiredSwing('NC', 2, splitFptp, currentSeats);
    if (result.requiredSwing !== 0) {
      // Check it's rounded to 1 decimal (x * 10 is integer)
      expect(result.requiredSwing * 10).toBeCloseTo(Math.round(result.requiredSwing * 10), 5);
    }
  });
});
