import { describe, it, expect } from 'vitest';
import { applyUniformSwing, calculateSeatChanges } from '../utils/swingCalculator';

// Minimal FPTP results fixture (shares as fractions summing to 1)
const baseFptp = {
  C1: {
    results2022: { NC: 0.40, UML: 0.35, RSP: 0.15, Maoist: 0.10 },
    totalVotes: 50000,
  },
  C2: {
    results2022: { NC: 0.30, UML: 0.40, RSP: 0.20, Maoist: 0.10 },
    totalVotes: 60000,
  },
};

// ─── applyUniformSwing ───────────────────────────────────────────────────────

describe('applyUniformSwing', () => {
  it('zero swing → shares unchanged and still sum to 1', () => {
    const result = applyUniformSwing(baseFptp, {});
    Object.values(result).forEach(({ adjusted }) => {
      const total = Object.values(adjusted).reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(1, 5);
    });
  });

  it('positive swing increases target party relative share after renormalization', () => {
    const base = applyUniformSwing(baseFptp, {});
    const swung = applyUniformSwing(baseFptp, { NC: 10 }); // +10pp for NC
    expect(swung.C1.adjusted.NC).toBeGreaterThan(base.C1.adjusted.NC);
  });

  it('shares always renormalize to sum to 1 after swing', () => {
    const result = applyUniformSwing(baseFptp, { NC: 20, UML: -5 });
    Object.values(result).forEach(({ adjusted }) => {
      const total = Object.values(adjusted).reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(1, 5);
    });
  });

  it('large negative swing clamps at 0, never produces negative shares', () => {
    const result = applyUniformSwing(baseFptp, { RSP: -100 }); // wipe out RSP
    Object.values(result).forEach(({ adjusted }) => {
      Object.values(adjusted).forEach(share => {
        expect(share).toBeGreaterThanOrEqual(0);
      });
    });
  });

  it('100% monopoly + zero swing → party still has 100%', () => {
    const monopoly = {
      C1: { results2022: { NC: 1.0 }, totalVotes: 40000 },
    };
    const result = applyUniformSwing(monopoly, {});
    expect(result.C1.adjusted.NC).toBeCloseTo(1, 5);
  });

  it('100% monopoly + positive swing for that party → still 100%', () => {
    const monopoly = {
      C1: { results2022: { NC: 1.0 }, totalVotes: 40000 },
    };
    const result = applyUniformSwing(monopoly, { NC: 15 });
    expect(result.C1.adjusted.NC).toBeCloseTo(1, 5);
  });

  it('winner field reflects the dominant party after swing', () => {
    // NC is dominant in C1; a large boost should keep it winning
    const result = applyUniformSwing(baseFptp, { NC: 15 });
    expect(result.C1.winner).toBe('NC');
  });

  it('preserves all other result fields (totalVotes etc.)', () => {
    const result = applyUniformSwing(baseFptp, { NC: 5 });
    expect(result.C1.totalVotes).toBe(50000);
    expect(result.C2.totalVotes).toBe(60000);
  });
});

// ─── calculateSeatChanges ────────────────────────────────────────────────────

describe('calculateSeatChanges', () => {
  it('same seat counts → empty changes object', () => {
    const seats = { NC: 57, UML: 44, RSP: 20 };
    expect(calculateSeatChanges(seats, seats)).toEqual({});
  });

  it('party gains seats → positive change', () => {
    const changes = calculateSeatChanges({ NC: 57 }, { NC: 62 });
    expect(changes.NC).toBe(5);
  });

  it('party loses seats → negative change', () => {
    const changes = calculateSeatChanges({ UML: 44 }, { UML: 40 });
    expect(changes.UML).toBe(-4);
  });

  it('new party appears → positive change', () => {
    const changes = calculateSeatChanges({ NC: 57 }, { NC: 57, RSP: 10 });
    expect(changes.RSP).toBe(10);
  });

  it('party drops to zero → negative change equal to baseline seats', () => {
    const changes = calculateSeatChanges({ Maoist: 18 }, {});
    expect(changes.Maoist).toBe(-18);
  });

  it('no zero-diff entries are included in output', () => {
    const changes = calculateSeatChanges({ NC: 57, UML: 44 }, { NC: 60, UML: 44 });
    expect(Object.keys(changes)).not.toContain('UML');
  });
});
