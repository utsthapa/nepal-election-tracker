/**
 * Seat Calculator — Reverse Swing
 * "How much swing does party X need to reach Y seats?"
 * Uses binary search over the uniform swing model.
 */

import { applyUniformSwing } from './swingCalculator';
import { countFPTPSeats } from './calculations';

/**
 * Calculate the required uniform swing for a party to reach target seats
 * @param {string} party - Party code (e.g., 'NC')
 * @param {number} targetSeats - Desired number of FPTP seats
 * @param {Object} fptpResults - Current FPTP results
 * @param {Object} currentSeats - Current FPTP seat counts
 * @returns {{ requiredSwing: number, achievedSeats: number, possible: boolean }}
 */
export function calculateRequiredSwing(party, targetSeats, fptpResults, currentSeats) {
  const currentPartySeats = currentSeats[party] || 0;

  // Already there
  if (currentPartySeats >= targetSeats) {
    return { requiredSwing: 0, achievedSeats: currentPartySeats, possible: true };
  }

  // Binary search over swing 0→30%
  let lo = 0;
  let hi = 30;
  let bestSwing = null;
  let bestSeats = currentPartySeats;

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const swingPcts = { [party]: mid };
    const swungResults = applyUniformSwing(fptpResults, swingPcts);
    const swungSeats = countFPTPSeats(swungResults);
    const achieved = swungSeats[party] || 0;

    if (achieved >= targetSeats) {
      bestSwing = mid;
      bestSeats = achieved;
      hi = mid;
    } else {
      lo = mid;
    }

    // Converged within 0.05%
    if (hi - lo < 0.05) break;
  }

  if (bestSwing === null) {
    // Could not reach target even at +30%
    const maxSwung = applyUniformSwing(fptpResults, { [party]: 30 });
    const maxSeats = countFPTPSeats(maxSwung)[party] || 0;
    return { requiredSwing: 30, achievedSeats: maxSeats, possible: false };
  }

  return {
    requiredSwing: Math.round(bestSwing * 10) / 10,
    achievedSeats: bestSeats,
    possible: true,
  };
}
