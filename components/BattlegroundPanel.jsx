'use client';

import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useState, useMemo } from 'react';

import { PARTIES } from '../data/constituencies';
import { getBattlegroundSeats, countVulnerableSeats } from '../utils/battleground';

const HEAT_COLORS = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500', label: 'Critical' },
  tight: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-400', label: 'Tight' },
  competitive: { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-400', label: 'Competitive' },
};

export function BattlegroundPanel({ fptpResults, onSelectConstituency }) {
  const [threshold, setThreshold] = useState(5);
  const [isExpanded, setIsExpanded] = useState(true);

  const battlegrounds = useMemo(
    () => getBattlegroundSeats(fptpResults, threshold / 100),
    [fptpResults, threshold]
  );

  const vulnerable = useMemo(
    () => countVulnerableSeats(battlegrounds),
    [battlegrounds]
  );

  // Sort parties by most vulnerable seats
  const sortedVulnerable = useMemo(
    () => Object.entries(vulnerable).sort((a, b) => b[1] - a[1]),
    [vulnerable]
  );

  return (
    <div className="bg-white rounded-lg border border-[rgb(219,211,196)] shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-[rgb(24,26,36)]" style={{ fontFamily: 'Lora, serif' }}>
            Battleground Seats
          </h3>
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
            {battlegrounds.length}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Threshold slider */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-[rgb(100,110,130)] whitespace-nowrap">
              Margin threshold
            </label>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="flex-1 h-1.5 accent-orange-500"
            />
            <span className="text-sm font-mono font-semibold text-[rgb(24,26,36)] w-10 text-right">
              {threshold}%
            </span>
          </div>

          {/* Vulnerability chips */}
          {sortedVulnerable.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sortedVulnerable.map(([party, count]) => (
                <span
                  key={party}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    borderColor: PARTIES[party]?.color || '#6b7280',
                    color: PARTIES[party]?.color || '#6b7280',
                    backgroundColor: `${PARTIES[party]?.color || '#6b7280'}10`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: PARTIES[party]?.color || '#6b7280' }}
                  />
                  {PARTIES[party]?.short || party}: {count} vulnerable
                </span>
              ))}
            </div>
          )}

          {/* Constituency list */}
          {battlegrounds.length === 0 ? (
            <p className="text-sm text-[rgb(100,110,130)] text-center py-4">
              No seats within {threshold}% margin. Try increasing the threshold.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {battlegrounds.map((seat) => {
                const heat = HEAT_COLORS[seat.heat];
                const maxMargin = threshold / 100;
                const barWidth = Math.min(100, (seat.margin / maxMargin) * 100);

                return (
                  <button
                    key={seat.id}
                    onClick={() => onSelectConstituency?.(seat.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    {/* Heat indicator */}
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${heat.bar}`} />

                    {/* Constituency info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[rgb(24,26,36)] truncate">
                          {seat.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${heat.bg} ${heat.text}`}>
                          {heat.label}
                        </span>
                      </div>
                      {/* Margin bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${heat.bar}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[rgb(100,110,130)] w-12 text-right">
                          {(seat.margin * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Winner vs Runner-up */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span
                        className="text-xs font-bold"
                        style={{ color: PARTIES[seat.winner]?.color }}
                      >
                        {PARTIES[seat.winner]?.short || seat.winner}
                      </span>
                      <span className="text-[10px] text-gray-400">vs</span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: PARTIES[seat.runnerUp]?.color }}
                      >
                        {PARTIES[seat.runnerUp]?.short || seat.runnerUp}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
