'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, Trophy } from 'lucide-react';
import { SimpleHeader } from '../../../components/SimpleHeader';
import { ConstituencyResultCard } from '../../../components/ConstituencyResultCard';
import { DistrictCoalitionBuilder } from '../../../components/DistrictCoalitionBuilder';
import { PARTIES, PROVINCES, constituencies } from '../../../data/constituencies';

export default function DistrictPage() {
  const params = useParams();
  const slug = params.slug;

  // Find all constituencies for this district
  const districtConstituencies = useMemo(() => {
    return constituencies.filter(
      (c) => c.district.toLowerCase().replace(/\s+/g, '-') === slug
    );
  }, [slug]);

  // Get district info
  const districtInfo = useMemo(() => {
    if (districtConstituencies.length === 0) return null;

    const first = districtConstituencies[0];
    const winners = {};
    let totalVotes = 0;

    districtConstituencies.forEach((c) => {
      const winner = c.winner2022;
      winners[winner] = (winners[winner] || 0) + 1;
      totalVotes += c.totalVotes || 0;
    });

    return {
      name: first.district,
      province: first.province,
      provinceName: PROVINCES[first.province]?.name || `Province ${first.province}`,
      constituencies: districtConstituencies.length,
      winners,
      totalVotes,
    };
  }, [districtConstituencies]);

  // Coalition state - default to top 2 parties in district
  const [selectedParties, setSelectedParties] = useState(() => {
    if (!districtInfo) return ['NC', 'UML'];
    const sorted = Object.entries(districtInfo.winners)
      .sort((a, b) => b[1] - a[1])
      .map(([party]) => party)
      .slice(0, 2);
    return sorted.length >= 2 ? sorted : ['NC', 'UML'];
  });

  const handleToggleParty = (party) => {
    setSelectedParties((current) => {
      if (current.includes(party)) {
        return current.filter((p) => p !== party);
      }
      return [...current, party];
    });
  };

  if (!districtInfo) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/districts"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Districts
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-2">District Not Found</h1>
            <p className="text-gray-400">
              No district found with the identifier &quot;{slug}&quot;
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Get dominant party
  const dominantParty = Object.entries(districtInfo.winners).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/districts"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Districts
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{districtInfo.name}</h1>
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: PARTIES[dominantParty]?.color }}
            />
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{districtInfo.provinceName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{districtInfo.constituencies} constituencies</span>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Total Votes (2022)
            </p>
            <p className="text-xl font-bold text-white">
              {districtInfo.totalVotes.toLocaleString()}
            </p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Constituencies
            </p>
            <p className="text-xl font-bold text-white">
              {districtInfo.constituencies}
            </p>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Dominant Party
            </p>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PARTIES[dominantParty]?.color }}
              />
              <p
                className="text-xl font-bold"
                style={{ color: PARTIES[dominantParty]?.color }}
              >
                {PARTIES[dominantParty]?.short || dominantParty}
              </p>
            </div>
          </div>
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              2022 Winners
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {Object.entries(districtInfo.winners)
                .sort((a, b) => b[1] - a[1])
                .map(([party, count]) => (
                  <span
                    key={party}
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${PARTIES[party]?.color}20`,
                      color: PARTIES[party]?.color,
                    }}
                  >
                    {PARTIES[party]?.short}: {count}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Coalition Builder */}
        <div className="mb-8">
          <DistrictCoalitionBuilder
            constituencies={districtConstituencies}
            selectedParties={selectedParties}
            onToggleParty={handleToggleParty}
          />
        </div>

        {/* Constituency Results */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">
              2022 Constituency Results
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districtConstituencies.map((c) => (
              <ConstituencyResultCard
                key={c.id}
                constituency={c}
                coalitionParties={selectedParties}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
