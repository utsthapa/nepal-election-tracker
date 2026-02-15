'use client';

import { useMemo } from 'react';
import ComparativeBarChart from '../charts/ComparativeBarChart';
import ChartContainer from '../shared/ChartContainer';
import { PROVINCIAL_DATA, PROVINCIAL_METADATA } from '@/data/provincialMacroData';

/**
 * Provincial Comparison Panel
 * Compares metrics across Nepal's 7 provinces
 */
export default function ProvincialComparison() {
  // Transform provincial data for charts
  const provincesList = useMemo(() => {
    return Object.values(PROVINCIAL_DATA).map(province => ({
      name: province.name,
      gdpPerCapita: province.gdpPerCapita,
      povertyRate: province.povertyRate * 100, // Convert to percentage
      literacy: province.literacy * 100,
      electrificationRate: province.electrificationRate * 100,
      urbanization: province.urbanization * 100,
      gdpShare: province.gdpShare * 100,
      population: province.population,
    }));
  }, []);

  // Colors for provinces
  const provinceColors = [
    '#3b82f6', // Blue - Koshi
    '#f59e0b', // Orange - Madhesh
    '#10b981', // Green - Bagmati
    '#8b5cf6', // Purple - Gandaki
    '#ef4444', // Red - Lumbini
    '#06b6d4', // Cyan - Karnali
    '#ec4899', // Pink - Sudurpashchim
  ];

  return (
    <div className="space-y-6">
      {/* GDP Per Capita Comparison */}
      <ChartContainer
        title="GDP Per Capita by Province"
        subtitle="Economic output per person (USD, 2024 est.)"
        source="National Statistics Office Nepal, Provincial Reports"
        lastUpdated={PROVINCIAL_METADATA.lastUpdated}
        exportData={provincesList}
      >
        <ComparativeBarChart
          data={provincesList}
          categoryKey="name"
          metrics={[
            {
              key: 'gdpPerCapita',
              label: 'GDP Per Capita (USD)',
              color: '#3b82f6',
            },
          ]}
          layout="horizontal"
          valueFormat="currency"
          height={400}
          colors={provinceColors}
        />
      </ChartContainer>

      {/* Poverty Rate Comparison */}
      <ChartContainer
        title="Poverty Rates by Province"
        subtitle="% of population below national poverty line"
        source="Nepal Living Standards Survey, Provincial Reports"
        lastUpdated={PROVINCIAL_METADATA.lastUpdated}
        exportData={provincesList}
      >
        <ComparativeBarChart
          data={provincesList}
          categoryKey="name"
          metrics={[
            {
              key: 'povertyRate',
              label: 'Poverty Rate (%)',
              color: '#ef4444',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={400}
          colors={provinceColors}
        />
      </ChartContainer>

      {/* Literacy Rate Comparison */}
      <ChartContainer
        title="Literacy Rates by Province"
        subtitle="% of population ages 15+ who can read and write"
        source="National Statistics Office Nepal"
        lastUpdated={PROVINCIAL_METADATA.lastUpdated}
        exportData={provincesList}
      >
        <ComparativeBarChart
          data={provincesList}
          categoryKey="name"
          metrics={[
            {
              key: 'literacy',
              label: 'Literacy Rate (%)',
              color: '#8b5cf6',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={400}
          colors={provinceColors}
        />
      </ChartContainer>

      {/* Electrification Rate */}
      <ChartContainer
        title="Electrification Rates by Province"
        subtitle="% of population with electricity access"
        source="Ministry of Energy Nepal"
        lastUpdated={PROVINCIAL_METADATA.lastUpdated}
        exportData={provincesList}
      >
        <ComparativeBarChart
          data={provincesList}
          categoryKey="name"
          metrics={[
            {
              key: 'electrificationRate',
              label: 'Electrification Rate (%)',
              color: '#10b981',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={400}
          colors={provinceColors}
        />
      </ChartContainer>

      {/* Multi-metric Comparison */}
      <ChartContainer
        title="Development Indicators Comparison"
        subtitle="Key metrics across provinces (vertical bars)"
        source="Various Sources"
        lastUpdated={PROVINCIAL_METADATA.lastUpdated}
        exportData={provincesList}
        height="500px"
      >
        <ComparativeBarChart
          data={provincesList}
          categoryKey="name"
          metrics={[
            {
              key: 'literacy',
              label: 'Literacy (%)',
              color: '#8b5cf6',
            },
            {
              key: 'electrificationRate',
              label: 'Electrification (%)',
              color: '#10b981',
            },
            {
              key: 'urbanization',
              label: 'Urbanization (%)',
              color: '#3b82f6',
            },
          ]}
          layout="vertical"
          valueFormat="number"
          height={450}
        />
      </ChartContainer>

      {/* Provincial Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(PROVINCIAL_DATA).map((province, idx) => (
          <div
            key={province.name}
            className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">{province.name}</h3>
              <span className="text-2xl">{idx + 1}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{province.nameNepali}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Capital:</span>
                <span className="font-medium">{province.capital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Population:</span>
                <span className="font-medium">{province.population}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GDP/Capita:</span>
                <span className="font-medium">${province.gdpPerCapita}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Poverty Rate:</span>
                <span className="font-medium">{(province.povertyRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Literacy:</span>
                <span className="font-medium">{(province.literacy * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key Provincial Insights
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Bagmati Province:</strong> Leads in GDP per capita ($2,150) and literacy (85.2%)
              due to Kathmandu valley&apos;s economic activity and educational institutions.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Karnali Province:</strong> Faces the greatest development challenges with
              highest poverty (31.2%), lowest GDP/capita ($980), and lowest literacy (65.8%).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Regional Disparity:</strong> Wide gaps exist between provinces - GDP per capita
              ranges from $980 to $2,150, highlighting development inequality.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Urbanization Gradient:</strong> Bagmati (42.8% urban) far exceeds other provinces,
              while Karnali (9.5%) remains predominantly rural.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              <strong>Infrastructure Access:</strong> Electrification rates vary from 78.2% (Karnali)
              to 98.5% (Bagmati), impacting quality of life and economic opportunities.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
