/**
 * Regenerate data/constituencies.js from official ECN CSV (data/2022_HOR.csv)
 * using constituency metadata in data/constituencies_real.json.
 *
 * Usage: node scripts/rebuild-constituencies.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PARTIES = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US', 'JP', 'LSP', 'NUP', 'Others'];

const normalize = (s = '') => s.replace(/\s+/g, ' ').trim();

// Map Nepali party names -> canonical codes
const PARTY_MAP = new Map([
  ['नेपाली काँग्रेस', 'NC'],
  ['नेपाल कम्युनिष्ट पार्टी (एमाले)', 'UML'],
  ['नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)(एकल चुनाव चिन्ह)', 'Maoist'],
  ['नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)', 'Maoist'],
  ['राष्ट्रिय स्वतन्त्र पार्टी', 'RSP'],
  ['राष्ट्रिय प्रजातन्त्र पार्टी', 'RPP'],
  ['जनता समाजवादी पार्टी, नेपाल', 'JSPN'],
  ['नेपाल कम्युनिष्ट पार्टी (एकीकृत समाजवादी)', 'US'],
  ['नेपाल कम्युनिष्ट पार्टी (एकिकृत समाजबादी)', 'US'],
  ['जनमत पार्टी', 'JP'],
  ['लोकतान्त्रिक समाजवादी पार्टी, नेपाल', 'LSP'],
  ['नागरिक उन्मुक्ति पार्टी', 'NUP'],
]);

const mapParty = (raw) => PARTY_MAP.get(normalize(raw)) || 'Others';

// Lightweight CSV parser that supports quoted fields and embedded newlines
function parseCSV(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (ch === '\r') {
        // ignore
      } else {
        field += ch;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Load existing JS exports from data/constituencies.js
function loadExisting() {
  const code = fs
    .readFileSync(path.join(__dirname, '..', 'data', 'constituencies.js'), 'utf8')
    .replace(/export const /g, 'var ')
    .replace(/export default[^;]*;?/g, '');

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

// Compute per-constituency aggregates from CSV rows
function computeGroups(csvRows) {
  const [headerRaw, ...body] = csvRows;
  const header = headerRaw.map((h, i) => (i === 0 ? h.replace(/^\uFEFF/, '') : h));

  const rows = body
    .filter((r) => r.length >= header.length)
    .map((r) =>
      Object.fromEntries(header.map((key, idx) => [key, r[idx] ?? '']))
    );

  const groups = new Map(); // key: district|seat -> rows
  for (const r of rows) {
    const district = normalize(r.DistrictName);
    const seat = normalize(r.SCConstID || '');
    const key = `${district}|${seat}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  const aggregates = new Map();

  for (const [key, list] of groups.entries()) {
    let total = 0;
    const votesByParty = {};
    const candidates = [];

    for (const row of list) {
      const votes = Number(row.TotalVoteReceived) || 0;
      const party = mapParty(row.PoliticalPartyName);
      total += votes;
      votesByParty[party] = (votesByParty[party] || 0) + votes;
      candidates.push({ votes, party, name: row.CandidateName });
    }

    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    const runner = candidates[1] || { votes: 0 };

    // Adjust "Others" so aggregated minor parties don't incorrectly beat the winner
    const adjustedVotes = { ...votesByParty };
    if (winner.party !== Object.entries(adjustedVotes).sort((a, b) => b[1] - a[1])[0][0]) {
      const topOther = Math.max(
        0,
        ...candidates.filter((c) => c.party === 'Others').map((c) => c.votes),
      );
      adjustedVotes.Others = topOther;
    }

    const adjustedTotal = Object.values(adjustedVotes).reduce((s, v) => s + v, 0);
    const results = {};
    PARTIES.forEach((p) => {
      results[p] = adjustedTotal ? (adjustedVotes[p] || 0) / adjustedTotal : 0;
    });

    const sortedAdj = Object.entries(results).sort((a, b) => b[1] - a[1]);
    const margin = sortedAdj.length > 1 ? sortedAdj[0][1] - sortedAdj[1][1] : sortedAdj[0]?.[1] || 0;

    aggregates.set(key, {
      totalVotes: total,
      results,
      winnerParty: winner.party,
      winnerName: winner.name,
      margin,
      nationalVotes: votesByParty, // unadjusted totals for national aggregation
    });
  }

  return aggregates;
}

function main() {
  const existing = loadExisting();
  const csvText = fs.readFileSync(path.join(__dirname, '..', 'data', '2022_HOR.csv'), 'utf8');
  const aggregates = computeGroups(parseCSV(csvText));

  const metaList = require('../data/constituencies_real.json');
  const nameToKey = new Map(
    metaList.map((m) => [m.name, `${normalize(m.district_np)}|${normalize(String(m.seat))}`])
  );
  const nameToMeta = new Map(metaList.map((m) => [m.name, m]));

  const newConstituencies = existing.constituencies.map((c) => {
    const key = nameToKey.get(c.name);
    if (!key) throw new Error(`No metadata mapping for constituency name: ${c.name}`);
    const agg = aggregates.get(key);
    if (!agg) throw new Error(`No vote aggregate for key: ${key} (${c.name})`);
    const meta = nameToMeta.get(c.name);

    // Ensure every party key exists
    const resultsWithZeros = {};
    PARTIES.forEach((p) => {
      resultsWithZeros[p] = agg.results[p] || 0;
    });

    return {
      ...c,
      province: meta.province,
      district: meta.district,
      totalVotes: agg.totalVotes,
      winner2022: agg.winnerParty,
      candidate2022: agg.winnerName,
      margin: Number(agg.margin.toFixed(6)),
      results2022: resultsWithZeros,
    };
  });

  // Recompute official FPTP seat counts from refreshed data
  const seatCounts = newConstituencies.reduce((acc, c) => {
    acc[c.winner2022] = (acc[c.winner2022] || 0) + 1;
    return acc;
  }, {});

  const officialFptp = {
    NC: seatCounts.NC || 0,
    UML: seatCounts.UML || 0,
    Maoist: seatCounts.Maoist || 0,
    RSP: seatCounts.RSP || 0,
    RPP: seatCounts.RPP || 0,
    JSPN: seatCounts.JSPN || 0,
    US: seatCounts.US || 0,
    JP: seatCounts.JP || 0,
    LSP: seatCounts.LSP || 0,
    NUP: seatCounts.NUP || 0,
    Others: seatCounts.Others || 0,
  };

  // National FPTP vote shares (percent)
  let nationalTotal = 0;
  const nationalVotes = {};
  aggregates.forEach((agg) => {
    const sumVotes = Object.values(agg.nationalVotes).reduce((s, v) => s + v, 0);
    nationalTotal += sumVotes;
    Object.entries(agg.nationalVotes).forEach(([p, v]) => {
      nationalVotes[p] = (nationalVotes[p] || 0) + v;
    });
  });
  const officialFptpVote = {};
  PARTIES.forEach((p) => {
    officialFptpVote[p] = Number(((nationalVotes[p] || 0) / nationalTotal * 100).toFixed(2));
  });

  // Update ACTUAL_2022_SEATS using refreshed FPTP and existing PR totals (corrected)
  const PR_SEATS = {
    NC: 32,
    UML: 34,
    Maoist: 14,
    RSP: 13,
    RPP: 7,
    JSPN: 5, // corrected to keep PR total at 110
    US: 0,
    JP: 5,
    LSP: 0,
    NUP: 0,
    Others: 0,
  };
  const TOTAL_SEATS = {};
  PARTIES.forEach((p) => {
    TOTAL_SEATS[p] = (officialFptp[p] || 0) + (PR_SEATS[p] || 0);
  });

  const sections = [
    `// Auto-generated from ECN CSV (2022_HOR.csv) on ${new Date().toISOString().slice(0, 10)}`,
    `export const PARTIES = ${JSON.stringify(existing.PARTIES, null, 2)};`,
    `export const PROVINCES = ${JSON.stringify(existing.PROVINCES, null, 2)};`,
    `export const INITIAL_NATIONAL = ${JSON.stringify(existing.INITIAL_NATIONAL, null, 2)};`,
    `export const OFFICIAL_FPTP_VOTE = ${JSON.stringify(officialFptpVote, null, 2)};`,
    `export const ACTUAL_2022_SEATS = ${JSON.stringify(
      { FPTP: officialFptp, PR: PR_SEATS, Total: TOTAL_SEATS },
      null,
      2
    )};`,
    `export const constituencies = ${JSON.stringify(newConstituencies, null, 2)};`,
    '',
  ];

  const output = sections.join('\n');

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'constituencies.js'), output, 'utf8');
  console.log('data/constituencies.js regenerated with corrected vote counts.');
}

main();
