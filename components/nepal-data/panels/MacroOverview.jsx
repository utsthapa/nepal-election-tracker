'use client';

import { useState, useMemo } from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import ChartContainer from '../shared/ChartContainer';
import TimeRangeSelector from '../controls/TimeRangeSelector';
import MetricToggle from '../controls/MetricToggle';
import { transformTimeSeriesData, filterByTimeRange } from '@/utils/macroDataUtils';
import { YEARS, MACRO_INDICATORS, DATA_METADATA } from '@/data/nepalMacroData';

/**
 * Macro Overview Panel
 * Displays GDP, inflation, employment, and fiscal indicators
 */
export default function MacroOverview() {
  const [timeRange, setTimeRange] = useState('All');
  const [inflationView, setInflationView] = useState('annual');

  // Debug: Check if data is loaded
  console.log('YEARS:', YEARS);
  console.log('MACRO_INDICATORS:', MACRO_INDICATORS);
  console.log('GDP growth data:', MACRO_INDICATORS?.gdp?.growth);

  // Time range filter
  const timeRangeObj = useMemo(() => {
    const presets = {
      '5Y': { start: 2019, end: 2024 },
      '10Y': { start: 2014, end: 2024 },
      'All': { start: 2010, end: 2024 },
    };
    return presets[timeRange];
  }, [timeRange]);

  // Prepare GDP data
  const gdpData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      growth: MACRO_INDICATORS.gdp.growth,
      perCapita: MACRO_INDICATORS.gdp.perCapita,
      nominal: MACRO_INDICATORS.gdp.nominal,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare inflation data
  const inflationData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      annual: MACRO_INDICATORS.inflation.annual,
      food: MACRO_INDICATORS.inflation.food,
      core: MACRO_INDICATORS.inflation.core,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare employment data
  const employmentData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      unemployment: MACRO_INDICATORS.employment.unemployment,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare fiscal data
  const fiscalData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      balance: MACRO_INDICATORS.fiscal.balance,
      publicDebt: MACRO_INDICATORS.fiscal.publicDebt,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  const inflationOptions = [
    { value: 'annual', label: 'Overall CPI', description: 'Consumer Price Index (annual %)' },
    { value: 'components', label: 'Components', description: 'Food vs Core inflation breakdown' },
  ];

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

      {/* GDP Growth */}
      <ChartContainer
        title="GDP Growth Rate"
        subtitle="Annual percentage change in real GDP"
        source="World Bank, Nepal Rastra Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={gdpData}
      >
        <TimeSeriesChart
          data={gdpData}
          series={[
            {
              key: 'growth',
              label: 'GDP Growth Rate',
              color: '#3b82f6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Growth Rate (%)"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* GDP Per Capita */}
      <ChartContainer
        title="GDP Per Capita"
        subtitle="Current USD"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={gdpData}
      >
        <TimeSeriesChart
          data={gdpData}
          series={[
            {
              key: 'perCapita',
              label: 'GDP Per Capita',
              color: '#10b981',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="USD"
          yAxisFormat="currency"
        />
      </ChartContainer>

      {/* Inflation */}
      <div>
        <ChartContainer
          title="Inflation Rate"
          subtitle="Consumer Price Index (annual %)"
          source="Nepal Rastra Bank, World Bank"
          lastUpdated={DATA_METADATA.lastUpdated}
          exportData={inflationData}
        >
          <div className="mb-4">
            <MetricToggle
              options={inflationOptions}
              selected={inflationView}
              onChange={setInflationView}
            />
          </div>

          {inflationView === 'annual' ? (
            <TimeSeriesChart
              data={inflationData}
              series={[
                {
                  key: 'annual',
                  label: 'CPI Inflation',
                  color: '#f59e0b',
                  strokeWidth: 3,
                },
              ]}
              yAxisLabel="Inflation Rate (%)"
              yAxisFormat="number"
            />
          ) : (
            <TimeSeriesChart
              data={inflationData}
              series={[
                {
                  key: 'annual',
                  label: 'Overall CPI',
                  color: '#f59e0b',
                  strokeWidth: 2,
                },
                {
                  key: 'food',
                  label: 'Food Inflation',
                  color: '#ef4444',
                  strokeWidth: 2,
                },
                {
                  key: 'core',
                  label: 'Core Inflation',
                  color: '#8b5cf6',
                  strokeWidth: 2,
                },
              ]}
              yAxisLabel="Inflation Rate (%)"
              yAxisFormat="number"
            />
          )}
        </ChartContainer>
      </div>

      {/* Unemployment */}
      <ChartContainer
        title="Unemployment Rate"
        subtitle="% of total labor force"
        source="World Bank, ILO"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={employmentData}
      >
        <TimeSeriesChart
          data={employmentData}
          series={[
            {
              key: 'unemployment',
              label: 'Unemployment Rate',
              color: '#ef4444',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Unemployment (%)"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Fiscal Balance */}
      <ChartContainer
        title="Fiscal Indicators"
        subtitle="Government fiscal balance and public debt"
        source="IMF, Ministry of Finance Nepal"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={fiscalData}
      >
        <TimeSeriesChart
          data={fiscalData}
          series={[
            {
              key: 'balance',
              label: 'Fiscal Balance (% of GDP)',
              color: '#3b82f6',
              strokeWidth: 2,
            },
            {
              key: 'publicDebt',
              label: 'Public Debt (% of GDP)',
              color: '#ef4444',
              strokeWidth: 2,
            },
          ]}
          yAxisLabel="% of GDP"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Summary Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Insights (2024)
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>GDP Growth:</strong> Nepal's economy grew by{' '}
              {MACRO_INDICATORS.gdp.growth[14]}% in 2024, showing recovery
              from the COVID-19 impact.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>GDP Per Capita:</strong> Reached ${MACRO_INDICATORS.gdp.perCapita[14]},
              reflecting gradual income growth.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Inflation:</strong> Moderated to{' '}
              {MACRO_INDICATORS.inflation.annual[14]}% after peak pressures
              in 2022.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Unemployment:</strong> Declined to{' '}
              {MACRO_INDICATORS.employment.unemployment[14]}%, though remains
              elevated compared to pre-pandemic levels.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
