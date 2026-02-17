'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

/**
 * Collapsible Section Component
 * Used for expandable/collapsible content panels in the dashboard
 *
 * @param {string} title - Section title
 * @param {string} subtitle - Optional subtitle/description
 * @param {React.ReactNode} children - Section content
 * @param {boolean} defaultExpanded - Whether section is expanded by default
 * @param {string} id - Optional ID for section (for deep linking)
 */
export default function CollapsibleSection({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  id,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      id={id}
      className="border border-gray-200 rounded-lg overflow-hidden mb-6 bg-white shadow-sm"
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={id ? `${id}-content` : undefined}
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3">
            {/* Icon */}
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Badge - Optional indicator */}
        {!isExpanded && (
          <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
            Click to expand
          </span>
        )}
      </button>

      {/* Content - Expandable */}
      {isExpanded && (
        <div
          id={id ? `${id}-content` : undefined}
          className="px-6 py-6 border-t border-gray-200 bg-gray-50"
        >
          {children}
        </div>
      )}
    </div>
  );
}
