'use client'

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useElectionState } from '../../hooks/useElectionState';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PartySliders } from '../../components/PartySliders';
import { ConstituencyTable } from '../../components/ConstituencyTable';
import { SeatDrawer } from '../../components/SeatDrawer';
import { PRBlockChart } from '../../components/PRBlockChart';
import { MajorityBar } from '../../components/MajorityBar';
import { CoalitionBuilder } from '../../components/CoalitionBuilder';
import { ResultsSummary } from '../../components/ResultsSummary';
import { AllianceModal } from '../../components/AllianceModal';
import { WelcomeModal } from '../../components/WelcomeModal';
import { BayesianControlPanel } from '../../components/BayesianControlPanel';
import { SwitchingMatrix } from '../../components/SwitchingMatrix';
import YearSelector from '../../components/YearSelector';
import { PARTIES } from '../../data/constituencies';
import { IDEOLOGY_COORDS } from '../../data/partyMeta';
import { BY_ELECTION_SIGNALS } from '../../data/proxySignals';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, Unlock, RotateCcw, Target } from 'lucide-react';

// Dynamically import heavy map components with no SSR
const NepalMap = dynamic(() => import('../../components/NepalMap'), {
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false,
});

const ConstituencyMap = dynamic(
  () => import('../../components/ConstituencyMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-surface rounded-lg border border-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-muted text-sm">Loading map...</p>
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
    setIterationCount,
    slidersLocked,
    setSlidersLocked,
  } = useElectionState();

  const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);
  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWelcomeModalOpen(!localStorage.getItem('hasSeenWelcomeModal'));
    }
  }, []);
  const [viewMode, setViewMode] = useState('map');
  const [nepalMapMode, setNepalMapMode] = useState('map');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [rspStartingPoint, setRspStartingPoint] = useState(false);
  const [selectedParty, setSelectedParty] = useState('RSP');

  const activeAlliance = allianceConfig?.enabled && (allianceConfig.parties?.length === 2);
  const [allyA, allyB] = allianceConfig?.parties || [];
  const majorityProb = leadingParty ? (seatIntervals?.[leadingParty]?.majorityProb || 0) : 0;

  const partyColors = {};
  Object.keys(PARTIES).forEach(p => {
    partyColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  const handleApplySwitching = () => {
    const newFptpSliders = { ...fptpSliders };
    const newPrSliders = { ...prSliders };

    Object.entries(switchingMatrix).forEach(([fromParty, targets]) => {
      if (!targets) return;
      Object.entries(targets).forEach(([toParty, percentage]) => {
        if (!percentage || percentage <= 0) return;

        const pct = percentage / 100;

        const fptpFromValue = newFptpSliders[fromParty] || 0;
        const fptpToValue = newFptpSliders[toParty] || 0;
        const fptpTransfer = fptpFromValue * pct;

        newFptpSliders[fromParty] = fptpFromValue - fptpTransfer;
        newFptpSliders[toParty] = fptpToValue + fptpTransfer;

        const prFromValue = newPrSliders[fromParty] || 0;
        const prToValue = newPrSliders[toParty] || 0;
        const prTransfer = prFromValue * pct;

        newPrSliders[fromParty] = prFromValue - prTransfer;
        newPrSliders[toParty] = prToValue + prTransfer;
      });
    });

    Object.entries(newFptpSliders).forEach(([party, value]) => {
      updateFptpSlider(party, value);
    });

    Object.entries(newPrSliders).forEach(([party, value]) => {
      updatePrSlider(party, value);
    });
  };

  const handleClearSwitching = () => {
    Object.keys(switchingMatrix).forEach(fromParty => {
      Object.keys(switchingMatrix[fromParty] || {}).forEach(toParty => {
        updateSwitching(fromParty, toParty, 0);
      });
    });
  };

  const handleApplySimulationControls = () => {
    const newFptpSliders = { ...fptpSliders };
    const newPrSliders = { ...prSliders };

    if (rspStartingPoint) {
      const partyPrShare = prSliders[selectedParty] || 0;
      newFptpSliders[selectedParty] = partyPrShare;
    }

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

    Object.entries(normalizedFptpSliders).forEach(([party, value]) => {
      updateFptpSlider(party, value);
    });

    Object.entries(normalizedPrSliders).forEach(([party, value]) => {
      updatePrSlider(party, value);
    });
  };

  const handleResetSimulationControls = () => {
    setRspStartingPoint(false);
    setSelectedParty('RSP');
    setSlidersLocked(true);
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
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(250, 249, 246)', fontFamily: 'Figtree, sans-serif' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Simulator status bar: leading party + majority + reset */}
        {selectedYear === 2026 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg border border-[rgb(219,211,196)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-6">
              {leadingParty && (
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">Leading</p>
                  <p className={`text-lg font-bold ${partyColors[leadingParty] || 'text-[rgb(24,26,36)]'}`} style={{ fontFamily: 'Lora, serif' }}>
                    {formatPartyLabel(leadingParty)}
                  </p>
                  <p className="text-sm text-[rgb(100,110,130)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {totalSeats[leadingParty]} seats
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Target
                  className={`w-5 h-5 ${hasMajority ? 'text-[#22c55e]' : 'text-[rgb(100,110,130)]'}`}
                />
                <span className={`text-sm font-semibold ${hasMajority ? 'text-[#22c55e]' : 'text-[rgb(100,110,130)]'}`}>
                  {hasMajority ? t('simulator.majority') : t('simulator.hung')}
                </span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-[rgb(219,211,196)]/30 hover:bg-[rgb(219,211,196)]/50 rounded-lg text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] transition-colors text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}

        {/* Alliance / Gathabandan panel */}
        {selectedYear === 2026 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg p-4 border border-[rgb(219,211,196)] flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                  {t('simulator.gathabandan')}
                </p>
                {activeAlliance ? (
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[rgb(24,26,36)]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: PARTIES[allyA]?.color }}>
                        {PARTIES[allyA]?.short || allyA}
                      </span>
                      <span className="text-[rgb(100,110,130)]">+</span>
                      <span className="font-semibold" style={{ color: PARTIES[allyB]?.color }}>
                        {PARTIES[allyB]?.short || allyB}
                      </span>
                    </div>
                    <span className="text-xs text-[rgb(100,110,130)]">
                      Handicap {allianceConfig.handicap}% • {100 - allianceConfig.handicap}% transfer efficiency
                    </span>
                    {compatibility && (
                      <span className="text-xs text-[rgb(100,110,130)]">
                        Compatibility score: {compatibility.score.toFixed(1)}/100
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[rgb(100,110,130)] mt-1">
                    No alliance active. Pair two parties to pool constituency votes with a handicap.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeAlliance && (
                  <button
                    onClick={clearAlliance}
                    className="px-3 py-2 rounded-lg text-sm border border-[rgb(219,211,196)] text-[rgb(24,26,36)] hover:bg-[rgb(219,211,196)]/30 transition-colors font-medium"
                  >
                    Disable
                  </button>
                )}
                <button
                  onClick={() => setAllianceModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white hover:bg-[#991B1B] transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nepal Map */}
        <div className="mb-6">
          <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
          <NepalMap
            fptpResults={selectedYear === 2026 ? fptpResults : null}
            onSelectConstituency={selectConstituency}
            viewMode={nepalMapMode}
            onViewModeChange={setNepalMapMode}
            year={selectedYear}
          />
        </div>

        {/* FPTP and PR Sliders */}
        {selectedYear === 2026 && (
          <>
            <div className="mb-6">
              <div className="flex justify-center mb-3">
                <button
                  onClick={() => setSlidersLocked(!slidersLocked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    slidersLocked
                      ? 'border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]'
                      : 'border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:border-[rgb(24,26,36)]/30 hover:text-[rgb(24,26,36)]'
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
                incumbencyDecay={incumbencyDecay}
                onIncumbencyDecayChange={setIncumbencyDecay}
                rspProxyIntensity={rspProxyIntensity}
                onRspProxyIntensityChange={setRspProxyIntensity}
                iterationCount={iterationCount}
                onIterationCountChange={setIterationCount}
                activeSignals={activeSignals}
                onToggleSignal={toggleSignal}
                onAddPreset={addRecentSignal}
              />
              </div>
              <SwitchingMatrix
                matrix={switchingMatrix}
                onChange={updateSwitching}
                onApply={handleApplySwitching}
                onClear={handleClearSwitching}
              />
            </div>
          </>
        )}

        {/* Summary Charts */}
        {selectedYear === 2026 && (
          <>
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
          </>
        )}

        {/* Constituency Table/Map and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {selectedYear === 2026 && viewMode === 'table' && (
              <ConstituencyTable
                fptpResults={fptpResults}
                overrides={overrides}
                onSelectConstituency={selectConstituency}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            {selectedYear === 2026 && (
              <ResultsSummary
                fptpSeats={fptpSeats}
                prSeats={prSeats}
                totalSeats={totalSeats}
                seatIntervals={seatIntervals}
              />
            )}
          </div>
        </div>

        {/* Override indicator */}
        {selectedYear === 2026 && Object.keys(overrides).length > 0 && (
          <div className="mt-6 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#f59e0b] text-2xl">⚡</span>
              <div>
                <p className="text-[#f59e0b] font-semibold">
                  {Object.keys(overrides).length} constituency{Object.keys(overrides).length > 1 ? 'ies' : ''} manually overridden
                </p>
                <p className="text-[#f59e0b]/70 text-sm">
                  These seats are detached from global slider adjustments
                </p>
              </div>
            </div>
            <button
              onClick={clearAllOverrides}
              className="px-4 py-2 bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#f59e0b] rounded-lg text-sm font-semibold transition-colors"
            >
              Clear All Overrides
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Seat Override Drawer */}
      {selectedYear === 2026 && (
        <SeatDrawer
          constituency={selectedConstituency}
          isOpen={!!selectedConstituency}
          onClose={closeDrawer}
          onOverride={overrideConstituency}
          onClearOverride={clearOverride}
        />
      )}

      {/* Alliance Modal */}
      <AllianceModal
        isOpen={isAllianceModalOpen}
        onClose={() => setAllianceModalOpen(false)}
        allianceConfig={allianceConfig}
        onSave={setAlliance}
        onClear={clearAlliance}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
      />
    </div>
  );
}
