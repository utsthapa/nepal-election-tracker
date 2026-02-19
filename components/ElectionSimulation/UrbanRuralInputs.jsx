'use client';

import { useState } from 'react';

import { PARTIES } from '@/data/constituencies';
import { adjustZeroSumSliders } from '@/utils/calculations';

const SEGMENTS = [
  { id: 'urban', label: 'Urban Areas', description: 'Cities and municipalities', icon: '🏙️', populationShare: 22 },
  { id: 'rural', label: 'Rural Areas', description: 'Villages and countryside', icon: '🏞️', populationShare: 78 },
];

/**
 * Urban/Rural voting pattern configuration
 */
export default function UrbanRuralInputs({ patterns, turnout, onUpdatePattern, onUpdateTurnout }) {
  const [expandedSegment, setExpandedSegment] = useState('urban');

  const toggleSegment = (segmentId) => {
    setExpandedSegment(current => current === segmentId ? null : segmentId);
  };

  return (
    <div className="space-y-3">
      {SEGMENTS.map(segment => (
        <SegmentSection
          key={segment.id}
          segment={segment}
          pattern={patterns?.[segment.id]}
          turnoutRate={turnout?.[segment.id]}
          populationShare={segment.populationShare}
          isExpanded={expandedSegment === segment.id}
          onToggle={() => toggleSegment(segment.id)}
          onUpdatePattern={(partyShares) => onUpdatePattern(segment.id, partyShares)}
          onUpdateTurnout={(rate) => onUpdateTurnout(segment.id, rate)}
        />
      ))}
    </div>
  );
}

/**
 * Individual segment section
 */
function SegmentSection({
  segment,
  pattern,
  turnoutRate,
  populationShare,
  isExpanded,
  onToggle,
  onUpdatePattern,
  onUpdateTurnout,
}) {
  const handleSliderChange = (party, value) => {
    if (!pattern) {return;}
    const newPattern = adjustZeroSumSliders(pattern, party, value);
    onUpdatePattern(newPattern);
  };

  const handleTurnoutChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdateTurnout(Math.max(0, Math.min(100, value)));
    }
  };

  const total = pattern ? Object.values(pattern).reduce((sum, val) => sum + val, 0) : 0;

  return (
    <div className="border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2.5 bg-gray-50"
      >
        <div className="text-left flex items-center gap-2">
          <span className="text-xl">{segment.icon}</span>
          <div>
            <div className="font-medium text-sm text-gray-900">
              {segment.label}
            </div>
            <div className="text-xs text-gray-500">
              {segment.description} • Turnout: {turnoutRate?.toFixed(1) || '65.0'}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-600">
            {total.toFixed(0)}%
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 bg-white">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Expected Turnout (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={turnoutRate || 65}
              onChange={handleTurnoutChange}
              className="w-full px-3 py-2 text-sm border border-gray-300"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700">
                Party Vote Shares
              </label>
              <span className="text-xs font-mono text-green-600">
                Total: {total.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-2.5">
              {Object.keys(PARTIES).map(party => (
                <PartySlider
                  key={party}
                  party={party}
                  value={pattern?.[party] || 0}
                  onChange={(value) => handleSliderChange(party, value)}
                />
              ))}
            </div>
          </div>

          {pattern && (
            <div className="border-t border-gray-200">
              <div className="text-xs font-medium text-gray-500">
                Effective Contribution ({populationShare}% pop. × {(turnoutRate || 65).toFixed(0)}% turnout)
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.keys(PARTIES).map(party => {
                  const voteShare = pattern[party] || 0;
                  const effective = (populationShare / 100) * ((turnoutRate || 65) / 100) * (voteShare / 100) * 100;
                  if (voteShare < 1) {return null;}
                  return (
                    <div key={party} className="flex items-center justify-between text-xs">
                      <span className="font-medium" style={{ color: PARTIES[party].color }}>
                        {PARTIES[party].short}
                      </span>
                      <span className="font-mono text-gray-600">
                        {effective.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PartySlider({ party, value, onChange }) {
  const partyInfo = PARTIES[party];

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: partyInfo.color }}
          />
          <span className="text-xs font-medium text-gray-700">
            {partyInfo.short}
          </span>
        </div>
        <span
          className="text-xs font-mono font-bold"
          style={{ color: partyInfo.color }}
        >
          {value.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={value}
        onChange={handleChange}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider-${party.toLowerCase()}`}
        style={{
          background: `linear-gradient(to right, ${partyInfo.color} 0%, ${partyInfo.color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
}
