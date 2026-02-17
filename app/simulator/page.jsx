'use client'

import { Lock, RotateCcw, Target, Unlock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AdvancedControls } from '../../components/AdvancedControls';
import { AllianceModal } from '../../components/AllianceModal';
import { BattlegroundPanel } from '../../components/BattlegroundPanel';
import { CoalitionBuilder } from '../../components/CoalitionBuilder';
import { ConstituencyTable } from '../../components/ConstituencyTable';
import { Election2026InfoPanel } from '../../components/Election2026InfoPanel';
import DemographicInputPanel from '../../components/ElectionSimulation/DemographicInputPanel';
import { ExportButton } from '../../components/ExportButton';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { MajorityBar } from '../../components/MajorityBar';
import { PartySliders } from '../../components/PartySliders';
import { PRBlockChart } from '../../components/PRBlockChart';
import { QuickStartModal } from '../../components/QuickStartModal';
import { ResultsSummary } from '../../components/ResultsSummary';
import { SeatCalculator } from '../../components/SeatCalculator';
import { SeatDrawer } from '../../components/SeatDrawer';
import { ShareButton } from '../../components/ShareButton';
import { SwingPanel } from '../../components/SwingPanel';
import { VoterFlowDiagram } from '../../components/VoterFlowDiagram';
import YearSelector from '../../components/YearSelector';
import { useLanguage } from '../../context/LanguageContext';
import { OFFICIAL_FPTP_VOTE, OFFICIAL_PR_VOTE, PARTIES, PROVINCES, constituencies } from '../../data/constituencies';
import { IDEOLOGY_COORDS } from '../../data/partyMeta';
import { useElectionState } from '../../hooks/useElectionState';
import { get2026ElectionData, getPartyColor } from '../../utils/election2026Data';

// Dynamically import heavy map components with no SSR
const NepalMap = dynamic(() => import('../../components/NepalMap'), {
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false,
});

const GUIDED_CONTROL_LABELS = {
  manual: 'Manual Vote Sliders',
  demographics: 'Demographic Modeling',
  advanced: 'Advanced Dynamics',
};
const DATA_FLOW_STEPS = [
  'Set Scope',
  'Explore Patterns',
  'Final Insight',
];

const normalizeConstituencyName = (value) => {
  if (!value || typeof value !== 'string') {return '';}
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const resolveCandidatePartyColor = (partyNameOrCode) => {
  const byUtils = getPartyColor(partyNameOrCode);
  if (byUtils !== '#6b7280') {return byUtils;}

  const direct = PARTIES[partyNameOrCode];
  if (direct?.color) {return direct.color;}

  const byShort = Object.values(PARTIES).find((party) => party.short === partyNameOrCode);
  return byShort?.color || '#6b7280';
};

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
    replaceSliders,
    setFptpToPr,
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
    leadingParty,
    hasMajority,
    allianceConfig,
    setAlliance,
    clearAlliance,
    switchingMatrix,
    updateSwitching,
    prMethod,
    slidersLocked,
    setSlidersLocked,
    // Demographic modeling
    demographicMode,
    demographicPatterns,
    demographicTurnout,
    activeScenario,
    savedScenarios,
    activeDemographicDimension,
    setDemographicMode,
    setActiveDemographicDimension,
    updateDemographicPattern,
    updateDemographicTurnout,
    loadScenario,
    saveScenario,
    deleteScenario,
    clearDemographicInputs,
    PRESET_SCENARIOS,
  } = useElectionState();

  const screenshotRef = useRef(null);
  const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);
  const [isQuickStartOpen, setQuickStartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQuickStartOpen(!localStorage.getItem('hasSeenQuickStart'));
    }
  }, []);
  const [nepalMapMode, setNepalMapMode] = useState('map');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [rspStartingPoint, setRspStartingPoint] = useState(false);
  const [selectedParty, setSelectedParty] = useState('RSP');
  const [overrideDemographicsForAdvanced, setOverrideDemographicsForAdvanced] = useState(false);
  const [guidedFlowEnabled, setGuidedFlowEnabled] = useState(true);
  const [guidedStep, setGuidedStep] = useState(0); // 0: mode, 1: controls, 2: configure, 3: results
  const [experienceMode, setExperienceMode] = useState(null); // 'simulation' | 'data'
  const [selectedSimulationControls, setSelectedSimulationControls] = useState({
    manual: true,
    demographics: false,
    advanced: false,
  });
  const [guidedControlIndex, setGuidedControlIndex] = useState(0);
  const [dataFlowStep, setDataFlowStep] = useState(0); // 0: filters, 1: explore, 2: insight
  const [dataProvinceFilter, setDataProvinceFilter] = useState('all');
  const [dataWinnerFilter, setDataWinnerFilter] = useState('all');
  const [dataSearch, setDataSearch] = useState('');
  const [dataBattlegroundOnly, setDataBattlegroundOnly] = useState(false);

  const activeAlliance = allianceConfig?.enabled && (allianceConfig.parties?.length === 2);
  const [allyA, allyB] = allianceConfig?.parties || [];
  const election2026Data = useMemo(() => get2026ElectionData(), []);
  const keyBattlegrounds = election2026Data?.key_battlegrounds || [];
  const battlegroundNameSet = useMemo(() => (
    new Set(keyBattlegrounds.map((battle) => normalizeConstituencyName(battle.constituency)))
  ), [keyBattlegrounds]);
  const constituencyByNormalizedName = useMemo(() => {
    const map = new Map();
    constituencies.forEach((c) => {
      map.set(normalizeConstituencyName(c.name), c);
    });
    return map;
  }, []);
  const enabledSimulationControls = Object.entries(selectedSimulationControls)
    .filter(([, enabled]) => enabled)
    .map(([control]) => control);
  const currentGuidedControl = enabledSimulationControls[guidedControlIndex] || 'manual';
  const inGuidedSimulation = guidedFlowEnabled && experienceMode === 'simulation';
  const inGuidedData = guidedFlowEnabled && experienceMode === 'data';
  const showControlSetupStep = inGuidedSimulation && guidedStep === 2;
  const showResultSections = selectedYear === 2026 && !inGuidedData && (!inGuidedSimulation || guidedStep >= 3);
  const showControlsSection = selectedYear === 2026 && (!inGuidedSimulation || guidedStep >= 2) && !inGuidedData;
  const dataRows = useMemo(() => {
    return constituencies.map((c) => {
      const normalizedName = normalizeConstituencyName(c.name);
      const simulatedWinner = selectedYear === 2026 ? (fptpResults[c.id]?.winner || c.winner2022) : c.winner2022;
      return {
        id: c.id,
        name: c.name,
        province: c.province,
        district: c.district,
        winner: simulatedWinner,
        margin: c.margin || 0,
        isBattleground: battlegroundNameSet.has(normalizedName),
      };
    });
  }, [selectedYear, fptpResults, battlegroundNameSet]);

  const filteredDataRows = useMemo(() => {
    const searchNeedle = dataSearch.trim().toLowerCase();
    return dataRows.filter((row) => {
      if (dataProvinceFilter !== 'all' && String(row.province) !== dataProvinceFilter) {return false;}
      if (dataWinnerFilter !== 'all' && row.winner !== dataWinnerFilter) {return false;}
      if (dataBattlegroundOnly && !row.isBattleground) {return false;}
      if (!searchNeedle) {return true;}
      return `${row.name} ${row.district}`.toLowerCase().includes(searchNeedle);
    });
  }, [dataRows, dataProvinceFilter, dataWinnerFilter, dataBattlegroundOnly, dataSearch]);

  const filteredWinnerCounts = useMemo(() => {
    const counts = {};
    filteredDataRows.forEach((row) => {
      counts[row.winner] = (counts[row.winner] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);
  }, [filteredDataRows]);

  const filteredAvgMargin = useMemo(() => {
    if (filteredDataRows.length === 0) {return 0;}
    return filteredDataRows.reduce((sum, row) => sum + row.margin, 0) / filteredDataRows.length;
  }, [filteredDataRows]);

  const filteredBattlegroundRows = useMemo(() => {
    return filteredDataRows.filter((row) => row.isBattleground).sort((a, b) => a.margin - b.margin);
  }, [filteredDataRows]);

  const filteredBattlegroundCards = useMemo(() => {
    const allowed = new Set(filteredBattlegroundRows.map((row) => normalizeConstituencyName(row.name)));
    return keyBattlegrounds.filter((battle) => allowed.has(normalizeConstituencyName(battle.constituency)));
  }, [filteredBattlegroundRows, keyBattlegrounds]);
  const topCloseSeats = useMemo(() => {
    return [...filteredDataRows]
      .sort((a, b) => a.margin - b.margin)
      .slice(0, 8);
  }, [filteredDataRows]);

  const partyColors = {};
  Object.keys(PARTIES).forEach(p => {
    partyColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  const applySwitchingMatrixToSliders = (baseSliders) => {
    const parties = Object.keys(baseSliders || {});
    const deltas = Object.fromEntries(parties.map(party => [party, 0]));

    Object.entries(switchingMatrix).forEach(([fromParty, targets]) => {
      if (!targets || !parties.includes(fromParty)) {return;}

      const baseFrom = baseSliders[fromParty] || 0;
      if (baseFrom <= 0) {return;}

      const validTargets = Object.entries(targets)
        .filter(([toParty, percentage]) => (
          parties.includes(toParty) &&
          toParty !== fromParty &&
          typeof percentage === 'number' &&
          percentage > 0
        ))
        .map(([toParty, percentage]) => [toParty, Math.min(100, percentage)]);

      if (validTargets.length === 0) {return;}

      const totalRequestedPct = validTargets.reduce((sum, [, percentage]) => sum + percentage, 0);
      const scale = totalRequestedPct > 100 ? (100 / totalRequestedPct) : 1;

      let totalOut = 0;
      validTargets.forEach(([toParty, percentage]) => {
        const pct = (percentage * scale) / 100;
        const transfer = baseFrom * pct;
        deltas[toParty] += transfer;
        totalOut += transfer;
      });

      deltas[fromParty] -= totalOut;
    });

    const result = {};
    parties.forEach((party) => {
      result[party] = Math.max(0, (baseSliders[party] || 0) + (deltas[party] || 0));
    });

    const total = Object.values(result).reduce((sum, value) => sum + value, 0);
    if (total > 0) {
      parties.forEach((party) => {
        result[party] = (result[party] / total) * 100;
      });
    }

    return result;
  };

  const handleApplySwitching = () => {
    if (demographicMode && overrideDemographicsForAdvanced) {
      setDemographicMode(false);
    }

    const newFptpSliders = applySwitchingMatrixToSliders(fptpSliders);
    const newPrSliders = applySwitchingMatrixToSliders(prSliders);
    replaceSliders(newFptpSliders, newPrSliders);
  };

  const handleClearSwitching = () => {
    Object.keys(switchingMatrix).forEach(fromParty => {
      Object.keys(switchingMatrix[fromParty] || {}).forEach(toParty => {
        updateSwitching(fromParty, toParty, 0);
      });
    });
  };

  const computeCompatibility = (a, b) => {
    const pa = IDEOLOGY_COORDS[a];
    const pb = IDEOLOGY_COORDS[b];
    if (!pa || !pb) {return null;}
    const d = Math.sqrt(
      Math.pow(pa.econ - pb.econ, 2) +
      Math.pow(pa.federal - pb.federal, 2) +
      Math.pow(pa.geo - pb.geo, 2)
    );
    const score = Math.max(0, 100 - d * 100);
    return { distance: d, score };
  };
  const compatibility = activeAlliance ? computeCompatibility(allyA, allyB) : null;

  useEffect(() => {
    if (!rspStartingPoint) {return;}
    if (demographicMode && overrideDemographicsForAdvanced) {
      setDemographicMode(false);
    }
    setFptpToPr(selectedParty);
  }, [
    rspStartingPoint,
    selectedParty,
    prSliders,
    demographicMode,
    overrideDemographicsForAdvanced,
    setDemographicMode,
    setFptpToPr,
  ]);

  useEffect(() => {
    if (!showControlSetupStep) {return;}
    setActiveTab(currentGuidedControl);
    setDemographicMode(currentGuidedControl === 'demographics');
  }, [showControlSetupStep, currentGuidedControl, setDemographicMode]);

  const handleReset = () => {
    resetSliders();
    clearAllOverrides();
    clearAlliance();
    setSlidersLocked(true);
  };

  const topSimulationChanges = Object.keys(OFFICIAL_FPTP_VOTE)
    .map((party) => {
      const fptpDelta = (fptpSliders[party] || 0) - (OFFICIAL_FPTP_VOTE[party] || 0);
      const prDelta = (prSliders[party] || 0) - (OFFICIAL_PR_VOTE[party] || 0);
      return { party, fptpDelta, prDelta, magnitude: Math.abs(fptpDelta) + Math.abs(prDelta) };
    })
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 4);

  const toggleSimulationControl = (control) => {
    setSelectedSimulationControls((current) => ({
      ...current,
      [control]: !current[control],
    }));
  };

  const handleGuidedModeSelect = (mode) => {
    setExperienceMode(mode);
    if (mode === 'simulation') {
      setGuidedStep(1);
      setSelectedYear(2026);
    } else {
      setGuidedStep(3);
      setSelectedYear(2026);
      setDataFlowStep(0);
    }
  };

  const handleStartControlSetup = () => {
    if (enabledSimulationControls.length === 0) {return;}
    setGuidedControlIndex(0);
    setGuidedStep(2);
  };

  const handleNextGuidedControl = () => {
    if (guidedControlIndex < enabledSimulationControls.length - 1) {
      setGuidedControlIndex((i) => i + 1);
      return;
    }
    setGuidedStep(3);
  };

  const handleBackGuidedControl = () => {
    if (guidedControlIndex > 0) {
      setGuidedControlIndex((i) => i - 1);
      return;
    }
    setGuidedStep(1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(250, 249, 246)', fontFamily: 'Figtree, sans-serif' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6" ref={screenshotRef}>
        {guidedFlowEnabled && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">Guided Flow</p>
                <h2 className="text-lg font-semibold text-[rgb(24,26,36)]">Build Scenario Step-by-Step</h2>
                <p className="text-sm text-[rgb(100,110,130)]">
                  Choose mode, apply controls, then review how those changes produced the result.
                </p>
              </div>
              <button
                onClick={() => setGuidedFlowEnabled(false)}
                className="px-3 py-1.5 rounded-lg text-xs border border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)]"
              >
                Use Full Dashboard
              </button>
            </div>

            {guidedStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleGuidedModeSelect('simulation')}
                  className="p-4 rounded-lg border border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30 text-left"
                >
                  <p className="font-semibold text-[rgb(24,26,36)]">Simulation Mode</p>
                  <p className="text-sm text-[rgb(100,110,130)]">Adjust controls and see projected seats.</p>
                </button>
                <button
                  onClick={() => handleGuidedModeSelect('data')}
                  className="p-4 rounded-lg border border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30 text-left"
                >
                  <p className="font-semibold text-[rgb(24,26,36)]">Data Mode</p>
                  <p className="text-sm text-[rgb(100,110,130)]">Browse election data and battlegrounds.</p>
                </button>
              </div>
            )}

            {guidedStep === 1 && (
              <div>
                <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">Select controls to apply</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                  {Object.keys(GUIDED_CONTROL_LABELS).map(control => (
                    <label key={control} className="flex items-center gap-2 rounded-lg border border-[rgb(219,211,196)] px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedSimulationControls[control]}
                        onChange={() => toggleSimulationControl(control)}
                      />
                      <span className="text-sm text-[rgb(24,26,36)]">{GUIDED_CONTROL_LABELS[control]}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGuidedStep(0)}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartControlSetup}
                    disabled={enabledSimulationControls.length === 0}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white disabled:opacity-40"
                  >
                    Start Applying Controls
                  </button>
                </div>
              </div>
            )}

            {showControlSetupStep && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                    Step {guidedControlIndex + 1} of {enabledSimulationControls.length}: {GUIDED_CONTROL_LABELS[currentGuidedControl]}
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">Apply this control, then continue.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBackGuidedControl} className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm">Back</button>
                  <button onClick={handleNextGuidedControl} className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white">
                    {guidedControlIndex === enabledSimulationControls.length - 1 ? 'See Results' : 'Next Control'}
                  </button>
                </div>
              </div>
            )}

            {guidedStep === 3 && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  {inGuidedData ? (
                    <>
                      <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                        Data mode step {dataFlowStep + 1} of {DATA_FLOW_STEPS.length}: {DATA_FLOW_STEPS[dataFlowStep]}
                      </p>
                      <p className="text-xs text-[rgb(100,110,130)]">
                        Build scope first, explore shifts, then lock your final readout.
                      </p>
                      <div className="mt-2 h-1.5 w-56 rounded-full bg-[rgb(244,238,229)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#B91C1C]"
                          style={{ width: `${((dataFlowStep + 1) / DATA_FLOW_STEPS.length) * 100}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-[rgb(24,26,36)]">Simulation complete</p>
                      <p className="text-xs text-[rgb(100,110,130)]">
                        Review final outcomes and the biggest vote-share shifts.
                      </p>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {inGuidedData && (
                    <button
                      onClick={() => setDataFlowStep((step) => Math.max(0, step - 1))}
                      disabled={dataFlowStep === 0}
                      className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm disabled:opacity-40"
                    >
                      Back Step
                    </button>
                  )}
                  {inGuidedData && (
                    <button
                      onClick={() => setDataFlowStep((step) => Math.min(DATA_FLOW_STEPS.length - 1, step + 1))}
                      disabled={dataFlowStep === DATA_FLOW_STEPS.length - 1}
                      className="px-3 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white disabled:opacity-40"
                    >
                      Next Step
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setGuidedStep(0);
                      setExperienceMode(null);
                      setDataFlowStep(0);
                    }}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Start Over
                  </button>
                  {!inGuidedData && (
                    <button
                      onClick={() => setGuidedStep(1)}
                      className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    >
                      Adjust Controls Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simulator status bar: leading party + majority + reset */}
        {selectedYear === 2026 && !inGuidedData && (
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
            <div className="flex items-center gap-2">
              <ShareButton
                state={{
                  fptpSliders,
                  prSliders,
                  overrides,
                  allianceConfig,
                  slidersLocked,
                }}
              />
              <ExportButton
                fptpSeats={fptpSeats}
                prSeats={prSeats}
                totalSeats={totalSeats}
                nationalVoteShares={nationalVoteShares}
                fptpResults={fptpResults}
                fptpSliders={fptpSliders}
                prSliders={prSliders}
                allianceConfig={allianceConfig}
                screenshotRef={screenshotRef}
              />
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(219,211,196)]/30 hover:bg-[rgb(219,211,196)]/50 rounded-lg text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] transition-colors text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Alliance / Gathabandan panel */}
        {selectedYear === 2026 && !inGuidedData && (
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

        {inGuidedData && guidedStep === 3 && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm space-y-4">
            {dataFlowStep === 0 && (
              <>
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">Data Filters</p>
                    <select
                      value={dataProvinceFilter}
                      onChange={(e) => setDataProvinceFilter(e.target.value)}
                      className="mt-1 px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    >
                      <option value="all">All Provinces</option>
                      {Object.entries(PROVINCES).map(([id, province]) => (
                        <option key={id} value={id}>{province.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">Winning Party</p>
                    <select
                      value={dataWinnerFilter}
                      onChange={(e) => setDataWinnerFilter(e.target.value)}
                      className="mt-1 px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    >
                      <option value="all">All Winners</option>
                      {Object.keys(PARTIES).map((party) => (
                        <option key={party} value={party}>{PARTIES[party].short}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">Search</p>
                    <input
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                      placeholder="Constituency or district"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[rgb(24,26,36)] mb-1">
                    <input
                      type="checkbox"
                      checked={dataBattlegroundOnly}
                      onChange={(e) => setDataBattlegroundOnly(e.target.checked)}
                    />
                    Battleground only
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <DataStatCard label="Constituencies Visible" value={filteredDataRows.length} />
                  <DataStatCard label="Unique Winners" value={filteredWinnerCounts.length} />
                  <DataStatCard label="Close Seats (<5%)" value={filteredDataRows.filter((row) => row.margin < 0.05).length} />
                  <DataStatCard label="Avg Margin" value={`${(filteredAvgMargin * 100).toFixed(2)}%`} />
                </div>
              </>
            )}

            {dataFlowStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">Winner Distribution</p>
                  <div className="space-y-2">
                    {filteredWinnerCounts.length === 0 && (
                      <p className="text-sm text-[rgb(100,110,130)]">No matching winners for current filters.</p>
                    )}
                    {filteredWinnerCounts.map(([party, seats]) => {
                      const pct = filteredDataRows.length > 0 ? (seats / filteredDataRows.length) * 100 : 0;
                      return (
                        <div key={party} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-[rgb(100,110,130)]">
                            <span>{PARTIES[party]?.short || party}</span>
                            <span>{seats} seats</span>
                          </div>
                          <div className="h-2 rounded-full bg-[rgb(244,238,229)] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: PARTIES[party]?.color || '#9ca3af',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">Province Split</p>
                  <div className="space-y-2">
                    {Object.entries(PROVINCES).map(([provinceId, province]) => {
                      const count = filteredDataRows.filter((row) => String(row.province) === provinceId).length;
                      return (
                        <button
                          key={provinceId}
                          onClick={() => setDataProvinceFilter(provinceId)}
                          className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg border border-[rgb(219,211,196)] hover:bg-[rgb(250,249,246)]"
                        >
                          <span className="text-sm text-[rgb(24,26,36)]">{province.name}</span>
                          <span className="text-xs text-[rgb(100,110,130)]">{count}</span>
                        </button>
                      );
                    })}
                    {dataProvinceFilter !== 'all' && (
                      <button
                        onClick={() => setDataProvinceFilter('all')}
                        className="w-full text-xs text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)] mt-1"
                      >
                        Clear Province Filter
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3 rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">Closest Seats In Current Scope</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                    {topCloseSeats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => selectConstituency(constituencies.find((c) => c.id === seat.id))}
                        className="text-left rounded-lg border border-[rgb(219,211,196)] px-3 py-2 hover:bg-[rgb(250,249,246)]"
                      >
                        <p className="text-sm font-semibold text-[rgb(24,26,36)]">{seat.name}</p>
                        <p className="text-xs text-[rgb(100,110,130)]">
                          Margin {(seat.margin * 100).toFixed(2)}% • Winner {PARTIES[seat.winner]?.short || seat.winner}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {dataFlowStep === 2 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DataStatCard
                    label="Dominant Party"
                    value={filteredWinnerCounts[0] ? `${PARTIES[filteredWinnerCounts[0][0]]?.short || filteredWinnerCounts[0][0]} (${filteredWinnerCounts[0][1]})` : 'N/A'}
                  />
                  <DataStatCard label="Battlegrounds In Scope" value={filteredBattlegroundCards.length} />
                  <DataStatCard label="Seats Under 3% Margin" value={filteredDataRows.filter((row) => row.margin < 0.03).length} />
                </div>

                <div className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">Important Battles</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredBattlegroundCards.length === 0 && (
                      <p className="text-sm text-[rgb(100,110,130)]">No battlegrounds match the current filters.</p>
                    )}
                    {filteredBattlegroundCards.map((battle) => {
                      const constituency = constituencyByNormalizedName.get(normalizeConstituencyName(battle.constituency));
                      return (
                        <div key={battle.constituency} className="rounded-lg border border-[rgb(219,211,196)] p-3">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="font-semibold text-[rgb(24,26,36)]">{battle.constituency}</p>
                            <span className="text-xs text-[rgb(100,110,130)]">
                              {constituency ? `${PROVINCES[String(constituency.province)]?.name || ''}` : ''}
                            </span>
                          </div>
                          <p className="text-xs text-[rgb(100,110,130)] mb-2">{battle.significance}</p>
                          <div className="space-y-1">
                            {battle.candidates.map((candidate) => (
                              <div key={`${battle.constituency}-${candidate.name}`} className="flex items-center justify-between text-sm">
                                <span className="text-[rgb(24,26,36)]">{candidate.name}</span>
                                <span
                                  className="px-2 py-0.5 rounded text-xs text-white"
                                  style={{ backgroundColor: resolveCandidatePartyColor(candidate.party) }}
                                >
                                  {candidate.party}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 2026 Election Info Panel */}
        {selectedYear === 2026 && !inGuidedData && (
          <div className="mb-6">
            <Election2026InfoPanel />
          </div>
        )}

        {/* FPTP and PR Sliders */}
        {showControlsSection && (
          <>
            <div className="mb-6">
              {!showControlSetupStep && (
                <div className="flex gap-1 mb-4 border-b border-gray-200">
                  <TabButton
                    label="Manual"
                    active={activeTab === 'manual'}
                    onClick={() => {
                      setActiveTab('manual');
                      setDemographicMode(false);
                    }}
                  />
                  <TabButton
                    label="Demographics"
                    active={activeTab === 'demographics'}
                    onClick={() => {
                      setActiveTab('demographics');
                      setDemographicMode(true);
                    }}
                  />
                  <TabButton
                    label="Advanced"
                    active={activeTab === 'advanced'}
                    onClick={() => setActiveTab('advanced')}
                  />
                </div>
              )}

              {/* Tab Content */}
              {(activeTab === 'manual') && (!showControlSetupStep || currentGuidedControl === 'manual') && (
                <>
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
                </>
              )}

              {(activeTab === 'demographics') && (!showControlSetupStep || currentGuidedControl === 'demographics') && (
                <DemographicInputPanel
                  patterns={demographicPatterns}
                  turnout={demographicTurnout}
                  onUpdatePattern={updateDemographicPattern}
                  onUpdateTurnout={updateDemographicTurnout}
                  scenarios={PRESET_SCENARIOS}
                  savedScenarios={savedScenarios}
                  activeScenario={activeScenario}
                  onLoadScenario={loadScenario}
                  onSaveScenario={saveScenario}
                  onDeleteScenario={deleteScenario}
                  onClear={clearDemographicInputs}
                  activeDimension={activeDemographicDimension}
                  onChangeDimension={setActiveDemographicDimension}
                />
              )}

              {(activeTab === 'advanced') && (!showControlSetupStep || currentGuidedControl === 'advanced') && (
                <div className="space-y-6">
                  <AdvancedControls
                    rspStartingPoint={rspStartingPoint}
                    onRspStartingPointChange={setRspStartingPoint}
                    selectedParty={selectedParty}
                    onSelectedPartyChange={setSelectedParty}
                    demographicMode={demographicMode}
                    overrideDemographics={overrideDemographicsForAdvanced}
                    onOverrideDemographicsChange={setOverrideDemographicsForAdvanced}
                    switchingMatrix={switchingMatrix}
                    onUpdateSwitching={updateSwitching}
                    onApplySwitching={handleApplySwitching}
                    onClearSwitching={handleClearSwitching}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Simulation change summary */}
        {showResultSections && inGuidedSimulation && guidedStep >= 3 && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)] mb-2">Biggest Input Changes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {topSimulationChanges.map(({ party, fptpDelta, prDelta }) => (
                <div key={party} className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">{PARTIES[party]?.short || party}</p>
                  <p className="text-xs text-[rgb(100,110,130)]">FPTP {fptpDelta >= 0 ? '+' : ''}{fptpDelta.toFixed(2)}%</p>
                  <p className="text-xs text-[rgb(100,110,130)]">PR {prDelta >= 0 ? '+' : ''}{prDelta.toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Charts */}
        {showResultSections && (
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

            {/* Voter Flow Diagram */}
            <div className="mb-6">
              <VoterFlowDiagram fptpResults={fptpResults} />
            </div>

            {/* Swing Model & Seat Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SwingPanel
                fptpResults={fptpResults}
                fptpSeats={fptpSeats}
              />
              <SeatCalculator
                fptpResults={fptpResults}
                fptpSeats={fptpSeats}
              />
            </div>
          </>
        )}

        {/* Constituency Table/Map and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {!inGuidedData && selectedYear === 2026 && nepalMapMode === 'table' && (
              <ConstituencyTable
                fptpResults={fptpResults}
                overrides={overrides}
                onSelectConstituency={selectConstituency}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            {!inGuidedData && selectedYear === 2026 && (
              <ResultsSummary
                fptpSeats={fptpSeats}
                prSeats={prSeats}
                totalSeats={totalSeats}
                seatIntervals={seatIntervals}
              />
            )}
          </div>
        </div>

        {/* Battleground seats */}
        {showResultSections && (
          <div className="mb-6">
            <BattlegroundPanel
              fptpResults={fptpResults}
              onSelectConstituency={selectConstituency}
            />
          </div>
        )}

        {/* Override indicator */}
        {selectedYear === 2026 && !inGuidedData && Object.keys(overrides).length > 0 && (
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

      {/* Quick Start Modal */}
      <QuickStartModal
        isOpen={isQuickStartOpen}
        onClose={() => setQuickStartOpen(false)}
        onSelectAction={(action) => {
          if (action === 'scenario') {
            setActiveTab('demographics');
          } else if (action === 'example') {
            // Optional: highlight RSP slider or show tooltip
            setActiveTab('manual');
          } else {
            // 'explore' or other actions - stay on manual tab
            setActiveTab('manual');
          }
          setQuickStartOpen(false);
        }}
      />
    </div>
  );
}

/**
 * Tab button component
 */
function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

function DataStatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-[rgb(219,211,196)] px-3 py-2 bg-[rgb(250,249,246)]/80">
      <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">{label}</p>
      <p className="text-lg font-semibold text-[rgb(24,26,36)]">{value}</p>
    </div>
  );
}
