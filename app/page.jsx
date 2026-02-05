'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useElectionState } from '../hooks/useElectionState';
import { Header } from '../components/Header';
import { PartySliders } from '../components/PartySliders';
import { ConstituencyTable } from '../components/ConstituencyTable';
import { SeatDrawer } from '../components/SeatDrawer';
import { PRBlockChart } from '../components/PRBlockChart';
import { MajorityBar } from '../components/MajorityBar';
import { CoalitionBuilder } from '../components/CoalitionBuilder';
import { ResultsSummary } from '../components/ResultsSummary';
import { AllianceModal } from '../components/AllianceModal';
import { BayesianControlPanel } from '../components/BayesianControlPanel';
import { SwitchingMatrix } from '../components/SwitchingMatrix';
import { PARTIES } from '../data/constituencies';
import { IDEOLOGY_COORDS } from '../data/partyMeta';
import { BY_ELECTION_SIGNALS } from '../data/proxySignals';
import { useLanguage } from '../context/LanguageContext';
import { Map, Table, Lock, Unlock } from 'lucide-react';

// Dynamically import map component with no SSR
const ConstituencyMap = dynamic(
  () => import('../components/ConstituencyMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-surface rounded-xl border border-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  const { t } = useLanguage();
  const {
    fptpSliders,
    prSliders,
    adjustedFptpSliders,
    adjustedPrSliders,
    overrides,
    selectedConstituency,
    updateFptpSlider,
    updatePrSlider,
    resetSliders,
    overrideConstituency,
    clearOverride,
    clearAllOverrides,
    selectConstituency,
    closeDrawer,
    fptpResults,
    fptpSeats,
    prSeats,
    nationalVoteShares,
    totalSeats,
    seatIntervals,
    seatWinProbabilities,
    femaleQuota,
    stabilityIndex,
    leadingParty,
    hasMajority,
    allianceConfig,
    setAlliance,
    clearAlliance,
    activeSignals,
    toggleSignal,
    addRecentSignal,
    incumbencyDecay,
    setIncumbencyDecay,
    rspProxyIntensity,
    setRspProxyIntensity,
    switchingMatrix,
    updateSwitching,
    prMethod,
    setPrMethod,
    iterationCount,
    slidersLocked,
    setSlidersLocked,
  } = useElectionState();

  const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'table' or 'map'
  const [rspStartingPoint, setRspStartingPoint] = useState(false); // RSP starting point toggle
  const [selectedParty, setSelectedParty] = useState('RSP'); // Party to apply starting point adjustment to

  const activeAlliance = allianceConfig?.enabled && (allianceConfig.parties?.length === 2);
  const [allyA, allyB] = allianceConfig?.parties || [];
  const majorityProb = leadingParty ? (seatIntervals?.[leadingParty]?.majorityProb || 0) : 0;

  const handleApplySwitching = () => {
    // Calculate all new slider values first, then apply them
    const newFptpSliders = { ...fptpSliders };
    const newPrSliders = { ...prSliders };
    
    // Apply switching matrix to both FPTP and PR sliders
    Object.entries(switchingMatrix).forEach(([fromParty, targets]) => {
      if (!targets) return;
      Object.entries(targets).forEach(([toParty, percentage]) => {
        if (!percentage || percentage <= 0) return;
        
        const pct = percentage / 100;
        
        // Calculate FPTP slider changes
        const fptpFromValue = newFptpSliders[fromParty] || 0;
        const fptpToValue = newFptpSliders[toParty] || 0;
        const fptpTransfer = fptpFromValue * pct;
        
        newFptpSliders[fromParty] = fptpFromValue - fptpTransfer;
        newFptpSliders[toParty] = fptpToValue + fptpTransfer;
        
        // Calculate PR slider changes
        const prFromValue = newPrSliders[fromParty] || 0;
        const prToValue = newPrSliders[toParty] || 0;
        const prTransfer = prFromValue * pct;
        
        newPrSliders[fromParty] = prFromValue - prTransfer;
        newPrSliders[toParty] = prToValue + prTransfer;
      });
    });
    
    // Apply all FPTP slider changes
    Object.entries(newFptpSliders).forEach(([party, value]) => {
      updateFptpSlider(party, value);
    });
    
    // Apply all PR slider changes
    Object.entries(newPrSliders).forEach(([party, value]) => {
      updatePrSlider(party, value);
    });
  };

  const handleClearSwitching = () => {
    // Clear all switching matrix values
    Object.keys(switchingMatrix).forEach(fromParty => {
      Object.keys(switchingMatrix[fromParty] || {}).forEach(toParty => {
        updateSwitching(fromParty, toParty, 0);
      });
    });
  };

  const handleApplySimulationControls = () => {
    // Apply all simulation control settings to update sliders
    // This function applies the effects of starting point adjustment

    const newFptpSliders = { ...fptpSliders };
    const newPrSliders = { ...prSliders };

    // Apply Starting Point option - sets selected party's FPTP slider to match PR proportion
    if (rspStartingPoint) {
      // Get selected party's PR vote share from current sliders
      const partyPrShare = prSliders[selectedParty] || 0;
      // Set selected party's FPTP slider to match PR proportion (assumes they run in all seats)
      newFptpSliders[selectedParty] = partyPrShare;
    }

    // Normalize sliders to ensure they sum to 100
    const normalizeSliders = (sliders) => {
      const total = Object.values(sliders).reduce((sum, val) => sum + val, 0);
      if (total === 0) return sliders;
      const normalized = {};
      Object.entries(sliders).forEach(([party, value]) => {
        normalized[party] = (value / total) * 100;
      });
      return normalized;
    };

    const normalizedFptpSliders = normalizeSliders(newFptpSliders);
    const normalizedPrSliders = normalizeSliders(newPrSliders);

    // Apply all FPTP slider changes
    Object.entries(normalizedFptpSliders).forEach(([party, value]) => {
      updateFptpSlider(party, value);
    });

    // Apply all PR slider changes
    Object.entries(normalizedPrSliders).forEach(([party, value]) => {
      updatePrSlider(party, value);
    });
  };

  const handleResetSimulationControls = () => {
    // Reset simulation controls to defaults
    setRspStartingPoint(false);
    setSelectedParty('RSP');
    setSlidersLocked(true);
    // Reset incumbency decay and RSP proxy intensity to baseline (0)
    setIncumbencyDecay(0);
    setRspProxyIntensity(0);
  };
  const computeCompatibility = (a, b) => {
    const pa = IDEOLOGY_COORDS[a];
    const pb = IDEOLOGY_COORDS[b];
    if (!pa || !pb) return null;
    const d = Math.sqrt(
      Math.pow(pa.econ - pb.econ, 2) +
      Math.pow(pa.federal - pb.federal, 2) +
      Math.pow(pa.geo - pb.geo, 2)
    );
    const score = Math.max(0, 100 - d * 100);
    return { distance: d, score };
  };
  const compatibility = activeAlliance ? computeCompatibility(allyA, allyB) : null;

  const handleReset = () => {
    resetSliders();
    clearAllOverrides();
    clearAlliance();
    setSlidersLocked(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        totalSeats={totalSeats}
        leadingParty={leadingParty}
        hasMajority={hasMajority}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Alliance / Gathabandan panel */}
        <div className="mb-6">
          <div className="bg-surface rounded-xl p-4 border border-neutral flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                {t('simulator.gathabandan')}
              </p>
              {activeAlliance ? (
                <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color: PARTIES[allyA]?.color }}>
                      {PARTIES[allyA]?.short || allyA}
                    </span>
                    <span className="text-gray-500">+</span>
                    <span className="font-semibold" style={{ color: PARTIES[allyB]?.color }}>
                      {PARTIES[allyB]?.short || allyB}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Handicap {allianceConfig.handicap}% • {100 - allianceConfig.handicap}% transfer efficiency
                  </span>
                  {compatibility && (
                    <span className="text-xs text-gray-400">
                      Compatibility score: {compatibility.score.toFixed(1)}/100
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  No alliance active. Pair two parties to pool constituency votes with a handicap.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeAlliance && (
                <button
                  onClick={clearAlliance}
                  className="px-3 py-2 rounded-lg text-sm border border-neutral text-gray-200 hover:bg-neutral/70 transition-colors"
                >
                  Disable
                </button>
              )}
              <button
                onClick={() => setAllianceModalOpen(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-nc to-rsp text-white hover:opacity-90 transition-opacity"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Top Row - FPTP and PR Sliders Side by Side with Lock Toggle */}
        <div className="mb-6">
          {/* Lock toggle button - centered above sliders */}
          <div className="flex justify-center mb-3">
            <button
              onClick={() => setSlidersLocked(!slidersLocked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                slidersLocked
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-neutral text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
              title={slidersLocked ? 'Unlock sliders (FPTP and PR move independently)' : 'Lock sliders (FPTP and PR move together)'}
            >
              {slidersLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {slidersLocked ? 'Sliders Locked' : 'Sliders Unlocked'}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PartySliders
              title={t('simulator.fptp')}
              subtitle="Affects 165 constituency seats"
              sliders={adjustedFptpSliders}
              fptpSeats={fptpSeats}
              prSeats={prSeats}
              totalSeats={totalSeats}
              onSliderChange={updateFptpSlider}
              showFptp={true}
            />

            <PartySliders
              title={t('simulator.pr')}
              subtitle="Affects 110 proportional seats (3% threshold)"
              sliders={adjustedPrSliders}
              fptpSeats={fptpSeats}
              prSeats={prSeats}
              totalSeats={totalSeats}
              onSliderChange={updatePrSlider}
              showPr={true}
            />
          </div>
        </div>

        {/* Bayesian controls + switching matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
          <BayesianControlPanel
            onApplySimulationControls={handleApplySimulationControls}
            onResetSimulationControls={handleResetSimulationControls}
            rspStartingPoint={rspStartingPoint}
            onRspStartingPointChange={setRspStartingPoint}
            selectedParty={selectedParty}
            onSelectedPartyChange={setSelectedParty}
          />
          </div>
          <SwitchingMatrix
            matrix={switchingMatrix}
            onChange={updateSwitching}
            onApply={handleApplySwitching}
            onClear={handleClearSwitching}
          />
        </div>

        {/* Middle Row - Summary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MajorityBar
            totalSeats={totalSeats}
            leadingParty={leadingParty}
          />

          <PRBlockChart
            prSeats={prSeats}
            nationalVoteShares={nationalVoteShares}
            method={prMethod}
          />
        </div>

        {/* Coalition builder */}
        <div className="mb-6">
          <CoalitionBuilder
            totalSeats={totalSeats}
            fptpResults={fptpResults}
          />
        </div>

        {/* Main Content - Constituency Table/Map and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Constituencies</h2>
              <div className="flex items-center gap-1 bg-neutral/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-surface text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-surface text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>

            {/* Table or Map View */}
            {viewMode === 'table' ? (
              <ConstituencyTable
                fptpResults={fptpResults}
                overrides={overrides}
                onSelectConstituency={selectConstituency}
              />
            ) : (
              <ConstituencyMap
                onSelectConstituency={selectConstituency}
                selectedConstituencyId={selectedConstituency?.id}
                fptpResults={fptpResults}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <ResultsSummary
              fptpSeats={fptpSeats}
              prSeats={prSeats}
              totalSeats={totalSeats}
              seatIntervals={seatIntervals}
            />
          </div>
        </div>

        {/* Override indicator */}
        {Object.keys(overrides).length > 0 && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-2xl">⚡</span>
              <div>
                <p className="text-amber-400 font-medium">
                  {Object.keys(overrides).length} constituency{Object.keys(overrides).length > 1 ? 'ies' : ''} manually overridden
                </p>
                <p className="text-amber-400/60 text-sm">
                  These seats are detached from global slider adjustments
                </p>
              </div>
            </div>
            <button
              onClick={clearAllOverrides}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm font-medium transition-colors"
            >
              Clear All Overrides
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div>
              <p className="font-mono">Nepal Election Simulator</p>
              <p className="text-xs mt-1">
                Based on 2022 General Election baseline data • 165 FPTP + 110 PR seats
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Seat Override Drawer */}
      <SeatDrawer
        constituency={selectedConstituency}
        isOpen={!!selectedConstituency}
        onClose={closeDrawer}
        onOverride={overrideConstituency}
        onClearOverride={clearOverride}
      />

      <AllianceModal
        isOpen={isAllianceModalOpen}
        onClose={() => setAllianceModalOpen(false)}
        allianceConfig={allianceConfig}
        onSave={setAlliance}
        onClear={clearAlliance}
      />
    </div>
  );
}
