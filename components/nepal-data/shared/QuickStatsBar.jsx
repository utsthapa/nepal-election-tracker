'use client';

import { getTrendIcon, getTrendColor } from '@/utils/macroDataUtils';

/**
 * Quick Stats Bar Component
 * Displays key metrics summary at the top of the dashboard
 *
 * @param {Array} stats - Array of stat objects with { label, value, change, reverseColors }
 */
export default function QuickStatsBar({ stats = [] }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

/**
 * Individual Stat Card
 */
function StatCard({ label, value, change, unit = '', reverseColors = false }) {
  const hasChange = change !== null && change !== undefined;
  const trendColor = hasChange ? getTrendColor(change, reverseColors) : '';
  const trendIcon = hasChange ? getTrendIcon(change) : '';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Label */}
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {value}
          {unit && <span className="text-xl text-gray-600 ml-1">{unit}</span>}
        </span>
      </div>

      {/* Change indicator */}
      {hasChange && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendIcon} {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500">vs last year</span>
        </div>
      )}
    </div>
  );
}
