// Historical party definitions for 1994 election
// Source: Nepal Research / Election Commission Nepal
// Data extracted: February 2026

export const PARTIES_1994 = {
  // Major parties with seats
  UML: {
    code: "UML",
    name: "Nepal Communist Party (UML)",
    shortName: "CPN-UML",
    color: "#dc2626",  // Red-600
    historicalFullName: "Nepal Communist Party (Unified Marxist-Leninist)",
    seatsWon: 88,
    votes: 2352601,
    votePercent: 30.85,
    candidates: 196,
    isMajor: true
  },
  
  NC: {
    code: "NC",
    name: "Nepali Congress",
    shortName: "NC",
    color: "#16a34a",  // Green-600
    historicalFullName: "Nepali Congress",
    seatsWon: 83,
    votes: 2545287,
    votePercent: 33.38,
    candidates: 205,
    isMajor: true
  },
  
  RPP: {
    code: "RPP",
    name: "Rastriya Prajatantra Party",
    shortName: "RPP",
    color: "#7c3aed",  // Violet-600
    historicalFullName: "Rastriya Prajatantra Party",
    seatsWon: 20,
    votes: 1367148,
    votePercent: 17.93,
    candidates: 202,
    isMajor: true
  },
  
  NSP: {
    code: "NSP",
    name: "Nepal Sadbhawana Party",
    shortName: "NSP",
    color: "#d97706",  // Amber-600
    historicalFullName: "Nepal Sadbhawana Party",
    seatsWon: 3,
    votes: 265847,
    votePercent: 3.49,
    candidates: 86,
    isMajor: false
  },
  
  NMKP: {
    code: "NMKP",
    name: "Nepal Majdoor Kissan Party",
    shortName: "NMKP",
    color: "#ec4899",  // Pink-500
    historicalFullName: "Nepal Majdoor Kissan Party",
    seatsWon: 4,
    votes: 75072,
    votePercent: 0.98,
    candidates: 27,
    isMajor: false
  },
  
  // Others aggregate
  Others: {
    code: "Others",
    name: "Others",
    shortName: "Others",
    color: "#4b5563",  // Gray-600
    historicalFullName: "Other Parties & Independents",
    seatsWon: 5,
    votes: 1000000,  // Approximate
    votePercent: 13.37,
    candidates: 500,
    isMajor: false,
    includedParties: [
      "Rastriya Prajatantra Party (Chand)",
      "Rastriya Prajatantra Party (Thapa)",
      "Sanyunkta Janamorcha Nepal",
      "Nepal Communist Party (M.L)",
      "Independent"
    ]
  }
};

// National summary statistics
export const NATIONAL_SUMMARY_1994 = {
  year: 1994,
  date: "1994-11-15",
  totalSeats: 205,
  system: "FPTP",
  registeredVoters: 12500000,
  votesCast: 7628535,
  turnoutPercent: 61.86,
  validVotes: 7628535,
  totalCandidates: 0,
  totalParties: 20
};

// Helper function to get party by code
export function getParty1994(code) {
  return PARTIES_1994[code] || null;
}

// Helper function to get all major parties
export function getMajorParties1994() {
  return Object.values(PARTIES_1994).filter(p => p.isMajor);
}

// Map historical party names to standardized codes
export const PARTY_NAME_MAP_1994 = {
  "Nepali Congress": "NC",
  "Nepal Communist Party (UML)": "UML",
  "Nepal Communist Party (Unified Marxist-Leninist)": "UML",
  "Rastriya Prajatantra Party": "RPP",
  "Nepal Sadbhawana Party": "NSP",
  "Nepal Majdoor Kissan Party": "NMKP",
  "Rastriya Prajatantra Party (Chand)": "Others",
  "Rastriya Prajatantra Party (Thapa)": "Others",
  "Sanyunkta Janamorcha Nepal": "Others",
  "Nepal Communist Party (M.L)": "Others",
  "Independent": "Others"
};

// Helper to map party name to code
export function mapPartyName1994(partyName) {
  return PARTY_NAME_MAP_1994[partyName] || "Others";
}
