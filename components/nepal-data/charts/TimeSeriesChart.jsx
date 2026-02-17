'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { formatCurrency, formatNumber } from '@/utils/macroDataUtils';

/**
 * Time Series Chart Component
 * Displays line charts for time series data
 *
 * @param {Array} data - Array of data objects with year and metric values
 * @param {Array} series - Array of series objects: { key, label, color, strokeWidth }
 * @param {string} yAxisLabel - Y-axis label
 * @param {string} yAxisFormat - Format type: 'percent', 'currency', 'number'
 * @param {string} xAxisKey - Key for X-axis (default: 'year')
 * @param {number} height - Chart height in pixels
 * @param {boolean} showGrid - Whether to show grid lines
 * @param {boolean} showLegend - Whether to show legend
 * @param {number} yAxisDomain - Optional Y-axis domain [min, max]
 */
export default function TimeSeriesChart({
  data,
  series = [],
  yAxisLabel = '',
  yAxisFormat = 'number',
  xAxisKey = 'year',
  height = 400,
  showGrid = true,
  showLegend = true,
  yAxisDomain = null,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  // Format Y-axis tick based on format type
  const formatYAxis = (value) => {
    switch (yAxisFormat) {
      case 'percent':
        return `${value}%`;
      case 'currency':
        return formatCurrency(value);
      case 'number':
        return formatNumber(value);
      default:
        return value;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {return null;}

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              {formatYAxis(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        )}

        <XAxis
          dataKey={xAxisKey}
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#6b7280' }}
        />

        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#6b7280' }}
          tickFormatter={formatYAxis}
          label={
            yAxisLabel
              ? {
                  value: yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280' },
                }
              : undefined
          }
          domain={yAxisDomain || ['auto', 'auto']}
        />

        <Tooltip content={<CustomTooltip />} />

        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
        )}

        {series.map((s, index) => (
          <Line
            key={s.key || index}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color || `hsl(${index * 60}, 70%, 50%)`}
            strokeWidth={s.strokeWidth || 2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
