/**
 * Quick data sanity checks for constituency-level vote shares.
 * - Loads data/constituencies.js without ESM support by stripping exports.
 * - Verifies:
 *   1) Vote share rows sum to ~1.0
 *   2) winner2022 matches the max vote share
 *   3) margin equals difference between top two candidates
 *   4) Aggregated winner seat counts match ACTUAL_2022_SEATS.FPTP
 *   5) Aggregated national FPTP vote shares match OFFICIAL_FPTP_VOTE
 *
 * Run: node validate-votes.js
 */

const fs = require('fs');
const vm = require('vm');

// Load constituencies.js (ESM) into a sandbox
const code = fs
  .readFileSync('data/constituencies.js', 'utf8')
  .replace(/export const /g, 'var ')
  .replace(/export default[^;]*;?/g, '');

const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const {
  constituencies,
  ACTUAL_2022_SEATS,
  OFFICIAL_FPTP_VOTE,
} = sandbox;

const floatEq = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol;

// 1) Vote share sums
const sumIssues = [];
for (const c of constituencies) {
  const sum = Object.values(c.results2022).reduce((s, v) => s + v, 0);
  if (!floatEq(sum, 1, 5e-3)) {
    sumIssues.push({ id: c.id, name: c.name, sum });
  }
}

// 2) Winner correctness & 3) margin correctness
const winnerIssues = [];
const marginIssues = [];
for (const c of constituencies) {
  const sorted = Object.entries(c.results2022).sort((a, b) => b[1] - a[1]);
  const [winParty, winShare] = sorted[0];
  const [, runnerUpShare] = sorted[1] || [null, 0];
  if (winParty !== c.winner2022) {
    winnerIssues.push({ id: c.id, name: c.name, expected: winParty, actual: c.winner2022 });
  }
  const margin = winShare - runnerUpShare;
  if (!floatEq(margin, c.margin, 5e-3)) {
    marginIssues.push({ id: c.id, name: c.name, expected: margin, actual: c.margin });
  }
}

// 4) Seat tally by winner
const seatTally = {};
for (const c of constituencies) {
  seatTally[c.winner2022] = (seatTally[c.winner2022] || 0) + 1;
}
const seatDiffs = [];
for (const [party, official] of Object.entries(ACTUAL_2022_SEATS.FPTP)) {
  const ours = seatTally[party] || 0;
  if (ours !== official) seatDiffs.push({ party, ours, official });
}

// 5) National vote share
let nationalVotes = 0;
const partyVotes = {};
for (const c of constituencies) {
  const total = Number(c.totalVotes || 0);
  nationalVotes += total;
  for (const [p, share] of Object.entries(c.results2022)) {
    partyVotes[p] = (partyVotes[p] || 0) + share * total;
  }
}
const nationalShare = {};
for (const [p, v] of Object.entries(partyVotes)) {
  nationalShare[p] = (v / nationalVotes) * 100;
}
const voteDiffs = [];
for (const [party, officialPct] of Object.entries(OFFICIAL_FPTP_VOTE)) {
  const ours = nationalShare[party] || 0;
  if (!floatEq(ours, officialPct, 0.25)) {
    voteDiffs.push({ party, ours: Number(ours.toFixed(2)), official: officialPct });
  }
}

// Report
const printIssue = (title, issues) => {
  console.log(`\\n${title}:`);
  if (issues.length === 0) {
    console.log('  OK');
  } else {
    issues.slice(0, 20).forEach((i) => console.log(' ', i));
    if (issues.length > 20) console.log(`  ...and ${issues.length - 20} more`);
  }
};

printIssue('Vote share sums != 1', sumIssues);
printIssue('Winner mismatch', winnerIssues);
printIssue('Margin mismatch', marginIssues);
printIssue('Seat tally diffs vs ACTUAL_2022_SEATS', seatDiffs);
printIssue('National FPTP vote share diffs vs OFFICIAL_FPTP_VOTE (>0.25pp)', voteDiffs);

