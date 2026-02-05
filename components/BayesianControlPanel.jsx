'use client';

import { TrendingUp, Play, RotateCcw } from 'lucide-react';

const PARTY_COLORS = {
  'RSP': 'text-rsp',
  'NC': 'text-nc',
  'UML': 'text-uml',
  'Maoist': 'text-maoist',
  'JSPN': 'text-jspn',
  'US': 'text-us',
  'JP': 'text-jp',
  'RPP': 'text-rpp',
  'LSP': 'text-lsp',
  'NUP': 'text-nup',
  'Others': 'text-others',
};

const PARTY_BG_COLORS = {
  'RSP': 'bg-rsp/5 border-rsp/20',
  'NC': 'bg-nc/5 border-nc/20',
  'UML': 'bg-uml/5 border-uml/20',
  'Maoist': 'bg-maoist/5 border-maoist/20',
  'JSPN': 'bg-jspn/5 border-jspn/20',
  'US': 'bg-us/5 border-us/20',
  'JP': 'bg-jp/5 border-jp/20',
  'RPP': 'bg-rpp/5 border-rpp/20',
  'LSP': 'bg-lsp/5 border-lsp/20',
  'NUP': 'bg-nup/5 border-nup/20',
  'Others': 'bg-others/5 border-others/20',
};

export function BayesianControlPanel({
  onApplySimulationControls,
  onResetSimulationControls,
  rspStartingPoint = false,
  onRspStartingPointChange,
  selectedParty = 'RSP',
  onSelectedPartyChange,
}) {
  return (
    <div className="bg-surface rounded-xl border border-neutral p-5 space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-1">
          Advanced Controls
        </p>
        <h3 className="text-xl font-semibold text-white">Simulation Adjustments</h3>
      </div>

      {/* Party Selector */}
      <div className={`space-y-3 p-4 rounded-lg ${PARTY_BG_COLORS[selectedParty]}`}>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${PARTY_COLORS[selectedParty]} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" /> Apply To Party
          </p>
          <select
            value={selectedParty}
            onChange={(e) => onSelectedPartyChange?.(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-medium border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="RSP">RSP (Rastriya Swatantra Party)</option>
            <option value="NC">NC (Nepali Congress)</option>
            <option value="UML">UML (CPN-UML)</option>
            <option value="Maoist">Maoist Centre</option>
            <option value="JSPN">JSPN (Janata Samajbadi Party)</option>
            <option value="US">US (Unified Socialist)</option>
            <option value="JP">JP (Janamat Party)</option>
            <option value="RPP">RPP (Rastriya Prajatantra Party)</option>
            <option value="LSP">LSP (Loktantrik Samajbadi Party)</option>
            <option value="NUP">NUP (Nagrik Unmukti Party)</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <p className="text-xs text-gray-400">
          Select which party to apply the starting point adjustment to. The adjustment will set the selected party&apos;s FPTP slider to match their PR vote share.
        </p>
      </div>

      {/* Starting Point Toggle */}
      <div className={`space-y-3 p-4 rounded-lg ${PARTY_BG_COLORS[selectedParty]}`}>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${PARTY_COLORS[selectedParty]} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" /> Starting Point Mode
          </p>
          <button
            onClick={() => onRspStartingPointChange?.(!rspStartingPoint)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              rspStartingPoint ? 'bg-rsp' : 'bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                rspStartingPoint ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-gray-400">
          When enabled, sets the selected party&apos;s FPTP slider to match their PR vote share (assumes they run in all seats).
        </p>
      </div>

      {/* Apply and Reset Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onApplySimulationControls}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-nc to-rsp text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <Play className="w-4 h-4" />
          Apply Adjustments
        </button>
        <button
          onClick={onResetSimulationControls}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-neutral text-gray-300 hover:bg-neutral/70 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

export default BayesianControlPanel;
