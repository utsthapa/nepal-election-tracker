// 1994 Election Constituency Data
// Source: Nepal Research / Election Commission Nepal
// Generated: February 2026
// Total Constituencies: 205 (TO BE FILLED - Placeholder structure)

import { PARTIES_1994, NATIONAL_SUMMARY_1994, mapPartyName1994 } from './parties_1994.js';

// Placeholder for constituency data - to be filled from Nepal Research PDF
export const CONSTITUENCIES_1994 = {
  // Data extraction from PDF in progress
  // Source: https://nepalresearch.org/politics/background/elections_old/election_1994_constituency_results_english.pdf
};

// Export complete election data
export const ELECTION_1994 = {
  year: 1994,
  summary: NATIONAL_SUMMARY_1994,
  parties: PARTIES_1994,
  constituencies: CONSTITUENCIES_1994,
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
