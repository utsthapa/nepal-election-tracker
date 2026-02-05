/**
 * Calculate PR vote shares that would produce the actual 2022 PR seat allocation
 * Using the Sainte-Laguë method with 110 seats and 3% threshold
 */

const ACTUAL_PR_SEATS = {
  "NC": 32,
  "UML": 34,
  "Maoist": 14,
  "RSP": 13,
  "RPP": 7,
  "JSPN": 5,
  "US": 0,
  "JP": 5,
  "LSP": 0,
  "NUP": 0,
  "Others": 0
};

const PR_SEATS = 110;
const THRESHOLD = 0.03; // 3%

/**
 * Calculate PR seats using Sainte-Laguë method
 */
function calculateSeats(voteShares) {
  const qualifiedParties = Object.entries(voteShares)
    .filter(([_, share]) => share >= THRESHOLD)
    .map(([party, share]) => ({
      party,
      votes: share * 1000000, // Use large number for precision
      share,
    }));

  if (qualifiedParties.length === 0) {
    return Object.fromEntries(Object.keys(voteShares).map(p => [p, 0]));
  }

  const seatAllocation = {};
  for (const party of Object.keys(voteShares)) {
    seatAllocation[party] = 0;
  }

  // Sainte-Laguë allocation
  for (let i = 0; i < PR_SEATS; i++) {
    let maxQuotient = -1;
    let winningParty = null;

    for (const { party, votes } of qualifiedParties) {
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
 * Find vote shares that match the actual PR seat allocation
 */
function findMatchingVoteShares() {
  // Start with actual PR vote shares from Election Commission Nepal
  let voteShares = {
    "NC": 0.2571,  // 25.71%
    "UML": 0.2695,  // 26.95%
    "Maoist": 0.1113,  // 11.13%
    "RSP": 0.1070,  // 10.70%
    "RPP": 0.0558,  // 5.58%
    "JSPN": 0.0399,  // 3.99%
    "US": 0.0283,  // 2.83% (below threshold)
    "JP": 0.0374,  // 3.74%
    "LSP": 0.0158,  // 1.58% (below threshold)
    "NUP": 0.0257,  // 2.57% (below threshold)
    "Others": 0.0557  // 5.57%
  };

  // Test if actual vote shares produce correct seat allocation
  console.log('Testing actual PR vote shares from Election Commission Nepal:');
  const calculatedSeats = calculateSeats(voteShares);
  console.log('Calculated seats:', calculatedSeats);
  console.log('Actual seats:    ', ACTUAL_PR_SEATS);
  
  // Check if it matches
  let matches = true;
  for (const party of Object.keys(ACTUAL_PR_SEATS)) {
    if (calculatedSeats[party] !== ACTUAL_PR_SEATS[party]) {
      matches = false;
      console.log(`Mismatch: ${party} - calculated: ${calculatedSeats[party]}, actual: ${ACTUAL_PR_SEATS[party]}`);
    }
  }
  
  if (matches) {
    console.log('✓ MATCH FOUND! Actual vote shares produce correct seat allocation.');
  } else {
    console.log('✗ No match. Vote shares may need adjustment.');
  }
  
  return voteShares;

  for (const adj of adjustments) {
    const testShares = { ...voteShares, NC: adj.NC, UML: adj.UML };
    const calculatedSeats = calculateSeats(testShares);
    
    console.log(`Testing NC: ${(adj.NC * 100).toFixed(2)}%, UML: ${(adj.UML * 100).toFixed(2)}%`);
    console.log('Calculated seats:', calculatedSeats);
    console.log('Actual seats:    ', ACTUAL_PR_SEATS);
    
    // Check if it matches
    let matches = true;
    for (const party of Object.keys(ACTUAL_PR_SEATS)) {
      if (calculatedSeats[party] !== ACTUAL_PR_SEATS[party]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      console.log('✓ MATCH FOUND!');
      console.log('Final vote shares:');
      for (const [party, share] of Object.entries(testShares)) {
        console.log(`  ${party}: ${(share * 100).toFixed(2)}%`);
      }
      return testShares;
    }
    console.log('---');
  }

  console.log('No exact match found. Using best approximation.');
  return voteShares;
}

// Run the calculation
const result = findMatchingVoteShares();
console.log('\nFinal result:');
console.log(JSON.stringify(result, null, 2));
