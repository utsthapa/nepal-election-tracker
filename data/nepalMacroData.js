/**
 * Nepal Macro Economic Data (2010-2024)
 *
 * Data Sources:
 * - World Bank Open Data: https://data.worldbank.org/country/nepal
 * - FRED (Federal Reserve Economic Data): https://fred.stlouisfed.org
 * - Nepal Rastra Bank: https://www.nrb.org.np/
 * - IMF World Economic Outlook
 * - National Statistics Office Nepal: https://cbs.gov.np/
 *
 * Last Updated: 2024-01-15
 *
 * NOTE: This file contains placeholder/sample data structure.
 * Real data to be populated from official sources.
 */

// Years covered in the dataset
export const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

/**
 * Macroeconomic Indicators
 * All growth rates in %, GDP values in billion USD, per capita in current USD
 */
export const MACRO_INDICATORS = {
  gdp: {
    // GDP growth rate (annual %)
    growth: [4.8, 3.4, 4.9, 4.1, 6.0, 3.3, 0.6, 7.9, 6.7, 7.0, -2.1, 4.8, 5.6, 1.9, 3.8],

    // GDP per capita (current USD)
    perCapita: [693, 729, 739, 752, 753, 736, 734, 854, 1034, 1105, 1155, 1209, 1337, 1400, 1470],

    // GDP nominal (billion USD)
    nominal: [19.3, 20.5, 21.2, 22.0, 22.6, 22.5, 22.9, 26.8, 32.8, 35.8, 37.8, 40.3, 45.2, 47.8, 50.5],
  },

  inflation: {
    // Consumer price index (annual %, average)
    annual: [9.6, 9.6, 8.3, 9.9, 9.0, 7.2, 9.9, 4.5, 4.2, 4.6, 6.2, 4.2, 7.7, 7.1, 5.2],

    // Food inflation (annual %)
    food: [10.8, 10.5, 9.2, 11.1, 10.3, 8.5, 11.2, 5.2, 4.8, 5.1, 7.5, 5.1, 9.2, 8.5, 6.1],

    // Core inflation (annual %, excluding food and energy)
    core: [7.8, 8.1, 6.9, 8.2, 7.2, 5.5, 8.1, 3.5, 3.2, 3.8, 4.5, 2.9, 5.8, 5.2, 4.0],
  },

  employment: {
    // Unemployment rate (% of total labor force)
    unemployment: [2.7, 2.6, 2.5, 2.4, 2.7, 3.0, 3.1, 11.4, 11.2, 11.0, 13.7, 12.8, 11.5, 10.9, 10.2],

    // Labor force participation rate (% of total population ages 15+)
    laborForceParticipation: [83.5, 83.3, 83.1, 82.9, 82.7, 82.5, 82.3, 61.5, 61.3, 61.1, 60.8, 61.2, 61.5, 61.8, 62.1],
  },

  fiscal: {
    // Fiscal balance (% of GDP)
    balance: [-0.4, -1.2, -1.5, -2.3, -2.8, -1.4, -6.3, -4.7, -5.2, -5.1, -5.2, -4.8, -4.2, -3.8, -3.5],

    // Public debt (% of GDP)
    publicDebt: [36.5, 35.8, 34.2, 32.9, 32.1, 30.5, 31.8, 33.2, 35.8, 38.2, 42.5, 44.2, 45.8, 46.5, 47.2],
  },

  monetary: {
    // Foreign exchange reserves (billion USD)
    fxReserves: [2.8, 3.6, 4.3, 5.6, 6.0, 7.0, 8.1, 9.5, 9.3, 9.6, 11.9, 12.3, 9.5, 10.8, 12.5],

    // FX reserves (months of imports)
    fxReservesMonths: [5.2, 6.1, 6.8, 8.2, 8.5, 9.2, 10.1, 11.2, 10.8, 10.5, 13.8, 14.2, 10.5, 11.8, 13.2],
  },
};

/**
 * External Sector Indicators
 * All trade values in billion USD, remittances as % of GDP
 */
export const EXTERNAL_SECTOR = {
  currentAccount: {
    // Current account balance (billion USD)
    balance: [0.87, 0.25, 0.60, 0.90, 1.25, 1.34, 1.34, -0.03, -2.09, -1.81, -1.08, -0.68, -0.15, 0.52, 0.85],

    // Current account balance (% of GDP)
    balancePercent: [4.5, 1.2, 2.8, 4.1, 5.5, 6.0, 5.9, -0.1, -6.4, -5.1, -2.9, -1.7, -0.3, 1.1, 1.7],
  },

  trade: {
    // Trade balance (billion USD)
    balance: [-3.8, -4.2, -4.5, -5.1, -6.2, -7.1, -8.8, -10.5, -12.8, -13.2, -10.8, -11.5, -13.8, -14.2, -13.5],

    // Exports (billion USD)
    exports: [0.85, 0.93, 0.95, 0.96, 0.88, 0.81, 0.74, 0.75, 0.88, 0.90, 0.85, 1.05, 1.38, 1.52, 1.68],

    // Imports (billion USD)
    imports: [4.65, 5.13, 5.45, 6.06, 7.08, 7.91, 9.54, 11.25, 13.68, 14.10, 11.65, 12.55, 15.18, 15.72, 15.18],
  },

  remittances: {
    // Remittances received (billion USD)
    received: [3.5, 4.2, 4.9, 5.6, 5.9, 6.7, 6.6, 7.0, 7.8, 8.1, 8.1, 8.9, 8.3, 9.2, 9.8],

    // Remittances (% of GDP)
    percentOfGDP: [18.1, 20.5, 23.1, 25.5, 26.1, 29.8, 28.8, 26.1, 23.8, 22.6, 21.4, 22.1, 18.4, 19.2, 19.4],

    // Number of Nepali workers abroad (millions, estimates)
    workersAbroad: [2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 3.8, 3.9, 4.0, 4.1, 4.2],
  },

  foreignInvestment: {
    // Foreign Direct Investment, net inflows (billion USD)
    fdi: [0.09, 0.09, 0.09, 0.08, 0.03, 0.05, 0.11, 0.20, 0.16, 0.16, 0.05, 0.12, 0.18, 0.25, 0.32],

    // FDI (% of GDP)
    fdiPercent: [0.5, 0.4, 0.4, 0.4, 0.1, 0.2, 0.5, 0.7, 0.5, 0.4, 0.1, 0.3, 0.4, 0.5, 0.6],
  },
};

/**
 * Demographics - National Level
 */
export const DEMOGRAPHICS_NATIONAL = {
  population: {
    // Total population (millions)
    total: [27.9, 28.2, 28.5, 28.8, 29.1, 29.4, 29.7, 30.0, 30.3, 30.5, 30.8, 31.1, 31.4, 31.7, 32.0],

    // Population growth rate (annual %)
    growth: [1.35, 1.32, 1.29, 1.26, 1.24, 1.21, 1.19, 1.17, 1.15, 1.13, 1.11, 1.09, 1.07, 1.05, 1.03],

    // Urban population (% of total)
    urban: [17.1, 17.6, 18.2, 18.7, 19.2, 19.7, 20.2, 20.7, 21.2, 21.7, 22.2, 22.7, 23.2, 23.7, 24.2],
  },

  vital: {
    // Life expectancy at birth (years)
    lifeExpectancy: [68.8, 69.1, 69.4, 69.7, 70.0, 70.3, 70.6, 70.9, 71.2, 71.5, 70.5, 71.0, 71.5, 71.8, 72.1],

    // Fertility rate (births per woman)
    fertility: [2.6, 2.5, 2.5, 2.4, 2.4, 2.3, 2.3, 2.2, 2.2, 2.1, 2.1, 2.0, 2.0, 1.9, 1.9],

    // Infant mortality rate (per 1,000 live births)
    infantMortality: [39.2, 37.8, 36.5, 35.3, 34.1, 33.0, 31.9, 30.9, 29.9, 29.0, 28.1, 27.2, 26.4, 25.6, 24.9],
  },

  education: {
    // Literacy rate (% of population ages 15+)
    literacy: [63.9, 65.1, 66.2, 67.4, 68.5, 69.7, 70.8, 71.9, 73.0, 74.1, 75.1, 76.2, 77.2, 78.2, 79.1],

    // Primary school enrollment (% gross)
    primaryEnrollment: [127.5, 128.2, 128.9, 129.5, 130.1, 130.7, 131.2, 131.7, 132.1, 132.5, 131.8, 132.2, 132.6, 133.0, 133.4],
  },
};

/**
 * Poverty & Inequality Indicators
 */
export const POVERTY_INEQUALITY = {
  poverty: {
    // Poverty headcount ratio at $2.15/day (2017 PPP, % of population)
    headcount215: [15.0, 14.2, 13.5, 12.8, 12.1, 11.5, 10.9, 10.3, 9.8, 9.3, 10.1, 9.6, 9.1, 8.7, 8.3],

    // Poverty headcount at national poverty line (% of population)
    headcountNational: [25.2, 24.1, 23.1, 22.1, 21.2, 20.3, 19.4, 18.6, 17.8, 17.0, 18.2, 17.5, 16.8, 16.2, 15.6],

    // Multidimensional poverty index (0-1, higher = more poverty)
    multidimensional: [0.217, 0.207, 0.197, 0.187, 0.177, 0.167, 0.157, 0.147, 0.137, 0.127, 0.135, 0.128, 0.121, 0.115, 0.109],
  },

  inequality: {
    // Gini index (0-100, higher = more inequality)
    gini: [32.8, 32.5, 32.2, 31.9, 31.6, 31.3, 31.0, 30.7, 30.4, 30.1, 30.5, 30.3, 30.1, 29.9, 29.7],

    // Income share held by lowest 20% (%)
    lowestQuintile: [8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.0, 9.1, 9.2, 9.3, 9.4],

    // Income share held by highest 20% (%)
    highestQuintile: [40.8, 40.5, 40.2, 39.9, 39.6, 39.3, 39.0, 38.7, 38.4, 38.1, 38.3, 38.1, 37.9, 37.7, 37.5],
  },
};

/**
 * Tourism Indicators
 */
export const TOURISM = {
  annual: {
    // Tourist arrivals (thousands)
    arrivals: [602.9, 736.2, 803.1, 797.8, 790.0, 538.9, 753.0, 940.2, 1173.1, 1197.2, 230.1, 150.0, 711.2, 1025.5, 1180.0],

    // Year-over-year growth (%)
    growth: [null, 22.1, 9.1, -0.7, -1.0, -31.8, 39.7, 24.9, 24.8, 2.1, -80.8, -34.8, 374.1, 44.2, 15.1],

    // Tourism receipts (million USD, estimates)
    receipts: [379, 461, 503, 499, 495, 337, 471, 588, 734, 749, 144, 94, 445, 642, 738],
  },

  // Monthly arrivals for recent years (2022-2024)
  monthly2024: [65.2, 72.8, 98.5, 105.3, 92.1, 78.3, 85.7, 95.4, 110.8, 125.3, 132.1, 118.5],
  monthly2023: [58.5, 64.2, 85.3, 92.1, 78.5, 65.8, 72.3, 82.1, 95.2, 108.5, 115.8, 107.2],
  monthly2022: [35.2, 41.5, 52.8, 62.3, 58.7, 51.2, 58.5, 68.2, 78.5, 87.3, 92.5, 84.5],

  // Top source countries (2024, % of total arrivals)
  sourceCountries: {
    India: 22.5,
    China: 15.8,
    USA: 8.2,
    UK: 6.5,
    SriLanka: 5.3,
    Thailand: 4.8,
    Australia: 4.2,
    Germany: 3.8,
    France: 3.5,
    Japan: 3.2,
    Others: 22.2,
  },
};

/**
 * Energy & Environment Indicators
 */
export const ENERGY_ENVIRONMENT = {
  emissions: {
    // CO2 emissions (metric tons per capita)
    co2PerCapita: [0.15, 0.16, 0.17, 0.18, 0.19, 0.20, 0.21, 0.22, 0.24, 0.25, 0.23, 0.24, 0.26, 0.27, 0.28],

    // Total CO2 emissions (million metric tons)
    co2Total: [4.2, 4.5, 4.8, 5.2, 5.5, 5.9, 6.2, 6.6, 7.3, 7.6, 7.1, 7.5, 8.2, 8.6, 9.0],
  },

  electricity: {
    // Access to electricity (% of population)
    access: [76.3, 78.5, 80.6, 82.7, 84.7, 86.6, 88.5, 90.3, 92.0, 93.6, 95.1, 96.5, 97.8, 98.5, 99.1],

    // Electricity production (billion kWh)
    production: [3.3, 3.5, 3.7, 3.9, 4.1, 4.3, 4.5, 4.7, 5.0, 5.3, 5.5, 5.8, 6.2, 6.5, 6.9],

    // Renewable electricity output (% of total)
    renewablePercent: [99.5, 99.5, 99.6, 99.6, 99.6, 99.7, 99.7, 99.7, 99.8, 99.8, 99.8, 99.9, 99.9, 99.9, 99.9],
  },

  energy: {
    // Energy use (kg of oil equivalent per capita)
    usePerCapita: [285, 295, 305, 315, 325, 335, 345, 355, 370, 385, 375, 385, 395, 405, 415],

    // Renewable energy consumption (% of total)
    renewablePercent: [87.5, 87.2, 86.9, 86.6, 86.3, 86.0, 85.7, 85.4, 85.1, 84.8, 85.2, 85.5, 85.8, 86.1, 86.4],
  },
};

/**
 * Data metadata
 */
export const DATA_METADATA = {
  lastUpdated: '2024-01-15',
  sources: [
    'World Bank Open Data',
    'FRED (Federal Reserve Economic Data)',
    'Nepal Rastra Bank',
    'IMF World Economic Outlook',
    'National Statistics Office Nepal',
    'Nepal Tourism Board',
    'International Energy Agency'
  ],
  coverage: {
    start: 2010,
    end: 2024,
    years: 15
  },
  notes: [
    'This dataset contains placeholder/sample data for development purposes',
    'Real data should be sourced from official databases',
    'Some values are estimated where official data is not available',
    'GDP values in current USD unless otherwise specified',
    'All growth rates are annual percentage changes'
  ]
};

export default {
  YEARS,
  MACRO_INDICATORS,
  EXTERNAL_SECTOR,
  DEMOGRAPHICS_NATIONAL,
  POVERTY_INEQUALITY,
  TOURISM,
  ENERGY_ENVIRONMENT,
  DATA_METADATA,
};
