import { useState, useMemo, useCallback } from 'react';
import { constituencies, INITIAL_NATIONAL } from '../data/constituencies';
import {
  calculateAllFPTPResults,
  countFPTPSeats,
  adjustZeroSumSliders,
  FPTP_SEATS,
  PR_SEATS,
  MAJORITY_THRESHOLD,
} from '../utils/calculations';
import { allocateSeats, calculateNationalVoteShare } from '../utils/sainteLague';

// Build a baseline for FPTP sliders from the actual 2022 constituency results
const buildFptpBaseline = () => {
  const shares = calculateNationalVoteShare(constituencies, {});
  const parties = Object.keys(INITIAL_NATIONAL);
  const baseline = {};
  let runningTotal = 0;

  parties.forEach((party, index) => {
    if (index === parties.length - 1) {
      baseline[party] = Math.max(0, Math.round((100 - runningTotal) * 10) / 10);
    } else {
      const pct = Math.max(0, Math.round(((shares?.[party] || 0) * 100) * 10) / 10);
      baseline[party] = pct;
      runningTotal += pct;
    }
  });

  // Correct any rounding drift on the last party to ensure sum = 100
  const sum = Object.values(baseline).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 100) > 0.05) {
    const lastParty = parties[parties.length - 1];
    baseline[lastParty] = Number((baseline[lastParty] + (100 - sum)).toFixed(1));
  }

  return baseline;
};

/**
 * Main election state management hook
 * Manages sliders, overrides, and calculates election results
 * Now supports separate FPTP and PR sliders
 */
export function useElectionState() {
  const fptpBaseline = useMemo(buildFptpBaseline, []);

  // FPTP slider values (must sum to 100) - affects constituency-level voting
  const [fptpSliders, setFptpSliders] = useState(() => ({ ...fptpBaseline }));

  // PR slider values (must sum to 100) - affects national proportional vote
  const [prSliders, setPrSliders] = useState({ ...INITIAL_NATIONAL });

  // Legacy combined sliders (deprecated, kept for compatibility)
  const sliders = fptpSliders;

  // Constituency overrides { 'P1-1': { NC: 0.45, UML: 0.30, ... }, ... }
  const [overrides, setOverrides] = useState({});

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

  // Calculate FPTP results using FPTP sliders
  const fptpResults = useMemo(() => {
    return calculateAllFPTPResults(fptpSliders, overrides, fptpBaseline);
  }, [fptpSliders, overrides, fptpBaseline]);

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
      shares[party] = prSliders[party] / 100;
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
