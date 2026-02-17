'use client';

/**
 * Metric Toggle Component
 * Switch between related metrics or view modes
 *
 * @param {Array} options - Array of option objects: { value, label, description }
 * @param {string} selected - Currently selected option value
 * @param {Function} onChange - Callback when selection changes: (value) => void
 * @param {string} label - Optional label for the toggle group
 */
export default function MetricToggle({
  options = [],
  selected,
  onChange,
  label,
}) {
  if (!options || options.length === 0) {return null;}

  const handleClick = (value) => {
    if (onChange && value !== selected) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <div className="inline-flex items-stretch bg-gray-100 rounded-lg p-1">
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleClick(option.value)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                ${
                  isSelected
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }
              `}
              aria-pressed={isSelected}
              title={option.description}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
