import { describe, it, expect } from 'vitest';
import {
  PRESET_SCENARIOS,
  SCENARIO_2022_BASELINE,
  SCENARIO_YOUTH_SURGE,
  createNeutralBaseline,
} from '../data/demographicScenarios';

// ─── Preset scenario structure ───────────────────────────────────────────────

describe('preset scenarios structure', () => {
  it('should have 5 preset scenarios', () => {
    expect(PRESET_SCENARIOS).toHaveLength(5);
  });

  it('every scenario should have required fields', () => {
    PRESET_SCENARIOS.forEach(scenario => {
      expect(scenario.id).toBeDefined();
      expect(typeof scenario.id).toBe('string');
      expect(scenario.name).toBeDefined();
      expect(scenario.description).toBeDefined();
      expect(scenario.isPreset).toBe(true);
      expect(scenario.patterns).toBeDefined();
      expect(scenario.turnout).toBeDefined();
    });
  });

  it('every scenario should have all 4 pattern dimensions', () => {
    PRESET_SCENARIOS.forEach(scenario => {
      expect(scenario.patterns.age).toBeDefined();
      expect(scenario.patterns.urbanRural).toBeDefined();
      expect(scenario.patterns.province).toBeDefined();
      expect(scenario.patterns.literacy).toBeDefined();
    });
  });

  it('every scenario should have all 4 turnout dimensions', () => {
    PRESET_SCENARIOS.forEach(scenario => {
      expect(scenario.turnout.age).toBeDefined();
      expect(scenario.turnout.urbanRural).toBeDefined();
      expect(scenario.turnout.province).toBeDefined();
      expect(scenario.turnout.literacy).toBeDefined();
    });
  });

  it('should have unique scenario IDs', () => {
    const ids = PRESET_SCENARIOS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Vote share sums ─────────────────────────────────────────────────────────

describe('preset scenario vote shares sum to ~100%', () => {
  const tolerance = 1.5; // allow up to 1.5% rounding

  PRESET_SCENARIOS.forEach(scenario => {
    describe(scenario.name, () => {
      // Check age patterns
      Object.entries(scenario.patterns.age).forEach(([ageGroup, shares]) => {
        it(`age/${ageGroup} shares should sum to ~100`, () => {
          const total = Object.values(shares).reduce((s, v) => s + v, 0);
          expect(Math.abs(total - 100)).toBeLessThan(tolerance);
        });
      });

      // Check urbanRural patterns
      Object.entries(scenario.patterns.urbanRural).forEach(([segment, shares]) => {
        it(`urbanRural/${segment} shares should sum to ~100`, () => {
          const total = Object.values(shares).reduce((s, v) => s + v, 0);
          expect(Math.abs(total - 100)).toBeLessThan(tolerance);
        });
      });

      // Check province patterns
      Object.entries(scenario.patterns.province).forEach(([prov, shares]) => {
        it(`province/${prov} shares should sum to ~100`, () => {
          const total = Object.values(shares).reduce((s, v) => s + v, 0);
          expect(Math.abs(total - 100)).toBeLessThan(tolerance);
        });
      });

      // Check literacy patterns
      Object.entries(scenario.patterns.literacy).forEach(([level, shares]) => {
        it(`literacy/${level} shares should sum to ~100`, () => {
          const total = Object.values(shares).reduce((s, v) => s + v, 0);
          expect(Math.abs(total - 100)).toBeLessThan(tolerance);
        });
      });
    });
  });
});

// ─── Turnout ranges ──────────────────────────────────────────────────────────

describe('preset scenario turnout rates are reasonable', () => {
  PRESET_SCENARIOS.forEach(scenario => {
    describe(scenario.name, () => {
      const allTurnouts = [
        ...Object.values(scenario.turnout.age),
        ...Object.values(scenario.turnout.urbanRural),
        ...Object.values(scenario.turnout.province),
        ...Object.values(scenario.turnout.literacy),
      ];

      it('all turnout rates should be between 30% and 90%', () => {
        allTurnouts.forEach(rate => {
          expect(rate).toBeGreaterThanOrEqual(30);
          expect(rate).toBeLessThanOrEqual(90);
        });
      });
    });
  });
});

// ─── Youth Surge scenario specifics ──────────────────────────────────────────

describe('Youth Surge scenario', () => {
  it('should have RSP as the top youth party', () => {
    const youthPattern = SCENARIO_YOUTH_SURGE.patterns.age['18-29'];
    const maxParty = Object.entries(youthPattern).sort((a, b) => b[1] - a[1])[0][0];
    expect(maxParty).toBe('RSP');
  });

  it('should have youth turnout >= 70%', () => {
    expect(SCENARIO_YOUTH_SURGE.turnout.age['18-29']).toBeGreaterThanOrEqual(70);
  });

  it('RSP youth share should be much higher than senior share', () => {
    const youthRSP = SCENARIO_YOUTH_SURGE.patterns.age['18-29'].RSP;
    const seniorRSP = SCENARIO_YOUTH_SURGE.patterns.age['60+'].RSP;
    expect(youthRSP).toBeGreaterThan(seniorRSP * 5);
  });
});

// ─── 2022 Baseline scenario specifics ────────────────────────────────────────

describe('2022 Baseline scenario', () => {
  it('UML should lead among seniors', () => {
    const seniorPattern = SCENARIO_2022_BASELINE.patterns.age['60+'];
    const maxParty = Object.entries(seniorPattern).sort((a, b) => b[1] - a[1])[0][0];
    expect(maxParty).toBe('UML');
  });

  it('NC should be competitive in urban areas', () => {
    expect(SCENARIO_2022_BASELINE.patterns.urbanRural.urban.NC).toBeGreaterThan(20);
  });
});

// ─── createNeutralBaseline ───────────────────────────────────────────────────

describe('createNeutralBaseline', () => {
  it('should create equal shares for all parties', () => {
    const parties = ['NC', 'UML', 'RSP', 'Maoist'];
    const baseline = createNeutralBaseline(parties);
    const expectedShare = 25; // 100/4

    Object.values(baseline.patterns.age).forEach(shares => {
      parties.forEach(party => {
        expect(shares[party]).toBe(expectedShare);
      });
    });
  });

  it('should set all turnouts to 65%', () => {
    const baseline = createNeutralBaseline(['NC', 'UML']);
    Object.values(baseline.turnout.age).forEach(rate => {
      expect(rate).toBe(65);
    });
    Object.values(baseline.turnout.province).forEach(rate => {
      expect(rate).toBe(65);
    });
  });

  it('should have all 7 provinces in patterns', () => {
    const baseline = createNeutralBaseline(['A', 'B']);
    expect(Object.keys(baseline.patterns.province)).toHaveLength(7);
  });

  it('should have all age groups', () => {
    const baseline = createNeutralBaseline(['A', 'B']);
    expect(baseline.patterns.age['18-29']).toBeDefined();
    expect(baseline.patterns.age['30-44']).toBeDefined();
    expect(baseline.patterns.age['45-59']).toBeDefined();
    expect(baseline.patterns.age['60+']).toBeDefined();
  });

  it('should have all literacy levels', () => {
    const baseline = createNeutralBaseline(['A', 'B']);
    expect(baseline.patterns.literacy.high).toBeDefined();
    expect(baseline.patterns.literacy.medium).toBeDefined();
    expect(baseline.patterns.literacy.low).toBeDefined();
  });

  it('shares should sum to 100 for any number of parties', () => {
    [2, 5, 11].forEach(n => {
      const parties = Array.from({ length: n }, (_, i) => `P${i}`);
      const baseline = createNeutralBaseline(parties);
      const total = Object.values(baseline.patterns.age['18-29']).reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(100, 5);
    });
  });
});
