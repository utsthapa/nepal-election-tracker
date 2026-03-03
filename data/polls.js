// Polling data for Nepal elections
// No verified, published pre-election opinion polls for Nepal's 2026/2027
// general election have been sourced at this time.
// This list will be populated when real, published polls become available.

export const POLLS = []

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
