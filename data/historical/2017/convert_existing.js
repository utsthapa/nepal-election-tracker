// Convert existing 2017 data to new province-based format
// Matches the 2022 data structure

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing 2017 data
const existingDataPath = path.join(__dirname, '../election_2017.js');
const existingContent = fs.readFileSync(existingDataPath, 'utf-8');

// Province mapping
const PROVINCE_MAP = {
  Taplejung: 1,
  Panchthar: 1,
  Ilam: 1,
  Jhapa: 1,
  Morang: 1,
  Sunsari: 1,
  Dhankuta: 1,
  Terhathum: 1,
  Sankhuwasabha: 1,
  Bhojpur: 1,
  Solukhumbu: 1,
  Khotang: 1,
  Okhaldhunga: 1,
  Udayapur: 1,
  Saptari: 2,
  Siraha: 2,
  Dhanusa: 2,
  Mahottari: 2,
  Sarlahi: 2,
  Rautahat: 2,
  Bara: 2,
  Parsa: 2,
  Dolakha: 3,
  Ramechhap: 3,
  Sindhuli: 3,
  Kathmandu: 3,
  Lalitpur: 3,
  Bhaktapur: 3,
  Kavrepalanchok: 3,
  Nuwakot: 3,
  Dhading: 3,
  Makwanpur: 3,
  Chitwan: 3,
  Sindhupalchok: 3,
  Rasuwa: 3,
  Manang: 4,
  Mustang: 4,
  Gorkha: 4,
  Lamjung: 4,
  Kaski: 4,
  Tanahu: 4,
  Syangja: 4,
  Gulmi: 4,
  Palpa: 4,
  Parbat: 4,
  Baglung: 4,
  Myagdi: 4,
  Nawalparasi_East: 4,
  Nawalparasi_West: 5,
  Rupandehi: 5,
  Kapilvastu: 5,
  Arghakhanchi: 5,
  Pyuthan: 5,
  Rolpa: 5,
  Rukum_East: 5,
  Banke: 5,
  Bardiya: 5,
  Dang: 5,
  Salyan: 5,
  Rukum_West: 5,
  Dolpa: 6,
  Humla: 6,
  Jumla: 6,
  Kalikot: 6,
  Mugu: 6,
  Surkhet: 6,
  Dailekh: 6,
  Jajarkot: 6,
  Kanchanpur: 7,
  Dadeldhura: 7,
  Baitadi: 7,
  Doti: 7,
  Achham: 7,
  Bajhang: 7,
  Bajura: 7,
  Kailali: 7,
};

const PROVINCE_NAMES = {
  1: 'Koshi',
  2: 'Madhesh',
  3: 'Bagmati',
  4: 'Gandaki',
  5: 'Lumbini',
  6: 'Karnali',
  7: 'Sudurpashchim',
};

// Extract the CONSTITUENCIES_2017 object from the file
// The data ends at line 1122 with "};"
const lines = existingContent.split('\n');
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const CONSTITUENCIES_2017 = {')) {
    startLine = i;
  }
  if (startLine !== -1 && lines[i] === '};' && endLine === -1) {
    endLine = i;
    break;
  }
}

if (startLine === -1 || endLine === -1) {
  console.error('Could not find CONSTITUENCIES_2017 boundaries');
  process.exit(1);
}

// Extract the data
const dataLines = lines.slice(startLine, endLine + 1);
// Remove the export statement
const dataString = dataLines.join('\n').replace('export const CONSTITUENCIES_2017 = ', '');

// Parse the data (using eval for simplicity since it's trusted source)
let CONSTITUENCIES_2017;
try {
  eval(`CONSTITUENCIES_2017 = ${dataString}`);
} catch (e) {
  console.error('Error parsing data:', e.message);
  process.exit(1);
}

console.log(`Found ${Object.keys(CONSTITUENCIES_2017).length} constituencies in existing data`);

// Convert to new format
function convertConstituency(key, data) {
  const district = data.district;
  const provinceId = PROVINCE_MAP[district] || 0;

  return {
    district: data.district,
    districtNp: null,
    constituencyNumber: data.constituencyNumber,
    province: PROVINCE_NAMES[provinceId] || 'Unknown',
    provinceId: provinceId,
    totalVoters: data.totalVoters,
    votesCast: data.votesCast,
    validVotes: data.validVotes,
    turnoutPercent:
      data.totalVoters > 0 ? parseFloat(((data.votesCast / data.totalVoters) * 100).toFixed(2)) : 0,
    winner: data.winnerName
      ? {
          name: data.winnerName,
          party: data.winner,
          partyFull: data.candidates?.find(c => c.elected)?.partyDetail || data.winner,
          votes: data.winnerVotes,
          percent: data.winnerPercent,
          gender: null,
          age: null,
          education: null,
          experience: null,
          address: null,
        }
      : null,
    runnerUp: data.runnerUpName
      ? {
          name: data.runnerUpName,
          party: data.runnerUp,
          partyFull:
            data.candidates?.find(c => !c.elected && c.rank === 2)?.partyDetail || data.runnerUp,
          votes: data.runnerUpVotes,
          percent: data.runnerUpPercent,
          gender: null,
          age: null,
          education: null,
          experience: null,
          address: null,
        }
      : null,
    margin: data.margin,
    marginPercent: data.marginPercent,
    candidates:
      data.candidates?.map(c => ({
        name: c.name,
        gender: null,
        age: null,
        party: c.party,
        partyFull: c.partyDetail,
        partySymbol: null,
        votes: c.votes,
        rank: c.rank,
        elected: c.elected,
        education: null,
        experience: null,
        otherDetails: null,
        institution: null,
        address: null,
        fatherName: null,
        spouseName: null,
        percent: c.percent,
      })) || [],
    resultsByParty: data.resultsCount
      ? Object.entries(data.resultsCount).reduce((acc, [party, votes]) => {
          acc[party] = {
            votes,
            percent: data.results[party] || 0,
            candidates: data.candidates?.filter(c => c.party === party).length || 1,
          };
          return acc;
        }, {})
      : {},
  };
}

// Group by province
const byProvince = {
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
};

for (const [key, data] of Object.entries(CONSTITUENCIES_2017)) {
  const converted = convertConstituency(key, data);
  if (converted.provinceId > 0) {
    byProvince[converted.provinceId][key] = converted;
  }
}

// Write province files
for (let i = 1; i <= 7; i++) {
  const provinceName = PROVINCE_NAMES[i];
  const fileName = `province${i}_${provinceName.toLowerCase()}.js`;
  const filePath = path.join(__dirname, fileName);
  const count = Object.keys(byProvince[i]).length;

  const content = `// ${provinceName} Province - 2017 Election Results
// Source: Election Commission Nepal
// Total Constituencies: ${count}

export const ${provinceName.toUpperCase()}_2017 = ${JSON.stringify(byProvince[i], null, 2)};

export default ${provinceName.toUpperCase()}_2017;
`;

  fs.writeFileSync(filePath, content);
  console.log(`✓ ${fileName} (${count} constituencies)`);
}

// Create index file
const indexContent = `// 2017 Constituency Election Results - Index
// Source: Election Commission Nepal

import { KOSHI_2017 } from './province1_koshi.js';
import { MADHESH_2017 } from './province2_madhesh.js';
import { BAGMATI_2017 } from './province3_bagmati.js';
import { GANDAKI_2017 } from './province4_gandaki.js';
import { LUMBINI_2017 } from './province5_lumbini.js';
import { KARNALI_2017 } from './province6_karnali.js';
import { SUDURPASHCHIM_2017 } from './province7_sudurpashchim.js';

export const CONSTITUENCIES_2017 = {
  ...KOSHI_2017,
  ...MADHESH_2017,
  ...BAGMATI_2017,
  ...GANDAKI_2017,
  ...LUMBINI_2017,
  ...KARNALI_2017,
  ...SUDURPASHCHIM_2017,
};

export const PROVINCE_DATA_2017 = {
  1: { name: "Koshi", data: KOSHI_2017, seats: 28 },
  2: { name: "Madhesh", data: MADHESH_2017, seats: 32 },
  3: { name: "Bagmati", data: BAGMATI_2017, seats: 33 },
  4: { name: "Gandaki", data: GANDAKI_2017, seats: 18 },
  5: { name: "Lumbini", data: LUMBINI_2017, seats: 26 },
  6: { name: "Karnali", data: KARNALI_2017, seats: 12 },
  7: { name: "Sudurpashchim", data: SUDURPASHCHIM_2017, seats: 16 },
};

export const getConstituency2017 = (constituencyKey) => {
  return CONSTITUENCIES_2017[constituencyKey] || null;
};

export const getProvince2017 = (provinceId) => {
  return PROVINCE_DATA_2017[provinceId] || null;
};

export default {
  CONSTITUENCIES_2017,
  PROVINCE_DATA_2017,
  getConstituency2017,
  getProvince2017,
};
`;

fs.writeFileSync(path.join(__dirname, 'index.js'), indexContent);
console.log('✓ index.js');

console.log('');
console.log('================================');
console.log('2017 data conversion complete!');
console.log(`Total constituencies: ${Object.keys(CONSTITUENCIES_2017).length}`);
console.log('');
console.log('Note: This is partial data. Additional constituencies need to be added.');
