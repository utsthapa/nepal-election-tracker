'use client';

import { TrendingUp } from 'lucide-react';

import { SwitchingMatrix } from './SwitchingMatrix';

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

export function AdvancedControls({
  rspStartingPoint = false,
  onRspStartingPointChange,
  selectedParty = 'RSP',
  onSelectedPartyChange,
  demographicMode = false,
  overrideDemographics = false,
  onOverrideDemographicsChange,
  switchingMatrix = {},
  onUpdateSwitching,
  onApplySwitching,
  onClearSwitching,
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-800 mb-1">
          Advanced Settings
        </p>
        <h3 className="text-xl font-semibold text-white">Fine-tune voter behavior and party dynamics</h3>
        <p className="text-sm text-gray-400 mt-2">
          Configure voter migration patterns and adjust baseline assumptions for more realistic scenarios.
        </p>
      </div>

      {/* Starting Point Mode */}
      <div className={`p-4 rounded-lg border ${PARTY_BG_COLORS[selectedParty]}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${PARTY_COLORS[selectedParty]} flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5" /> Starting Point Mode
            </p>
            <button
              onClick={() => onRspStartingPointChange?.(!rspStartingPoint)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                rspStartingPoint ? `bg-${selectedParty.toLowerCase()}` : 'bg-gray-600'
              }`}
              aria-label={`Toggle Starting Point Mode ${rspStartingPoint ? 'off' : 'on'}`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  rspStartingPoint ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Party Selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="party-selector" className="text-xs text-gray-400 whitespace-nowrap">
              Apply to:
            </label>
            <select
              id="party-selector"
              value={selectedParty}
              onChange={(e) => onSelectedPartyChange?.(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-neutral border border-neutral text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
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
            When enabled, sets the selected party&apos;s FPTP slider to match their PR vote share.
            Useful for modeling scenarios where a party runs candidates in all constituencies.
          </p>

          {demographicMode && (
            <div className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2">
              <p className="text-xs text-amber-900">
                Demographics mode is active. Advanced controls won&apos;t affect FPTP outcomes unless you override it.
              </p>
              <label className="mt-2 flex items-center gap-2 text-xs text-amber-900">
                <input
                  type="checkbox"
                  checked={overrideDemographics}
                  onChange={(e) => onOverrideDemographicsChange?.(e.target.checked)}
                />
                Override demographics when applying advanced controls
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Switching Matrix */}
      <SwitchingMatrix
        matrix={switchingMatrix}
        onChange={onUpdateSwitching}
        onApply={onApplySwitching}
        onClear={onClearSwitching}
      />
    </div>
  );
}

export default AdvancedControls;
