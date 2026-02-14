/**
 * Provincial-level Macro Data for Nepal
 *
 * Data Sources:
 * - National Statistics Office Nepal
 * - Provincial government reports
 * - World Bank Nepal Development Update
 *
 * Last Updated: 2024-01-15
 *
 * NOTE: This file contains placeholder/sample data structure.
 * Real provincial data to be populated from official sources.
 */

/**
 * Provincial Data
 * Key: Province number (1-7)
 */
export const PROVINCIAL_DATA = {
  1: {
    name: 'Koshi',
    nameNepali: 'कोशी',
    capital: 'Biratnagar',

    // Economic indicators
    gdpShare: 0.148, // Share of national GDP (%)
    gdpPerCapita: 1520, // USD, estimated
    gdpGrowth: 4.2, // Annual % growth (2023)

    // Demographics
    population: 4.8, // millions (2024)
    populationShare: 0.150, // % of national population
    urbanization: 0.182, // % urban population
    literacy: 0.762, // % literacy rate

    // Development indicators
    povertyRate: 0.178, // % below national poverty line
    electrificationRate: 0.921, // % with electricity access
    internetPenetration: 0.485, // % with internet access

    // Infrastructure
    roadDensity: 0.28, // km per sq km
    hospitals: 15,
    universities: 8,
  },

  2: {
    name: 'Madhesh',
    nameNepali: 'मधेश',
    capital: 'Janakpur',

    gdpShare: 0.135,
    gdpPerCapita: 1320,
    gdpGrowth: 3.8,

    population: 6.1,
    populationShare: 0.191,
    urbanization: 0.145,
    literacy: 0.685,

    povertyRate: 0.242,
    electrificationRate: 0.875,
    internetPenetration: 0.425,

    roadDensity: 0.35,
    hospitals: 12,
    universities: 6,
  },

  3: {
    name: 'Bagmati',
    nameNepali: 'बागमती',
    capital: 'Hetauda',

    gdpShare: 0.298, // Largest share (includes Kathmandu)
    gdpPerCapita: 2150,
    gdpGrowth: 5.2,

    population: 6.4,
    populationShare: 0.200,
    urbanization: 0.428, // Highest urbanization
    literacy: 0.852, // Highest literacy

    povertyRate: 0.142, // Lowest poverty
    electrificationRate: 0.985, // Highest electrification
    internetPenetration: 0.625, // Highest internet

    roadDensity: 0.52, // Highest road density
    hospitals: 35,
    universities: 22,
  },

  4: {
    name: 'Gandaki',
    nameNepali: 'गण्डकी',
    capital: 'Pokhara',

    gdpShare: 0.112,
    gdpPerCapita: 1680,
    gdpGrowth: 4.5,

    population: 2.5,
    populationShare: 0.078,
    urbanization: 0.285,
    literacy: 0.798,

    povertyRate: 0.165,
    electrificationRate: 0.938,
    internetPenetration: 0.512,

    roadDensity: 0.32,
    hospitals: 10,
    universities: 7,
  },

  5: {
    name: 'Lumbini',
    nameNepali: 'लुम्बिनी',
    capital: 'Deukhuri',

    gdpShare: 0.145,
    gdpPerCapita: 1280,
    gdpGrowth: 4.0,

    population: 5.1,
    populationShare: 0.159,
    urbanization: 0.168,
    literacy: 0.728,

    povertyRate: 0.215,
    electrificationRate: 0.892,
    internetPenetration: 0.445,

    roadDensity: 0.29,
    hospitals: 13,
    universities: 5,
  },

  6: {
    name: 'Karnali',
    nameNepali: 'कर्णाली',
    capital: 'Birendranagar',

    gdpShare: 0.058, // Smallest economy
    gdpPerCapita: 980, // Lowest per capita
    gdpGrowth: 3.2,

    population: 1.7,
    populationShare: 0.053,
    urbanization: 0.095, // Lowest urbanization
    literacy: 0.658, // Lowest literacy

    povertyRate: 0.312, // Highest poverty
    electrificationRate: 0.782, // Lowest electrification
    internetPenetration: 0.285, // Lowest internet

    roadDensity: 0.12, // Lowest road density
    hospitals: 5,
    universities: 2,
  },

  7: {
    name: 'Sudurpashchim',
    nameNepali: 'सुदूरपश्चिम',
    capital: 'Godawari',

    gdpShare: 0.104,
    gdpPerCapita: 1180,
    gdpGrowth: 3.5,

    population: 2.7,
    populationShare: 0.084,
    urbanization: 0.125,
    literacy: 0.715,

    povertyRate: 0.235,
    electrificationRate: 0.858,
    internetPenetration: 0.392,

    roadDensity: 0.22,
    hospitals: 8,
    universities: 4,
  },
};

/**
 * Provincial GDP breakdown by sector (2023, % of provincial GDP)
 */
export const PROVINCIAL_GDP_BY_SECTOR = {
  1: { agriculture: 22.5, industry: 18.8, services: 58.7 },
  2: { agriculture: 35.2, industry: 15.3, services: 49.5 },
  3: { agriculture: 12.8, industry: 22.5, services: 64.7 },
  4: { agriculture: 24.5, industry: 17.2, services: 58.3 },
  5: { agriculture: 32.8, industry: 16.5, services: 50.7 },
  6: { agriculture: 42.5, industry: 10.2, services: 47.3 },
  7: { agriculture: 38.2, industry: 12.5, services: 49.3 },
};

/**
 * Provincial Human Development Index (HDI) estimates
 * Scale: 0-1, higher = better human development
 */
export const PROVINCIAL_HDI = {
  1: 0.598,
  2: 0.542,
  3: 0.685, // Highest (includes Kathmandu valley)
  4: 0.625,
  5: 0.565,
  6: 0.485, // Lowest
  7: 0.528,
};

/**
 * Provincial time series data (2020-2024)
 * For trend analysis
 */
export const PROVINCIAL_TIME_SERIES = {
  years: [2020, 2021, 2022, 2023, 2024],

  gdpGrowth: {
    1: [2.8, 3.5, 4.8, 4.5, 4.2],
    2: [2.2, 3.1, 4.2, 4.0, 3.8],
    3: [3.8, 4.5, 5.8, 5.5, 5.2],
    4: [3.2, 3.8, 5.0, 4.8, 4.5],
    5: [2.5, 3.3, 4.5, 4.2, 4.0],
    6: [1.8, 2.5, 3.5, 3.5, 3.2],
    7: [2.0, 2.8, 3.8, 3.8, 3.5],
  },

  povertyRate: {
    1: [0.195, 0.188, 0.182, 0.180, 0.178],
    2: [0.268, 0.258, 0.248, 0.245, 0.242],
    3: [0.158, 0.152, 0.146, 0.144, 0.142],
    4: [0.182, 0.175, 0.168, 0.167, 0.165],
    5: [0.238, 0.228, 0.218, 0.216, 0.215],
    6: [0.345, 0.332, 0.318, 0.315, 0.312],
    7: [0.258, 0.248, 0.238, 0.236, 0.235],
  },

  electrificationRate: {
    1: [0.885, 0.898, 0.910, 0.916, 0.921],
    2: [0.825, 0.842, 0.858, 0.867, 0.875],
    3: [0.965, 0.972, 0.978, 0.982, 0.985],
    4: [0.912, 0.922, 0.930, 0.934, 0.938],
    5: [0.858, 0.872, 0.882, 0.887, 0.892],
    6: [0.715, 0.738, 0.758, 0.770, 0.782],
    7: [0.812, 0.828, 0.842, 0.850, 0.858],
  },
};

/**
 * Provincial rankings (2024)
 * 1 = best, 7 = worst
 */
export const PROVINCIAL_RANKINGS = {
  gdpPerCapita: {
    3: 1, // Bagmati (highest)
    4: 2, // Gandaki
    1: 3, // Koshi
    2: 4, // Madhesh
    5: 5, // Lumbini
    7: 6, // Sudurpashchim
    6: 7, // Karnali (lowest)
  },

  literacy: {
    3: 1, // Bagmati
    4: 2, // Gandaki
    1: 3, // Koshi
    5: 4, // Lumbini
    7: 5, // Sudurpashchim
    2: 6, // Madhesh
    6: 7, // Karnali
  },

  povertyRate: {
    3: 1, // Bagmati (lowest poverty = best)
    4: 2, // Gandaki
    1: 3, // Koshi
    5: 4, // Lumbini
    7: 5, // Sudurpashchim
    2: 6, // Madhesh
    6: 7, // Karnali (highest poverty = worst)
  },

  urbanization: {
    3: 1, // Bagmati
    4: 2, // Gandaki
    1: 3, // Koshi
    5: 4, // Lumbini
    2: 5, // Madhesh
    7: 6, // Sudurpashchim
    6: 7, // Karnali
  },
};

/**
 * Data metadata
 */
export const PROVINCIAL_METADATA = {
  lastUpdated: '2024-01-15',
  sources: [
    'National Statistics Office Nepal',
    'Provincial Government Annual Reports',
    'World Bank Nepal Development Update',
    'UNDP Nepal Human Development Reports'
  ],
  notes: [
    'This dataset contains placeholder/sample data for development purposes',
    'Real provincial data should be sourced from official government statistics',
    'Some values are estimates where official provincial data is not available',
    'Province 3 (Bagmati) includes Kathmandu valley, explaining its higher metrics',
    'Province 6 (Karnali) is the least developed, with challenging geography'
  ]
};

export default {
  PROVINCIAL_DATA,
  PROVINCIAL_GDP_BY_SECTOR,
  PROVINCIAL_HDI,
  PROVINCIAL_TIME_SERIES,
  PROVINCIAL_RANKINGS,
  PROVINCIAL_METADATA,
};
