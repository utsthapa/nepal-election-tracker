// Polling data for Nepal elections
//
// ⚠️  IMPORTANT — DATA STATUS ⚠️
// No verified, published pre-election opinion polls for Nepal's 2026/2027
// general election have been sourced at this time. The entries below are
// ILLUSTRATIVE PLACEHOLDER EXAMPLES only. They are NOT real polls, NOT
// published by the organisations named, and the numbers are FABRICATED.
// They must NOT be treated as factual poll results.
// Source URLs will be added when real, published polls are obtained.

/**
 * Set to true while all entries below are illustrative placeholders.
 * Components should display a prominent disclaimer when this is true.
 */
export const POLLS_ARE_ILLUSTRATIVE = true;

export const POLLS = [
  {
    id: 'poll-001',
    // ⚠️ ILLUSTRATIVE ONLY — not a real published poll
    isIllustrative: true,
    sourceUrl: null, // No source — data is fabricated
    title: 'National Poll - January 2025 [ILLUSTRATIVE]',
    titleNe: 'राष्ट्रिय मतदान - जनवरी २०२५ [उदाहरण मात्र]',
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
    notes: '[ILLUSTRATIVE PLACEHOLDER — numbers are fabricated, not a real Kantipur Media poll]',
    notesNe: '[उदाहरण मात्र — यो वास्तविक कान्तिपुर मिडियाको सर्वेक्षण होइन]',
  },
  {
    id: 'poll-002',
    // ⚠️ ILLUSTRATIVE ONLY — not a real published poll
    isIllustrative: true,
    sourceUrl: null,
    title: 'National Poll - December 2024 [ILLUSTRATIVE]',
    titleNe: 'राष्ट्रिय मतदान - डिसेम्बर २०२४ [उदाहरण मात्र]',
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
    notes: '[ILLUSTRATIVE PLACEHOLDER — numbers are fabricated, not a real Nepal Live poll]',
    notesNe: '[उदाहरण मात्र — यो वास्तविक नेपाल लाइभको सर्वेक्षण होइन]',
  },
  {
    id: 'poll-003',
    // ⚠️ ILLUSTRATIVE ONLY — not a real published poll
    isIllustrative: true,
    sourceUrl: null,
    title: 'National Poll - November 2024 [ILLUSTRATIVE]',
    titleNe: 'राष्ट्रिय मतदान - नोभेम्बर २०२४ [उदाहरण मात्र]',
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
    notes: '[ILLUSTRATIVE PLACEHOLDER — numbers are fabricated, not a real Republica poll]',
    notesNe: '[उदाहरण मात्र — यो वास्तविक रिपब्लिकाको सर्वेक्षण होइन]',
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
