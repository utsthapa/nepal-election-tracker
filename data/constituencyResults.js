// Constituency-level election results for Nepal
// Covers 165 constituencies for 2017 and 2022 elections

import { CONSTITUENCIES_2022, PROVINCE_DATA_2022 } from './historical/2022/index.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './historical/2017/index.js';

// Export raw constituency data
export const CONSTITUENCY_RESULTS = {
  2022: CONSTITUENCIES_2022,
  2017: CONSTITUENCIES_2017,
};

// Export province data
export const PROVINCE_RESULTS = {
  2022: PROVINCE_DATA_2022,
  2017: PROVINCE_DATA_2017,
};

// Helper function to get constituency result
export function getConstituencyResult(year, constituency) {
  return CONSTITUENCY_RESULTS[year]?.[constituency] || null;
}

// Helper function to get all constituencies for a year
export function getConstituenciesByYear(year) {
  return Object.keys(CONSTITUENCY_RESULTS[year] || {});
}

// Helper function to get results by province
export function getConstituenciesByProvince(year, provinceId) {
  const provinceData = PROVINCE_RESULTS[year]?.[provinceId];
  return provinceData ? provinceData.data : {};
}

// Helper function to get province info
export function getProvinceInfo(year, provinceId) {
  return PROVINCE_RESULTS[year]?.[provinceId] || null;
}

// Helper function to get winner of a constituency
export function getConstituencyWinner(year, constituency) {
  const result = getConstituencyResult(year, constituency);
  return result?.winner || null;
}

// Helper function to get all winners by party
export function getWinnersByParty(year, party) {
  const constituencies = CONSTITUENCY_RESULTS[year] || {};
  return Object.entries(constituencies)
    .filter(([_, data]) => data.winner?.party === party)
    .map(([name, data]) => ({ constituency: name, ...data.winner }));
}

// Helper function to get election summary
export function getElectionSummary(year) {
  const constituencies = CONSTITUENCY_RESULTS[year] || {};
  const total = Object.keys(constituencies).length;

  const partyWins = {};
  Object.values(constituencies).forEach(c => {
    const party = c.winner?.party;
    if (party) {
      partyWins[party] = (partyWins[party] || 0) + 1;
    }
  });

  return {
    year,
    totalConstituencies: total,
    partyWins,
    complete: total === 165, // 165 constituencies in total
  };
}

// Get statistics for a year
export function getElectionStats(year) {
  const constituencies = CONSTITUENCY_RESULTS[year] || {};
  const data = Object.values(constituencies);

  const totalVotes = data.reduce((sum, c) => sum + (c.votesCast || 0), 0);
  const avgMargin =
    data.length > 0 ? data.reduce((sum, c) => sum + (c.margin || 0), 0) / data.length : 0;

  return {
    year,
    constituenciesWithData: data.length,
    totalVotesCast: totalVotes,
    averageMargin: Math.round(avgMargin),
    totalCandidates: data.reduce((sum, c) => sum + (c.candidates?.length || 0), 0),
  };
}

export default {
  CONSTITUENCY_RESULTS,
  PROVINCE_RESULTS,
  getConstituencyResult,
  getConstituenciesByYear,
  getConstituenciesByProvince,
  getProvinceInfo,
  getConstituencyWinner,
  getWinnersByParty,
  getElectionSummary,
  getElectionStats,
};
