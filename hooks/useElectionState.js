import { useState, useMemo, useCallback } from 'react';
import { constituencies, INITIAL_NATIONAL, OFFICIAL_FPTP_VOTE } from '../data/constituencies';
import {
  calculateAllFPTPResults,
  countFPTPSeats,
  adjustZeroSumSliders,
  FPTP_SEATS,
  PR_SEATS,
  MAJORITY_THRESHOLD,
} from '../utils/calculations';
import { allocateSeats } from '../utils/sainteLague';

/**
 * Main election state management hook
 * Manages sliders, overrides, and calculates election results
 * Supports separate FPTP and PR sliders
 */
export function useElectionState() {
  const fptpBaseline = useMemo(() => ({ ...OFFICIAL_FPTP_VOTE }), []);

  // FPTP slider values (must sum to 100) - affects constituency-level voting
  const [fptpSliders, setFptpSliders] = useState(() => ({ ...fptpBaseline }));

  // PR slider values (must sum to 100) - affects national proportional vote
  const [prSliders, setPrSliders] = useState({ ...INITIAL_NATIONAL });

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

  // Update FPTP slider (zero-sum adjustment)
  const updateFptpSlider = useCallback((party, value) => {
    setFptpSliders(current => adjustZeroSumSliders(current, party, value));
  }, []);

  // Update PR slider (zero-sum adjustment)
  const updatePrSlider = useCallback((party, value) => {
    setPrSliders(current => adjustZeroSumSliders(current, party, value));
  }, []);

  // Legacy updateSlider - updates FPTP sliders (kept for compatibility)
  const updateSlider = updateFptpSlider;

  // Reset sliders to initial values
  const resetSliders = useCallback(() => {
    setFptpSliders({ ...fptpBaseline });
    setPrSliders({ ...INITIAL_NATIONAL });
    setAllianceConfig(current => ({
      ...current,
      enabled: false,
      parties: [],
    }));
  }, [fptpBaseline]);

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

  // Calculate FPTP results using FPTP sliders
  const fptpResults = useMemo(() => {
    return calculateAllFPTPResults(fptpSliders, overrides, fptpBaseline, allianceConfig);
  }, [fptpSliders, overrides, fptpBaseline, allianceConfig]);

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
    return allocateSeats(nationalVoteShares);
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

  // Select constituency for drawer
  const selectConstituency = useCallback((id) => {
    const constituency = constituencies.find(c => c.id === id);
    if (constituency) {
      setSelectedConstituency({
        ...constituency,
        currentResults: fptpResults[id]?.adjusted || constituency.results2022,
        isOverridden: !!overrides[id],
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

    // Computed
    fptpResults,
    fptpSeats,
    prSeats,
    nationalVoteShares,
    totalSeats,
    leadingParty,
    hasMajority,
    totalSeatCount,

    // Constants
    FPTP_SEATS,
    PR_SEATS,
    MAJORITY_THRESHOLD,
  };
}

export default useElectionState;
