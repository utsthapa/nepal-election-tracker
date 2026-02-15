/**
 * International Comparison Data
 * Nepal vs South Asian neighbors and global income groups
 *
 * Data Sources:
 * - World Bank World Development Indicators
 * - IMF World Economic Outlook
 *
 * Last Updated: 2024-01-15
 */

/**
 * Regional Comparison - South Asia (2024 data)
 */
export const REGIONAL_COMPARISON = {
  Nepal: {
    gdpPerCapita: 1470,
    gdpGrowth: 3.8,
    inflation: 5.2,
    lifeExpectancy: 72.1,
    literacy: 79.1,
    povertyRate: 8.3,
    gini: 29.7,
    co2PerCapita: 0.28,
  },
  India: {
    gdpPerCapita: 2612,
    gdpGrowth: 6.8,
    inflation: 5.4,
    lifeExpectancy: 70.8,
    literacy: 77.7,
    povertyRate: 10.5,
    gini: 35.7,
    co2PerCapita: 1.89,
  },
  Bangladesh: {
    gdpPerCapita: 2688,
    gdpGrowth: 5.8,
    inflation: 6.8,
    lifeExpectancy: 73.2,
    literacy: 75.6,
    povertyRate: 11.2,
    gini: 32.4,
    co2PerCapita: 0.65,
  },
  Pakistan: {
    gdpPerCapita: 1658,
    gdpGrowth: 2.5,
    inflation: 29.2,
    lifeExpectancy: 67.1,
    literacy: 62.3,
    povertyRate: 21.9,
    gini: 33.5,
    co2PerCapita: 0.93,
  },
  SriLanka: {
    gdpPerCapita: 3474,
    gdpGrowth: 1.9,
    inflation: 9.8,
    lifeExpectancy: 77.5,
    literacy: 92.3,
    povertyRate: 3.2,
    gini: 39.3,
    co2PerCapita: 0.72,
  },
  Bhutan: {
    gdpPerCapita: 3625,
    gdpGrowth: 4.2,
    inflation: 4.8,
    lifeExpectancy: 72.8,
    literacy: 71.4,
    povertyRate: 5.8,
    gini: 37.4,
    co2PerCapita: 1.45,
  },
  Afghanistan: {
    gdpPerCapita: 368,
    gdpGrowth: -6.2,
    inflation: 2.8,
    lifeExpectancy: 64.5,
    literacy: 43.0,
    povertyRate: 47.3,
    gini: 29.4,
    co2PerCapita: 0.29,
  },
};

/**
 * Income Group Comparison (2024 data)
 * Nepal vs World Bank income classifications
 */
export const INCOME_GROUP_COMPARISON = {
  Nepal: {
    gdpPerCapita: 1470,
    gdpGrowth: 3.8,
    lifeExpectancy: 72.1,
    literacy: 79.1,
    infantMortality: 24.9,
  },
  'Low Income': {
    gdpPerCapita: 800,
    gdpGrowth: 3.5,
    lifeExpectancy: 64.2,
    literacy: 65.3,
    infantMortality: 42.5,
  },
  'Lower-Middle Income': {
    gdpPerCapita: 2350,
    gdpGrowth: 5.2,
    lifeExpectancy: 69.5,
    literacy: 74.2,
    infantMortality: 32.8,
  },
  'Upper-Middle Income': {
    gdpPerCapita: 8950,
    gdpGrowth: 4.8,
    lifeExpectancy: 75.8,
    literacy: 94.5,
    infantMortality: 12.5,
  },
  'High Income': {
    gdpPerCapita: 48200,
    gdpGrowth: 2.1,
    lifeExpectancy: 80.3,
    literacy: 99.2,
    infantMortality: 4.2,
  },
};

/**
 * Metadata
 */
export const INTERNATIONAL_METADATA = {
  lastUpdated: '2024-01-15',
  sources: [
    'World Bank World Development Indicators',
    'IMF World Economic Outlook',
    'UNESCO Institute for Statistics'
  ],
  notes: [
    'Data represents latest available estimates (2023-2024)',
    'Income groups follow World Bank classifications',
    'Some values are interpolated or estimated',
    'PPP = Purchasing Power Parity',
  ]
};

export default {
  REGIONAL_COMPARISON,
  INCOME_GROUP_COMPARISON,
  INTERNATIONAL_METADATA,
};
