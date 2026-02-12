'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { SimpleHeader } from '../../components/SimpleHeader';
import { PARTIES } from '../../data/constituencies';

// Dynamic import for heavy map component
const NepalMap = dynamic(() => import('../../components/NepalMap'), {
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-surface/50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <p className="text-muted text-sm">Loading map...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function NepalMapPage() {
  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Nepal Map</h1>
          </div>
          <p className="text-gray-700">
            Interactive map of Nepal&apos;s 77 districts with 2022 election results
          </p>
        </div>

        <div className="bg-surface border border-neutral rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-neutral/30 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">Hover</h3>
              <p className="text-gray-700">
                Hover over any district to see its name, province, and 2022 election winners
              </p>
            </div>
            <div className="bg-neutral/30 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">Click</h3>
              <p className="text-gray-700">
                Click on a district to view detailed information including constituency results
              </p>
            </div>
            <div className="bg-neutral/30 rounded-lg p-4">
              <h3 className="font-medium text-white mb-2">Toggle View</h3>
              <p className="text-gray-700">
                Switch between Leaflet (interactive) and D3 (SVG) rendering modes
              </p>
            </div>
          </div>
        </div>

        <NepalMap initialRenderMode="leaflet" />

        <div className="mt-8 bg-surface border border-neutral rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Party Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(PARTIES).map(([key, party]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
                <span className="text-sm text-gray-700">
                  {party.short || key}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-neutral/30 rounded-lg">
          <p className="text-xs text-gray-800 text-center">
            District colors represent the dominant party (most seats won) in the 2022 Federal Parliament Election.
            Click on any district to view detailed constituency-level results.
          </p>
        </div>
      </main>
    </div>
  );
}
