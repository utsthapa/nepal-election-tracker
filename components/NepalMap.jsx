'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PARTIES, PROVINCES, constituencies } from '../data/constituencies';
import { getHistoricalWinner, getHistoricalResults, HISTORICAL_CONSTITUENCIES } from '../data/historicalConstituencies';
import districtsData from '../public/maps/nepal-districts.geojson';
import constituenciesData from '../public/maps/nepal-constituencies.geojson';
import { getConstituencyDemographics, getYouthIndex, getDependencyRatio } from '../utils/demographicUtils';
import { X, Users, UserCheck, TrendingUp, BarChart3, Vote, ArrowRight, Search, Filter } from 'lucide-react';

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
  console.log('Trying to match:', geoId, 'Total constituencies:', Object.keys(constituencyLookup).length);
  for (const [key, value] of Object.entries(constituencyLookup)) {
    const keyParts = key.split('-');
    const district = keyParts.slice(1, -1).join('-').toLowerCase();
    const num = keyParts[keyParts.length - 1];

    if (geoIdLower.includes(district) && geoIdLower.endsWith(`-${num}`)) {
      console.log('Match found:', geoId, '=>', key);
      return value;
    }
  }
  console.log('No match for:', geoId);
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

  return { dominantParties, districtPartyCounts };
};

const { dominantParties, districtPartyCounts } = buildDistrictDominance();

function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-600',
    green: 'bg-green-500/20 text-green-600',
    yellow: 'bg-yellow-500/20 text-yellow-600',
    purple: 'bg-purple-500/20 text-purple-600'
  };

  return (
    <div className="bg-neutral/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs text-muted">{label}</span>
      </div>
      <div className="text-lg font-bold font-mono text-foreground">{value}</div>
      {subValue && (
        <div className="text-[10px] text-muted font-mono">{subValue}</div>
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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mapReady, setMapReady] = useState(false);
  const [filterProvince, setFilterProvince] = useState(null);
  const [filterWinner, setFilterWinner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('margin');

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

  const filteredConstituencies = useMemo(() => {
    let data = [...constituencies];

    if (filterProvince) {
      data = data.filter(c => c.province === filterProvince);
    }

    if (filterWinner) {
      if (year === 2026 && fptpResults) {
        data = data.filter(c => {
          const result = fptpResults[c.id];
          const winner = result?.winner || c.winner2022;
          return winner === filterWinner;
        });
      } else {
        data = data.filter(c => c.winner2022 === filterWinner);
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.district.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => {
      const marginA = year === 2026 && fptpResults && fptpResults[a.id]
        ? fptpResults[a.id]?.margin ?? a.margin
        : a.margin;
      const marginB = year === 2026 && fptpResults && fptpResults[b.id]
        ? fptpResults[b.id]?.margin ?? b.margin
        : b.margin;
      return marginA - marginB;
    });

    return data;
  }, [constituencies, filterProvince, filterWinner, searchTerm, fptpResults, year, sortBy]);

  useEffect(() => {
    console.log('Map useEffect triggered, viewMode:', viewMode);
    console.log('districtsData:', districtsData ? 'loaded' : 'null');
    console.log('constituenciesData:', constituenciesData ? 'loaded' : 'null');

    if (!districtsData || !constituenciesData) {
      console.log('Data not loaded, skipping map init');
      return;
    }

    console.log('Initializing map, viewMode:', viewMode, 'features:', constituenciesData?.features?.length);

    const initMap = async () => {
      const L = (await import('leaflet')).default;
    console.log('Leaflet loaded');

      try {
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
          const party = dominantParties[district];
          
          return {
            fillColor: party ? PARTIES[party]?.color : '#000000',
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
        if (!constituency) {
          console.log('No constituency found for:', feature.properties.constituencyId, 'Feature:', feature);
          return { fillColor: '#333333', weight: 1, opacity: 1, color: '#666666', fillOpacity: 0.8 };
        }

        const winner = getConstituencyWinner(constituency);

        return {
          fillColor: PARTIES[winner]?.color || '#000000',
          weight: 1,
          opacity: 1,
          color: '#ffffff',
          fillOpacity: 0.8,
        };
      };

      const constituencyLayer = L.geoJSON(constituenciesData, {
        style: style,
        interactive: true,
        zIndex: 1000,
        onEachFeature: (feature, layer) => {
          const constituency = matchConstituency(feature.properties.constituencyId);
          console.log('Match constituency:', feature.properties.constituencyId, '=>', constituency?.id || 'null');

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
              console.log('Click on constituency:', constituency?.id || 'null');
              if (constituency && onSelectConstituency) {
                onSelectConstituency(constituency.id);
              }
            },
          });
        },
      }).addTo(map);

      mapInstanceRef.current = map;
      districtLayerRef.current = districtLayer;
      constituencyLayerRef.current = constituencyLayer;
      setMapReady(true);
      console.log('Map initialized successfully, constituency layer features:', constituencyLayer.getLayers().length);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      console.log('Cleaning up map');
      setMapReady(false);
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      districtLayerRef.current = null;
      constituencyLayerRef.current = null;
    };
  }, [fptpResults, year, viewMode, onSelectConstituency]);

  useEffect(() => {
    if (viewMode === 'map' && mapInstanceRef.current) {
      console.log('Invalidating map size, viewMode:', viewMode);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
        console.log('Map size invalidated');
      }, 100);
    }
  }, [viewMode]);

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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {viewMode === 'map' ? 'Nepal Constituency Map' : 'Nepal Constituencies'}
          </h2>
          <div className="flex items-center gap-1 bg-neutral/50 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange?.('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-surface text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="text-xs font-medium">MAP</span>
            </button>
            <button
              onClick={() => onViewModeChange?.('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-surface text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span className="text-xs font-medium">TABLE</span>
            </button>
          </div>
        </div>
        {viewMode === 'map' && (
          <>
            <div className="text-sm text-muted">
              {constituenciesData?.features?.length} constituencies over {districtsData?.features?.length} districts
            </div>
            <div className="text-xs text-muted flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-foreground/50 border border-neutral rounded"></div>
                <span>Gray areas are protected</span>
              </div>
            </div>
          </>
        )}
      </div>

      {viewMode === 'table' && (
        <div className="bg-surface border border-neutral rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">Constituency Results</h3>
              <span className="text-xs text-muted">Sorted by margin (closest races first)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search constituency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface border border-neutral rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:border-foreground"
                />
              </div>
              <select
                value={filterProvince || ''}
                onChange={(e) => setFilterProvince(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 bg-surface border border-neutral rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="">All Provinces</option>
                {Object.entries(PROVINCES).map(([id, prov]) => (
                  <option key={id} value={id}>{prov.name}</option>
                ))}
              </select>
              <select
                value={filterWinner || ''}
                onChange={(e) => setFilterWinner(e.target.value || null)}
                className="px-3 py-2 bg-surface border border-neutral rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="">All Parties</option>
                {Object.entries(PARTIES).map(([id, party]) => (
                  <option key={id} value={id}>{party.short}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral/20 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Constituency</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">2022 Winner</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">2022 %</th>
                  {year === 2026 && (
                    <>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Sim Winner</th>
                      <th className="px-4 py-3 text-right font-semibold text-foreground">Sim %</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral">
                <AnimatePresence>
                  {filteredConstituencies.map((constituency, index) => {
                    const winner2022 = constituency.winner2022;
                    const results2022 = constituency.results2022;
                    const winner2022Share = results2022?.[winner2022] || 0;

                    let simWinner = null;
                    let simWinnerShare = 0;
                    let margin = constituency.margin;

                    if (year === 2026 && fptpResults && fptpResults[constituency.id]) {
                      const result = fptpResults[constituency.id];
                      simWinner = result?.winner;
                      const simResults = result?.adjusted || {};
                      simWinnerShare = simResults?.[simWinner] || 0;
                      margin = result?.margin || margin;
                    }

                    return (
                      <motion.tr
                        key={constituency.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.005 }}
                        onClick={() => onSelectConstituency && onSelectConstituency(constituency.id)}
                        className="hover:bg-neutral/10 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{constituency.name}</p>
                            <p className="text-xs text-muted">{constituency.district}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: PARTIES[winner2022]?.color || '#000000' }}
                            />
                            <span className="text-foreground">{PARTIES[winner2022]?.short || winner2022}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted">
                          {(winner2022Share * 100).toFixed(1)}%
                        </td>
                        {year === 2026 && (
                          <>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {simWinner && (
                                  <>
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: PARTIES[simWinner]?.color || '#000000' }}
                                    />
                                    <span className="text-foreground">{PARTIES[simWinner]?.short || simWinner}</span>
                                    {simWinner !== winner2022 && (
                                      <span className="text-others text-xs">→</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              {simWinnerShare > 0 ? `${(simWinnerShare * 100).toFixed(1)}%` : '-'}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3 text-right font-mono">
                          {margin !== undefined ? `${(margin * 100).toFixed(2)}%` : '-'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-neutral bg-neutral/30 text-xs text-muted">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1">
                <span className="text-muted">2022:</span> Actual election results
              </span>
              {year === 2026 && (
                <span className="flex items-center gap-1">
                  <span className="text-muted">Sim:</span> Current simulation projection
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="text-others">→</span> Winner changed from 2022
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={`relative bg-surface border border-neutral rounded-xl overflow-hidden ${viewMode === 'table' ? 'hidden' : ''}`}>
        <div className="relative">
          <div
            key="map-container"
            ref={mapContainerRef}
            className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
          />

          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-muted text-sm">Loading map...</p>
              </div>
            </div>
          )}

            {/* Hover Tooltip */}
            {hoveredConstituency && (
              <div
                className="fixed z-[9999] pointer-events-none"
                style={{
                  left: tooltipPos.x + 15,
                  top: tooltipPos.y - 10,
                }}
              >
                <div className="bg-surface border border-neutral rounded-xl shadow-2xl p-4 min-w-[280px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: PARTIES[getHoveredWinner(hoveredConstituency)]?.color || '#000000' }}
                    >
                      {PARTIES[getHoveredWinner(hoveredConstituency)]?.short?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-sm text-muted">Winner</div>
                      <div className="text-base font-bold text-foreground">
                        {PARTIES[getHoveredWinner(hoveredConstituency)]?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Vote Share</span>
                      <span className="text-base font-mono font-bold text-foreground">
                        {(getWinnerPercentage(hoveredConstituency) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Total Votes</span>
                      <span className="text-base font-mono font-bold text-foreground">
                        {hoveredConstituency.totalVotes?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
