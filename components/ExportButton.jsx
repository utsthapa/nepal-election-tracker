'use client';

import { Download, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import {
  generateSeatsCsv,
  generateConstituencyCsv,
  generateJsonExport,
  downloadFile,
  downloadScreenshot,
} from '../utils/exportResults';

const EXPORT_OPTIONS = [
  { id: 'seats-csv', label: 'Seats Summary (CSV)', icon: '📊' },
  { id: 'constituency-csv', label: 'Constituencies (CSV)', icon: '🗺️' },
  { id: 'json', label: 'Full Data (JSON)', icon: '📋' },
  { id: 'screenshot', label: 'Screenshot (PNG)', icon: '📸' },
];

export function ExportButton({
  fptpSeats,
  prSeats,
  totalSeats,
  nationalVoteShares,
  fptpResults,
  fptpSliders,
  prSliders,
  allianceConfig,
  screenshotRef,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) {return;}
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleExport = async (type) => {
    setIsOpen(false);
    const timestamp = new Date().toISOString().slice(0, 10);

    switch (type) {
      case 'seats-csv': {
        const csv = generateSeatsCsv(fptpSeats, prSeats, totalSeats, nationalVoteShares);
        downloadFile(csv, `nepal-seats-${timestamp}.csv`, 'text/csv');
        break;
      }
      case 'constituency-csv': {
        const csv = generateConstituencyCsv(fptpResults);
        downloadFile(csv, `nepal-constituencies-${timestamp}.csv`, 'text/csv');
        break;
      }
      case 'json': {
        const json = generateJsonExport({
          sliders: { fptp: fptpSliders, pr: prSliders },
          seats: { fptp: fptpSeats, pr: prSeats, total: totalSeats },
          results: fptpResults,
          alliance: allianceConfig,
        });
        downloadFile(json, `nepal-election-${timestamp}.json`, 'application/json');
        break;
      }
      case 'screenshot': {
        if (screenshotRef?.current) {
          await downloadScreenshot(screenshotRef.current, `nepal-election-${timestamp}.png`);
        }
        break;
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[rgb(219,211,196)]/30 hover:bg-[rgb(219,211,196)]/50 rounded-lg text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] transition-colors text-sm font-semibold"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg border border-[rgb(219,211,196)] shadow-lg z-50 py-1">
          {EXPORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleExport(opt.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[rgb(24,26,36)] hover:bg-gray-50 transition-colors text-left"
            >
              <span>{opt.icon}</span>
              <span className="font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
