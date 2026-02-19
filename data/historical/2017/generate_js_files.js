// Generate JavaScript Data Files from Parsed Wikipedia Data
// Creates province-wise files matching 2022 format

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Province mapping
const PROVINCES = {
  1: { name: 'Koshi', file: 'province1_koshi.js' },
  2: { name: 'Madhesh', file: 'province2_madhesh.js' },
  3: { name: 'Bagmati', file: 'province3_bagmati.js' },
  4: { name: 'Gandaki', file: 'province4_gandaki.js' },
  5: { name: 'Lumbini', file: 'province5_lumbini.js' },
  6: { name: 'Karnali', file: 'province6_karnali.js' },
  7: { name: 'Sudurpashchim', file: 'province7_sudurpashchim.js' },
};

// Load parsed data
function loadParsedData() {
  const parsedFile = path.join(__dirname, 'parsed_data', 'all_constituencies.json');
  if (!fs.existsSync(parsedFile)) {
    console.error('Error: Parsed data not found. Run parse_html.js first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(parsedFile, 'utf-8'));
}

// Get province from constituency name
function getProvince(constituency) {
  const district = constituency.split('-')[0];

  // Province 1: Koshi
  if (
    [
      'Taplejung',
      'Panchthar',
      'Ilam',
      'Jhapa',
      'Morang',
      'Sunsari',
      'Dhankuta',
      'Terhathum',
      'Sankhuwasabha',
      'Bhojpur',
      'Solukhumbu',
      'Khotang',
      'Okhaldhunga',
      'Udayapur',
    ].includes(district)
  )
    return 1;

  // Province 2: Madhesh
  if (
    ['Saptari', 'Siraha', 'Dhanusa', 'Mahottari', 'Sarlahi', 'Rautahat', 'Bara', 'Parsa'].includes(
      district
    )
  )
    return 2;

  // Province 3: Bagmati
  if (
    [
      'Dolakha',
      'Ramechhap',
      'Sindhuli',
      'Kathmandu',
      'Lalitpur',
      'Bhaktapur',
      'Kavrepalanchok',
      'Nuwakot',
      'Dhading',
      'Makwanpur',
      'Chitwan',
      'Sindhupalchok',
      'Rasuwa',
    ].includes(district)
  )
    return 3;

  // Province 4: Gandaki
  if (
    [
      'Manang',
      'Mustang',
      'Gorkha',
      'Lamjung',
      'Kaski',
      'Tanahu',
      'Syangja',
      'Gulmi',
      'Palpa',
      'Parbat',
      'Baglung',
      'Nawalparasi_East',
      'Myagdi',
    ].includes(district)
  )
    return 4;

  // Province 5: Lumbini
  if (
    [
      'Nawalparasi_West',
      'Rupandehi',
      'Kapilvastu',
      'Arghakhanchi',
      'Pyuthan',
      'Rolpa',
      'Rukum_East',
      'Banke',
      'Bardiya',
      'Dang',
      'Salyan',
      'Rukum_West',
    ].includes(district)
  )
    return 5;

  // Province 6: Karnali
  if (
    ['Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Surkhet', 'Dailekh', 'Jajarkot'].includes(
      district
    )
  )
    return 6;

  // Province 7: Sudurpashchim
  if (
    [
      'Kanchanpur',
      'Dadeldhura',
      'Baitadi',
      'Doti',
      'Achham',
      'Bajhang',
      'Bajura',
      'Kailali',
    ].includes(district)
  )
    return 7;

  return 0;
}

// Format constituency data for output
function formatConstituency(data) {
  const c = data;

  return {
    district: c.district,
    districtNp: null, // Will be filled if available
    constituencyNumber: c.constituencyNumber,
    province: null, // Will be set
    provinceId: null, // Will be set
    totalVoters: c.totalVotes,
    votesCast: c.totalVotes,
    validVotes: c.validVotes,
    turnoutPercent: c.turnout || 0,
    winner: c.winner
      ? {
          name: c.winner.name,
          party: c.winner.party || 'Others',
          partyFull: c.winner.partyFull,
          votes: c.winner.votes,
          percent: c.winner.percent,
          gender: null,
          age: null,
          education: null,
          experience: null,
          address: null,
        }
      : null,
    runnerUp: c.runnerUp
      ? {
          name: c.runnerUp.name,
          party: c.runnerUp.party || 'Others',
          partyFull: c.runnerUp.partyFull,
          votes: c.runnerUp.votes,
          percent: c.runnerUp.percent,
          gender: null,
          age: null,
          education: null,
          experience: null,
          address: null,
        }
      : null,
    margin: c.margin,
    marginPercent: c.marginPercent,
    candidates: c.candidates.map(cand => ({
      name: cand.name,
      gender: null,
      age: null,
      party: cand.party || 'Others',
      partyFull: cand.partyFull,
      partySymbol: null,
      votes: cand.votes,
      rank: cand.rank,
      elected: cand.elected,
      education: null,
      experience: null,
      otherDetails: null,
      institution: null,
      address: null,
      fatherName: null,
      spouseName: null,
      percent: cand.percent,
    })),
    resultsByParty: c.candidates.reduce((acc, cand) => {
      const party = cand.party || 'Others';
      if (!acc[party]) {
        acc[party] = { votes: 0, percent: 0, candidates: 0 };
      }
      acc[party].votes += cand.votes;
      acc[party].candidates += 1;
      return acc;
    }, {}),
  };
}

// Generate JavaScript files
function generateJSFiles() {
  const data = loadParsedData();
  const constituencies = Object.keys(data);

  console.log(`Generating JS files for ${constituencies.length} constituencies...`);
  console.log('');

  // Group by province
  const byProvince = {};
  for (let i = 1; i <= 7; i++) {
    byProvince[i] = {};
  }

  for (const [key, value] of Object.entries(data)) {
    const province = getProvince(key);
    if (province > 0) {
      const formatted = formatConstituency(value);
      formatted.province = PROVINCES[province].name;
      formatted.provinceId = province;
      byProvince[province][key] = formatted;
    }
  }

  // Write province files
  for (let i = 1; i <= 7; i++) {
    const province = PROVINCES[i];
    const filePath = path.join(__dirname, province.file);
    const count = Object.keys(byProvince[i]).length;

    const content = `// ${province.name} Province - 2017 Election Results
// Source: Wikipedia
// Total Constituencies: ${count}

export const ${province.name.toUpperCase()}_2017 = ${JSON.stringify(byProvince[i], null, 2)};

export default ${province.name.toUpperCase()}_2017;
`;

    fs.writeFileSync(filePath, content);
    console.log(`✓ ${province.file} (${count} constituencies)`);
  }

  // Write index file
  const indexContent = `// 2017 Constituency Election Results - Index
// Source: Wikipedia

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
  console.log('JavaScript files generated successfully!');
}

// Run
generateJSFiles();
