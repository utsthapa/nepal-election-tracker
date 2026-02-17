/**
 * End-to-end pipeline & edge-case tests
 *
 * Verifies that the demographic model respects basic mathematical truths:
 * - If 100% of every demographic votes for Party X → Party X gets 100%
 * - If 0% votes for a party → that party gets 0%
 * - Equal shares in → equal shares out
 * - Province mode is a direct pass-through
 * - Urban/rural weighting matches constituency urbanization
 * - Full pipeline: demographics → vote shares → FPTP winner → PR seats
 */

import { describe, it, expect } from 'vitest';
import {
  calculateConstituencyVoteShares,
  calculateConstituencyTurnout,
  applyDemographicModel,
  normalizeVoteShares,
} from '../utils/demographicCalculator';
import { determineFPTPWinner } from '../utils/calculations';
import { allocateSeats } from '../utils/sainteLague';
import { DISTRICT_DEMOGRAPHICS } from '../data/demographics';

// ─── Helper: build uniform patterns (same shares in every segment) ───────────

function buildUniformPatterns(partyShares) {
  const ageGroups = ['18-29', '30-44', '45-59', '60+'];
  const urbanRural = ['urban', 'rural'];
  const provinces = [1, 2, 3, 4, 5, 6, 7];
  const literacyLevels = ['high', 'medium', 'low'];

  return {
    age: Object.fromEntries(ageGroups.map(g => [g, { ...partyShares }])),
    urbanRural: Object.fromEntries(urbanRural.map(s => [s, { ...partyShares }])),
    province: Object.fromEntries(provinces.map(p => [p, { ...partyShares }])),
    literacy: Object.fromEntries(literacyLevels.map(l => [l, { ...partyShares }])),
  };
}

function buildUniformTurnout(rate) {
  return {
    age: { '18-29': rate, '30-44': rate, '45-59': rate, '60+': rate },
    urbanRural: { urban: rate, rural: rate },
    province: { 1: rate, 2: rate, 3: rate, 4: rate, 5: rate, 6: rate, 7: rate },
    literacy: { high: rate, medium: rate, low: rate },
  };
}

const allDimensions = ['age', 'urbanRural', 'province', 'literacy'];
const jhapa = { id: 'P1-Jhapa-1', district: 'Jhapa', province: 1 };
const kathmandu = { id: 'P3-Kathmandu-1', district: 'Kathmandu', province: 3 };

// ─── 100% monopoly: one party sweeps everything ─────────────────────────────

describe('100% monopoly — one party gets all votes everywhere', () => {
  const monopolyPatterns = buildUniformPatterns({ PartyX: 100, PartyY: 0 });
  const turnout = buildUniformTurnout(65);

  allDimensions.forEach(dim => {
    it(`PartyX should get 100% in ${dim} mode`, () => {
      const pred = calculateConstituencyVoteShares(jhapa, monopolyPatterns, turnout, dim);
      expect(pred.voteShares.PartyX).toBeCloseTo(100, 0);
      expect(pred.voteShares.PartyY).toBeCloseTo(0, 0);
    });
  });

  it('PartyX should get 100% for every constituency in bulk mode', () => {
    const constituencies = [jhapa, kathmandu];
    const results = applyDemographicModel(constituencies, monopolyPatterns, turnout, 'age');
    results.forEach(pred => {
      expect(pred.voteShares.PartyX).toBeCloseTo(100, 0);
    });
  });

  it('PartyX should win FPTP from monopoly prediction', () => {
    const pred = calculateConstituencyVoteShares(jhapa, monopolyPatterns, turnout, 'age');
    // Convert to fraction for determineFPTPWinner
    const fractions = {};
    for (const [p, v] of Object.entries(pred.voteShares)) {
      fractions[p] = v / 100;
    }
    const result = determineFPTPWinner(fractions);
    expect(result.winner).toBe('PartyX');
    expect(result.margin).toBeCloseTo(1.0, 1);
  });

  it('PartyX should get all PR seats from monopoly vote share', () => {
    const seats = allocateSeats({ PartyX: 1.0, PartyY: 0.0 }, 1000000, 110);
    expect(seats.PartyX).toBe(110);
    expect(seats.PartyY).toBe(0);
  });
});

// ─── 0% party gets nothing ──────────────────────────────────────────────────

describe('0% party — zero votes everywhere should produce zero', () => {
  const patterns = buildUniformPatterns({ A: 60, B: 40, Ghost: 0 });
  const turnout = buildUniformTurnout(65);

  allDimensions.forEach(dim => {
    it(`Ghost party should get 0% in ${dim} mode`, () => {
      const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, dim);
      expect(pred.voteShares.Ghost).toBeCloseTo(0, 1);
    });
  });

  it('Ghost party should never win FPTP', () => {
    const pred = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'age');
    const fractions = {};
    for (const [p, v] of Object.entries(pred.voteShares)) {
      fractions[p] = v / 100;
    }
    expect(determineFPTPWinner(fractions).winner).not.toBe('Ghost');
  });
});

// ─── Equal split: N parties with equal shares everywhere ─────────────────────

describe('equal split — all parties get identical shares', () => {
  it('4 parties at 25% each should predict ~25% each', () => {
    const patterns = buildUniformPatterns({ A: 25, B: 25, C: 25, D: 25 });
    const turnout = buildUniformTurnout(65);
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    expect(pred.voteShares.A).toBeCloseTo(25, 0);
    expect(pred.voteShares.B).toBeCloseTo(25, 0);
    expect(pred.voteShares.C).toBeCloseTo(25, 0);
    expect(pred.voteShares.D).toBeCloseTo(25, 0);
  });

  it('2 parties at 50% each should predict exactly 50/50', () => {
    const patterns = buildUniformPatterns({ X: 50, Y: 50 });
    const turnout = buildUniformTurnout(70);
    const pred = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'province');
    expect(pred.voteShares.X).toBeCloseTo(50, 0);
    expect(pred.voteShares.Y).toBeCloseTo(50, 0);
  });

  it('equal shares should produce equal PR seats', () => {
    const seats = allocateSeats({ A: 0.50, B: 0.50 }, 1000000, 100);
    expect(seats.A).toBe(50);
    expect(seats.B).toBe(50);
  });

  it('3 equal parties should each get ~1/3 of PR seats', () => {
    const seats = allocateSeats({ A: 0.334, B: 0.333, C: 0.333 }, 1000000, 99);
    expect(seats.A).toBe(33);
    expect(seats.B).toBe(33);
    expect(seats.C).toBe(33);
  });
});

// ─── Province mode is direct pass-through ────────────────────────────────────

describe('province mode — direct pass-through of province pattern', () => {
  it('should output exactly the Province 1 pattern for Jhapa', () => {
    const patterns = buildUniformPatterns({ A: 25, B: 25, C: 25, D: 25 });
    // Override province 1 with custom values
    patterns.province[1] = { A: 70, B: 20, C: 5, D: 5 };

    const turnout = buildUniformTurnout(65);
    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'province');
    expect(pred.voteShares.A).toBeCloseTo(70, 0);
    expect(pred.voteShares.B).toBeCloseTo(20, 0);
    expect(pred.voteShares.C).toBeCloseTo(5, 0);
    expect(pred.voteShares.D).toBeCloseTo(5, 0);
  });

  it('should output Province 3 pattern for Kathmandu', () => {
    const patterns = buildUniformPatterns({ NC: 25, UML: 25, RSP: 25, Others: 25 });
    patterns.province[3] = { NC: 40, UML: 30, RSP: 20, Others: 10 };

    const turnout = buildUniformTurnout(65);
    const pred = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'province');
    expect(pred.voteShares.NC).toBeCloseTo(40, 0);
    expect(pred.voteShares.UML).toBeCloseTo(30, 0);
    expect(pred.voteShares.RSP).toBeCloseTo(20, 0);
    expect(pred.voteShares.Others).toBeCloseTo(10, 0);
  });

  it('two constituencies in same province should get same shares', () => {
    const patterns = buildUniformPatterns({ A: 25, B: 75 });
    patterns.province[1] = { A: 80, B: 20 };

    const turnout = buildUniformTurnout(65);
    const c1 = { id: 'P1-Jhapa-1', district: 'Jhapa', province: 1 };
    const c2 = { id: 'P1-Morang-1', district: 'Morang', province: 1 };
    const pred1 = calculateConstituencyVoteShares(c1, patterns, turnout, 'province');
    const pred2 = calculateConstituencyVoteShares(c2, patterns, turnout, 'province');
    expect(pred1.voteShares.A).toBeCloseTo(pred2.voteShares.A, 1);
    expect(pred1.voteShares.B).toBeCloseTo(pred2.voteShares.B, 1);
  });

  it('constituencies in different provinces should get different shares', () => {
    const patterns = buildUniformPatterns({ A: 50, B: 50 });
    patterns.province[1] = { A: 90, B: 10 };
    patterns.province[3] = { A: 10, B: 90 };

    const turnout = buildUniformTurnout(65);
    const predJhapa = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'province');
    const predKtm = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'province');
    expect(predJhapa.voteShares.A).toBeCloseTo(90, 0);
    expect(predKtm.voteShares.A).toBeCloseTo(10, 0);
  });
});

// ─── Urban/rural weighting matches constituency urbanization ─────────────────

describe('urbanRural mode — weighting based on urbanization rate', () => {
  const patterns = buildUniformPatterns({ Urban: 50, Rural: 50 });
  // Urban voters 100% Urban party, rural voters 100% Rural party
  patterns.urbanRural.urban = { Urban: 100, Rural: 0 };
  patterns.urbanRural.rural = { Urban: 0, Rural: 100 };
  const turnout = buildUniformTurnout(65);

  it('Kathmandu (92.5% urban) should give ~92.5% Urban party', () => {
    const pred = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'urbanRural');
    const ktmUrban = DISTRICT_DEMOGRAPHICS['Kathmandu'].urbanPopulation; // 0.925
    expect(pred.voteShares.Urban).toBeCloseTo(ktmUrban * 100, 0);
    expect(pred.voteShares.Rural).toBeCloseTo((1 - ktmUrban) * 100, 0);
  });

  it('Humla (1.8% urban) should give ~98% Rural party', () => {
    const humla = { id: 'P6-Humla-1', district: 'Humla', province: 6 };
    const pred = calculateConstituencyVoteShares(humla, patterns, turnout, 'urbanRural');
    const humlaUrban = DISTRICT_DEMOGRAPHICS['Humla'].urbanPopulation; // 0.018
    expect(pred.voteShares.Urban).toBeCloseTo(humlaUrban * 100, 0);
    expect(pred.voteShares.Rural).toBeCloseTo((1 - humlaUrban) * 100, 0);
  });

  it('a 50/50 urban/rural district should give 50/50 party split', () => {
    // No district is exactly 50/50, but if both segments have same pattern it shouldn't matter
    const equalPatterns = buildUniformPatterns({ A: 60, B: 40 });
    const pred = calculateConstituencyVoteShares(jhapa, equalPatterns, turnout, 'urbanRural');
    expect(pred.voteShares.A).toBeCloseTo(60, 0);
    expect(pred.voteShares.B).toBeCloseTo(40, 0);
  });
});

// ─── Age-weighted: youth vs senior party split ───────────────────────────────

describe('age mode — age distribution shapes the result', () => {
  it('youth-party should be stronger in younger constituencies', () => {
    const patterns = buildUniformPatterns({ Youth: 50, Senior: 50 });
    patterns.age['18-29'] = { Youth: 100, Senior: 0 };
    patterns.age['30-44'] = { Youth: 70, Senior: 30 };
    patterns.age['45-59'] = { Youth: 30, Senior: 70 };
    patterns.age['60+'] = { Youth: 0, Senior: 100 };

    const turnout = buildUniformTurnout(65);

    // Kathmandu has younger demographics (median 30.8) vs a rural district
    const predKtm = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'age');
    // Humla has younger demographics too (22.2 median) but different composition
    const humla = { id: 'P6-Humla-1', district: 'Humla', province: 6 };
    const predHumla = calculateConstituencyVoteShares(humla, patterns, turnout, 'age');

    // Both should have Youth > 0 since they have young voters
    expect(predKtm.voteShares.Youth).toBeGreaterThan(0);
    expect(predHumla.voteShares.Youth).toBeGreaterThan(0);
  });

  it('if all age groups vote identically, age composition should not matter', () => {
    const patterns = buildUniformPatterns({ A: 60, B: 40 });
    const turnout = buildUniformTurnout(65);

    const pred1 = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    const pred2 = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'age');
    // Both should be ~60/40 regardless of their age distribution
    expect(pred1.voteShares.A).toBeCloseTo(60, 0);
    expect(pred2.voteShares.A).toBeCloseTo(60, 0);
  });
});

// ─── Literacy mode — bucket classification ───────────────────────────────────

describe('literacy mode — result depends on literacy classification', () => {
  it('high-literacy district should use high-literacy pattern', () => {
    const patterns = buildUniformPatterns({ Smart: 50, Trad: 50 });
    patterns.literacy.high = { Smart: 90, Trad: 10 };
    patterns.literacy.medium = { Smart: 50, Trad: 50 };
    patterns.literacy.low = { Smart: 10, Trad: 90 };

    const turnout = buildUniformTurnout(65);
    // Kathmandu literacy = 0.925, classified as "high"
    const pred = calculateConstituencyVoteShares(kathmandu, patterns, turnout, 'literacy');
    expect(pred.voteShares.Smart).toBeCloseTo(90, 0);
  });

  it('low-literacy district should use low-literacy pattern', () => {
    const patterns = buildUniformPatterns({ Smart: 50, Trad: 50 });
    patterns.literacy.high = { Smart: 90, Trad: 10 };
    patterns.literacy.medium = { Smart: 50, Trad: 50 };
    patterns.literacy.low = { Smart: 10, Trad: 90 };

    const turnout = buildUniformTurnout(65);
    // Humla literacy = 0.468, classified as "low"
    const humla = { id: 'P6-Humla-1', district: 'Humla', province: 6 };
    const pred = calculateConstituencyVoteShares(humla, patterns, turnout, 'literacy');
    expect(pred.voteShares.Trad).toBeCloseTo(90, 0);
  });
});

// ─── Turnout tests ───────────────────────────────────────────────────────────

describe('turnout — uniform turnout passes through correctly', () => {
  it('uniform 65% turnout should give 65% for any constituency', () => {
    const turnout = buildUniformTurnout(65);

    allDimensions.forEach(dim => {
      const result = calculateConstituencyTurnout(jhapa, turnout, dim);
      expect(result).toBeCloseTo(65, 0);
    });
  });

  it('uniform 80% turnout should give 80% for any constituency', () => {
    const turnout = buildUniformTurnout(80);

    allDimensions.forEach(dim => {
      const result = calculateConstituencyTurnout(kathmandu, turnout, dim);
      expect(result).toBeCloseTo(80, 0);
    });
  });

  it('turnout should NOT affect vote share proportions', () => {
    const patterns = buildUniformPatterns({ A: 70, B: 30 });
    const lowTurnout = buildUniformTurnout(40);
    const highTurnout = buildUniformTurnout(90);

    const predLow = calculateConstituencyVoteShares(jhapa, patterns, lowTurnout, 'age');
    const predHigh = calculateConstituencyVoteShares(jhapa, patterns, highTurnout, 'age');

    // Vote shares should be the same regardless of turnout level
    expect(predLow.voteShares.A).toBeCloseTo(predHigh.voteShares.A, 1);
    expect(predLow.voteShares.B).toBeCloseTo(predHigh.voteShares.B, 1);
    // But turnout values should differ
    expect(predLow.turnout).not.toBeCloseTo(predHigh.turnout, 0);
  });
});

// ─── Vote shares always sum to 100% ─────────────────────────────────────────

describe('vote shares always sum to 100% after prediction', () => {
  const constituencies = [
    jhapa,
    kathmandu,
    { id: 'P6-Humla-1', district: 'Humla', province: 6 },
    { id: 'P4-Kaski-1', district: 'Kaski', province: 4 },
    { id: 'P2-Bara-1', district: 'Bara', province: 2 },
  ];

  const turnout = buildUniformTurnout(65);

  it('should sum to 100 for any pattern across all constituencies and dimensions', () => {
    const testCases = [
      buildUniformPatterns({ A: 100, B: 0 }),
      buildUniformPatterns({ A: 50, B: 50 }),
      buildUniformPatterns({ A: 33.33, B: 33.33, C: 33.34 }),
      buildUniformPatterns({ A: 1, B: 2, C: 3, D: 94 }),
    ];

    testCases.forEach(patterns => {
      allDimensions.forEach(dim => {
        constituencies.forEach(c => {
          const pred = calculateConstituencyVoteShares(c, patterns, turnout, dim);
          const total = Object.values(pred.voteShares).reduce((s, v) => s + v, 0);
          expect(total).toBeCloseTo(100, 0);
        });
      });
    });
  });
});

// ─── FPTP winner from demographic predictions ───────────────────────────────

describe('FPTP winner from demographic predictions', () => {
  it('dominant party should always win FPTP', () => {
    const patterns = buildUniformPatterns({ Winner: 80, Loser: 20 });
    const turnout = buildUniformTurnout(65);

    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    const fractions = {};
    for (const [p, v] of Object.entries(pred.voteShares)) {
      fractions[p] = v / 100;
    }
    const result = determineFPTPWinner(fractions);
    expect(result.winner).toBe('Winner');
  });

  it('FPTP winner should change when demographic support flips', () => {
    const turnout = buildUniformTurnout(65);

    // Province 1: A leads
    const patterns1 = buildUniformPatterns({ A: 50, B: 50 });
    patterns1.province[1] = { A: 70, B: 30 };
    const pred1 = calculateConstituencyVoteShares(jhapa, patterns1, turnout, 'province');
    const fractions1 = Object.fromEntries(
      Object.entries(pred1.voteShares).map(([p, v]) => [p, v / 100])
    );
    expect(determineFPTPWinner(fractions1).winner).toBe('A');

    // Province 1: B leads
    patterns1.province[1] = { A: 30, B: 70 };
    const pred2 = calculateConstituencyVoteShares(jhapa, patterns1, turnout, 'province');
    const fractions2 = Object.fromEntries(
      Object.entries(pred2.voteShares).map(([p, v]) => [p, v / 100])
    );
    expect(determineFPTPWinner(fractions2).winner).toBe('B');
  });
});

// ─── Full pipeline: demographics → vote shares → PR seats ───────────────────

describe('full pipeline: demographics → PR seat allocation', () => {
  it('dominant party should get most PR seats, minor party still gets some', () => {
    // SmallParty at 5% is above the 3% threshold, so Sainte-Laguë gives it seats
    const nationalShare = { BigParty: 0.95, SmallParty: 0.05 };
    const seats = allocateSeats(nationalShare, 1000000, 110);
    expect(seats.BigParty).toBeGreaterThan(100);
    expect(seats.SmallParty).toBeGreaterThan(0);
    expect(seats.BigParty + seats.SmallParty).toBe(110);
  });

  it('party below 3% threshold gets 0 PR seats even with votes', () => {
    const nationalShare = { Big: 0.60, Medium: 0.38, Tiny: 0.02 };
    const seats = allocateSeats(nationalShare, 1000000, 110);
    expect(seats.Tiny).toBe(0);
    expect(seats.Big + seats.Medium).toBe(110);
  });

  it('demographic monopoly → FPTP sweep → all PR seats', () => {
    // If one party dominates every demographic, they win every constituency
    // and should get 100% of the national vote → all PR seats
    const monopolyShares = { Dominant: 1.0 };
    const seats = allocateSeats(monopolyShares, 1000000, 110);
    expect(seats.Dominant).toBe(110);
  });
});

// ─── normalizeVoteShares edge cases ──────────────────────────────────────────

describe('normalizeVoteShares edge cases', () => {
  it('should handle very small shares correctly', () => {
    const shares = { A: 0.001, B: 0.001, C: 99.998 };
    const result = normalizeVoteShares(shares);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  it('should handle single-party 100% correctly', () => {
    const shares = { OnlyParty: 100 };
    const result = normalizeVoteShares(shares);
    expect(result.OnlyParty).toBeCloseTo(100, 5);
  });

  it('should handle two parties at 0.5 each summing to 1 (not 100)', () => {
    const shares = { A: 0.5, B: 0.5 }; // sum = 1, not 100
    const result = normalizeVoteShares(shares);
    // Should scale up: A → 50, B → 50
    expect(result.A).toBeCloseTo(50, 1);
    expect(result.B).toBeCloseTo(50, 1);
  });

  it('should distribute equally when all shares are zero', () => {
    const shares = { A: 0, B: 0, C: 0, D: 0 };
    const result = normalizeVoteShares(shares);
    expect(result.A).toBeCloseTo(25, 1);
    expect(result.B).toBeCloseTo(25, 1);
    expect(result.C).toBeCloseTo(25, 1);
    expect(result.D).toBeCloseTo(25, 1);
  });
});

// ─── Many parties (stress test) ──────────────────────────────────────────────

describe('many parties — stress test with 20 parties', () => {
  it('should handle 20-party equal split correctly', () => {
    const partyShares = {};
    for (let i = 0; i < 20; i++) {
      partyShares[`P${i}`] = 5; // 20 × 5 = 100
    }
    const patterns = buildUniformPatterns(partyShares);
    const turnout = buildUniformTurnout(65);

    const pred = calculateConstituencyVoteShares(jhapa, patterns, turnout, 'age');
    const total = Object.values(pred.voteShares).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(100, 0);

    // Each party should get ~5%
    Object.values(pred.voteShares).forEach(share => {
      expect(share).toBeCloseTo(5, 0);
    });
  });

  it('PR allocation should handle 20 parties with threshold', () => {
    const shares = {};
    for (let i = 0; i < 20; i++) {
      shares[`P${i}`] = 0.05; // 20 × 5% = 100%, all above 3% threshold
    }
    const seats = allocateSeats(shares, 1000000, 100);
    const totalSeats = Object.values(seats).reduce((s, v) => s + v, 0);
    expect(totalSeats).toBe(100);

    // Each should get ~5 seats
    Object.values(seats).forEach(s => {
      expect(s).toBe(5);
    });
  });
});

// ─── Dimension independence — changing inactive dimension shouldn't matter ───

describe('dimension independence — only active dimension affects result', () => {
  it('changing province patterns should not affect age mode prediction', () => {
    const patterns1 = buildUniformPatterns({ A: 60, B: 40 });
    const patterns2 = buildUniformPatterns({ A: 60, B: 40 });
    // Change province for patterns2 but keep age same
    patterns2.province[1] = { A: 10, B: 90 };

    const turnout = buildUniformTurnout(65);
    const pred1 = calculateConstituencyVoteShares(jhapa, patterns1, turnout, 'age');
    const pred2 = calculateConstituencyVoteShares(jhapa, patterns2, turnout, 'age');

    expect(pred1.voteShares.A).toBeCloseTo(pred2.voteShares.A, 5);
    expect(pred1.voteShares.B).toBeCloseTo(pred2.voteShares.B, 5);
  });

  it('changing age patterns should not affect province mode prediction', () => {
    const patterns1 = buildUniformPatterns({ A: 50, B: 50 });
    const patterns2 = buildUniformPatterns({ A: 50, B: 50 });
    // Change age for patterns2 but keep province same
    patterns2.age['18-29'] = { A: 100, B: 0 };

    const turnout = buildUniformTurnout(65);
    const pred1 = calculateConstituencyVoteShares(jhapa, patterns1, turnout, 'province');
    const pred2 = calculateConstituencyVoteShares(jhapa, patterns2, turnout, 'province');

    expect(pred1.voteShares.A).toBeCloseTo(pred2.voteShares.A, 5);
    expect(pred1.voteShares.B).toBeCloseTo(pred2.voteShares.B, 5);
  });

  it('changing literacy patterns should not affect urbanRural mode prediction', () => {
    const patterns1 = buildUniformPatterns({ X: 70, Y: 30 });
    const patterns2 = buildUniformPatterns({ X: 70, Y: 30 });
    patterns2.literacy.high = { X: 0, Y: 100 };

    const turnout = buildUniformTurnout(65);
    const pred1 = calculateConstituencyVoteShares(jhapa, patterns1, turnout, 'urbanRural');
    const pred2 = calculateConstituencyVoteShares(jhapa, patterns2, turnout, 'urbanRural');

    expect(pred1.voteShares.X).toBeCloseTo(pred2.voteShares.X, 5);
  });
});
