'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import { formatNumber } from '@/utils/macroDataUtils';

// Simple currency formatter for per-capita values
const formatCurrencySimple = (value, currency = '$') => {
  if (value === null || value === undefined) return 'N/A';
  return `${currency}${value.toLocaleString()}`;
};

/**
 * Comparative Bar Chart Component
 * Displays horizontal or vertical bar charts for comparisons
 *
 * @param {Array} data - Array of data objects
 * @param {string} categoryKey - Key for category labels (e.g., 'province', 'country')
 * @param {Array} metrics - Array of metric objects: { key, label, color }
 * @param {string} layout - 'horizontal' or 'vertical'
 * @param {string} valueFormat - Format type: 'percent', 'currency', 'number'
 * @param {number} height - Chart height in pixels
 * @param {boolean} showGrid - Whether to show grid lines
 * @param {boolean} showLegend - Whether to show legend
 * @param {Array} colors - Optional array of colors for single metric charts
 */
export default function ComparativeBarChart({
  data,
  categoryKey,
  metrics = [],
  layout = 'vertical',
  valueFormat = 'number',
  height = 400,
  showGrid = true,
  showLegend = true,
  colors = null,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
    );
  }

  const isHorizontal = layout === 'horizontal';

  // Default color palette
  const defaultColors = [
    '#3b82f6',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
  ];

  // Format value based on format type
  const formatValue = value => {
    switch (valueFormat) {
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return formatCurrencySimple(value);
      case 'number':
        return formatNumber(value);
      default:
        return value;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-700">{entry.name}:</span>
            <span className="font-semibold text-gray-900">{formatValue(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: isHorizontal ? 100 : 20, bottom: 5 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}

        {isHorizontal ? (
          <>
            <XAxis
              type="number"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={formatValue}
            />
            <YAxis
              type="category"
              dataKey={categoryKey}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              width={90}
            />
          </>
        ) : (
          <>
            <XAxis
              type="category"
              dataKey={categoryKey}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              type="number"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={formatValue}
            />
          </>
        )}

        <Tooltip content={<CustomTooltip />} />

        {showLegend && metrics.length > 1 && <Legend wrapperStyle={{ paddingTop: '20px' }} />}

        {metrics.map((metric, index) => (
          <Bar
            key={metric.key}
            dataKey={metric.key}
            name={metric.label}
            fill={metric.color || defaultColors[index % defaultColors.length]}
            radius={[4, 4, 0, 0]}
          >
            {/* Use custom colors for each bar if provided (single metric case) */}
            {colors &&
              metrics.length === 1 &&
              data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
