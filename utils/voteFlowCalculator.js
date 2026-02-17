/**
 * Voter Flow Calculator
 * Estimates vote flows between parties compared to 2022 baseline
 */

import { constituencies } from '../data/constituencies';

/**
 * Calculate vote flows between parties based on current vs baseline results
 * @param {Object} fptpResults - Current FPTP results
 * @returns {Array} Array of { source, target, value } flow objects (value = estimated votes transferred)
 */
export function calculateVoteFlows(fptpResults) {
  // Aggregate flows nationally
  const flowMatrix = {}; // { 'UML→NC': 12345 }

  constituencies.forEach(c => {
    const result = fptpResults[c.id];
    if (!result) return;

    const current = result.adjusted || {};
    const baseline = c.results2022 || {};
    const totalVotes = c.totalVotes || 0;

    // Calculate deltas
    const deltas = {};
    const parties = new Set([...Object.keys(current), ...Object.keys(baseline)]);
    parties.forEach(p => {
      deltas[p] = (current[p] || 0) - (baseline[p] || 0);
    });

    // Split into losers (negative delta) and gainers (positive delta)
    const losers = [];
    const gainers = [];
    Object.entries(deltas).forEach(([party, delta]) => {
      if (delta < -0.001) losers.push({ party, loss: -delta });
      else if (delta > 0.001) gainers.push({ party, gain: delta });
    });

    const totalGain = gainers.reduce((sum, g) => sum + g.gain, 0);
    if (totalGain === 0 || losers.length === 0) return;

    // Distribute each loser's votes proportionally to gainers
    losers.forEach(({ party: source, loss }) => {
      const lostVotes = loss * totalVotes;
      gainers.forEach(({ party: target, gain }) => {
        const proportion = gain / totalGain;
        const flow = lostVotes * proportion;
        const key = `${source}→${target}`;
        flowMatrix[key] = (flowMatrix[key] || 0) + flow;
      });
    });
  });

  // Convert to array
  const flows = Object.entries(flowMatrix)
    .map(([key, value]) => {
      const [source, target] = key.split('→');
      return { source, target, value: Math.round(value) };
    })
    .sort((a, b) => b.value - a.value);

  return flows;
}

/**
 * Convert flows to Sankey-compatible data format
 * @param {Array} flows - Output of calculateVoteFlows
 * @param {number} minFlow - Minimum flow to include (filters noise)
 * @returns {{ nodes: Array, links: Array }}
 */
export function toSankeyData(flows, minFlow = 5000) {
  const filtered = flows.filter(f => f.value >= minFlow);
  if (filtered.length === 0) return { nodes: [], links: [] };

  // Collect unique parties
  const partySet = new Set();
  filtered.forEach(f => {
    partySet.add(f.source);
    partySet.add(f.target);
  });
  const nodeList = [...partySet];
  const nodeIndex = {};
  nodeList.forEach((name, i) => { nodeIndex[name] = i; });

  const nodes = nodeList.map(name => ({ name }));
  const links = filtered.map(f => ({
    source: nodeIndex[f.source],
    target: nodeIndex[f.target],
    value: f.value,
    sourceName: f.source,
    targetName: f.target,
  }));

  return { nodes, links };
}
