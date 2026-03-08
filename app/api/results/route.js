// app/api/results/route.js
// Live election results API using official ECN (Election Commission Nepal) data.

const ECN_BASE_URL = 'https://result.election.gov.np';
const ECN_HOME_URL = `${ECN_BASE_URL}/`;
const ECN_CENTRAL_FILE = 'JSONFiles/ElectionResultCentral2082.txt';

const PROVINCE_NAMES = {
  1: 'Koshi',
  2: 'Madhesh',
  3: 'Bagmati',
  4: 'Gandaki',
  5: 'Lumbini',
  6: 'Karnali',
  7: 'Sudurpaschim',
};

function normalizePartyName(name) {
  if (!name) {
    return 'Others';
  }

  const map = {
    'नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)': 'CPN-UML',
    'नेपाली कांग्रेस': 'Nepali Congress',
    'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': 'Nepal Communist Party (Maoist)',
    'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र) ': 'Nepal Communist Party (Maoist)',
    'नेपाल कम्युनिष्ट पार्टी (एकीकृत समाजवादी)': 'Nepali Communist Party',
    'राष्ट्रिय स्वतन्त्र पार्टी': 'Rastriya Swatantra Party',
    'राष्ट्रिय प्रजातन्त्र पार्टी': 'Rastriya Prajatantra Party',
    'जनता समाजवादी पार्टी, नेपाल': 'Janata Samjbadi Party-Nepal',
    'जनमत पार्टी': 'Janamat Party',
    'नागरिक उन्मुक्ति पार्टी': 'Nagarik Unmukti Party',
    'उज्यालो नेपाल पार्टी': 'Ujaylo Nepal Party',
    'श्रम संस्कृती पार्टी': 'Shram Sanskriti Party',
  };

  return map[name.trim()] || name.trim();
}

function getStateId(row) {
  const state = Number(row?.State);
  return Number.isFinite(state) ? state : null;
}

function getDistrictCode(row) {
  const code = row?.DistrictCd;
  return code === null || code === undefined ? '' : String(code);
}

function getConstituencyCode(row) {
  const code = row?.SCConstID;
  return code === null || code === undefined ? '' : String(code);
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function createEcnSession() {
  const homeRes = await fetch(ECN_HOME_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 Nepal-Election-Tracker/1.0',
    },
    cache: 'no-store',
  });

  if (!homeRes.ok) {
    throw new Error(`ECN home request failed: HTTP ${homeRes.status}`);
  }

  const setCookie = homeRes.headers.getSetCookie?.() || [];
  const sessionMatch = setCookie.find(c => c.startsWith('ASP.NET_SessionId='));
  const csrfMatch = setCookie.find(c => c.startsWith('CsrfToken='));

  const sessionId = sessionMatch?.split(';')[0]?.split('=')[1];
  const csrfToken = csrfMatch?.split(';')[0]?.split('=')[1];

  if (!sessionId || !csrfToken) {
    throw new Error('ECN session cookies missing');
  }

  return { sessionId, csrfToken };
}

async function fetchEcnJson(filePath) {
  const { sessionId, csrfToken } = await createEcnSession();
  const url = `${ECN_BASE_URL}/Handlers/SecureJson.ashx?file=${encodeURIComponent(filePath)}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'X-CSRF-Token': csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: `${ECN_BASE_URL}/ElectionResultCentral2082.aspx`,
      Origin: ECN_BASE_URL,
      Cookie: `ASP.NET_SessionId=${sessionId}; CsrfToken=${csrfToken}`,
      'User-Agent': 'Mozilla/5.0 Nepal-Election-Tracker/1.0',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`ECN data request failed: HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('ECN returned non-JSON response');
  }

  return res.json();
}

function buildConstituencyMap(rows) {
  const byConstituency = new Map();

  for (const row of rows) {
    const stateId = getStateId(row);
    const districtCode = getDistrictCode(row);
    const constituencyCode = getConstituencyCode(row);

    if (!stateId || !districtCode || !constituencyCode) {
      continue;
    }

    const key = `${stateId}|${districtCode}|${constituencyCode}`;
    if (!byConstituency.has(key)) {
      byConstituency.set(key, {
        key,
        stateId,
        districtCode,
        districtName: row.DistrictName || districtCode,
        constituencyCode,
        candidates: [],
      });
    }

    byConstituency.get(key).candidates.push({
      party: normalizePartyName(row.PoliticalPartyName),
      candidate: row.CandidateName || '',
      votes: toNumber(row.TotalVoteReceived),
      elected: String(row.Remarks || '')
        .toLowerCase()
        .includes('elected'),
    });
  }

  for (const c of byConstituency.values()) {
    c.candidates.sort((a, b) => b.votes - a.votes);
  }

  return byConstituency;
}

function summarizeResults(byConstituency) {
  const partyTotals = new Map();
  const provincialTotals = new Map();
  const keyContests = [];
  const constituencyLinks = [];

  let seatsDeclared = 0;

  for (const constituency of byConstituency.values()) {
    const elected = constituency.candidates.find(c => c.elected);
    const leader = elected || constituency.candidates[0];

    if (!leader) {
      continue;
    }

    const isDeclared = Boolean(elected);
    if (isDeclared) {
      seatsDeclared += 1;
    }

    if (!partyTotals.has(leader.party)) {
      partyTotals.set(leader.party, { name: leader.party, won: 0, leading: 0 });
    }

    const partyBucket = partyTotals.get(leader.party);
    if (isDeclared) {
      partyBucket.won += 1;
    } else {
      partyBucket.leading += 1;
    }

    const provinceName = PROVINCE_NAMES[constituency.stateId] || `Province ${constituency.stateId}`;
    if (!provincialTotals.has(provinceName)) {
      provincialTotals.set(provinceName, new Map());
    }

    const provinceParties = provincialTotals.get(provinceName);
    if (!provinceParties.has(leader.party)) {
      provinceParties.set(leader.party, { name: leader.party, won: 0, leading: 0 });
    }

    const provinceBucket = provinceParties.get(leader.party);
    if (isDeclared) {
      provinceBucket.won += 1;
    } else {
      provinceBucket.leading += 1;
    }

    const margin =
      constituency.candidates.length > 1
        ? leader.votes - constituency.candidates[1].votes
        : leader.votes;

    keyContests.push({
      province: constituency.stateId,
      district: constituency.districtCode,
      district_name: constituency.districtName,
      constituency: Number(constituency.constituencyCode),
      candidate: leader.candidate,
      party: leader.party,
      votes: leader.votes,
      margin,
      declared: isDeclared,
      label: `${constituency.districtName}-${constituency.constituencyCode}`,
    });

    constituencyLinks.push({
      province: constituency.stateId,
      district: constituency.districtCode,
      district_name: constituency.districtName,
      constituency: Number(constituency.constituencyCode),
      label: `${constituency.districtName}-${constituency.constituencyCode}`,
    });
  }

  const partyResults = [...partyTotals.values()].sort((a, b) => {
    const aTotal = a.won + a.leading;
    const bTotal = b.won + b.leading;
    return bTotal - aTotal || b.won - a.won;
  });

  const provincialResults = {};
  for (const [provinceName, parties] of provincialTotals.entries()) {
    provincialResults[provinceName] = [...parties.values()].sort(
      (a, b) => b.won + b.leading - (a.won + a.leading)
    );
  }

  keyContests.sort((a, b) => b.votes - a.votes);

  return {
    seatsDeclared,
    partyResults,
    provincialResults,
    keyContests: keyContests.slice(0, 12),
    constituencies: constituencyLinks.sort(
      (a, b) => a.province - b.province || a.constituency - b.constituency
    ),
  };
}

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const rows = await fetchEcnJson(ECN_CENTRAL_FILE);
    const byConstituency = buildConstituencyMap(rows);
    const summary = summarizeResults(byConstituency);

    const result = {
      source: 'ecn',
      source_label: 'Election Commission Nepal (Official)',
      election_cycle: '2082 House of Representatives',
      fetched_at: new Date().toISOString(),
      counting_status:
        summary.seatsDeclared >= 165
          ? 'complete'
          : summary.seatsDeclared > 0
            ? 'declaring'
            : 'counting',
      total_seats: 165,
      seats_declared: summary.seatsDeclared,
      seats_with_leads: 165 - summary.seatsDeclared,
      party_results: summary.partyResults,
      party_results_all: summary.partyResults,
      provincial_results: summary.provincialResults,
      key_contests: summary.keyContests,
      constituencies: summary.constituencies,
    };

    return Response.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return Response.json(
      { error: 'ECN results request failed', details: err.message },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
