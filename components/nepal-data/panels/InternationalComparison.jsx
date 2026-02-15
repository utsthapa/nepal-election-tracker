'use client';

import { useMemo } from 'react';
import ComparativeBarChart from '../charts/ComparativeBarChart';
import ChartContainer from '../shared/ChartContainer';
import { REGIONAL_COMPARISON, INCOME_GROUP_COMPARISON, INTERNATIONAL_METADATA } from '@/data/internationalComparisons';

/**
 * International Comparison Panel
 * Compares Nepal with South Asian neighbors and global income groups
 */
export default function InternationalComparison() {
  // Transform regional data for charts
  const regionalData = useMemo(() => {
    return Object.entries(REGIONAL_COMPARISON).map(([country, data]) => ({
      country,
      ...data,
    }));
  }, []);

  // Transform income group data
  const incomeGroupData = useMemo(() => {
    return Object.entries(INCOME_GROUP_COMPARISON).map(([group, data]) => ({
      group,
      ...data,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> These comparisons help contextualize Nepal&apos;s development progress
          relative to regional neighbors and global income groups.
        </p>
      </div>

      {/* GDP Per Capita - Regional */}
      <ChartContainer
        title="GDP Per Capita - South Asia"
        subtitle="Current USD (2024 est.)"
        source="World Bank, IMF"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={regionalData}
      >
        <ComparativeBarChart
          data={regionalData}
          categoryKey="country"
          metrics={[
            {
              key: 'gdpPerCapita',
              label: 'GDP Per Capita (USD)',
              color: '#3b82f6',
            },
          ]}
          layout="horizontal"
          valueFormat="currency"
          height={450}
        />
      </ChartContainer>

      {/* GDP Growth - Regional */}
      <ChartContainer
        title="GDP Growth Rate - South Asia"
        subtitle="Annual % change (2024 est.)"
        source="World Bank, IMF"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={regionalData}
      >
        <ComparativeBarChart
          data={regionalData}
          categoryKey="country"
          metrics={[
            {
              key: 'gdpGrowth',
              label: 'GDP Growth (%)',
              color: '#10b981',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={450}
        />
      </ChartContainer>

      {/* Life Expectancy - Regional */}
      <ChartContainer
        title="Life Expectancy - South Asia"
        subtitle="Years at birth (2024 est.)"
        source="World Bank, WHO"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={regionalData}
      >
        <ComparativeBarChart
          data={regionalData}
          categoryKey="country"
          metrics={[
            {
              key: 'lifeExpectancy',
              label: 'Life Expectancy (Years)',
              color: '#8b5cf6',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={450}
        />
      </ChartContainer>

      {/* Literacy Rate - Regional */}
      <ChartContainer
        title="Literacy Rate - South Asia"
        subtitle="% of population ages 15+ (2024 est.)"
        source="UNESCO"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={regionalData}
      >
        <ComparativeBarChart
          data={regionalData}
          categoryKey="country"
          metrics={[
            {
              key: 'literacy',
              label: 'Literacy Rate (%)',
              color: '#f59e0b',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={450}
        />
      </ChartContainer>

      {/* Poverty - Regional */}
      <ChartContainer
        title="Poverty Rate - South Asia"
        subtitle="% below $2.15/day (2017 PPP)"
        source="World Bank"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={regionalData}
      >
        <ComparativeBarChart
          data={regionalData}
          categoryKey="country"
          metrics={[
            {
              key: 'povertyRate',
              label: 'Poverty Rate (%)',
              color: '#ef4444',
            },
          ]}
          layout="horizontal"
          valueFormat="number"
          height={450}
        />
      </ChartContainer>

      {/* Income Group Comparison - GDP Per Capita */}
      <div className="mt-12 pt-8 border-t-4 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Nepal vs Global Income Groups
        </h2>
        <p className="text-gray-600 mb-6">
          How Nepal compares to World Bank income classifications
        </p>
      </div>

      <ChartContainer
        title="GDP Per Capita by Income Group"
        subtitle="Nepal vs World Bank income classifications"
        source="World Bank"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={incomeGroupData}
      >
        <ComparativeBarChart
          data={incomeGroupData}
          categoryKey="group"
          metrics={[
            {
              key: 'gdpPerCapita',
              label: 'GDP Per Capita (USD)',
              color: '#3b82f6',
            },
          ]}
          layout="horizontal"
          valueFormat="currency"
          height={350}
        />
      </ChartContainer>

      {/* Multi-indicator comparison with income groups */}
      <ChartContainer
        title="Development Indicators by Income Group"
        subtitle="Multiple metrics comparison"
        source="World Bank"
        lastUpdated={INTERNATIONAL_METADATA.lastUpdated}
        exportData={incomeGroupData}
        height="500px"
      >
        <ComparativeBarChart
          data={incomeGroupData}
          categoryKey="group"
          metrics={[
            {
              key: 'lifeExpectancy',
              label: 'Life Expectancy (Years)',
              color: '#8b5cf6',
            },
            {
              key: 'literacy',
              label: 'Literacy Rate (%)',
              color: '#f59e0b',
            },
          ]}
          layout="vertical"
          valueFormat="number"
          height={450}
        />
      </ChartContainer>

      {/* Summary Stats */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Key International Insights
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Regional Position:</strong> Nepal&apos;s GDP per capita ($1,470) is below the South Asian
              average, ranking between Afghanistan and Pakistan in the region.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Growth Performance:</strong> At 3.8%, Nepal&apos;s growth rate is moderate compared to
              India (6.8%) and Bangladesh (5.8%), but ahead of Pakistan and Sri Lanka.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Social Progress:</strong> Life expectancy (72.1 years) and literacy (79.1%) outperform
              Pakistan and Afghanistan, approaching Bangladesh and Bhutan levels.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Income Classification:</strong> Nepal falls in the lower-middle income category,
              with metrics generally tracking above low-income but below upper-middle income countries.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span>
              <strong>Inequality & Equity:</strong> Nepal&apos;s Gini coefficient (29.7) is among the lowest
              in South Asia, indicating relatively equitable income distribution.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
