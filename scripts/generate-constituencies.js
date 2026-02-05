const fs = require('fs');
const path = require('path');

// Official 165 FPTP constituencies of Nepal (2022 election)
// Data source: Nepal Election Commission (https://result.election.gov.np/)
// Wikipedia: https://en.wikipedia.org/wiki/2022_Nepalese_general_election

// District name mappings (Nepali to English)
const DISTRICT_NAMES = {
  'ताप्लेजुंग': 'Taplejung',
  'पाँचथर': 'Panchthar',
  'इलाम': 'Ilam',
  'झापा': 'Jhapa',
  'मोरङ्ग': 'Morang',
  'सुनसरी': 'Sunsari',
  'धनकुटा': 'Dhankuta',
  'तेह्रथुम': 'Terhathum',
  'तेर्हथुम': 'Terhathum',
  'सोलुखुम्बु': 'Solukhumbu',
  'संखुवासभा': 'Sankhuwasabha',
  'भोजपुर': 'Bhojpur',
  'खोटाङ': 'Khotang',
  'खोटाङ्ग': 'Khotang',
  'ओखलढुंगा': 'Okhaldhunga',
  'उदयपुर': 'Udayapur',
  'सप्तरी': 'Saptari',
  'सिराहा': 'Siraha',
  'धनुषा': 'Dhanusha',
  'महोत्तरी': 'Mahottari',
  'सर्लाही': 'Sarlahi',
  'रौतहट': 'Rautahat',
  'बारा': 'Bara',
  'पर्सा': 'Parsa',
  'सिन्धुली': 'Sindhuli',
  'रामेछाप': 'Ramechhap',
  'दोलखा': 'Dolakha',
  'सिन्धुपाल्चोक': 'Sindhupalchok',
  'रसुवा': 'Rasuwa',
  'धादिङ्ग': 'Dhading',
  'नुवाकोट': 'Nuwakot',
  'काठमाडौं': 'Kathmandu',
  'भक्तपुर': 'Bhaktapur',
  'ललितपुर': 'Lalitpur',
  'काभ्रेपलाञ्चोक': 'Kavrepalanchok',
  'मकवानपुर': 'Makwanpur',
  'चितवन': 'Chitwan',
  'गोरखा': 'Gorkha',
  'मनाङ्ग': 'Manang',
  'लमजुङ': 'Lamjung',
  'लमजुंग': 'Lamjung',
  'कास्की': 'Kaski',
  'तनहुँ': 'Tanahun',
  'स्याङ्जा': 'Syangja',
  'गुल्मी': 'Gulmi',
  'पाल्पा': 'Palpa',
  'अर्घाखाँची': 'Arghakhanchi',
  'अर्घाखांची': 'Arghakhanchi',
  'रुपन्देही': 'Rupandehi',
  'कपिलवस्तु': 'Kapilvastu',
  'मुस्तांग': 'Mustang',
  'म्याग्दी': 'Myagdi',
  'बागलुङ': 'Baglung',
  'पर्वत': 'Parbat',
  'नवलपरासी (बर्दघाट सुस्ता पश्चिम)': 'Nawalparasi West',
  'नवलपरासी (बर्दघाट सुस्ता पूर्व)': 'Nawalpur',
  'नवलपुर': 'Nawalpur',
  'प्युठान': 'Pyuthan',
  'प्यूठान': 'Pyuthan',
  'रोल्पा': 'Rolpa',
  'रुकुम (पूर्वी भाग)': 'Rukum East',
  'रुकुम पूर्व': 'Rukum East',
  'दाङ': 'Dang',
  'बाँके': 'Banke',
  'बर्दिया': 'Bardiya',
  'डोल्पा': 'Dolpa',
  'मुगु': 'Mugu',
  'जुम्ला': 'Jumla',
  'हुम्ला': 'Humla',
  'कालीकोट': 'Kalikot',
  'कालिकोट': 'Kalikot',
  'दैलेख': 'Dailekh',
  'सुर्खेत': 'Surkhet',
  'सल्यान': 'Salyan',
  'जाजरकोट': 'Jajarkot',
  'रुकुम पश्चिम': 'Rukum West',
  'रुकुम (पश्चिमी भाग)': 'Rukum West',
  'अछाम': 'Achham',
  'बझाङ': 'Bajhang',
  'बझाङ्ग': 'Bajhang',
  'बाजुरा': 'Bajura',
  'कैलाली': 'Kailali',
  'दार्चुला': 'Darchula',
  'बैतडी': 'Baitadi',
  'डडेलधुरा': 'Dadeldhura',
  'कन्चनपुर': 'Kanchanpur',
  'डोटी': 'Doti'
};

// Party name mappings (Nepali to short code)
const PARTY_MAPPINGS = {
  'नेपाली काँग्रेस': 'NC',
  'नेपाल कम्युनिष्ट पार्टी (एमाले)': 'UML',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)(एकल चुनाव चिन्ह)': 'Maoist',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': 'Maoist',
  'राष्ट्रिय स्वतन्त्र पार्टी': 'RSP',
  'राष्ट्रिय प्रजातन्त्र पार्टी': 'RPP',
  'जनता समाजवादी पार्टी, नेपाल': 'JSPN',
  'जनता समाजवादी पार्टी, नेपाल ': 'JSPN',
  'नेपाल कम्युनिष्ट पार्टी (एकिकृत समाजबादी)': 'US',
  'नेपाल कम्युनिष्ट पार्टी (एकिकृत समाजबादी) ': 'US',
  'जनमत पार्टी': 'JP',
  'लोकतान्त्रिक समाजवादी पार्टी, नेपाल': 'LSP',
  'लोकतान्त्रिक समाजवादी पार्टी, नेपाल  ': 'LSP',
  'नागरिक उन्मुक्ति पार्टी': 'NUP',
  'स्वतन्त्र': 'Independent',
  'नेपाल मजदुर किसान पार्टी': 'NMKP',
  'राष्ट्रिय जनमोर्चा': 'Janamorcha'
};

// Province names
const PROVINCE_NAMES = {
  1: 'Koshi',
  2: 'Madhesh',
  3: 'Bagmati',
  4: 'Gandaki',
  5: 'Lumbini',
  6: 'Karnali',
  7: 'Sudurpashchim'
};

// Wikipedia URL template
const WIKI_URL_TEMPLATE = 'https://en.wikipedia.org/wiki/{district}_({constituency})_constituency';

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV with quoted fields containing commas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = values[idx] || '';
    });
    data.push(row);
  }

  return data;
}

function getPartyCode(nepaliPartyName) {
  const cleaned = nepaliPartyName.replace(/"/g, '').trim();
  return PARTY_MAPPINGS[cleaned] || 'Others';
}

function getEnglishDistrictName(nepaliName) {
  return DISTRICT_NAMES[nepaliName] || nepaliName;
}

function generateWikipediaUrl(district, constituencyNum) {
  const slug = district.toLowerCase().replace(/\s+/g, '_');
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(district)}_${constituencyNum}`;
}

function main() {
  const csvPath = path.join(__dirname, '..', 'data', '2022_HOR.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const data = parseCSV(content);

  // Group by constituency
  const constituencies = {};

  data.forEach(row => {
    const districtNp = row.DistrictName;
    const province = parseInt(row.State);
    const constNum = parseInt(row.SCConstID);
    const district = getEnglishDistrictName(districtNp);

    if (!district || !province || !constNum) return;

    const key = `P${province}-${district}-${constNum}`;
    const name = `${district} ${constNum}`;

    if (!constituencies[key]) {
      constituencies[key] = {
        id: key,
        name: name,
        province: province,
        district: district,
        districtNp: districtNp,
        totalVotes: 0,
        candidates: [],
        wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(' ', '_'))}_constituency`
      };
    }

    const votes = parseInt(row.TotalVoteReceived) || 0;
    constituencies[key].totalVotes += votes;
    constituencies[key].candidates.push({
      name: row.CandidateName,
      party: getPartyCode(row.PoliticalPartyName),
      partyNp: row.PoliticalPartyName,
      votes: votes,
      elected: row.Remarks === 'Elected'
    });
  });

  // Process constituencies to calculate results
  const result = Object.values(constituencies).map(c => {
    // Sort candidates by votes
    c.candidates.sort((a, b) => b.votes - a.votes);

    const winner = c.candidates.find(cand => cand.elected) || c.candidates[0];
    const runnerUp = c.candidates[1];

    // Calculate vote shares
    const results2022 = {
      NC: 0, UML: 0, Maoist: 0, RSP: 0, RPP: 0,
      JSPN: 0, US: 0, JP: 0, LSP: 0, NUP: 0, Others: 0
    };

    c.candidates.forEach(cand => {
      const share = c.totalVotes > 0 ? cand.votes / c.totalVotes : 0;
      const party = cand.party;
      if (results2022.hasOwnProperty(party)) {
        results2022[party] += share;
      } else {
        results2022.Others += share;
      }
    });

    // Calculate margin
    const margin = (winner && runnerUp && c.totalVotes > 0)
      ? (winner.votes - runnerUp.votes) / c.totalVotes
      : 0;

    return {
      id: c.id,
      name: c.name,
      province: c.province,
      district: c.district,
      districtNp: c.districtNp,
      totalVotes: c.totalVotes,
      hexPosition: null,
      winner2022: winner ? winner.party : 'Others',
      candidate2022: winner ? winner.name : '',
      candidate2022En: '', // Would need translation
      margin: Math.round(margin * 1000000) / 1000000,
      wikipediaUrl: c.wikipediaUrl,
      results2022: results2022
    };
  });

  // Sort by province, then by district, then by constituency number
  result.sort((a, b) => {
    if (a.province !== b.province) return a.province - b.province;
    if (a.district !== b.district) return a.district.localeCompare(b.district);
    const numA = parseInt(a.name.match(/\d+$/)?.[0] || '0');
    const numB = parseInt(b.name.match(/\d+$/)?.[0] || '0');
    return numA - numB;
  });

  console.log(`Generated ${result.length} constituencies`);

  // Output as JS module
  const outputPath = path.join(__dirname, '..', 'data', 'constituencies_new.js');

  const parties = {
    NC: { name: "Nepali Congress", short: "NC", color: "#22c55e" },
    UML: { name: "CPN-UML", short: "UML", color: "#ef4444" },
    Maoist: { name: "CPN-Maoist Centre", short: "Maoist", color: "#991b1b" },
    RSP: { name: "Rastriya Swatantra Party", short: "RSP", color: "#3b82f6" },
    RPP: { name: "Rastriya Prajatantra Party", short: "RPP", color: "#8b5cf6" },
    JSPN: { name: "Janata Samajbadi Party", short: "JSPN", color: "#ec4899" },
    US: { name: "CPN (Unified Socialist)", short: "US", color: "#f97316" },
    JP: { name: "Janamat Party", short: "JP", color: "#14b8a6" },
    LSP: { name: "Loktantrik Samajbadi Party", short: "LSP", color: "#a855f7" },
    NUP: { name: "Nagarik Unmukti Party", short: "NUP", color: "#06b6d4" },
    Independent: { name: "Independent", short: "Ind", color: "#6b7280" },
    NMKP: { name: "Nepal Majdoor Kisan Party", short: "NMKP", color: "#84cc16" },
    Janamorcha: { name: "Rastriya Janamorcha", short: "JM", color: "#f43f5e" },
    Others: { name: "Others", short: "Others", color: "#f59e0b" }
  };

  const provinces = {
    1: { name: "Koshi", seats: 0 },
    2: { name: "Madhesh", seats: 0 },
    3: { name: "Bagmati", seats: 0 },
    4: { name: "Gandaki", seats: 0 },
    5: { name: "Lumbini", seats: 0 },
    6: { name: "Karnali", seats: 0 },
    7: { name: "Sudurpashchim", seats: 0 }
  };

  // Count seats per province
  result.forEach(c => {
    provinces[c.province].seats++;
  });

  // Calculate national vote shares
  const totalNationalVotes = result.reduce((sum, c) => sum + c.totalVotes, 0);
  const nationalVotes = { NC: 0, UML: 0, Maoist: 0, RSP: 0, RPP: 0, JSPN: 0, US: 0, JP: 0, LSP: 0, NUP: 0, Others: 0 };

  result.forEach(c => {
    Object.keys(nationalVotes).forEach(party => {
      nationalVotes[party] += (c.results2022[party] || 0) * c.totalVotes;
    });
  });

  const initialNational = {};
  Object.keys(nationalVotes).forEach(party => {
    initialNational[party] = Math.round((nationalVotes[party] / totalNationalVotes) * 10000) / 100;
  });

  // Calculate actual 2022 seat counts
  const actualSeats = { FPTP: {}, PR: {}, Total: {} };
  Object.keys(parties).forEach(party => {
    actualSeats.FPTP[party] = 0;
    actualSeats.PR[party] = 0;
    actualSeats.Total[party] = 0;
  });

  result.forEach(c => {
    const winner = c.winner2022;
    if (actualSeats.FPTP.hasOwnProperty(winner)) {
      actualSeats.FPTP[winner]++;
    } else {
      actualSeats.FPTP.Others = (actualSeats.FPTP.Others || 0) + 1;
    }
  });

  // PR seats from 2022 election (fixed data from ECN)
  actualSeats.PR = {
    NC: 32, UML: 34, Maoist: 14, RSP: 13, RPP: 7, JSPN: 5,
    US: 0, JP: 5, LSP: 0, NUP: 0, Independent: 0, NMKP: 0, Janamorcha: 0, Others: 0
  };

  Object.keys(actualSeats.FPTP).forEach(party => {
    actualSeats.Total[party] = (actualSeats.FPTP[party] || 0) + (actualSeats.PR[party] || 0);
  });

  const output = `// Auto-generated from ECN CSV (2022_HOR.csv) on ${new Date().toISOString().split('T')[0]}
// Source: Nepal Election Commission - https://result.election.gov.np/
// Wikipedia: https://en.wikipedia.org/wiki/2022_Nepalese_general_election
export const PARTIES = ${JSON.stringify(parties, null, 2)};

export const PROVINCES = ${JSON.stringify(provinces, null, 2)};

export const INITIAL_NATIONAL = ${JSON.stringify(initialNational, null, 2)};

export const OFFICIAL_FPTP_VOTE = ${JSON.stringify(initialNational, null, 2)};

export const ACTUAL_2022_SEATS = ${JSON.stringify(actualSeats, null, 2)};

export const constituencies = ${JSON.stringify(result, null, 2)};
`;

  fs.writeFileSync(outputPath, output);
  console.log(`Written to ${outputPath}`);

  // Generate demographics mapping
  const demographicsMapping = {};
  const districtSeats = {};

  // First pass: count seats per district
  result.forEach(c => {
    if (!districtSeats[c.district]) districtSeats[c.district] = 0;
    districtSeats[c.district]++;
  });

  // Second pass: generate mapping with proportions
  result.forEach(c => {
    const seats = districtSeats[c.district];
    demographicsMapping[c.id] = {
      district: c.district,
      proportion: Math.round((1 / seats) * 1000) / 1000
    };
  });

  const demographicsOutput = `// Auto-generated constituency to demographics mapping
// Maps constituency IDs to their districts for demographic data lookup
export const CONSTITUENCY_PROPORTIONS = ${JSON.stringify(demographicsMapping, null, 2)};
`;

  const demoPath = path.join(__dirname, '..', 'data', 'constituency_demographics_mapping.js');
  fs.writeFileSync(demoPath, demographicsOutput);
  console.log(`Demographics mapping written to ${demoPath}`);

  // Also output a CSV for verification
  const csvOutput = 'Province,District,Constituency,Winner,Candidate,Votes,Margin,Wikipedia\n' +
    result.map(c =>
      `${c.province},${c.district},${c.name},${c.winner2022},"${c.candidate2022}",${c.totalVotes},${c.margin},"${c.wikipediaUrl}"`
    ).join('\n');

  const csvOutputPath = path.join(__dirname, '..', 'data', 'constituencies_generated.csv');
  fs.writeFileSync(csvOutputPath, csvOutput);
  console.log(`CSV written to ${csvOutputPath}`);
}

main();
