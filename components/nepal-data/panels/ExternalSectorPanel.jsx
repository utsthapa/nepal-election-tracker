'use client';

import { useState, useMemo } from 'react';

import AreaStackedChart from '../charts/AreaStackedChart';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import TimeRangeSelector from '../controls/TimeRangeSelector';
import ChartContainer from '../shared/ChartContainer';
import { YEARS, EXTERNAL_SECTOR, DATA_METADATA } from '@/data/nepalMacroData';
import { transformTimeSeriesData, filterByTimeRange } from '@/utils/macroDataUtils';

/**
 * External Sector Panel
 * Displays trade, remittances, and foreign investment data
 */
export default function ExternalSectorPanel() {
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

  // Prepare current account data
  const currentAccountData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      balance: EXTERNAL_SECTOR.currentAccount.balance,
      balancePercent: EXTERNAL_SECTOR.currentAccount.balancePercent,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare trade data
  const tradeData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      exports: EXTERNAL_SECTOR.trade.exports,
      imports: EXTERNAL_SECTOR.trade.imports,
      balance: EXTERNAL_SECTOR.trade.balance,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare remittances data
  const remittancesData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      received: EXTERNAL_SECTOR.remittances.received,
      percentOfGDP: EXTERNAL_SECTOR.remittances.percentOfGDP,
    });
    return filterByTimeRange(data, timeRangeObj.start, timeRangeObj.end);
  }, [timeRangeObj]);

  // Prepare FDI data
  const fdiData = useMemo(() => {
    const data = transformTimeSeriesData(YEARS, {
      fdi: EXTERNAL_SECTOR.foreignInvestment.fdi,
      fdiPercent: EXTERNAL_SECTOR.foreignInvestment.fdiPercent,
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

      {/* Current Account Balance */}
      <ChartContainer
        title="Current Account Balance"
        subtitle="Balance of payments - current account"
        source="Nepal Rastra Bank, World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={currentAccountData}
      >
        <TimeSeriesChart
          data={currentAccountData}
          series={[
            {
              key: 'balance',
              label: 'Current Account Balance (Billion USD)',
              color: '#3b82f6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Billion USD"
          yAxisFormat="currency"
        />
      </ChartContainer>

      {/* Trade Balance - Exports vs Imports */}
      <ChartContainer
        title="Trade Balance"
        subtitle="Exports and imports of goods and services"
        source="Nepal Rastra Bank, World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={tradeData}
      >
        <AreaStackedChart
          data={tradeData}
          areas={[
            {
              key: 'exports',
              label: 'Exports',
              color: '#10b981',
            },
            {
              key: 'imports',
              label: 'Imports',
              color: '#ef4444',
            },
          ]}
          yAxisLabel="Billion USD"
          yAxisFormat="currency"
          stackOffset="none"
        />
      </ChartContainer>

      {/* Trade Deficit */}
      <ChartContainer
        title="Trade Deficit"
        subtitle="Gap between imports and exports"
        source="Nepal Rastra Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={tradeData}
      >
        <TimeSeriesChart
          data={tradeData}
          series={[
            {
              key: 'balance',
              label: 'Trade Balance',
              color: '#ef4444',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Billion USD"
          yAxisFormat="currency"
        />
      </ChartContainer>

      {/* Remittances */}
      <ChartContainer
        title="Remittances Inflows"
        subtitle="Money sent home by Nepali workers abroad"
        source="Nepal Rastra Bank, World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={remittancesData}
      >
        <TimeSeriesChart
          data={remittancesData}
          series={[
            {
              key: 'received',
              label: 'Remittances Received (Billion USD)',
              color: '#8b5cf6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Billion USD"
          yAxisFormat="currency"
        />
      </ChartContainer>

      {/* Remittances as % of GDP */}
      <ChartContainer
        title="Remittances Share of Economy"
        subtitle="Remittances as percentage of GDP"
        source="World Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={remittancesData}
      >
        <TimeSeriesChart
          data={remittancesData}
          series={[
            {
              key: 'percentOfGDP',
              label: 'Remittances (% of GDP)',
              color: '#f59e0b',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="% of GDP"
          yAxisFormat="number"
        />
      </ChartContainer>

      {/* Foreign Direct Investment */}
      <ChartContainer
        title="Foreign Direct Investment"
        subtitle="Net FDI inflows"
        source="World Bank, Nepal Rastra Bank"
        lastUpdated={DATA_METADATA.lastUpdated}
        exportData={fdiData}
      >
        <TimeSeriesChart
          data={fdiData}
          series={[
            {
              key: 'fdi',
              label: 'FDI Inflows (Billion USD)',
              color: '#14b8a6',
              strokeWidth: 3,
            },
          ]}
          yAxisLabel="Billion USD"
          yAxisFormat="currency"
        />
      </ChartContainer>

      {/* Summary Stats */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Insights (2024)
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Current Account:</strong> Improved to a surplus of $
              {EXTERNAL_SECTOR.currentAccount.balance[14]}B (
              {EXTERNAL_SECTOR.currentAccount.balancePercent[14]}% of GDP) in 2024.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Trade Deficit:</strong> Persistent deficit of $
              {Math.abs(EXTERNAL_SECTOR.trade.balance[14])}B as imports
              significantly exceed exports.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Remittances:</strong> Critical lifeline at $
              {EXTERNAL_SECTOR.remittances.received[14]}B, representing{' '}
              {EXTERNAL_SECTOR.remittances.percentOfGDP[14]}% of GDP - one of
              the highest ratios globally.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Workers Abroad:</strong> Approximately{' '}
              {EXTERNAL_SECTOR.remittances.workersAbroad[14]}M Nepali workers
              are employed overseas, primarily in Gulf countries and Malaysia.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>FDI:</strong> Foreign investment remains modest at $
              {EXTERNAL_SECTOR.foreignInvestment.fdi[14]}B (
              {EXTERNAL_SECTOR.foreignInvestment.fdiPercent[14]}% of GDP),
              highlighting need for improved investment climate.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
