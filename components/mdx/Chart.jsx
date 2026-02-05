'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function Chart({ data, type = 'bar', xKey, yKey, colors }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-neutral rounded-lg p-4 text-center text-gray-400">
        No data available for chart
      </div>
    )
  }

  const defaultColors = ['#22c55e', '#ef4444', '#991b1b', '#3b82f6', '#8b5cf6']

  return (
    <div className="bg-neutral rounded-lg p-4 mb-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey={xKey} 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend />
          <Bar 
            dataKey={yKey} 
            fill={colors?.[0] || defaultColors[0]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
