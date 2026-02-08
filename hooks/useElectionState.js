import { useState, useMemo, useCallback } from 'react';
import { constituencies, INITIAL_NATIONAL, OFFICIAL_FPTP_VOTE, OFFICIAL_PR_VOTE } from '../data/constituencies';
import {
  calculateAllFPTPResults,
  countFPTPSeats,
  applySwitchingMatrix,
  adjustZeroSumSliders,
  FPTP_SEATS,
  PR_SEATS,
  MAJORITY_THRESHOLD,
} from '../src/utils/calculations';
import { allocateSeats } from '../utils/sainteLague';

/**
 * Main election state management hook
 * Manages sliders, overrides, and calculates election results
 * Supports separate FPTP and PR sliders
 */
export function useElectionState() {
  // Baseline always uses 2022 election data
  const fptpBaseline = useMemo(() => ({ ...OFFICIAL_FPTP_VOTE }), []);
  const prBaseline = useMemo(() => ({ ...OFFICIAL_PR_VOTE }), []);

  // FPTP slider values (must sum to 100) - affects constituency-level voting
  // Uses actual 2022 PR vote shares as baseline
  const [fptpSliders, setFptpSliders] = useState(() => ({ ...OFFICIAL_FPTP_VOTE }));

  // PR slider values (must sum to 100) - affects national proportional vote
  // Uses actual 2022 PR vote shares (different from FPTP vote shares)
  const [prSliders, setPrSliders] = useState({ ...OFFICIAL_PR_VOTE });

  // Legacy combined sliders (kept for compatibility)
  const sliders = fptpSliders;

  // Constituency overrides { 'P1-1': { NC: 0.45, UML: 0.30, ... }, ... }
  const [overrides, setOverrides] = useState({});

  // Alliance (gathabandan) configuration
  const [allianceConfig, setAllianceConfig] = useState({
    enabled: false,
    parties: [],
    handicap: 10, // percent vote loss when transferring
  });

  // Currently selected constituency for drawer
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  // PR method selection
  const [prMethod, setPrMethod] = useState('modified');

  // Bayesian signals for uncertainty modeling
  const [activeSignals, setActiveSignals] = useState({});

  // Incumbency decay factor (0-1.0, where 1.0 = 100% frustration)
  const [incumbencyDecay, setIncumbencyDecay] = useState(0.60);

  // RSP momentum intensity (0-1.0 scale, default 0.85 for RSP advantage scenario)
  const [rspProxyIntensity, setRspProxyIntensity] = useState(0.85);

  // Vote switching matrix between parties
  const [switchingMatrix, setSwitchingMatrix] = useState({});

  // Monte Carlo iteration count
  const [iterationCount, setIterationCount] = useState(1000);

  // Whether FPTP and PR sliders are locked (move together)
  const [slidersLocked, setSlidersLocked] = useState(true);

  // Toggle a Bayesian signal
  const toggleSignal = useCallback((signalId) => {
    setActiveSignals(current => ({
      ...current,
      [signalId]: !current[signalId]
    }));
  }, []);

  // Add a recent signal preset
  const addRecentSignal = useCallback((presetId) => {
    setActiveSignals(current => ({
      ...current,
      [presetId]: true
    }));
  }, []);

  // Update FPTP slider (zero-sum adjustment)
  const updateFptpSlider = useCallback((party, value) => {
    setFptpSliders(current => adjustZeroSumSliders(current, party, value));
    // If locked, also update PR slider
    if (slidersLocked) {
      setPrSliders(current => adjustZeroSumSliders(current, party, value));
    }
  }, [slidersLocked]);

  // Update PR slider (zero-sum adjustment)
  const updatePrSlider = useCallback((party, value) => {
    setPrSliders(current => adjustZeroSumSliders(current, party, value));
    // If locked, also update FPTP slider
    if (slidersLocked) {
      setFptpSliders(current => adjustZeroSumSliders(current, party, value));
    }
  }, [slidersLocked]);

  // Legacy updateSlider - updates FPTP sliders (kept for compatibility)
  const updateSlider = updateFptpSlider;

  // Reset sliders to initial values (2022 baseline)
  const resetSliders = useCallback(() => {
    setFptpSliders({ ...fptpBaseline });
    setPrSliders({ ...prBaseline });
    setAllianceConfig(current => ({
      ...current,
      enabled: false,
      parties: [],
    }));
    setActiveSignals({});
    setIncumbencyDecay(0);
    setRspProxyIntensity(0);
    setSwitchingMatrix({});
    setIterationCount(1000);
  }, [fptpBaseline, prBaseline]);

  // Override a specific constituency
  const overrideConstituency = useCallback((constituencyId, results) => {
    setOverrides(current => ({
      ...current,
      [constituencyId]: results,
    }));
  }, []);

  // Remove override for a constituency
  const clearOverride = useCallback((constituencyId) => {
    setOverrides(current => {
      const newOverrides = { ...current };
      delete newOverrides[constituencyId];
      return newOverrides;
    });
  }, []);

  // Clear all overrides
  const clearAllOverrides = useCallback(() => {
    setOverrides({});
  }, []);

  // Configure or clear alliance
  const setAlliance = useCallback(({ parties, handicap }) => {
    if (!Array.isArray(parties) || parties.length !== 2) {
      return;
    }
    setAllianceConfig(prev => {
      const safeHandicap = typeof handicap === 'number'
        ? Math.max(0, Math.min(100, handicap))
        : prev.handicap;
      return {
        enabled: true,
        parties,
        handicap: safeHandicap,
      };
    });
  }, []);

  const clearAlliance = useCallback(() => {
    setAllianceConfig(prev => ({
      ...prev,
      enabled: false,
      parties: [],
    }));
  }, []);

  // Update switching matrix value
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

  // Calculate FPTP results using FPTP sliders
  const fptpResults = useMemo(() => {
    return calculateAllFPTPResults(
      fptpSliders,
      overrides,
      fptpBaseline,
      allianceConfig,
      switchingMatrix,
      {
        incumbencyDecay,
        rspProxyIntensity,
      }
    );
  }, [fptpSliders, overrides, fptpBaseline, allianceConfig, switchingMatrix, incumbencyDecay, rspProxyIntensity]);

  // Count FPTP seats by party
  const fptpSeats = useMemo(() => {
    return countFPTPSeats(fptpResults);
  }, [fptpResults]);

  // National vote shares for PR = PR sliders converted to decimals
  // In Nepal's system, PR vote is a separate national ballot
  const nationalVoteShares = useMemo(() => {
    const shares = {};
    const parties = Object.keys(INITIAL_NATIONAL);
    parties.forEach(party => {
      // Parties below threshold are not allocated; aggregate "Others" should not qualify
      shares[party] = party === 'Others' ? 0 : (prSliders[party] || 0) / 100;
    });
    return shares;
  }, [prSliders]);

  // Calculate PR seat allocation using Sainte-Laguë
  const prSeats = useMemo(() => {
    return allocateSeats(nationalVoteShares, 1000000, PR_SEATS);
  }, [nationalVoteShares]);

  // Total seats (FPTP + PR)
  const totalSeats = useMemo(() => {
    const totals = {};
    const parties = Object.keys(INITIAL_NATIONAL);
    parties.forEach(party => {
      totals[party] = (fptpSeats[party] || 0) + (prSeats[party] || 0);
    });
    return totals;
  }, [fptpSeats, prSeats]);

  // Find leading party
  const leadingParty = useMemo(() => {
    const entries = Object.entries(totalSeats);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }, [totalSeats]);

  // Check if any party/coalition has majority
  const hasMajority = useMemo(() => {
    return Object.values(totalSeats).some(seats => seats >= MAJORITY_THRESHOLD);
  }, [totalSeats]);

  // Get total seats count
  const totalSeatCount = useMemo(() => {
    return Object.values(totalSeats).reduce((a, b) => a + b, 0);
  }, [totalSeats]);

  // Adjusted FPTP sliders (for future use with Bayesian adjustments)
  const adjustedFptpSliders = useMemo(() => ({ ...fptpSliders }), [fptpSliders]);

  // Adjusted PR sliders (for future use with Bayesian adjustments)
  const adjustedPrSliders = useMemo(() => ({ ...prSliders }), [prSliders]);

  // Seat intervals (p5, p95, majority probability)
  const seatIntervals = useMemo(() => {
    const intervals = {};
    const parties = Object.keys(INITIAL_NATIONAL);
    parties.forEach(party => {
      const mean = totalSeats[party] || 0;
      intervals[party] = {
        mean,
        p5: mean,
        p95: mean,
        majorityProb: mean >= MAJORITY_THRESHOLD ? 1 : 0,
      };
    });
    return intervals;
  }, [totalSeats]);

  // Seat win probabilities (placeholder for future Bayesian implementation)
  const seatWinProbabilities = useMemo(() => {
    return {};
  }, []);

  // Female quota status
  const femaleQuota = useMemo(() => {
    return null;
  }, []);

  // Stability index
  const stabilityIndex = useMemo(() => {
    return 0;
  }, []);

  // Select constituency for drawer
  const selectConstituency = useCallback((id) => {
    const constituency = constituencies.find(c => c.id === id);
    if (constituency) {
      const result = fptpResults[id] || constituency;
      setSelectedConstituency({
        ...constituency,
        currentResults: result.adjusted || constituency.results2022,
        isOverridden: !!overrides[id],
        winProbabilities: null,
        projectedWinner: result.winner || constituency.winner2022,
      });
    }
  }, [fptpResults, overrides]);

  // Close drawer
  const closeDrawer = useCallback(() => {
    setSelectedConstituency(null);
  }, []);

  return {
    // State - Separate FPTP and PR sliders
    fptpSliders,
    prSliders,
    sliders, // Legacy: same as fptpSliders
    overrides,
    selectedConstituency,
    allianceConfig,
    prMethod,
    activeSignals,
    incumbencyDecay,
    rspProxyIntensity,
    switchingMatrix,
    iterationCount,
    slidersLocked,

    // Actions - Separate slider updates
    updateFptpSlider,
    updatePrSlider,
    updateSlider, // Legacy: same as updateFptpSlider
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
    setRspProxyIntensity,
    updateSwitching,
    setSlidersLocked,
    setIterationCount,

    // Computed
    fptpResults,
    fptpSeats,
    prSeats,
    nationalVoteShares,
    totalSeats,
    leadingParty,
    hasMajority,
    totalSeatCount,
    adjustedFptpSliders,
    adjustedPrSliders,
    seatIntervals,
    seatWinProbabilities,
    femaleQuota,
    stabilityIndex,

    // Constants
    FPTP_SEATS,
    PR_SEATS,
    MAJORITY_THRESHOLD,
  };
}

export default useElectionState;
