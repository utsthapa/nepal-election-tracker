// Historical Nepal Election Data
// Sources: Election Commission of Nepal, IPU Parline, Carter Center, Rising Nepal Daily

export const HISTORICAL_PARTIES = {
  // Modern parties (post-2015)
  NC: { name: 'Nepali Congress', short: 'NC', color: '#22c55e' },
  UML: { name: 'CPN-UML', short: 'UML', color: '#ef4444' },
  Maoist: { name: 'CPN-Maoist Centre', short: 'Maoist', color: '#991b1b' },
  RSP: { name: 'Rastriya Swatantra Party', short: 'RSP', color: '#3b82f6' },
  RPP: { name: 'Rastriya Prajatantra Party', short: 'RPP', color: '#8b5cf6' },
  JSPN: { name: 'Janata Samajbadi Party', short: 'JSPN', color: '#ec4899' },
  US: { name: 'CPN (Unified Socialist)', short: 'US', color: '#f97316' },
  JP: { name: 'Janamat Party', short: 'JP', color: '#14b8a6' },
  LSP: { name: 'Loktantrik Samajbadi Party', short: 'LSP', color: '#a855f7' },
  NUP: { name: 'Nagarik Unmukti Party', short: 'NUP', color: '#06b6d4' },

  // 2017 era parties
  RJPN: { name: 'Rastriya Janata Party Nepal', short: 'RJPN', color: '#f59e0b' },
  FSFN: { name: 'Federal Socialist Forum Nepal', short: 'FSFN', color: '#84cc16' },

  // 2008/2013 era parties
  MPRF: { name: 'Madhesi Peoples Rights Forum', short: 'MPRF', color: '#f97316' },
  TMDP: { name: 'Terai Madhes Democratic Party', short: 'TMDP', color: '#eab308' },

  // Historical parties (1990s)
  NSP: { name: 'Nepal Sadbhawana Party', short: 'NSP', color: '#ec4899' },
  CPNML: { name: 'CPN (Marxist-Leninist)', short: 'CPN-ML', color: '#dc2626' },
  NMKP: { name: 'Nepal Majdoor Kisan Party', short: 'NMKP', color: '#b91c1c' },

  // Generic
  Others: { name: 'Others/Independents', short: 'Others', color: '#6b7280' },
};

export const ELECTIONS = {
  2022: {
    year: 2022,
    name: '2022 General Election',
    type: 'House of Representatives',
    date: 'November 20, 2022',
    totalSeats: 275,
    fptpSeats: 165,
    prSeats: 110,
    turnout: '61%',
    prThreshold: 3,
    notes: 'First election with RSP as major force. Hung parliament resulted.',
    results: {
      FPTP: { NC: 57, UML: 44, Maoist: 18, RSP: 7, RPP: 7, JSPN: 6, US: 10, JP: 1, LSP: 4, NUP: 3, Others: 8 },
      PR: { NC: 32, UML: 34, Maoist: 14, RSP: 13, RPP: 7, JSPN: 6, US: 0, JP: 5, LSP: 0, NUP: 0, Others: 0 },
      Total: { NC: 89, UML: 78, Maoist: 32, RSP: 20, RPP: 14, JSPN: 12, US: 10, JP: 6, LSP: 4, NUP: 3, Others: 8 },
    },
    government: 'NC-led coalition with Maoist, US, LSP, and others. Pushpa Kamal Dahal became PM.',
  },

  2017: {
    year: 2017,
    name: '2017 General Election',
    type: 'House of Representatives',
    date: 'November 26 & December 7, 2017',
    totalSeats: 275,
    fptpSeats: 165,
    prSeats: 110,
    turnout: '68.68%',
    prThreshold: 3,
    notes: 'First election under 2015 Constitution. Left Alliance (UML + Maoist) swept the polls.',
    results: {
      FPTP: { UML: 80, Maoist: 36, NC: 23, RJPN: 11, FSFN: 10, Others: 5 },
      PR: { UML: 41, NC: 40, Maoist: 17, RJPN: 6, FSFN: 6, Others: 0 },
      Total: { UML: 121, NC: 63, Maoist: 53, RJPN: 17, FSFN: 16, Others: 5 },
    },
    government: 'UML-Maoist merged to form NCP. KP Sharma Oli became PM with historic 2/3 majority.',
  },

  2013: {
    year: 2013,
    name: '2013 Constituent Assembly Election',
    type: 'Constituent Assembly (2nd)',
    date: 'November 19, 2013',
    totalSeats: 601,
    fptpSeats: 240,
    prSeats: 335,
    nominatedSeats: 26,
    turnout: '78.34%',
    prThreshold: 0,
    notes: 'Record turnout. NC and UML surged while Maoists suffered major losses. Successfully drafted 2015 Constitution.',
    results: {
      FPTP: { NC: 105, UML: 91, Maoist: 26, RPP: 0, MPRF: 4, Others: 14 },
      PR: { NC: 80, UML: 76, Maoist: 49, RPP: 22, MPRF: 10, Others: 98 },
      Nominated: { NC: 11, UML: 8, Maoist: 5, RPP: 2, Others: 0 },
      Total: { NC: 196, UML: 175, Maoist: 80, RPP: 24, MPRF: 14, Others: 112 },
    },
    government: 'NC-UML coalition. Sushil Koirala became PM.',
  },

  2008: {
    year: 2008,
    name: '2008 Constituent Assembly Election',
    type: 'Constituent Assembly (1st)',
    date: 'April 10, 2008',
    totalSeats: 601,
    fptpSeats: 240,
    prSeats: 335,
    nominatedSeats: 26,
    turnout: '61.70%',
    prThreshold: 0,
    notes: 'Historic election after end of civil war. Maoists emerged as largest party. Monarchy abolished.',
    results: {
      FPTP: { Maoist: 120, NC: 37, UML: 33, MPRF: 28, TMDP: 9, Others: 13 },
      PR: { Maoist: 100, NC: 73, UML: 70, MPRF: 22, TMDP: 11, Others: 59 },
      Nominated: { Maoist: 9, NC: 5, UML: 5, MPRF: 2, Others: 5 },
      Total: { Maoist: 229, NC: 115, UML: 108, MPRF: 52, TMDP: 20, Others: 77 },
    },
    government: 'Maoist-led coalition. Pushpa Kamal Dahal (Prachanda) became PM.',
  },

  1999: {
    year: 1999,
    name: '1999 General Election',
    type: 'House of Representatives',
    date: 'May 3 & 17, 1999',
    totalSeats: 205,
    fptpSeats: 205,
    prSeats: 0,
    turnout: '65.79%',
    notes: 'Last election before Maoist insurgency escalated. NC returned to power with majority.',
    results: {
      FPTP: { NC: 111, UML: 71, RPP: 11, CPNML: 5, NSP: 5, Others: 2 },
      Total: { NC: 111, UML: 71, RPP: 11, CPNML: 5, NSP: 5, Others: 2 },
    },
    government: 'NC majority government. Krishna Prasad Bhattarai, then Girija Prasad Koirala became PM.',
  },

  1994: {
    year: 1994,
    name: '1994 Mid-term Election',
    type: 'House of Representatives',
    date: 'November 15, 1994',
    totalSeats: 205,
    fptpSeats: 205,
    prSeats: 0,
    turnout: '61.86%',
    notes: 'UML became largest party. First communist government in Nepal history (minority).',
    results: {
      FPTP: { UML: 88, NC: 83, RPP: 20, NSP: 3, NMKP: 4, Others: 7 },
      Total: { UML: 88, NC: 83, RPP: 20, NSP: 3, NMKP: 4, Others: 7 },
    },
    government: 'UML minority government. Man Mohan Adhikari became first communist PM.',
  },

  1991: {
    year: 1991,
    name: '1991 General Election',
    type: 'House of Representatives',
    date: 'May 12, 1991',
    totalSeats: 205,
    fptpSeats: 205,
    prSeats: 0,
    turnout: '65.15%',
    notes: 'First multi-party election after 1990 revolution. NC won clear majority.',
    results: {
      FPTP: { NC: 110, UML: 69, RPP: 4, NSP: 6, NMKP: 2, Others: 14 },
      Total: { NC: 110, UML: 69, RPP: 4, NSP: 6, NMKP: 2, Others: 14 },
    },
    government: 'NC majority government. Girija Prasad Koirala became PM.',
  },
};

// Get sorted election years (newest first)
export const getElectionYears = () => {
  return Object.keys(ELECTIONS).map(Number).sort((a, b) => b - a);
};

// Get party info, falling back to generic if not found
export const getPartyInfo = (partyId) => {
  return HISTORICAL_PARTIES[partyId] || { name: partyId, short: partyId, color: '#6b7280' };
};

export default ELECTIONS;
