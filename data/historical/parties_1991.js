// Historical party definitions for 1991 election
// Source: Nepal Research / Election Commission Nepal / IPU
// Data extracted: February 2026

export const PARTIES_1991 = {
  // Major parties with seats
  NC: {
    code: "NC",
    name: "Nepali Congress",
    shortName: "NC",
    color: "#16a34a",  // Green-600
    historicalFullName: "Nepali Congress",
    seatsWon: 110,
    votes: 2752452,
    votePercent: 37.75,
    candidates: 204,
    isMajor: true
  },
  
  UML: {
    code: "UML",
    name: "Nepal Communist Party (UML)",
    shortName: "CPN-UML",
    color: "#dc2626",  // Red-600
    historicalFullName: "United Nepal Communist Party (UNCP)",
    seatsWon: 69,
    votes: 2040102,
    votePercent: 27.98,
    candidates: 177,
    isMajor: true
  },
  
  UPF: {
    code: "UPF",
    name: "United People's Front",
    shortName: "UPF",
    color: "#0891b2",  // Cyan-600
    historicalFullName: "United People's Front",
    seatsWon: 9,
    votes: 351904,
    votePercent: 4.83,
    candidates: 70,
    isMajor: false
  },
  
  NSP: {
    code: "NSP",
    name: "Nepal Sadbhawana Party",
    shortName: "NSP",
    color: "#d97706",  // Amber-600
    historicalFullName: "Nepal Sadavabana Party (NSP)",
    seatsWon: 6,
    votes: 298610,
    votePercent: 4.10,
    candidates: 75,
    isMajor: false
  },
  
  // Others aggregate
  Others: {
    code: "Others",
    name: "Others",
    shortName: "Others",
    color: "#4b5563",  // Gray-600
    historicalFullName: "Other Parties & Independents",
    seatsWon: 11,
    votes: 1500000,  // Approximate
    votePercent: 25.34,
    candidates: 600,
    isMajor: false,
    includedParties: [
      "Rastriya Prajatantra Party (Chand)",
      "Rastriya Prajatantra Party (Thapa)",
      "Nepal Communist Party (M.L)",
      "Independent"
    ]
  }
};

// National summary statistics
export const NATIONAL_SUMMARY_1991 = {
  year: 1991,
  date: "1991-05-12",
  totalSeats: 205,
  system: "FPTP",
  registeredVoters: 11000000,
  votesCast: 7291089,
  turnoutPercent: 66.00,
  validVotes: 6969061,
  invalidVotes: 322023,
  totalCandidates: 0,
  totalParties: 20
};

// Helper function to get party by code
export function getParty1991(code) {
  return PARTIES_1991[code] || null;
}

// Helper function to get all major parties
export function getMajorParties1991() {
  return Object.values(PARTIES_1991).filter(p => p.isMajor);
}

// Map historical party names to standardized codes
export const PARTY_NAME_MAP_1991 = {
  "Nepali Congress": "NC",
  "Nepali Congress Party": "NC",
  "United Nepal Communist Party": "UML",
  "UNCP": "UML",
  "Nepal Communist Party (UML)": "UML",
  "United People's Front": "UPF",
  "UPF": "UPF",
  "Nepal Sadbhawana Party": "NSP",
  "Nepal Sadavabana Party": "NSP",
  "NSP": "NSP",
  "Independent": "Others"
};

// Helper to map party name to code
export function mapPartyName1991(partyName) {
  return PARTY_NAME_MAP_1991[partyName] || "Others";
}
