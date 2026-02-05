import { useState, useMemo, useCallback, useEffect } from 'react';
import { constituencies, INITIAL_NATIONAL, OFFICIAL_FPTP_VOTE, OFFICIAL_PR_VOTE, PARTIES } from '../data/constituencies';
import {
  adjustZeroSumSliders,
  calculateAllFPTPResults,
  countFPTPSeats,
  applySwitchingMatrix,
  FPTP_SEATS,
  PR_SEATS,
  MAJORITY_THRESHOLD,
} from '../utils/calculations';
import { allocateSeats } from '../utils/sainteLague';
import { buildPosteriorMeans, runBayesianSimulation } from '../utils/bayesianModel';
import { BY_ELECTION_SIGNALS, DIGITAL_SENTIMENT } from '../../data/proxySignals';
import { FORECASTS } from '../../data/forecasts';

// Baseline modes for the model
export const BASELINE_MODES = {
  ACTUAL_2022: '2022',           // Use actual 2022 results as baseline
  EXPECTATION: 'expectation',   // Use forecast/expected values as baseline
};

// Expected baseline based on forecasts (2027 projections converted to vote shares)
const EXPECTATION_BASELINE = {
  NC: 26.5,      // Slight increase expected
  UML: 28.0,     // Slight decrease expected
  Maoist: 8.0,   // Slight decrease expected
  RSP: 12.5,     // Significant increase expected (youth vote)
  RPP: 5.0,      // Stable
  JSPN: 4.0,     // Slight increase expected
  US: 3.5,       // Slight decrease expected
  JP: 3.0,       // Slight increase expected
  LSP: 1.5,      // Stable
  NUP: 2.0,      // Slight increase expected
  Others: 6.0,   // Decrease expected
};

// Normalize percentage sliders (0-100) into shares that sum to 1
const normalizeShares = (sliderValues = {}) => {
  const total = Object.values(sliderValues).reduce((sum, val) => sum + val, 0) || 1;
  const shares = {};
  Object.entries(sliderValues).forEach(([party, value]) => {
    shares[party] = value / total;
  });
  return shares;
};

// Get baseline values based on mode
const getBaseline = (mode) => {
  switch (mode) {
    case BASELINE_MODES.EXPECTATION:
      return { ...EXPECTATION_BASELINE };
    case BASELINE_MODES.ACTUAL_2022:
    default:
      return { ...INITIAL_NATIONAL };
  }
};

export function useElectionState() {
  // Baseline mode: '2022' (actual results) or 'expectation' (forecast-based)
  const [baselineMode, setBaselineMode] = useState(BASELINE_MODES.ACTUAL_2022);

  // Whether to use proxy model (Bayesian with by-elections, sentiment, etc.)
  const [useProxyModel, setUseProxyModel] = useState(false);

  const fptpBaseline = useMemo(() => ({ ...OFFICIAL_FPTP_VOTE }), []);
  const prBaseline = useMemo(() => ({ ...OFFICIAL_PR_VOTE }), []);

  const [fptpSliders, setFptpSliders] = useState(() => ({ ...OFFICIAL_FPTP_VOTE }));
  const [prSliders, setPrSliders] = useState(() => ({ ...OFFICIAL_PR_VOTE }));
  const [overrides, setOverrides] = useState({});
  const [allianceConfig, setAllianceConfig] = useState({
    enabled: false,
    parties: [],
    handicap: 10,
  });
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [prMethod, setPrMethod] = useState('modified');
  const [activeSignals, setActiveSignals] = useState(() => {
    // Default: enable first two by-election signals
    const initial = {};
    BY_ELECTION_SIGNALS.slice(0, 2).forEach(s => {
      initial[s.id] = true;
    });
    return initial;
  });
  const [incumbencyDecay, setIncumbencyDecay] = useState(0);
  const [rspProxyIntensity, setRspProxyIntensity] = useState(0);
  const [switchingMatrix, setSwitchingMatrix] = useState({});
  const [iterationCount, setIterationCount] = useState(1000);

  // Full Slate Mode: parties that will run candidates in ALL constituencies
  // In 2022, RSP only ran in ~60% of seats. When enabled, this mode projects what would
  // happen if they fielded candidates everywhere, using their national slider % directly
  // instead of adding swing to their (often 0%) 2022 baseline.
  const [fullSlateParties, setFullSlateParties] = useState([]);

  // Update sliders when baseline mode changes (always use 2022 baseline)
  useEffect(() => {
    setFptpSliders({ ...OFFICIAL_FPTP_VOTE });
    setPrSliders({ ...OFFICIAL_PR_VOTE });
  }, [baselineMode]);

  // Slider update helpers (zero-sum)
  const updateFptpSlider = useCallback((party, value) => {
    setFptpSliders(current => adjustZeroSumSliders(current, party, value));
  }, []);

  const updatePrSlider = useCallback((party, value) => {
    setPrSliders(current => adjustZeroSumSliders(current, party, value));
  }, []);

  const updateSlider = updateFptpSlider; // legacy alias

  const resetSliders = useCallback(() => {
    setFptpSliders({ ...fptpBaseline });
    setPrSliders({ ...prBaseline });
    setOverrides({});
    setAllianceConfig(current => ({ ...current, enabled: false, parties: [] }));
    setSelectedConstituency(null);
    setIncumbencyDecay(0);
    setRspProxyIntensity(0);
    setFullSlateParties([]);
  }, [fptpBaseline, prBaseline]);

  // Toggle full slate mode for a party
  const toggleFullSlateParty = useCallback((party) => {
    setFullSlateParties(current =>
      current.includes(party)
        ? current.filter(p => p !== party)
        : [...current, party]
    );
  }, []);

  const overrideConstituency = useCallback((constituencyId, results) => {
    setOverrides(current => ({ ...current, [constituencyId]: results }));
  }, []);

  const clearOverride = useCallback((constituencyId) => {
    setOverrides(current => {
      const next = { ...current };
      delete next[constituencyId];
      return next;
    });
  }, []);

  const clearAllOverrides = useCallback(() => setOverrides({}), []);

  const setAlliance = useCallback(({ parties, handicap }) => {
    if (!Array.isArray(parties) || parties.length !== 2) return;
    const safeHandicap = typeof handicap === 'number'
      ? Math.max(0, Math.min(100, handicap))
      : 10;
    setAllianceConfig({ enabled: true, parties, handicap: safeHandicap });
  }, []);

  const clearAlliance = useCallback(() => {
    setAllianceConfig(prev => ({ ...prev, enabled: false, parties: [] }));
  }, []);

  // Get active signal objects from signal IDs
  const activeSignalObjects = useMemo(() => {
    return BY_ELECTION_SIGNALS.filter(s => activeSignals[s.id]);
  }, [activeSignals]);

  // Build posterior means using proxy model (Bayesian adjustments)
  const posteriorData = useMemo(() => {
    if (!useProxyModel) return null;

    try {
      return buildPosteriorMeans({
        fptpSliders,
        prSliders,
        overrides,
        alliance: allianceConfig.enabled ? allianceConfig : null,
        activeSignals: activeSignalObjects,
        digitalSentiment: DIGITAL_SENTIMENT,
        incumbencyDecay,
        mrpYouthLift: 0.02,
        ghostSeats: true,
      });
    } catch (e) {
      console.warn('Bayesian model error:', e);
      return null;
    }
  }, [useProxyModel, fptpSliders, prSliders, overrides, allianceConfig, activeSignalObjects, incumbencyDecay]);

  // Deterministic calculations (fast path) - used when proxy model is off
  const deterministicFptpResults = useMemo(
    () => calculateAllFPTPResults(fptpSliders, overrides, fptpBaseline, allianceConfig, switchingMatrix, {
      incumbencyDecay,
      rspProxyIntensity,
      fullSlateParties,
    }),
    [fptpSliders, overrides, fptpBaseline, allianceConfig, switchingMatrix, incumbencyDecay, rspProxyIntensity, fullSlateParties],
  );

  // Use proxy model results if available, otherwise deterministic
  const fptpResults = useMemo(() => {
    if (posteriorData?.deterministicResults) {
      return posteriorData.deterministicResults;
    }
    return deterministicFptpResults;
  }, [posteriorData, deterministicFptpResults]);

  const fptpSeats = useMemo(() => countFPTPSeats(fptpResults), [fptpResults]);

  const nationalVoteShares = useMemo(() => {
    if (posteriorData?.prPriors) {
      return posteriorData.prPriors;
    }
    return normalizeShares(prSliders);
  }, [posteriorData, prSliders]);

  const prSeats = useMemo(
    () => allocateSeats(nationalVoteShares, 1000000, PR_SEATS),
    [nationalVoteShares],
  );

  const totalSeats = useMemo(() => {
    const totals = {};
    Object.keys(PARTIES).forEach((p) => {
      totals[p] = (fptpSeats[p] || 0) + (prSeats[p] || 0);
    });
    return totals;
  }, [fptpSeats, prSeats]);

  // Run Bayesian simulation for uncertainty quantification (only when proxy model enabled)
  const simulationResults = useMemo(() => {
    if (!useProxyModel || !posteriorData) return null;

    try {
      return runBayesianSimulation({
        seatPriors: posteriorData.seatPriors,
        prPriors: posteriorData.prPriors,
        clusterLookup: posteriorData.clusterLookup,
        iterationCount: Math.min(iterationCount, 5000), // Cap for performance
        switchingMatrix,
        prMethod,
      });
    } catch (e) {
      console.warn('Bayesian simulation error:', e);
      return null;
    }
  }, [useProxyModel, posteriorData, iterationCount, switchingMatrix, prMethod]);

  const seatIntervals = useMemo(() => {
    // Use simulation results if available
    if (simulationResults?.seatStats) {
      return simulationResults.seatStats;
    }

    // Fallback to deterministic (no uncertainty)
    const intervals = {};
    Object.keys(PARTIES).forEach((party) => {
      const mean = totalSeats[party] || 0;
      intervals[party] = {
        mean,
        p5: mean,
        p95: mean,
        majorityProb: mean >= MAJORITY_THRESHOLD ? 1 : 0,
      };
    });
    return intervals;
  }, [simulationResults, totalSeats]);

  const seatWinProbabilities = useMemo(() => {
    return simulationResults?.seatWinProbabilities || {};
  }, [simulationResults]);

  const femaleQuota = useMemo(() => {
    return simulationResults?.femaleQuota || null;
  }, [simulationResults]);

  const stabilityIndex = useMemo(() => {
    return simulationResults?.stabilityIndex || 0;
  }, [simulationResults]);

  const adjustedFptpSliders = useMemo(() => ({ ...fptpSliders }), [fptpSliders]);
  const adjustedPrSliders = useMemo(() => ({ ...prSliders }), [prSliders]);

  const leadingParty = useMemo(() => {
    const entries = Object.entries(totalSeats || {});
    if (!entries.length) return null;
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }, [totalSeats]);

  const hasMajority = useMemo(() => {
    if (!leadingParty) return false;
    return (totalSeats[leadingParty] || 0) >= MAJORITY_THRESHOLD;
  }, [leadingParty, totalSeats]);

  const totalSeatCount = useMemo(() => Object.values(totalSeats).reduce((a, b) => a + b, 0), [totalSeats]);

  const selectConstituency = useCallback((id) => {
    const constituency = fptpResults[id] || constituencies.find(c => c.id === id);
    if (constituency) {
      setSelectedConstituency({
        ...constituency,
        currentResults: constituency.adjusted || constituency.results2022,
        isOverridden: !!overrides[id],
        winProbabilities: null,
        projectedWinner: constituency.winner,
      });
    }
  }, [fptpResults, overrides]);

  const closeDrawer = useCallback(() => setSelectedConstituency(null), []);

  const toggleSignal = useCallback((signalId) => {
    setActiveSignals(current => ({
      ...current,
      [signalId]: !current[signalId]
    }));
  }, []);

  const addRecentSignal = useCallback((signal) => {
    setActiveSignals(current => ({
      ...current,
      [signal.id]: true
    }));
  }, []);

  const updateSwitching = useCallback((fromParty, toParty, value) => {
    setSwitchingMatrix(current => {
      const fromMatrix = current[fromParty] || {};
      return {
        ...current,
        [fromParty]: {
          ...fromMatrix,
          [toParty]: value
        }
      };
    });
  }, []);

  return {
    // State
    fptpSliders,
    prSliders,
    sliders: fptpSliders,
    overrides,
    selectedConstituency,
    allianceConfig,
    adjustedFptpSliders,
    adjustedPrSliders,
    prMethod,
    activeSignals,
    incumbencyDecay,
    switchingMatrix,
    iterationCount,
    baselineMode,
    useProxyModel,
    fullSlateParties,

    // Actions
    updateFptpSlider,
    updatePrSlider,
    updateSlider,
    resetSliders,
    overrideConstituency,
    clearOverride,
    clearAllOverrides,
    selectConstituency,
    closeDrawer,
    setAlliance,
    clearAlliance,
    setPrMethod,
    toggleSignal,
    addRecentSignal,
    setIncumbencyDecay,
    updateSwitching,
    setBaselineMode,
    setUseProxyModel,
    setIterationCount,
    toggleFullSlateParty,

    // Computed
    fptpResults,
    fptpSeats,
    prSeats,
    totalSeats,
    nationalVoteShares,
    seatIntervals,
    seatWinProbabilities,
    femaleQuota,
    stabilityIndex,
    leadingParty,
    hasMajority,
    totalSeatCount,

    // Constants
    FPTP_SEATS,
    PR_SEATS,
    MAJORITY_THRESHOLD,
    BASELINE_MODES,
  };
}

export default useElectionState;
