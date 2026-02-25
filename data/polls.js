// Polling data for Nepal elections
//
// DATA INTEGRITY WARNING: The polls below are ILLUSTRATIVE EXAMPLES only.
// They are NOT verified as real published polls. The pollster names (Kantipur Media Group,
// Nepal Live, Republica) are real organisations, but these specific poll results
// have NOT been confirmed against any published reports.
//
// Before using this data publicly, each poll must be verified against an actual
// published source (e.g., a newspaper article or press release from the pollster).
// Add a `sourceUrl` field to each poll entry once verified.
//
// Real Nepali polling organisations to check:
//   - Kantipur: https://ekantipur.com
//   - Republica: https://myrepublica.nagariknetwork.com
//   - Nepal Live: https://nepallive.com

export const POLLS = [
  {
    id: 'poll-001',
    title: 'National Poll - January 2025',
    titleNe: 'राष्ट्रिय मतदान - जनवरी २०२५',
    pollster: 'Kantipur Media Group',
    pollsterNe: 'कान्तिपुर मिडिया ग्रुप',
    methodology: 'Phone survey, n=2000',
    methodologyNe: 'फोन सर्वेक्षण, n=2000',
    date: '2025-01-15',
    sampleSize: 2000,
    marginError: 2.5,
    results: {
      NC: 28,
      UML: 26,
      Maoist: 12,
      RSP: 15,
      RPP: 6,
      JSPN: 5,
      US: 4,
      JP: 2,
      Others: 2,
    },
    rating: 'A-',
    notes: 'Conducted across all 7 provinces. Weighted by population.',
    notesNe: 'सबै ७ प्रदेशहरूमा गरिएको। जनसंख्याद्वारा तौल गरिएको।',
    verified: false, // TODO: locate published source and set to true
    sourceUrl: null, // TODO: add URL to published poll report
  },
  {
    id: 'poll-002',
    title: 'National Poll - December 2024',
    titleNe: 'राष्ट्रिय मतदान - डिसेम्बर २०२४',
    pollster: 'Nepal Live',
    pollsterNe: 'नेपाल लाइभ',
    methodology: 'Online survey, n=1500',
    methodologyNe: 'अनलाइन सर्वेक्षण, n=1500',
    date: '2024-12-10',
    sampleSize: 1500,
    marginError: 3.0,
    results: {
      NC: 26,
      UML: 27,
      Maoist: 11,
      RSP: 16,
      RPP: 5,
      JSPN: 6,
      US: 5,
      JP: 2,
      Others: 2,
    },
    rating: 'B+',
    notes: 'Urban bias detected. Adjusted for demographic representation.',
    notesNe: 'शहरी पक्षपात पत्ता लाग्यो। जनसांख्यिकी प्रतिनिधित्वको लागि समायोजन गरियो।',
    verified: false, // TODO: locate published source and set to true
    sourceUrl: null, // TODO: add URL to published poll report
  },
  {
    id: 'poll-003',
    title: 'National Poll - November 2024',
    titleNe: 'राष्ट्रिय मतदान - नोभेम्बर २०२४',
    pollster: 'Republica',
    pollsterNe: 'रिपब्लिका',
    methodology: 'Face-to-face, n=2500',
    methodologyNe: 'अनुहोर-देखि-अनुहोर, n=2500',
    date: '2024-11-20',
    sampleSize: 2500,
    marginError: 2.0,
    results: {
      NC: 27,
      UML: 25,
      Maoist: 13,
      RSP: 14,
      RPP: 7,
      JSPN: 5,
      US: 4,
      JP: 3,
      Others: 2,
    },
    rating: 'A',
    notes: 'Comprehensive rural and urban sampling.',
    notesNe: 'व्यापक ग्रामीण र शहरी नमूनाकरण।',
    verified: false, // TODO: locate published source and set to true
    sourceUrl: null, // TODO: add URL to published poll report
  },
]

export function getPollById(id) {
  return POLLS.find(poll => poll.id === id)
}

export function getLatestPolls(limit = 10) {
  return [...POLLS]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

export function getPollsByPollster(pollster) {
  return POLLS.filter(poll => poll.pollster === pollster)
}

export function getPollTrends() {
  // Calculate average trends across all polls
  const partyAverages = {}
  const partyCounts = {}

  POLLS.forEach(poll => {
    Object.entries(poll.results).forEach(([party, percentage]) => {
      if (!partyAverages[party]) {
        partyAverages[party] = 0
        partyCounts[party] = 0
      }
      partyAverages[party] += percentage
      partyCounts[party]++
    })
  })

  Object.keys(partyAverages).forEach(party => {
    partyAverages[party] = partyAverages[party] / partyCounts[party]
  })

  return partyAverages
}
