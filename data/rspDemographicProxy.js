// RSP Demographic Proxying Data
// Implements Demographic Proxying (Small Area Estimation) to solve "Ghost Seat" problem
// Projects RSP performance to similar districts using seed data from 2022

import { DISTRICT_DEMOGRAPHICS } from './demographics';
import { constituencies } from './constituencies';

/**
 * RSP Seed Seats from 2022 General Election
 * These 8 seats where RSP won serve as proxy data for similar districts
 */
export const RSP_SEED_SEATS = [
  'P3-Kathmandu-2',  // Sobita Gautam
  'P3-Kathmandu-6',  // Shishir Khanal
  'P3-Kathmandu-7',  // Ganesh Parajuli
  'P3-Kathmandu-8',  // Biraj Bhakta Shrestha
  'P3-Lalitpur-3',   // Toshima Karki
  'P3-Chitwan-1',    // Hari Dhakal
  'P3-Chitwan-2',    // Rabi Lamichhane
  'P4-Tanahun-1',    // Swarnim Wagle (By-election victory)
];

/**
 * Districts containing RSP seed seats
 * Used to calculate mean characteristics
 */
export const RSP_SEED_DISTRICTS = [
  'Kathmandu',
  'Lalitpur',
  'Chitwan',
  'Tanahun',
];

/**
 * Calculate mean characteristics of RSP seed districts
 * These characteristics are used to identify similar districts
 * @returns {Object} Mean characteristics
 */
export function calculateRSPSeedCharacteristics() {
  const districts = RSP_SEED_DISTRICTS;
  const characteristics = {
    urbanization: 0,
    youthDensity: 0,  // 15-29 age group
    literacyRate: 0,
  };
  
  districts.forEach(district => {
    const demo = DISTRICT_DEMOGRAPHICS[district];
    if (demo) {
      characteristics.urbanization += demo.urbanPopulation || 0;
      characteristics.youthDensity += (demo.ageGroups?.['15-29'] || 0);
      characteristics.literacyRate += demo.literacyRate || 0;
    }
  });
  
  const count = districts.length;
  return {
    urbanization: characteristics.urbanization / count,
    youthDensity: characteristics.youthDensity / count,
    literacyRate: characteristics.literacyRate / count,
  };
}

/**
 * Calculate mean RSP vote share in seed seats
 * This serves as the proxy baseline for similar districts
 * @param {Array} constituencies - All constituencies data
 * @returns {number} Mean RSP vote share (0-1)
 */
export function calculateRSPSeedBaseline(constituencies) {
  const seedResults = RSP_SEED_SEATS.map(seatId => {
    const constituency = constituencies.find(c => c.id === seatId);
    return constituency?.results2022?.RSP || 0;
  }).filter(v => v > 0);
  
  if (seedResults.length === 0) return 0;
  return seedResults.reduce((sum, v) => sum + v, 0) / seedResults.length;
}

/**
 * Check if a constituency should use RSP proxy baseline
 * Criteria:
 * 1. District is similar to seed districts (within threshold)
 * 2. District is in Metropolitan cluster (high urbanization)
 * 3. RSP got 0% in 2022 (ghost seat)
 * 
 * @param {Object} constituency - The constituency object
 * @param {Object} demographics - DISTRICT_DEMOGRAPHICS data
 * @param {Object} seedCharacteristics - Mean characteristics from seed districts
 * @param {number} threshold - Similarity threshold (default: 0.15)
 * @returns {boolean} Whether to use RSP proxy
 */
export function shouldUseRSPProxy(
  constituency, 
  demographics, 
  seedCharacteristics, 
  threshold = 0.15
) {
  const demo = demographics[constituency.district];
  if (!demo) return false;
  
  // Check if RSP got 0% in 2022 (ghost seat)
  const constituencyData = constituency;
  const rsp2022 = constituencyData?.results2022?.RSP || 0;
  if (rsp2022 > 0.01) return false; // Not a ghost seat
  
  // Check urbanization similarity
  const urbanizationDiff = Math.abs(demo.urbanPopulation - seedCharacteristics.urbanization);
  
  // Check youth density similarity (15-29 age group)
  const youthDiff = Math.abs((demo.ageGroups?.['15-29'] || 0) - seedCharacteristics.youthDensity);
  
  // Check literacy similarity
  const literacyDiff = Math.abs(demo.literacyRate - seedCharacteristics.literacyRate);
  
  // Use proxy if within threshold AND district has significant urbanization
  const isSimilar = urbanizationDiff < threshold && youthDiff < threshold;
  const isUrbanEnough = demo.urbanPopulation > 0.5; // >50% urbanization
  
  return isSimilar && isUrbanEnough;
}

/**
 * Get RSP proxy baseline for a constituency
 * If the constituency is a "ghost seat" in a similar urban district,
 * return the mean RSP performance from seed seats
 * 
 * @param {Object} constituency - The constituency object
 * @param {Array} constituencies - All constituencies data
 * @param {Object} demographics - DISTRICT_DEMOGRAPHICS data
 * @returns {number} RSP baseline (0-1)
 */
export function getRSPProxyBaseline(
  constituency, 
  constituencies, 
  demographics
) {
  const seedCharacteristics = calculateRSPSeedCharacteristics();
  const rspSeedBaseline = calculateRSPSeedBaseline(constituencies);
  
  if (shouldUseRSPProxy(constituency, demographics, seedCharacteristics)) {
    // Return mean RSP performance from seed seats
    return rspSeedBaseline;
  }
  
  // Return actual 2022 result (may be 0 for ghost seats)
  return constituency?.results2022?.RSP || 0;
}

/**
 * Get all constituencies that should use RSP proxy
 * Useful for debugging and validation
 * 
 * @param {Array} constituencies - All constituencies data
 * @param {Object} demographics - DISTRICT_DEMOGRAPHICS data
 * @returns {Array} Array of constituency IDs that should use proxy
 */
export function getRSPProxyConstituencies(constituencies, demographics) {
  const seedCharacteristics = calculateRSPSeedCharacteristics();
  
  return constituencies
    .filter(c => shouldUseRSPProxy(c, demographics, seedCharacteristics))
    .map(c => c.id);
}

/**
 * Calculate RSP proxy adjustment for a constituency
 * Returns the difference between proxy baseline and actual 2022 result
 * 
 * @param {Object} constituency - The constituency object
 * @param {Array} constituencies - All constituencies data
 * @param {Object} demographics - DISTRICT_DEMOGRAPHICS data
 * @returns {Object} { proxyBaseline, actual2022, adjustment }
 */
export function calculateRSPProxyAdjustment(
  constituency, 
  constituencies, 
  demographics
) {
  const proxyBaseline = getRSPProxyBaseline(constituency, constituencies, demographics);
  const actual2022 = constituency?.results2022?.RSP || 0;
  const adjustment = proxyBaseline - actual2022;
  
  return {
    proxyBaseline,
    actual2022,
    adjustment,
    usesProxy: adjustment > 0.001, // Significant adjustment
  };
}

/**
 * Get RSP proxy statistics
 * Useful for debugging and understanding proxy impact
 * 
 * @param {Array} constituencies - All constituencies data
 * @param {Object} demographics - DISTRICT_DEMOGRAPHICS data
 * @returns {Object} Statistics
 */
export function getRSPProxyStatistics(constituencies, demographics) {
  const proxyConstituencies = getRSPProxyConstituencies(constituencies, demographics);
  const seedCharacteristics = calculateRSPSeedCharacteristics();
  const rspSeedBaseline = calculateRSPSeedBaseline(constituencies);
  
  // Calculate total adjustment
  let totalAdjustment = 0;
  let proxyCount = 0;
  
  proxyConstituencies.forEach(seatId => {
    const constituency = constituencies.find(c => c.id === seatId);
    if (constituency) {
      const adjustment = calculateRSPProxyAdjustment(constituency, constituencies, demographics);
      totalAdjustment += adjustment.adjustment;
      proxyCount++;
    }
  });
  
  return {
    seedCharacteristics,
    rspSeedBaseline,
    proxyConstituencyCount: proxyCount,
    totalAdjustment,
    averageAdjustment: proxyCount > 0 ? totalAdjustment / proxyCount : 0,
  };
}

/**
 * Check if a constituency is an RSP seed seat
 * @param {string} constituencyId - The constituency ID
 * @returns {boolean} Whether it's a seed seat
 */
export function isRSPSeedSeat(constituencyId) {
  return RSP_SEED_SEATS.includes(constituencyId);
}

/**
 * Get RSP seed seat info
 * @param {string} constituencyId - The constituency ID
 * @param {Array} constituencies - All constituencies data
 * @returns {Object|null} Seed seat info or null
 */
export function getRSPSeedSeatInfo(constituencyId, constituencies) {
  if (!isRSPSeedSeat(constituencyId)) return null;
  
  const constituency = constituencies.find(c => c.id === constituencyId);
  if (!constituency) return null;
  
  return {
    id: constituency.id,
    name: constituency.name,
    district: constituency.district,
    winner2022: constituency.winner2022,
    rspVoteShare: constituency.results2022?.RSP || 0,
    margin: constituency.margin,
  };
}

export default {
  RSP_SEED_SEATS,
  RSP_SEED_DISTRICTS,
  calculateRSPSeedCharacteristics,
  calculateRSPSeedBaseline,
  shouldUseRSPProxy,
  getRSPProxyBaseline,
  getRSPProxyConstituencies,
  calculateRSPProxyAdjustment,
  getRSPProxyStatistics,
  isRSPSeedSeat,
  getRSPSeedSeatInfo,
};
