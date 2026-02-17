import { describe, it, expect } from 'vitest';
import { allocateSeats, getQualifiedParties } from '../utils/sainteLague';

// ─── getQualifiedParties ─────────────────────────────────────────────────────

describe('getQualifiedParties', () => {
  it('should include parties at or above 3% threshold', () => {
    const shares = { NC: 0.26, UML: 0.27, Maoist: 0.15, RSP: 0.12, RPP: 0.05, Others: 0.01, Tiny: 0.02 };
    const qualified = getQualifiedParties(shares);
    expect(qualified).toContain('NC');
    expect(qualified).toContain('UML');
    expect(qualified).toContain('Maoist');
    expect(qualified).toContain('RSP');
    expect(qualified).toContain('RPP');
  });

  it('should exclude parties below 3% threshold', () => {
    const shares = { NC: 0.26, UML: 0.27, Tiny: 0.02, Micro: 0.01 };
    const qualified = getQualifiedParties(shares);
    expect(qualified).not.toContain('Tiny');
    expect(qualified).not.toContain('Micro');
  });

  it('should include a party at exactly 3%', () => {
    const shares = { NC: 0.50, UML: 0.47, Edge: 0.03 };
    const qualified = getQualifiedParties(shares);
    expect(qualified).toContain('Edge');
  });
});

// ─── allocateSeats ───────────────────────────────────────────────────────────

describe('allocateSeats', () => {
  it('should allocate all 110 seats', () => {
    const shares = { NC: 0.26, UML: 0.27, Maoist: 0.15, RSP: 0.12, RPP: 0.05, JSPN: 0.04, Others: 0.03 };
    const seats = allocateSeats(shares, 1000000, 110);
    const totalSeats = Object.values(seats).reduce((s, v) => s + v, 0);
    expect(totalSeats).toBe(110);
  });

  it('should give more seats to parties with higher vote shares', () => {
    const shares = { NC: 0.26, UML: 0.27, Maoist: 0.15, RSP: 0.12, RPP: 0.05 };
    const seats = allocateSeats(shares, 1000000, 110);
    expect(seats.UML).toBeGreaterThanOrEqual(seats.NC);
    expect(seats.NC).toBeGreaterThan(seats.Maoist);
    expect(seats.Maoist).toBeGreaterThan(seats.RPP);
  });

  it('should give 0 seats to parties below threshold', () => {
    const shares = { NC: 0.50, UML: 0.48, Tiny: 0.02 };
    const seats = allocateSeats(shares, 1000000, 110);
    expect(seats.Tiny).toBe(0);
  });

  it('should distribute proportionally (Sainte-Lague property)', () => {
    // With two equal parties, they should get roughly equal seats
    const shares = { A: 0.50, B: 0.50 };
    const seats = allocateSeats(shares, 1000000, 100);
    expect(seats.A).toBe(50);
    expect(seats.B).toBe(50);
  });

  it('should handle a single qualifying party', () => {
    const shares = { BigParty: 0.95, Tiny1: 0.02, Tiny2: 0.02, Tiny3: 0.01 };
    const seats = allocateSeats(shares, 1000000, 110);
    expect(seats.BigParty).toBe(110);
    expect(seats.Tiny1).toBe(0);
  });

  it('should handle no qualifying parties', () => {
    const shares = { A: 0.02, B: 0.02, C: 0.01 };
    const seats = allocateSeats(shares, 1000000, 110);
    const totalSeats = Object.values(seats).reduce((s, v) => s + v, 0);
    expect(totalSeats).toBe(0);
  });

  it('should allocate custom seat count', () => {
    const shares = { NC: 0.60, UML: 0.40 };
    const seats = allocateSeats(shares, 1000000, 10);
    const totalSeats = Object.values(seats).reduce((s, v) => s + v, 0);
    expect(totalSeats).toBe(10);
  });

  it('should favor slightly larger party in Sainte-Lague (unlike DHondt)', () => {
    // Sainte-Lague is more proportional than D'Hondt
    // With 60/40 split and 10 seats: should be 6/4 (not 7/3 like D'Hondt might)
    const shares = { A: 0.60, B: 0.40 };
    const seats = allocateSeats(shares, 1000000, 10);
    expect(seats.A).toBe(6);
    expect(seats.B).toBe(4);
  });
});
