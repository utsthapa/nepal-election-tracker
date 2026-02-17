import electionData from '../nepal_2026_election_data.json';

/**
 * Get all candidates contesting from a specific constituency in 2026
 * @param {string} constituencyName - The constituency name (e.g., "Jhapa-5", "Kathmandu-1")
 * @returns {Array} Array of candidates with their party info
 */
export function get2026Candidates(constituencyName) {
  if (!constituencyName) return [];
  
  const candidates = [];
  
  electionData.parties.forEach(party => {
    if (party.key_candidates) {
      const partyCandidates = party.key_candidates.filter(
        c => c.constituency.toLowerCase() === constituencyName.toLowerCase()
      );
      
      partyCandidates.forEach(candidate => {
        candidates.push({
          name: candidate.name,
          party: party.name,
          partyShort: party.abbreviation,
          position: candidate.position || null,
          color: getPartyColor(party.name)
        });
      });
    }
  });
  
  return candidates;
}

/**
 * Get party color by party name
 * @param {string} partyName 
 * @returns {string} Hex color code
 */
export function getPartyColor(partyName) {
  const colors = {
    'Nepali Congress': '#22c55e',
    'Communist Party of Nepal (Unified Marxist-Leninist)': '#ef4444',
    'Rastriya Swatantra Party': '#3b82f6',
    'Nepali Communist Party': '#dc2626',
    'Rastriya Prajatantra Party': '#8b5cf6',
    'Janamat Party': '#14b8a6',
    'Janata Samajbadi Party': '#ec4899',
    'Loktantrik Samajbadi Party': '#a855f7',
    'Nagarik Unmukti Party': '#06b6d4',
    'CPN (Unified Socialist)': '#f97316',
    'CPN-Maoist Centre': '#991b1b',
  };
  
  return colors[partyName] || '#6b7280';
}

/**
 * Get key battleground info for a constituency
 * @param {string} constituencyName 
 * @returns {Object|null}
 */
export function getBattlegroundInfo(constituencyName) {
  if (!constituencyName) return null;
  
  return electionData.key_battlegrounds.find(
    b => b.constituency.toLowerCase() === constituencyName.toLowerCase()
  ) || null;
}

/**
 * Get all 2026 election data
 * @returns {Object}
 */
export function get2026ElectionData() {
  return electionData;
}

export default {
  get2026Candidates,
  getPartyColor,
  getBattlegroundInfo,
  get2026ElectionData
};
