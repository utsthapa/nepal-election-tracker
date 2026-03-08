// app/api/results/constituency/route.js
// Fetches detailed constituency results from official ECN JSON.

const ECN_BASE_URL = 'https://result.election.gov.np';
const ECN_HOME_URL = `${ECN_BASE_URL}/`;
const ECN_CENTRAL_FILE = 'JSONFiles/ElectionResultCentral2082.txt';

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const province = Number(searchParams.get('province'));
  const district = String(searchParams.get('district') || '');
  const constituency = String(searchParams.get('constituency') || '');

  if (!province || !district || !constituency) {
    return Response.json(
      { error: 'Missing required params: province, district, constituency' },
      { status: 400 }
    );
  }

  try {
    const rows = await fetchEcnJson(ECN_CENTRAL_FILE);

    const matches = rows
      .filter(
        row =>
          Number(row.State) === province &&
          String(row.DistrictCd) === district &&
          String(row.SCConstID) === constituency
      )
      .map(row => ({
        name: row.CandidateName || '',
        party: normalizePartyName(row.PoliticalPartyName),
        status: String(row.Remarks || '')
          .toLowerCase()
          .includes('elected')
          ? 'won'
          : 'trailing',
        votes: toNumber(row.TotalVoteReceived),
      }))
      .sort((a, b) => b.votes - a.votes);

    const top = matches[0];
    const second = matches[1];
    const margin = top && second ? top.votes - second.votes : top ? top.votes : 0;

    const candidates = matches.map((c, idx) => ({
      ...c,
      margin: idx === 0 && c.status === 'won' ? margin : 0,
    }));

    const title =
      matches.length > 0
        ? `${rows.find(r => Number(r.State) === province && String(r.DistrictCd) === district)?.DistrictName || district}-${constituency}`
        : null;

    return Response.json(
      {
        source: 'ecn',
        source_label: 'Election Commission Nepal (Official)',
        fetched_at: new Date().toISOString(),
        province,
        district,
        constituency: Number(constituency),
        title,
        candidates,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    return Response.json(
      { error: 'Constituency results request failed', details: err.message },
      { status: 502 }
    );
  }
}
