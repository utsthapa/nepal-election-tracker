'use client';

import { useState } from 'react';

import SaveScenarioModal from './SaveScenarioModal';

/**
 * Dropdown component for selecting demographic scenarios
 * Includes preset scenarios and user-saved custom scenarios
 */
export default function ScenarioSelector({
  scenarios,          // Preset scenarios
  savedScenarios,     // User's saved scenarios
  activeScenario,     // Currently active scenario ID
  onLoadScenario,
  onSaveScenario,
  onDeleteScenario,
  onClear,
  isExpanded,
  onToggle,
}) {
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleLoadScenario = (scenario) => {
    onLoadScenario(scenario);
  };

  const handleSave = (name, description) => {
    const newScenario = onSaveScenario(name, description);
    setShowSaveModal(false);
    return newScenario;
  };

  const activeScenarioObj = [...scenarios, ...savedScenarios].find(
    s => s.id === activeScenario
  );

  return (
    <>
      <div className="border border-gray-200">
        <button
          onClick={onToggle}
          className="w-full px-4 py-3 bg-gray-50"
        >
          <div className="text-left">
            <h4 className="font-medium text-gray-900">
              Scenario
            </h4>
            {activeScenarioObj && (
              <p className="text-sm text-gray-500">
                {activeScenarioObj.name}
              </p>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
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
        </button>

        {isExpanded && (
          <div className="p-4 bg-white">
            {/* Preset Scenarios */}
            <div>
              <h5 className="text-sm font-medium text-gray-700">
                Preset Scenarios
              </h5>
              <div className="space-y-2">
                {scenarios.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => handleLoadScenario(scenario)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      activeScenario === scenario.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">{scenario.name}</div>
                    <div className="text-xs text-gray-500">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Scenarios */}
            {savedScenarios.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700">
                  Custom Scenarios
                </h5>
                <div className="space-y-2">
                  {savedScenarios.map(scenario => (
                    <div
                      key={scenario.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        activeScenario === scenario.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => handleLoadScenario(scenario)}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {scenario.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {scenario.description}
                        </div>
                      </button>
                      <button
                        onClick={() => onDeleteScenario(scenario.id)}
                        className="p-1 hover:bg-red-100"
                        title="Delete scenario"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Save Scenario
              </button>
              <button
                onClick={onClear}
                className="px-4 py-2 bg-gray-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {showSaveModal && (
        <SaveScenarioModal
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
          existingNames={[...scenarios, ...savedScenarios].map(s => s.name)}
        />
      )}
    </>
  );
}
