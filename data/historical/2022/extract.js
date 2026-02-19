// Extract 2022 Constituency Data from CSV
// Processes 2022_HOR.csv and creates province-wise files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DISTRICT_MAP } from './districtMap.js';
import { mapPartyName, mapPartyFullName } from './partyMap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV file
const csvPath = path.join(__dirname, '../../2022_HOR.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (handling quoted fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Parse all lines
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = parseCSVLine(lines[0]);

console.log('CSV Headers:', headers);
console.log('Total rows:', lines.length - 1);

// Process data
const constituencies = {};

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length < 20) continue;

  const districtNp = row[11]; // DistrictName
  const districtInfo = DISTRICT_MAP[districtNp];

  if (!districtInfo) {
    console.warn(`Unknown district: ${districtNp}`);
    continue;
  }

  const districtEn = districtInfo.en;
  const constNum = row[13]; // SCConstID
  const key = `${districtEn}-${constNum}`;

  if (!constituencies[key]) {
    constituencies[key] = {
      district: districtEn,
      districtNp: districtNp,
      constituencyNumber: parseInt(constNum) || 0,
      province: districtInfo.provinceEn,
      provinceId: districtInfo.province,
      candidates: [],
    };
  }

  const candidate = {
    name: row[0] || null,
    gender: row[1] || null,
    age: row[2] ? parseInt(row[2]) : null,
    party: mapPartyName(row[8]),
    partyFull: row[8] || null,
    partySymbol: row[5] || null,
    votes: parseInt(row[16]) || 0,
    rank: row[19] ? parseInt(row[19]) : null,
    elected: row[20] === 'Elected',
    education: row[26] || null,
    experience: row[27] || null,
    otherDetails: row[28] || null,
    institution: row[29] || null,
    address: row[30] || null,
    fatherName: row[24] || null,
    spouseName: row[25] || null,
  };

  constituencies[key].candidates.push(candidate);
}

console.log(`\nProcessed ${Object.keys(constituencies).length} constituencies`);

// Sort candidates by votes and calculate derived fields
for (const [key, data] of Object.entries(constituencies)) {
  // Sort by votes descending
  data.candidates.sort((a, b) => b.votes - a.votes);

  // Calculate total votes
  const totalVotes = data.candidates.reduce((sum, c) => sum + c.votes, 0);
  data.totalVotes = totalVotes;
  data.votesCast = totalVotes; // Will be updated if we have better data
  data.validVotes = totalVotes;

  // Add percentages and ranks
  data.candidates.forEach((c, index) => {
    c.rank = index + 1;
    c.percent = totalVotes > 0 ? parseFloat(((c.votes / totalVotes) * 100).toFixed(2)) : 0;
  });

  // Identify winner and runner-up
  const winner = data.candidates.find(c => c.elected) || data.candidates[0];
  const runnerUp = data.candidates.filter(c => c.name !== winner.name)[0];

  if (winner) {
    data.winner = {
      name: winner.name,
      party: winner.party,
      partyFull: winner.partyFull,
      votes: winner.votes,
      percent: winner.percent,
      gender: winner.gender,
      age: winner.age,
      education: winner.education,
      experience: winner.experience,
      address: winner.address,
    };
  }

  if (runnerUp) {
    data.runnerUp = {
      name: runnerUp.name,
      party: runnerUp.party,
      partyFull: runnerUp.partyFull,
      votes: runnerUp.votes,
      percent: runnerUp.percent,
      gender: runnerUp.gender,
      age: runnerUp.age,
      education: runnerUp.education,
      experience: runnerUp.experience,
      address: runnerUp.address,
    };
    data.margin = winner.votes - runnerUp.votes;
    data.marginPercent = parseFloat(((data.margin / totalVotes) * 100).toFixed(2));
  }

  // Aggregate by party
  data.resultsByParty = {};
  data.candidates.forEach(c => {
    if (!data.resultsByParty[c.party]) {
      data.resultsByParty[c.party] = { votes: 0, percent: 0, candidates: 0 };
    }
    data.resultsByParty[c.party].votes += c.votes;
    data.resultsByParty[c.party].candidates += 1;
  });

  // Calculate party percentages
  for (const party of Object.keys(data.resultsByParty)) {
    const p = data.resultsByParty[party];
    p.percent = totalVotes > 0 ? parseFloat(((p.votes / totalVotes) * 100).toFixed(2)) : 0;
  }
}

// Group by province
const provinces = {
  1: { name: 'Koshi', data: {} },
  2: { name: 'Madhesh', data: {} },
  3: { name: 'Bagmati', data: {} },
  4: { name: 'Gandaki', data: {} },
  5: { name: 'Lumbini', data: {} },
  6: { name: 'Karnali', data: {} },
  7: { name: 'Sudurpashchim', data: {} },
};

for (const [key, data] of Object.entries(constituencies)) {
  provinces[data.provinceId].data[key] = data;
}

// Write province files
for (const [id, province] of Object.entries(provinces)) {
  const fileName = `province${id}_${province.name.toLowerCase()}.js`;
  const filePath = path.join(__dirname, fileName);

  const content = `// ${province.name} Province - 2022 Election Results
// Auto-generated from 2022_HOR.csv
// Total Constituencies: ${Object.keys(province.data).length}

export const ${province.name.toUpperCase()}_2022 = ${JSON.stringify(province.data, null, 2)};

export default ${province.name.toUpperCase()}_2022;
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created: ${fileName} (${Object.keys(province.data).length} constituencies)`);
}

// Create index file
const indexContent = `// 2022 Constituency Election Results - Index
// Aggregates all province data

import { KOSHI_2022 } from './province1_koshi.js';
import { MADHESH_2022 } from './province2_madhesh.js';
import { BAGMATI_2022 } from './province3_bagmati.js';
import { GANDAKI_2022 } from './province4_gandaki.js';
import { LUMBINI_2022 } from './province5_lumbini.js';
import { KARNALI_2022 } from './province6_karnali.js';
import { SUDURPASHCHIM_2022 } from './province7_sudurpashchim.js';

export const CONSTITUENCIES_2022 = {
  ...KOSHI_2022,
  ...MADHESH_2022,
  ...BAGMATI_2022,
  ...GANDAKI_2022,
  ...LUMBINI_2022,
  ...KARNALI_2022,
  ...SUDURPASHCHIM_2022,
};

export const PROVINCE_DATA_2022 = {
  1: { name: "Koshi", data: KOSHI_2022, seats: 28 },
  2: { name: "Madhesh", data: MADHESH_2022, seats: 32 },
  3: { name: "Bagmati", data: BAGMATI_2022, seats: 33 },
  4: { name: "Gandaki", data: GANDAKI_2022, seats: 18 },
  5: { name: "Lumbini", data: LUMBINI_2022, seats: 26 },
  6: { name: "Karnali", data: KARNALI_2022, seats: 12 },
  7: { name: "Sudurpashchim", data: SUDURPASHCHIM_2022, seats: 16 },
};

export const getConstituency2022 = (constituencyKey) => {
  return CONSTITUENCIES_2022[constituencyKey] || null;
};

export const getProvince2022 = (provinceId) => {
  return PROVINCE_DATA_2022[provinceId] || null;
};

export default {
  CONSTITUENCIES_2022,
  PROVINCE_DATA_2022,
  getConstituency2022,
  getProvince2022,
};
`;

fs.writeFileSync(path.join(__dirname, 'index.js'), indexContent);
console.log('Created: index.js');

console.log('\n✓ 2022 constituency data extraction complete!');
console.log(`Total constituencies: ${Object.keys(constituencies).length}`);
