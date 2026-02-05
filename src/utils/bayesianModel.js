/**
 * Bayesian fundamentals model for Nepal Elections (no-poll workaround)
 * - Informative priors from 2022 FPTP/PR
 * - Proxy likelihoods: by-elections, MRP (census youth/urban), digital sentiment
 * - Monte Carlo engine with systemic bias, cluster correlation, candidate shocks, momentum walk, turnout elasticity
 */

import {
  constituencies,
  OFFICIAL_FPTP_VOTE,
  OFFICIAL_PR_VOTE,
  PARTIES,
} from '../data/constituencies';
import { CONSTITUENCY_PROPORTIONS, DISTRICT_DEMOGRAPHICS } from '../../data/demographics';
import {
  BY_ELECTION_SIGNALS,
  DIGITAL_SENTIMENT as DEFAULT_SENTIMENT,
  YOUTH_COHORT_SHARE,
} from '../../data/proxySignals';
import { ALTERNATIVE_PARTIES, PARTY_FEMALE_SHARE } from '../../data/partyMeta';
import { applyAllianceTransfer } from './calculations';
import { allocateSeats, enforceFemaleQuota } from './sainteLague';

const PARTY_LIST = Object.keys(PARTIES);
const MAJORITY = 138;

const MOUNTAIN_DISTRICTS = new Set([
  'Humla', 'Mugu', 'Dolpa', 'Mustang', 'Manang', 'Rasuwa', 'Bajura',
]);

function clamp(value, min = 0.0001, max = 0.95) {
  return Math.min(Math.max(value, min), max);
}

function normalRandom(mean = 0, sd = 1) {
  const u = Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * sd;
}

function sampleGamma(shape, scale = 1) {
  // Marsaglia and Tsang method (shape >= 1)
  if (shape < 1) {
    const u = Math.random();
    return sampleGamma(1 + shape, scale) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const x = normalRandom();
    const v = Math.pow(1 + c * x, 3);
    if (v <= 0) continue;
    const u = Math.random();
    const x2 = x * x;
    if (u < 1 - 0.0331 * x2 * x2) return d * v * scale;
    if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

function sampleBeta(alpha, beta) {
  const x = sampleGamma(alpha, 1);
  const y = sampleGamma(beta, 1);
  return x / (x + y);
}

function renormalize(shares) {
  const total = Object.values(shares).reduce((a, b) => a + b, 0);
  if (total === 0) return { ...shares };
  const normalized = {};
  Object.entries(shares).forEach(([p, v]) => {
    normalized[p] = v / total;
  });
  return normalized;
}

function classifyCluster(constituencyId) {
  const mapping = CONSTITUENCY_PROPORTIONS[constituencyId];
  if (!mapping) return 'unknown';
  const district = mapping.district;
  const demo = DISTRICT_DEMOGRAPHICS[district];
  const urban = demo?.urbanPopulation ?? 0.2;

  if (urban >= 0.55) return 'metropolitan';
  if (urban >= 0.35) return 'urban';
  if (MOUNTAIN_DISTRICTS.has(district)) return 'mountain';
  if (urban <= 0.18) return 'terai';
  return 'hill';
}

function buildClusterLookup() {
  const lookup = {};
  constituencies.forEach((c) => {
    lookup[c.id] = classifyCluster(c.id);
  });
  return lookup;
}

function applyGhostSeats(baseShares, clusterLookup) {
  const rspUrban = [];
  const rspRural = [];

  constituencies.forEach((c) => {
    const rspShare = c.results2022.RSP ?? 0;
    const cluster = clusterLookup[c.id];
    if (rspShare > 0.005) {
      if (cluster === 'metropolitan' || cluster === 'urban') {
        rspUrban.push(rspShare);
      } else {
        rspRural.push(rspShare);
      }
    }
  });

  const urbanAvg = rspUrban.length ? rspUrban.reduce((a, b) => a + b, 0) / rspUrban.length : 0.08;
  const ruralFloor = 0.025;

  const adjusted = {};
  constituencies.forEach((c) => {
    const cluster = clusterLookup[c.id];
    const baseline = baseShares[c.id] || c.results2022;
    if ((baseline.RSP ?? 0) > 0.005) {
      adjusted[c.id] = { ...baseline };
      return;
    }
    const injected = cluster === 'metropolitan' || cluster === 'urban' ? urbanAvg : ruralFloor;
    const next = { ...baseline, RSP: injected };
    adjusted[c.id] = renormalize(next);
  });

  return adjusted;
}

function applySwingToShares(baseline, swing) {
  const shifted = {};
  PARTY_LIST.forEach((p) => {
    const base = baseline[p] ?? 0;
    shifted[p] = clamp(base + (swing[p] ?? 0));
  });
  return renormalize(shifted);
}

function applyIncumbencyPenalty(shares, incumbentParty, decayRate) {
  if (!incumbentParty || decayRate <= 0) return shares;
  const adjusted = { ...shares };
  adjusted[incumbentParty] = adjusted[incumbentParty] * (1 - decayRate);
  return renormalize(adjusted);
}

function applyDigitalSentiment(shares, sentiment = DEFAULT_SENTIMENT, weight = 0.06) {
  const adjusted = {};
  PARTY_LIST.forEach((p) => {
    const sentimentScore = sentiment[p] ?? 0.5;
    const multiplier = 1 + (sentimentScore - 0.5) * weight;
    adjusted[p] = clamp((shares[p] ?? 0) * multiplier);
  });
  return renormalize(adjusted);
}

function applyByElectionSignals(seatShares, clusterLookup, activeSignals = []) {
  if (!activeSignals.length) return seatShares;
  const updated = { ...seatShares };

  activeSignals.forEach((signal) => {
    const targetCluster = signal.cluster;
    const targetParty = signal.winner;
    const pull = signal.weight ?? 0.15;

    Object.entries(updated).forEach(([seatId, shares]) => {
      const cluster = clusterLookup[seatId];
      if (!cluster) return;
      const similarity = cluster === targetCluster
        ? 1
        : (targetCluster === 'metropolitan' && cluster === 'urban') ? 0.6
        : 0.2;
      if (similarity === 0) return;

      const boost = pull * similarity * (signal.voteShare ?? 0.5);
      const adjusted = { ...shares };
      adjusted[targetParty] = clamp((adjusted[targetParty] ?? 0) + boost);
      updated[seatId] = renormalize(adjusted);
    });
  });

  return updated;
}

function applyMRPYouthShift(seatShares, mrpYouthLift = 0.02) {
  const updated = { ...seatShares };

  Object.entries(updated).forEach(([seatId, shares]) => {
    const mapping = CONSTITUENCY_PROPORTIONS[seatId];
    const district = mapping?.district;
    const demo = DISTRICT_DEMOGRAPHICS[district];
    if (!demo) return;
    const youthShare = (demo.ageGroups?.['15-29'] ?? 0.0);
    const delta = youthShare - YOUTH_COHORT_SHARE;
    if (delta <= 0) return;

    const boost = delta * mrpYouthLift; // scaled by how youth-heavy the seat is
    const adjusted = { ...shares };
    adjusted.RSP = clamp((adjusted.RSP ?? 0) + boost);
    updated[seatId] = renormalize(adjusted);
  });

  return updated;
}

function applySwitchingFlows(shares, matrix = {}) {
  let adjusted = { ...shares };
  Object.entries(matrix).forEach(([from, flows]) => {
    if (!flows) return;
    const fromShare = adjusted[from] ?? 0;
    let movedTotal = 0;
    Object.entries(flows).forEach(([to, percent]) => {
      const rate = Math.max(0, percent) / 100;
      if (rate === 0) return;
      const transfer = fromShare * rate;
      adjusted[to] = (adjusted[to] ?? 0) + transfer;
      movedTotal += transfer;
    });
    adjusted[from] = Math.max(0, adjusted[from] - movedTotal);
  });
  adjusted = renormalize(adjusted);
  return adjusted;
}

export function buildPosteriorMeans({
  fptpSliders,
  prSliders,
  overrides = {},
  alliance = null,
  activeSignals = BY_ELECTION_SIGNALS.slice(0, 2),
  digitalSentiment = DEFAULT_SENTIMENT,
  incumbencyDecay = 0.08,
  mrpYouthLift = 0.02,
  ghostSeats = true,
}) {
  const clusterLookup = buildClusterLookup();

  // Compute swing relative to 2022 national vote share
  const swing = {};
  PARTY_LIST.forEach((p) => {
    const baseline = OFFICIAL_FPTP_VOTE[p] ?? 0;
    const current = fptpSliders?.[p] ?? baseline;
    swing[p] = (current - baseline) / 100;
  });

  // Baseline seat-level shares with optional ghost seats
  const baseSharesBySeat = {};
  constituencies.forEach((c) => {
    baseSharesBySeat[c.id] = { ...c.results2022 };
  });
  const ghostAdjusted = ghostSeats ? applyGhostSeats(baseSharesBySeat, clusterLookup) : baseSharesBySeat;

  const seatShares = {};
  constituencies.forEach((c) => {
    const base = overrides[c.id] ? renormalize(overrides[c.id]) : ghostAdjusted[c.id];
    let adjusted = applySwingToShares(base, swing);
    adjusted = applyIncumbencyPenalty(adjusted, c.winner2022, incumbencyDecay);
    adjusted = applyAllianceTransfer(adjusted, alliance);
    adjusted = applyDigitalSentiment(adjusted, digitalSentiment);
    seatShares[c.id] = adjusted;
  });

  // Apply proxies
  const afterByElections = applyByElectionSignals(seatShares, clusterLookup, activeSignals);
  const afterMRP = applyMRPYouthShift(afterByElections, mrpYouthLift);

  // Posterior national PR share starting point (PR sliders)
  const prShares = {};
  PARTY_LIST.forEach((p) => {
    const val = prSliders?.[p] ?? OFFICIAL_PR_VOTE[p] ?? OFFICIAL_FPTP_VOTE[p] ?? 0;
    prShares[p] = clamp(val / 100);
  });
  const posteriorPrShares = applyDigitalSentiment(renormalize(prShares), digitalSentiment);

  // Deterministic FPTP winners (posterior mean)
  const deterministicResults = {};
  constituencies.forEach((c) => {
    const shares = afterMRP[c.id];
    const sorted = Object.entries(shares).sort((a, b) => b[1] - a[1]);
    deterministicResults[c.id] = {
      ...c,
      adjusted: shares,
      winner: sorted[0][0],
      margin: sorted[0][1] - (sorted[1]?.[1] ?? 0),
    };
  });

  return {
    seatPriors: afterMRP,
    prPriors: posteriorPrShares,
    deterministicResults,
    clusterLookup,
  };
}

function applySystemicBias(shares, sigma = 0.02) {
  const adjusted = {};
  PARTY_LIST.forEach((p) => {
    const shift = normalRandom(0, sigma);
    adjusted[p] = clamp((shares[p] ?? 0) * (1 + shift));
  });
  return renormalize(adjusted);
}

function applyClusterShock(shares, clusterShock) {
  if (!clusterShock) return shares;
  const adjusted = {};
  PARTY_LIST.forEach((p) => {
    adjusted[p] = clamp((shares[p] ?? 0) * (1 + clusterShock));
  });
  return renormalize(adjusted);
}

function applyMomentum(shares, momentumImpact, emphasisParties = ALTERNATIVE_PARTIES) {
  if (!momentumImpact) return shares;
  const adjusted = {};
  PARTY_LIST.forEach((p) => {
    const factor = emphasisParties.includes(p) ? 1.35 : 0.65;
    adjusted[p] = clamp((shares[p] ?? 0) * (1 + momentumImpact * factor));
  });
  return renormalize(adjusted);
}

function applyCandidateQuality(shares, concentration = 55) {
  const adjusted = {};
  PARTY_LIST.forEach((p) => {
    const base = clamp(shares[p] ?? 0, 0.0001, 0.999);
    const alpha = Math.max(base * concentration, 1.2);
    const beta = Math.max((1 - base) * concentration, 1.2);
    adjusted[p] = sampleBeta(alpha, beta);
  });
  return renormalize(adjusted);
}

function applyTurnoutElasticity(shares, turnoutElasticity, turnout, cluster) {
  if (turnout <= 0.66) return shares;
  if (!(cluster === 'metropolitan' || cluster === 'urban')) return shares;
  const bump = (turnout - 0.64) * turnoutElasticity;
  const adjusted = { ...shares };
  ALTERNATIVE_PARTIES.forEach((p) => {
    adjusted[p] = clamp((adjusted[p] ?? 0) * (1 + bump));
  });
  return renormalize(adjusted);
}

function simulateClusterShocks(clusterLookup, sigma = 0.012) {
  const sharedWave = normalRandom(0, sigma);
  const shocks = {};
  const clusterWeights = {
    metropolitan: 0.7,
    urban: 0.6,
    hill: 0.45,
    terai: 0.40,
    mountain: 0.35,
    unknown: 0.4,
  };
  Object.keys(clusterWeights).forEach((cluster) => {
    const local = normalRandom(0, sigma);
    const weight = clusterWeights[cluster];
    shocks[cluster] = sharedWave * weight + local * (1 - weight);
  });

  return shocks;
}

export function runBayesianSimulation({
  seatPriors,
  prPriors,
  clusterLookup,
  iterationCount = 10000,
  switchingMatrix = {},
  systemicSigma = 0.018,
  clusterSigma = 0.012,
  candidateConcentration = 55,
  momentumDrift = 0.002,
  momentumVol = 0.012,
  turnoutElasticity = 0.02,
  prMethod = 'modified',
} = {}) {
  const parties = PARTY_LIST;
  const seatDistributions = {};
  const fptpDistributions = {};
  const prDistributions = {};
  const majorityCounts = {};
  const seatWinCounts = {};
  let quotaMetRuns = 0;
  let quotaShortfallSum = 0;
  parties.forEach((p) => {
    seatDistributions[p] = [];
    fptpDistributions[p] = [];
    prDistributions[p] = [];
    majorityCounts[p] = 0;
  });
  Object.keys(seatPriors).forEach((id) => {
    seatWinCounts[id] = {};
    parties.forEach((p) => { seatWinCounts[id][p] = 0; });
  });

  let gsChangeSum = 0;
  let prevGs = null;

  for (let i = 0; i < iterationCount; i++) {
    const clusterShocks = simulateClusterShocks(clusterLookup, clusterSigma);
    const systemicAdjusted = {};
    Object.entries(seatPriors).forEach(([seatId, shares]) => {
      const systemic = applySystemicBias(shares, systemicSigma);
      const clusterShock = clusterShocks[clusterLookup[seatId] ?? 'unknown'];
      const afterCluster = applyClusterShock(systemic, clusterShock);
      const momentumStep = momentumDrift + normalRandom(0, momentumVol);
      const afterMomentum = applyMomentum(afterCluster, momentumStep);
      const afterSwitching = applySwitchingFlows(afterMomentum, switchingMatrix);
      const quality = applyCandidateQuality(afterSwitching, candidateConcentration);
      const turnout = sampleBeta(4, 3); // realistic turnout distribution
      const finalShares = applyTurnoutElasticity(quality, turnoutElasticity, turnout, clusterLookup[seatId]);
      systemicAdjusted[seatId] = finalShares;
    });

    const fptpSeatCounts = {};
    parties.forEach((p) => { fptpSeatCounts[p] = 0; });

    Object.entries(systemicAdjusted).forEach(([seatId, shares]) => {
      const sorted = Object.entries(shares).sort((a, b) => b[1] - a[1]);
      const winner = sorted[0][0];
      fptpSeatCounts[winner] += 1;
      seatWinCounts[seatId][winner] += 1;
    });

    // National PR shares after systemic/digital effects
    let prShares = applySystemicBias(prPriors, systemicSigma * 0.8);
    prShares = applyMomentum(prShares, momentumDrift, ALTERNATIVE_PARTIES);

    const prSeats = allocateSeats(prShares, { method: prMethod, seats: 110, threshold: 0.03 });
    parties.forEach((p) => prDistributions[p].push(prSeats[p] || 0));
    parties.forEach((p) => fptpDistributions[p].push(fptpSeatCounts[p] || 0));

    const totalSeats = {};
    parties.forEach((p) => { totalSeats[p] = (fptpSeatCounts[p] || 0) + (prSeats[p] || 0); });

    const quota = enforceFemaleQuota(totalSeats, PARTY_FEMALE_SHARE, 0.33);
    const adjustedTotals = quota.seats;
    if (quota.met) quotaMetRuns += 1;
    quotaShortfallSum += quota.shortfall;

    const topSeats = Math.max(...Object.values(adjustedTotals));
    if (prevGs !== null) {
      gsChangeSum += Math.abs(topSeats - prevGs);
    }
    prevGs = topSeats;

    parties.forEach((p) => {
      seatDistributions[p].push(adjustedTotals[p] || 0);
      if (adjustedTotals[p] >= MAJORITY) {
        majorityCounts[p] += 1;
      }
    });
  }

  const seatStats = {};
  const fptpStats = {};
  const prStats = {};
  parties.forEach((p) => {
    const arr = seatDistributions[p].slice().sort((a, b) => a - b);
    const fptpArr = fptpDistributions[p].slice().sort((a, b) => a - b);
    const prArr = prDistributions[p].slice().sort((a, b) => a - b);
    const mean = arr.reduce((a, b) => a + b, 0) / iterationCount;
    const fptpMean = fptpArr.reduce((a, b) => a + b, 0) / iterationCount;
    const prMean = prArr.reduce((a, b) => a + b, 0) / iterationCount;
    const p5 = arr[Math.floor(0.05 * iterationCount)];
    const p95 = arr[Math.floor(0.95 * iterationCount)];

    seatStats[p] = { mean, p5, p95, majorityProb: majorityCounts[p] / iterationCount };
    fptpStats[p] = { mean: fptpMean };
    prStats[p] = { mean: prMean };
  });

  const seatWinProbabilities = {};
  Object.entries(seatWinCounts).forEach(([seatId, counts]) => {
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    seatWinProbabilities[seatId] = {
      probabilities: Object.fromEntries(
        Object.entries(counts).map(([p, c]) => [p, c / total])
      ),
      projectedWinner: winner,
    };
  });

  const stabilityIndex = Math.max(0, 100 - (gsChangeSum / Math.max(1, iterationCount - 1)) / 2);

  return {
    seatStats,
    fptpStats,
    prStats,
    seatWinProbabilities,
    stabilityIndex,
    femaleQuota: {
      metProbability: quotaMetRuns / iterationCount,
      averageShortfall: quotaShortfallSum / iterationCount,
    },
  };
}
