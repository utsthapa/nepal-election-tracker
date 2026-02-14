/**
 * Page Header Component
 * Displays page title, description, and metadata
 *
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} lastUpdated - Last update date
 */
export default function PageHeader({ title, description, lastUpdated }) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>

      {description && (
        <p className="text-lg text-gray-600 mb-4 max-w-4xl">{description}</p>
      )}

      {lastUpdated && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Last updated: {lastUpdated}</span>
        </div>
      )}
    </div>
  );
}
