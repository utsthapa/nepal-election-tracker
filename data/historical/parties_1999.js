// Historical party definitions for 1999 election
// Source: Nepal Research / Election Commission Nepal
// URL: https://nepalresearch.org/politics/background/elections_old/ec/alldistconst.htm
// Data extracted: February 2026

export const PARTIES_1999 = {
  // Major parties with seats
  NC: {
    code: "NC",
    name: "Nepali Congress",
    shortName: "NC",
    color: "#16a34a",  // Green-600
    historicalFullName: "Nepali Congress",
    seatsWon: 111,
    votes: 3214786,
    votePercent: 36.14,
    candidates: 205,
    isMajor: true
  },
  
  UML: {
    code: "UML",
    name: "Nepal Communist Party (UML)",
    shortName: "CPN-UML",
    color: "#dc2626",  // Red-600
    historicalFullName: "Nepal Communist Party (Unified Marxist-Leninist)",
    seatsWon: 71,
    votes: 2734568,
    votePercent: 30.74,
    candidates: 195,
    isMajor: true
  },
  
  RPP: {
    code: "RPP",
    name: "Rastriya Prajatantra Party",
    shortName: "RPP",
    color: "#7c3aed",  // Violet-600
    historicalFullName: "Rastriya Prajatantra Party",
    seatsWon: 11,
    votes: 902328,
    votePercent: 10.14,
    candidates: 195,
    isMajor: true
  },
  
  NSP: {
    code: "NSP",
    name: "Nepal Sadbhawana Party",
    shortName: "NSP",
    color: "#d97706",  // Amber-600
    historicalFullName: "Nepal Sadbhawana Party",
    seatsWon: 5,
    votes: 278435,
    votePercent: 3.13,
    candidates: 68,
    isMajor: true
  },
  
  RJM: {
    code: "RJM",
    name: "Rastriya Jana Morcha",
    shortName: "RJM",
    color: "#0891b2",  // Cyan-600
    historicalFullName: "Rastriya Jana Morcha",
    seatsWon: 5,
    votes: 121426,
    votePercent: 1.37,
    candidates: 53,
    isMajor: true
  },
  
  SJN: {
    code: "SJN",
    name: "Sanyunkta Janamorcha Nepal",
    shortName: "SJN",
    color: "#65a30d",  // Lime-600
    historicalFullName: "Sanyunkta Janamorcha Nepal",
    seatsWon: 1,
    votes: 74669,
    votePercent: 0.84,
    candidates: 40,
    isMajor: true
  },
  
  NMKP: {
    code: "NMKP",
    name: "Nepal Majdoor Kissan Party",
    shortName: "NMKP",
    color: "#db2777",  // Pink-600
    historicalFullName: "Nepal Majdoor Kissan Party",
    seatsWon: 1,
    votes: 48685,
    votePercent: 0.55,
    candidates: 41,
    isMajor: true
  },
  
  // Others aggregate (all parties with 0 seats)
  Others: {
    code: "Others",
    name: "Others",
    shortName: "Others",
    color: "#4b5563",  // Gray-600
    historicalFullName: "Other Parties & Independents",
    seatsWon: 0,
    votes: 1526246,  // Calculated: total valid votes - major parties
    votePercent: 17.15,
    candidates: 1633,  // Approximate: independents + small parties
    isMajor: false,
    includedParties: [
      "Nepal Communist Party (M.L)",
      "Rastriya Prajatantra Party (Chand)",
      "Rastriya Janamukti Party",
      "Nepal Communist Party (Marxist)",
      "Nepal Communist Party (Sanyukta)",
      "Hariyali Nepal Party",
      "Shivsena Nepal",
      "Jana Congress",
      "Janamukti Party Nepal",
      "Nepal Dalit Shramik Morcha",
      "Nepal Socialist Party",
      "Bahujan Samaj Party Nepal",
      "Nepal Praja Parishad",
      "Independent"
    ]
  }
};

// National summary statistics
export const NATIONAL_SUMMARY_1999 = {
  year: 1999,
  date: "1999-05-03/17",
  totalSeats: 205,
  system: "FPTP",
  registeredVoters: 13200000,
  votesCast: 8894664,
  turnoutPercent: 67.49,
  validVotes: 8894664,
  totalCandidates: 2216,
  totalParties: 38,
  femaleCandidates: 142,
  independentCandidates: 622
};

// Helper function to get party by code
export function getParty1999(code) {
  return PARTIES_1999[code] || null;
}

// Helper function to get all major parties
export function getMajorParties1999() {
  return Object.values(PARTIES_1999).filter(p => p.isMajor);
}

// Map historical party names to standardized codes
export const PARTY_NAME_MAP_1999 = {
  "Nepali Congress": "NC",
  "Nepal Communist Party (UML)": "UML",
  "Nepal Communist Party (Unified Marxist-Leninist)": "UML",
  "Rastriya Prajatantra Party": "RPP",
  "Nepal Sadbhawana Party": "NSP",
  "Rastriya Jana Morcha": "RJM",
  "Sanyunkta Janamorcha Nepal": "SJN",
  "Nepal Majdoor Kissan Party": "NMKP",
  // All others map to "Others"
  "Nepal Communist Party (M.L)": "Others",
  "Rastriya Prajatantra Party (Chand)": "Others",
  "Rastriya Janamukti Party": "Others",
  "Nepal Communist Party (Marxist)": "Others",
  "Nepal Communist Party (Sanyukta)": "Others",
  "Hariyali Nepal Party": "Others",
  "Shivsena Nepal": "Others",
  "Jana Congress": "Others",
  "Janamukti Party Nepal": "Others",
  "Nepal Dalit Shramik Morcha": "Others",
  "Nepal Socialist Party": "Others",
  "Bahujan Samaj Party Nepal": "Others",
  "Nepal Praja Parishad": "Others",
  "Nepal Samyabadi Party (M.L.M)": "Others",
  "Independent": "Others"
};

// Helper to map party name to code
export function mapPartyName1999(partyName) {
  return PARTY_NAME_MAP_1999[partyName] || "Others";
}
