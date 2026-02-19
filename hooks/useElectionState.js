import { useState, useMemo, useCallback } from 'react';
import {
  constituencies,
  INITIAL_NATIONAL,
  OFFICIAL_FPTP_VOTE,
  OFFICIAL_PR_VOTE,
} from '../data/constituencies';
import {
  calculateAllFPTPResults,
  countFPTPSeats,
  adjustZeroSumSliders,
  FPTP_SEATS,
  PR_SEATS,
  MAJORITY_THRESHOLD,
} from '../utils/calculations';
import { calculateDemographicFPTPResults } from '../utils/demographicCalculations';
import { allocateSeats } from '../utils/sainteLague';
import { applyDemographicModel } from '../utils/demographicCalculator';
import { PRESET_SCENARIOS, createNeutralBaseline } from '../data/demographicScenarios';
import { readStateFromUrl } from '../utils/stateSerializer';

/**
 * Main election state management hook
 * Manages sliders, overrides, and calculates election results
 * Supports separate FPTP and PR sliders
 */
export function useElectionState() {
  // Hydrate from URL on initial load
  const urlState = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return readStateFromUrl();
  }, []);

  // Baseline always uses 2022 election data
  const fptpBaseline = useMemo(() => ({ ...OFFICIAL_FPTP_VOTE }), []);
  const prBaseline = useMemo(() => ({ ...OFFICIAL_PR_VOTE }), []);

  // FPTP slider values (must sum to 100) - affects constituency-level voting
  const [fptpSliders, setFptpSliders] = useState(
    () => urlState?.fptpSliders ?? { ...OFFICIAL_FPTP_VOTE }
  );

  // PR slider values (must sum to 100) - affects national proportional vote
  const [prSliders, setPrSliders] = useState(() => urlState?.prSliders ?? { ...OFFICIAL_PR_VOTE });

  // Legacy combined sliders (kept for compatibility)
  const sliders = fptpSliders;

  // Constituency overrides { 'P1-1': { NC: 0.45, UML: 0.30, ... }, ... }
  const [overrides, setOverrides] = useState(() => urlState?.overrides ?? {});

  // Alliance (gathabandan) configuration
  const [allianceConfig, setAllianceConfig] = useState(
    () =>
      urlState?.allianceConfig ?? {
        enabled: false,
        parties: [],
        handicap: 10,
      }
  );

  // Currently selected constituency for drawer
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  // PR method selection
  const [prMethod, setPrMethod] = useState('modified');

  // Vote switching matrix between parties
  const [switchingMatrix, setSwitchingMatrix] = useState({});

  // Whether FPTP and PR sliders are locked (move together)
  const [slidersLocked, setSlidersLocked] = useState(() => urlState?.slidersLocked ?? true);

  // Demographic modeling state
  const [demographicMode, setDemographicMode] = useState(false);
  const [demographicPatterns, setDemographicPatterns] = useState(null);
  const [demographicTurnout, setDemographicTurnout] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [activeDemographicDimension, setActiveDemographicDimension] = useState('age');

  // Use demographic-based seat calculations (for realistic RSP/urban party performance)
  const [useDemographicSeats, setUseDemographicSeats] = useState(true);
  const [savedScenarios, setSavedScenarios] = useState(() => {
    // Load saved scenarios from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('nepalPolitics_demographicScenarios');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.warn('Failed to load saved scenarios:', e);
        return [];
      }
    }
    return [];
  });

  // Update FPTP slider (zero-sum adjustment)
  const updateFptpSlider = useCallback(
    (party, value) => {
      setFptpSliders(current => adjustZeroSumSliders(current, party, value));
      // If locked, also update PR slider
      if (slidersLocked) {
        setPrSliders(current => adjustZeroSumSliders(current, party, value));
      }
    },
    [slidersLocked]
  );

  // Update PR slider (zero-sum adjustment)
  const updatePrSlider = useCallback(
    (party, value) => {
      setPrSliders(current => adjustZeroSumSliders(current, party, value));
      // If locked, also update FPTP slider
      if (slidersLocked) {
        setFptpSliders(current => adjustZeroSumSliders(current, party, value));
      }
    },
    [slidersLocked]
  );

  // Legacy updateSlider - updates FPTP sliders (kept for compatibility)
  const updateSlider = updateFptpSlider;

  // Replace both slider maps directly (used for bulk operations)
  const replaceSliders = useCallback((nextFptpSliders, nextPrSliders) => {
    if (nextFptpSliders) {
      setFptpSliders(nextFptpSliders);
    }
    if (nextPrSliders) {
      setPrSliders(nextPrSliders);
    }
  }, []);

  // Set one FPTP party to match its current PR vote share (without mutating PR)
  const setFptpToPr = useCallback(
    party => {
      const targetValue = prSliders[party];
      if (typeof targetValue !== 'number') {
        return;
      }
      setFptpSliders(current => adjustZeroSumSliders(current, party, targetValue));
    },
    [prSliders]
  );

  // Reset sliders to initial values (2022 baseline)
  const resetSliders = useCallback(() => {
    setFptpSliders({ ...fptpBaseline });
    setPrSliders({ ...prBaseline });
    setAllianceConfig(current => ({
      ...current,
      enabled: false,
      parties: [],
    }));
    setSwitchingMatrix({});
  }, [fptpBaseline, prBaseline]);

  // Override a specific constituency
  const overrideConstituency = useCallback((constituencyId, results) => {
    setOverrides(current => ({
      ...current,
      [constituencyId]: results,
    }));
  }, []);

  // Remove override for a constituency
  const clearOverride = useCallback(constituencyId => {
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
      const safeHandicap =
        typeof handicap === 'number' ? Math.max(0, Math.min(100, handicap)) : prev.handicap;
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
          [toParty]: value,
        },
      };
    });
  }, []);

  // Demographic modeling actions
  const updateDemographicPattern = useCallback((dimension, segment, partyShares) => {
    setDemographicPatterns(current => {
      if (!current) {
        // Initialize with neutral baseline if not set
        const parties = Object.keys(INITIAL_NATIONAL);
        current = createNeutralBaseline(parties).patterns;
      }
      return {
        ...current,
        [dimension]: {
          ...current[dimension],
          [segment]: partyShares,
        },
      };
    });
  }, []);

  const updateDemographicTurnout = useCallback((dimension, segment, rate) => {
    setDemographicTurnout(current => {
      if (!current) {
        // Initialize with default 65% turnout if not set
        current = createNeutralBaseline([]).turnout;
      }
      return {
        ...current,
        [dimension]: {
          ...current[dimension],
          [segment]: rate,
        },
      };
    });
  }, []);

  const loadScenario = useCallback(scenario => {
    setDemographicPatterns(scenario.patterns);
    setDemographicTurnout(scenario.turnout);
    setActiveScenario(scenario.id);
    setDemographicMode(true);
  }, []);

  const saveScenario = useCallback(
    (name, description) => {
      if (!demographicPatterns || !demographicTurnout) {
        console.warn('Cannot save scenario: no demographic data set');
        return;
      }

      const newScenario = {
        id: `custom-${Date.now()}`,
        name,
        description: description || 'Custom scenario',
        patterns: demographicPatterns,
        turnout: demographicTurnout,
        isPreset: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [...savedScenarios, newScenario];
      setSavedScenarios(updated);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nepalPolitics_demographicScenarios', JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save scenario to localStorage:', e);
        }
      }

      return newScenario;
    },
    [demographicPatterns, demographicTurnout, savedScenarios]
  );

  const deleteScenario = useCallback(
    scenarioId => {
      const updated = savedScenarios.filter(s => s.id !== scenarioId);
      setSavedScenarios(updated);

      // Update localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('nepalPolitics_demographicScenarios', JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to update localStorage:', e);
        }
      }

      // Clear active scenario if it was deleted
      if (activeScenario === scenarioId) {
        setActiveScenario(null);
      }
    },
    [savedScenarios, activeScenario]
  );

  const clearDemographicInputs = useCallback(() => {
    const parties = Object.keys(INITIAL_NATIONAL);
    const neutral = createNeutralBaseline(parties);
    setDemographicPatterns(neutral.patterns);
    setDemographicTurnout(neutral.turnout);
    setActiveScenario(null);
  }, []);

  // Apply demographic model to generate constituency-level predictions
  const demographicPredictions = useMemo(() => {
    if (!demographicMode || !demographicPatterns || !demographicTurnout) {
      return null;
    }

    try {
      return applyDemographicModel(
        constituencies,
        demographicPatterns,
        demographicTurnout,
        activeDemographicDimension
      );
    } catch (error) {
      console.error('Error applying demographic model:', error);
      return null;
    }
  }, [demographicMode, demographicPatterns, demographicTurnout, activeDemographicDimension]);

  // Calculate FPTP results using FPTP sliders or demographic predictions
  const fptpResults = useMemo(() => {
    if (demographicMode && demographicPredictions) {
      // Convert demographic predictions to overrides format
      const demographicOverrides = {};
      demographicPredictions.forEach(pred => {
        // Convert percentages (0-100) to decimals (0-1)
        const voteSharesDecimal = {};
        Object.entries(pred.voteShares).forEach(([party, percentage]) => {
          voteSharesDecimal[party] = percentage / 100;
        });
        demographicOverrides[pred.constituencyId] = voteSharesDecimal;
      });

      // Merge with manual overrides (manual overrides take precedence)
      const mergedOverrides = {
        ...demographicOverrides,
        ...overrides, // Manual overrides override demographic predictions
      };

      return calculateAllFPTPResults(fptpSliders, mergedOverrides, fptpBaseline, allianceConfig);
    }

    // Use demographic-based calculations for realistic seat distribution
    // This ensures RSP at 40% wins more seats than NC at 40% due to urban concentration
    if (useDemographicSeats) {
      return calculateDemographicFPTPResults(
        fptpSliders,
        overrides,
        fptpBaseline,
        allianceConfig,
        true
      );
    }

    // Default: use existing calculation without demographic weighting
    return calculateAllFPTPResults(fptpSliders, overrides, fptpBaseline, allianceConfig);
  }, [
    fptpSliders,
    overrides,
    fptpBaseline,
    allianceConfig,
    demographicMode,
    demographicPredictions,
    useDemographicSeats,
  ]);

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
    // Fold seats from non-slider parties (e.g., Independents) into Others
    const extraFptpSeats = Object.entries(fptpSeats).reduce((sum, [party, seats]) => {
      return party in totals ? sum : sum + (seats || 0);
    }, 0);
    const extraPrSeats = Object.entries(prSeats).reduce((sum, [party, seats]) => {
      return party in totals ? sum : sum + (seats || 0);
    }, 0);
    totals.Others = (totals.Others || 0) + extraFptpSeats + extraPrSeats;
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

  // TODO: Adjusted FPTP sliders - currently just copies, intended for Bayesian adjustments
  const adjustedFptpSliders = useMemo(() => ({ ...fptpSliders }), [fptpSliders]);

  // TODO: Adjusted PR sliders - currently just copies, intended for Bayesian adjustments
  const adjustedPrSliders = useMemo(() => ({ ...prSliders }), [prSliders]);

  // TODO: Seat intervals - placeholder values (p5, p95 should be calculated from distribution)
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

  // TODO: Seat win probabilities - placeholder for Bayesian implementation
  const seatWinProbabilities = useMemo(() => {
    return {};
  }, []);

  // TODO: Female quota status - not yet implemented
  const femaleQuota = useMemo(() => {
    return null;
  }, []);

  // TODO: Stability index - not yet implemented
  const stabilityIndex = useMemo(() => {
    return 0;
  }, []);

  // Select constituency for drawer
  const selectConstituency = useCallback(
    id => {
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
    },
    [fptpResults, overrides]
  );

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
    switchingMatrix,
    slidersLocked,

    // Demographic modeling state
    demographicMode,
    demographicPatterns,
    demographicTurnout,
    activeScenario,
    savedScenarios,
    demographicPredictions,
    activeDemographicDimension,
    useDemographicSeats,
    setUseDemographicSeats,

    // Actions - Separate slider updates
    updateFptpSlider,
    updatePrSlider,
    updateSlider, // Legacy: same as updateFptpSlider
    replaceSliders,
    setFptpToPr,
    resetSliders,
    overrideConstituency,
    clearOverride,
    clearAllOverrides,
    selectConstituency,
    closeDrawer,
    setAlliance,
    clearAlliance,
    setPrMethod,
    updateSwitching,
    setSlidersLocked,

    // Demographic modeling actions
    setDemographicMode,
    setActiveDemographicDimension,
    updateDemographicPattern,
    updateDemographicTurnout,
    loadScenario,
    saveScenario,
    deleteScenario,
    clearDemographicInputs,

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
    PRESET_SCENARIOS,
  };
}

export default useElectionState;
