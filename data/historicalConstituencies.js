// Historical Constituency Data
// This file contains constituency-level election results for different years

import { constituencies } from './constituencies.js';
import { 
  ELECTION_1999, PARTIES_1999,
  ELECTION_2017, PARTIES_2017 
} from './historical/index.js';

export const HISTORICAL_CONSTITUENCIES = {
  2026: {
    // Simulation mode - will be dynamically filled from simulator
    constituencies: [],
    geojsonPath: '/maps/nepal-constituencies.geojson',
    getWinner: (constituencyId) => null,
    getResults: (constituencyId) => null,
  },
  2022: {
    // Already available in constituencies.js
    constituencies: constituencies,
    geojsonPath: '/maps/nepal-constituencies.geojson',
    getWinner: (constituencyId) => {
      const c = constituencies.find(c => c.id === constituencyId);
      return c?.winner2022;
    },
    getResults: (constituencyId) => {
      const c = constituencies.find(c => c.id === constituencyId);
      return c?.results2022;
    },
  },
  2017: {
    // 2017 General Election - 165 constituencies (similar to 2022)
    // PARTIAL DATASET - 24 constituencies from available CSV
    year: 2017,
    name: "2017 General Election",
    date: "2017-11-26/12-07",
    description: "House of Representatives Election 2074 (2017) - First under 2015 Constitution",
    totalSeats: 275,
    fptpSeats: 165,
    prSeats: 110,
    system: "Mixed (FPTP + PR)",
    
    // Reference to available data
    data: ELECTION_2017,
    parties: PARTIES_2017,
    
    // Constituency access
    constituencies: Object.entries(ELECTION_2017.constituencies).map(([id, c]) => ({
      id,
      ...c
    })),
    constituencyCount: ELECTION_2017.totalConstituencies,
    
    // Accessor functions
    getWinner: (constituencyId) => ELECTION_2017.getWinner(constituencyId),
    getResults: (constituencyId) => ELECTION_2017.getResults(constituencyId),
    getConstituency: (constituencyId) => ELECTION_2017.getConstituency(constituencyId),
    
    // National results
    getNationalResults: () => ELECTION_2017.summary,
    
    // GeoJSON availability
    geojsonAvailable: true,
    geojsonPath: '/maps/nepal-constituencies.geojson',
    notes: "Partial data available (24 constituencies). Same boundaries as 2022."
  },
  2013: {
    // 2013 Constituent Assembly - 240 constituencies (different boundaries)
    constituencies: [],
    geojsonPath: '/maps/nepal-constituencies-2013.geojson',
    getWinner: (constituencyId) => null,
    getResults: (constituencyId) => null,
    // TODO: Add 2013 CA election results from Wikipedia/ECN
  },
  2008: {
    // 2008 Constituent Assembly - 240 constituencies (same as 2013)
    constituencies: [],
    geojsonPath: '/maps/nepal-constituencies-2013.geojson',
    getWinner: (constituencyId) => null,
    getResults: (constituencyId) => null,
    // TODO: Add 2008 CA election results from Carter Center/ECN
  },
  1999: {
    // 1999 General Election - 205 constituencies (pre-2015 constitution)
    // COMPLETE DATASET - Parsed from Nepal Research
    year: 1999,
    name: "1999 General Election",
    date: "1999-05-03/17",
    description: "House of Representatives Election 2056 (1999)",
    totalSeats: 205,
    system: "FPTP",
    
    // Reference to full data
    data: ELECTION_1999,
    parties: PARTIES_1999,
    
    // Constituency access
    constituencies: Object.entries(ELECTION_1999.constituencies).map(([id, c]) => ({
      id,
      ...c
    })),
    constituencyCount: 205,
    
    // Accessor functions
    getWinner: (constituencyId) => ELECTION_1999.getWinner(constituencyId),
    getResults: (constituencyId) => ELECTION_1999.getResults(constituencyId),
    getConstituency: (constituencyId) => ELECTION_1999.getConstituency(constituencyId),
    
    // National results
    getNationalResults: () => ELECTION_1999.summary,
    
    // GeoJSON availability
    geojsonAvailable: false,
    geojsonPath: null,
    notes: "Historical boundaries (205 constituencies) differ from current (165). No GeoJSON mapping available."
  },
  1994: {
    // 1994 Mid-term Election - 205 constituencies
    constituencies: [],
    geojsonPath: '/maps/nepal-constituencies-1990s.geojson',
    getWinner: (constituencyId) => null,
    getResults: (constituencyId) => null,
    // TODO: Add 1994 results from IPU Parline/Wikipedia
  },
  1991: {
    // 1991 General Election - 205 constituencies (first democratic election)
    constituencies: [],
    geojsonPath: '/maps/nepal-constituencies-1990s.geojson',
    getWinner: (constituencyId) => null,
    getResults: (constituencyId) => null,
    // TODO: Add 1991 results from IPU Parline/Wikipedia
  },
};

// Helper function to get constituency data for a specific year
export function getHistoricalConstituency(year, constituencyId) {
  const yearData = HISTORICAL_CONSTITUENCIES[year];
  if (!yearData) return null;
  
  // For years with new data structure (1999, 2017)
  if (year === 1999 || year === 2017) {
    return yearData.getConstituency(constituencyId);
  }
  
  const constituency = yearData.constituencies.find(c => c.id === constituencyId);
  return constituency;
}

// Helper function to get winner for a specific year
export function getHistoricalWinner(year, constituencyId) {
  const yearData = HISTORICAL_CONSTITUENCIES[year];
  if (!yearData) return null;
  
  return yearData.getWinner(constituencyId);
}

// Helper function to get results for a specific year
export function getHistoricalResults(year, constituencyId) {
  const yearData = HISTORICAL_CONSTITUENCIES[year];
  if (!yearData) return null;
  
  return yearData.getResults(constituencyId);
}

// Get all available years
export function getAvailableYears() {
  return Object.keys(HISTORICAL_CONSTITUENCIES).map(Number).sort((a, b) => b - a);
}

// Get years with complete data
export function getCompleteYears() {
  return Object.entries(HISTORICAL_CONSTITUENCIES)
    .filter(([year, data]) => data.constituencies && data.constituencies.length > 0)
    .map(([year]) => Number(year))
    .sort((a, b) => b - a);
}
