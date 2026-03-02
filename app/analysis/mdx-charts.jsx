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

function NoData() {
  return (
    <div className="bg-neutral rounded-lg p-4 text-center text-gray-700">
      No data available for chart
    </div>
  );
}

export function MDXBarChart({ data, xKey, yKey, colors, height = 300 }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NoData />;
  }
  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          <Bar dataKey={yKey} fill={colors?.[0] || defaultColors[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MDXLineChart({ data, xKey, yKeys, colors, height = 300 }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NoData />;
  }
  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          {yKeys.map((key, index) => (
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
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NoData />;
  }
  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend />
          {bars.map((bar, index) => (
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
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <NoData />;
  }
  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
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
