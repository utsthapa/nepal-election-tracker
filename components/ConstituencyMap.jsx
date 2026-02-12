'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { constituencies, PARTIES, PROVINCES } from '../data/constituencies';
import { MAP_CONFIG } from '../lib/config';
import 'leaflet/dist/leaflet.css';

const ConstituencyMap = ({
  onSelectConstituency,
  selectedConstituencyId,
  fptpResults
}) => {
  const [geoData, setGeoData] = useState(null);
  const [hoveredConstituency, setHoveredConstituency] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  // Build lookup map for constituency data
  // GeoJSON uses "District-Number" format (e.g., "Taplejung-1")
  // Our data uses "P{province}-{district}-{number}" format (e.g., "P1-Taplejung-1")
  const constituencyLookup = useMemo(() => {
    const lookup = {};
    constituencies.forEach(c => {
      // Extract number from name (e.g., "Bhojpur 1" -> 1)
      const match = c.name.match(/(\d+)$/);
      const constNum = match ? parseInt(match[1]) : 1;
      // Create key matching GeoJSON format: "District-Number"
      const key = `${c.district}-${constNum}`;
      lookup[key] = c;
    });
    return lookup;
  }, []);

  // Get constituency data for a GeoJSON feature
  const getConstituencyData = useCallback((feature) => {
    const key = feature.properties?.constituencyId;
    return key ? constituencyLookup[key] : null;
  }, [constituencyLookup]);

  // Get color for a constituency
  const getColor = useCallback((feature) => {
    const constData = getConstituencyData(feature);
    if (!constData) {
      // Fallback black for unmatched constituencies
      return '#000000';
    }

    let winner;
    if (fptpResults && fptpResults[constData.id]) {
      // fptpResults is an object keyed by constituency ID
      const result = fptpResults[constData.id];
      winner = result?.winner || constData.winner2022;
    } else {
      winner = constData.winner2022;
    }

    return PARTIES[winner]?.color || '#000000';
  }, [getConstituencyData, fptpResults]);

  // Nepal outline for background
  const [outlineData, setOutlineData] = useState(null);

  // Load GeoJSON data (both constituencies and outline)
  useEffect(() => {
    // Load both in parallel
    let mounted = true;

    Promise.all([
      fetch('/maps/nepal-constituencies.geojson').then(res => {
        if (!res.ok) throw new Error('Failed to fetch constituencies GeoJSON');
        return res.json();
      }),
      fetch('/maps/nepal-outline.geojson').then(res => {
        if (!res.ok) throw new Error('Failed to fetch outline GeoJSON');
        return res.json();
      })
    ])
      .then(([constituenciesData, outlineGeoJson]) => {
        if (mounted) {
          setOutlineData(outlineGeoJson);
          setGeoData(constituenciesData);
        }
      })
      .catch(err => {
        if (mounted) {
          if (process.env.NODE_ENV === 'development') {
            console.error('GeoJSON load error:', err);
          }
          setError('Failed to load map data. Please refresh the page.');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!geoData || !outlineData || mapInstanceRef.current) return;

    let mounted = true;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;

        if (!mounted || !mapContainerRef.current) return;

        // Create map
        const map = L.map(mapContainerRef.current, {
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
          maxBounds: MAP_CONFIG.maxBounds,
          maxBoundsViscosity: MAP_CONFIG.maxBoundsViscosity,
          zoomControl: true,
        });

        // Add Nepal outline as background layer first (fills gaps between constituencies)
        L.geoJSON(outlineData, {
          style: {
            fillColor: MAP_CONFIG.backgroundColor,
            fillOpacity: 1,
            color: MAP_CONFIG.backgroundColor,
            weight: 2,
            opacity: 1,
          },
          interactive: false,  // No hover/click events on background
        }).addTo(map);

        // Style function - party colors with matching stroke to hide gaps
        const style = (feature) => {
          const color = getColor(feature);
          return {
            fillColor: color,
            weight: MAP_CONFIG.strokeWidth,
            opacity: 1,
            color: MAP_CONFIG.borderColor,
            fillOpacity: 1,
          };
        };

        // Add GeoJSON layer on top with actual colors
        const geoJsonLayer = L.geoJSON(geoData, {
          style: style,
          onEachFeature: (feature, layer) => {
            const constData = getConstituencyData(feature);

            layer.on({
              mouseover: (e) => {
                if (constData) {
                  setHoveredConstituency(constData);
                  const { clientX, clientY } = e.originalEvent;
                  setTooltipPos({ x: clientX, y: clientY });
                }
                e.target.setStyle({
                  weight: MAP_CONFIG.hoverBorderWeight,
                  color: MAP_CONFIG.hoverBorderColor,
                  fillOpacity: 1,
                });
                e.target.bringToFront();
              },
              mouseout: (e) => {
                setHoveredConstituency(null);
                geoJsonLayer.resetStyle(e.target);
              },
              mousemove: (e) => {
                const { clientX, clientY } = e.originalEvent;
                setTooltipPos({ x: clientX, y: clientY });
              },
              click: () => {
                if (constData && onSelectConstituency) {
                  onSelectConstituency(constData.id);
                }
              },
            });
          },
        }).addTo(map);

        if (mounted) {
          mapInstanceRef.current = map;
          geoJsonLayerRef.current = geoJsonLayer;
          setMapReady(true);
        }

      } catch (err) {
        if (mounted) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Map init error:', err);
          }
          setError('Failed to initialize map. Please try refreshing the page.');
        }
      }
    };

    initMap();

    // Cleanup
    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      geoJsonLayerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoData, outlineData]);

  // Update colors when fptpResults changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer) => {
      const feature = layer.feature;
      if (feature) {
        layer.setStyle({
          fillColor: getColor(feature),
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fptpResults]);

  // Format percentage
  const formatPercent = (val) => {
    if (val === undefined || val === null) return '-';
    return `${(val * 100).toFixed(1)}%`;
  };

  // Error state
  if (error) {
    return (
      <div className="w-full h-[600px] bg-surface rounded-xl border border-neutral flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-lg mb-2">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!geoData || !outlineData) {
    return (
      <div className="w-full h-[600px] bg-surface rounded-xl border border-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl border border-neutral overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Leaflet CSS via CDN as backup */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />

      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />

      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-[400]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-700 text-sm">Rendering map...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 backdrop-blur-sm border border-stone-300 rounded-lg p-3 z-[500]" style={{ backgroundColor: '#fefdf8' }}>
        <p className="text-xs text-gray-600 mb-2 font-medium">Party Colors</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'Independent', 'Others'].map(party => (
            <div key={party} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: PARTIES[party]?.color }}
              />
              <span className="text-xs text-gray-700">{PARTIES[party]?.short || party}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 backdrop-blur-sm border border-stone-300 rounded-lg p-3 z-[500]" style={{ backgroundColor: '#fefdf8' }}>
        <p className="text-xs text-gray-600 mb-1">Total Constituencies</p>
        <p className="text-2xl font-bold text-gray-900">165</p>
        <p className="text-xs text-gray-800 mt-1">Click to view details</p>
      </div>
    </div>
  );
};

export default ConstituencyMap;
