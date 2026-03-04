export function WorkInProgressBanner({ className = '' }) {
  return (
    <div className={`rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm ${className}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
        Work In Progress
      </p>
      <p className="text-base font-semibold text-amber-900 leading-relaxed">
        This section is still being developed. Data and content may contain errors and will be
        corrected as issues are identified.
      </p>
    </div>
  );
}
