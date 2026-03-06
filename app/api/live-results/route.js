// app/api/live-results/route.js
// Proxies live election result data from result.election.gov.np
// Nepal Election Commission publishes JSON files under:
// https://result.election.gov.np/JSONFiles/Election2082/Common/

const RESULT_BASE = 'https://result.election.gov.np/JSONFiles/Election2082/Common';

// Attempt to fetch a JSON file from the official results portal
async function tryFetch(url, timeout = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}

// Party display metadata (colors, full names)
const PARTY_META = {
  NC: { name: 'Nepali Congress', shortName: 'NC', color: '#22c55e', ideology: 'center-left' },
  UML: {
    name: 'CPN (UML)',
    shortName: 'UML',
    color: '#ef4444',
    ideology: 'left',
  },
  Maoist: {
    name: 'CPN (Maoist Centre)',
    shortName: 'Maoist',
    color: '#991b1b',
    ideology: 'far-left',
  },
  RSP: {
    name: 'Rastriya Swatantra Party',
    shortName: 'RSP',
    color: '#3b82f6',
    ideology: 'liberal',
  },
  RPP: {
    name: 'Rastriya Prajatantra Party',
    shortName: 'RPP',
    color: '#8b5cf6',
    ideology: 'right',
  },
  JSPN: {
    name: 'Janajati Samajwadi Party Nepal',
    shortName: 'JSPN',
    color: '#ec4899',
    ideology: 'center',
  },
  LSP: { name: 'Loktantrik Samajwadi Party', shortName: 'LSP', color: '#a855f7', ideology: 'center-left' },
  NUP: { name: 'Nepal Unified Party', shortName: 'NUP', color: '#06b6d4', ideology: 'center' },
  JP: { name: 'Janmat Party', shortName: 'JP', color: '#14b8a6', ideology: 'populist' },
  Others: { name: 'Others', shortName: 'Oth', color: '#f59e0b', ideology: 'various' },
};

// Known file paths on result.election.gov.np (try each until one works)
const CANDIDATE_FILES = [
  `${RESULT_BASE}/PartySeatSummary.json`,
  `${RESULT_BASE}/PartySeat.json`,
  `${RESULT_BASE}/partyseat.json`,
  `${RESULT_BASE}/PartyWiseSeat.json`,
  `${RESULT_BASE}/ResultSummary.json`,
];

const FPTP_FILES = [
  `${RESULT_BASE}/FPTPSeatSummary.json`,
  `${RESULT_BASE}/FPTPResult.json`,
  `${RESULT_BASE}/fptp.json`,
  `${RESULT_BASE}/FptpResult.json`,
];

const PROGRESS_FILES = [
  `${RESULT_BASE}/CountingProgress.json`,
  `${RESULT_BASE}/Progress.json`,
  `${RESULT_BASE}/progress.json`,
  `${RESULT_BASE}/ConstituencyProgress.json`,
];

// Normalise whatever structure the EC returns into our unified format
function normalisePartyData(raw) {
  if (!raw) return null;

  // Handle array of party objects
  if (Array.isArray(raw)) {
    return raw
      .filter(p => p && (p.PartyName || p.party_name || p.party || p.name))
      .map(p => {
        const name =
          p.PartyName || p.party_name || p.party || p.name || 'Unknown';
        const fptp =
          parseInt(p.FPTPSeats ?? p.fptp_seats ?? p.fptp ?? p.FPTP ?? p.won ?? 0, 10);
        const pr =
          parseInt(p.PRSeats ?? p.pr_seats ?? p.pr ?? p.PR ?? 0, 10);
        const leading =
          parseInt(p.Leading ?? p.leading ?? p.ahead ?? 0, 10);
        return { name, fptp, pr, leading, total: fptp + pr + leading };
      })
      .filter(p => p.total > 0 || p.fptp > 0 || p.pr > 0);
  }

  // Handle object keyed by party
  if (typeof raw === 'object' && raw !== null) {
    return Object.entries(raw)
      .map(([key, val]) => {
        if (typeof val === 'number') {
          return { name: key, fptp: val, pr: 0, leading: 0, total: val };
        }
        const fptp = parseInt(val?.fptp ?? val?.FPTP ?? 0, 10);
        const pr = parseInt(val?.pr ?? val?.PR ?? 0, 10);
        const leading = parseInt(val?.leading ?? 0, 10);
        return { name: key, fptp, pr, leading, total: fptp + pr + leading };
      })
      .filter(p => p.total > 0);
  }

  return null;
}

// Try all known file paths for a given list, return first successful parse
async function fetchFirstSuccess(urls) {
  for (const url of urls) {
    const data = await tryFetch(url);
    if (data) return data;
  }
  return null;
}

// Map raw party name from EC to our internal key
function matchPartyKey(rawName) {
  if (!rawName) return 'Others';
  const n = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (n.includes('congress') || n === 'nc') return 'NC';
  if ((n.includes('uml') || n.includes('unified marxist')) && !n.includes('maoist')) return 'UML';
  if (n.includes('maoist') || n.includes('maobadi')) return 'Maoist';
  if (n.includes('swatantra') || n === 'rsp') return 'RSP';
  if (n.includes('prajatantra') || n === 'rpp') return 'RPP';
  if (n.includes('janajati') || n.includes('jspn')) return 'JSPN';
  if (n.includes('loktantrik') || n === 'lsp') return 'LSP';
  if (n.includes('janmat') || n === 'jp') return 'JP';
  if (n.includes('nup') || n.includes('nepalunified')) return 'NUP';
  return 'Others';
}

export async function GET() {
  // --- Try official EC results portal ---
  const [partySeatRaw, fptpRaw, progressRaw] = await Promise.all([
    fetchFirstSuccess(CANDIDATE_FILES),
    fetchFirstSuccess(FPTP_FILES),
    fetchFirstSuccess(PROGRESS_FILES),
  ]);

  const officialData = normalisePartyData(partySeatRaw || fptpRaw);

  // Parse constituency counting progress
  let reportedCount = 0;
  let totalConstituencies = 165;
  if (progressRaw) {
    if (typeof progressRaw.reported === 'number') reportedCount = progressRaw.reported;
    else if (typeof progressRaw.counted === 'number') reportedCount = progressRaw.counted;
    else if (Array.isArray(progressRaw))
      reportedCount = progressRaw.filter(c => c.status === 'counted' || c.counted === true).length;
    if (progressRaw.total) totalConstituencies = progressRaw.total;
  }

  if (officialData && officialData.length > 0) {
    // Build unified party map using official data
    const partyMap = {};
    for (const p of officialData) {
      const key = matchPartyKey(p.name);
      if (!partyMap[key]) {
        partyMap[key] = {
          key,
          ...PARTY_META[key],
          fptp: 0,
          pr: 0,
          leading: 0,
          total: 0,
        };
      }
      partyMap[key].fptp += p.fptp;
      partyMap[key].pr += p.pr;
      partyMap[key].leading += p.leading;
      partyMap[key].total += p.total;
    }

    const parties = Object.values(partyMap)
      .sort((a, b) => b.total - a.total)
      .filter(p => p.total > 0);

    const totalSeatsDecided = parties.reduce((s, p) => s + p.total, 0);

    return Response.json(
      {
        status: 'live',
        source: 'result.election.gov.np',
        fetchedAt: new Date().toISOString(),
        election: {
          year: 2026,
          name: 'House of Representatives Election 2082 BS',
          totalSeats: 275,
          fptpSeats: 165,
          prSeats: 110,
          majorityThreshold: 138,
        },
        progress: {
          reportedConstituencies: reportedCount,
          totalConstituencies,
          percentReported: totalConstituencies
            ? Math.round((reportedCount / totalConstituencies) * 100)
            : 0,
          seatsDecided: totalSeatsDecided,
        },
        parties,
      },
      {
        headers: {
          // 20s cache — fresh enough for near-real-time, avoids hammering EC servers
          'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=10',
        },
      }
    );
  }

  // --- Election has not started yet or results not published ---
  // Return a "pre-election" placeholder with 2022 seat counts as baseline
  const baseline2022 = [
    { key: 'NC', fptp: 57, pr: 32, leading: 0, total: 89 },
    { key: 'UML', fptp: 79, pr: 6, leading: 0, total: 85 },
    { key: 'Maoist', fptp: 18, pr: 14, leading: 0, total: 32 },
    { key: 'RSP', fptp: 7, pr: 14, leading: 0, total: 21 },
    { key: 'RPP', fptp: 7, pr: 7, leading: 0, total: 14 },
    { key: 'JSPN', fptp: 6, pr: 6, leading: 0, total: 12 },
    { key: 'LSP', fptp: 4, pr: 0, leading: 0, total: 4 },
    { key: 'NUP', fptp: 0, pr: 4, leading: 0, total: 4 },
    { key: 'JP', fptp: 2, pr: 0, leading: 0, total: 2 },
    { key: 'Others', fptp: 7, pr: 5, leading: 0, total: 12 },
  ].map(p => ({ ...PARTY_META[p.key], ...p }));

  return Response.json(
    {
      status: 'pre-election',
      source: 'baseline-2022',
      fetchedAt: new Date().toISOString(),
      election: {
        year: 2026,
        name: 'House of Representatives Election 2082 BS',
        totalSeats: 275,
        fptpSeats: 165,
        prSeats: 110,
        majorityThreshold: 138,
      },
      progress: {
        reportedConstituencies: 0,
        totalConstituencies: 165,
        percentReported: 0,
        seatsDecided: 0,
      },
      parties: baseline2022,
    },
    {
      headers: {
        // During pre-election, revalidate every 2 minutes (no point hammering EC)
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
      },
    }
  );
}
