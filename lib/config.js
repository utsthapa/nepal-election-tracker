/**
 * Application-wide configuration constants
 * Centralized configuration to avoid hardcoded values throughout the codebase
 */

// ============================================================================
// MAP CONFIGURATION
// ============================================================================

export const MAP_CONFIG = {
  // Map display dimensions
  width: 800,
  height: 600,

  // Default colors
  defaultFillColor: '#e5e7eb', // Light gray for unmatched constituencies
  defaultStrokeColor: '#9ca3af', // Medium gray for borders
  hoverOpacity: 0.7,
  fillOpacity: 0.8,
  strokeWidth: 1.5,

  // Leaflet map settings - static map configuration
  center: [28.3949, 84.124], // Nepal geographic center
  zoom: 7, // Zoomed out to fit frame
  minZoom: 7, // Lock zoom level (same as zoom)
  maxZoom: 7, // Lock zoom level (same as zoom)
  maxBounds: [
    [26.3, 80.0],
    [30.5, 88.5],
  ], // Nepal bounding box
  maxBoundsViscosity: 1.0,

  // Map colors
  backgroundColor: '#000000', // Nepal outline background
  borderColor: '#ffffff', // Constituency borders
  hoverBorderColor: '#ffffff', // Border on hover
  hoverBorderWeight: 3,
};

// ============================================================================
// ELECTION CONFIGURATION
// ============================================================================

export const ELECTION_CONFIG = {
  // Seat allocation
  PR_SEATS: 110, // Proportional representation seats
  FPTP_SEATS: 165, // First-past-the-post seats
  TOTAL_SEATS: 275, // Total seats in parliament

  // Vote thresholds
  PR_THRESHOLD: 0.03, // 3% threshold for PR seats

  // Vote share display
  PRECISION: 2, // Decimal places for percentages

  // Sainte-Laguë method divisors
  MODIFIED_DIVISOR_FIRST: 1.4, // First seat divisor (modified method)
  STANDARD_DIVISOR_FIRST: 1, // First seat divisor (standard method)
  DIVISOR_INCREMENT: 2, // Divisor increment (1, 3, 5, 7...)

  // Simulation parameters
  MAX_ITERATIONS: 5000, // Maximum Bayesian simulation iterations
  DEFAULT_ITERATIONS: 1000, // Default simulation iterations

  // Vote transfer
  ALLIANCE_HANDICAP: 10, // Default vote loss % in alliances (10%)
  MIN_VOTE_SHARE: 0, // Minimum vote share (0%)
  MAX_VOTE_SHARE: 100, // Maximum vote share (100%)
};

// ============================================================================
// DEMOGRAPHIC CONFIGURATION
// ============================================================================

export const DEMOGRAPHIC_CONFIG = {
  // Age thresholds for classification
  YOUTH_HIGH: 0.4, // 40%+ youth = high youth index
  YOUTH_LOW: 0.25, // <25% youth = low youth index
  URBAN_HIGH: 0.6, // 60%+ urban = highly urbanized
  URBAN_LOW: 0.3, // <30% urban = rural
  LITERACY_HIGH: 0.8, // 80%+ literacy = high literacy
  LITERACY_LOW: 0.6, // <60% literacy = low literacy

  // Voting age calculations
  VOTING_AGE_RATIO: 12 / 15, // 18-29 from 15-29 age group (80%)
  VOTING_AGE_MINIMUM: 18, // Minimum voting age

  // National averages (Census 2021)
  NATIONAL_AGE_AVERAGE: {
    '0-14': 0.275,
    '15-29': 0.268,
    '30-44': 0.195,
    '45-59': 0.152,
    '60+': 0.11,
  },

  // Comparison thresholds
  COMPARISON_THRESHOLD: 0.02, // 2% difference for above/below classification

  // Age group color palette
  AGE_GROUP_COLORS: {
    '0-14': '#60a5fa', // Blue - children
    '15-29': '#34d399', // Green - youth
    '30-44': '#fbbf24', // Yellow - young adults
    '45-59': '#f97316', // Orange - middle age
    '60+': '#ef4444', // Red - elderly
  },
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  // Animation timings (milliseconds)
  TOOLTIP_DELAY: 200,
  TRANSITION_DURATION: 300,
  MAP_RESIZE_DELAY: 100, // Delay before map resize/invalidation

  // Chart dimensions
  CHART_HEIGHT: 400,
  CHART_MIN_WIDTH: 300,
  CHART_RESPONSIVE_WIDTH: '100%',

  // Loading states
  LOADING_SPINNER_SIZE: 40,
  LOADING_TEXT_SIZE: 'sm',

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// ============================================================================
// API & FEATURE FLAGS
// ============================================================================

export const API_CONFIG = {
  // Feature flags
  ENABLE_PREDICTION_MARKETS: true, // Prediction markets feature ✓ ACTIVE
  ENABLE_HISTORICAL_2017: true, // 2017 election data (partial)
  ENABLE_HISTORICAL_2013: false, // 2013 election data (not available)
  ENABLE_HISTORICAL_2008: false, // 2008 election data (not available)

  // Data refresh intervals (milliseconds)
  RESULT_REFRESH_MS: 30000, // 30 seconds - poll result refresh
  FORECAST_REFRESH_MS: 60000, // 60 seconds - forecast refresh

  // API endpoints (if needed in future)
  // API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
};

// ============================================================================
// BAYESIAN MODEL CONFIGURATION
// ============================================================================

export const BAYESIAN_CONFIG = {
  // Model parameters
  MRP_YOUTH_LIFT: 0.02, // Youth demographic adjustment (2%)
  MRP_URBAN_PENALTY: -0.01, // Urban demographic adjustment (-1%)
  MRP_LITERACY_BONUS: 0.015, // Literacy demographic adjustment (1.5%)

  // Prior strength
  PRIOR_WEIGHT_STRONG: 0.7, // Strong prior (70% weight)
  PRIOR_WEIGHT_MEDIUM: 0.5, // Medium prior (50% weight)
  PRIOR_WEIGHT_WEAK: 0.3, // Weak prior (30% weight)

  // Uncertainty parameters
  BASE_UNCERTAINTY: 0.05, // Base polling uncertainty (5%)
  CONSTITUENCY_VARIANCE: 0.08, // Constituency-level variance (8%)

  // Expectation baseline (2022 results as starting point)
  EXPECTATION_BASELINE: {
    NC: 0.28,
    UML: 0.26,
    Maoist: 0.13,
    RSP: 0.12,
    RPP: 0.08,
    JSPN: 0.05,
    US: 0.03,
    JP: 0.02,
    LSP: 0.015,
    NUP: 0.01,
    others: 0.005,
  },
};

// ============================================================================
// DATA SOURCE CONFIGURATION
// ============================================================================

export const DATA_CONFIG = {
  // GeoJSON file paths
  CONSTITUENCIES_GEOJSON: '/maps/nepal-constituencies.geojson',
  DISTRICTS_GEOJSON: '/maps/nepal-districts.geojson',
  NEPAL_OUTLINE_GEOJSON: '/maps/nepal-outline.geojson',

  // Data confidence levels
  CONFIDENCE_HIGH: 'high',
  CONFIDENCE_MEDIUM: 'medium',
  CONFIDENCE_LOW: 'low',

  // Data sources
  DATA_SOURCE_CENSUS: 'Census 2021 (estimated)',
  DATA_SOURCE_ECN: 'Election Commission Nepal',
  DATA_SOURCE_MANUAL: 'Manual compilation',
};

// ============================================================================
// EXPORT ALL CONFIGS
// ============================================================================

const APP_CONFIG = {
  MAP_CONFIG,
  ELECTION_CONFIG,
  DEMOGRAPHIC_CONFIG,
  UI_CONFIG,
  API_CONFIG,
  BAYESIAN_CONFIG,
  DATA_CONFIG,
};

export default APP_CONFIG;
