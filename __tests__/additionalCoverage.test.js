import { describe, it, expect } from 'vitest';
import { getScenarioById, PRESET_SCENARIOS } from '../data/demographicScenarios';
import { calculateNationalVoteShare } from '../utils/sainteLague';
import { getPartyColor, getPartyName } from '../utils/calculations';

// ─── getScenarioById ──────────────────────────────────────────────────────────

describe('getScenarioById', () => {
  it('should return the correct scenario for a known ID', () => {
    const scenario = getScenarioById('2022-baseline');
    expect(scenario).not.toBeNull();
    expect(scenario.id).toBe('2022-baseline');
    expect(scenario.name).toBe('2022 Baseline');
  });

  it('should return null for an unknown ID', () => {
    expect(getScenarioById('nonexistent')).toBeNull();
  });

  it('should return null for null/undefined', () => {
    expect(getScenarioById(null)).toBeNull();
    expect(getScenarioById(undefined)).toBeNull();
  });

  it('should find all preset scenarios by their IDs', () => {
    PRESET_SCENARIOS.forEach(preset => {
      const found = getScenarioById(preset.id);
      expect(found).not.toBeNull();
      expect(found.id).toBe(preset.id);
    });
  });

  it('should return the full scenario object with patterns and turnout', () => {
    const scenario = getScenarioById('youth-surge');
    expect(scenario.patterns).toBeDefined();
    expect(scenario.turnout).toBeDefined();
    expect(scenario.isPreset).toBe(true);
  });
});

// ─── calculateNationalVoteShare ───────────────────────────────────────────────

describe('calculateNationalVoteShare', () => {
  const testConstituencies = [
    {
      id: 'C1',
      totalVotes: 50000,
      results2022: { NC: 0.40, UML: 0.35, RSP: 0.25 },
    },
    {
      id: 'C2',
      totalVotes: 50000,
      results2022: { NC: 0.30, UML: 0.40, RSP: 0.30 },
    },
  ];

  it('should calculate weighted average of constituency results', () => {
    const shares = calculateNationalVoteShare(testConstituencies, {});
    // Both have equal totalVotes, so national = average
    // NC: (0.40 + 0.30) / 2 = 0.35
    // UML: (0.35 + 0.40) / 2 = 0.375
    // RSP: (0.25 + 0.30) / 2 = 0.275
    expect(shares.NC).toBeCloseTo(0.35, 5);
    expect(shares.UML).toBeCloseTo(0.375, 5);
    expect(shares.RSP).toBeCloseTo(0.275, 5);
  });

  it('should sum to ~1', () => {
    const shares = calculateNationalVoteShare(testConstituencies, {});
    const total = Object.values(shares).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('should use adjusted results when provided', () => {
    const adjusted = {
      C1: { NC: 0.50, UML: 0.30, RSP: 0.20 },
    };
    const shares = calculateNationalVoteShare(testConstituencies, adjusted);
    // C1 uses adjusted (NC=0.50), C2 uses results2022 (NC=0.30)
    // Both 50k votes, so NC = (0.50 + 0.30) / 2 = 0.40
    expect(shares.NC).toBeCloseTo(0.40, 5);
  });

  it('should weight by constituency totalVotes', () => {
    const unequalConstituencies = [
      { id: 'C1', totalVotes: 90000, results2022: { NC: 0.60, UML: 0.40 } },
      { id: 'C2', totalVotes: 10000, results2022: { NC: 0.20, UML: 0.80 } },
    ];
    const shares = calculateNationalVoteShare(unequalConstituencies, {});
    // NC: (0.60 * 90000 + 0.20 * 10000) / 100000 = (54000 + 2000) / 100000 = 0.56
    expect(shares.NC).toBeCloseTo(0.56, 5);
  });
});

// ─── getPartyColor (calculations.js) ──────────────────────────────────────────

describe('getPartyColor (calculations)', () => {
  it('should return color for NC', () => {
    const color = getPartyColor('NC');
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
    expect(color).toBe('#22c55e');
  });

  it('should return color for UML', () => {
    expect(getPartyColor('UML')).toBe('#ef4444');
  });

  it('should return color for RSP', () => {
    expect(getPartyColor('RSP')).toBe('#3b82f6');
  });

  it('should return fallback gray for unknown party', () => {
    expect(getPartyColor('UnknownParty')).toBe('#6b7280');
  });
});

// ─── getPartyName ─────────────────────────────────────────────────────────────

describe('getPartyName', () => {
  it('should return full name for NC', () => {
    expect(getPartyName('NC')).toBe('Nepali Congress');
  });

  it('should return full name for UML', () => {
    expect(getPartyName('UML')).toBe('CPN-UML');
  });

  it('should return full name for RSP', () => {
    expect(getPartyName('RSP')).toBe('Rastriya Swatantra Party');
  });

  it('should return the code itself for unknown party', () => {
    expect(getPartyName('XYZ')).toBe('XYZ');
  });

  it('should return full name for all major parties', () => {
    const majorParties = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN'];
    majorParties.forEach(code => {
      const name = getPartyName(code);
      expect(name).not.toBe(code); // Should resolve to a real name
      expect(name.length).toBeGreaterThan(2);
    });
  });
});
