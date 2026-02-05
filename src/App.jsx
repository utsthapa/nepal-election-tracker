import { useState } from 'react';
import { useElectionState } from './hooks/useElectionState';
import { Header } from './components/Header';
import { PartySliders } from './components/PartySliders';
import { ConstituencyTable } from './components/ConstituencyTable';
import { SeatDrawer } from './components/SeatDrawer';
import { PRBlockChart } from './components/PRBlockChart';
import { MajorityBar } from './components/MajorityBar';
import { ResultsSummary } from './components/ResultsSummary';
import { AllianceModal } from './components/AllianceModal';
import { PARTIES } from './data/constituencies';

function App() {
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
    leadingParty,
    hasMajority,
    allianceConfig,
    setAlliance,
    clearAlliance,
  } = useElectionState();

  const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);

  const activeAlliance = allianceConfig?.enabled && (allianceConfig.parties?.length === 2);
  const [allyA, allyB] = allianceConfig?.parties || [];

  const handleReset = () => {
    resetSliders();
    clearAllOverrides();
    clearAlliance();
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
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Gathabandan Mode</p>
              {activeAlliance ? (
                <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color: PARTIES[allyA]?.color }}>{PARTIES[allyA]?.short || allyA}</span>
                    <span className="text-gray-500">+</span>
                    <span className="font-semibold" style={{ color: PARTIES[allyB]?.color }}>{PARTIES[allyB]?.short || allyB}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Handicap {allianceConfig.handicap}% • {100 - allianceConfig.handicap}% transfer efficiency
                  </span>
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

        {/* Top Row - FPTP and PR Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PartySliders
            title="FPTP Vote Share"
            subtitle="Affects 165 constituency seats"
            sliders={adjustedFptpSliders}
            fptpSeats={fptpSeats}
            prSeats={prSeats}
            totalSeats={totalSeats}
            onSliderChange={updateFptpSlider}
            showFptp={true}
          />

          <PartySliders
            title="PR Vote Share"
            subtitle="Affects 110 proportional seats (3% threshold)"
            sliders={adjustedPrSliders}
            fptpSeats={fptpSeats}
            prSeats={prSeats}
            totalSeats={totalSeats}
            onSliderChange={updatePrSlider}
            showPr={true}
          />
        </div>

        {/* Middle Row - Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MajorityBar
            totalSeats={totalSeats}
            leadingParty={leadingParty}
          />

          <PRBlockChart
            prSeats={prSeats}
            nationalVoteShares={nationalVoteShares}
          />
        </div>

        {/* Main Content - Constituency Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ConstituencyTable
              fptpResults={fptpResults}
              overrides={overrides}
              onSelectConstituency={selectConstituency}
            />
          </div>

          <div className="lg:col-span-1">
            <ResultsSummary
              fptpSeats={fptpSeats}
              prSeats={prSeats}
              totalSeats={totalSeats}
              fptpSliders={adjustedFptpSliders}
              prSliders={adjustedPrSliders}
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
            <div className="text-right">
              <p>Electoral System: Mixed Member Proportional</p>
              <p className="text-xs mt-1">
                PR allocation uses Sainte-Laguë method with 3% threshold
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Seat Override Drawer */}
      <SeatDrawer
        constituency={selectedConstituency}
        fptpResults={fptpResults}
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

export default App;
