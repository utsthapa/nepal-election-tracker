import { describe, expect, it } from 'vitest';

import { OFFICIAL_FPTP_VOTE, constituencies } from '../data/constituencies';
import { createNeutralBaseline } from '../data/demographicScenarios';
import {
  calculateAllFPTPResults,
  countFPTPSeats,
  adjustZeroSumSliders,
} from '../utils/calculations';
import { applyDemographicModel } from '../utils/demographicCalculator';

describe('slider and percentage impact', () => {
  it('changing national sliders changes seat outcomes', () => {
    const baselineSliders = { ...OFFICIAL_FPTP_VOTE };
    const ncBoostSliders = adjustZeroSumSliders(baselineSliders, 'NC', 40);
    const rspBoostSliders = adjustZeroSumSliders(baselineSliders, 'RSP', 25);

    const baselineSeats = countFPTPSeats(
      calculateAllFPTPResults(baselineSliders, {}, baselineSliders, null, false)
    );
    const ncBoostSeats = countFPTPSeats(
      calculateAllFPTPResults(ncBoostSliders, {}, baselineSliders, null, false)
    );
    const rspBoostSeats = countFPTPSeats(
      calculateAllFPTPResults(rspBoostSliders, {}, baselineSliders, null, false)
    );

    expect(ncBoostSeats).not.toEqual(baselineSeats);
    expect(rspBoostSeats).not.toEqual(baselineSeats);
    expect(ncBoostSeats.NC).toBeGreaterThan(baselineSeats.NC);
    expect(rspBoostSeats.RSP).toBeGreaterThan(baselineSeats.RSP);
  });

  it('changing demographic percentages affects constituency vote shares', () => {
    const parties = Object.keys(OFFICIAL_FPTP_VOTE);
    const neutral = createNeutralBaseline(parties);
    const sampleConstituency = constituencies[0];

    const baselinePrediction = applyDemographicModel(
      [sampleConstituency],
      neutral.patterns,
      neutral.turnout,
      'age'
    )[0];

    const modifiedPatterns = structuredClone(neutral.patterns);
    modifiedPatterns.age['18-29'] = {
      ...modifiedPatterns.age['18-29'],
      RSP: modifiedPatterns.age['18-29'].RSP + 20,
      NC: modifiedPatterns.age['18-29'].NC - 20,
    };

    const modifiedPrediction = applyDemographicModel(
      [sampleConstituency],
      modifiedPatterns,
      neutral.turnout,
      'age'
    )[0];

    expect(modifiedPrediction.voteShares.RSP).toBeGreaterThan(baselinePrediction.voteShares.RSP);
    expect(modifiedPrediction.voteShares.NC).toBeLessThan(baselinePrediction.voteShares.NC);
  });
});
