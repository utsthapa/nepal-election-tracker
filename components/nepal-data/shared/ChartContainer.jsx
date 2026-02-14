'use client';

import { useState } from 'react';
import { Download, Info } from 'lucide-react';

/**
 * Chart Container Component
 * Provides consistent wrapper for all charts with metadata, loading states, and export
 *
 * @param {string} title - Chart title
 * @param {string} subtitle - Optional chart subtitle
 * @param {string} source - Data source attribution
 * @param {string} lastUpdated - Last update date
 * @param {React.ReactNode} children - Chart content
 * @param {boolean} loading - Loading state
 * @param {Object} exportData - Optional data for export functionality
 * @param {string} height - Chart height (default: '400px')
 */
export default function ChartContainer({
  title,
  subtitle,
  source,
  lastUpdated,
  children,
  loading = false,
  exportData = null,
  height = '400px',
}) {
  const [showInfo, setShowInfo] = useState(false);

  const handleExport = () => {
    if (!exportData) return;

    // Convert data to CSV
    const csvContent = convertToCSV(exportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${sanitizeFilename(title)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Info button */}
          {(source || lastUpdated) && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Show chart information"
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          {/* Export button */}
          {exportData && (
            <button
              onClick={handleExport}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Export data"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (source || lastUpdated) && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm">
          {source && (
            <p className="text-gray-700">
              <span className="font-medium">Source:</span> {source}
            </p>
          )}
          {lastUpdated && (
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Last Updated:</span> {lastUpdated}
            </p>
          )}
        </div>
      )}

      {/* Chart content */}
      <div style={{ height }} className="relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/**
 * Helper: Convert data object to CSV string
 */
function convertToCSV(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that contain commas
      return typeof value === 'string' && value.includes(',')
        ? `"${value}"`
        : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Helper: Sanitize filename for download
 */
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
