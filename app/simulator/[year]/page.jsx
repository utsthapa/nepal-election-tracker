'use client';

import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  Crosshair,
  Database,
  Info,
  Link as LinkIcon,
  Lock,
  MapPin,
  RotateCcw,
  Save,
  TrendingUp,
  Unlock,
  Users,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AllianceModal } from '../../../components/AllianceModal';
import { BattlegroundPanel } from '../../../components/BattlegroundPanel';
import { CandidatesByParty } from '../../../components/CandidatesByParty';
import { CoalitionBuilder } from '../../../components/CoalitionBuilder';
import { ConstituencyTable } from '../../../components/ConstituencyTable';
import DemographicInputPanel from '../../../components/ElectionSimulation/DemographicInputPanel';
import { Election2026InfoPanel } from '../../../components/Election2026InfoPanel';
import CandidateWordCloud from '../../../components/CandidateWordCloud';
import { ExportButton } from '../../../components/ExportButton';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header';
import { MajorityBar } from '../../../components/MajorityBar';
import { PartySliders } from '../../../components/PartySliders';
import { PRBlockChart } from '../../../components/PRBlockChart';
import { ResultsSummary } from '../../../components/ResultsSummary';
import { SeatDrawer } from '../../../components/SeatDrawer';
import { ShareButton } from '../../../components/ShareButton';
import { WorkInProgressBanner } from '../../../components/WorkInProgressBanner';
import YearSelector from '../../../components/YearSelector';
import { useLanguage } from '../../../context/LanguageContext';
import { CANDIDATE_DEMOGRAPHICS_2022 } from '../../../data/candidateDemographics2022.js';
import {
  OFFICIAL_FPTP_VOTE,
  OFFICIAL_PR_VOTE,
  PARTIES,
  PROVINCES,
  constituencies,
} from '../../../data/constituencies';
import { IDEOLOGY_COORDS } from '../../../data/partyMeta';
import { useElectionState } from '../../../hooks/useElectionState';
import { get2026ElectionData, getPartyColor } from '../../../utils/election2026Data';
import { applyRspNationalEntry } from '../../../utils/scenarios';
import { buildShareableUrlFromId } from '../../../utils/stateSerializer';

// Dynamically import heavy map components with no SSR
const NepalMap = dynamic(() => import('../../../components/NepalMap'), {
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false,
});

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

// Valid years for the simulator
const VALID_YEARS = [2026, 2022, 2017, 2013, 2008, 1999, 1994, 1991, 1959];

export default function SimulatorYearPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const yearParam = params?.year;

  // Parse and validate year from URL
  const selectedYear = useMemo(() => {
    const parsed = parseInt(yearParam, 10);
    if (VALID_YEARS.includes(parsed)) {
      return parsed;
    }
    return 2026; // Default fallback
  }, [yearParam]);

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
    hydrateSharedState,
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
    simulatedFptpShares,
    totalSeats,
    seatIntervals,
    leadingParty,
    hasMajority,
    allianceConfig,
    setAlliance,
    clearAlliance,
    prMethod,
    slidersLocked,
    setSlidersLocked,
    useRspNationalBase,
    setUseRspNationalBase,
    // Demographic modeling
    demographicMode,
    setDemographicMode,
    demographicPatterns,
    demographicTurnout,
    activeScenario,
    savedScenarios,
    activeDemographicDimension,
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
  const hydratedShareIdRef = useRef(null);
  const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);
  const [nepalMapMode, setNepalMapMode] = useState('map');
  const [experienceMode, setExperienceMode] = useState(selectedYear === 2026 ? null : 'simulation');
  const [selectedStartMode, setSelectedStartMode] = useState('baseline');
  const [simulationStep, setSimulationStep] = useState(1);
  const [surgeStrength, setSurgeStrength] = useState(0);
  const [dataProvinceFilter, setDataProvinceFilter] = useState('all');
  const [dataWinnerFilter, setDataWinnerFilter] = useState('all');
  const [dataSearch, setDataSearch] = useState('');
  const [dataBattlegroundOnly, setDataBattlegroundOnly] = useState(false);
  const [shareLoadError, setShareLoadError] = useState('');

  const scrollToSliders = () => {
    setTimeout(() => {
      document
        .getElementById('simulator-slider-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const applyBaselineStepOptions = () => {
    let baseFptp = useRspNationalBase
      ? applyRspNationalEntry({ ...OFFICIAL_FPTP_VOTE })
      : { ...OFFICIAL_FPTP_VOTE };
    const basePr = { ...OFFICIAL_PR_VOTE };

    if (surgeStrength > 0) {
      const incumbents = ['NC', 'UML', 'Maoist'];
      let transferableVotes = 0;
      incumbents.forEach(party => {
        if (baseFptp[party]) {
          const decayAmount = baseFptp[party] * surgeStrength * 0.5;
          transferableVotes += decayAmount;
          baseFptp[party] -= decayAmount;
        }
      });

      const rspShare = 0.5;
      const otherAltsShare = 0.3;
      const othersShare = 0.2;
      baseFptp.RSP = (baseFptp.RSP || 0) + transferableVotes * rspShare;

      const alternatives = ['RPP', 'JP', 'LSP', 'NUP'];
      const totalAlt = alternatives.reduce((sum, p) => sum + (baseFptp[p] || 0), 0);
      if (totalAlt > 0) {
        alternatives.forEach(party => {
          const proportion = (baseFptp[party] || 0) / totalAlt;
          baseFptp[party] += transferableVotes * otherAltsShare * proportion;
        });
      } else {
        baseFptp.RSP += transferableVotes * otherAltsShare;
      }
      baseFptp.Others = (baseFptp.Others || 0) + transferableVotes * othersShare;
    }

    const normalize = sliders => {
      const total = Object.values(sliders).reduce((sum, v) => sum + (v || 0), 0);
      if (total > 0) {
        Object.keys(sliders).forEach(key => {
          sliders[key] = (sliders[key] / total) * 100;
        });
      }
      return sliders;
    };

    replaceSliders(normalize(baseFptp), normalize(basePr));
  };

  const activeAlliance = allianceConfig?.enabled && allianceConfig.parties?.length === 2;
  const [allyA, allyB] = allianceConfig?.parties || [];
  const election2026Data = useMemo(() => get2026ElectionData(), []);
  const keyBattlegrounds = useMemo(
    () => election2026Data?.key_battlegrounds || [],
    [election2026Data]
  );
  const battlegroundNameSet = useMemo(
    () =>
      new Set(
        keyBattlegrounds.map(battle =>
          battle?.constituency ? normalizeConstituencyName(battle.constituency) : ''
        )
      ),
    [keyBattlegrounds]
  );
  const constituencyByNormalizedName = useMemo(() => {
    const map = new Map();
    constituencies.forEach(c => {
      if (c?.name) {
        map.set(normalizeConstituencyName(c.name), c);
      }
    });
    return map;
  }, []);
  const showDataDashboard = experienceMode === 'data';
  const isSimulationFlowComplete =
    selectedYear !== 2026 || experienceMode !== 'simulation' || simulationStep >= 3;
  const showResultSections =
    selectedYear === 2026 && experienceMode === 'simulation' && simulationStep === 4;
  const showControlsSection = selectedYear === 2026 && experienceMode === 'simulation';
  const showAllDataSections = showDataDashboard;
  const showSimulationTopPanels =
    selectedYear === 2026 && experienceMode === 'simulation' && simulationStep === 4;
  const showMainMapSection =
    selectedYear !== 2026 ||
    experienceMode === 'data' ||
    (experienceMode === 'simulation' && simulationStep === 4);
  const femaleCandidateShare =
    CANDIDATE_DEMOGRAPHICS_2022.genderBreakdown.find(item => item.genderLabel === 'Female')
      ?.sharePct || 0;
  const femaleElectedShare =
    CANDIDATE_DEMOGRAPHICS_2022.genderBreakdownElected.find(item => item.genderLabel === 'Female')
      ?.sharePct || 0;
  const dataRows = useMemo(() => {
    return constituencies.map(c => {
      const normalizedName = normalizeConstituencyName(c.name);
      const simulatedWinner = selectedYear === 2026 ? null : c.winner2022;
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
  }, [selectedYear, battlegroundNameSet]);

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
      // Skip null, undefined, or empty string winners
      if (!row.winner) return;
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
      filteredBattlegroundRows.map(row => (row?.name ? normalizeConstituencyName(row.name) : ''))
    );
    return keyBattlegrounds.filter(
      battle => battle?.constituency && allowed.has(normalizeConstituencyName(battle.constituency))
    );
  }, [filteredBattlegroundRows, keyBattlegrounds]);
  const topCloseSeats = useMemo(() => {
    return [...filteredDataRows].sort((a, b) => a.margin - b.margin).slice(0, 8);
  }, [filteredDataRows]);

  useEffect(() => {
    if (selectedYear === 2026) {
      setExperienceMode(null);
      setSelectedStartMode('baseline');
      setSimulationStep(1);
      setDemographicMode(false);
      return;
    }
    setExperienceMode('simulation');
    setSelectedStartMode('baseline');
    setSimulationStep(3);
  }, [selectedYear, setDemographicMode]);

  useEffect(() => {
    if (selectedYear !== 2026) {
      return;
    }
    const hasCompactState = Boolean(searchParams?.get('s'));
    if (!hasCompactState) {
      return;
    }
    // Compact shared URLs already carry state in the query string.
    setExperienceMode('simulation');
    setSelectedStartMode('baseline');
    setSimulationStep(4);
  }, [selectedYear, searchParams]);

  useEffect(() => {
    const shareId = searchParams?.get('sid');
    if (!shareId || hydratedShareIdRef.current === shareId) {
      return;
    }

    let cancelled = false;
    setShareLoadError('');

    const loadSharedState = async () => {
      try {
        const response = await fetch(`/api/simulations/${encodeURIComponent(shareId)}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to load shared simulation');
        }
        const payload = await response.json();

        if (cancelled) {
          return;
        }

        if (payload?.year && Number(payload.year) !== selectedYear) {
          router.replace(buildShareableUrlFromId(shareId, Number(payload.year)));
          return;
        }

        hydrateSharedState(payload?.state);
        hydratedShareIdRef.current = shareId;
        setExperienceMode('simulation');
        setSelectedStartMode('baseline');
        setSimulationStep(4);
      } catch {
        if (!cancelled) {
          setShareLoadError('Could not load the shared simulation state.');
        }
      }
    };

    loadSharedState();

    return () => {
      cancelled = true;
    };
  }, [searchParams, selectedYear, router, hydrateSharedState]);

  const partyColors = {};
  Object.keys(PARTIES).forEach(p => {
    partyColors[p] = `text-${p.toLowerCase()}`;
  });

  // Handle year change - navigate to new URL
  const handleYearChange = year => {
    router.push(`/simulator/${year}`);
  };

  const handleReset = () => {
    resetSliders();
    clearAllOverrides();
    clearAlliance();
    setSlidersLocked(false);
    setUseRspNationalBase(false);
    setSurgeStrength(0);
    setSimulationStep(demographicMode ? 2 : 3);
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'rgb(250, 249, 246)', fontFamily: 'Figtree, sans-serif' }}
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6" ref={screenshotRef}>
        <WorkInProgressBanner className="mb-6" />

        {selectedYear === 2026 && !experienceMode && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)] mb-3">
              Choose Mode
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setExperienceMode('simulation');
                  setSelectedStartMode('baseline');
                  setSimulationStep(1);
                }}
                className="p-4 rounded-lg border border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30 text-left"
              >
                <p className="font-semibold text-[rgb(24,26,36)]">Simulation Mode</p>
                <p className="text-sm text-[rgb(100,110,130)]">
                  Run baseline or demographic scenarios and project seats.
                </p>
              </button>
              <button
                onClick={() => setExperienceMode('data')}
                className="p-4 rounded-lg border border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30 text-left"
              >
                <p className="font-semibold text-[rgb(24,26,36)]">Data Mode</p>
                <p className="text-sm text-[rgb(100,110,130)]">
                  Browse constituency and candidate datasets.
                </p>
              </button>
            </div>
          </div>
        )}

        {selectedYear === 2026 && experienceMode === 'data' && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
                  Data Mode
                </p>
                <p className="text-sm text-[rgb(100,110,130)] mt-1">
                  You can return to simulator controls at any time.
                </p>
              </div>
              <button
                onClick={() => {
                  setExperienceMode('simulation');
                  setSelectedStartMode('baseline');
                  setSimulationStep(1);
                }}
                className="px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-sm font-semibold hover:bg-[#991B1B] transition-colors"
              >
                Switch to Simulation Mode
              </button>
            </div>
          </div>
        )}

        {showSimulationTopPanels && (
          <div className="mb-6 flex flex-wrap items-center justify-end gap-4 bg-white rounded-lg border border-[rgb(219,211,196)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <ShareButton
                state={{
                  fptpSliders,
                  prSliders,
                  overrides,
                  allianceConfig,
                  slidersLocked,
                  useRspNationalBase,
                }}
                year={selectedYear}
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

        {shareLoadError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {shareLoadError}
          </div>
        )}

        {showMainMapSection && (
          <div className="mb-6">
            <YearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />
            {selectedYear === 2026 && experienceMode && (
              <p className="text-xs text-[rgb(100,110,130)] -mt-3 mb-3">
                Viewing as{' '}
                <span className="font-medium text-[rgb(24,26,36)]">
                  {experienceMode === 'data' ? 'Data Mode' : 'Simulation Mode'}
                </span>
              </p>
            )}
            {!(showDataDashboard && selectedYear === 2026) && (
              <NepalMap
                fptpResults={
                  selectedYear === 2026 && experienceMode === 'simulation' ? fptpResults : null
                }
                onSelectConstituency={selectConstituency}
                viewMode={nepalMapMode}
                onViewModeChange={setNepalMapMode}
                year={selectedYear}
              />
            )}
          </div>
        )}

        {showDataDashboard && selectedYear === 2026 && (
          <div className="mb-6">
            <Election2026InfoPanel />
          </div>
        )}

        {showDataDashboard && (
          <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm space-y-4">
            {showAllDataSections && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedYear === 2026 ? (
                    <>
                      <DataStatCard
                        label="Total Candidates"
                        value={election2026Data?.total_candidates?.toLocaleString() ?? '3,484'}
                      />
                      <DataStatCard
                        label="Women Candidates"
                        value={`${election2026Data?.summary?.women_candidates ?? 395} (${(((election2026Data?.summary?.women_candidates ?? 395) / (election2026Data?.total_candidates ?? 3484)) * 100).toFixed(1)}%)`}
                      />
                      <DataStatCard
                        label="Parties Contesting"
                        value={election2026Data?.total_parties ?? 68}
                      />
                      <DataStatCard
                        label="Registered Voters"
                        value={
                          election2026Data?.registered_voters?.toLocaleString() ?? '18,903,689'
                        }
                      />
                    </>
                  ) : (
                    <>
                      <DataStatCard
                        label="Constituencies Visible"
                        value={filteredDataRows.length}
                      />
                      <DataStatCard label="Unique Winners" value={filteredWinnerCounts.length} />
                      <DataStatCard
                        label="Close Seats (<5%)"
                        value={filteredDataRows.filter(row => row.margin < 0.05).length}
                      />
                      <DataStatCard
                        label="Avg Margin"
                        value={`${(filteredAvgMargin * 100).toFixed(2)}%`}
                      />
                    </>
                  )}
                </div>
              </>
            )}

            {showAllDataSections && selectedYear !== 2026 && <CandidateWordCloud />}

            {showAllDataSections && (
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  {selectedYear === 2026 ? (
                    <CandidatesByParty election2026Data={election2026Data} />
                  ) : (
                    <>
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
                            filteredDataRows.length > 0
                              ? (seats / filteredDataRows.length) * 100
                              : 0;
                          return (
                            <div key={party} className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-[rgb(100,110,130)]">
                                <span>{PARTIES[party]?.name || party}</span>
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
                    </>
                  )}
                </div>

                <div className="rounded-lg border border-[rgb(219,211,196)] p-3">
                  <p className="text-sm font-semibold text-[rgb(24,26,36)] mb-2">
                    Closest Seats in 2022
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
                          {selectedYear === 2026
                            ? `2022 margin ${(seat.margin * 100).toFixed(2)}%`
                            : `Margin ${(seat.margin * 100).toFixed(2)}% • Winner ${PARTIES[seat.winner]?.name || seat.winner}`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Demographics Section */}
            {showAllDataSections && (
              <div className="rounded-lg border border-[rgb(219,211,196)] p-3 space-y-4">
                <p className="text-sm font-semibold text-[rgb(24,26,36)]">
                  Candidate Demographics (2022)
                </p>

                {/* Gender stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <DataStatCard
                    label="Total Candidates"
                    value={CANDIDATE_DEMOGRAPHICS_2022.totalCandidates.toLocaleString()}
                  />
                  <DataStatCard
                    label="Women Candidates"
                    value={`${femaleCandidateShare.toFixed(1)}%`}
                  />
                  <DataStatCard label="Women Elected" value={`${femaleElectedShare.toFixed(1)}%`} />
                  <DataStatCard
                    label="Avg Age (Elected)"
                    value={CANDIDATE_DEMOGRAPHICS_2022.ageSummaryElected.average}
                  />
                </div>

                {/* Age Distribution */}
                <div>
                  <p className="text-xs font-semibold text-[rgb(100,110,130)] mb-2">
                    Age Distribution of Candidates
                  </p>
                  <div className="space-y-1">
                    {CANDIDATE_DEMOGRAPHICS_2022.ageBuckets.map(bucket => {
                      return (
                        <div key={bucket.bucket} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-[rgb(100,110,130)]">
                            <span>{bucket.bucket}</span>
                            <span>
                              {bucket.count} ({bucket.sharePct}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[rgb(244,238,229)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#3b82f6]"
                              style={{ width: `${bucket.sharePct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Province Breakdown */}
                <div>
                  <p className="text-xs font-semibold text-[rgb(100,110,130)] mb-2">
                    Candidates by Province
                  </p>
                  <div className="space-y-1">
                    {CANDIDATE_DEMOGRAPHICS_2022.provinceBreakdown.map(prov => {
                      return (
                        <div key={prov.stateName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-[rgb(100,110,130)]">
                            <span>{prov.stateName}</span>
                            <span>
                              {prov.candidateCount} ({prov.sharePct}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[rgb(244,238,229)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#B91C1C]"
                              style={{ width: `${prov.sharePct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Parties by Female Candidates */}
                <div>
                  <p className="text-xs font-semibold text-[rgb(100,110,130)] mb-2">
                    Female Representation by Party (top 10)
                  </p>
                  <div className="space-y-1">
                    {CANDIDATE_DEMOGRAPHICS_2022.topPartiesByCandidates
                      .filter(p => p.femaleSharePct > 0)
                      .sort((a, b) => b.femaleSharePct - a.femaleSharePct)
                      .slice(0, 10)
                      .map(partyData => {
                        const partyColor = PARTIES[partyData.partyCode]?.color || '#9ca3af';
                        return (
                          <div key={partyData.partyNameNp} className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-[rgb(100,110,130)]">
                              <span>
                                {PARTIES[partyData.partyCode]?.name || partyData.partyNameNp}
                              </span>
                              <span>
                                {partyData.femaleCandidates}/{partyData.candidateCount} (
                                {partyData.femaleSharePct}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-[rgb(244,238,229)] overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${partyData.femaleSharePct}%`,
                                  backgroundColor: partyColor,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {showAllDataSections && selectedYear === 2026 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedYear === 2026 ? (
                    <DataStatCard
                      label="Most Seats Contested"
                      value={(() => {
                        const top = election2026Data?.parties?.[0];
                        return top ? `${top.name} (${top.seats_contested})` : 'N/A';
                      })()}
                    />
                  ) : (
                    <DataStatCard
                      label="Dominant Party"
                      value={
                        filteredWinnerCounts[0]
                          ? `${PARTIES[filteredWinnerCounts[0][0]]?.name || filteredWinnerCounts[0][0]} (${filteredWinnerCounts[0][1]})`
                          : 'N/A'
                      }
                    />
                  )}
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
                    {filteredBattlegroundCards.map((battle, idx) => {
                      const constituency = battle?.constituency
                        ? constituencyByNormalizedName.get(
                            normalizeConstituencyName(battle.constituency)
                          )
                        : null;
                      return (
                        <div
                          key={`${battle.province ?? idx}-${battle.constituency}`}
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
          </div>
        )}

        {showSimulationTopPanels && (
          <div className="mb-6">
            <Election2026InfoPanel />
          </div>
        )}

        {showControlsSection && (
          <>
            <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm">
              <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)] mb-3">
                Simulation Flow
              </p>
              <p className="text-sm text-[rgb(100,110,130)] mb-3">
                Step {Math.min(simulationStep, 3)} of 3:{' '}
                {simulationStep === 1
                  ? 'Choose Baseline or Demographic Mode'
                  : simulationStep === 2
                    ? selectedStartMode === 'demographic'
                      ? 'Adjust Demographic Inputs'
                      : 'Configure Baseline Scenario'
                    : 'Review and Fine-Tune Sliders'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedStartMode('baseline');
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    selectedStartMode === 'baseline'
                      ? 'border-[#B91C1C] bg-[#B91C1C]/10 text-[#B91C1C]'
                      : 'border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:border-[rgb(24,26,36)]/30 hover:text-[rgb(24,26,36)]'
                  }`}
                >
                  2022 Baseline
                </button>
                <button
                  onClick={() => {
                    setSelectedStartMode('demographic');
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    selectedStartMode === 'demographic'
                      ? 'border-[#B91C1C] bg-[#B91C1C]/10 text-[#B91C1C]'
                      : 'border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:border-[rgb(24,26,36)]/30 hover:text-[rgb(24,26,36)]'
                  }`}
                >
                  Demographic Mode
                </button>
              </div>
              {simulationStep === 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      if (selectedStartMode === 'demographic') {
                        setDemographicMode(true);
                        setSimulationStep(2);
                        return;
                      }
                      setDemographicMode(false);
                      setSimulationStep(2);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-sm font-semibold hover:bg-[#991B1B] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {selectedStartMode === 'baseline' && simulationStep === 2 && (
              <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm">
                <div className="space-y-2 rounded-lg border border-[rgb(219,211,196)] p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[rgb(24,26,36)]">Anti-Incumbent Surge</p>
                    <span className="text-xs font-mono text-[rgb(100,110,130)]">
                      {Math.round(surgeStrength * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={surgeStrength}
                    onChange={e => setSurgeStrength(parseFloat(e.target.value))}
                    className="w-full accent-[#B91C1C]"
                  />
                  <p className="text-xs text-[rgb(100,110,130)]">
                    Reduces incumbent vote share and redistributes to challenger parties.
                  </p>
                </div>

                <div
                  className="flex items-start gap-3 rounded-lg border border-[rgb(219,211,196)] p-3 cursor-pointer"
                  onClick={() => setUseRspNationalBase(!useRspNationalBase)}
                >
                  <input
                    type="checkbox"
                    checked={useRspNationalBase}
                    onChange={e => setUseRspNationalBase(e.target.checked)}
                    className="mt-0.5 accent-[#B91C1C] cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-medium text-[rgb(24,26,36)]">
                      RSP Runs in Every Seat
                    </p>
                    <p className="text-xs text-[rgb(100,110,130)] mt-1">
                      Uses RSP 2022 PR share as constituency baseline before slider shifts.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSimulationStep(1)}
                    className="px-4 py-2 rounded-lg border border-[rgb(219,211,196)] text-[rgb(24,26,36)] text-sm font-semibold hover:bg-[rgb(219,211,196)]/30 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      clearAllOverrides();
                      clearAlliance();
                      applyBaselineStepOptions();
                      setSimulationStep(3);
                      scrollToSliders();
                    }}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-sm font-semibold hover:bg-[#991B1B] transition-colors"
                  >
                    Next: Sliders
                  </button>
                </div>
              </div>
            )}

            {demographicMode && simulationStep === 2 && (
              <div className="mb-6 bg-white rounded-lg border border-[rgb(219,211,196)] p-4 shadow-sm">
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
                  hideScenarioSelector={true}
                />
                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSimulationStep(1);
                    }}
                    className="px-4 py-2 rounded-lg border border-[rgb(219,211,196)] text-[rgb(24,26,36)] text-sm font-semibold hover:bg-[rgb(219,211,196)]/30 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setSimulationStep(3);
                      scrollToSliders();
                    }}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-sm font-semibold hover:bg-[#991B1B] transition-colors"
                  >
                    Next: Sliders
                  </button>
                </div>
              </div>
            )}

            {simulationStep === 3 && (
              <div id="simulator-slider-section" className="mb-6">
                {demographicMode && (
                  <div className="mb-3 flex justify-start">
                    <button
                      onClick={() => setSimulationStep(2)}
                      className="px-3 py-2 rounded-lg border border-[rgb(219,211,196)] text-[rgb(24,26,36)] text-sm font-semibold hover:bg-[rgb(219,211,196)]/30 transition-colors"
                    >
                      Back: Demographic Mode
                    </button>
                  </div>
                )}
                <div className="flex justify-center mb-3">
                  <button
                    onClick={() => setSlidersLocked(!slidersLocked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      slidersLocked
                        ? 'border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]'
                        : 'border-[rgb(219,211,196)] text-[rgb(100,110,130)] hover:border-[rgb(24,26,36)]/30 hover:text-[rgb(24,26,36)]'
                    }`}
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
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSimulationStep(4)}
                    className="px-4 py-2 rounded-lg bg-[#B91C1C] text-white text-sm font-semibold hover:bg-[#991B1B] transition-colors"
                  >
                    Continue: Full Dashboard
                  </button>
                </div>
              </div>
            )}
          </>
        )}

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

            <div className="mb-6">
              <CoalitionBuilder totalSeats={totalSeats} fptpResults={fptpResults} />
            </div>

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
                          {PARTIES[allyA]?.name || allyA}
                        </span>
                        <span className="text-[rgb(100,110,130)]">+</span>
                        <span className="font-semibold" style={{ color: PARTIES[allyB]?.color }}>
                          {PARTIES[allyB]?.name || allyB}
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
                  ) : null}
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
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {showMainMapSection &&
              experienceMode !== 'data' &&
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

        {showResultSections && (
          <div className="mb-6">
            <BattlegroundPanel
              fptpResults={fptpResults}
              onSelectConstituency={selectConstituency}
            />
          </div>
        )}

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

        <MethodologySection />
      </main>

      <Footer />

      {selectedYear === 2026 && (
        <SeatDrawer
          constituency={selectedConstituency}
          isOpen={!!selectedConstituency}
          onClose={closeDrawer}
          onOverride={overrideConstituency}
          onClearOverride={clearOverride}
        />
      )}

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
    LinkIcon,
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
Each of the 165 constituencies begins with verified 2022 election results from the Election Commission of Nepal, giving a per-party vote share that sums to 1.0 within each constituency.

**Uniform Swing Formula:**
When the national FPTP slider for a party is moved, the shift applied to each constituency is:

  shift = (slider_value − baseline_value) / 100
  adjusted_share = clamp(baseline_share + shift × geographic_multiplier, 0, 1)

After computing adjusted shares for all parties in a constituency, the values are renormalized to sum to 1.0 to preserve vote conservation.

**Geographic Elasticity (Urban/Rural Weighting):**
Rather than applying a flat swing everywhere, each party has a geographic profile derived from where it actually won seats in 2022. The multiplier for a constituency is interpolated linearly from its district's urbanization rate (Census 2021):

  multiplier = ruralBias + (urbanBias − ruralBias) × urbanPopulationRate

Party profiles:
- RSP (urbanBias 1.5 / ruralBias 0.7): gains concentrate in Kathmandu valley and urban centers; minimal rural swing. At Kathmandu (92.5% urban): ×1.44. At Taplejung (8.2% urban): ×0.77.
- NC (urbanBias 0.85 / ruralBias 1.15): slight rural lean; strongest in hill districts (Gulmi, Gorkha, Achham, Darchula).
- Maoist (urbanBias 0.75 / ruralBias 1.30): strongly rural; wins concentrated in Karnali/mid-western mountains (Humla, Kalikot, Rolpa, Rukum).
- US (urbanBias 0.75 / ruralBias 1.30): same as Maoist; based in Sudurpashchim & Karnali (Bajhang, Doti, Dolpa, Salyan).
- UML, RPP, JSPN, JP, LSP, NUP: uniform multiplier (1.0) — geographically balanced or insufficient pattern.

**Seat Allocation Rule:**
The party with the highest adjusted vote share in a constituency wins that FPTP seat. Ties fall to historical patterns.

**Constituency Overrides:**
Users may manually pin results for individual constituencies. Overrides bypass the swing calculation entirely and are preserved across other changes.

**RSP National Entry Baseline:**
Since RSP ran in only a subset of constituencies in 2022, an optional mode ("RSP runs everywhere") sets their per-constituency baseline to their 2022 PR vote share (10.70%), redistributing the difference proportionally from all other parties before any slider adjustments are applied.
      `,
    },
    {
      id: 'pr',
      title: 'PR Seat Allocation Method',
      icon: BarChart3,
      content: `
**Proportional Representation (PR) Methodology:**

**Seat Distribution:**
110 PR seats are allocated from a separate national party-list ballot. The PR vote is independent of FPTP: voters cast two ballots (one for a local candidate, one for a party list).

**Threshold Filtering:**
Before allocation, parties below the 3% national threshold are excluded. The "Others" aggregate is also excluded from PR allocation. This mirrors Nepal's Electoral Act.

**Sainte-Laguë Algorithm (default):**
For each qualifying party, divide their vote total by successive odd divisors: 1, 3, 5, 7, 9 …
Assign each seat to whichever party currently has the highest quotient. Repeat 110 times.

  quotient(party, seat_n) = votes(party) / (2n − 1)  where n = seats already awarded + 1

Example: A party with 30% of votes gets quotients 0.300, 0.100, 0.060, 0.043 … competing against all other parties simultaneously.

**D'Hondt Algorithm (alternative):**
Same process but uses integer divisors: 1, 2, 3, 4 …

  quotient(party, seat_n) = votes(party) / (n + 1)

D'Hondt marginally favors larger parties vs. Sainte-Laguë.

**Hare Quota (alternative):**
Compute a quota = total_valid_votes / 110. Each party receives floor(votes / quota) seats automatically. Remaining seats are awarded to parties with the largest remainders.

**Combined Parliament:**
165 FPTP + 110 PR = 275 total seats. Majority threshold = 138 seats (275/2 + 1, rounded up).
      `,
    },
    {
      id: 'swing',
      title: 'Vote Swing Modeling',
      icon: TrendingUp,
      content: `
**Swing Calculation Methodology:**

**Zero-Sum Slider Constraint:**
All FPTP sliders must sum to 100%. When any slider moves, the remaining unlocked parties' values are adjusted proportionally to their current share so the total is preserved:

  other_party_new = other_party_old × (100 − new_value − locked_sum) / unlocked_sum

This models the real constraint that votes taken by one party must come from somewhere.

**Per-Constituency Swing Application:**
The baseline shift for a party in any constituency:

  shift = (slider_value − baseline_value) / 100

where baseline_value is the national 2022 FPTP share. The shift is applied additively to the constituency's 2022 result, scaled by the party's geographic multiplier (see FPTP method), then the constituency is renormalized to 1.0.

**Custom Scenario Parameters:**
The "Custom Scenario" starting point applies pre-set adjustments before any slider changes:

1. **Incumbency Decay** (0–30%): NC, UML, and Maoist lose votes proportional to their current share. The freed votes redistribute: 50% to RSP, 30% split equally across RPP and JSPN, 20% to Others.

  decay_transfer(party) = party_share × decay_strength
  RSP += 0.50 × total_decay
  RPP += 0.15 × total_decay
  JSPN += 0.15 × total_decay
  Others += 0.20 × total_decay

2. **RSP Boost** (0–20%): A direct additional multiplier applied to RSP's base, taken proportionally from all other parties:

  rsp_boost_fraction = rsp_boost × 0.15
  actual_rsp_gain = baseline_RSP × rsp_boost_fraction
  others reduced proportionally to fund rsp_gain

3. All adjusted values are renormalized to sum to 100 before loading into sliders.

**Simulated National Share:**
The FPTP sliders show your input value. Internally the simulator computes a population-weighted effective national share for each party from the 165 constituency results:

  effective_share(party) = Σ (constituency_votes_cast × adjusted_share(party)) / Σ constituency_votes_cast

This differs slightly from the slider input because geographic weighting redistributes gains non-uniformly across constituencies before normalization.
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
      icon: LinkIcon,
      content: `
**Alliance and Coalition Simulation:**

**Alliance Transfer Algorithm:**
When two parties form a gathbandan (electoral alliance), the higher-vote party in each constituency absorbs the lower-vote party's votes, discounted by a configurable handicap (imperfect voter loyalty):

  efficiency = 1 − handicap / 100
  transfer = donor_share × efficiency
  leader_share += transfer
  donor_share = 0

After the transfer, all shares in the constituency are renormalized to sum to 1.0. The handicap (0–100%) captures the empirical reality that not all voters of the donor party will vote for the alliance candidate.

**Leader vs. Donor:**
The party with the higher vote share in each constituency becomes the leader (receives votes). The other stands down. This is determined independently per constituency — the same party can be leader in some constituencies and donor in others depending on local 2022 strength.

**Compatibility Score:**
Alliance compatibility is computed from ideology coordinates across three axes:
- **Economic** (left ↔ right fiscal policy)
- **Federal** (centralized ↔ federal governance)
- **Geographic** (hill/mountain ↔ Terai/plains regional affinity)

  distance = √((econ_A − econ_B)² + (federal_A − federal_B)² + (geo_A − geo_B)²)
  score = max(0, 100 − distance × 100)

A score of 100 = ideologically identical; 0 = maximum incompatibility.

**Strategic Effects:**
Alliances can flip constituencies where neither party alone could win but their combined share exceeds all opponents. The handicap setting lets you model scenarios from perfect vote consolidation (handicap=0) to full voter defection (handicap=100).
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
                      if (!line || typeof line !== 'string') return null;
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
