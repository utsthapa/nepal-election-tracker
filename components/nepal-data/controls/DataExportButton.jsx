'use client';

import { Download } from 'lucide-react';

/**
 * Data Export Button Component
 * Exports data to CSV format
 *
 * @param {Array|Object} data - Data to export
 * @param {string} filename - Filename for the download (without .csv extension)
 * @param {string} label - Button label (default: 'Export CSV')
 * @param {string} variant - Button variant: 'primary', 'secondary', 'ghost'
 */
export default function DataExportButton({
  data,
  filename = 'nepal-data-export',
  label = 'Export CSV',
  variant = 'secondary',
}) {
  const handleExport = () => {
    if (!data) return;

    // Convert data to CSV
    const csvContent = convertToCSV(data);

    if (!csvContent) {
      console.error('Failed to convert data to CSV');
      return;
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${sanitizeFilename(filename)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buttonClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
        border transition-all
        ${buttonClasses[variant] || buttonClasses.secondary}
        ${!data ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label="Export data to CSV"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}

/**
 * Helper: Convert data to CSV string
 */
function convertToCSV(data) {
  if (!data) return '';

  // Handle array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];

        // Handle values that contain commas or quotes
        if (typeof value === 'string') {
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
        }

        return value ?? '';
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  // Handle object (convert to key-value pairs)
  if (typeof data === 'object') {
    const csvRows = ['Key,Value'];

    for (const [key, value] of Object.entries(data)) {
      const formattedValue = typeof value === 'object'
        ? JSON.stringify(value)
        : value;

      csvRows.push(`${key},${formattedValue}`);
    }

    return csvRows.join('\n');
  }

  return '';
}

/**
 * Helper: Sanitize filename
 */
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
