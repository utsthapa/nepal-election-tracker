// 2008 Constituent Assembly Election Data
// Source: Wikipedia / Carter Center / Election Commission Nepal
// Generated: February 2026
// Total Constituencies: 240 (TO BE FILLED - Placeholder structure)

import { PARTIES_2008, NATIONAL_SUMMARY_2008, mapPartyName2008 } from './parties_2008.js';

// Placeholder for constituency data - to be filled from Wikipedia/Carter Center
export const CONSTITUENCIES_2008 = {
  // Data extraction in progress
  // Source: https://en.wikipedia.org/wiki/Results_of_the_2008_Nepalese_Constituent_Assembly_election
};

// Export complete election data
export const ELECTION_2008 = {
  year: 2008,
  summary: NATIONAL_SUMMARY_2008,
  parties: PARTIES_2008,
  constituencies: CONSTITUENCIES_2008,
  totalConstituencies: 0, // To be updated when data is extracted
  
  // Helper methods
  getConstituency(id) {
    return this.constituencies[id] || null;
  },
  
  getWinner(id) {
    const c = this.constituencies[id];
    return c ? c.winner : null;
  },
  
  getResults(id) {
    const c = this.constituencies[id];
    return c ? c.results : null;
  },
  
  getDistricts() {
    const districts = new Set();
    Object.values(this.constituencies).forEach(c => {
      districts.add(c.district);
    });
    return Array.from(districts).sort();
  },
  
  getConstituenciesByDistrict(district) {
    return Object.entries(this.constituencies)
      .filter(([id, c]) => c.district === district)
      .map(([id, c]) => ({ id, ...c }));
  }
};
