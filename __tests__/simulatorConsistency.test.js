import { describe, expect, it } from 'vitest';

import {
  INITIAL_NATIONAL,
  OFFICIAL_FPTP_VOTE,
  OFFICIAL_PR_VOTE,
} from '../data/constituencies';
import { calculateAllFPTPResults, countFPTPSeats } from '../utils/calculations';
import { allocateSeats } from '../utils/sainteLague';
import { deserializeState, serializeState } from '../utils/stateSerializer';

describe('simulator consistency', () => {
  it('baseline FPTP seat count should always be 165', () => {
    const fptpResults = calculateAllFPTPResults(OFFICIAL_FPTP_VOTE, {}, OFFICIAL_FPTP_VOTE, null);
    const fptpSeats = countFPTPSeats(fptpResults);
    const totalFptp = Object.values(fptpSeats).reduce((sum, seats) => sum + seats, 0);
    expect(totalFptp).toBe(165);
  });

  it('baseline PR seat count should always be 110', () => {
    const nationalVoteShares = {};
    Object.keys(INITIAL_NATIONAL).forEach((party) => {
      nationalVoteShares[party] = party === 'Others' ? 0 : (OFFICIAL_PR_VOTE[party] || 0) / 100;
    });

    const prSeats = allocateSeats(nationalVoteShares, 1000000, 110);
    const totalPr = Object.values(prSeats).reduce((sum, seats) => sum + seats, 0);
    expect(totalPr).toBe(110);
  });

  it('combined baseline seats should always total 275 after Others fold-in', () => {
    const fptpResults = calculateAllFPTPResults(OFFICIAL_FPTP_VOTE, {}, OFFICIAL_FPTP_VOTE, null);
    const fptpSeats = countFPTPSeats(fptpResults);

    const nationalVoteShares = {};
    Object.keys(INITIAL_NATIONAL).forEach((party) => {
      nationalVoteShares[party] = party === 'Others' ? 0 : (OFFICIAL_PR_VOTE[party] || 0) / 100;
    });
    const prSeats = allocateSeats(nationalVoteShares, 1000000, 110);

    const totalSeats = {};
    Object.keys(INITIAL_NATIONAL).forEach((party) => {
      totalSeats[party] = (fptpSeats[party] || 0) + (prSeats[party] || 0);
    });

    const extraFptpSeats = Object.entries(fptpSeats).reduce((sum, [party, seats]) => (
      party in totalSeats ? sum : sum + (seats || 0)
    ), 0);
    const extraPrSeats = Object.entries(prSeats).reduce((sum, [party, seats]) => (
      party in totalSeats ? sum : sum + (seats || 0)
    ), 0);
    totalSeats.Others = (totalSeats.Others || 0) + extraFptpSeats + extraPrSeats;

    const combined = Object.values(totalSeats).reduce((sum, seats) => sum + seats, 0);
    expect(combined).toBe(275);
  });

  it('state serialization should preserve slider precision', () => {
    const state = {
      fptpSliders: {
        NC: 23.37, UML: 30.51, Maoist: 9.234, RSP: 7.826, RPP: 5.539,
        JSPN: 3.561, US: 4.091, JP: 2.857, LSP: 1.597, NUP: 1.658, Others: 9.769,
      },
      prSliders: {
        NC: 25.713, UML: 26.957, Maoist: 11.134, RSP: 10.707, RPP: 5.581,
        JSPN: 3.992, US: 2.833, JP: 3.744, LSP: 1.583, NUP: 2.571, Others: 5.185,
      },
      overrides: {},
      allianceConfig: { enabled: false, parties: [], handicap: 10 },
      slidersLocked: true,
    };

    const encoded = serializeState(state);
    const decoded = deserializeState(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded.fptpSliders.NC).toBeCloseTo(23.37, 10);
    expect(decoded.fptpSliders.Maoist).toBeCloseTo(9.234, 10);
    expect(decoded.prSliders.NC).toBeCloseTo(25.713, 10);
    expect(decoded.prSliders.RSP).toBeCloseTo(10.707, 10);
  });
});

