import { ArrowRightLeft, Check, X } from 'lucide-react';

import { PARTIES } from '../data/constituencies';

const FLOW_PRESETS = [
  { from: 'UML', to: 'RSP', label: 'UML ➜ RSP' },
  { from: 'NC', to: 'RSP', label: 'NC ➜ RSP' },
  { from: 'Maoist', to: 'RSP', label: 'Maoist ➜ RSP' },
  { from: 'RPP', to: 'RSP', label: 'RPP ➜ RSP' },
  { from: 'JSPN', to: 'RSP', label: 'JSPN ➜ RSP' },
  { from: 'Others', to: 'RSP', label: 'Others ➜ RSP' },
  { from: 'Maoist', to: 'NC', label: 'Maoist ➜ NC' },
  { from: 'NC', to: 'UML', label: 'NC ➜ UML' },
  { from: 'UML', to: 'NC', label: 'UML ➜ NC' },
  { from: 'RPP', to: 'NC', label: 'RPP ➜ NC' },
];

export function SwitchingMatrix({ matrix = {}, onChange, onApply, onClear }) {
  const handleChange = (from, to, val) => {
    const parsed = Number.isFinite(val) ? val : 0;
    onChange?.(from, to, parsed);
  };

  const hasActiveFlows = Object.values(matrix).some(targets => 
    Object.values(targets).some(val => val > 0)
  );

  return (
    <div className="bg-surface rounded-xl border border-neutral p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-800 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Switching Matrix
          </p>
          <h3 className="text-lg font-semibold text-white mt-1">Voter flow table</h3>
        </div>
        <span className="text-xs text-gray-800">Share moved from base vote</span>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {FLOW_PRESETS.map(({ from, to, label }) => {
          const value = matrix?.[from]?.[to] ?? 0;
          return (
            <div key={`${from}-${to}`} className="flex items-center justify-between gap-3 rounded-lg border border-neutral px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PARTIES[from]?.color }} />
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-xs text-gray-500">(of {PARTIES[from]?.short || from} voters)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={value}
                  onChange={(e) => handleChange(from, to, parseFloat(e.target.value))}
                  className="w-20 px-2 py-1 bg-neutral border border-neutral rounded text-right text-sm text-gray-900 focus:outline-none focus:border-gray-500"
                />
                <span className="text-xs text-gray-700">%</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onApply}
          disabled={!hasActiveFlows}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasActiveFlows
              ? 'bg-gradient-to-r from-nc to-rsp text-white hover:opacity-90'
              : 'bg-neutral/50 text-gray-800 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          Apply
        </button>
        <button
          onClick={onClear}
          disabled={!hasActiveFlows}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            hasActiveFlows
              ? 'border-red-400 text-red-400 hover:bg-red-500/10'
              : 'border-neutral text-gray-800 cursor-not-allowed'
          }`}
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
      <p className="text-[11px] text-gray-800">
        Apply updates sliders with voter flow. Values persist after applying.
      </p>
    </div>
  );
}

export default SwitchingMatrix;
