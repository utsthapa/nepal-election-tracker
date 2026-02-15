'use client';

import { useState, useMemo } from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import ChartContainer from '../shared/ChartContainer';
import TimeRangeSelector from '../controls/TimeRangeSelector';
import { transformTimeSeriesData, filterByTimeRange } from '@/utils/macroDataUtils';
import { YEARS, POVERTY_INEQUALITY, DATA_METADATA } from '@/data/nepalMacroData';

/**
 * Poverty & Inequality Panel
 * Displays poverty rates, Gini index, and income distribution
 */
export default function PovertyPanel() {
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

  // Prepare poverty data
  const povertyData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      headcount215: POVERTY_INEQUALITY.poverty.headcount215,
      headcountNational: POVERTY_INEQUALITY.poverty.headcountNational,
      multidimensional: POVERTY_INEQUALITY.poverty.multidimensional.map(v => v * 100), // Convert to percentage
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare inequality data
  const inequalityData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      gini: POVERTY_INEQUALITY.inequality.gini,
      lowestQuintile: POVERTY_INEQUALITY.inequality.lowestQuintile,
      highestQuintile: POVERTY_INEQUALITY.inequality.highestQuintile,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

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

      {/* Poverty Headcount Ratios */}
      <ChartContainer
        title="Poverty Headcount Ratios"
        subtitle="% of population below poverty lines"
        source="World Bank, Nepal Living Standards Survey"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={povertyData}
      >
        <TimeSeriesChart
          data={povertyData}
          series={[
            {
              key: 'headcount215',
              label: 'International ($2.15/day, 2017 PPP)',
              color: '#ef4444',
              strokeWidth: 2,
            },
            {
              key: 'headcountNational',
              label: 'National Poverty Line',
              color: '#f59e0b',
              strokeWidth: 2,
            },
          ]}
          yAxisLabel="% in Poverty"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Multidimensional Poverty */}
      <ChartContainer
        title="Multidimensional Poverty Index"
        subtitle="Composite measure beyond income (health, education, living standards)"
        source="UNDP, Oxford Poverty and Human Development Initiative"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={povertyData}
      >
        <TimeSeriesChart
          data={povertyData}
          series={[
            {
              key: 'multidimensional',
              label: 'MPI Score (0-100)',
              color: '#8b5cf6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="MPI Score"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Gini Index */}
      <ChartContainer
        title="Gini Index (Income Inequality)"
        subtitle="0 = perfect equality, 100 = perfect inequality"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={inequalityData}
      >
        <TimeSeriesChart
          data={inequalityData}
          series={[
            {
              key: 'gini',
              label: 'Gini Coefficient',
              color: '#06b6d4',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Gini Index"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Income Distribution */}
      <ChartContainer
        title="Income Distribution by Quintile"
        subtitle="Share of income held by top and bottom 20%"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={inequalityData}
      >
        <TimeSeriesChart
          data={inequalityData}
          series={[
            {
              key: 'highestQuintile',
              label: 'Highest 20% (Richest)',
              color: '#3b82f6',
              strokeWidth: 2,
            },
            {
              key: 'lowestQuintile',
              label: 'Lowest 20% (Poorest)',
              color: '#10b981',
              strokeWidth: 2,
            },
          ]}
          yAxisLabel="% of Total Income"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Summary Stats */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Insights (2024)
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>
              <strong>Poverty Reduction:</strong> International poverty ($2.15/day) fell to{' '}
              {POVERTY_INEQUALITY.poverty.headcount215[14]}%, down from{' '}
              {POVERTY_INEQUALITY.poverty.headcount215[0]}% in 2010.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>
              <strong>National Poverty:</strong> {POVERTY_INEQUALITY.poverty.headcountNational[14]}%
              of Nepalis live below the national poverty line.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>
              <strong>Multidimensional Poverty:</strong> Beyond income, {(POVERTY_INEQUALITY.poverty.multidimensional[14] * 100).toFixed(1)}%
              of the population faces deprivation in health, education, or living standards.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>
              <strong>Inequality:</strong> Gini index of {POVERTY_INEQUALITY.inequality.gini[14]}
              indicates moderate inequality, with gradual improvement over time.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-600 font-bold">•</span>
            <span>
              <strong>Income Gap:</strong> The richest 20% hold {POVERTY_INEQUALITY.inequality.highestQuintile[14]}%
              of income, while the poorest 20% hold {POVERTY_INEQUALITY.inequality.lowestQuintile[14]}%.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
