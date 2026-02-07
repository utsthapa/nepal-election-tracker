'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PARTIES, PROVINCES, constituencies } from '../data/constituencies';
import { getHistoricalWinner, getHistoricalResults, HISTORICAL_CONSTITUENCIES } from '../data/historicalConstituencies';
import districtsData from '../public/maps/nepal-districts.geojson';
import constituenciesData from '../public/maps/nepal-constituencies.geojson';
import { getConstituencyDemographics, getYouthIndex, getDependencyRatio } from '../utils/demographicUtils';
import { X, Users, UserCheck, TrendingUp, BarChart3, Vote, ArrowRight } from 'lucide-react';

const buildConstituencyLookup = () => {
  const lookup = {};
  constituencies.forEach(c => {
    const id = c.id;
    lookup[id] = c;
  });
  return lookup;
};

const constituencyLookup = buildConstituencyLookup();

const matchConstituency = (geoId) => {
  const geoIdLower = geoId.toLowerCase();
  for (const [key, value] of Object.entries(constituencyLookup)) {
    const keyParts = key.split('-');
    const district = keyParts.slice(1, -1).join('-').toLowerCase();
    const num = keyParts[keyParts.length - 1];
    
    if (geoIdLower.includes(district) && geoIdLower.endsWith(`-${num}`)) {
      return value;
    }
  }
  return null;
};

const buildDistrictDominance = () => {
  const districtPartyCounts = {};
  
  constituencies.forEach(c => {
    const district = c.district;
    if (!districtPartyCounts[district]) {
      districtPartyCounts[district] = {};
    }
    const winner = c.winner2022;
    districtPartyCounts[district][winner] = (districtPartyCounts[district][winner] || 0) + 1;
  });
  
  const dominantParties = {};
  for (const [district, parties] of Object.entries(districtPartyCounts)) {
    dominantParties[district] = Object.entries(parties)
      .sort((a, b) => b[1] - a[1])[0][0];
  }
  
  return dominantParties;
};

const districtDominance = buildDistrictDominance();

function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <div className="bg-neutral/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-lg font-bold font-mono text-white">{value}</div>
      {subValue && (
        <div className="text-[10px] text-gray-500 font-mono">{subValue}</div>
      )}
    </div>
  );
}

export default function NepalMap({
  fptpResults = null,
  onSelectConstituency,
  viewMode = 'map',
  onViewModeChange,
  year = 2022,
}) {
  const [hoveredConstituency, setHoveredConstituency] = useState(null);
  const [selectedConstituencyDetail, setSelectedConstituencyDetail] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const districtLayerRef = useRef(null);
  const constituencyLayerRef = useRef(null);

  const getConstituencyWinner = useMemo(() => (constituency) => {
    if (year === 2026 && fptpResults && fptpResults[constituency.id]) {
      const result = fptpResults[constituency.id];
      return result?.winner || constituency.winner2022;
    }
    if (year !== 2022) {
      return getHistoricalWinner(year, constituency.id);
    }
    return constituency.winner2022;
  }, [fptpResults, year]);

  const getConstituencyResults = useMemo(() => (constituency) => {
    if (year === 2026 && fptpResults && fptpResults[constituency.id]) {
      const result = fptpResults[constituency.id];
      return result?.adjusted || constituency.results2022;
    }
    if (year !== 2022) {
      return getHistoricalResults(year, constituency.id) || constituency.results2022;
    }
    return constituency.results2022;
  }, [fptpResults, year]);

  useEffect(() => {
    if (!districtsData || !constituenciesData) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        districtLayerRef.current = null;
        constituencyLayerRef.current = null;
      }
      
      const container = mapContainerRef.current;
      if (container && container._leaflet_id) {
        delete container._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center: [28.3, 84.1],
        zoom: 7,
        minZoom: 6,
        maxZoom: 12,
        maxBounds: [[26.3, 80.0], [30.5, 88.5]],
        maxBoundsViscosity: 1.0,
      });

      const districtLayer = L.geoJSON(districtsData, {
        style: (feature) => {
          const district = feature.properties.DISTRICT_MAPPED;
          const party = districtDominance[district];
          
          return {
            fillColor: party ? PARTIES[party]?.color || '#9ca3af' : '#e5e7eb',
            weight: 0.5,
            opacity: 1,
            color: '#d1d5db',
            fillOpacity: 0.15,
          };
        },
        interactive: false,
      }).addTo(map);

      const style = (feature) => {
        const constituency = matchConstituency(feature.properties.constituencyId);
        if (!constituency) return { fillColor: '#9ca3af', weight: 1, opacity: 1, color: '#ffffff', fillOpacity: 0.8 };

        const winner = getConstituencyWinner(constituency);

        return {
          fillColor: PARTIES[winner]?.color || '#9ca3af',
          weight: 1,
          opacity: 1,
          color: '#ffffff',
          fillOpacity: 0.8,
        };
      };

      const constituencyLayer = L.geoJSON(constituenciesData, {
        style: style,
        onEachFeature: (feature, layer) => {
          const constituency = matchConstituency(feature.properties.constituencyId);

          layer.on({
            mouseover: (e) => {
              if (constituency) {
                setHoveredConstituency(constituency);
                const { clientX, clientY } = e.originalEvent;
                setTooltipPos({ x: clientX, y: clientY });
              }
              e.target.setStyle({ weight: 3, color: '#ffffff' });
              e.target.bringToFront();
            },
            mouseout: (e) => {
              setHoveredConstituency(null);
              constituencyLayer.resetStyle(e.target);
            },
            mousemove: (e) => {
              const { clientX, clientY } = e.originalEvent;
              setTooltipPos({ x: clientX, y: clientY });
            },
            click: (e) => {
              if (constituency) {
                setSelectedConstituencyDetail(constituency);
                if (onSelectConstituency) {
                  onSelectConstituency(constituency);
                }
              }
            },
          });
        },
      }).addTo(map);

      mapInstanceRef.current = map;
      districtLayerRef.current = districtLayer;
      constituencyLayerRef.current = constituencyLayer;
    };

    initMap();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      districtLayerRef.current = null;
      constituencyLayerRef.current = null;
    };
  }, [getConstituencyWinner, onSelectConstituency, year]);

  const getHoveredWinner = (constituency) => {
    if (year === 2026 && fptpResults && fptpResults[constituency.id]) {
      const result = fptpResults[constituency.id];
      return result?.winner || constituency.winner2022;
    }
    if (year !== 2022) {
      return getHistoricalWinner(year, constituency.id);
    }
    return constituency.winner2022;
  };

  const getHoveredResults = (constituency) => {
    if (year === 2026 && fptpResults && fptpResults[constituency.id]) {
      const result = fptpResults[constituency.id];
      return result?.adjusted || constituency.results2022;
    }
    if (year !== 2022) {
      return getHistoricalResults(year, constituency.id) || constituency.results2022;
    }
    return constituency.results2022;
  };

  const getWinnerPercentage = (constituency) => {
    const results = getHoveredResults(constituency);
    const winner = getHoveredWinner(constituency);
    return results[winner] || 0;
  };

  const getMargin = (constituency) => {
    const results = getHoveredResults(constituency);
    const entries = Object.entries(results).sort((a, b) => b[1] - a[1]);
    if (entries.length >= 2) {
      const [firstParty, firstShare] = entries[0];
      const [secondParty, secondShare] = entries[1];
      return firstShare - secondShare;
    }
    return 0;
  };

  const DetailedDrawer = ({ constituency }) => {
    const winner = getConstituencyWinner(constituency);
    const results = getConstituencyResults(constituency);
    const margin = getMargin(constituency);
    const demographics = getConstituencyDemographics(constituency.id);
    const sortedResults = Object.entries(results).sort((a, b) => b[1] - a[1]);
    const isSimulated = year === 2026 && fptpResults && fptpResults[constituency.id];
    const winProbabilities = constituency.winProbabilities || {};

    return (
      <div className="absolute inset-y-0 right-0 w-1/2 bg-surface border-l border-neutral overflow-y-auto">
        <div className="p-4 space-y-4 h-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-outfit font-bold text-white">
                {constituency.name}
              </h3>
              <p className="text-sm text-gray-400">
                {constituency.district}, {PROVINCES[constituency.province]?.name}
              </p>
            </div>
            <button
              onClick={() => setSelectedConstituencyDetail(null)}
              className="p-1 hover:bg-neutral rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {winner && (
            <div className={`rounded-xl p-4 border ${
              isSimulated 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30' 
                : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  isSimulated ? 'text-blue-400' : 'text-amber-400'
                }`}>
                  {isSimulated ? 'Simulated' : `${year} Baseline`}
                </span>
                {constituency.isOverridden && (
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    ⚡ Manual Override
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: PARTIES[winner]?.color || '#9ca3af' }}
                >
                  {PARTIES[winner]?.short?.charAt(0) || winner.charAt(0)}
                </div>
                <div>
                  <div className="text-sm text-gray-400">Winner</div>
                  <div className="text-lg font-bold text-white">
                    {PARTIES[winner]?.name || winner}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-mono font-bold text-white">
                    {(results[winner] * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">Vote Share</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400">Margin: </span>
                  <span className={`font-mono font-bold ${
                    margin < 0.03 ? 'text-amber-400' :
                    margin < 0.05 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {(margin * 100).toFixed(2)}%
                  </span>
                </div>
                {isSimulated && winProbabilities[winner] && (
                  <div>
                    <span className="text-gray-400">Win Prob: </span>
                    <span className="font-mono font-bold text-purple-400">
                      {(winProbabilities[winner] * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Vote className="w-4 h-4" />
              Vote Share Results
            </h4>
            <div className="bg-neutral/30 rounded-lg p-3 space-y-2">
              {sortedResults.slice(0, 8).map(([party, share]) => (
                <div key={party} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PARTIES[party]?.color || '#9ca3af' }}
                    />
                    <span className="text-sm text-gray-300">
                      {PARTIES[party]?.name || party}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1 h-2 bg-neutral rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${share * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ backgroundColor: PARTIES[party]?.color || '#9ca3af' }}
                      />
                    </div>
                    <span className="text-sm font-mono text-gray-400">
                      {(share * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isSimulated && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Expected Voter Breakdown
              </h4>
              <div className="bg-neutral/30 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {sortedResults.slice(0, 6).map(([party, share]) => {
                    const expectedVoters = Math.round(constituency.totalVotes * share);
                    return (
                      <div key={party} className="flex items-center justify-between p-2 bg-neutral/20 rounded">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PARTIES[party]?.color || '#9ca3af' }}
                          />
                          <span className="text-gray-300">
                            {PARTIES[party]?.short || party}
                          </span>
                        </div>
                        <span className="font-mono text-gray-400">
                          {expectedVoters.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {demographics && (
            <>
              {year !== 2022 && year !== 2026 && (
                <div className="mb-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-xs text-amber-300">
                    ⚠️ Demographic data is from 2021 Census and may not accurately reflect the population in {year}. Use for reference only.
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  Demographics {year !== 2022 && year !== 2026 && (
                    <span className="text-xs font-normal text-amber-400">
                      (From 2021 Census - may not reflect {year} reality)
                    </span>
                  )}
                  {year === 2022 && (
                    <span className="text-xs font-normal text-gray-500">
                      (Census 2021)
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    icon={Users}
                    label="Population (2021)"
                    value={demographics.estimatedPopulation.toLocaleString()}
                    subValue={`M: ${demographics.male.toLocaleString()} | F: ${demographics.female.toLocaleString()}`}
                    color="blue"
                  />
                  <StatCard
                    icon={UserCheck}
                    label="Voting Age (18+)"
                    value={demographics.voterEligible.toLocaleString()}
                    subValue={`${((demographics.voterEligible / demographics.estimatedPopulation) * 100).toFixed(2)}%`}
                    color="green"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Age Distribution</h4>
                <div className="bg-neutral/30 rounded-lg p-3">
                  <div className="space-y-2">
                    {Object.entries(demographics.ageGroups).map(([group, data]) => (
                      <div key={group} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-20">
                          {data.label}
                        </span>
                        <div className="flex-1 h-5 bg-neutral/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${data.percentage * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded"
                            style={{ backgroundColor: data.color }}
                          />
                        </div>
                        <span className="text-xs font-mono text-gray-300 w-12 text-right">
                          {(data.percentage * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-neutral/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold font-mono text-green-400">
                    {(getYouthIndex(demographics.ageGroups) * 100).toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-gray-500">Youth Index</div>
                  <div className="text-[9px] text-gray-600">(Under 30)</div>
                </div>
                <div className="bg-neutral/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold font-mono text-yellow-400">
                    {demographics.medianAge}
                  </div>
                  <div className="text-[10px] text-gray-500">Median Age</div>
                  <div className="text-[9px] text-gray-600">(years)</div>
                </div>
                <div className="bg-neutral/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold font-mono text-purple-400">
                    {(getDependencyRatio(demographics.ageGroups) * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-gray-500">Dependency</div>
                  <div className="text-[9px] text-gray-600">(0-14 + 60+)</div>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-neutral space-y-2">
            <div className="text-xs text-gray-500">
              <strong>{year === 2026 ? '2022 Winner' : `${year} Winner`}:</strong> {PARTIES[constituency.winner2022]?.name || constituency.winner2022}
            </div>
            <div className="text-xs text-gray-500">
              <strong>Total Votes:</strong> {constituency.totalVotes?.toLocaleString()}
            </div>
            {constituency.margin && (
              <div className="text-xs text-gray-500">
                <strong>{year === 2026 ? '2022 Margin' : `${year} Margin`}:</strong> {(constituency.margin * 100).toFixed(2)}%
              </div>
            )}
            {constituency.wikipediaUrl && (
              <a
                href={constituency.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                View on Wikipedia <ArrowRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">
            {viewMode === 'map' ? 'Nepal Constituency Map' : 'Nepal Constituencies'}
          </h2>
          <div className="flex items-center gap-1 bg-neutral/50 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange?.('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-surface text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-medium">MAP</span>
            </button>
            <button
              onClick={() => onViewModeChange?.('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-surface text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-medium">TABLE</span>
            </button>
          </div>
        </div>
        {viewMode === 'map' && (
          <div className="text-sm text-gray-400">
            {constituenciesData?.features?.length} constituencies over {districtsData?.features?.length} districts
          </div>
        )}
      </div>

      {viewMode === 'map' && (
        <div className="relative bg-surface border border-neutral rounded-xl overflow-hidden">
          <div className="relative">
            <div
              ref={mapContainerRef}
              className={`w-full h-[600px] transition-all duration-300 ${
                selectedConstituencyDetail ? 'w-1/2' : 'w-full'
              }`}
            />

            {hoveredConstituency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed z-[1000] pointer-events-none"
                style={{
                  left: tooltipPos.x + 15,
                  top: tooltipPos.y - 10,
                }}
              >
                <div className="bg-white/95 backdrop-blur border border-gray-300 rounded-lg shadow-xl p-4 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: PARTIES[getHoveredWinner(hoveredConstituency)]?.color || '#9ca3af',
                      }}
                    />
                    <span className="font-semibold text-gray-900">
                      {hoveredConstituency.name}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {PROVINCES[hoveredConstituency.province]?.name}
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    Total Votes: {hoveredConstituency.totalVotes?.toLocaleString()}
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <p className="text-xs font-medium mb-2 text-gray-700">Results</p>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: PARTIES[getHoveredWinner(hoveredConstituency)]?.color }}>
                        {PARTIES[getHoveredWinner(hoveredConstituency)]?.short || getHoveredWinner(hoveredConstituency)}
                      </span>
                      <span className="text-gray-600">
                        Winner ({(getWinnerPercentage(hoveredConstituency) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {selectedConstituencyDetail && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-y-0 right-0"
                  >
                    <DetailedDrawer constituency={selectedConstituencyDetail} />
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
