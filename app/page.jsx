'use client'

import { useElectionState } from '../hooks/useElectionState';
import { Header } from '../components/Header';
import { PartySliders } from '../components/PartySliders';
import { ConstituencyTable } from '../components/ConstituencyTable';
import { SeatDrawer } from '../components/SeatDrawer';
import { PRBlockChart } from '../components/PRBlockChart';
import { MajorityBar } from '../components/MajorityBar';
import { ResultsSummary } from '../components/ResultsSummary';

export default function Home() {
  const {
    fptpSliders,
    prSliders,
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
  } = useElectionState();

  const handleReset = () => {
    resetSliders();
    clearAllOverrides();
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
        {/* Top Row - FPTP and PR Sliders Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PartySliders
            title="FPTP Vote Share"
            subtitle="Affects 165 constituency seats"
            sliders={fptpSliders}
            fptpSeats={fptpSeats}
            prSeats={prSeats}
            totalSeats={totalSeats}
            onSliderChange={updateFptpSlider}
            showFptp={true}
          />

          <PartySliders
            title="PR Vote Share"
            subtitle="Affects 110 proportional seats (3% threshold)"
            sliders={prSliders}
            fptpSeats={fptpSeats}
            prSeats={prSeats}
            totalSeats={totalSeats}
            onSliderChange={updatePrSlider}
            showPr={true}
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
          />
        </div>

        {/* Main Content - Constituency Table and Results */}
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
              fptpSliders={fptpSliders}
              prSliders={prSliders}
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
        isOpen={!!selectedConstituency}
        onClose={closeDrawer}
        onOverride={overrideConstituency}
        onClearOverride={clearOverride}
      />
    </div>
  );
}
