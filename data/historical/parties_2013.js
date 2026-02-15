// Historical party definitions for 2013 Constituent Assembly election
// Source: Wikipedia / ANFREL / Election Commission Nepal
// Data extracted: February 2026

export const PARTIES_2013 = {
  // Major parties with seats
  NC: {
    code: "NC",
    name: "Nepali Congress",
    shortName: "NC",
    color: "#16a34a",  // Green-600
    historicalFullName: "Nepali Congress",
    fptpSeats: 105,
    prSeats: 91,
    totalSeats: 196,
    prVotes: 2418370,
    prVotePercent: 25.55,
    isMajor: true
  },
  
  UML: {
    code: "UML",
    name: "CPN-UML",
    shortName: "CPN-UML",
    color: "#dc2626",  // Red-600
    historicalFullName: "Communist Party of Nepal (Unified Marxist-Leninist)",
    fptpSeats: 91,
    prSeats: 84,
    totalSeats: 175,
    prVotes: 2239609,
    prVotePercent: 23.66,
    isMajor: true
  },
  
  Maoist: {
    code: "Maoist",
    name: "CPN-Maoist Centre",
    shortName: "CPN-MC",
    color: "#991b1b",  // Red-800
    historicalFullName: "Unified Communist Party of Nepal (Maoist)",
    fptpSeats: 26,
    prSeats: 54,
    totalSeats: 80,
    prVotes: 1439726,
    prVotePercent: 15.21,
    isMajor: true
  },
  
  RPPNepal: {
    code: "RPPNepal",
    name: "Rastriya Prajatantra Party Nepal",
    shortName: "RPP-Nepal",
    color: "#7c3aed",  // Violet-600
    historicalFullName: "Rastriya Prajatantra Party Nepal",
    fptpSeats: 0,
    prSeats: 24,
    totalSeats: 24,
    prVotes: 630697,
    prVotePercent: 6.66,
    isMajor: false
  },
  
  MJFL: {
    code: "MJFL",
    name: "Madhesi Jana Adhikar Forum (Loktantrik)",
    shortName: "MJF-L",
    color: "#f59e0b",  // Amber-500
    historicalFullName: "Madhesi Jana Adhikar Forum, Nepal (Loktantrik)",
    fptpSeats: 4,
    prSeats: 10,
    totalSeats: 14,
    prVotes: 274987,
    prVotePercent: 2.91,
    isMajor: false
  },
  
  TMLP: {
    code: "TMLP",
    name: "Tarai-Madhes Loktantrik Party",
    shortName: "TMLP",
    color: "#8b5cf6",  // Violet-500
    historicalFullName: "Tarai-Madhes Loktantrik Party",
    fptpSeats: 4,
    prSeats: 7,
    totalSeats: 11,
    prVotes: 181140,
    prVotePercent: 1.91,
    isMajor: false
  },
  
  // Others aggregate
  Others: {
    code: "Others",
    name: "Others",
    shortName: "Others",
    color: "#4b5563",  // Gray-600
    historicalFullName: "Other Parties & Independents",
    fptpSeats: 10,
    prSeats: 59,
    totalSeats: 69,
    prVotes: 1800000,  // Approximate
    prVotePercent: 19.00,
    isMajor: false,
    includedParties: [
      "Rastriya Prajatantra Party",
      "Madhesi Jana Adhikar Forum, Nepal",
      "Sadbhavana Party",
      "Communist Party of Nepal (Marxist-Leninist)",
      "Rastriya Janamorcha",
      "Independent"
    ]
  }
};

// National summary statistics
export const NATIONAL_SUMMARY_2013 = {
  year: 2013,
  date: "2013-11-19",
  totalSeats: 575,  // 575 of 601 seats (26 nominated later)
  fptpSeats: 240,
  prSeats: 335,
  system: "Mixed (FPTP + PR)",
  registeredVoters: 12100000,
  votesCast: 9480000,  // Approximate
  turnoutPercent: 78.34,
  totalCandidates: 0,
  totalParties: 122
};

// Helper function to get party by code
export function getParty2013(code) {
  return PARTIES_2013[code] || null;
}

// Helper function to get all major parties
export function getMajorParties2013() {
  return Object.values(PARTIES_2013).filter(p => p.isMajor);
}

// Map historical party names to standardized codes
export const PARTY_NAME_MAP_2013 = {
  "Nepali Congress": "NC",
  "Communist Party of Nepal (Unified Marxist–Leninist)": "UML",
  "CPN (UML)": "UML",
  "Unified Communist Party of Nepal (Maoist)": "Maoist",
  "CPN (Maoist)": "Maoist",
  "Rastriya Prajatantra Party Nepal": "RPPNepal",
  "RPP-Nepal": "RPPNepal",
  "Madhesi Jana Adhikar Forum, Nepal (Loktantrik)": "MJFL",
  "MJF-Loktantrik": "MJFL",
  "Tarai-Madhes Loktantrik Party": "TMLP",
  "Rastriya Prajatantra Party": "Others",
  "Madhesi Jana Adhikar Forum, Nepal": "Others",
  "Sadbhavana Party": "Others",
  "Communist Party of Nepal (Marxist-Leninist)": "Others",
  "Rastriya Janamorcha": "Others",
  "Independent": "Others"
};

// Helper to map party name to code
export function mapPartyName2013(partyName) {
  return PARTY_NAME_MAP_2013[partyName] || "Others";
}
