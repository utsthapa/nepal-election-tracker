// app/api/results/route.js
// Live election results API - scrapes ekantipur election tracker (sourced from ECN)

const EKANTIPUR_URL = 'https://election.ekantipur.com/?lng=eng';
const KNOWN_AD_NAMES = ['xtreme energy drink', 'byд partner', 'byд', 'byd partner', 'byd'];

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

function parseKeyContests(html) {
  // Parse key contest cards with candidate name, party, vote count, constituency link
  const contests = [];
  const contestPattern =
    /href="(\/pradesh-(\d+)\/district-([^/]+)\/constituency-(\d+)\?lng=eng)"[\s\S]*?alt="([^"]+)"[\s\S]*?<h5>([^<]+)<\/h5>[\s\S]*?<p>([0-9,]+)<\/p>/g;
  let match;
  while ((match = contestPattern.exec(html)) !== null) {
    const candidateName = match[6].trim();
    const partyName = match[5].trim();
    if (isAdEntry(partyName) || isAdEntry(candidateName)) {
      continue;
    }
    contests.push({
      url: match[1],
      province: parseInt(match[2]),
      district: match[3],
      constituency: parseInt(match[4]),
      candidate: candidateName,
      party: partyName,
      votes: parseInt(match[7].replace(/,/g, '')),
      label: `${match[3].replace(/([a-z])([A-Z])/g, '$1 $2')}-${match[4]}`,
    });
  }
  return contests;
}

function parseConstituencyLinks(html) {
  // Get all constituency result links from the page
  const links = [];
  const linkPattern = /href="(\/pradesh-(\d+)\/district-([^/]+)\/constituency-(\d+)\?lng=eng)"/g;
  let match;
  const seen = new Set();
  while ((match = linkPattern.exec(html)) !== null) {
    const key = `${match[3]}-${match[4]}`;
    if (!seen.has(key)) {
      seen.add(key);
      links.push({
        url: match[1],
        province: parseInt(match[2]),
        district: match[3],
        constituency: parseInt(match[4]),
        label: `${match[3]}-${match[4]}`,
      });
    }
  }
  return links;
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
    const keyContests = parseKeyContests(html);
    const constituencyLinks = parseConstituencyLinks(html);

    const totalWon = partyResults.national.reduce((s, p) => s + p.won, 0);
    const totalLeading = partyResults.national.reduce((s, p) => s + p.leading, 0);

    const result = {
      source: 'ekantipur',
      source_label: 'Kantipur Election Tracker (ECN data)',
      fetched_at: new Date().toISOString(),
      counting_status: totalWon >= 165 ? 'complete' : totalWon > 0 ? 'declaring' : 'counting',
      total_seats: 165,
      seats_declared: totalWon,
      seats_with_leads: totalLeading,
      party_results: partyResults.national,
      party_results_all: partyResults.national_all,
      provincial_results: partyResults.provinces,
      key_contests: keyContests,
      constituencies: constituencyLinks,
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
