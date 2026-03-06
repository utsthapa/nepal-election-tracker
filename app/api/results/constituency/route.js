// app/api/results/constituency/route.js
// Fetches detailed constituency results from ekantipur

const BASE_URL = 'https://election.ekantipur.com';

function parseCandidateResults(html) {
  const candidates = [];
  // Match candidate rows: name, party, vote count, win/lost status
  const rowPattern =
    /<span>([^<]+)<\/span><\/a>\s*<\/td>\s*<td>.*?<span class="party-name">([^<]+)<\/span>.*?<div class="votecount\s+(win|lost)[^"]*"[^>]*>\s*<p>([0-9,]+)<\/p>(?:\s*<span>([0-9,]*)\s*<\/span>)?/g;
  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    candidates.push({
      name: match[1].trim(),
      party: match[2].trim(),
      status: match[3] === 'win' ? 'won' : 'trailing',
      votes: parseInt(match[4].replace(/,/g, '')),
      margin: match[5] ? parseInt(match[5].replace(/,/g, '')) : 0,
    });
  }
  return candidates;
}

function parseConstituencyTitle(html) {
  // Try to get the constituency name from the page
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/);
  if (h2Match) {
    return h2Match[1].trim();
  }
  return null;
}

function parseCountingProgress(html) {
  // Look for counting progress info
  const progressMatch = html.match(/(\d+)\s*(?:of|\/)\s*(\d+)\s*(?:polling|booth)/i);
  if (progressMatch) {
    return { counted: parseInt(progressMatch[1]), total: parseInt(progressMatch[2]) };
  }
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get('province');
  const district = searchParams.get('district');
  const constituency = searchParams.get('constituency');

  if (!province || !district || !constituency) {
    return Response.json(
      { error: 'Missing required params: province, district, constituency' },
      { status: 400 }
    );
  }

  const url = `${BASE_URL}/pradesh-${province}/district-${district}/constituency-${constituency}?lng=eng`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Nepal-Election-Tracker/1.0',
      },
      signal: controller.signal,
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch constituency data' }, { status: 502 });
    }

    const html = await response.text();
    const candidates = parseCandidateResults(html);
    const title = parseConstituencyTitle(html);
    const progress = parseCountingProgress(html);

    const result = {
      source: 'ekantipur',
      fetched_at: new Date().toISOString(),
      province: parseInt(province),
      district,
      constituency: parseInt(constituency),
      title,
      counting_progress: progress,
      candidates,
    };

    return Response.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return Response.json(
      { error: 'Constituency results request failed', details: err.message },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
