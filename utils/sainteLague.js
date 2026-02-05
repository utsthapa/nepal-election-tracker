/**
 * Sainte-Laguë method for proportional representation seat allocation
 * Used in Nepal's electoral system for 110 PR seats
 *
 * Divisor sequence: 1, 3, 5, 7, 9, 11, ...
 * Threshold: 3% of total votes required to qualify
 */

const THRESHOLD_PERCENT = 3;
const PR_SEATS = 110;

/**
 * Calculate PR seat allocation using Sainte-Laguë method
 * @param {Object} voteShares - Party vote shares { NC: 0.26, UML: 0.27, ... }
 * @param {number} totalVotes - Total votes cast
 * @param {number} seats - Number of seats to allocate (default: 110)
 * @returns {Object} Seat allocation by party
 */
export function allocateSeats(voteShares, totalVotes = 1000000, seats = PR_SEATS) {
  // Step 1: Apply 3% threshold
  const threshold = THRESHOLD_PERCENT / 100;
  const qualifiedParties = Object.entries(voteShares)
    .filter(([_, share]) => share >= threshold)
    .map(([party, share]) => ({
      party,
      votes: share * totalVotes,
      share,
    }));

  if (qualifiedParties.length === 0) {
    return Object.fromEntries(Object.keys(voteShares).map(p => [p, 0]));
  }

  // Step 2: Initialize seat counts
  const seatAllocation = {};
  for (const party of Object.keys(voteShares)) {
    seatAllocation[party] = 0;
  }

  // Step 3: Sainte-Laguë allocation
  // Allocate seats one by one
  for (let i = 0; i < seats; i++) {
    let maxQuotient = -1;
    let winningParty = null;

    for (const { party, votes } of qualifiedParties) {
      // Sainte-Laguë divisor: 2*seats + 1 (gives sequence 1, 3, 5, 7, ...)
      const divisor = 2 * seatAllocation[party] + 1;
      const quotient = votes / divisor;

      if (quotient > maxQuotient) {
        maxQuotient = quotient;
        winningParty = party;
      }
    }

    if (winningParty) {
      seatAllocation[winningParty]++;
    }
  }

  return seatAllocation;
}

/**
 * Get parties that pass the threshold
 * @param {Object} voteShares - Party vote shares
 * @returns {string[]} List of qualified party names
 */
export function getQualifiedParties(voteShares) {
  const threshold = THRESHOLD_PERCENT / 100;
  return Object.entries(voteShares)
    .filter(([_, share]) => share >= threshold)
    .map(([party]) => party);
}

/**
 * Calculate vote shares from constituency results
 * @param {Array} constituencies - Array of constituency data
 * @param {Object} adjustedResults - Adjusted vote percentages per constituency
 * @returns {Object} National vote shares by party
 */
export function calculateNationalVoteShare(constituencies, adjustedResults) {
  const totalVotes = {};
  const parties = Object.keys(constituencies[0]?.results2022 || {});

  // Initialize
  parties.forEach(p => totalVotes[p] = 0);

  let grandTotal = 0;

  constituencies.forEach(c => {
    const results = adjustedResults[c.id] || c.results2022;
    const constTotal = c.totalVotes;
    grandTotal += constTotal;

    parties.forEach(party => {
      totalVotes[party] += (results[party] || 0) * constTotal;
    });
  });

  // Convert to shares
  const shares = {};
  parties.forEach(party => {
    shares[party] = grandTotal > 0 ? totalVotes[party] / grandTotal : 0;
  });

  return shares;
}

export default {
  allocateSeats,
  getQualifiedParties,
  calculateNationalVoteShare,
  THRESHOLD_PERCENT,
  PR_SEATS,
};
