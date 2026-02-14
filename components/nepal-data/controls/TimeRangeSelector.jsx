'use client';

import { getTimeRangePresets } from '@/utils/macroDataUtils';

/**
 * Time Range Selector Component
 * Provides preset time range filters (5Y, 10Y, All)
 *
 * @param {string} selected - Currently selected range ('5Y', '10Y', 'All')
 * @param {Function} onChange - Callback when selection changes: (rangeKey, rangeObj) => void
 * @param {number} currentYear - Current year for calculating ranges (default: 2024)
 */
export default function TimeRangeSelector({
  selected = 'All',
  onChange,
  currentYear = 2024,
}) {
  const presets = getTimeRangePresets(currentYear);

  const handleClick = (rangeKey) => {
    if (onChange) {
      onChange(rangeKey, presets[rangeKey]);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <span className="text-sm font-medium text-gray-700 px-2">Period:</span>

      {Object.keys(presets).map((rangeKey) => {
        const isSelected = selected === rangeKey;

        return (
          <button
            key={rangeKey}
            onClick={() => handleClick(rangeKey)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all
              ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-pressed={isSelected}
          >
            {presets[rangeKey].label}
          </button>
        );
      })}
    </div>
  );
}
