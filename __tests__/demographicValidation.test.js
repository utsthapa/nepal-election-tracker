import { describe, it, expect } from 'vitest';
import {
  validateVoteShares,
  validateTurnout,
  validateConstituencyPrediction,
} from '../utils/demographicCalculator';

// ─── validateVoteShares ───────────────────────────────────────────────────────

describe('validateVoteShares', () => {
  it('should return null for valid shares summing to 100', () => {
    const shares = { NC: 30, UML: 35, RSP: 20, Others: 15 };
    expect(validateVoteShares(shares)).toBeNull();
  });

  it('should return null for shares within 1% tolerance', () => {
    const shares = { NC: 30, UML: 35, RSP: 20, Others: 15.8 };
    // Sum = 100.8, within 1%
    expect(validateVoteShares(shares)).toBeNull();
  });

  it('should warn when shares sum too high', () => {
    const shares = { NC: 40, UML: 40, RSP: 30 }; // Sum = 110
    const warning = validateVoteShares(shares);
    expect(warning).not.toBeNull();
    expect(warning.dimension).toBe('vote_shares');
    expect(warning.severity).toBe('warning');
    expect(warning.message).toContain('110');
  });

  it('should warn when shares sum too low', () => {
    const shares = { NC: 20, UML: 20, RSP: 10 }; // Sum = 50
    const warning = validateVoteShares(shares);
    expect(warning).not.toBeNull();
    expect(warning.message).toContain('50');
  });

  it('should warn for extremely high single-party share', () => {
    const shares = { NC: 85, UML: 10, RSP: 5 }; // NC > 80%
    const warning = validateVoteShares(shares);
    expect(warning).not.toBeNull();
    expect(warning.segment).toBe('NC');
    expect(warning.message).toContain('unusually high');
  });

  it('should prioritize sum warning over extreme value warning', () => {
    // If sum is off, that's checked first
    const shares = { NC: 90, UML: 50 }; // Sum = 140 AND NC > 80
    const warning = validateVoteShares(shares);
    expect(warning).not.toBeNull();
    expect(warning.dimension).toBe('vote_shares');
    expect(warning.segment).toBe('all'); // Sum issue takes priority
  });

  it('should return null for share at exactly 80%', () => {
    const shares = { NC: 80, UML: 15, RSP: 5 }; // NC = 80, not > 80
    expect(validateVoteShares(shares)).toBeNull();
  });
});

// ─── validateTurnout ──────────────────────────────────────────────────────────

describe('validateTurnout', () => {
  it('should return null for normal turnout', () => {
    expect(validateTurnout(65)).toBeNull();
    expect(validateTurnout(50)).toBeNull();
    expect(validateTurnout(80)).toBeNull();
  });

  it('should return null for boundary values', () => {
    expect(validateTurnout(30)).toBeNull();
    expect(validateTurnout(90)).toBeNull();
  });

  it('should warn for turnout below 30%', () => {
    const warning = validateTurnout(25);
    expect(warning).not.toBeNull();
    expect(warning.dimension).toBe('turnout');
    expect(warning.message).toContain('unusually low');
  });

  it('should warn for turnout above 90%', () => {
    const warning = validateTurnout(95);
    expect(warning).not.toBeNull();
    expect(warning.dimension).toBe('turnout');
    expect(warning.message).toContain('unusually high');
  });

  it('should warn for 0% turnout', () => {
    const warning = validateTurnout(0);
    expect(warning).not.toBeNull();
  });

  it('should warn for 100% turnout', () => {
    const warning = validateTurnout(100);
    expect(warning).not.toBeNull();
  });
});

// ─── validateConstituencyPrediction ───────────────────────────────────────────

describe('validateConstituencyPrediction', () => {
  it('should return empty array for valid prediction', () => {
    const prediction = {
      constituencyId: 'P1-Jhapa-1',
      voteShares: { NC: 30, UML: 35, RSP: 20, Others: 15 },
      turnout: 65,
    };
    const warnings = validateConstituencyPrediction(prediction);
    expect(warnings).toHaveLength(0);
  });

  it('should return vote share warning for invalid shares', () => {
    const prediction = {
      constituencyId: 'P1-Jhapa-1',
      voteShares: { NC: 60, UML: 60 }, // Sum = 120
      turnout: 65,
    };
    const warnings = validateConstituencyPrediction(prediction);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings.some(w => w.dimension === 'vote_shares')).toBe(true);
  });

  it('should return turnout warning for extreme turnout', () => {
    const prediction = {
      constituencyId: 'P1-Jhapa-1',
      voteShares: { NC: 50, UML: 50 },
      turnout: 95,
    };
    const warnings = validateConstituencyPrediction(prediction);
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings.some(w => w.dimension === 'turnout')).toBe(true);
  });

  it('should return multiple warnings when both are invalid', () => {
    const prediction = {
      constituencyId: 'P1-Jhapa-1',
      voteShares: { NC: 60, UML: 60 }, // Sum = 120
      turnout: 10, // Too low
    };
    const warnings = validateConstituencyPrediction(prediction);
    expect(warnings).toHaveLength(2);
  });

  it('should handle prediction with empty vote shares', () => {
    const prediction = {
      constituencyId: 'P1-Jhapa-1',
      voteShares: {},
      turnout: 65,
    };
    // Empty shares sum to 0, which is off by 100
    const warnings = validateConstituencyPrediction(prediction);
    expect(warnings.some(w => w.dimension === 'vote_shares')).toBe(true);
  });
});
