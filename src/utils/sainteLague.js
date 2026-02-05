/**
 * Proportional seat allocation utilities
 * Supports Modified Sainte-Laguë (0.7,1.5,2.5,...) and D'Hondt toggle
 * Adds threshold redistribution and a female quota post-filter
 */

import { PARTY_FEMALE_SHARE } from '../../data/partyMeta';

export const PR_SEATS = 110;
const DEFAULT_THRESHOLD = 0.03;
export const THRESHOLD_PERCENT = DEFAULT_THRESHOLD * 100;

const DIVISOR_STRATEGIES = {
  modified: (seatsWon) => (seatsWon === 0 ? 0.7 : seatsWon + 0.5), // 0.7, 1.5, 2.5, 3.5...
  sainteLague: (seatsWon) => 2 * seatsWon + 1, // 1,3,5...
  dhondt: (seatsWon) => seatsWon + 1, // 1,2,3...
};

/**
 * Remove sub-3% parties and renormalize the remaining shares to 1.0
 */
export function redistributeFailedVotes(voteShares, threshold = DEFAULT_THRESHOLD) {
  const survivors = {};
  let survivorTotal = 0;
  const excluded = [];

  Object.entries(voteShares).forEach(([party, share]) => {
    if (share >= threshold) {
      survivors[party] = share;
      survivorTotal += share;
    } else {
      survivors[party] = 0;
      excluded.push(party);
    }
  });

  if (survivorTotal === 0) {
    return { redistributed: { ...survivors }, excluded };
  }

  Object.keys(survivors).forEach((party) => {
    survivors[party] = survivors[party] / survivorTotal;
  });

  return { redistributed: survivors, excluded };
}

function resolveOptions(optionsOrTotalVotes, maybeSeats) {
  const defaults = {
    seats: PR_SEATS,
    method: 'modified',
    threshold: DEFAULT_THRESHOLD,
    redistribute: true,
    totalVotes: 1_000_000,
  };

  if (typeof optionsOrTotalVotes === 'number') {
    return { ...defaults, totalVotes: optionsOrTotalVotes, seats: maybeSeats ?? PR_SEATS };
  }

  if (typeof optionsOrTotalVotes === 'object' && optionsOrTotalVotes !== null) {
    return { ...defaults, ...optionsOrTotalVotes };
  }

  return defaults;
}

function getDivisorFn(method = 'modified') {
  if (method === 'modified' || method === 'sainte-lague-mod') return DIVISOR_STRATEGIES.modified;
  if (method === 'dhondt' || method === 'dHondt') return DIVISOR_STRATEGIES.dhondt;
  return DIVISOR_STRATEGIES.sainteLague;
}

/**
 * Core allocator with method toggle and threshold redistribution
 */
export function allocateSeats(voteShares, optionsOrTotalVotes = {}, maybeSeats) {
  const { seats, method, threshold, redistribute, totalVotes } = resolveOptions(optionsOrTotalVotes, maybeSeats);
  const divisorFn = getDivisorFn(method);

  const normalizedShares = redistribute
    ? redistributeFailedVotes(voteShares, threshold).redistributed
    : { ...voteShares };

  const qualified = Object.entries(normalizedShares)
    .filter(([_, share]) => share > 0)
    .map(([party, share]) => ({ party, votes: share * totalVotes }));

  const seatAllocation = {};
  Object.keys(voteShares).forEach((p) => { seatAllocation[p] = 0; });

  if (qualified.length === 0) {
    return seatAllocation;
  }

  for (let i = 0; i < seats; i++) {
    let bestParty = null;
    let bestQuotient = -Infinity;

    for (const { party, votes } of qualified) {
      const divisor = divisorFn(seatAllocation[party]);
      const quotient = votes / divisor;
      if (quotient > bestQuotient) {
        bestQuotient = quotient;
        bestParty = party;
      }
    }

    if (bestParty) {
      seatAllocation[bestParty] += 1;
    }
  }

  return seatAllocation;
}

/**
 * Get parties that pass the threshold (after optional redistribution)
 */
export function getQualifiedParties(voteShares, threshold = DEFAULT_THRESHOLD) {
  return Object.entries(voteShares)
    .filter(([_, share]) => share >= threshold)
    .map(([party]) => party);
}

/**
 * Calculate vote shares from constituency results
 */
export function calculateNationalVoteShare(constituencies, adjustedResults) {
  const totalVotes = {};
  const parties = Object.keys(constituencies[0]?.results2022 || {});
  parties.forEach((p) => { totalVotes[p] = 0; });

  let grandTotal = 0;
  constituencies.forEach((c) => {
    const results = adjustedResults[c.id] || c.results2022;
    const constTotal = c.totalVotes;
    grandTotal += constTotal;
    parties.forEach((party) => {
      totalVotes[party] += (results[party] || 0) * constTotal;
    });
  });

  const shares = {};
  parties.forEach((party) => {
    shares[party] = grandTotal > 0 ? totalVotes[party] / grandTotal : 0;
  });
  return shares;
}

/**
 * Female quota post-filter: shift PR seats from low-female-share parties to high-share parties
 */
export function enforceFemaleQuota(totalSeats, femaleShareMap = PARTY_FEMALE_SHARE, targetShare = 0.33) {
  const seats = { ...totalSeats };
  const total = Object.values(seats).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return { seats, met: false, shortfall: targetShare, adjustments: [] };
  }

  const currentFemale = Object.entries(seats)
    .reduce((sum, [party, count]) => sum + count * (femaleShareMap[party] ?? 0.3), 0);

  const targetFemale = total * targetShare;
  if (currentFemale >= targetFemale) {
    return { seats, met: true, shortfall: 0, adjustments: [] };
  }

  let remainingGap = targetFemale - currentFemale;
  const donors = Object.keys(seats)
    .sort((a, b) => (femaleShareMap[a] ?? 0.3) - (femaleShareMap[b] ?? 0.3) || seats[b] - seats[a]);
  const recipients = Object.keys(seats)
    .sort((a, b) => (femaleShareMap[b] ?? 0.3) - (femaleShareMap[a] ?? 0.3) || seats[b] - seats[a]);

  const adjustments = [];
  let donorIdx = 0;
  let recipientIdx = 0;
  let guard = 0;

  while (remainingGap > 0.0001 && guard < 200) {
    const donor = donors[donorIdx % donors.length];
    const recipient = recipients[recipientIdx % recipients.length];
    guard += 1;

    if (donor === recipient || seats[donor] <= 0) {
      donorIdx += 1;
      recipientIdx += 1;
      continue;
    }

    seats[donor] -= 1;
    seats[recipient] += 1;

    const addedFemale = (femaleShareMap[recipient] ?? 0.3) - (femaleShareMap[donor] ?? 0.3);
    remainingGap = Math.max(0, remainingGap - addedFemale);

    adjustments.push({ from: donor, to: recipient });
    donorIdx += 1;
    recipientIdx += 1;
  }

  return {
    seats,
    met: remainingGap <= 0.0001,
    shortfall: remainingGap,
    adjustments,
  };
}

export default {
  allocateSeats,
  getQualifiedParties,
  calculateNationalVoteShare,
  redistributeFailedVotes,
  enforceFemaleQuota,
  THRESHOLD_PERCENT,
  PR_SEATS,
};
