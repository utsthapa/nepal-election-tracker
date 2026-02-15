'use client';

/**
 * Heatmap Chart Component
 * Simple heatmap for displaying monthly patterns
 *
 * @param {Object} data - Data object with years as keys and arrays of monthly values
 * @param {Array} months - Array of month names
 * @param {string} valueLabel - Label for values (e.g., "Arrivals (thousands)")
 * @param {number} height - Chart height in pixels
 */
export default function HeatmapChart({
  data = {},
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  valueLabel = 'Value',
  height = 300,
}) {
  const years = Object.keys(data).sort();

  if (years.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  // Find min and max for color scale
  const allValues = years.flatMap(year => data[year] || []);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Get color intensity based on value
  const getColor = (value) => {
    if (!value) return '#f3f4f6'; // gray-100

    const normalized = (value - minValue) / (maxValue - minValue);

    // Green color scale
    const intensity = Math.round(normalized * 6);
    const colors = [
      '#dcfce7', // green-100
      '#bbf7d0', // green-200
      '#86efac', // green-300
      '#4ade80', // green-400
      '#22c55e', // green-500
      '#16a34a', // green-600
      '#15803d', // green-700
    ];

    return colors[intensity] || colors[0];
  };

  return (
    <div style={{ height }} className="overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-50 p-2 text-left sticky left-0 z-10">
              Year
            </th>
            {months.map((month) => (
              <th key={month} className="border border-gray-300 bg-gray-50 p-2 text-center min-w-[60px]">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year}>
              <td className="border border-gray-300 bg-gray-50 p-2 font-medium sticky left-0 z-10">
                {year}
              </td>
              {(data[year] || []).map((value, idx) => (
                <td
                  key={idx}
                  className="border border-gray-300 p-2 text-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${months[idx]} ${year}: ${value?.toFixed(1)} ${valueLabel}`}
                >
                  <span className="font-semibold text-gray-900">
                    {value?.toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4">
        <span className="text-xs font-medium text-gray-700">Scale:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-600">{minValue.toFixed(0)}</span>
          <div className="flex gap-0.5">
            {['#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'].map((color, idx) => (
              <div
                key={idx}
                className="w-6 h-4"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">{maxValue.toFixed(0)}</span>
        </div>
        <span className="text-xs text-gray-600">{valueLabel}</span>
      </div>
    </div>
  );
}
