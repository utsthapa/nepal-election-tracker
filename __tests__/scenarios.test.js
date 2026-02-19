import { describe, test, expect, beforeEach } from 'vitest';

import { OFFICIAL_PR_VOTE } from '../data/constituencies.js';
import { applyRspNationalEntry } from '../utils/scenarios.js';

const FPTP_2022 = {
  NC: 23.3,
  UML: 30.5,
  Maoist: 9.23,
  RSP: 7.82,
  RPP: 5.53,
  JSPN: 3.56,
  US: 4.09,
  JP: 2.85,
  LSP: 1.59,
  NUP: 1.65,
  Others: 9.88,
};
const RSP_PR = OFFICIAL_PR_VOTE['RSP'];

describe('applyRspNationalEntry', () => {
  let result;
  beforeEach(() => {
    result = applyRspNationalEntry(FPTP_2022);
  });

  test('RSP is set to PR proportion', () => {
    expect(result.RSP).toBeCloseTo(RSP_PR, 1);
  });

  test('all shares still sum to 100', () => {
    const total = Object.values(result).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(100, 5);
  });

  test('all other parties are reduced', () => {
    Object.keys(FPTP_2022).forEach(p => {
      if (p !== 'RSP') {
        expect(result[p]).toBeLessThan(FPTP_2022[p]);
      }
    });
  });

  test('NC is ~22.57 after entry', () => {
    expect(result.NC).toBeCloseTo(22.57, 1);
  });

  test('UML is ~29.55 after entry', () => {
    expect(result.UML).toBeCloseTo(29.55, 1);
  });

  test('is a noop when RSP is already at or above PR proportion', () => {
    const alreadyHigh = { ...FPTP_2022, RSP: 15 };
    const out = applyRspNationalEntry(alreadyHigh);
    expect(out).toEqual(alreadyHigh);
  });

  test('does not mutate the input object', () => {
    const copy = { ...FPTP_2022 };
    applyRspNationalEntry(FPTP_2022);
    expect(FPTP_2022).toEqual(copy);
  });
});
