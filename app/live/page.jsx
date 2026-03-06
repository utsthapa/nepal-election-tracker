// app/live/page.jsx
import { SimpleHeader } from '../../components/SimpleHeader';
import LiveTracker from './LiveTracker';

export const metadata = {
  title: 'Live Election Results | Nepal Election Night',
  description:
    'Live seat-by-seat results for the Nepal 2026 House of Representatives election, updated every 30 seconds from the official Election Commission results portal.',
  openGraph: {
    title: 'Live Nepal Election Results 2026',
    description:
      'Real-time seat tracker for the Nepal 2082 BS House of Representatives election — updated every 30 seconds from result.election.gov.np.',
  },
};

// Fetch initial data server-side so the page hydrates with real data
async function getInitialData() {
  try {
    // During SSR we call the EC portal directly (same logic as the API route)
    const RESULT_BASE = 'https://result.election.gov.np/JSONFiles/Election2082/Common';

    const PARTY_META = {
      NC: { name: 'Nepali Congress', shortName: 'NC', color: '#22c55e' },
      UML: { name: 'CPN (UML)', shortName: 'UML', color: '#ef4444' },
      Maoist: { name: 'CPN (Maoist Centre)', shortName: 'Maoist', color: '#991b1b' },
      RSP: { name: 'Rastriya Swatantra Party', shortName: 'RSP', color: '#3b82f6' },
      RPP: { name: 'Rastriya Prajatantra Party', shortName: 'RPP', color: '#8b5cf6' },
      JSPN: { name: 'Janajati Samajwadi Party Nepal', shortName: 'JSPN', color: '#ec4899' },
      LSP: { name: 'Loktantrik Samajwadi Party', shortName: 'LSP', color: '#a855f7' },
      NUP: { name: 'Nepal Unified Party', shortName: 'NUP', color: '#06b6d4' },
      JP: { name: 'Janmat Party', shortName: 'JP', color: '#14b8a6' },
      Others: { name: 'Others', shortName: 'Oth', color: '#f59e0b' },
    };

    const CANDIDATE_FILES = [
      `${RESULT_BASE}/PartySeatSummary.json`,
      `${RESULT_BASE}/PartySeat.json`,
      `${RESULT_BASE}/partyseat.json`,
      `${RESULT_BASE}/PartyWiseSeat.json`,
      `${RESULT_BASE}/ResultSummary.json`,
    ];

    async function tryFetch(url) {
      try {
        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
          next: { revalidate: 20 },
        });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    }

    let raw = null;
    for (const url of CANDIDATE_FILES) {
      raw = await tryFetch(url);
      if (raw) break;
    }

    // If we got real data, shape it
    if (raw) {
      const parties = Array.isArray(raw)
        ? raw.map(p => {
            const fptp = parseInt(p.FPTPSeats ?? p.fptp_seats ?? p.fptp ?? p.FPTP ?? 0, 10);
            const pr = parseInt(p.PRSeats ?? p.pr_seats ?? p.pr ?? p.PR ?? 0, 10);
            const leading = parseInt(p.Leading ?? p.leading ?? 0, 10);
            const rawName = p.PartyName || p.party_name || p.party || p.name || '';
            // simple match
            let key = 'Others';
            const n = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (n.includes('congress')) key = 'NC';
            else if (n.includes('uml') || n.includes('unified marxist')) key = 'UML';
            else if (n.includes('maoist')) key = 'Maoist';
            else if (n.includes('swatantra')) key = 'RSP';
            else if (n.includes('prajatantra')) key = 'RPP';
            else if (n.includes('janajati')) key = 'JSPN';
            else if (n.includes('loktantrik')) key = 'LSP';
            else if (n.includes('janmat')) key = 'JP';
            return { key, ...(PARTY_META[key] || PARTY_META.Others), fptp, pr, leading, total: fptp + pr + leading };
          }).filter(p => p.total > 0).sort((a, b) => b.total - a.total)
        : [];

      if (parties.length > 0) {
        return {
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
          progress: { reportedConstituencies: 0, totalConstituencies: 165, percentReported: 0, seatsDecided: 0 },
          parties,
        };
      }
    }
  } catch {
    // fall through to baseline
  }

  // Pre-election baseline (2022 results)
  return {
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
    progress: { reportedConstituencies: 0, totalConstituencies: 165, percentReported: 0, seatsDecided: 0 },
    parties: [
      { key: 'NC', name: 'Nepali Congress', shortName: 'NC', color: '#22c55e', fptp: 57, pr: 32, leading: 0, total: 89 },
      { key: 'UML', name: 'CPN (UML)', shortName: 'UML', color: '#ef4444', fptp: 79, pr: 6, leading: 0, total: 85 },
      { key: 'Maoist', name: 'CPN (Maoist Centre)', shortName: 'Maoist', color: '#991b1b', fptp: 18, pr: 14, leading: 0, total: 32 },
      { key: 'RSP', name: 'Rastriya Swatantra Party', shortName: 'RSP', color: '#3b82f6', fptp: 7, pr: 14, leading: 0, total: 21 },
      { key: 'RPP', name: 'Rastriya Prajatantra Party', shortName: 'RPP', color: '#8b5cf6', fptp: 7, pr: 7, leading: 0, total: 14 },
      { key: 'JSPN', name: 'Janajati Samajwadi Party Nepal', shortName: 'JSPN', color: '#ec4899', fptp: 6, pr: 6, leading: 0, total: 12 },
      { key: 'LSP', name: 'Loktantrik Samajwadi Party', shortName: 'LSP', color: '#a855f7', fptp: 4, pr: 0, leading: 0, total: 4 },
      { key: 'NUP', name: 'Nepal Unified Party', shortName: 'NUP', color: '#06b6d4', fptp: 0, pr: 4, leading: 0, total: 4 },
      { key: 'JP', name: 'Janmat Party', shortName: 'JP', color: '#14b8a6', fptp: 2, pr: 0, leading: 0, total: 2 },
      { key: 'Others', name: 'Others', shortName: 'Oth', color: '#f59e0b', fptp: 7, pr: 5, leading: 0, total: 12 },
    ],
  };
}

export default async function LivePage() {
  const initialData = await getInitialData();

  return (
    <div className="min-h-screen bg-[rgb(250,249,246)]">
      <SimpleHeader />
      <LiveTracker initialData={initialData} />
    </div>
  );
}
