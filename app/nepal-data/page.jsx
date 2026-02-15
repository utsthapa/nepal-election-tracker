import Link from 'next/link';
import Header from '@/components/Header';
import PageHeader from '@/components/nepal-data/shared/PageHeader';
import QuickStatsBar from '@/components/nepal-data/shared/QuickStatsBar';
import CollapsibleSection from '@/components/nepal-data/shared/CollapsibleSection';
import DataSources from '@/components/nepal-data/shared/DataSources';
import MacroOverview from '@/components/nepal-data/panels/MacroOverview';
import ExternalSectorPanel from '@/components/nepal-data/panels/ExternalSectorPanel';
import DemographicsNational from '@/components/nepal-data/panels/DemographicsNational';
import PovertyPanel from '@/components/nepal-data/panels/PovertyPanel';
import TourismPanel from '@/components/nepal-data/panels/TourismPanel';
import EnergyEnvironmentPanel from '@/components/nepal-data/panels/EnergyEnvironmentPanel';
import ProvincialComparison from '@/components/nepal-data/panels/ProvincialComparison';
import InternationalComparison from '@/components/nepal-data/panels/InternationalComparison';
import { MACRO_INDICATORS, EXTERNAL_SECTOR, DATA_METADATA } from '@/data/nepalMacroData';

/**
 * Nepal Macro Data Dashboard
 * Comprehensive visualization of economic, social, and development indicators
 */
export const metadata = {
  title: 'Nepal Macro Data Dashboard - Economic & Development Indicators',
  description: 'Explore Nepal\'s economic indicators including GDP, inflation, trade, remittances, poverty, and more. Interactive charts and time series analysis from 2010-2024.',
  keywords: 'Nepal economy, GDP, inflation, remittances, trade, poverty, development indicators, economic data',
};

export default function NepalDataPage() {
  // Latest year index (2024)
  const latestIdx = 14;

  // Quick stats for summary bar
  const quickStats = [
    {
      label: 'GDP Growth (2024)',
      value: MACRO_INDICATORS.gdp.growth[latestIdx],
      unit: '%',
      change: MACRO_INDICATORS.gdp.growth[latestIdx] - MACRO_INDICATORS.gdp.growth[latestIdx - 1],
      reverseColors: false,
    },
    {
      label: 'GDP Per Capita',
      value: `$${MACRO_INDICATORS.gdp.perCapita[latestIdx].toLocaleString()}`,
      unit: '',
      change: ((MACRO_INDICATORS.gdp.perCapita[latestIdx] - MACRO_INDICATORS.gdp.perCapita[latestIdx - 1]) / MACRO_INDICATORS.gdp.perCapita[latestIdx - 1]) * 100,
      reverseColors: false,
    },
    {
      label: 'Inflation Rate',
      value: MACRO_INDICATORS.inflation.annual[latestIdx],
      unit: '%',
      change: MACRO_INDICATORS.inflation.annual[latestIdx] - MACRO_INDICATORS.inflation.annual[latestIdx - 1],
      reverseColors: true,
    },
    {
      label: 'Remittances',
      value: `$${EXTERNAL_SECTOR.remittances.received[latestIdx]}`,
      unit: 'B',
      change: ((EXTERNAL_SECTOR.remittances.received[latestIdx] - EXTERNAL_SECTOR.remittances.received[latestIdx - 1]) / EXTERNAL_SECTOR.remittances.received[latestIdx - 1]) * 100,
      reverseColors: false,
    },
  ];

  // Data sources for attribution
  const dataSources = [
    {
      name: 'World Bank Open Data',
      url: 'https://data.worldbank.org/country/nepal',
      description: 'GDP, poverty, demographics, and development indicators',
    },
    {
      name: 'Nepal Rastra Bank',
      url: 'https://www.nrb.org.np/',
      description: 'Monetary policy, inflation, foreign exchange, and financial sector data',
    },
    {
      name: 'International Monetary Fund (IMF)',
      url: 'https://www.imf.org/en/Countries/NPL',
      description: 'Fiscal balance, public debt, and macroeconomic projections',
    },
    {
      name: 'National Statistics Office Nepal',
      url: 'https://cbs.gov.np/',
      description: 'Population census, household surveys, and national accounts',
    },
    {
      name: 'Nepal Tourism Board',
      url: 'https://www.welcomenepal.com/',
      description: 'Tourist arrivals, tourism receipts, and visitor statistics',
    },
    {
      name: 'FRED Economic Data',
      url: 'https://fred.stlouisfed.org/tags/series?t=nepal',
      description: 'Time series economic data from Federal Reserve',
    },
  ];

  const methodologyNotes = [
    'All GDP values are in current USD unless otherwise specified',
    'Growth rates represent annual percentage changes',
    'Poverty rates use World Bank poverty lines (2017 PPP)',
    'Provincial data are estimates based on available government reports',
    'Some historical data points are interpolated where official data is unavailable',
    'Data is updated annually based on official releases from source organizations',
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <PageHeader
            title="Nepal Macro Data Dashboard"
            description="Comprehensive visualization of Nepal's economic, social, and development indicators. Explore GDP growth, inflation, trade, remittances, poverty, demographics, and more through interactive charts and time series analysis."
            lastUpdated={DATA_METADATA.lastUpdated}
          />

          {/* Quick Stats Bar */}
          <QuickStatsBar stats={quickStats} />

          {/* Main Content - Collapsible Sections */}
          <div className="space-y-6">
            {/* Macroeconomic Indicators */}
            <CollapsibleSection
              id="macro-indicators"
              title="Macroeconomic Indicators"
              subtitle="GDP, inflation, employment, and fiscal metrics"
              defaultExpanded={true}
            >
              <MacroOverview />
            </CollapsibleSection>

            {/* External Sector */}
            <CollapsibleSection
              id="external-sector"
              title="External Sector"
              subtitle="Trade, remittances, current account, and foreign investment"
              defaultExpanded={true}
            >
              <ExternalSectorPanel />
            </CollapsibleSection>

            {/* Demographics */}
            <CollapsibleSection
              id="demographics"
              title="Demographics (National)"
              subtitle="Population, life expectancy, urbanization, and literacy"
              defaultExpanded={false}
            >
              <DemographicsNational />
            </CollapsibleSection>

            {/* Poverty & Inequality */}
            <CollapsibleSection
              id="poverty"
              title="Poverty & Inequality"
              subtitle="Poverty rates, Gini index, and income distribution"
              defaultExpanded={false}
            >
              <PovertyPanel />
            </CollapsibleSection>

            {/* Tourism */}
            <CollapsibleSection
              id="tourism"
              title="Tourism"
              subtitle="Annual arrivals, monthly patterns, and source countries"
              defaultExpanded={false}
            >
              <TourismPanel />
            </CollapsibleSection>

            {/* Energy & Environment */}
            <CollapsibleSection
              id="energy-environment"
              title="Energy & Environment"
              subtitle="Electricity access, CO2 emissions, and renewable energy"
              defaultExpanded={false}
            >
              <EnergyEnvironmentPanel />
            </CollapsibleSection>

            {/* Provincial Comparison */}
            <CollapsibleSection
              id="provincial-comparison"
              title="Provincial Comparison"
              subtitle="Compare metrics across Nepal's 7 provinces"
              defaultExpanded={false}
            >
              <ProvincialComparison />
            </CollapsibleSection>

            {/* International Comparison */}
            <CollapsibleSection
              id="international-comparison"
              title="International Comparison"
              subtitle="Nepal vs South Asian neighbors and income groups"
              defaultExpanded={false}
            >
              <InternationalComparison />
            </CollapsibleSection>
          </div>

          {/* Data Sources & Methodology */}
          <DataSources sources={dataSources} notes={methodologyNotes} />

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              This dashboard is part of the Nepal Election Simulator project.{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
                Return to homepage
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
