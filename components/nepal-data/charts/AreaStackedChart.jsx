'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/macroDataUtils';

/**
 * Stacked Area Chart Component
 * Displays composition of metrics over time
 *
 * @param {Array} data - Array of data objects with year/time and metric values
 * @param {Array} areas - Array of area objects: { key, label, color }
 * @param {string} xAxisKey - Key for X-axis (default: 'year')
 * @param {string} yAxisFormat - Format type: 'percent', 'currency', 'number'
 * @param {string} yAxisLabel - Y-axis label
 * @param {number} height - Chart height in pixels
 * @param {boolean} showGrid - Whether to show grid lines
 * @param {boolean} showLegend - Whether to show legend
 * @param {boolean} stackOffset - Stack offset mode: 'none', 'expand', 'wiggle', 'silhouette'
 */
export default function AreaStackedChart({
  data,
  areas = [],
  xAxisKey = 'year',
  yAxisFormat = 'number',
  yAxisLabel = '',
  height = 400,
  showGrid = true,
  showLegend = true,
  stackOffset = 'none',
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
    if (stackOffset === 'expand') {
      return `${(value * 100).toFixed(0)}%`;
    }

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
    if (!active || !payload || payload.length === 0) return null;

    // Calculate total for percentage display
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.reverse().map((entry, index) => {
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.name}:</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    {formatYAxis(entry.value)}
                  </span>
                  {stackOffset === 'none' && (
                    <span className="text-gray-500 text-xs ml-2">
                      ({percentage}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {stackOffset === 'none' && (
            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>{formatYAxis(total)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        stackOffset={stackOffset}
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
        />

        <Tooltip content={<CustomTooltip />} />

        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
        )}

        {areas.map((area, index) => (
          <Area
            key={area.key || index}
            type="monotone"
            dataKey={area.key}
            name={area.label}
            stackId="1"
            stroke={area.color || `hsl(${index * 60}, 70%, 50%)`}
            fill={area.color || `hsl(${index * 60}, 70%, 50%)`}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
