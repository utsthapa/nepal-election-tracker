'use client';

import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { useState, useMemo } from 'react';

import { PARTIES } from '../data/constituencies';
import { calculateRequiredSwing } from '../utils/seatCalculator';

const CALCULABLE_PARTIES = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US'];
const FPTP_MAJORITY = 83; // 165/2 + 1

export function SeatCalculator({ fptpResults, fptpSeats }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedParty, setSelectedParty] = useState('NC');
  const [targetSeats, setTargetSeats] = useState('');

  const currentSeats = fptpSeats[selectedParty] || 0;

  const presets = useMemo(() => [
    { label: '+10 seats', value: currentSeats + 10 },
    { label: '+20 seats', value: currentSeats + 20 },
    { label: `${FPTP_MAJORITY} (majority)`, value: FPTP_MAJORITY },
  ], [currentSeats]);

  const target = targetSeats === '' ? null : parseInt(targetSeats, 10);

  const result = useMemo(() => {
    if (target === null || isNaN(target) || target <= 0 || target > 165) {return null;}
    return calculateRequiredSwing(selectedParty, target, fptpResults, fptpSeats);
  }, [selectedParty, target, fptpResults, fptpSeats]);

  return (
    <div className="bg-white rounded-lg border border-[rgb(219,211,196)] shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-[rgb(24,26,36)]" style={{ fontFamily: 'Lora, serif' }}>
            Seat Calculator
          </h3>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-xs text-[rgb(100,110,130)]">
            How much uniform swing does a party need to reach a seat target?
          </p>

          {/* Party selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-[rgb(100,110,130)]">Party</label>
            <select
              value={selectedParty}
              onChange={(e) => {
                setSelectedParty(e.target.value);
                setTargetSeats('');
              }}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
            >
              {CALCULABLE_PARTIES.map(p => (
                <option key={p} value={p}>
                  {PARTIES[p]?.short || p} — currently {fptpSeats[p] || 0} FPTP seats
                </option>
              ))}
            </select>
          </div>

          {/* Target input */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-[rgb(100,110,130)]">Target</label>
            <input
              type="number"
              min={1}
              max={165}
              value={targetSeats}
              onChange={(e) => setTargetSeats(e.target.value)}
              placeholder={`Enter target seats (current: ${currentSeats})`}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <button
                key={preset.label}
                onClick={() => setTargetSeats(String(Math.min(165, preset.value)))}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  target === preset.value
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-[rgb(100,110,130)] hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className={`p-3 rounded-lg ${result.possible ? 'bg-purple-50 border border-purple-200' : 'bg-red-50 border border-red-200'}`}>
              {result.possible ? (
                result.requiredSwing === 0 ? (
                  <p className="text-sm font-semibold text-green-700">
                    {PARTIES[selectedParty]?.short} already has {currentSeats} seats — target met!
                  </p>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-purple-800">
                      {PARTIES[selectedParty]?.short} needs{' '}
                      <span className="font-mono text-lg">+{result.requiredSwing}%</span>{' '}
                      uniform swing to reach {target} seats
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {currentSeats} → {result.achievedSeats} FPTP seats ({result.achievedSeats - currentSeats > 0 ? '+' : ''}{result.achievedSeats - currentSeats})
                    </p>
                  </div>
                )
              ) : (
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Target of {target} seats is not achievable with uniform swing up to +30%
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Maximum reachable: {result.achievedSeats} seats at +30% swing
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
