'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users } from 'lucide-react';
import { SimpleHeader } from '../../components/SimpleHeader';
import { PARTIES, PROVINCES, constituencies } from '../../data/constituencies';

export default function DistrictsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique districts with aggregated data
  const districts = useMemo(() => {
    const districtMap = {};

    constituencies.forEach((c) => {
      const districtName = c.district;
      if (!districtMap[districtName]) {
        districtMap[districtName] = {
          name: districtName,
          slug: districtName.toLowerCase().replace(/\s+/g, '-'),
          province: c.province,
          constituencies: [],
          winners: {},
        };
      }
      districtMap[districtName].constituencies.push(c);
      const winner = c.winner2022;
      districtMap[districtName].winners[winner] =
        (districtMap[districtName].winners[winner] || 0) + 1;
    });

    return Object.values(districtMap).sort((a, b) => {
      if (a.province !== b.province) return a.province - b.province;
      return a.name.localeCompare(b.name);
    });
  }, []);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    const query = searchQuery.toLowerCase();
    return districts.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        PROVINCES[d.province]?.name.toLowerCase().includes(query)
    );
  }, [districts, searchQuery]);

  // Group by province
  const groupedByProvince = useMemo(() => {
    const groups = {};
    filteredDistricts.forEach((d) => {
      if (!groups[d.province]) {
        groups[d.province] = [];
      }
      groups[d.province].push(d);
    });
    return groups;
  }, [filteredDistricts]);

  // Get dominant party for a district
  const getDominantParty = (winners) => {
    let maxWins = 0;
    let dominant = null;
    Object.entries(winners).forEach(([party, wins]) => {
      if (wins > maxWins) {
        maxWins = wins;
        dominant = party;
      }
    });
    return dominant;
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Districts</h1>
          <p className="text-gray-400">
            Explore all 77 districts of Nepal with 2022 election results
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search districts or provinces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-neutral rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-nc/50 transition-colors"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {filteredDistricts.length} of {districts.length} districts shown
          </p>
        </div>

        {/* Districts grouped by province */}
        {Object.entries(groupedByProvince).map(([provinceNum, provinceDistricts]) => (
          <div key={provinceNum} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-nc" />
              <h2 className="text-xl font-semibold text-white">
                {PROVINCES[provinceNum]?.name || `Province ${provinceNum}`}
              </h2>
              <span className="text-sm text-gray-500 font-mono">
                {provinceDistricts.length} districts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {provinceDistricts.map((district) => {
                const dominantParty = getDominantParty(district.winners);
                const partyInfo = PARTIES[dominantParty];

                return (
                  <Link
                    key={district.slug}
                    href={`/districts/${district.slug}`}
                    className="group bg-surface border border-neutral rounded-xl p-4 hover:border-nc/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white group-hover:text-nc transition-colors">
                        {district.name}
                      </h3>
                      {dominantParty && (
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: partyInfo?.color }}
                        />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Constituencies</span>
                        <span className="font-mono text-white">
                          {district.constituencies.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">2022 Winners</span>
                        <div className="flex items-center gap-1">
                          {Object.entries(district.winners)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([party, count]) => (
                              <span
                                key={party}
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${PARTIES[party]?.color}20`,
                                  color: PARTIES[party]?.color,
                                }}
                              >
                                {PARTIES[party]?.short || party}: {count}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral">
                      <span className="text-xs text-nc group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {filteredDistricts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No districts found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </main>
    </div>
  );
}
