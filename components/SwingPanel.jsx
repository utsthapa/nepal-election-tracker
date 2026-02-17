'use client';

import { ChevronDown, ChevronUp, TrendingUp, RotateCcw } from 'lucide-react';
import { useState, useMemo } from 'react';

import { PARTIES } from '../data/constituencies';
import { countFPTPSeats } from '../utils/calculations';
import { applyUniformSwing, calculateSeatChanges } from '../utils/swingCalculator';

const MAJOR_PARTIES = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US'];

export function SwingPanel({ fptpResults, fptpSeats }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [swingValues, setSwingValues] = useState(() => {
    const initial = {};
    MAJOR_PARTIES.forEach(p => { initial[p] = 0; });
    return initial;
  });

  const hasSwing = Object.values(swingValues).some(v => v !== 0);

  const swungResults = useMemo(() => {
    if (!hasSwing) {return null;}
    return applyUniformSwing(fptpResults, swingValues);
  }, [fptpResults, swingValues, hasSwing]);

  const swungSeats = useMemo(() => {
    if (!swungResults) {return null;}
    return countFPTPSeats(swungResults);
  }, [swungResults]);

  const seatChanges = useMemo(() => {
    if (!swungSeats) {return {};}
    return calculateSeatChanges(fptpSeats, swungSeats);
  }, [fptpSeats, swungSeats]);

  const handleReset = () => {
    const reset = {};
    MAJOR_PARTIES.forEach(p => { reset[p] = 0; });
    setSwingValues(reset);
  };

  const updateSwing = (party, value) => {
    setSwingValues(prev => ({ ...prev, [party]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-[rgb(219,211,196)] shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-[rgb(24,26,36)]" style={{ fontFamily: 'Lora, serif' }}>
            Swing Model
          </h3>
          {hasSwing && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              Active
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-[rgb(100,110,130)]">
            Apply uniform national swing on top of current results. Does not mutate sliders.
          </p>

          {/* Per-party swing rows */}
          <div className="space-y-2">
            {MAJOR_PARTIES.map(party => {
              const swing = swingValues[party];
              const baseSeats = fptpSeats[party] || 0;
              const newSeats = swungSeats?.[party] ?? baseSeats;
              const change = seatChanges[party] || 0;

              return (
                <div key={party} className="flex items-center gap-3">
                  {/* Party label */}
                  <div className="w-14 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PARTIES[party]?.color }}
                    />
                    <span className="text-xs font-semibold text-[rgb(24,26,36)]">
                      {PARTIES[party]?.short || party}
                    </span>
                  </div>

                  {/* Swing slider */}
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    step={0.5}
                    value={swing}
                    onChange={(e) => updateSwing(party, parseFloat(e.target.value))}
                    className="flex-1 h-1.5 accent-blue-500"
                  />

                  {/* Swing value */}
                  <span className={`text-xs font-mono w-12 text-right ${
                    swing > 0 ? 'text-green-600' : swing < 0 ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {swing > 0 ? '+' : ''}{swing.toFixed(1)}%
                  </span>

                  {/* Seat change */}
                  <span className={`text-xs font-mono font-bold w-16 text-right ${
                    change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {hasSwing ? `${baseSeats}→${newSeats}` : `${baseSeats}`}
                  </span>

                  {change !== 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {change > 0 ? '+' : ''}{change}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {hasSwing && swungSeats && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {MAJOR_PARTIES.filter(p => seatChanges[p]).map(party => {
                  const change = seatChanges[party];
                  const baseSeats = fptpSeats[party] || 0;
                  const newSeats = swungSeats[party] || 0;
                  return (
                    <span
                      key={party}
                      className="text-xs font-semibold"
                      style={{ color: PARTIES[party]?.color }}
                    >
                      {PARTIES[party]?.short}: {baseSeats} → {newSeats} ({change > 0 ? '+' : ''}{change})
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reset button */}
          {hasSwing && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Swing
            </button>
          )}
        </div>
      )}
    </div>
  );
}
