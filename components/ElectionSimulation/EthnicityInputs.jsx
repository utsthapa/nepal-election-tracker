'use client';

import { useState } from 'react';

import { PARTIES } from '@/data/constituencies';
import { ETHNIC_GROUP_LABELS, ETHNIC_GROUP_COLORS, ETHNIC_GROUPS } from '@/data/ethnicDemographics';
import { adjustZeroSumSliders } from '@/utils/calculations';

const SEGMENTS = ETHNIC_GROUPS.map(id => ({
  id,
  label: ETHNIC_GROUP_LABELS[id],
  color: ETHNIC_GROUP_COLORS[id],
}));

/**
 * Ethnicity voting pattern configuration
 * Users set party vote shares for each ethnic group
 */
export default function EthnicityInputs({ patterns, turnout, onUpdatePattern, onUpdateTurnout }) {
  const [expandedSegment, setExpandedSegment] = useState('brahminChhetri');

  const toggleSegment = segmentId => {
    setExpandedSegment(current => (current === segmentId ? null : segmentId));
  };

  return (
    <div className="space-y-3">
      {SEGMENTS.map(segment => (
        <SegmentSection
          key={segment.id}
          segment={segment}
          pattern={patterns?.[segment.id]}
          turnoutRate={turnout?.[segment.id]}
          isExpanded={expandedSegment === segment.id}
          onToggle={() => toggleSegment(segment.id)}
          onUpdatePattern={partyShares => onUpdatePattern(segment.id, partyShares)}
          onUpdateTurnout={rate => onUpdateTurnout(segment.id, rate)}
        />
      ))}
    </div>
  );
}

function SegmentSection({
  segment,
  pattern,
  turnoutRate,
  isExpanded,
  onToggle,
  onUpdatePattern,
  onUpdateTurnout,
}) {
  const handleSliderChange = (party, value) => {
    if (!pattern) {
      return;
    }
    const newPattern = adjustZeroSumSliders(pattern, party, value);
    onUpdatePattern(newPattern);
  };

  const handleTurnoutChange = e => {
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
        className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between"
      >
        <div className="text-left flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
          <div>
            <div className="font-medium text-sm text-gray-900">{segment.label}</div>
            <div className="text-xs text-gray-500">
              Turnout: {turnoutRate?.toFixed(1) || '65.0'}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-600">{total.toFixed(0)}%</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 bg-white space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Expected Turnout (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={turnoutRate || 65}
              onChange={handleTurnoutChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700">Party Vote Shares</label>
              <span className="text-xs font-mono text-green-600">Total: {total.toFixed(1)}%</span>
            </div>
            <div className="space-y-2.5">
              {Object.keys(PARTIES).map(party => (
                <PartySlider
                  key={party}
                  party={party}
                  value={pattern?.[party] || 0}
                  onChange={value => handleSliderChange(party, value)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PartySlider({ party, value, onChange }) {
  const partyInfo = PARTIES[party];

  const handleChange = e => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: partyInfo.color }} />
          <span className="text-xs font-medium text-gray-700">{partyInfo.short}</span>
        </div>
        <span className="text-xs font-mono font-bold" style={{ color: partyInfo.color }}>
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
        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, ${partyInfo.color} 0%, ${partyInfo.color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}
