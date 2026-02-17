'use client';

import { useState, useMemo } from 'react';

import TimeSeriesChart from '../charts/TimeSeriesChart';
import TimeRangeSelector from '../controls/TimeRangeSelector';
import ChartContainer from '../shared/ChartContainer';
import { YEARS, DEMOGRAPHICS_NATIONAL, DATA_METADATA } from '@/data/nepalMacroData';
import { transformTimeSeriesData, filterByTimeRange } from '@/utils/macroDataUtils';

/**
 * Demographics National Panel
 * Displays population, vital statistics, and education indicators
 */
export default function DemographicsNational() {
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

  // Prepare population data
  const populationData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      total: DEMOGRAPHICS_NATIONAL.population.total,
      growth: DEMOGRAPHICS_NATIONAL.population.growth,
      urban: DEMOGRAPHICS_NATIONAL.population.urban,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare vital statistics data
  const vitalStatsData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      lifeExpectancy: DEMOGRAPHICS_NATIONAL.vital.lifeExpectancy,
      fertility: DEMOGRAPHICS_NATIONAL.vital.fertility,
      infantMortality: DEMOGRAPHICS_NATIONAL.vital.infantMortality,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare education data
  const educationData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      literacy: DEMOGRAPHICS_NATIONAL.education.literacy,
      primaryEnrollment: DEMOGRAPHICS_NATIONAL.education.primaryEnrollment,
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

      {/* Total Population */}
      <ChartContainer
        title="Total Population"
        subtitle="Population in millions"
        source="National Statistics Office Nepal, World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={populationData}
      >
        <TimeSeriesChart
          data={populationData}
          series={[
            {
              key: 'total',
              label: 'Total Population (Millions)',
              color: '#3b82f6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Millions"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Population Growth Rate */}
      <ChartContainer
        title="Population Growth Rate"
        subtitle="Annual percentage change"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={populationData}
      >
        <TimeSeriesChart
          data={populationData}
          series={[
            {
              key: 'growth',
              label: 'Growth Rate',
              color: '#10b981',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Annual % Growth"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Urbanization */}
      <ChartContainer
        title="Urbanization"
        subtitle="Urban population as % of total"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={populationData}
      >
        <TimeSeriesChart
          data={populationData}
          series={[
            {
              key: 'urban',
              label: 'Urban Population (%)',
              color: '#8b5cf6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="% Urban"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Life Expectancy */}
      <ChartContainer
        title="Life Expectancy at Birth"
        subtitle="Expected years of life"
        source="World Bank, WHO"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={vitalStatsData}
      >
        <TimeSeriesChart
          data={vitalStatsData}
          series={[
            {
              key: 'lifeExpectancy',
              label: 'Life Expectancy (Years)',
              color: '#06b6d4',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Years"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Fertility & Infant Mortality */}
      <ChartContainer
        title="Vital Statistics"
        subtitle="Fertility rate and infant mortality"
        source="World Bank, UNICEF"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={vitalStatsData}
      >
        <TimeSeriesChart
          data={vitalStatsData}
          series={[
            {
              key: 'fertility',
              label: 'Fertility Rate (Births per Woman)',
              color: '#f59e0b',
              strokeWidth: 2,
            },
            {
              key: 'infantMortality',
              label: 'Infant Mortality (per 1,000 births)',
              color: '#ef4444',
              strokeWidth: 2,
            },
          ]}
          yAxisLabel="Rate"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Literacy Rate */}
      <ChartContainer
        title="Literacy Rate"
        subtitle="% of population ages 15+ who can read and write"
        source="UNESCO, National Statistics Office Nepal"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={educationData}
      >
        <TimeSeriesChart
          data={educationData}
          series={[
            {
              key: 'literacy',
              label: 'Literacy Rate (%)',
              color: '#8b5cf6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="% Literate"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Summary Stats */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Insights (2024)
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Population:</strong> Nepal&apos;s population reached{' '}
              {DEMOGRAPHICS_NATIONAL.population.total[14]}M in 2024, growing at{' '}
              {DEMOGRAPHICS_NATIONAL.population.growth[14]}% annually.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Urbanization:</strong> {DEMOGRAPHICS_NATIONAL.population.urban[14]}%
              of the population now lives in urban areas, up from{' '}
              {DEMOGRAPHICS_NATIONAL.population.urban[0]}% in 2010.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Life Expectancy:</strong> Increased to{' '}
              {DEMOGRAPHICS_NATIONAL.vital.lifeExpectancy[14]} years, reflecting
              improvements in healthcare access.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Fertility:</strong> Declined to{' '}
              {DEMOGRAPHICS_NATIONAL.vital.fertility[14]} births per woman,
              indicating demographic transition.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Literacy:</strong> {DEMOGRAPHICS_NATIONAL.education.literacy[14]}%
              literacy rate represents significant progress in education access.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
