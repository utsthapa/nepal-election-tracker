'use client';

import { useState } from 'react';

import AgeGroupInputs from './AgeGroupInputs';
import EthnicityInputs from './EthnicityInputs';
import LiteracyInputs from './LiteracyInputs';
import ProvinceInputs from './ProvinceInputs';
import ScenarioSelector from './ScenarioSelector';
import UrbanRuralInputs from './UrbanRuralInputs';

const DIMENSIONS = [
  {
    id: 'age',
    label: 'Age',
    description: 'How do different generations vote?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 'urbanRural',
    label: 'Urban / Rural',
    description: 'City vs. countryside voting split',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    id: 'province',
    label: 'Province',
    description: 'Regional voting patterns across 7 provinces',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    id: 'literacy',
    label: 'Literacy',
    description: 'Education level shapes party preference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: 'ethnicity',
    label: 'Ethnicity',
    description: 'Caste/ethnic group voting patterns',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const sumRow = row => Object.values(row || {}).reduce((sum, value) => sum + (value || 0), 0);

const normalizeRow = row => {
  const total = sumRow(row);
  if (!total) {
    return row;
  }
  const normalized = {};
  Object.entries(row).forEach(([party, value]) => {
    normalized[party] = (value / total) * 100;
  });
  return normalized;
};

const applyTargetsToRow = (row, targets) => {
  const source = normalizeRow(row);
  const result = { ...source };
  const targetEntries = Object.entries(targets || {});
  if (targetEntries.length === 0) {
    return source;
  }

  targetEntries.forEach(([party, value]) => {
    result[party] = value;
  });

  const targetedParties = new Set(targetEntries.map(([party]) => party));
  const nonTargetParties = Object.keys(source).filter(party => !targetedParties.has(party));
  const remaining = 100 - targetEntries.reduce((sum, [, value]) => sum + value, 0);

  const safeRemaining = clamp(remaining, 0, 100);
  const nonTargetSourceTotal = nonTargetParties.reduce(
    (sum, party) => sum + (source[party] || 0),
    0
  );

  if (nonTargetParties.length === 0) {
    return normalizeRow(result);
  }

  if (nonTargetSourceTotal <= 0) {
    const even = safeRemaining / nonTargetParties.length;
    nonTargetParties.forEach(party => {
      result[party] = even;
    });
    return normalizeRow(result);
  }

  nonTargetParties.forEach(party => {
    const weight = (source[party] || 0) / nonTargetSourceTotal;
    result[party] = safeRemaining * weight;
  });

  return normalizeRow(result);
};

const DIMENSION_EVENT_PRESETS = {
  age: [
    {
      id: 'age-youth-surge',
      title: 'Youth Reform Wave',
      subtitle: 'Anti-status-quo momentum among first-time voters',
      adjustments: {
        rows: {
          '18-29': { RSP: 82, UML: 7, NC: 6 },
          '30-44': { RSP: 68, UML: 11, NC: 10 },
          '45-59': { RSP: 48, UML: 18, NC: 14 },
          '60+': { RSP: 28, UML: 24, NC: 18 },
        },
        turnoutDelta: { '18-29': 14, '30-44': 9, '45-59': 5, '60+': 2 },
      },
    },
    {
      id: 'age-establishment-hold',
      title: 'Establishment Hold',
      subtitle: 'Older cohorts stabilize NC/UML performance',
      adjustments: {
        rows: {
          '45-59': { UML: 34, NC: 26, RSP: 4 },
          '60+': { UML: 37, NC: 30, RSP: 2 },
        },
        turnoutDelta: { '45-59': 3, '60+': 4 },
      },
    },
    {
      id: 'age-balanced-split',
      title: 'Split Mandate',
      subtitle: 'No dominant generation; mild fragmentation',
      adjustments: {
        rows: {
          '18-29': { RSP: 24, UML: 22, NC: 19 },
          '30-44': { RSP: 14, UML: 26, NC: 22 },
        },
        turnoutDelta: { '18-29': 2 },
      },
    },
  ],
  urbanRural: [
    {
      id: 'urban-urban-shock',
      title: 'Urban Shock',
      subtitle: 'Cities swing faster than rural belts',
      adjustments: {
        rows: {
          urban: { RSP: 82, UML: 7, NC: 6 },
          rural: { RSP: 52, UML: 16, NC: 14 },
        },
        turnoutDelta: { urban: 12, rural: 7 },
      },
    },
    {
      id: 'urban-rural-consolidation',
      title: 'Rural Consolidation',
      subtitle: 'Traditional rural networks hold',
      adjustments: {
        rows: {
          rural: { UML: 34, NC: 24, RSP: 8 },
        },
        turnoutDelta: { rural: 3 },
      },
    },
    {
      id: 'urban-narrow-divide',
      title: 'Narrow Divide',
      subtitle: 'Urban-rural gap shrinks',
      adjustments: {
        rows: {
          urban: { UML: 27, NC: 23, RSP: 14 },
          rural: { UML: 30, NC: 23, RSP: 10 },
        },
      },
    },
  ],
  literacy: [
    {
      id: 'lit-educated-reform',
      title: 'Educated Reform Vote',
      subtitle: 'High-literacy districts favor newer parties',
      adjustments: {
        rows: {
          high: { RSP: 80, UML: 8, NC: 8 },
          medium: { RSP: 58, UML: 14, NC: 13 },
          low: { RSP: 34, UML: 23, NC: 18 },
        },
        turnoutDelta: { high: 10, medium: 6, low: 3 },
      },
    },
    {
      id: 'lit-legacy-machines',
      title: 'Legacy Machines',
      subtitle: 'Low-literacy districts stick with major incumbents',
      adjustments: {
        rows: {
          low: { UML: 36, NC: 24, RSP: 5 },
        },
      },
    },
    {
      id: 'lit-middle-fluidity',
      title: 'Middle-Literacy Fluidity',
      subtitle: 'Swing-heavy semi-urban contest',
      adjustments: {
        rows: {
          medium: { UML: 29, NC: 22, RSP: 14 },
        },
        turnoutDelta: { medium: 2 },
      },
    },
  ],
};

/**
 * Main container for demographic modeling inputs
 * Single-dimension selector: pick one lens to analyze the election through
 */
export default function DemographicInputPanel({
  patterns,
  turnout,
  onUpdatePattern,
  onUpdateTurnout,
  scenarios,
  savedScenarios,
  activeScenario,
  onLoadScenario,
  onSaveScenario,
  onDeleteScenario,
  onClear,
  activeDimension,
  onChangeDimension,
  hideScenarioSelector = false,
  singleDimensionOnly = false,
}) {
  const [scenarioExpanded, setScenarioExpanded] = useState(false);
  const [activePresetByDimension, setActivePresetByDimension] = useState({});

  const baselineScenario = scenarios?.find(s => s.id === '2022-baseline') || scenarios?.[0] || null;
  const dimensionPresets = DIMENSION_EVENT_PRESETS[activeDimension] || [];

  const resolveSegmentKey = key => {
    if (activeDimension === 'province') {
      return Number(key);
    }
    return key;
  };

  const applyPreset = preset => {
    if (!baselineScenario?.patterns?.[activeDimension]) {
      return;
    }

    const baseRows = baselineScenario.patterns[activeDimension];
    const baseTurnout = baselineScenario.turnout?.[activeDimension] || {};
    const rowAdjustments = preset?.adjustments?.rows || {};
    const turnoutDelta = preset?.adjustments?.turnoutDelta || {};

    Object.entries(baseRows).forEach(([segmentKey, baseRow]) => {
      const segment = resolveSegmentKey(segmentKey);
      const rowTargets = rowAdjustments[segmentKey];
      const nextRow = rowTargets ? applyTargetsToRow(baseRow, rowTargets) : { ...baseRow };
      onUpdatePattern(activeDimension, segment, nextRow);

      const baseTurnoutValue =
        typeof baseTurnout[segmentKey] === 'number' ? baseTurnout[segmentKey] : 65;
      const delta = turnoutDelta[segmentKey] || 0;
      onUpdateTurnout(activeDimension, segment, clamp(baseTurnoutValue + delta, 30, 90));
    });

    setActivePresetByDimension(current => ({
      ...current,
      [activeDimension]: preset.id,
    }));
  };

  const activateCustomMode = () => {
    setActivePresetByDimension(current => ({
      ...current,
      [activeDimension]: 'custom',
    }));
  };

  const handleManualPatternUpdate = (dimension, segment, partyShares) => {
    setActivePresetByDimension(current => ({
      ...current,
      [dimension]: 'custom',
    }));
    onUpdatePattern(dimension, segment, partyShares);
  };

  const handleManualTurnoutUpdate = (dimension, segment, rate) => {
    setActivePresetByDimension(current => ({
      ...current,
      [dimension]: 'custom',
    }));
    onUpdateTurnout(dimension, segment, rate);
  };

  const resetActiveDimensionToBaseline = () => {
    if (!baselineScenario?.patterns?.[activeDimension]) {
      return;
    }

    const baseRows = baselineScenario.patterns[activeDimension];
    const baseTurnout = baselineScenario.turnout?.[activeDimension] || {};

    Object.entries(baseRows).forEach(([segmentKey, baseRow]) => {
      const segment = resolveSegmentKey(segmentKey);
      onUpdatePattern(activeDimension, segment, { ...baseRow });
      const turnoutValue =
        typeof baseTurnout[segmentKey] === 'number' ? baseTurnout[segmentKey] : 65;
      onUpdateTurnout(activeDimension, segment, turnoutValue);
    });

    setActivePresetByDimension(current => ({
      ...current,
      [activeDimension]: 'baseline',
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">What-If Demographic Model</h3>
        <p className="text-sm text-gray-600">
          Pick a lens to explore. Each constituency prediction uses real census data for that
          dimension.
          {singleDimensionOnly &&
            ' Only one demographic lens can be active at a time in guided simulation.'}
        </p>
      </div>

      {/* Dimension Picker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {DIMENSIONS.map(dim => {
          const isActive = activeDimension === dim.id;
          return (
            <button
              key={dim.id}
              onClick={() => onChangeDimension(dim.id)}
              className={`relative px-3 py-3 rounded-lg border-2 text-left transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>{dim.icon}</span>
                <span
                  className={`text-sm font-semibold ${
                    isActive ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {dim.label}
                </span>
              </div>
              <p
                className={`text-xs leading-tight ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {dim.description}
              </p>
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Scenario Selector */}
      {!hideScenarioSelector && (
        <ScenarioSelector
          scenarios={scenarios}
          savedScenarios={savedScenarios}
          activeScenario={activeScenario}
          onLoadScenario={onLoadScenario}
          onSaveScenario={onSaveScenario}
          onDeleteScenario={onDeleteScenario}
          onClear={onClear}
          isExpanded={scenarioExpanded}
          onToggle={() => setScenarioExpanded(v => !v)}
        />
      )}

      {dimensionPresets.length > 0 && (
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-blue-700 font-semibold">
                Event Scenarios
              </p>
              <h4 className="text-base font-semibold text-slate-900">
                Choose a {DIMENSIONS.find(d => d.id === activeDimension)?.label} storyline
              </h4>
            </div>
            <button
              onClick={resetActiveDimensionToBaseline}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              Reset This Lens
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dimensionPresets.map(preset => {
              const isActive = activePresetByDimension[activeDimension] === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`text-left rounded-lg border p-3 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-100/70 shadow-sm'
                      : 'border-blue-100 bg-white hover:border-blue-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{preset.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{preset.subtitle}</p>
                  <p className="text-[11px] text-blue-700 font-medium mt-2">Apply scenario</p>
                </button>
              );
            })}

            <button
              onClick={activateCustomMode}
              className={`text-left rounded-lg border p-3 transition-all ${
                activePresetByDimension[activeDimension] === 'custom'
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : 'border-emerald-200 bg-white hover:border-emerald-400'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">Custom</p>
              <p className="text-xs text-slate-600 mt-1">
                Fine-tune every segment manually with sliders and turnout edits.
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-2">Manual control</p>
            </button>
          </div>
        </div>
      )}

      {/* Active Dimension Inputs */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-white">
          {activeDimension === 'age' && (
            <AgeGroupInputs
              patterns={patterns?.age}
              turnout={turnout?.age}
              onUpdatePattern={(ageGroup, partyShares) =>
                handleManualPatternUpdate('age', ageGroup, partyShares)
              }
              onUpdateTurnout={(ageGroup, rate) => handleManualTurnoutUpdate('age', ageGroup, rate)}
            />
          )}

          {activeDimension === 'urbanRural' && (
            <UrbanRuralInputs
              patterns={patterns?.urbanRural}
              turnout={turnout?.urbanRural}
              onUpdatePattern={(segment, partyShares) =>
                handleManualPatternUpdate('urbanRural', segment, partyShares)
              }
              onUpdateTurnout={(segment, rate) =>
                handleManualTurnoutUpdate('urbanRural', segment, rate)
              }
            />
          )}

          {activeDimension === 'province' && (
            <ProvinceInputs
              patterns={patterns?.province}
              turnout={turnout?.province}
              onUpdatePattern={(province, partyShares) =>
                handleManualPatternUpdate('province', province, partyShares)
              }
              onUpdateTurnout={(province, rate) =>
                handleManualTurnoutUpdate('province', province, rate)
              }
            />
          )}

          {activeDimension === 'literacy' && (
            <LiteracyInputs
              patterns={patterns?.literacy}
              turnout={turnout?.literacy}
              onUpdatePattern={(level, partyShares) =>
                handleManualPatternUpdate('literacy', level, partyShares)
              }
              onUpdateTurnout={(level, rate) => handleManualTurnoutUpdate('literacy', level, rate)}
            />
          )}

          {activeDimension === 'ethnicity' && (
            <EthnicityInputs
              patterns={patterns?.ethnicity}
              turnout={turnout?.ethnicity}
              onUpdatePattern={(group, partyShares) =>
                handleManualPatternUpdate('ethnicity', group, partyShares)
              }
              onUpdateTurnout={(group, rate) => handleManualTurnoutUpdate('ethnicity', group, rate)}
            />
          )}
        </div>
      </div>

      {/* Validation Warnings — only for active dimension */}
      {patterns && patterns[activeDimension] && (
        <ValidationWarnings
          dimensionPatterns={patterns[activeDimension]}
          dimensionTurnout={turnout?.[activeDimension]}
          dimensionName={activeDimension}
        />
      )}
    </div>
  );
}

/**
 * Display validation warnings for the active dimension only
 */
function ValidationWarnings({
  dimensionPatterns,
  dimensionTurnout,
  dimensionName: _dimensionName,
}) {
  const warnings = [];

  if (dimensionPatterns) {
    Object.entries(dimensionPatterns).forEach(([segment, partyShares]) => {
      Object.entries(partyShares).forEach(([party, share]) => {
        if (share > 80) {
          warnings.push({
            message: `${segment}: ${party} has ${share.toFixed(1)}% (unusually high)`,
            severity: 'warning',
          });
        }
      });
    });
  }

  if (dimensionTurnout) {
    Object.entries(dimensionTurnout).forEach(([segment, rate]) => {
      if (rate < 30) {
        warnings.push({
          message: `${segment}: Turnout of ${rate.toFixed(1)}% is unusually low`,
          severity: 'warning',
        });
      }
      if (rate > 90) {
        warnings.push({
          message: `${segment}: Turnout of ${rate.toFixed(1)}% is unusually high`,
          severity: 'warning',
        });
      }
    });
  }

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {warnings.map((warning, idx) => (
        <div
          key={idx}
          className="p-3 rounded-lg border bg-yellow-50 border-yellow-200 text-yellow-800"
        >
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{warning.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
