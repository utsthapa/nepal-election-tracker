// Historical party definitions for 2008 Constituent Assembly election
// Source: Wikipedia / Carter Center / Election Commission Nepal
// Data extracted: February 2026

export const PARTIES_2008 = {
  // Major parties with seats
  Maoist: {
    code: "Maoist",
    name: "CPN-Maoist Centre",
    shortName: "CPN-MC",
    color: "#991b1b",  // Red-800
    historicalFullName: "Communist Party of Nepal (Maoist)",
    fptpSeats: 120,
    prSeats: 100,
    totalSeats: 220,
    prVotes: 3138015,
    prVotePercent: 29.28,
    isMajor: true
  },
  
  NC: {
    code: "NC",
    name: "Nepali Congress",
    shortName: "NC",
    color: "#16a34a",  // Green-600
    historicalFullName: "Nepali Congress",
    fptpSeats: 37,
    prSeats: 73,
    totalSeats: 110,
    prVotes: 2464272,
    prVotePercent: 22.98,
    isMajor: true
  },
  
  UML: {
    code: "UML",
    name: "CPN-UML",
    shortName: "CPN-UML",
    color: "#dc2626",  // Red-600
    historicalFullName: "Communist Party of Nepal (Unified Marxist-Leninist)",
    fptpSeats: 33,
    prSeats: 70,
    totalSeats: 103,
    prVotes: 2534319,
    prVotePercent: 23.63,
    isMajor: true
  },
  
  MJF: {
    code: "MJF",
    name: "Madhesi Jana Adhikar Forum",
    shortName: "MJF",
    color: "#f59e0b",  // Amber-500
    historicalFullName: "Madhesi Jana Adhikar Forum, Nepal",
    fptpSeats: 9,
    prSeats: 13,
    totalSeats: 22,
    prVotes: 678327,
    prVotePercent: 6.32,
    isMajor: false
  },
  
  TMLP: {
    code: "TMLP",
    name: "Tarai-Madhes Loktantrik Party",
    shortName: "TMLP",
    color: "#8b5cf6",  // Violet-500
    historicalFullName: "Tarai-Madhes Loktantrik Party",
    fptpSeats: 11,
    prSeats: 6,
    totalSeats: 17,
    prVotes: 345515,
    prVotePercent: 3.22,
    isMajor: false
  },
  
  // Others aggregate
  Others: {
    code: "Others",
    name: "Others",
    shortName: "Others",
    color: "#4b5563",  // Gray-600
    historicalFullName: "Other Parties & Independents",
    fptpSeats: 30,
    prSeats: 73,
    totalSeats: 103,
    prVotes: 1600000,  // Approximate
    prVotePercent: 14.57,
    isMajor: false,
    includedParties: [
      "Sadbhavana Party",
      "Rastriya Prajatantra Party",
      "Janamorcha Nepal",
      "Rastriya Janamorcha",
      "Nepal Workers Peasants Party",
      "Independent"
    ]
  }
};

// National summary statistics
export const NATIONAL_SUMMARY_2008 = {
  year: 2008,
  date: "2008-04-10",
  totalSeats: 575,  // 575 of 601 seats (26 nominated later)
  fptpSeats: 240,
  prSeats: 335,
  system: "Mixed (FPTP + PR)",
  registeredVoters: 17500000,
  votesCast: 10760000,  // Approximate
  turnoutPercent: 63.29,
  totalCandidates: 0,
  totalParties: 54
};

// Helper function to get party by code
export function getParty2008(code) {
  return PARTIES_2008[code] || null;
}

// Helper function to get all major parties
export function getMajorParties2008() {
  return Object.values(PARTIES_2008).filter(p => p.isMajor);
}

// Map historical party names to standardized codes
export const PARTY_NAME_MAP_2008 = {
  "Communist Party of Nepal (Maoist)": "Maoist",
  "CPN (Maoist)": "Maoist",
  "Nepali Congress": "NC",
  "Communist Party of Nepal (Unified Marxist–Leninist)": "UML",
  "CPN (UML)": "UML",
  "Madhesi Jana Adhikar Forum, Nepal": "MJF",
  "MJF-Nepal": "MJF",
  "Tarai-Madhes Loktantrik Party": "TMLP",
  "Sadbhavana Party": "Others",
  "Rastriya Prajatantra Party": "Others",
  "Janamorcha Nepal": "Others",
  "Rastriya Janamorcha": "Others",
  "Nepal Workers Peasants Party": "Others",
  "Independent": "Others"
};

// Helper to map party name to code
export function mapPartyName2008(partyName) {
  return PARTY_NAME_MAP_2008[partyName] || "Others";
}
