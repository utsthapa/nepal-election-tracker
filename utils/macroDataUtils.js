/**
 * Utility functions for Nepal macro data processing and formatting
 */

/**
 * Format currency values with appropriate units
 * @param {number} value - The value to format
 * @param {string} currency - Currency symbol (default: '$')
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = '$', decimals = 2) {
  if (value === null || value === undefined) return 'N/A';

  // Handle billions
  if (Math.abs(value) >= 1) {
    return `${currency}${value.toFixed(decimals)}B`;
  }

  // Handle millions
  if (Math.abs(value) >= 0.001) {
    return `${currency}${(value * 1000).toFixed(decimals)}M`;
  }

  return `${currency}${(value * 1000000).toFixed(decimals)}K`;
}

/**
 * Format percentage values
 * @param {number} value - The value to format (as decimal or percentage)
 * @param {number} decimals - Number of decimal places
 * @param {boolean} isDecimal - Whether value is already in decimal form (0.05) vs percentage (5)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1, isDecimal = false) {
  if (value === null || value === undefined) return 'N/A';

  const numericValue = isDecimal ? value * 100 : value;
  const sign = numericValue > 0 ? '+' : '';

  return `${sign}${numericValue.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M/B suffixes
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined) return 'N/A';

  if (Math.abs(value) >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }

  return value.toFixed(decimals);
}

/**
 * Calculate year-over-year growth rate
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {number} Growth rate as percentage
 */
export function calculateGrowthRate(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate compound annual growth rate (CAGR)
 * @param {number} endValue - Ending value
 * @param {number} startValue - Starting value
 * @param {number} years - Number of years
 * @returns {number} CAGR as percentage
 */
export function calculateCAGR(endValue, startValue, years) {
  if (!startValue || startValue === 0 || !years) return null;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Filter time series data by year range
 * @param {Array} data - Array of data objects with year property
 * @param {number} startYear - Start year (inclusive)
 * @param {number} endYear - End year (inclusive)
 * @returns {Array} Filtered data array
 */
export function filterByTimeRange(data, startYear, endYear) {
  if (!data || !Array.isArray(data)) return [];
  return data.filter(item => item.year >= startYear && item.year <= endYear);
}

/**
 * Get time range presets
 * @param {number} currentYear - Current year
 * @returns {Object} Object with preset ranges
 */
export function getTimeRangePresets(currentYear = 2024) {
  return {
    '5Y': { start: currentYear - 5, end: currentYear, label: 'Last 5 Years' },
    '10Y': { start: currentYear - 10, end: currentYear, label: 'Last 10 Years' },
    'All': { start: 2010, end: currentYear, label: 'All Years' },
  };
}

/**
 * Transform time series data for Recharts
 * @param {Array} years - Array of years
 * @param {Object} metrics - Object with metric arrays
 * @returns {Array} Array of objects for Recharts
 */
export function transformTimeSeriesData(years, metrics) {
  if (!years || !metrics) return [];

  return years.map((year, index) => {
    const dataPoint = { year };

    Object.keys(metrics).forEach(key => {
      if (metrics[key] && metrics[key][index] !== undefined) {
        dataPoint[key] = metrics[key][index];
      }
    });

    return dataPoint;
  });
}

/**
 * Aggregate provincial data
 * @param {Object} provincialData - Object with provincial data
 * @param {string} metric - Metric to aggregate
 * @returns {number} Sum of metric across all provinces
 */
export function aggregateProvincialData(provincialData, metric) {
  if (!provincialData) return 0;

  return Object.values(provincialData).reduce((sum, province) => {
    return sum + (province[metric] || 0);
  }, 0);
}

/**
 * Calculate provincial share
 * @param {Object} provincialData - Object with provincial data
 * @param {number} provinceId - Province ID
 * @param {string} metric - Metric to calculate share for
 * @returns {number} Province's share as percentage
 */
export function calculateProvincialShare(provincialData, provinceId, metric) {
  if (!provincialData || !provincialData[provinceId]) return 0;

  const total = aggregateProvincialData(provincialData, metric);
  const provinceValue = provincialData[provinceId][metric] || 0;

  return total > 0 ? (provinceValue / total) * 100 : 0;
}

/**
 * Get color for trend (positive/negative)
 * @param {number} value - Value to check
 * @param {boolean} reverseColors - Whether to reverse color scheme (for metrics where lower is better)
 * @returns {string} Tailwind color class
 */
export function getTrendColor(value, reverseColors = false) {
  if (value === null || value === undefined || value === 0) {
    return 'text-gray-500';
  }

  const isPositive = value > 0;

  if (reverseColors) {
    return isPositive ? 'text-red-500' : 'text-green-500';
  }

  return isPositive ? 'text-green-500' : 'text-red-500';
}

/**
 * Get trend icon
 * @param {number} value - Value to check
 * @returns {string} Icon name or symbol
 */
export function getTrendIcon(value) {
  if (value === null || value === undefined || value === 0) return '→';
  return value > 0 ? '↑' : '↓';
}

/**
 * Calculate moving average
 * @param {Array} data - Array of numeric values
 * @param {number} window - Window size for moving average
 * @returns {Array} Array of moving average values
 */
export function calculateMovingAverage(data, window = 3) {
  if (!data || data.length < window) return data;

  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(null);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }

  return result;
}

/**
 * Generate mock time series data (for development)
 * @param {number} startYear - Start year
 * @param {number} endYear - End year
 * @param {number} baseValue - Base value
 * @param {number} volatility - Volatility factor (0-1)
 * @returns {Array} Array of values
 */
export function generateMockTimeSeries(startYear, endYear, baseValue, volatility = 0.1) {
  const years = endYear - startYear + 1;
  const data = [];

  for (let i = 0; i < years; i++) {
    const trend = baseValue * (1 + (i * 0.03)); // 3% annual growth trend
    const noise = (Math.random() - 0.5) * 2 * volatility * baseValue;
    data.push(Math.max(0, trend + noise));
  }

  return data;
}

/**
 * Validate data completeness
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and missing fields
 */
export function validateDataCompleteness(data, requiredFields) {
  const missing = [];

  requiredFields.forEach(field => {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      missing.push(field);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return 'N/A';

  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
