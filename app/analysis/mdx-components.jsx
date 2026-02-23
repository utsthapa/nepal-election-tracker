'use client';

/**
 * MDX Components Mapping
 * These components can be used directly in .mdx files
 */

import Image from 'next/image';
import { Callout } from '../../components/mdx/Callout';
import { CodeBlock } from '../../components/mdx/CodeBlock';
import { Table } from '../../components/mdx/Table';

// Chart components
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

// Text components
export const mdxComponents = {
  // Headings
  h1: ({ children }) => (
    <h1
      className="text-3xl font-bold text-[rgb(24,26,36)] mb-4 mt-8"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="text-2xl font-bold text-[rgb(24,26,36)] mb-3 mt-6"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="text-xl font-bold text-[rgb(24,26,36)] mb-2 mt-4"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      className="text-lg font-semibold text-[rgb(24,26,36)] mb-2 mt-4"
      style={{ fontFamily: 'Lora, serif' }}
    >
      {children}
    </h4>
  ),

  // Text
  p: ({ children }) => <p className="text-[rgb(100,110,130)] mb-4 leading-relaxed">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[#B91C1C] hover:text-[#991B1B] underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold text-[rgb(24,26,36)]">{children}</strong>,
  em: ({ children }) => <em className="italic text-[rgb(100,110,130)]">{children}</em>,

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-[rgb(100,110,130)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-[rgb(100,110,130)]">{children}</ol>
  ),
  li: ({ children }) => <li className="ml-4">{children}</li>,

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#B91C1C] pl-4 italic text-[rgb(100,110,130)] mb-4">
      {children}
    </blockquote>
  ),

  // Code
  code: ({ children, className }) => {
    // Inline code
    if (!className) {
      return (
        <code className="bg-[rgb(219,211,196)]/30 px-2 py-1 rounded text-sm font-mono text-[#B91C1C]">
          {children}
        </code>
      );
    }
    // Code block
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  pre: ({ children }) => (
    <pre className="bg-[rgb(219,211,196)]/30 rounded-lg p-4 overflow-x-auto mb-4">{children}</pre>
  ),

  // Divider
  hr: () => <hr className="border-[rgb(219,211,196)] my-8" />,

  // Image
  img: ({ src, alt }) => (
    <div className="relative w-full aspect-video my-4">
      <Image src={src} alt={alt} fill className="rounded-lg object-cover" />
    </div>
  ),

  // Table
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden border border-[rgb(219,211,196)]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[rgb(219,211,196)]/30">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-[rgb(219,211,196)]">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-[rgb(219,211,196)]/20">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(24,26,36)] uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-3 text-sm text-[rgb(100,110,130)]">{children}</td>,

  // Custom components
  Table,
  Callout,
};

// Chart components for use in MDX files
export const chartComponents = {
  // Simple Bar Chart
  BarChart: ({ data, xKey, yKey, colors, height = 300 }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="bg-neutral rounded-lg p-4 text-center text-gray-700">
          No data available for chart
        </div>
      );
    }

    const defaultColors = ['#22c55e', '#ef4444', '#991b1b', '#3b82f6', '#8b5cf6'];

    return (
      <div className="bg-neutral rounded-lg p-4 mb-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
            <Bar dataKey={yKey} fill={colors?.[0] || defaultColors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },

  // Line Chart
  LineChart: ({ data, xKey, yKeys, colors, height = 300 }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="bg-neutral rounded-lg p-4 text-center text-gray-700">
          No data available for chart
        </div>
      );
    }

    const defaultColors = ['#22c55e', '#ef4444', '#991b1b', '#3b82f6', '#8b5cf6'];

    return (
      <div className="bg-neutral rounded-lg p-4 mb-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              itemStyle={{ color: '#e5e7eb' }}
            />
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
  },

  // Multi-Bar Chart
  MultiBarChart: ({ data, xKey, bars, height = 300 }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="bg-neutral rounded-lg p-4 text-center text-gray-700">
          No data available for chart
        </div>
      );
    }

    const defaultColors = ['#22c55e', '#ef4444', '#991b1b', '#3b82f6', '#8b5cf6'];

    return (
      <div className="bg-neutral rounded-lg p-4 mb-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xKey} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              itemStyle={{ color: '#e5e7eb' }}
            />
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
  },

  // Pie Chart
  PieChart: ({ data, nameKey, valueKey, height = 300 }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="bg-neutral rounded-lg p-4 text-center text-gray-700">
          No data available for chart
        </div>
      );
    }

    const COLORS = ['#22c55e', '#ef4444', '#991b1b', '#3b82f6', '#8b5cf6', '#f59e0b'];

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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },
};

// Export all components together for MDX
export const MDXArticleComponents = {
  ...mdxComponents,
  ...chartComponents,
};
