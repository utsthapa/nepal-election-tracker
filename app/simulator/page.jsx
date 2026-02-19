'use client';

import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  Crosshair,
  Database,
  Info,
  Link,
  Lock,
  MapPin,
  RotateCcw,
  Save,
  Target,
  TrendingUp,
  Unlock,
  Users,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AdvancedControls } from '../../components/AdvancedControls';
import { AllianceModal } from '../../components/AllianceModal';
import { BattlegroundPanel } from '../../components/BattlegroundPanel';
import { CoalitionBuilder } from '../../components/CoalitionBuilder';
import { ConstituencyTable } from '../../components/ConstituencyTable';
import { Election2026InfoPanel } from '../../components/Election2026InfoPanel';
import DemographicInputPanel, {
  DEMOGRAPHIC_DIMENSIONS,
} from '../../components/ElectionSimulation/DemographicInputPanel';
import { ExportButton } from '../../components/ExportButton';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { MajorityBar } from '../../components/MajorityBar';
import { PartySliders } from '../../components/PartySliders';
import { PRBlockChart } from '../../components/PRBlockChart';

import { ResultsSummary } from '../../components/ResultsSummary';
import { SeatCalculator } from '../../components/SeatCalculator';
import { SeatDrawer } from '../../components/SeatDrawer';
import { ShareButton } from '../../components/ShareButton';
import { SwingPanel } from '../../components/SwingPanel';
import { VoterFlowDiagram } from '../../components/VoterFlowDiagram';
import YearSelector from '../../components/YearSelector';
import { useLanguage } from '../../context/LanguageContext';
import { CANDIDATE_DEMOGRAPHICS_2022 } from '../../data/candidateDemographics2022.js';
import {
  OFFICIAL_FPTP_VOTE,
  OFFICIAL_PR_VOTE,
  PARTIES,
  PROVINCES,
  constituencies,
} from '../../data/constituencies';
import { applyRspNationalEntry } from '../../utils/scenarios';
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
const SIMULATION_PATHS = {
  national: {
    title: 'National Swing Tree',
    description: 'Start with manual vote sliders and optionally add advanced dynamics.',
    path: ['manual'],
  },
  demographics: {
    title: 'Demographic Tree',
    description: 'Run demographic modeling only. This path is exclusive.',
    path: ['demographics'],
  },
};

const normalizeConstituencyName = value => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const resolveCandidatePartyColor = partyNameOrCode => {
  const byUtils = getPartyColor(partyNameOrCode);
  if (byUtils !== '#6b7280') {
    return byUtils;
  }

  const direct = PARTIES[partyNameOrCode];
  if (direct?.color) {
    return direct.color;
  }

  const byShort = Object.values(PARTIES).find(party => party.short === partyNameOrCode);
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
  const [activeTab, setActiveTab] = useState('manual');
  const [nepalMapMode, setNepalMapMode] = useState('map');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [overrideDemographicsForAdvanced, setOverrideDemographicsForAdvanced] = useState(false);
  const [guidedFlowEnabled, setGuidedFlowEnabled] = useState(true);
  const [guidedStep, setGuidedStep] = useState(0); // 0: mode, 1: tree select, 2: starting point, 3: controls, 4: gathbandan, 5: results
  const [experienceMode, setExperienceMode] = useState(null); // 'simulation' | 'data'
  const [simulationPath, setSimulationPath] = useState('national');

  // Starting point and custom scenario state
  const [startingPoint, setStartingPoint] = useState('2022'); // '2022' | 'custom'
  const [incumbencyDecay, setIncumbencyDecay] = useState(0); // 0-1, hurts NC/UML/Maoist, helps RSP
  const [rspBoost, setRspBoost] = useState(0); // Additional RSP boost

  // Target projection state
  const [targetProjection, setTargetProjection] = useState({ party: 'RSP', targetVote: 30 });

  const [guidedControlIndex, setGuidedControlIndex] = useState(0);
  const [dataFlowStep, setDataFlowStep] = useState(0); // 0: filters, 1: explore, 2: insight
  const [dataProvinceFilter, setDataProvinceFilter] = useState('all');
  const [dataWinnerFilter, setDataWinnerFilter] = useState('all');
  const [dataSearch, setDataSearch] = useState('');
  const [dataBattlegroundOnly, setDataBattlegroundOnly] = useState(false);

  const activeAlliance = allianceConfig?.enabled && allianceConfig.parties?.length === 2;
  const [allyA, allyB] = allianceConfig?.parties || [];
  const election2026Data = useMemo(() => get2026ElectionData(), []);
  const keyBattlegrounds = useMemo(
    () => election2026Data?.key_battlegrounds || [],
    [election2026Data]
  );
  const battlegroundNameSet = useMemo(
    () => new Set(keyBattlegrounds.map(battle => normalizeConstituencyName(battle.constituency))),
    [keyBattlegrounds]
  );
  const constituencyByNormalizedName = useMemo(() => {
    const map = new Map();
    constituencies.forEach(c => {
      map.set(normalizeConstituencyName(c.name), c);
    });
    return map;
  }, []);
  const enabledSimulationControls = useMemo(() => {
    if (simulationPath === 'demographics') {
      return ['demographics'];
    }
    // Always include advanced dynamics after manual in national path
    return ['manual', 'advanced'];
  }, [simulationPath]);
  const currentGuidedControl = enabledSimulationControls[guidedControlIndex] || 'manual';
  const inGuidedSimulation = guidedFlowEnabled && experienceMode === 'simulation';
  const inGuidedData = guidedFlowEnabled && experienceMode === 'data';
  const hasCompletedGuidedFlow = !guidedFlowEnabled || guidedStep >= 5;
  const canUseFullDashboard = !inGuidedSimulation || hasCompletedGuidedFlow;
  const showControlSetupStep = inGuidedSimulation && guidedStep === 3;
  const showResultSections = selectedYear === 2026 && !inGuidedData && hasCompletedGuidedFlow;
  const showControlsSection =
    selectedYear === 2026 &&
    !inGuidedData &&
    (!guidedFlowEnabled || (inGuidedSimulation && guidedStep >= 3));
  const showAllDataSections = inGuidedData && guidedStep === 3;
  const showSimulationTopPanels = selectedYear === 2026 && !inGuidedData && hasCompletedGuidedFlow;
  const showMainMapSection = hasCompletedGuidedFlow;
  const femaleCandidateShare =
    CANDIDATE_DEMOGRAPHICS_2022.genderBreakdown.find(item => item.genderLabel === 'Female')
      ?.sharePct || 0;
  const femaleElectedShare =
    CANDIDATE_DEMOGRAPHICS_2022.genderBreakdownElected.find(item => item.genderLabel === 'Female')
      ?.sharePct || 0;
  const dataRows = useMemo(() => {
    return constituencies.map(c => {
      const normalizedName = normalizeConstituencyName(c.name);
      const simulatedWinner =
        selectedYear === 2026 ? fptpResults[c.id]?.winner || c.winner2022 : c.winner2022;
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
    return dataRows.filter(row => {
      if (dataProvinceFilter !== 'all' && String(row.province) !== dataProvinceFilter) {
        return false;
      }
      if (dataWinnerFilter !== 'all' && row.winner !== dataWinnerFilter) {
        return false;
      }
      if (dataBattlegroundOnly && !row.isBattleground) {
        return false;
      }
      if (!searchNeedle) {
        return true;
      }
      return `${row.name} ${row.district}`.toLowerCase().includes(searchNeedle);
    });
  }, [dataRows, dataProvinceFilter, dataWinnerFilter, dataBattlegroundOnly, dataSearch]);

  const filteredWinnerCounts = useMemo(() => {
    const counts = {};
    filteredDataRows.forEach(row => {
      counts[row.winner] = (counts[row.winner] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredDataRows]);

  const filteredAvgMargin = useMemo(() => {
    if (filteredDataRows.length === 0) {
      return 0;
    }
    return filteredDataRows.reduce((sum, row) => sum + row.margin, 0) / filteredDataRows.length;
  }, [filteredDataRows]);

  const filteredBattlegroundRows = useMemo(() => {
    return filteredDataRows.filter(row => row.isBattleground).sort((a, b) => a.margin - b.margin);
  }, [filteredDataRows]);

  const filteredBattlegroundCards = useMemo(() => {
    const allowed = new Set(
      filteredBattlegroundRows.map(row => normalizeConstituencyName(row.name))
    );
    return keyBattlegrounds.filter(battle =>
      allowed.has(normalizeConstituencyName(battle.constituency))
    );
  }, [filteredBattlegroundRows, keyBattlegrounds]);
  const topCloseSeats = useMemo(() => {
    return [...filteredDataRows].sort((a, b) => a.margin - b.margin).slice(0, 8);
  }, [filteredDataRows]);

  const partyColors = {};
  Object.keys(PARTIES).forEach(p => {
    partyColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = partyId => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  const applySwitchingMatrixToSliders = baseSliders => {
    const parties = Object.keys(baseSliders || {});
    const deltas = Object.fromEntries(parties.map(party => [party, 0]));

    Object.entries(switchingMatrix).forEach(([fromParty, targets]) => {
      if (!targets || !parties.includes(fromParty)) {
        return;
      }

      const baseFrom = baseSliders[fromParty] || 0;
      if (baseFrom <= 0) {
        return;
      }

      const validTargets = Object.entries(targets)
        .filter(
          ([toParty, percentage]) =>
            parties.includes(toParty) &&
            toParty !== fromParty &&
            typeof percentage === 'number' &&
            percentage > 0
        )
        .map(([toParty, percentage]) => [toParty, Math.min(100, percentage)]);

      if (validTargets.length === 0) {
        return;
      }

      const totalRequestedPct = validTargets.reduce((sum, [, percentage]) => sum + percentage, 0);
      const scale = totalRequestedPct > 100 ? 100 / totalRequestedPct : 1;

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
    parties.forEach(party => {
      result[party] = Math.max(0, (baseSliders[party] || 0) + (deltas[party] || 0));
    });

    const total = Object.values(result).reduce((sum, value) => sum + value, 0);
    if (total > 0) {
      parties.forEach(party => {
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

  // Apply custom scenario adjustments using demographic profiles
  const applyCustomScenario = () => {
    // Start from 2022 official results, not equal shares
    let baseFptp = { ...OFFICIAL_FPTP_VOTE };
    let basePr = { ...OFFICIAL_PR_VOTE };

    // Apply incumbency decay: hurts NC, UML, Maoist
    // In custom scenarios, this represents anti-incumbent sentiment
    const incumbents = ['NC', 'UML', 'Maoist'];
    const decayStrength = incumbencyDecay; // 0-1

    if (decayStrength > 0) {
      // Calculate decay amount (up to 50% of their base)
      let transferableVotes = 0;
      incumbents.forEach(party => {
        if (baseFptp[party]) {
          const decayAmount = baseFptp[party] * decayStrength * 0.5;
          transferableVotes += decayAmount;
          baseFptp[party] -= decayAmount;
        }
      });

      // RSP gets majority of anti-incumbent vote due to urban/educated concentration
      const rspShare = 0.5; // 50% to RSP
      const otherAltsShare = 0.3; // 30% to other alternatives
      const othersShare = 0.2; // 20% to Others

      baseFptp['RSP'] = (baseFptp['RSP'] || 0) + transferableVotes * rspShare;

      // Distribute to other alternative parties
      const alternatives = ['RPP', 'JP', 'LSP', 'NUP'];
      const totalAlt = alternatives.reduce((sum, p) => sum + (baseFptp[p] || 0), 0);
      if (totalAlt > 0) {
        alternatives.forEach(party => {
          const proportion = (baseFptp[party] || 0) / totalAlt;
          baseFptp[party] += transferableVotes * otherAltsShare * proportion;
        });
      } else {
        // If no alternatives, give to RSP
        baseFptp['RSP'] += transferableVotes * otherAltsShare;
      }

      baseFptp['Others'] = (baseFptp['Others'] || 0) + transferableVotes * othersShare;
    }

    // RSP momentum boost - represents their urban/educated/youth concentration
    if (rspBoost > 0) {
      // RSP gains more because their votes are concentrated where they matter
      // This simulates efficient vote distribution
      const boostAmount = rspBoost * 15; // Up to 15% boost

      // Take from all other parties proportionally
      const otherParties = Object.keys(baseFptp).filter(p => p !== 'RSP');
      const totalOthers = otherParties.reduce((sum, p) => sum + (baseFptp[p] || 0), 0);

      if (totalOthers > 0) {
        otherParties.forEach(party => {
          const proportion = (baseFptp[party] || 0) / totalOthers;
          baseFptp[party] -= proportion * boostAmount;
        });
        baseFptp['RSP'] = (baseFptp['RSP'] || 0) + boostAmount;
      }
    }

    // Normalize to ensure sum is 100
    const normalizeSliders = sliders => {
      const total = Object.values(sliders).reduce((sum, v) => sum + (v || 0), 0);
      if (total > 0) {
        Object.keys(sliders).forEach(key => {
          sliders[key] = (sliders[key] / total) * 100;
        });
      }
      return sliders;
    };

    replaceSliders(normalizeSliders(baseFptp), normalizeSliders(basePr));
  };

  // Calculate target projection (if party gets X% vote, how many seats?)
  const calculateTargetProjection = useMemo(() => {
    const { party, targetVote } = targetProjection;
    if (!party || !targetVote || targetVote <= 0) return null;

    // Create modified sliders with target vote share for the party
    const currentTotal = Object.values(fptpSliders).reduce((sum, v) => sum + v, 0);
    const partyCurrent = fptpSliders[party] || 0;
    const targetVoteDecimal = targetVote; // Already in percentage

    if (partyCurrent <= 0) return null;

    // Calculate the swing needed
    const swingNeeded = targetVoteDecimal - partyCurrent;

    // Apply uniform swing to all constituencies
    const projectedSliders = { ...fptpSliders };
    const otherParties = Object.keys(projectedSliders).filter(p => p !== party);
    const totalOthers = otherParties.reduce((sum, p) => sum + projectedSliders[p], 0);

    // Add swing to target party
    projectedSliders[party] = targetVoteDecimal;

    // Distribute the loss proportionally among other parties
    const lossToDistribute = swingNeeded;
    if (totalOthers > 0 && lossToDistribute !== 0) {
      otherParties.forEach(p => {
        const proportion = projectedSliders[p] / totalOthers;
        projectedSliders[p] -= proportion * lossToDistribute;
      });
    }

    // Calculate seats with projected sliders
    // We need to recalculate FPTP results with new sliders
    return { projectedSliders, swingNeeded, targetVote, party };
  }, [targetProjection, fptpSliders]);

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
    if (!pa || !pb) {
      return null;
    }
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
    if (!showControlSetupStep) {
      return;
    }
    setActiveTab(currentGuidedControl);
    setDemographicMode(currentGuidedControl === 'demographics');
  }, [showControlSetupStep, currentGuidedControl, setDemographicMode]);

  const handleReset = () => {
    resetSliders();
    clearAllOverrides();
    clearAlliance();
    setSlidersLocked(true);
    // Reset custom scenario settings
    setStartingPoint('2022');
    setIncumbencyDecay(0);
    setRspBoost(0);
  };

  const topSimulationChanges = Object.keys(OFFICIAL_FPTP_VOTE)
    .map(party => {
      const fptpDelta = (fptpSliders[party] || 0) - (OFFICIAL_FPTP_VOTE[party] || 0);
      const prDelta = (prSliders[party] || 0) - (OFFICIAL_PR_VOTE[party] || 0);
      return { party, fptpDelta, prDelta, magnitude: Math.abs(fptpDelta) + Math.abs(prDelta) };
    })
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 4);

  const handleSimulationPathChange = path => {
    setSimulationPath(path);
  };

  const handleGuidedModeSelect = mode => {
    setExperienceMode(mode);
    if (mode === 'simulation') {
      setSimulationPath('national');
      setGuidedControlIndex(0);
      setGuidedStep(1);
      setSelectedYear(2026);
    } else {
      setGuidedStep(3);
      setSelectedYear(2026);
      setDataFlowStep(0);
    }
  };

  const handleStartControlSetup = () => {
    if (enabledSimulationControls.length === 0) {
      return;
    }
    setGuidedControlIndex(0);
    setGuidedStep(3); // Go to controls step (skip starting point if 2022 selected)
  };

  const handleStartingPointSelect = point => {
    setStartingPoint(point);
    if (point === '2022') {
      // Reset to official 2022 baseline
      resetSliders();
      setGuidedStep(3);
    } else if (point === 'rsp-entry') {
      // RSP National Entry: correct RSP's FPTP share to their PR proportion,
      // taking the difference proportionally from all other parties.
      // PR sliders already have RSP at 10.70% so no change needed there.
      const newFptp = applyRspNationalEntry({ ...OFFICIAL_FPTP_VOTE });
      replaceSliders(newFptp, { ...OFFICIAL_PR_VOTE });
      setGuidedStep(3);
    } else {
      // Custom scenario — stay on step 2 to show sub-panel options
      setGuidedStep(2);
    }
  };

  const handleApplyCustomScenario = () => {
    applyCustomScenario();
    setGuidedStep(3);
  };

  const handleNextGuidedControl = () => {
    if (guidedControlIndex < enabledSimulationControls.length - 1) {
      setGuidedControlIndex(i => i + 1);
      return;
    }
    setGuidedStep(4); // Go to gathbandan step
  };

  const handleBackGuidedControl = () => {
    if (guidedControlIndex > 0) {
      setGuidedControlIndex(i => i - 1);
      return;
    }
    setGuidedStep(2); // Back to starting point selection
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'rgb(250, 249, 246)', fontFamily: 'Figtree, sans-serif' }}
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6" ref={screenshotRef}>
        {guidedFlowEnabled && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                  Guided Flow
                </p>
                <h2 className="text-lg font-semibold text-[rgb(24,26,36)]">
                  Build Scenario Step-by-Step
                </h2>
                <p className="text-sm text-[rgb(100,110,130)]">
                  Start from the 2022 baseline map, apply changes, then review the resulting
                  scenario.
                </p>
              </div>
              {canUseFullDashboard ? (
                <button
                  onClick={() => setGuidedFlowEnabled(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)]"
                >
                  Use Full Dashboard
                </button>
              ) : (
                <p className="text-xs text-[rgb(100,110,130)]">
                  Finish simulation steps to unlock full dashboard.
                </p>
              )}
            </div>

            {guidedStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleGuidedModeSelect('simulation')}
                  className="p-4 rounded-lg border border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30 text-left"
                >
                  <p className="font-semibold text-[rgb(24,26,36)]">Simulation Mode</p>
                  <p className="text-sm text-[rgb(100,110,130)]">
                    Build on the 2022 baseline, then project seats after your changes.
                  </p>
                </button>
                <button
                  onClick={() => handleGuidedModeSelect('data')}
                  className="p-4 rounded-lg border border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30 text-left"
                >
                  <p className="font-semibold text-[rgb(24,26,36)]">Data Mode</p>
                  <p className="text-sm text-[rgb(100,110,130)]">
                    Browse election data and battlegrounds.
                  </p>
                </button>
              </div>
            )}

            {guidedStep === 1 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-1">
                    Choose Simulation Tree
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Demographics is exclusive and cannot be combined with manual or advanced
                    controls.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSimulationPathChange('national')}
                    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                      simulationPath === 'national'
                        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
                        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                      {SIMULATION_PATHS.national.title}
                    </p>
                    <p className="text-xs text-[rgb(100,110,130)] mt-1">
                      {SIMULATION_PATHS.national.description}
                    </p>
                    <div className="mt-2 text-xs text-[rgb(24,26,36)]">
                      {GUIDED_CONTROL_LABELS.manual} → optional {GUIDED_CONTROL_LABELS.advanced}
                    </div>
                  </button>

                  <button
                    onClick={() => handleSimulationPathChange('demographics')}
                    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                      simulationPath === 'demographics'
                        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
                        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                      {SIMULATION_PATHS.demographics.title}
                    </p>
                    <p className="text-xs text-[rgb(100,110,130)] mt-1">
                      {SIMULATION_PATHS.demographics.description}
                    </p>
                    <div className="mt-2 text-xs text-[rgb(24,26,36)]">
                      {GUIDED_CONTROL_LABELS.demographics} only
                    </div>
                  </button>
                </div>

                <div className="rounded-lg bg-[rgb(250,249,246)] border border-[rgb(219,211,196)] px-3 py-2">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                    Selected Path
                  </p>
                  <p className="text-sm text-[rgb(24,26,36)]">
                    {enabledSimulationControls
                      .map(control => GUIDED_CONTROL_LABELS[control])
                      .join(' → ')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setGuidedStep(0)}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (simulationPath === 'demographics') {
                        setGuidedStep(3); // Skip starting point for demographics
                      } else {
                        setGuidedStep(2);
                      }
                    }}
                    disabled={enabledSimulationControls.length === 0}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white disabled:opacity-40"
                  >
                    {simulationPath === 'demographics'
                      ? 'Start Demographics'
                      : 'Choose Starting Point'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Starting Point Selection */}
            {guidedStep === 2 && simulationPath !== 'demographics' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-1">
                    Step 2: Choose Your Starting Point
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Start from the 2022 election results or apply a custom scenario with pre-set
                    adjustments.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStartingPointSelect('2022')}
                    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                      startingPoint === '2022'
                        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
                        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[rgb(24,26,36)]">2022 Baseline</p>
                    <p className="text-xs text-[rgb(100,110,130)] mt-1">
                      Start with official 2022 election results as your baseline.
                    </p>
                  </button>

                  <button
                    onClick={() => handleStartingPointSelect('rsp-entry')}
                    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                      startingPoint === 'rsp-entry'
                        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
                        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[rgb(24,26,36)]">RSP National Entry</p>
                    <p className="text-xs text-[rgb(100,110,130)] mt-1">
                      RSP ran in fewer seats in 2022. This sets their FPTP base to their PR
                      proportion (10.70%), taking the difference proportionally from all parties.
                    </p>
                  </button>

                  <button
                    onClick={() => handleStartingPointSelect('custom')}
                    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                      startingPoint === 'custom'
                        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
                        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[rgb(24,26,36)]">Custom Scenario</p>
                    <p className="text-xs text-[rgb(100,110,130)] mt-1">
                      Apply incumbency decay, RSP boost, or anti-establishment wave.
                    </p>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setGuidedStep(1)}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 2b: Custom Scenario Options */}
            {guidedStep === 2 && startingPoint === 'custom' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-1">
                    Custom Scenario Options
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Adjust these parameters to model different electoral dynamics.
                  </p>
                </div>

                {/* Incumbency Decay Slider */}
                <div className="space-y-2 rounded-lg border border-[rgb(219,211,196)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[rgb(24,26,36)]">
                      Incumbency Decay (Anti-Incumbent Wave)
                    </p>
                    <span className="text-xs font-mono text-[rgb(100,110,130)]">
                      {Math.round(incumbencyDecay * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={incumbencyDecay}
                    onChange={e => setIncumbencyDecay(parseFloat(e.target.value))}
                    className="w-full accent-[#B91C1C]"
                  />
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Hurts NC, UML, and Maoist. Benefits flow to RSP (60%) and Others (40%).
                  </p>
                </div>

                {/* RSP Boost Slider */}
                <div className="space-y-2 rounded-lg border border-[rgb(219,211,196)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[rgb(24,26,36)]">RSP Momentum Boost</p>
                    <span className="text-xs font-mono text-[rgb(100,110,130)]">
                      +{Math.round(rspBoost * 10)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={rspBoost}
                    onChange={e => setRspBoost(parseFloat(e.target.value))}
                    className="w-full accent-[#B91C1C]"
                  />
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Additional boost for RSP. Taken proportionally from all other parties.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStartingPoint('2022')}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleApplyCustomScenario}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white"
                  >
                    Apply & Continue
                  </button>
                </div>
              </div>
            )}

            {showControlSetupStep && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                    Step {guidedControlIndex + 1} of {enabledSimulationControls.length}:{' '}
                    {GUIDED_CONTROL_LABELS[currentGuidedControl]}
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Apply this control, then continue.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBackGuidedControl}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextGuidedControl}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white"
                  >
                    {guidedControlIndex === enabledSimulationControls.length - 1
                      ? 'Next: Gathbandan'
                      : 'Next Control'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Gathbandan (Alliance) Step */}
            {inGuidedSimulation && guidedStep === 4 && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                    Step 4: Gathbandan (Alliances)
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Layer in alliances that transfer votes between partners. Start from the 2022 map
                    and build these coop links before reviewing the final result.
                  </p>
                </div>
                {activeAlliance ? (
                  <div className="flex items-center gap-2 text-xs text-[rgb(24,26,36)]">
                    <span className="font-semibold" style={{ color: PARTIES[allyA]?.color }}>
                      {PARTIES[allyA]?.short || allyA}
                    </span>
                    <span>+ </span>
                    <span className="font-semibold" style={{ color: PARTIES[allyB]?.color }}>
                      {PARTIES[allyB]?.short || allyB}
                    </span>
                    <span>• {100 - allianceConfig.handicap}% transfer</span>
                  </div>
                ) : (
                  <p className="text-xs text-[rgb(100,110,130)]">
                    No alliance configured yet; use the button to open the dialog.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setAllianceModalOpen(true)}
                    className="px-4 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm text-[rgb(24,26,36)]"
                  >
                    Configure Gathbandan
                  </button>
                  <button
                    onClick={() => setGuidedStep(5)}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-sm font-semibold"
                  >
                    Continue to Results
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 for Data Mode */}
            {inGuidedData && guidedStep === 3 && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                    Data mode workspace ready
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Full data view is loaded, including battleground and demographic insights.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setGuidedStep(0);
                      setExperienceMode(null);
                      setDataFlowStep(0);
                      setSimulationPath('national');
                      setGuidedControlIndex(0);
                      setStartingPoint('2022');
                      setIncumbencyDecay(0);
                      setRspBoost(0);
                    }}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {inGuidedSimulation && guidedStep === 5 && (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                    Step 5: Simulation Complete
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Review final outcomes and the biggest vote-share shifts.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setGuidedStep(0);
                      setExperienceMode(null);
                      setDataFlowStep(0);
                      setSimulationPath('national');
                      setGuidedControlIndex(0);
                      setStartingPoint('2022');
                      setIncumbencyDecay(0);
                      setRspBoost(0);
                    }}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={() => setGuidedStep(1)}
                    className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                  >
                    Adjust Controls Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simulator status bar: leading party + majority + reset */}
        {showSimulationTopPanels && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg border border-[rgb(219,211,196)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-6">
              {leadingParty && (
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                    Leading
                  </p>
                  <p
                    className={`text-lg font-bold ${partyColors[leadingParty] || 'text-[rgb(24,26,36)]'}`}
                    style={{ fontFamily: 'Lora, serif' }}
                  >
                    {formatPartyLabel(leadingParty)}
                  </p>
                  <p
                    className="text-sm text-[rgb(100,110,130)]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {totalSeats[leadingParty]} seats
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Target
                  className={`w-5 h-5 ${hasMajority ? 'text-[#22c55e]' : 'text-[rgb(100,110,130)]'}`}
                />
                <span
                  className={`text-sm font-semibold ${hasMajority ? 'text-[#22c55e]' : 'text-[rgb(100,110,130)]'}`}
                >
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
        {showSimulationTopPanels && (
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
                      Handicap {allianceConfig.handicap}% • {100 - allianceConfig.handicap}%
                      transfer efficiency
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
        {showMainMapSection && (
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
        )}

        {inGuidedData && guidedStep === 3 && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm space-y-4">
            {(showAllDataSections || dataFlowStep === 0) && (
              <>
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                      Data Filters
                    </p>
                    <select
                      value={dataProvinceFilter}
                      onChange={e => setDataProvinceFilter(e.target.value)}
                      className="mt-1 px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    >
                      <option value="all">All Provinces</option>
                      {Object.entries(PROVINCES).map(([id, province]) => (
                        <option key={id} value={id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                      Winning Party
                    </p>
                    <select
                      value={dataWinnerFilter}
                      onChange={e => setDataWinnerFilter(e.target.value)}
                      className="mt-1 px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    >
                      <option value="all">All Winners</option>
                      {Object.keys(PARTIES).map(party => (
                        <option key={party} value={party}>
                          {PARTIES[party].short}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                      Search
                    </p>
                    <input
                      value={dataSearch}
                      onChange={e => setDataSearch(e.target.value)}
                      placeholder="Constituency or district"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[rgb(24,26,36)] mb-1">
                    <input
                      type="checkbox"
                      checked={dataBattlegroundOnly}
                      onChange={e => setDataBattlegroundOnly(e.target.checked)}
                    />
                    Battleground only
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <DataStatCard label="Constituencies Visible" value={filteredDataRows.length} />
                  <DataStatCard label="Unique Winners" value={filteredWinnerCounts.length} />
                  <DataStatCard
                    label="Close Seats (<5%)"
                    value={filteredDataRows.filter(row => row.margin < 0.05).length}
                  />
                  <DataStatCard
                    label="Avg Margin"
                    value={`${(filteredAvgMargin * 100).toFixed(2)}%`}
                  />
                </div>
              </>
            )}

            {(showAllDataSections || dataFlowStep === 1) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">
                    Winner Distribution
                  </p>
                  <div className="space-y-2">
                    {filteredWinnerCounts.length === 0 && (
                      <p className="text-sm text-[rgb(100,110,130)]">
                        No matching winners for current filters.
                      </p>
                    )}
                    {filteredWinnerCounts.map(([party, seats]) => {
                      const pct =
                        filteredDataRows.length > 0 ? (seats / filteredDataRows.length) * 100 : 0;
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
                      const count = filteredDataRows.filter(
                        row => String(row.province) === provinceId
                      ).length;
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
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">
                    Closest Seats In Current Scope
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                    {topCloseSeats.map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => selectConstituency(seat.id)}
                        className="text-left rounded-lg border border-[rgb(219,211,196)] px-3 py-2 hover:bg-[rgb(250,249,246)]"
                      >
                        <p className="text-sm font-semibold text-[rgb(24,26,36)]">{seat.name}</p>
                        <p className="text-xs text-[rgb(100,110,130)]">
                          Margin {(seat.margin * 100).toFixed(2)}% • Winner{' '}
                          {PARTIES[seat.winner]?.short || seat.winner}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(showAllDataSections || dataFlowStep === 2) && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DataStatCard
                    label="Dominant Party"
                    value={
                      filteredWinnerCounts[0]
                        ? `${PARTIES[filteredWinnerCounts[0][0]]?.short || filteredWinnerCounts[0][0]} (${filteredWinnerCounts[0][1]})`
                        : 'N/A'
                    }
                  />
                  <DataStatCard
                    label="Battlegrounds In Scope"
                    value={filteredBattlegroundCards.length}
                  />
                  <DataStatCard
                    label="Seats Under 3% Margin"
                    value={filteredDataRows.filter(row => row.margin < 0.03).length}
                  />
                </div>

                <div className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">
                    Important Battles
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredBattlegroundCards.length === 0 && (
                      <p className="text-sm text-[rgb(100,110,130)]">
                        No battlegrounds match the current filters.
                      </p>
                    )}
                    {filteredBattlegroundCards.map(battle => {
                      const constituency = constituencyByNormalizedName.get(
                        normalizeConstituencyName(battle.constituency)
                      );
                      return (
                        <div
                          key={battle.constituency}
                          className="rounded-lg border border-[rgb(219,211,196)] p-3"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="font-semibold text-[rgb(24,26,36)]">
                              {battle.constituency}
                            </p>
                            <span className="text-xs text-[rgb(100,110,130)]">
                              {constituency
                                ? `${PROVINCES[String(constituency.province)]?.name || ''}`
                                : ''}
                            </span>
                          </div>
                          <p className="text-xs text-[rgb(100,110,130)] mb-2">
                            {battle.significance}
                          </p>
                          <div className="space-y-1">
                            {battle.candidates.map(candidate => (
                              <div
                                key={`${battle.constituency}-${candidate.name}`}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-[rgb(24,26,36)]">{candidate.name}</span>
                                <span
                                  className="px-2 py-0.5 rounded text-xs text-white"
                                  style={{
                                    backgroundColor: resolveCandidatePartyColor(candidate.party),
                                  }}
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

            <div className="rounded-lg border border-[rgb(219,211,196)] p-3 space-y-3">
              <div>
                <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                  Candidate Demographics (2022 ECN)
                </p>
                <p className="text-xs text-[rgb(100,110,130)]">
                  Candidate profile data by party and gender from official candidate filings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <DataStatCard
                  label="Total Candidates"
                  value={CANDIDATE_DEMOGRAPHICS_2022.totalCandidates}
                />
                <DataStatCard label="Female Candidates" value={`${femaleCandidateShare}%`} />
                <DataStatCard label="Female Winners" value={`${femaleElectedShare}%`} />
                <DataStatCard
                  label="Average Age"
                  value={CANDIDATE_DEMOGRAPHICS_2022.ageSummary.average}
                />
              </div>

              <div className="rounded-lg border border-[rgb(219,211,196)] overflow-hidden">
                <div className="grid grid-cols-5 bg-[rgb(250,249,246)] px-3 py-2 text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                  <span className="col-span-2">Party</span>
                  <span>Candidates</span>
                  <span>Female %</span>
                  <span>Avg Age</span>
                </div>
                <div className="divide-y divide-[rgb(219,211,196)]">
                  {CANDIDATE_DEMOGRAPHICS_2022.topPartiesByCandidates.slice(0, 12).map(party => (
                    <div
                      key={party.partyNameNp}
                      className="grid grid-cols-5 px-3 py-2 text-sm text-[rgb(24,26,36)]"
                    >
                      <span className="col-span-2 truncate" title={party.partyNameNp}>
                        {PARTIES[party.partyCode]?.short || party.partyCode}
                      </span>
                      <span>{party.candidateCount}</span>
                      <span>{party.femaleSharePct}%</span>
                      <span>{party.avgAge ?? 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {CANDIDATE_DEMOGRAPHICS_2022.fieldAvailability.samudayaNonEmpty === 0 && (
                <p className="text-xs text-[rgb(100,110,130)]">
                  Caste/community breakdown is currently unavailable: the `Samudaya` field in the
                  official 2022 candidate file is empty.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2026 Election Info Panel */}
        {showSimulationTopPanels && (
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
              {activeTab === 'manual' &&
                (!showControlSetupStep || currentGuidedControl === 'manual') && (
                  <>
                    <div className="flex justify-center mb-3">
                      <button
                        onClick={() => setSlidersLocked(!slidersLocked)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                          slidersLocked
                            ? 'border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]'
                            : 'border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:border-[rgb(24,26,36)]/30 hover:text-[rgb(24,26,36)]'
                        }`}
                        title={
                          slidersLocked
                            ? 'Unlock sliders (FPTP and PR move independently)'
                            : 'Lock sliders (FPTP and PR move together)'
                        }
                      >
                        {slidersLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
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

              {activeTab === 'demographics' &&
                (!showControlSetupStep || currentGuidedControl === 'demographics') && (
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
                    hideScenarioSelector={
                      showControlSetupStep && currentGuidedControl === 'demographics'
                    }
                    singleDimensionOnly={
                      showControlSetupStep && currentGuidedControl === 'demographics'
                    }
                  />
                )}

              {activeTab === 'advanced' &&
                (!showControlSetupStep || currentGuidedControl === 'advanced') && (
                  <div className="space-y-6">
                    <AdvancedControls
                      demographicMode={demographicMode}
                      overrideDemographics={overrideDemographicsForAdvanced}
                      onOverrideDemographicsChange={setOverrideDemographicsForAdvanced}
                      switchingMatrix={switchingMatrix}
                      onUpdateSwitching={updateSwitching}
                      onApplySwitching={handleApplySwitching}
                      onClearSwitching={handleClearSwitching}
                      onOpenAlliance={() => setAllianceModalOpen(true)}
                    />

                    {/* Target Projection Tool */}
                    <div className="bg-white rounded-lg border border-[rgb(219,211,196)] p-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                          Target Projection
                        </p>
                        <p className="text-sm text-[rgb(24,26,36)] mt-1">
                          If a party gets X% vote, how many seats would they win?
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-[rgb(100,110,130)] mb-1">Party</p>
                          <select
                            value={targetProjection.party}
                            onChange={e =>
                              setTargetProjection(prev => ({ ...prev, party: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                          >
                            {Object.keys(PARTIES).map(party => (
                              <option key={party} value={party}>
                                {PARTIES[party].short}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <p className="text-xs text-[rgb(100,110,130)] mb-1">Target Vote %</p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={targetProjection.targetVote}
                            onChange={e =>
                              setTargetProjection(prev => ({
                                ...prev,
                                targetVote: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              if (calculateTargetProjection?.projectedSliders) {
                                replaceSliders(
                                  calculateTargetProjection.projectedSliders,
                                  prSliders
                                );
                              }
                            }}
                            disabled={!calculateTargetProjection}
                            className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-[#B91C1C] text-white disabled:opacity-40"
                          >
                            Apply to Sliders
                          </button>
                        </div>
                      </div>

                      {calculateTargetProjection && (
                        <div className="rounded-lg bg-[rgb(250,249,246)] border border-[rgb(219,211,196)] p-3 space-y-2">
                          <p className="text-sm font-medium text-[rgb(24,26,36)]">
                            Projection for {PARTIES[targetProjection.party]?.short} at{' '}
                            {targetProjection.targetVote}%:
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-[rgb(100,110,130)]">Swing Needed</p>
                              <p
                                className={`text-sm font-semibold ${
                                  calculateTargetProjection.swingNeeded > 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {calculateTargetProjection.swingNeeded > 0 ? '+' : ''}
                                {calculateTargetProjection.swingNeeded.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[rgb(100,110,130)]">Current Vote</p>
                              <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                                {(fptpSliders[targetProjection.party] || 0).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-[rgb(100,110,130)]">
                            This would require taking votes proportionally from all other parties.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </>
        )}

        {/* Simulation change summary */}
        {showResultSections && inGuidedSimulation && guidedStep >= 3 && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)] mb-2">
              Biggest Input Changes
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {topSimulationChanges.map(({ party, fptpDelta, prDelta }) => (
                <div key={party} className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                    {PARTIES[party]?.short || party}
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    FPTP {fptpDelta >= 0 ? '+' : ''}
                    {fptpDelta.toFixed(2)}%
                  </p>
                  <p className="text-xs text-[rgb(100,110,130)]">
                    PR {prDelta >= 0 ? '+' : ''}
                    {prDelta.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Charts */}
        {showResultSections && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MajorityBar totalSeats={totalSeats} leadingParty={leadingParty} />

              <PRBlockChart
                prSeats={prSeats}
                nationalVoteShares={nationalVoteShares}
                method={prMethod}
              />
            </div>

            {/* Coalition builder */}
            <div className="mb-6">
              <CoalitionBuilder totalSeats={totalSeats} fptpResults={fptpResults} />
            </div>

            {/* Voter Flow Diagram */}
            <div className="mb-6">
              <VoterFlowDiagram fptpResults={fptpResults} />
            </div>

            {/* Swing Model & Seat Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SwingPanel fptpResults={fptpResults} fptpSeats={fptpSeats} />
              <SeatCalculator fptpResults={fptpResults} fptpSeats={fptpSeats} />
            </div>
          </>
        )}

        {/* Constituency Table/Map and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {showMainMapSection &&
              !inGuidedData &&
              selectedYear === 2026 &&
              nepalMapMode === 'table' && (
                <ConstituencyTable
                  fptpResults={fptpResults}
                  overrides={overrides}
                  onSelectConstituency={selectConstituency}
                />
              )}
          </div>

          <div className="lg:col-span-4">
            {showResultSections && (
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
        {showSimulationTopPanels && Object.keys(overrides).length > 0 && (
          <div className="mt-6 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#f59e0b] text-2xl">⚡</span>
              <div>
                <p className="text-[#f59e0b] font-semibold">
                  {Object.keys(overrides).length} constituency
                  {Object.keys(overrides).length > 1 ? 'ies' : ''} manually overridden
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

        {/* Methodology Section */}
        <MethodologySection />
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
      <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
        {label}
      </p>
      <p className="text-lg font-semibold text-[rgb(24,26,36)]">{value}</p>
    </div>
  );
}

/**
 * Methodology Section Component - Detailed explanation of how the simulator works
 */
function MethodologySection() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = section => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const iconMap = {
    Database,
    MapPin,
    BarChart3,
    TrendingUp,
    Users,
    Link,
    ArrowLeftRight,
    Crosshair,
    Save,
    BookOpen,
  };

  const sections = [
    {
      id: 'overview',
      title: 'Overview & Data Sources',
      icon: Database,
      content: `
The Nepal Election Simulator is a comprehensive analytical tool designed to project election outcomes based on official 2022 general election data. This tool is strictly non-partisan and serves educational and research purposes.

**Data Sources:**
- **Election Commission Nepal**: Official 2022 FPTP and PR vote shares
- **Census 2021**: Demographic data by constituency
- **Constituency Delimitation Commission**: Official constituency boundaries

**2022 Baseline Vote Shares (Official Results):**

FPTP Votes:
- CPN-UML: 30.5%
- Nepali Congress: 23.3%
- CPN-Maoist Centre: 9.2%
- Rastriya Swatantra Party: 7.8%
- Rastriya Prajatantra Party: 5.5%
- Unified Socialist: 4.1%
- Janata Samajbadi Party: 3.6%
- Janamat Party: 2.9%
- Others: 13.2%

PR Votes:
- CPN-UML: 27.0%
- Nepali Congress: 25.7%
- CPN-Maoist Centre: 11.1%
- Rastriya Swatantra Party: 10.7%
- Rastriya Prajatantra Party: 5.6%
- Janata Samajbadi Party: 4.0%
- Janamat Party: 3.7%
- Unified Socialist: 2.8%
- Others: 9.4%

**Constituency Data:**
- 165 FPTP constituencies across 7 provinces
- Historical results from 2017 and 2022 elections
- Demographic composition data
      `,
    },
    {
      id: 'fptp',
      title: 'FPTP Seat Calculation Method',
      icon: MapPin,
      content: `
**First-Past-The-Post (FPTP) Methodology:**

**Baseline Data:**
Each constituency begins with verified 2022 election results, showing the actual vote distribution across all competing parties.

**Uniform Swing Application:**
When national vote shares are adjusted, the simulator applies a proportional swing model:
- Vote changes are distributed across constituencies based on each party's existing strength
- A party's stronger constituencies receive proportionally larger vote share adjustments
- The model maintains vote conservation (gains by one party are offset by losses from others)

**Constituency Overrides:**
Users may manually specify results for individual constituencies. When overridden:
- The constituency is excluded from automatic swing calculations
- The override is preserved across other simulation changes
- Useful for modeling local factors, candidate effects, or regional variations

**Seat Allocation Rule:**
The candidate with the highest vote share in each constituency is awarded the seat. In cases of exact ties, historical voting patterns inform the outcome.

**Visualization:**
Results display on an interactive map with color-coded party affiliations and a sortable data table.
      `,
    },
    {
      id: 'pr',
      title: 'PR Seat Allocation Method',
      icon: BarChart3,
      content: `
**Proportional Representation (PR) Methodology:**

**Seat Distribution:**
- 110 PR seats allocated based on national vote share
- Allocation uses the Sainte-Laguë divisor method by default

**Calculation Process:**
1. **Vote Input**: Users adjust national PR vote share percentages
2. **Threshold Application**: The 3% national threshold and 1.5% regional threshold are applied per Nepal's election law
3. **Seat Allocation**: Valid votes are divided by successive odd numbers (1, 3, 5, 7...) to determine seat quotients

**Available Allocation Methods:**
- **Sainte-Laguë**: Default divisor method (1, 3, 5, 7...), generally neutral between large and small parties
- **D'Hondt**: Alternative divisor method (1, 2, 3, 4...), slightly favors larger parties
- **Hare Quota**: Largest remainder method using quota = votes/seats

**Combined Results:**
Total parliamentary composition equals 165 FPTP seats plus 110 PR seats (275 total). A governing majority requires 138 seats.
      `,
    },
    {
      id: 'swing',
      title: 'Vote Swing Modeling',
      icon: TrendingUp,
      content: `
**Swing Calculation Methodology:**

**Uniform Swing Model:**
The simulator employs a proportional swing model where vote share adjustments are distributed across constituencies based on existing party strength.

**Mechanism:**
When a party's national vote share is increased:
1. The required vote share is sourced proportionally from all other parties
2. Each constituency receives an adjustment proportional to the party's baseline strength there
3. Stronghold constituencies see larger absolute changes; weaker ones see smaller changes

**Advanced Parameters:**
The simulator includes optional adjustable parameters for scenario analysis:
- **Incumbency Factor**: Models potential vote erosion for parties with recent governance responsibility
- **New Party Momentum**: Adjustable parameter for parties with limited historical data
- **Systemic Shift**: Broad parameter for modeling anti-incumbent or pro-change sentiment across the electorate

These parameters are user-adjustable and default to neutral (zero effect).

**Target Analysis:**
Users may specify a target vote share for any party, and the simulator calculates:
- Required national swing percentage
- Projected seat distribution at that vote level
- Comparison with current baseline
      `,
    },
    {
      id: 'demographics',
      title: 'Demographic Analysis',
      icon: Users,
      content: `
**Demographic Dimension Modeling:**

The simulator enables analysis across population subgroups using Census 2021 data mapped to constituency boundaries.

**Available Dimensions:**
- **Geographic**: Seven provinces with distinct regional characteristics
- **Ethnic/Caste**: Population groups including Hill Brahmin/Chhetri, Terai/Madhesi communities, Janajati groups, Dalit communities, and others
- **Age Structure**: Voting-age population distribution
- **Urbanization**: Rural versus urban population ratios by constituency
- **Education**: Literacy and educational attainment levels

**Methodology:**
1. Select a demographic dimension for analysis
2. Adjust relative support levels for population segments
3. The model applies constituency-level demographic weights
4. Results reflect the population composition of each electoral district

**Data Sources:**
- Central Bureau of Statistics Census 2021
- Election Commission voter rolls
- Constituency-level demographic estimates

**Note**: Demographic modeling operates independently and cannot be combined with manual national swing adjustments.
      `,
    },
    {
      id: 'alliances',
      title: 'Electoral Alliance Modeling',
      icon: Link,
      content: `
**Alliance and Coalition Simulation:**

**Alliance Mechanics:**
When parties form an electoral alliance (gathbandan):
1. Their vote bases are combined in constituencies where both field candidates
2. The alliance typically fields a single candidate per constituency
3. Vote transfer efficiency is adjustable (accounting for imperfect voter loyalty)

**Compatibility Assessment:**
The simulator evaluates potential alliances using three dimensions:
- **Economic Position**: Fiscal policy spectrum
- **Governance Structure**: Federal versus centralized governance preferences
- **Regional Alignment**: Geographic concentration of support

Each dimension contributes to an overall compatibility score (0-100).

**Configuration Options:**
Users may construct custom alliances between any two parties or select from historical reference configurations.

**Strategic Effects:**
Alliances can alter outcomes through:
- Prevention of vote splitting between allied parties
- Concentration of support behind single candidates
- Regional consolidation effects
      `,
    },
    {
      id: 'switching',
      title: 'Inter-Party Vote Transfer',
      icon: ArrowLeftRight,
      content: `
**Vote Migration Modeling:**

The switching matrix enables modeling of voter movement between parties.

**Operational Method:**
1. Specify a percentage of voters transferring from a source party to a destination party
2. The system maintains vote conservation (transfers are zero-sum)
3. Multiple simultaneous transfers are supported and combined arithmetically

**Example Applications:**
- Modeling voter movement from established parties to newer entrants
- Simulating consolidation between ideologically similar parties
- Analyzing fragmentation effects in multi-party competition

**Matrix Structure:**
- Rows represent source parties (vote origin)
- Columns represent destination parties (vote destination)
- Cell values indicate transfer percentages

**Use Cases:**
- Scenario planning for party system evolution
- Analysis of voter loyalty and volatility
- Coalition dynamics and post-election realignment modeling
      `,
    },
    {
      id: 'battlegrounds',
      title: 'Competitive Constituency Analysis',
      icon: Crosshair,
      content: `
**Battleground Identification Methodology:**

Battleground constituencies are those where electoral outcomes are most sensitive to vote share changes.

**Selection Criteria:**
- **Margin Sensitivity**: Constituencies decided by less than 5% margin in 2022
- **Historical Volatility**: Seats that have changed party representation between elections
- **Demographic Transition**: Areas with significant population composition changes
- **Alliance Sensitivity**: Seats where alliance configurations significantly affect outcomes

**Competitive Regions:**
Analysis identifies competitive seats across:
- Urban centers with diverse electorates
- Terai/Madhes region with multi-party competition
- Hill constituencies with shifting allegiances
- Seats with retiring incumbents or new candidates

**Strategic Application:**
- Resource allocation modeling for campaign planning
- Identification of high-leverage constituencies for vote efficiency
- Alliance strategy impact assessment

**Filtering Tools:**
- Province-level filtering
- Previous winner filtering
- Constituency name search
- Battleground-only view
      `,
    },
    {
      id: 'scenarios',
      title: 'Scenario Management',
      icon: Save,
      content: `
**Saving and Loading Configurations:**

The simulator supports saving complete simulation states for later retrieval or comparison.

**Saved Parameters:**
- FPTP and PR vote share settings
- Demographic modeling configurations
- Alliance specifications
- Vote transfer matrix values
- Individual constituency overrides

**Reference Scenarios:**
Available preset configurations include:
- **2022 Baseline**: Official election results as starting point
- **Uniform National Swing**: Equal swing applied to all parties
- **Regional Variation**: Province-specific adjustment patterns
- **Party-Specific Scenarios**: Various configurations for individual party performance analysis

**User Scenarios:**
- Create named custom configurations
- Export scenario files for external sharing
- Import scenarios from other users
- Side-by-side scenario comparison

**Reset Functions:**
- Return to 2022 official results
- Clear all constituency overrides
- Remove alliance settings
- Reset demographic adjustments
      `,
    },
    {
      id: 'howto',
      title: 'User Guide',
      icon: BookOpen,
      content: `
**Using the Simulator:**

**Basic Operation:**
1. The simulator initializes with verified 2022 election results as baseline
2. Adjust vote share sliders to model different electoral scenarios
3. Observe real-time updates to seat projections
4. Interact with the map for constituency-level detail

**Advanced Functions:**
1. **Guided Mode**: Step-by-step scenario construction
2. **Demographic Analysis**: Population subgroup-based modeling
3. **Alliance Builder**: Coalition effect simulation
4. **Vote Transfer Matrix**: Inter-party movement modeling
5. **Constituency Override**: Manual result specification

**Analytical Recommendations:**
- Begin with incremental adjustments to understand baseline sensitivity
- Use demographic mode for region-specific inquiries
- Account for alliance effects in competitive areas
- Save configurations before major modifications
- Compare multiple scenarios to establish outcome ranges

**Results Interpretation:**
- **Majority Threshold**: 138 of 275 seats required for parliamentary majority
- **Projection Ranges**: Confidence intervals based on model variance
- **Competitive Seats**: Focus areas for strategic analysis
- **Coalition Scenarios**: Post-election government formation possibilities

**Output Options:**
- Image export for reports and presentations
- Data table download for spreadsheet analysis
- Scenario file sharing
      `,
    },
  ];

  return (
    <section className="mt-12 mb-8 bg-white rounded-xl border border-[rgb(219,211,196)] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[rgb(219,211,196)] bg-gradient-to-r from-[rgb(250,249,246)] to-white">
        <h2 className="text-2xl font-bold text-[rgb(24,26,36)] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[rgb(240,238,233)]">
            <Info className="w-6 h-6 text-[rgb(100,110,130)]" />
          </div>
          Methodology & User Guide
        </h2>
        <p className="text-[rgb(100,110,130)] mt-2">
          Comprehensive documentation on how the Nepal Election Simulator works and how to use it
          effectively.
        </p>
      </div>

      <div className="divide-y divide-[rgb(219,211,196)]">
        {sections.map(section => {
          const IconComponent = section.icon;
          return (
            <div key={section.id} className="bg-white">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[rgb(250,249,246)] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[rgb(240,238,233)]">
                    <IconComponent className="w-5 h-5 text-[rgb(100,110,130)]" />
                  </div>
                  <span className="font-semibold text-[rgb(24,26,36)]">{section.title}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-[rgb(100,110,130)] transition-transform ${
                    expandedSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expandedSection === section.id && (
                <div className="px-6 pb-6 pt-2 bg-[rgb(250,249,246)]/50">
                  <div className="prose prose-sm max-w-none text-[rgb(60,70,90)] whitespace-pre-line leading-relaxed">
                    {section.content.split('\n').map((line, idx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <h4 key={idx} className="font-bold text-[rgb(24,26,36)] mt-4 mb-2">
                            {line.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('- **')) {
                        const match = line.match(/- \*\*(.+?)\*\*:\s*(.+)/);
                        if (match) {
                          return (
                            <div key={idx} className="ml-4 mb-1">
                              <span className="font-semibold text-[rgb(24,26,36)]">
                                {match[1]}:
                              </span>
                              <span className="text-[rgb(60,70,90)]"> {match[2]}</span>
                            </div>
                          );
                        }
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={idx} className="ml-4">
                            {line.substring(2)}
                          </li>
                        );
                      }
                      if (line.match(/^\d+\./)) {
                        return (
                          <div key={idx} className="ml-4 font-medium text-[rgb(24,26,36)] mt-2">
                            {line}
                          </div>
                        );
                      }
                      if (line.trim() === '') {
                        return <div key={idx} className="h-2"></div>;
                      }
                      return (
                        <p key={idx} className="mb-2">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-[rgb(250,249,246)] border-t border-[rgb(219,211,196)] text-center">
        <p className="text-xs text-[rgb(100,110,130)]">
          Data sources: Election Commission Nepal 2022, Census 2021, Constituency Delimitation
          Commission.
          <br />
          This simulator is for educational and analytical purposes. Actual election results may
          vary.
        </p>
      </div>
    </section>
  );
}
