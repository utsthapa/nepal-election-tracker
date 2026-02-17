'use client';

import { useState } from 'react';

/**
 * Modal for saving custom demographic scenarios
 * Handles name validation and prevents duplicates
 */
export default function SaveScenarioModal({ onSave, onClose, existingNames }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      setError('Please enter a scenario name');
      return;
    }

    // Check for duplicates (case-insensitive)
    const normalizedName = name.trim().toLowerCase();
    const isDuplicate = existingNames.some(
      existing => existing.toLowerCase() === normalizedName
    );

    if (isDuplicate) {
      // Auto-append number for duplicates
      let counter = 2;
      let uniqueName = `${name.trim()} (${counter})`;
      while (
        existingNames.some(
          existing => existing.toLowerCase() === uniqueName.toLowerCase()
        )
      ) {
        counter++;
        uniqueName = `${name.trim()} (${counter})`;
      }
      setName(uniqueName);
      setError(`Name already exists. Renamed to "${uniqueName}"`);
      return;
    }

    onSave(name.trim(), description.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Save Scenario
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label
              htmlFor="scenario-name"
              className="block text-sm font-medium text-gray-700"
            >
              Scenario Name
            </label>
            <input
              id="scenario-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Youth Wave 2027"
              className="w-full px-3 py-2 border border-gray-300"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="scenario-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optional)
            </label>
            <textarea
              id="scenario-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what this scenario represents..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
