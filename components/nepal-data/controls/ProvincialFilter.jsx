'use client';

import { Check } from 'lucide-react';

/**
 * Provincial Filter Component
 * Multi-select filter for provinces
 *
 * @param {Object} provinces - Object with province data: { 1: { name: 'Koshi', ... }, ... }
 * @param {Array} selected - Array of selected province IDs
 * @param {Function} onChange - Callback when selection changes: (selectedIds) => void
 * @param {boolean} showSelectAll - Whether to show "Select All" option
 */
export default function ProvincialFilter({
  provinces = {},
  selected = [],
  onChange,
  showSelectAll = true,
}) {
  const provinceIds = Object.keys(provinces).map(Number);
  const allSelected = selected.length === provinceIds.length;

  const handleToggle = (provinceId) => {
    if (!onChange) {return;}

    const newSelected = selected.includes(provinceId)
      ? selected.filter(id => id !== provinceId)
      : [...selected, provinceId];

    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (!onChange) {return;}

    if (allSelected) {
      onChange([]);
    } else {
      onChange(provinceIds);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-gray-700">Filter by Province:</span>

      <div className="flex flex-wrap gap-2">
        {/* Select All button */}
        {showSelectAll && (
          <button
            onClick={handleSelectAll}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-all
              border-2 flex items-center gap-1.5
              ${
                allSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }
            `}
          >
            {allSelected && <Check className="w-4 h-4" />}
            All Provinces
          </button>
        )}

        {/* Individual province buttons */}
        {provinceIds.map((provinceId) => {
          const province = provinces[provinceId];
          const isSelected = selected.includes(provinceId);

          return (
            <button
              key={provinceId}
              onClick={() => handleToggle(provinceId)}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-all
                border-2 flex items-center gap-1.5
                ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }
              `}
              title={province.nameNepali}
            >
              {isSelected && <Check className="w-4 h-4" />}
              {province.name}
            </button>
          );
        })}
      </div>

      {/* Selection summary */}
      {selected.length > 0 && selected.length < provinceIds.length && (
        <p className="text-xs text-gray-600">
          {selected.length} of {provinceIds.length} provinces selected
        </p>
      )}
    </div>
  );
}
