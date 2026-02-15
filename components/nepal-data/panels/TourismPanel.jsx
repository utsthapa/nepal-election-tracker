'use client';

import { useState, useMemo } from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import HeatmapChart from '../charts/HeatmapChart';
import ChartContainer from '../shared/ChartContainer';
import TimeRangeSelector from '../controls/TimeRangeSelector';
import { transformTimeSeriesData, filterByTimeRange } from '@/utils/macroDataUtils';
import { YEARS, TOURISM, DATA_METADATA } from '@/data/nepalMacroData';

/**
 * Tourism Panel
 * Displays tourist arrivals, monthly patterns, and source countries
 */
export default function TourismPanel() {
  const [timeRange, setTimeRange] = useState('All');

  // Time range filter
  const timeRangeObj = useMemo(() => {
    const presets = {
      '5Y': { start: 2019, end: 2024 },
      '10Y': { start: 2014, end: 2024 },
      'All': { start: 2010, end: 2024 },
    };
    return presets[timeRange];
  }, [timeRange]);

  // Prepare annual arrivals data
  const arrivalsData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      arrivals: TOURISM.annual.arrivals,
      growth: TOURISM.annual.growth,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare tourism receipts data
  const receiptsData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      receipts: TOURISM.annual.receipts,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Monthly heatmap data
  const monthlyData = {
    2022: TOURISM.monthly2022,
    2023: TOURISM.monthly2023,
    2024: TOURISM.monthly2024,
  };

  // Source countries data for pie chart display
  const sourceCountries = Object.entries(TOURISM.sourceCountries)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <TimeRangeSelector
          selected={timeRange}
          onChange={(key) => setTimeRange(key)}
          currentYear={2024}
        />
      </div>

      {/* Annual Tourist Arrivals */}
      <ChartContainer
        title="Annual Tourist Arrivals"
        subtitle="International visitor arrivals (thousands)"
        source="Nepal Tourism Board"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={arrivalsData}
      >
        <TimeSeriesChart
          data={arrivalsData}
          series={[
            {
              key: 'arrivals',
              label: 'Tourist Arrivals (thousands)',
              color: '#3b82f6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Thousands"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Year-over-Year Growth */}
      <ChartContainer
        title="Tourism Growth Rate"
        subtitle="Year-over-year % change in arrivals"
        source="Nepal Tourism Board"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={arrivalsData}
      >
        <TimeSeriesChart
          data={arrivalsData}
          series={[
            {
              key: 'growth',
              label: 'YoY Growth Rate',
              color: '#10b981',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="% Growth"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Tourism Receipts */}
      <ChartContainer
        title="Tourism Receipts"
        subtitle="Revenue from international tourism (million USD)"
        source="Nepal Tourism Board, World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={receiptsData}
      >
        <TimeSeriesChart
          data={receiptsData}
          series={[
            {
              key: 'receipts',
              label: 'Tourism Receipts (Million USD)',
              color: '#8b5cf6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Million USD"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Monthly Arrivals Heatmap */}
      <ChartContainer
        title="Monthly Arrivals Pattern (2022-2024)"
        subtitle="Tourist arrivals by month - darker green = higher arrivals"
        source="Nepal Tourism Board"
        lastUpdated={DATA_METADATA.lastUpdated}
        height="400px"
      >
        <HeatmapChart
          data={monthlyData}
          valueLabel="thousands"
          height={300}
        />
      </ChartContainer>

      {/* Source Countries Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Source Countries (2024)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sourceCountries.map(([country, percentage], idx) => (
            <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                <span className="font-medium text-gray-900">{country}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Insights (2024)
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>Record Recovery:</strong> Tourist arrivals reached{' '}
              {TOURISM.annual.arrivals[14].toLocaleString()} thousand in 2024, growing{' '}
              {TOURISM.annual.growth[14]}% year-over-year.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>COVID Impact:</strong> The sector crashed to just {TOURISM.annual.arrivals[10]} thousand
              arrivals in 2020, but has since recovered strongly.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>Peak Season:</strong> October-November sees the highest arrivals, coinciding
              with ideal trekking weather and festival season.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>Top Markets:</strong> India ({TOURISM.sourceCountries.India}%), China ({TOURISM.sourceCountries.China}%),
              and USA ({TOURISM.sourceCountries.USA}%) are the largest source markets.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>
              <strong>Economic Impact:</strong> Tourism receipts of ${TOURISM.annual.receipts[14]}M
              make it a crucial foreign exchange earner for Nepal.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
