// Historical party definitions for 2017 election
// Source: Election Commission Nepal / Wikipedia
// Data extracted: February 2026

export const PARTIES_2017 = {
  // Major parties with seats
  UML: {
    code: "UML",
    name: "CPN-UML",
    shortName: "CPN-UML",
    color: "#dc2626",  // Red-600
    historicalFullName: "Communist Party of Nepal (Unified Marxist-Leninist)",
    fptpSeats: 80,
    prSeats: 41,
    totalSeats: 121,
    prVotes: 3173494,
    prVotePercent: 33.25,
    isMajor: true
  },
  
  Maoist: {
    code: "Maoist",
    name: "CPN-Maoist Centre",
    shortName: "CPN-MC",
    color: "#991b1b",  // Red-800
    historicalFullName: "Communist Party of Nepal (Maoist Centre)",
    fptpSeats: 36,
    prSeats: 17,
    totalSeats: 53,
    prVotes: 1303721,
    prVotePercent: 13.66,
    isMajor: true
  },
  
  NC: {
    code: "NC",
    name: "Nepali Congress",
    shortName: "NC",
    color: "#16a34a",  // Green-600
    historicalFullName: "Nepali Congress",
    fptpSeats: 23,
    prSeats: 40,
    totalSeats: 63,
    prVotes: 3128389,
    prVotePercent: 32.78,
    isMajor: true
  },
  
  RJPN: {
    code: "RJPN",
    name: "Rastriya Janata Party Nepal",
    shortName: "RJPN",
    color: "#f59e0b",  // Amber-500
    historicalFullName: "Rastriya Janata Party Nepal",
    fptpSeats: 11,
    prSeats: 6,
    totalSeats: 17,
    prVotes: 472254,
    prVotePercent: 4.95,
    isMajor: true
  },
  
  SSFN: {
    code: "SSFN",
    name: "Federal Socialist Forum Nepal",
    shortName: "FSF-N",
    color: "#ec4899",  // Pink-500
    historicalFullName: "Federal Socialist Forum, Nepal",
    fptpSeats: 10,
    prSeats: 6,
    totalSeats: 16,
    prVotes: 470201,
    prVotePercent: 4.93,
    isMajor: true
  },
  
  NayaShakti: {
    code: "NayaShakti",
    name: "Naya Shakti Party",
    shortName: "Naya Shakti",
    color: "#8b5cf6",  // Violet-500
    historicalFullName: "Naya Shakti Party, Nepal",
    fptpSeats: 1,
    prSeats: 0,
    totalSeats: 1,
    prVotes: 81837,
    prVotePercent: 0.86,
    isMajor: false
  },
  
  RPP: {
    code: "RPP",
    name: "Rastriya Prajatantra Party",
    shortName: "RPP",
    color: "#7c3aed",  // Violet-600
    historicalFullName: "Rastriya Prajatantra Party",
    fptpSeats: 1,
    prSeats: 0,
    totalSeats: 1,
    prVotes: 196782,
    prVotePercent: 2.06,
    isMajor: false
  },
  
  NMKP: {
    code: "NMKP",
    name: "Nepal Majdoor Kisan Party",
    shortName: "NMKP",
    color: "#84cc16",  // Lime-500
    historicalFullName: "Nepal Majdoor Kisan Party",
    fptpSeats: 1,
    prSeats: 0,
    totalSeats: 1,
    prVotes: 56141,
    prVotePercent: 0.59,
    isMajor: false
  },
  
  Janamorcha: {
    code: "Janamorcha",
    name: "Rastriya Janamorcha",
    shortName: "RJM",
    color: "#f43f5e",  // Rose-500
    historicalFullName: "Rastriya Janamorcha",
    fptpSeats: 1,
    prSeats: 0,
    totalSeats: 1,
    prVotes: 62133,
    prVotePercent: 0.65,
    isMajor: false
  },
  
  // Others aggregate
  Others: {
    code: "Others",
    name: "Others",
    shortName: "Others",
    color: "#4b5563",  // Gray-600
    historicalFullName: "Other Parties & Independents",
    fptpSeats: 1,  // 1 independent
    prSeats: 0,
    totalSeats: 1,
    prVotes: 599792,
    prVotePercent: 6.28,
    isMajor: false,
    includedParties: [
      "Independent",
      "Other small parties"
    ]
  }
};

// National summary statistics
export const NATIONAL_SUMMARY_2017 = {
  year: 2017,
  date: "2017-11-26/12-07",
  totalSeats: 275,
  fptpSeats: 165,
  prSeats: 110,
  system: "Mixed (FPTP + PR)",
  registeredVoters: 15427731,
  votesCast: 10580000,  // Approximate
  turnoutPercent: 68.63,
  totalCandidates: 0,  // To be filled
  totalParties: 40
};

// Helper function to get party by code
export function getParty2017(code) {
  return PARTIES_2017[code] || null;
}

// Helper function to get all major parties
export function getMajorParties2017() {
  return Object.values(PARTIES_2017).filter(p => p.isMajor);
}

// Map historical party names to standardized codes
export const PARTY_NAME_MAP_2017 = {
  "CPN (UML)": "UML",
  "Communist Party of Nepal (Unified Marxist-Leninist)": "UML",
  "Nepali Congress": "NC",
  "CPN (Maoist Centre)": "Maoist",
  "Communist Party of Nepal (Maoist Centre)": "Maoist",
  "Rastriya Janata Party Nepal": "RJPN",
  "Federal Socialist Forum, Nepal": "SSFN",
  "Federal Socialist Forum Nepal": "SSFN",
  "Naya Shakti Party, Nepal": "NayaShakti",
  "Rastriya Prajatantra Party": "RPP",
  "Nepal Majdoor Kisan Party": "NMKP",
  "Rastriya Janamorcha": "Janamorcha",
  "Independent": "Others"
};

// Helper to map party name to code
export function mapPartyName2017(partyName) {
  return PARTY_NAME_MAP_2017[partyName] || "Others";
}
