'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const defaultColors = ['#22c55e', '#ef4444', '#991b1b', '#3b82f6', '#8b5cf6'];

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
  },
  itemStyle: { color: '#e5e7eb' },
};

function normalizeArrayData(data) {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function pickNumericKey(data, excludeKeys = []) {
  const sample = data.find(row => row && typeof row === 'object');
  if (!sample) return null;
  const excluded = new Set(excludeKeys.filter(Boolean));
  return (
    Object.keys(sample).find(key => {
      if (excluded.has(key)) return false;
      return data.some(row => typeof row?.[key] === 'number' && Number.isFinite(row[key]));
    }) || null
  );
}

function normalizeYKeys(yKeys, fallbackKeys = []) {
  if (Array.isArray(yKeys)) return yKeys.filter(Boolean);
  if (typeof yKeys === 'string' && yKeys.trim()) return [yKeys];
  return fallbackKeys.filter(Boolean);
}

function NoData() {
  return (
    <div className="bg-neutral rounded-lg p-4 text-center text-gray-700">
      No data available for chart
    </div>
  );
}

export function MDXBarChart({ data, xKey, yKey, bars, colors, height = 300 }) {
  const normalizedData = normalizeArrayData(data);
  if (normalizedData.length === 0) {
    return <NoData />;
  }

  const normalizedBars = Array.isArray(bars) ? bars.filter(bar => bar?.key) : [];
  const resolvedYKey = yKey || pickNumericKey(normalizedData, [xKey]);
  if (!resolvedYKey && normalizedBars.length === 0) {
    return <NoData />;
  }

  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          {normalizedBars.length > 0 ? (
            normalizedBars.map((bar, index) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={bar.color || defaultColors[index % defaultColors.length]}
                name={bar.name}
                radius={[4, 4, 0, 0]}
              />
            ))
          ) : (
            <Bar
              dataKey={resolvedYKey}
              fill={colors?.[0] || defaultColors[0]}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MDXLineChart({ data, xKey, yKeys, bars, colors, height = 300 }) {
  const normalizedData = normalizeArrayData(data);
  if (normalizedData.length === 0) {
    return <NoData />;
  }

  const barKeys = Array.isArray(bars) ? bars.map(bar => bar?.key).filter(Boolean) : [];
  const fallbackKey = pickNumericKey(normalizedData, [xKey]);
  const normalizedYKeys = normalizeYKeys(yKeys, [...barKeys, fallbackKey]);
  if (normalizedYKeys.length === 0) {
    return <NoData />;
  }

  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          {normalizedYKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors?.[index] || defaultColors[index % defaultColors.length]}
              strokeWidth={2}
              dot={{ fill: colors?.[index] || defaultColors[index % defaultColors.length] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MDXMultiBarChart({ data, xKey, bars, height = 300 }) {
  const normalizedData = normalizeArrayData(data);
  const normalizedBars = Array.isArray(bars) ? bars.filter(bar => bar?.key) : [];

  if (normalizedData.length === 0 || normalizedBars.length === 0) {
    return <NoData />;
  }

  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          {normalizedBars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color || defaultColors[index % defaultColors.length]}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_COLORS = [...defaultColors, '#f59e0b'];

export function MDXPieChart({ data, nameKey, valueKey, height = 300 }) {
  const normalizedData = normalizeArrayData(data);
  if (normalizedData.length === 0) {
    return <NoData />;
  }
  const resolvedValueKey = valueKey || pickNumericKey(normalizedData, [nameKey]);
  const resolvedNameKey =
    nameKey || Object.keys(normalizedData[0] || {}).find(key => key !== resolvedValueKey) || 'name';
  if (!resolvedValueKey) {
    return <NoData />;
  }

  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={normalizedData}
            dataKey={resolvedValueKey}
            nameKey={resolvedNameKey}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
          >
            {normalizedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
