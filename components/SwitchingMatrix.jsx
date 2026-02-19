import { ArrowRightLeft, Check, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { PARTIES } from '../data/constituencies';

export function SwitchingMatrix({ matrix = {}, onChange, onApply, onClear, onOpenAlliance }) {
  const partyKeys = useMemo(() => Object.keys(PARTIES), []);
  const [draftFrom, setDraftFrom] = useState('NC');
  const [draftTo, setDraftTo] = useState('RSP');
  const [draftValue, setDraftValue] = useState(5);

  useEffect(() => {
    if (draftFrom === draftTo) {
      const fallback = partyKeys.find(party => party !== draftFrom) || 'RSP';
      setDraftTo(fallback);
    }
  }, [draftFrom, draftTo, partyKeys]);

  const flowRows = useMemo(() => {
    const rows = [];
    Object.entries(matrix).forEach(([fromParty, targets]) => {
      Object.entries(targets || {}).forEach(([toParty, value]) => {
        if (typeof value === 'number' && value > 0) {
          rows.push({ fromParty, toParty, value });
        }
      });
    });
    return rows.sort((a, b) => {
      if (a.fromParty === b.fromParty) {
        return a.toParty.localeCompare(b.toParty);
      }
      return a.fromParty.localeCompare(b.fromParty);
    });
  }, [matrix]);

  const hasActiveFlows = flowRows.length > 0;

  const handleAddFlow = () => {
    if (!draftFrom || !draftTo || draftFrom === draftTo) {
      return;
    }
    const safeValue = Math.max(0, Math.min(100, Number(draftValue) || 0));
    onChange?.(draftFrom, draftTo, safeValue);
  };

  const handleUpdateFlow = (fromParty, toParty, rawValue) => {
    const safeValue = Math.max(0, Math.min(100, Number(rawValue) || 0));
    onChange?.(fromParty, toParty, safeValue);
  };

  const handleRemoveFlow = (fromParty, toParty) => {
    onChange?.(fromParty, toParty, 0);
  };

  return (
    <div className="bg-surface rounded-xl border border-neutral p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-800 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Switching Matrix
          </p>
          <h3 className="text-lg font-semibold text-white mt-1">Add party-to-party voter flows</h3>
        </div>
        <span className="text-xs text-gray-800">% moved from origin party base</span>
      </div>

      <div className="rounded-lg border border-neutral p-3 bg-neutral/20 space-y-3">
        <p className="text-xs text-gray-700">Add flow link</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select
            value={draftFrom}
            onChange={e => setDraftFrom(e.target.value)}
            className="px-2 py-2 rounded border border-neutral bg-surface text-sm text-gray-900"
          >
            {partyKeys.map(party => (
              <option key={`from-${party}`} value={party}>
                {PARTIES[party]?.short || party}
              </option>
            ))}
          </select>

          <select
            value={draftTo}
            onChange={e => setDraftTo(e.target.value)}
            className="px-2 py-2 rounded border border-neutral bg-surface text-sm text-gray-900"
          >
            {partyKeys
              .filter(party => party !== draftFrom)
              .map(party => (
                <option key={`to-${party}`} value={party}>
                  {PARTIES[party]?.short || party}
                </option>
              ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={draftValue}
              onChange={e => setDraftValue(e.target.value)}
              className="w-full px-2 py-2 rounded border border-neutral bg-surface text-sm text-right text-gray-900"
            />
            <span className="text-xs text-gray-700">%</span>
          </div>

          <button
            onClick={handleAddFlow}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#B91C1C] text-white text-sm font-semibold hover:bg-[#991B1B]"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        {flowRows.length === 0 && (
          <p className="text-sm text-gray-700 rounded-lg border border-dashed border-neutral p-3">
            No voter-flow links yet. Add one above.
          </p>
        )}
        {flowRows.map(({ fromParty, toParty, value }) => (
          <div
            key={`${fromParty}-${toParty}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: PARTIES[fromParty]?.color }}
              />
              <span className="text-sm text-gray-700">
                {PARTIES[fromParty]?.short || fromParty} {'->'}{' '}
                {PARTIES[toParty]?.short || toParty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={value}
                onChange={e => handleUpdateFlow(fromParty, toParty, e.target.value)}
                className="w-20 px-2 py-1 bg-neutral border border-neutral rounded text-right text-sm text-gray-900"
              />
              <span className="text-xs text-gray-700">%</span>
              <button
                onClick={() => handleRemoveFlow(fromParty, toParty)}
                className="p-1.5 rounded border border-neutral text-gray-700 hover:text-red-600 hover:border-red-300"
                aria-label={`Remove ${fromParty} to ${toParty} flow`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onApply}
          disabled={!hasActiveFlows}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            hasActiveFlows
              ? 'bg-gradient-to-r from-nc to-rsp text-white hover:opacity-90'
              : 'bg-neutral/50 text-gray-800 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          Apply flows
        </button>
        <button
          onClick={onOpenAlliance}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-neutral text-gray-700 hover:bg-neutral/60"
        >
          Configure Gathbandan
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
          Clear all
        </button>
      </div>
    </div>
  );
}

export default SwitchingMatrix;
