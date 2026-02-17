'use client';

import {
  ArrowLeft,
  MapPin,
  Users,
  Trophy,
  BarChart3,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ConstituencyResultCard } from '../../../components/ConstituencyResultCard';
import { DistrictCoalitionBuilder } from '../../../components/DistrictCoalitionBuilder';
import { PartySliders } from '../../../components/PartySliders';
import { PARTIES, INITIAL_NATIONAL } from '../../../data/constituencies';
import { AGE_GROUP_LABELS } from '../../../data/demographics';
import {
  adjustZeroSumSliders,
  calculateAdjustedResults,
  determineFPTPWinner,
} from '../../../utils/calculations';
import { getYouthIndex, getDependencyRatio, getAgeGroupColor } from '../../../utils/demographicUtils';

const orderedParties = Object.keys(INITIAL_NATIONAL);
const blankSeats = orderedParties.reduce((acc, party) => {
  acc[party] = 0;
  return acc;
}, {});

export default function DistrictPageClient({ district, demographics }) {
  const sliderBaseline = useMemo(() => {
    const baseline = { ...blankSeats, ...district.baselineShare };
    const sum = Object.values(baseline).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      orderedParties.forEach((party) => {
        baseline[party] = (baseline[party] / sum) * 100;
      });
    }
    return baseline;
  }, [district.baselineShare]);

  const initialParties = useMemo(() => {
    const sorted = Object.entries(district.winners || {})
      .sort((a, b) => b[1] - a[1])
      .map(([party]) => party)
      .slice(0, 2);
    return sorted.length >= 2 ? sorted : ['NC', 'UML'];
  }, [district.winners]);

  const [selectedParties, setSelectedParties] = useState(initialParties);
  const [sliders, setSliders] = useState(sliderBaseline);

  const projected = useMemo(() => {
    const seatCounts = { ...blankSeats };
    const results = district.constituencies.map((seat) => {
      const adjusted = calculateAdjustedResults(
        seat.results2022,
        sliders,
        sliderBaseline
      );
      const { winner, margin } = determineFPTPWinner(adjusted);
      seatCounts[winner] = (seatCounts[winner] || 0) + 1;
      return {
        ...seat,
        projectedWinner: winner,
        projectedMargin: margin,
        adjustedResults: adjusted,
      };
    });

    return { seatCounts, results };
  }, [district.constituencies, sliders, sliderBaseline]);

  const projectedLeader = useMemo(() => {
    return Object.entries(projected.seatCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [projected.seatCounts]);

  const flips = useMemo(() => {
    return projected.results.filter((seat) => seat.projectedWinner !== seat.winner2022).length;
  }, [projected.results]);

  const dominantParty = useMemo(() => {
    return Object.entries(district.winners)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [district.winners]);

  const handleSliderChange = (party, value) => {
    setSliders((current) => adjustZeroSumSliders(current, party, value));
  };

  const handleToggleParty = (party) => {
    setSelectedParties((current) => {
      if (current.includes(party)) {
        return current.filter((p) => p !== party);
      }
      if (current.length >= 4) {return current;}
      return [...current, party];
    });
  };

  const baselineTopShare = useMemo(() => {
    return Object.entries(sliderBaseline).sort((a, b) => b[1] - a[1])[0];
  }, [sliderBaseline]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/districts"
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Districts
      </Link>

      {/* Hero */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">{district.name}</h1>
          {dominantParty && (
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold border border-white/10"
              style={{
                color: PARTIES[dominantParty]?.color,
                backgroundColor: `${PARTIES[dominantParty]?.color}20`,
              }}
            >
              {PARTIES[dominantParty]?.short} led 2022
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-gray-700">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{district.provinceName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{district.constituencies.length} constituencies</span>
          </div>
          {baselineTopShare && (
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm text-gray-700">
                {PARTIES[baselineTopShare[0]]?.short || baselineTopShare[0]} averaged {baselineTopShare[1].toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-700 mt-3 max-w-3xl">
          Review the 2022 winners, see which candidates topped each seat, and tune the sliders to
          model how small swings could reshape this district&apos;s map.
        </p>
      </section>

      {/* Sliders + quick summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-5 h-5 text-nc" />
            <div>
              <h2 className="text-xl font-semibold text-white">District vote-share sliders</h2>
              <p className="text-xs text-gray-800">Grounded in 2022 constituency results for this district</p>
            </div>
          </div>
          <PartySliders
            title="Adjust local swing"
            subtitle="Shift 2022 vote shares to see how seats move"
            sliders={sliders}
            fptpSeats={projected.seatCounts}
            prSeats={blankSeats}
            totalSeats={projected.seatCounts}
            onSliderChange={handleSliderChange}
            showFptp
          />
        </div>

        <div className="bg-surface border border-neutral rounded-xl p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-800 mb-1">2022 winners</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(district.winners)
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([party, count]) => (
                  <span
                    key={party}
                    className="px-2 py-1 rounded-lg text-xs font-semibold border"
                    style={{
                      color: PARTIES[party]?.color,
                      borderColor: `${PARTIES[party]?.color}50`,
                      backgroundColor: `${PARTIES[party]?.color}15`,
                    }}
                  >
                    {PARTIES[party]?.short || party}: {count}
                  </span>
                ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-sm text-gray-700">Slider projection</span>
              </div>
              {projectedLeader && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    color: PARTIES[projectedLeader]?.color,
                    backgroundColor: `${PARTIES[projectedLeader]?.color}20`,
                  }}
                >
                  {PARTIES[projectedLeader]?.short || projectedLeader}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-gray-800 mb-1">Projected seats</p>
                <p className="text-2xl font-bold text-white">
                  {Object.values(projected.seatCounts).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-800 mb-1">Potential flips</p>
                <p className="text-2xl font-bold text-white">{flips}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral bg-neutral/40 p-4">
            <p className="text-xs text-gray-800 mb-1">Turnout (2022)</p>
            <p className="text-xl font-semibold text-white">
              {district.totalVotes ? district.totalVotes.toLocaleString() : '—'} votes cast
            </p>
            <p className="text-[11px] text-gray-800 mt-1">
              Based on official totals per constituency
            </p>
          </div>
        </div>
      </section>

      {/* Coalition builder */}
      <section className="mb-10">
        <DistrictCoalitionBuilder
          constituencies={district.constituencies}
          selectedParties={selectedParties}
          onToggleParty={handleToggleParty}
        />
      </section>

      {/* Demographics */}
      {demographics && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">District demographics</h2>
            <span className="text-xs text-gray-800 ml-2">Census 2021</span>
          </div>

          <div className="bg-surface border border-neutral rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-800 mb-1">Population</p>
                <p className="text-xl font-bold text-white">{demographics.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-800 mb-1">Median Age</p>
                <p className="text-xl font-bold text-white">{demographics.medianAge} years</p>
              </div>
              <div>
                <p className="text-xs text-gray-800 mb-1">Literacy Rate</p>
                <p className="text-xl font-bold text-white">{(demographics.literacyRate * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-800 mb-1">Urban Population</p>
                <p className="text-xl font-bold text-white">{(demographics.urbanPopulation * 100).toFixed(2)}%</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Age Distribution</p>
              <div className="space-y-2">
                {Object.entries(demographics.ageGroups).map(([group, pct]) => (
                  <div key={group}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-700">{AGE_GROUP_LABELS[group]}</span>
                      <span className="text-xs font-mono text-gray-700">{(pct * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-4 bg-neutral/50 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${pct * 100}%`,
                          backgroundColor: getAgeGroupColor(group),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-neutral/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-green-400">{(getYouthIndex(demographics.ageGroups) * 100).toFixed(2)}%</p>
                <p className="text-[10px] text-gray-800">Youth Index (Under 30)</p>
              </div>
              <div className="bg-neutral/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-blue-400">{(demographics.voterEligible * 100).toFixed(2)}%</p>
                <p className="text-[10px] text-gray-800">Voting Age (18+)</p>
              </div>
              <div className="bg-neutral/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-purple-400">{(getDependencyRatio(demographics.ageGroups) * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-gray-800">Dependency Ratio</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Constituency cards */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-semibold text-white">Constituency detail</h2>
          <span className="text-xs text-gray-800">
            Winning candidates and projected slider outcome
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projected.results.map((seat) => (
            <ConstituencyResultCard
              key={seat.id}
              constituency={seat}
              coalitionParties={selectedParties}
              projection={{
                winner: seat.projectedWinner,
                margin: seat.projectedMargin,
                results: seat.adjustedResults,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
