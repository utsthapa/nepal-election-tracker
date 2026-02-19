'use client';

import dynamic from 'next/dynamic';

const DemographicsNational = dynamic(
  () => import('@/components/nepal-data/panels/DemographicsNational'),
  { ssr: false }
);
const EnergyEnvironmentPanel = dynamic(
  () => import('@/components/nepal-data/panels/EnergyEnvironmentPanel'),
  { ssr: false }
);
const ExternalSectorPanel = dynamic(
  () => import('@/components/nepal-data/panels/ExternalSectorPanel'),
  { ssr: false }
);
const InternationalComparison = dynamic(
  () => import('@/components/nepal-data/panels/InternationalComparison'),
  { ssr: false }
);
const MacroOverview = dynamic(() => import('@/components/nepal-data/panels/MacroOverview'), {
  ssr: false,
});
const PovertyPanel = dynamic(() => import('@/components/nepal-data/panels/PovertyPanel'), {
  ssr: false,
});
const ProvincialComparison = dynamic(
  () => import('@/components/nepal-data/panels/ProvincialComparison'),
  { ssr: false }
);
const TourismPanel = dynamic(() => import('@/components/nepal-data/panels/TourismPanel'), {
  ssr: false,
});

export {
  DemographicsNational,
  EnergyEnvironmentPanel,
  ExternalSectorPanel,
  InternationalComparison,
  MacroOverview,
  PovertyPanel,
  ProvincialComparison,
  TourismPanel,
};
