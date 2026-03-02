import { describe, expect, it } from 'vitest';

import { OFFICIAL_FPTP_VOTE, constituencies } from '../data/constituencies';
import { PRESET_SCENARIOS } from '../data/demographicScenarios';
import { calculateAllFPTPResults, countFPTPSeats } from '../utils/calculations';
import { applyDemographicModel } from '../utils/demographicCalculator';

// Mirrors the smart demographic swing model used in useElectionState.
const EPS = 0.005;
const RATIO_MIN = 0.2;
const RATIO_MAX = 5;
const SWING_STRENGTH = 0.9;

function normalizeWithTargets(sourceRow, targets) {
  const sourceTotal = Object.values(sourceRow).reduce((sum, v) => sum + v, 0) || 100;
  const source = {};
  Object.entries(sourceRow).forEach(([party, value]) => {
    source[party] = (value / sourceTotal) * 100;
  });

  const result = { ...source, ...targets };
  const targeted = new Set(Object.keys(targets));
  const nonTargeted = Object.keys(result).filter(p => !targeted.has(p));
  const remaining = Math.max(
    0,
    100 - Object.values(targets).reduce((sum, value) => sum + value, 0)
  );
  const nonTargetTotal = nonTargeted.reduce((sum, party) => sum + (source[party] || 0), 0);

  nonTargeted.forEach(party => {
    result[party] =
      nonTargetTotal > 0
        ? ((source[party] || 0) / nonTargetTotal) * remaining
        : remaining / nonTargeted.length;
  });

  return result;
}

function makeOverrides(currentPredictions, baselinePredictions) {
  const baselineByConstituency = new Map(
    baselinePredictions.map(prediction => [prediction.constituencyId, prediction])
  );

  const overrides = {};
  currentPredictions.forEach(prediction => {
    const constituency = constituencies.find(c => c.id === prediction.constituencyId);
    const baseShares = constituency?.results2022 || {};
    const baseline = baselineByConstituency.get(prediction.constituencyId);

    const parties = new Set([
      ...Object.keys(baseShares),
      ...Object.keys(prediction.voteShares || {}),
    ]);

    const swungShares = {};
    parties.forEach(party => {
      const baselineShare = baseShares[party] || 0;
      const currentDemographicShare = (prediction.voteShares?.[party] || 0) / 100;
      const baselineDemographicShare = (baseline?.voteShares?.[party] || 0) / 100;
      const ratio = Math.max(
        RATIO_MIN,
        Math.min(RATIO_MAX, (currentDemographicShare + EPS) / (baselineDemographicShare + EPS))
      );
      swungShares[party] = Math.max(0, baselineShare * Math.pow(ratio, SWING_STRENGTH));
    });

    const total = Object.values(swungShares).reduce((sum, value) => sum + value, 0) || 1;
    Object.keys(swungShares).forEach(party => {
      swungShares[party] = swungShares[party] / total;
    });

    overrides[prediction.constituencyId] = swungShares;
  });

  return overrides;
}

function runPresetScenario({ dimension, rowTargets, turnoutUpdates }) {
  const baselineScenario =
    PRESET_SCENARIOS.find(scenario => scenario.id === '2022-baseline') || PRESET_SCENARIOS[0];

  const baselinePatterns = structuredClone(baselineScenario.patterns);
  const updatedPatterns = structuredClone(baselineScenario.patterns);
  const updatedTurnout = structuredClone(baselineScenario.turnout);

  Object.entries(rowTargets).forEach(([segment, targets]) => {
    updatedPatterns[dimension][segment] = normalizeWithTargets(
      updatedPatterns[dimension][segment],
      targets
    );
  });

  Object.entries(turnoutUpdates).forEach(([segment, turnout]) => {
    updatedTurnout[dimension][segment] = turnout;
  });

  const baselinePredictions = applyDemographicModel(
    constituencies,
    baselinePatterns,
    baselineScenario.turnout,
    dimension
  );
  const currentPredictions = applyDemographicModel(
    constituencies,
    updatedPatterns,
    updatedTurnout,
    dimension
  );

  const results = calculateAllFPTPResults(
    OFFICIAL_FPTP_VOTE,
    makeOverrides(currentPredictions, baselinePredictions),
    OFFICIAL_FPTP_VOTE,
    null,
    false
  );

  return countFPTPSeats(results);
}

function assertRspLeadByAtLeastTen(seats) {
  const sorted = Object.entries(seats).sort((a, b) => b[1] - a[1]);
  expect(sorted[0][0]).toBe('RSP');
  expect(sorted[0][1] - sorted[1][1]).toBeGreaterThanOrEqual(10);
  const total = Object.values(seats).reduce((sum, value) => sum + value, 0);
  expect(total).toBe(165);
}

describe('progressive demographic presets', () => {
  it('Youth Reform Wave keeps RSP first with >=10 seat lead', () => {
    const seats = runPresetScenario({
      dimension: 'age',
      rowTargets: {
        '18-29': { RSP: 82, UML: 7, NC: 6 },
        '30-44': { RSP: 68, UML: 11, NC: 10 },
        '45-59': { RSP: 48, UML: 18, NC: 14 },
        '60+': { RSP: 28, UML: 24, NC: 18 },
      },
      turnoutUpdates: {
        '18-29': 70,
        '30-44': 75,
        '45-59': 75,
        '60+': 72,
      },
    });
    assertRspLeadByAtLeastTen(seats);
  });

  it('Urban Shock keeps RSP first with >=10 seat lead', () => {
    const seats = runPresetScenario({
      dimension: 'urbanRural',
      rowTargets: {
        urban: { RSP: 82, UML: 7, NC: 6 },
        rural: { RSP: 52, UML: 16, NC: 14 },
      },
      turnoutUpdates: {
        urban: 76,
        rural: 71,
      },
    });
    assertRspLeadByAtLeastTen(seats);
  });

  it('Educated Reform Vote keeps RSP first with >=10 seat lead', () => {
    const seats = runPresetScenario({
      dimension: 'literacy',
      rowTargets: {
        high: { RSP: 80, UML: 8, NC: 8 },
        medium: { RSP: 58, UML: 14, NC: 13 },
        low: { RSP: 34, UML: 23, NC: 18 },
      },
      turnoutUpdates: {
        high: 73,
        medium: 67,
        low: 66,
      },
    });
    assertRspLeadByAtLeastTen(seats);
  });
});
