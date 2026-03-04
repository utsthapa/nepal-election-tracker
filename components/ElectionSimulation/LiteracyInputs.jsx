'use client';

import { useState } from 'react';

import { PARTIES } from '@/data/constituencies';
import { adjustZeroSumSliders } from '@/utils/calculations';

const LITERACY_LEVELS = [
  {
    id: 'high',
    label: 'High Literacy',
    description: '>80% literacy rate',
    icon: '📚',
    examples: 'Kathmandu, Pokhara, major cities',
    populationShare: 25,
  },
  {
    id: 'medium',
    label: 'Medium Literacy',
    description: '70-80% literacy rate',
    icon: '📖',
    examples: 'Semi-urban districts',
    populationShare: 35,
  },
  {
    id: 'low',
    label: 'Low Literacy',
    description: '<70% literacy rate',
    icon: '📝',
    examples: 'Remote rural areas',
    populationShare: 40,
  },
];

export default function LiteracyInputs({ patterns, turnout, onUpdatePattern, onUpdateTurnout }) {
  const [expandedLevel, setExpandedLevel] = useState('high');

  const toggleLevel = levelId => {
    setExpandedLevel(current => (current === levelId ? null : levelId));
  };

  return (
    <div className="space-y-3">
      {LITERACY_LEVELS.map(level => (
        <LiteracySection
          key={level.id}
          level={level}
          pattern={patterns?.[level.id]}
          turnoutRate={turnout?.[level.id]}
          populationShare={level.populationShare}
          isExpanded={expandedLevel === level.id}
          onToggle={() => toggleLevel(level.id)}
          onUpdatePattern={partyShares => onUpdatePattern(level.id, partyShares)}
          onUpdateTurnout={rate => onUpdateTurnout(level.id, rate)}
        />
      ))}
    </div>
  );
}

function LiteracySection({
  level,
  pattern,
  turnoutRate,
  populationShare,
  isExpanded,
  onToggle,
  onUpdatePattern,
  onUpdateTurnout,
}) {
  const [lockedParties, setLockedParties] = useState(new Set());

  const handleSliderChange = (party, value) => {
    const defaultPattern = Object.keys(PARTIES).reduce(
      (acc, p, _, arr) => ({ ...acc, [p]: 100 / arr.length }),
      {}
    );
    const currentPattern = pattern || defaultPattern;
    const newPattern = adjustZeroSumSliders(currentPattern, party, value, lockedParties);
    onUpdatePattern(newPattern);
  };

  const toggleLock = party => {
    setLockedParties(current => {
      const next = new Set(current);
      if (next.has(party)) {
        next.delete(party);
      } else {
        next.add(party);
      }
      return next;
    });
  };

  const handleTurnoutChange = e => {
    if (e.target.value === '') {
      onUpdateTurnout(0);
      return;
    }
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdateTurnout(Math.max(0, Math.min(100, value)));
    }
  };

  const total = pattern ? Object.values(pattern).reduce((sum, val) => sum + val, 0) : 0;

  return (
    <div className="border border-gray-200">
      <button onClick={onToggle} className="w-full px-4 py-2.5 bg-gray-50">
        <div className="text-left flex items-center gap-2">
          <span className="text-xl">{level.icon}</span>
          <div>
            <div className="font-medium text-sm text-gray-900">{level.label}</div>
            <div className="text-xs text-gray-500">
              {level.description} • Turnout: {turnoutRate?.toFixed(1) || '65.0'}%
            </div>
            <div className="text-xs text-gray-400">e.g., {level.examples}</div>
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
        <div className="p-4 bg-white">
          <div>
            <label className="block text-xs font-medium text-gray-700">Expected Turnout (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={turnoutRate ?? 65}
              onChange={handleTurnoutChange}
              className="w-full px-3 py-2 text-sm border border-gray-300"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700">Party Vote Shares</label>
              <span className="text-xs text-gray-500">Click lock to prevent changes</span>
            </div>
            <div className="space-y-2.5">
              {Object.keys(PARTIES).map(party => (
                <PartySlider
                  key={party}
                  party={party}
                  value={pattern?.[party] || 0}
                  onChange={value => handleSliderChange(party, value)}
                  locked={lockedParties.has(party)}
                  onToggleLock={() => toggleLock(party)}
                />
              ))}
            </div>
          </div>

          {pattern && (
            <div className="border-t border-gray-200">
              <div className="text-xs font-medium text-gray-500">
                Effective Contribution ({populationShare}% pop. × {(turnoutRate ?? 65).toFixed(0)}%
                turnout)
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.keys(PARTIES).map(party => {
                  const voteShare = pattern[party] || 0;
                  const effective =
                    (populationShare / 100) * ((turnoutRate ?? 65) / 100) * (voteShare / 100) * 100;
                  if (voteShare < 1) {
                    return null;
                  }
                  return (
                    <div key={party} className="flex items-center justify-between text-xs">
                      <span className="font-medium" style={{ color: PARTIES[party].color }}>
                        {PARTIES[party].name}
                      </span>
                      <span className="font-mono text-gray-600">{effective.toFixed(1)}%</span>
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

function PartySlider({ party, value, onChange, locked, onToggleLock }) {
  const partyInfo = PARTIES[party];

  const handleChange = e => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="group flex items-center gap-2">
      <button
        onClick={onToggleLock}
        className={`flex-shrink-0 p-1 rounded transition-colors ${
          locked ? 'text-amber-600 bg-amber-50' : 'text-gray-300 hover:text-gray-500'
        }`}
        title={locked ? 'Locked - click to unlock' : 'Click to lock'}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {locked ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          )}
        </svg>
      </button>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: partyInfo.color }} />
            <span className="text-xs font-medium text-gray-700">{partyInfo.name}</span>
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
          disabled={locked}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
            locked ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            background: `linear-gradient(to right, ${partyInfo.color} 0%, ${partyInfo.color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
          }}
        />
      </div>
    </div>
  );
}
