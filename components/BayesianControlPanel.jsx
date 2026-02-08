'use client';

import { TrendingUp, Play, RotateCcw, Zap, Activity, Clock, Plus, Check, TrendingDown } from 'lucide-react';
import { BY_ELECTION_SIGNALS, RECENT_SIGNAL_PRESETS } from '../data/proxySignals';

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

const GENERIC_PRESETS = [
  { id: 'scenario_urban_wave', label: 'Urban Party Surge', description: 'Alternative parties gain in cities' },
  { id: 'scenario_anti_incumbent', label: 'Anti-Incumbent Wave', description: 'Voter frustration with established parties' },
  { id: 'scenario_coalition', label: 'Emerging Coalition', description: 'New political alignment forms' },
];

export function BayesianControlPanel({
  onApplySimulationControls,
  onResetSimulationControls,
  rspStartingPoint = false,
  onRspStartingPointChange,
  selectedParty = 'RSP',
  onSelectedPartyChange,
  incumbencyDecay = 0,
  onIncumbencyDecayChange,
  rspProxyIntensity = 0,
  onRspProxyIntensityChange,
  iterationCount = 1000,
  onIterationCountChange,
  activeSignals = {},
  onToggleSignal,
  onAddPreset,
}) {
  const handleIterationChange = (value) => {
    const numValue = Math.round(Number(value));
    if (numValue >= 100 && numValue <= 5000) {
      onIterationCountChange?.(numValue);
    }
  };

  const getIterationLabel = (count) => {
    if (count < 500) return 'Quick';
    if (count < 1500) return 'Balanced';
    if (count < 3000) return 'Precise';
    return 'Ultra Precise';
  };

  return (
    <div className="bg-surface rounded-xl border border-neutral p-5 space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-800 mb-1">
          Advanced Controls
        </p>
        <h3 className="text-xl font-semibold text-white">Simulation Adjustments</h3>
      </div>

      {/* Incumbency Decay Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300" /> Voter Frustration
          </p>
          <span className="text-xs text-gray-700">{Math.round(incumbencyDecay * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={incumbencyDecay}
          onChange={(e) => onIncumbencyDecayChange?.(parseFloat(e.target.value))}
          className="w-full accent-amber-400"
        />
        <p className="text-[11px] text-gray-800">
          Applies a win-probability penalty to 2022 winners. At 100%, incumbents lose 80% of their advantage.
        </p>
      </div>

      {/* Momentum Projection Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-blue-400 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Momentum Projection
          </p>
          <span className="text-xs text-gray-700">{Math.round(rspProxyIntensity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={rspProxyIntensity}
          onChange={(e) => onRspProxyIntensityChange?.(parseFloat(e.target.value))}
          className="w-full accent-blue-400"
        />
        <p className="text-[11px] text-gray-800">
          Projects selected party&apos;s performance to similar urban districts. At 100%, applies full-slate projection across all constituencies.
        </p>
      </div>

      {/* Monte Carlo Iterations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" /> Monte Carlo Iterations
          </p>
          <span className="text-xs text-gray-700 font-mono">{iterationCount.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={iterationCount}
          onChange={(e) => handleIterationChange(e.target.value)}
          className="w-full accent-purple-400"
        />
        <div className="flex justify-between text-[10px] text-gray-800">
          <span>Quick (100)</span>
          <span className="text-purple-400 font-medium">{getIterationLabel(iterationCount)}</span>
          <span>Precise (5000)</span>
        </div>
        <p className="text-[11px] text-gray-800">
          Number of simulations for uncertainty quantification. Higher values give more accurate probability intervals.
        </p>
      </div>

      {/* By-Election Signals */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-green-400" /> By-Election Signals
        </p>
        <div className="space-y-2">
          {BY_ELECTION_SIGNALS.map((signal) => {
            const isActive = activeSignals[signal.id] || false;
            return (
              <button
                key={signal.id}
                onClick={() => onToggleSignal?.(signal.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-neutral/20 border-neutral text-gray-700 hover:bg-neutral/30'
                }`}
              >
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium">{signal.label}</p>
                  <p className="text-[10px] opacity-70">{signal.note}</p>
                </div>
                {isActive && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-gray-800">
          Apply historical by-election results to similar constituencies as strong likelihood updates.
        </p>
      </div>

      {/* Scenario Presets */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-200">Quick Scenarios</p>
        <div className="flex flex-wrap gap-2">
          {GENERIC_PRESETS.map((preset) => {
            const isActive = activeSignals[preset.id] || false;
            return (
              <button
                key={preset.id}
                onClick={() => onToggleSignal?.(preset.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? 'bg-rsp border-rsp text-white'
                    : 'bg-neutral/20 border-neutral text-gray-700 hover:bg-neutral/30'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-gray-800">
          One-click scenarios for common electoral dynamics across multiple parties.
        </p>
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
        <p className="text-xs text-gray-700">
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
        <p className="text-xs text-gray-700">
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
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-neutral text-gray-700 hover:bg-neutral/70 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

export default BayesianControlPanel;
