'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useElectionState } from '../hooks/useElectionState';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PartySliders } from '../components/PartySliders';
import { ConstituencyTable } from '../components/ConstituencyTable';
import { SeatDrawer } from '../components/SeatDrawer';
import { PRBlockChart } from '../components/PRBlockChart';
import { MajorityBar } from '../components/MajorityBar';
import { CoalitionBuilder } from '../components/CoalitionBuilder';
import { ResultsSummary } from '../components/ResultsSummary';
import { AllianceModal } from '../components/AllianceModal';
import { WelcomeModal } from '../components/WelcomeModal';
import { BayesianControlPanel } from '../components/BayesianControlPanel';
import { SwitchingMatrix } from '../components/SwitchingMatrix';
import YearSelector from '../components/YearSelector';
import { PARTIES } from '../data/constituencies';
import { IDEOLOGY_COORDS } from '../data/partyMeta';
import { BY_ELECTION_SIGNALS } from '../data/proxySignals';
import { useLanguage } from '../context/LanguageContext';
import { Map, Table, Lock, Unlock, RotateCcw, Target } from 'lucide-react';
import NepalMap from '../components/NepalMap';

// Dynamically import map component with no SSR
const ConstituencyMap = dynamic(
  () => import('../components/ConstituencyMap'),
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
    slidersLocked,
    setSlidersLocked,
  } = useElectionState();

  const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);
  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hasSeenWelcomeModal');
    }
    return true;
  });
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Simulator status bar: leading party + majority + reset */}
        {selectedYear === 2026 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-surface rounded-lg border border-neutral px-4 py-3">
            <div className="flex items-center gap-6">
              {leadingParty && (
                <div>
                  <p className="section-label">Leading</p>
                  <p className={`text-lg font-bold ${partyColors[leadingParty] || 'text-foreground'}`}>
                    {formatPartyLabel(leadingParty)}
                  </p>
                  <p className="text-sm font-mono text-muted">
                    {totalSeats[leadingParty]} seats
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Target
                  className={`w-5 h-5 ${hasMajority ? 'text-green-500' : 'text-muted'}`}
                />
                <span className={`text-sm font-medium ${hasMajority ? 'text-green-500' : 'text-muted'}`}>
                  {hasMajority ? t('simulator.majority') : t('simulator.hung')}
                </span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-neutral/50 hover:bg-neutral rounded-lg text-muted hover:text-foreground transition-colors text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}

        {/* Alliance / Gathabandan panel */}
        {selectedYear === 2026 && (
          <div className="mb-6">
            <div className="bg-surface rounded-lg p-4 border border-neutral flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="section-label">
                  {t('simulator.gathabandan')}
                </p>
                {activeAlliance ? (
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: PARTIES[allyA]?.color }}>
                        {PARTIES[allyA]?.short || allyA}
                      </span>
                      <span className="text-muted">+</span>
                      <span className="font-semibold" style={{ color: PARTIES[allyB]?.color }}>
                        {PARTIES[allyB]?.short || allyB}
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      Handicap {allianceConfig.handicap}% • {100 - allianceConfig.handicap}% transfer efficiency
                    </span>
                    {compatibility && (
                      <span className="text-xs text-muted">
                        Compatibility score: {compatibility.score.toFixed(1)}/100
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted mt-1">
                    No alliance active. Pair two parties to pool constituency votes with a handicap.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeAlliance && (
                  <button
                    onClick={clearAlliance}
                    className="px-3 py-2 rounded-lg text-sm border border-neutral text-foreground hover:bg-neutral/50 transition-colors"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    slidersLocked
                      ? 'border-amber-400 bg-amber-500/20 text-amber-600 dark:text-amber-300'
                      : 'border-neutral text-muted hover:border-foreground/30 hover:text-foreground'
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
            {selectedYear === 2026 && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Constituencies</h2>
                <div className="flex items-center gap-1 bg-neutral/50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-surface text-foreground'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <Table className="w-4 h-4" />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'map'
                        ? 'bg-surface text-foreground'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    Map
                  </button>
                </div>
              </div>
            )}

            {selectedYear === 2026 && viewMode === 'table' && (
              <ConstituencyTable
                fptpResults={fptpResults}
                overrides={overrides}
                onSelectConstituency={selectConstituency}
              />
            )}
          </div>

          <div className="lg:col-span-1">
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
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-amber-500 text-2xl">⚡</span>
              <div>
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  {Object.keys(overrides).length} constituency{Object.keys(overrides).length > 1 ? 'ies' : ''} manually overridden
                </p>
                <p className="text-amber-600/60 dark:text-amber-400/60 text-sm">
                  These seats are detached from global slider adjustments
                </p>
              </div>
            </div>
            <button
              onClick={clearAllOverrides}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-medium transition-colors"
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
