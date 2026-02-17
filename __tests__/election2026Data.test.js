import { describe, it, expect } from 'vitest';
import {
  get2026Candidates,
  getPartyColor,
  getBattlegroundInfo,
  get2026ElectionData,
} from '../utils/election2026Data';

// ─── getPartyColor ────────────────────────────────────────────────────────────

describe('getPartyColor (2026)', () => {
  it('should return green for Nepali Congress', () => {
    expect(getPartyColor('Nepali Congress')).toBe('#22c55e');
  });

  it('should return red for UML', () => {
    expect(getPartyColor('Communist Party of Nepal (Unified Marxist-Leninist)')).toBe('#ef4444');
  });

  it('should return blue for RSP', () => {
    expect(getPartyColor('Rastriya Swatantra Party')).toBe('#3b82f6');
  });

  it('should return fallback gray for unknown party', () => {
    expect(getPartyColor('Made Up Party')).toBe('#6b7280');
  });

  it('should return a hex color for every known party', () => {
    const knownParties = [
      'Nepali Congress',
      'Communist Party of Nepal (Unified Marxist-Leninist)',
      'Rastriya Swatantra Party',
      'Rastriya Prajatantra Party',
      'CPN-Maoist Centre',
    ];
    knownParties.forEach(party => {
      expect(getPartyColor(party)).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});

// ─── get2026ElectionData ──────────────────────────────────────────────────────

describe('get2026ElectionData', () => {
  it('should return an object with parties array', () => {
    const data = get2026ElectionData();
    expect(data).toBeDefined();
    expect(Array.isArray(data.parties)).toBe(true);
    expect(data.parties.length).toBeGreaterThan(0);
  });

  it('should return an object with key_battlegrounds array', () => {
    const data = get2026ElectionData();
    expect(Array.isArray(data.key_battlegrounds)).toBe(true);
  });

  it('every party should have name and abbreviation', () => {
    const data = get2026ElectionData();
    data.parties.forEach(party => {
      expect(party.name).toBeDefined();
      expect(typeof party.name).toBe('string');
      expect(party.abbreviation).toBeDefined();
    });
  });
});

// ─── get2026Candidates ────────────────────────────────────────────────────────

describe('get2026Candidates', () => {
  it('should return an empty array for null/undefined input', () => {
    expect(get2026Candidates(null)).toEqual([]);
    expect(get2026Candidates(undefined)).toEqual([]);
    expect(get2026Candidates('')).toEqual([]);
  });

  it('should return an empty array for non-existent constituency', () => {
    const candidates = get2026Candidates('Nonexistent-99');
    expect(candidates).toEqual([]);
  });

  it('should return candidate objects with required fields', () => {
    // Find a constituency from the data
    const data = get2026ElectionData();
    let testConstituency = null;
    for (const party of data.parties) {
      if (party.key_candidates && party.key_candidates.length > 0) {
        testConstituency = party.key_candidates[0].constituency;
        break;
      }
    }
    if (!testConstituency) return; // Skip if no candidates

    const candidates = get2026Candidates(testConstituency);
    expect(candidates.length).toBeGreaterThan(0);
    candidates.forEach(c => {
      expect(c.name).toBeDefined();
      expect(c.party).toBeDefined();
      expect(c.partyShort).toBeDefined();
      expect(c.color).toMatch(/^#/);
    });
  });

  it('should be case-insensitive', () => {
    const data = get2026ElectionData();
    let testConstituency = null;
    for (const party of data.parties) {
      if (party.key_candidates && party.key_candidates.length > 0) {
        testConstituency = party.key_candidates[0].constituency;
        break;
      }
    }
    if (!testConstituency) return;

    const normal = get2026Candidates(testConstituency);
    const upper = get2026Candidates(testConstituency.toUpperCase());
    expect(upper.length).toBe(normal.length);
  });
});

// ─── getBattlegroundInfo ──────────────────────────────────────────────────────

describe('getBattlegroundInfo', () => {
  it('should return null for null/undefined input', () => {
    expect(getBattlegroundInfo(null)).toBeNull();
    expect(getBattlegroundInfo(undefined)).toBeNull();
  });

  it('should return null for non-battleground constituency', () => {
    expect(getBattlegroundInfo('Fake-99')).toBeNull();
  });

  it('should return info for a known battleground', () => {
    const data = get2026ElectionData();
    if (data.key_battlegrounds.length === 0) return; // Skip if no battlegrounds

    const firstBattleground = data.key_battlegrounds[0];
    const info = getBattlegroundInfo(firstBattleground.constituency);
    expect(info).not.toBeNull();
    expect(info.constituency).toBeDefined();
  });

  it('should be case-insensitive', () => {
    const data = get2026ElectionData();
    if (data.key_battlegrounds.length === 0) return;

    const name = data.key_battlegrounds[0].constituency;
    const normal = getBattlegroundInfo(name);
    const upper = getBattlegroundInfo(name.toUpperCase());
    expect(upper).not.toBeNull();
    expect(upper.constituency).toBe(normal.constituency);
  });

  it('should include Kul Man Ghising in Kathmandu-3 battleground', () => {
    const info = getBattlegroundInfo('Kathmandu-3');
    expect(info).not.toBeNull();
    const names = info.candidates.map(c => c.name);
    expect(names).toContain('Kul Man Ghising');
    expect(names).toContain('Santosh Chalise');
  });

  it('should include Harka Sampang in Sunsari-1 battleground', () => {
    const info = getBattlegroundInfo('Sunsari-1');
    expect(info).not.toBeNull();
    const names = info.candidates.map(c => c.name);
    expect(names).toContain('Harka Sampang');
    expect(names).toContain('Ashok Kumar Rai');
  });
});
