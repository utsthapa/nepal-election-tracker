// utils/scenarios.js
//
// Starting-point scenario utilities for the election simulator.
// These functions adjust the initial slider state before the user
// makes any manual changes, modelling structural differences between
// parties that pure vote-share sliders don't capture.

import { OFFICIAL_PR_VOTE } from '../data/constituencies';

/**
 * Apply RSP National Entry adjustment to an FPTP slider map.
 *
 * Background
 * ----------
 * In 2022, RSP did not contest every FPTP constituency, so their FPTP
 * national vote share (7.82%) understates their true support relative to
 * their PR vote (10.70%). This function corrects for that by:
 *
 *   1. Setting RSP's FPTP share to their PR proportion (10.70%)
 *   2. Taking the difference (2.88pp) proportionally from every other party
 *
 * The proportional reduction is:
 *   loss_p = (share_p / sum_others) × (RSP_PR - RSP_FPTP)
 *
 * After this call, the standard zero-sum slider mechanic handles all
 * further adjustments normally — no special treatment needed.
 *
 * Verified projections from post-entry baseline (RSP = 10.70%):
 *   RSP → 25%:  NC ~19.0%,  UML ~24.8%
 *   RSP → 30%:  NC ~17.7%,  UML ~23.2%
 *   RSP → 35%:  NC ~16.4%,  UML ~21.5%
 *
 * @param {Record<string, number>} fptp  FPTP slider map, values in %, must sum ~100
 * @returns {Record<string, number>}     New map with RSP at PR proportion; sums to 100
 */
export function applyRspNationalEntry(fptp) {
  const RSP_PR = OFFICIAL_PR_VOTE['RSP']; // 10.70
  const delta = RSP_PR - (fptp['RSP'] ?? 0);

  // If RSP is already at or above their PR proportion, nothing to adjust
  if (delta <= 0) {
    return { ...fptp };
  }

  const sumOthers = Object.entries(fptp)
    .filter(([p]) => p !== 'RSP')
    .reduce((sum, [, v]) => sum + v, 0);

  const result = {};
  Object.entries(fptp).forEach(([party, share]) => {
    if (party === 'RSP') {
      result[party] = RSP_PR;
    } else {
      result[party] = share - (share / sumOthers) * delta;
    }
  });

  return result;
}
