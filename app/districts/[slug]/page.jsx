import { notFound } from 'next/navigation';
import DistrictPageClient from './DistrictPageClient';
import { SimpleHeader } from '../../../components/SimpleHeader';
import { constituencies, INITIAL_NATIONAL, PARTIES, PROVINCES } from '../../../data/constituencies';
import { DISTRICT_DEMOGRAPHICS } from '../../../data/demographics';

const slugifyDistrict = (name) => name.toLowerCase().replace(/\s+/g, '-');
const orderedParties = Object.keys(INITIAL_NATIONAL);

const buildBaselineShare = (seats) => {
  const totals = orderedParties.reduce((acc, party) => {
    acc[party] = 0;
    return acc;
  }, {});

  let voteTotal = 0;

  seats.forEach((seat) => {
    const votes = seat.totalVotes || 0;
    voteTotal += votes || 1;
    orderedParties.forEach((party) => {
      totals[party] += (seat.results2022?.[party] || 0) * (votes || 1);
    });
  });

  if (voteTotal <= 0) {
    voteTotal = seats.length || 1;
  }

  const baseline = {};
  orderedParties.forEach((party) => {
    baseline[party] = (totals[party] / voteTotal) * 100;
  });

  const sum = Object.values(baseline).reduce((a, b) => a + b, 0);
  if (sum > 0) {
    orderedParties.forEach((party) => {
      baseline[party] = (baseline[party] / sum) * 100;
    });
  }

  return baseline;
};

const getDistrictData = (slug) => {
  const districtSeats = constituencies.filter(
    (c) => slugifyDistrict(c.district) === slug
  );

  if (districtSeats.length === 0) return null;

  const winners = orderedParties.reduce((acc, party) => {
    acc[party] = 0;
    return acc;
  }, {});

  let totalVotes = 0;

  districtSeats.forEach((seat) => {
    const winner = seat.winner2022;
    winners[winner] = (winners[winner] || 0) + 1;
    totalVotes += seat.totalVotes || 0;
  });

  const name = districtSeats[0].district;
  const province = districtSeats[0].province;
  const provinceName = PROVINCES[province]?.name || `Province ${province}`;

  return {
    name,
    slug,
    province,
    provinceName,
    constituencies: districtSeats,
    totalVotes,
    winners,
    baselineShare: buildBaselineShare(districtSeats),
  };
};

export function generateStaticParams() {
  const seen = new Set();
  constituencies.forEach((c) => {
    seen.add(slugifyDistrict(c.district));
  });

  return Array.from(seen).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const data = getDistrictData(params.slug);

  if (!data) {
    return {
      title: 'District not found | Nepal Election Simulator',
      description: 'No district found for this route.',
    };
  }

  const sortedWinners = Object.entries(data.winners).sort((a, b) => b[1] - a[1]);
  const leadingParty = sortedWinners[0]?.[0];
  const leadingSeats = sortedWinners[0]?.[1] || 0;
  const partyName = leadingParty ? PARTIES[leadingParty]?.name || leadingParty : 'Leading party';

  const title = `${data.name} Election Results 2022 | Nepal Election Simulator`;
  const description = `${data.name} district in ${data.provinceName}: ${data.constituencies.length} constituencies, ${partyName} won ${leadingSeats} seat${leadingSeats === 1 ? '' : 's'} in 2022. Explore winning candidates and tune district vote-share sliders.`;
  const url = `/districts/${data.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function DistrictPage({ params }) {
  const districtData = getDistrictData(params.slug);

  if (!districtData) {
    notFound();
  }

  const demographics = DISTRICT_DEMOGRAPHICS[districtData.name] || null;
  const leadEntry = Object.entries(districtData.winners).sort((a, b) => b[1] - a[1])[0];
  const url = `/districts/${districtData.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${districtData.name} district election results (2022)`,
    description: `Last election winners and candidates across ${districtData.constituencies.length} constituencies in ${districtData.name}.`,
    spatialCoverage: {
      '@type': 'AdministrativeArea',
      name: districtData.name,
      parentArea: districtData.provinceName,
    },
    measurementTechnique: 'First-past-the-post (165 seats) • House of Representatives 2022',
    variableMeasured: ['voteShare', 'winner', 'candidate'],
    creator: {
      '@type': 'Organization',
      name: 'Nepal Election Simulator',
    },
    datasetTimeInterval: '2022',
    keywords: [
      'Nepal election',
      districtData.name,
      districtData.provinceName,
      'House of Representatives',
    ],
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: url,
    },
    mainEntity: leadEntry
      ? {
          '@type': 'Thing',
          name: PARTIES[leadEntry[0]]?.name || leadEntry[0],
          additionalType: 'PoliticalParty',
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <DistrictPageClient district={districtData} demographics={demographics} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
