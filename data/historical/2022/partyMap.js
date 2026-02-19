// Party Name Mapping for 2022 Election
// Maps full party names to standardized codes

export const PARTY_MAP = {
  // Major Parties
  'नेपाली काँग्रेस': 'NC',
  'Nepali Congress': 'NC',
  'नेपाल कम्युनिष्ट पार्टी (एमाले)': 'UML',
  'CPN (UML)': 'UML',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': 'Maoist',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)(एकल चुनाव चिन्ह)': 'Maoist',
  'CPN (Maoist Centre)': 'Maoist',
  'राष्ट्रिय स्वतन्त्र पार्टी': 'RSP',
  'Rastriya Swatantra Party': 'RSP',
  'राष्ट्रिय प्रजातन्त्र पार्टी': 'RPP',
  'Rastriya Prajatantra Party': 'RPP',
  'जनता समाजवादी पार्टी, नेपाल': 'JSPN',
  'Janata Samajbadi Party, Nepal': 'JSPN',
  'नेपाल कम्युनिष्ट पार्टी (एकीकृत समाजवादी)': 'US',
  'CPN (Unified Socialist)': 'US',
  'जनमत पार्टी': 'JP',
  'Janamat Party': 'JP',
  'लोकतान्त्रिक समाजवादी पार्टी, नेपाल': 'LSP',
  'Loktantrik Samajwadi Party, Nepal': 'LSP',
  'राष्ट्रिय जनमुक्ति पार्टी': 'NUP',
  'Nagarik Unmukti Party': 'NUP',

  // Other Parties
  'संघीय लोकतान्त्रिक राष्ट्रिय मञ्च': 'SLRM',
  'Sanghiya Loktantrik Rastriya Manch': 'SLRM',
  'मंगोल नेशनल अर्गनाइजेसन': 'MNO',
  'Mongol National Organization': 'MNO',
  'राष्ट्रिय जनमोर्चा': 'RJM',
  'Rastriya Janamorcha': 'RJM',
  'नेपाल मजदुर किसान पार्टी': 'NMKP',
  'Nepal Majdoor Kisan Party': 'NMKP',
  'नेपाल कम्युनिष्ट पार्टी (मार्क्सवादी लेनिनवादी)': 'CPNML',
  'CPN (Marxist-Leninist)': 'CPNML',
  'नेपाल सद्भावना पार्टी': 'NSP',
  'Nepal Sadbhawana Party': 'NSP',
  'जनसमाजवादी पार्टी नेपाल': 'JSPN2',
  'Janasamajbadi Party Nepal': 'JSPN2',

  // Independent
  स्वतन्त्र: 'Independent',
  Independent: 'Independent',
};

export const mapPartyName = partyName => {
  if (!partyName) return 'Others';
  const cleanName = partyName.trim();
  return PARTY_MAP[cleanName] || 'Others';
};

export const mapPartyFullName = partyCode => {
  const reverseMap = {
    NC: 'Nepali Congress',
    UML: 'CPN-UML',
    Maoist: 'CPN-Maoist Centre',
    RSP: 'Rastriya Swatantra Party',
    RPP: 'Rastriya Prajatantra Party',
    JSPN: 'Janata Samajbadi Party',
    US: 'CPN (Unified Socialist)',
    JP: 'Janamat Party',
    LSP: 'Loktantrik Samajwadi Party',
    NUP: 'Nagarik Unmukti Party',
    Independent: 'Independent',
    Others: 'Others',
  };
  return reverseMap[partyCode] || partyCode;
};

export default { mapPartyName, mapPartyFullName };
