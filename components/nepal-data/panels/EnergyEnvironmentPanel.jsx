'use client';

import { useState, useMemo } from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import ChartContainer from '../shared/ChartContainer';
import TimeRangeSelector from '../controls/TimeRangeSelector';
import { transformTimeSeriesData, filterByTimeRange } from '@/utils/macroDataUtils';
import { YEARS, ENERGY_ENVIRONMENT, DATA_METADATA } from '@/data/nepalMacroData';

/**
 * Energy & Environment Panel
 * Displays CO2 emissions, electricity access, and renewable energy
 */
export default function EnergyEnvironmentPanel() {
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

  // Prepare emissions data
  const emissionsData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      co2PerCapita: ENERGY_ENVIRONMENT.emissions.co2PerCapita,
      co2Total: ENERGY_ENVIRONMENT.emissions.co2Total,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare electricity data
  const electricityData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      access: ENERGY_ENVIRONMENT.electricity.access,
      production: ENERGY_ENVIRONMENT.electricity.production,
      renewablePercent: ENERGY_ENVIRONMENT.electricity.renewablePercent,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare energy use data
  const energyData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      usePerCapita: ENERGY_ENVIRONMENT.energy.usePerCapita,
      renewablePercent: ENERGY_ENVIRONMENT.energy.renewablePercent,
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

      {/* CO2 Emissions Per Capita */}
      <ChartContainer
        title="CO2 Emissions Per Capita"
        subtitle="Metric tons per person"
        source="World Bank, IEA"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={emissionsData}
      >
        <TimeSeriesChart
          data={emissionsData}
          series={[
            {
              key: 'co2PerCapita',
              label: 'CO2 Per Capita (Metric Tons)',
              color: '#ef4444',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Metric Tons"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Total CO2 Emissions */}
      <ChartContainer
        title="Total CO2 Emissions"
        subtitle="Million metric tons"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={emissionsData}
      >
        <TimeSeriesChart
          data={emissionsData}
          series={[
            {
              key: 'co2Total',
              label: 'Total CO2 Emissions',
              color: '#f59e0b',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Million Metric Tons"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Electricity Access */}
      <ChartContainer
        title="Access to Electricity"
        subtitle="% of population with electricity access"
        source="World Bank, Ministry of Energy Nepal"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={electricityData}
      >
        <TimeSeriesChart
          data={electricityData}
          series={[
            {
              key: 'access',
              label: 'Electrification Rate (%)',
              color: '#10b981',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="% with Access"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Electricity Production */}
      <ChartContainer
        title="Electricity Production"
        subtitle="Billion kilowatt-hours"
        source="Ministry of Energy Nepal, IEA"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={electricityData}
      >
        <TimeSeriesChart
          data={electricityData}
          series={[
            {
              key: 'production',
              label: 'Production (Billion kWh)',
              color: '#3b82f6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Billion kWh"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Renewable Energy Share */}
      <ChartContainer
        title="Renewable Energy Share"
        subtitle="% of total electricity from renewable sources"
        source="IEA, World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={electricityData}
      >
        <TimeSeriesChart
          data={electricityData}
          series={[
            {
              key: 'renewablePercent',
              label: 'Renewable Share (%)',
              color: '#22c55e',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="% Renewable"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Energy Use Per Capita */}
      <ChartContainer
        title="Energy Use Per Capita"
        subtitle="Kg of oil equivalent per person"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={energyData}
      >
        <TimeSeriesChart
          data={energyData}
          series={[
            {
              key: 'usePerCapita',
              label: 'Energy Use Per Capita',
              color: '#8b5cf6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Kg Oil Equivalent"
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
              <strong>Low Emissions:</strong> At {ENERGY_ENVIRONMENT.emissions.co2PerCapita[14]} metric tons
              per capita, Nepal has one of the world&apos;s lowest carbon footprints.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Electrification Success:</strong> {ENERGY_ENVIRONMENT.electricity.access[14]}%
              of the population now has electricity access, up from {ENERGY_ENVIRONMENT.electricity.access[0]}% in 2010.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Hydropower Dominance:</strong> {ENERGY_ENVIRONMENT.electricity.renewablePercent[14]}%
              of electricity comes from renewable sources, primarily hydropower.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Growing Production:</strong> Electricity generation reached{' '}
              {ENERGY_ENVIRONMENT.electricity.production[14]} billion kWh, driven by new hydropower projects.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 font-bold">•</span>
            <span>
              <strong>Climate Vulnerability:</strong> Despite low emissions, Nepal is highly vulnerable
              to climate change impacts, particularly in the Himalayas.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
