// 2013 Constituent Assembly Election Data
//
// !! DATA MISSING — NOT YET EXTRACTED !!
//
// Constituency-level results for the 2013 CA election have NOT been loaded.
// CONSTITUENCIES_2013 is an empty object; totalConstituencies is 0.
//
// Official sources to extract this data from:
//   https://en.wikipedia.org/wiki/Results_of_the_2013_Nepalese_Constituent_Assembly_election
//   https://election.gov.np (Election Commission Nepal)
//   ANFREL: https://anfrel.org/category/nepal/
//
// Until filled, do NOT display 2013 data to users — show a "data unavailable" message instead.

import { PARTIES_2013, NATIONAL_SUMMARY_2013 } from './parties_2013.js';

// EMPTY — constituency data extraction pending
export const CONSTITUENCIES_2013 = {};

// Export complete election data
export const ELECTION_2013 = {
  year: 2013,
  summary: NATIONAL_SUMMARY_2013,
  parties: PARTIES_2013,
  constituencies: CONSTITUENCIES_2013,
  totalConstituencies: 0, // Not yet extracted — do not show to users

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
      .filter(([, c]) => c.district === district)
      .map(([id, c]) => ({ id, ...c }));
  },
};
