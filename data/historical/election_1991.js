// 1991 Election Constituency Data
// Source: Nepal Research / Election Commission Nepal / IPU
// Generated: February 2026
// Total Constituencies: 205 (TO BE FILLED - Placeholder structure)

import { PARTIES_1991, NATIONAL_SUMMARY_1991, mapPartyName1991 } from './parties_1991.js';

// Placeholder for constituency data - to be filled from Nepal Research PDF
export const CONSTITUENCIES_1991 = {
  // Data extraction from PDF in progress
  // Source: https://nepalresearch.org/politics/background/elections_old/election_1991_constituency_results_english.pdf
};

// Export complete election data
export const ELECTION_1991 = {
  year: 1991,
  summary: NATIONAL_SUMMARY_1991,
  parties: PARTIES_1991,
  constituencies: CONSTITUENCIES_1991,
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
