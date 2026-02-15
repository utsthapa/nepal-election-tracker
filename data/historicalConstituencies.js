// Historical Constituency Data
// This file contains constituency-level election results for different years

import { constituencies } from './constituencies.js';
import { 
  ELECTION_1991, PARTIES_1991,
  ELECTION_1994, PARTIES_1994,
  ELECTION_1999, PARTIES_1999,
  ELECTION_2008, PARTIES_2008,
  ELECTION_2013, PARTIES_2013,
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
    // NATIONAL DATA ONLY - Constituency data to be extracted from Wikipedia/ANFREL
    year: 2013,
    name: "2013 Constituent Assembly Election",
    date: "2013-11-19",
    description: "Constituent Assembly Election 2070 (2013) - Second CA election",
    totalSeats: 575,
    fptpSeats: 240,
    prSeats: 335,
    system: "Mixed (FPTP + PR)",
    
    // Reference to available data
    data: ELECTION_2013,
    parties: PARTIES_2013,
    
    // Constituency access
    constituencies: Object.entries(ELECTION_2013.constituencies).map(([id, c]) => ({
      id,
      ...c
    })),
    constituencyCount: ELECTION_2013.totalConstituencies,
    
    // Accessor functions
    getWinner: (constituencyId) => ELECTION_2013.getWinner(constituencyId),
    getResults: (constituencyId) => ELECTION_2013.getResults(constituencyId),
    getConstituency: (constituencyId) => ELECTION_2013.getConstituency(constituencyId),
    
    // National results
    getNationalResults: () => ELECTION_2013.summary,
    
    // GeoJSON availability
    geojsonAvailable: false,
    geojsonPath: '/maps/nepal-constituencies-2013.geojson',
    notes: "National-level data only. Constituency data to be extracted from Wikipedia/ANFREL. 240 constituencies (different from current 165)."
  },
  2008: {
    // 2008 Constituent Assembly - 240 constituencies (same as 2013)
    // NATIONAL DATA ONLY - Constituency data to be extracted from Wikipedia/Carter Center
    year: 2008,
    name: "2008 Constituent Assembly Election",
    date: "2008-04-10",
    description: "Constituent Assembly Election 2064 (2008) - First CA election",
    totalSeats: 575,
    fptpSeats: 240,
    prSeats: 335,
    system: "Mixed (FPTP + PR)",
    
    // Reference to available data
    data: ELECTION_2008,
    parties: PARTIES_2008,
    
    // Constituency access
    constituencies: Object.entries(ELECTION_2008.constituencies).map(([id, c]) => ({
      id,
      ...c
    })),
    constituencyCount: ELECTION_2008.totalConstituencies,
    
    // Accessor functions
    getWinner: (constituencyId) => ELECTION_2008.getWinner(constituencyId),
    getResults: (constituencyId) => ELECTION_2008.getResults(constituencyId),
    getConstituency: (constituencyId) => ELECTION_2008.getConstituency(constituencyId),
    
    // National results
    getNationalResults: () => ELECTION_2008.summary,
    
    // GeoJSON availability
    geojsonAvailable: false,
    geojsonPath: '/maps/nepal-constituencies-2013.geojson',
    notes: "National-level data only. Constituency data to be extracted from Wikipedia/Carter Center. 240 constituencies (different from current 165)."
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
    // NATIONAL DATA ONLY - Constituency data to be extracted from PDF
    year: 1994,
    name: "1994 Mid-term Election",
    date: "1994-11-15",
    description: "House of Representatives Election 2051 (1994) - Mid-term election",
    totalSeats: 205,
    system: "FPTP",
    
    // Reference to available data
    data: ELECTION_1994,
    parties: PARTIES_1994,
    
    // Constituency access
    constituencies: Object.entries(ELECTION_1994.constituencies).map(([id, c]) => ({
      id,
      ...c
    })),
    constituencyCount: ELECTION_1994.totalConstituencies,
    
    // Accessor functions
    getWinner: (constituencyId) => ELECTION_1994.getWinner(constituencyId),
    getResults: (constituencyId) => ELECTION_1994.getResults(constituencyId),
    getConstituency: (constituencyId) => ELECTION_1994.getConstituency(constituencyId),
    
    // National results
    getNationalResults: () => ELECTION_1994.summary,
    
    // GeoJSON availability
    geojsonAvailable: false,
    geojsonPath: null,
    notes: "National-level data only. Constituency data to be extracted from PDF. Historical boundaries (205 constituencies) differ from current."
  },
  1991: {
    // 1991 General Election - 205 constituencies (first democratic election)
    // NATIONAL DATA ONLY - Constituency data to be extracted from PDF
    year: 1991,
    name: "1991 General Election",
    date: "1991-05-12",
    description: "House of Representatives Election 2048 (1991) - First democratic election since 1959",
    totalSeats: 205,
    system: "FPTP",
    
    // Reference to available data
    data: ELECTION_1991,
    parties: PARTIES_1991,
    
    // Constituency access
    constituencies: Object.entries(ELECTION_1991.constituencies).map(([id, c]) => ({
      id,
      ...c
    })),
    constituencyCount: ELECTION_1991.totalConstituencies,
    
    // Accessor functions
    getWinner: (constituencyId) => ELECTION_1991.getWinner(constituencyId),
    getResults: (constituencyId) => ELECTION_1991.getResults(constituencyId),
    getConstituency: (constituencyId) => ELECTION_1991.getConstituency(constituencyId),
    
    // National results
    getNationalResults: () => ELECTION_1991.summary,
    
    // GeoJSON availability
    geojsonAvailable: false,
    geojsonPath: null,
    notes: "National-level data only. Constituency data to be extracted from PDF. Historical boundaries (205 constituencies) differ from current."
  },
};

// Helper function to get constituency data for a specific year
export function getHistoricalConstituency(year, constituencyId) {
  const yearData = HISTORICAL_CONSTITUENCIES[year];
  if (!yearData) return null;
  
  // For years with new data structure (1991, 1994, 1999, 2008, 2013, 2017)
  if ([1991, 1994, 1999, 2008, 2013, 2017].includes(year)) {
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
