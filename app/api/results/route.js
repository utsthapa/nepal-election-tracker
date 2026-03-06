// app/api/results/route.js
// Live election results API - scrapes ekantipur election tracker

const EKANTIPUR_URL = 'https://election.ekantipur.com/?lng=eng';
const KNOWN_AD_NAMES = ['xtreme energy drink', 'byд partner', 'byд', 'byd partner', 'byd'];

// Province sections appear in order: National, then Province 1-7
const PROVINCE_NAMES = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpaschim',
];

function isAdEntry(name) {
  return KNOWN_AD_NAMES.some(
    ad => name.toLowerCase().includes(ad) || ad.includes(name.toLowerCase())
  );
}

function parsePartyResults(html) {
  // Match pattern: alt="PartyName" ... win-count">N ... lead-count">N
  const partyPattern = /alt="([^"]+)"[\s\S]*?win-count">(\d+)[\s\S]*?lead-count">(\d+)/g;
  const allMatches = [];
  let match;
  while ((match = partyPattern.exec(html)) !== null) {
    const name = match[1].trim();
    if (!isAdEntry(name)) {
      allMatches.push({
        name,
        won: parseInt(match[2]),
        leading: parseInt(match[3]),
      });
    }
  }

  // First batch is national, then per-province
  // National section has ~13 parties (including Others), then 7 provinces × ~13 parties each
  const PARTIES_PER_SECTION = 13;
  const national = allMatches.slice(0, PARTIES_PER_SECTION);

  const provinces = {};
  for (let i = 0; i < 7; i++) {
    const start = PARTIES_PER_SECTION + i * PARTIES_PER_SECTION;
    const end = start + PARTIES_PER_SECTION;
    const provinceParties = allMatches.slice(start, end);
    if (provinceParties.length > 0) {
      provinces[PROVINCE_NAMES[i]] = provinceParties.filter(p => p.won > 0 || p.leading > 0);
    }
  }

  return {
    national: national.filter(p => p.won > 0 || p.leading > 0),
    national_all: national,
    provinces,
  };
}

function parseConstituencyResults(html) {
  // Extract competitive constituency results from the page
  // Look for constituency blocks with candidate vote data
  const constituencies = [];

  // Pattern for constituency results in the "key contests" section
  const constituencyPattern = /constituency\/([^?"]+)\?lng=eng[\s\S]*?<h4[^>]*>([^<]+)<\/h4>/g;
  let match;
  while ((match = constituencyPattern.exec(html)) !== null) {
    constituencies.push({
      slug: match[1],
      name: match[2].trim(),
    });
  }

  return constituencies;
}

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(EKANTIPUR_URL, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Nepal-Election-Tracker/1.0',
      },
      signal: controller.signal,
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch election data' }, { status: 502 });
    }

    const html = await response.text();
    const partyResults = parsePartyResults(html);
    const constituencies = parseConstituencyResults(html);

    const totalWon = partyResults.national.reduce((s, p) => s + p.won, 0);
    const totalLeading = partyResults.national.reduce((s, p) => s + p.leading, 0);

    const result = {
      source: 'ekantipur',
      fetched_at: new Date().toISOString(),
      counting_status: totalWon >= 165 ? 'complete' : totalWon > 0 ? 'declaring' : 'counting',
      total_seats: 165,
      seats_declared: totalWon,
      seats_with_leads: totalLeading,
      party_results: partyResults.national,
      party_results_all: partyResults.national_all,
      provincial_results: partyResults.provinces,
      key_constituencies: constituencies.slice(0, 20),
    };

    return Response.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return Response.json(
      { error: 'Election results request failed', details: err.message },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
