'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

/**
 * Data Sources Component
 * Displays expandable list of data sources with attribution
 *
 * @param {Array} sources - Array of source objects with { name, url, description }
 * @param {Array} notes - Optional methodology notes
 */
export default function DataSources({ sources = [], notes = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
        Data Sources & Methodology
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Sources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Primary Data Sources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map((source, index) => (
                <SourceCard key={index} {...source} />
              ))}
            </div>
          </div>

          {/* Methodology notes */}
          {notes && notes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Methodology Notes
              </h3>
              <ul className="space-y-2">
                {notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> This dashboard
              contains sample/placeholder data for demonstration purposes. For
              production use, all data should be sourced from official
              government and international organization databases.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Source Card
 */
function SourceCard({ name, url, description }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 flex-shrink-0"
            aria-label={`Visit ${name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
}
