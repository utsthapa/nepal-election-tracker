/**
 * Export utilities for election results
 * Supports CSV, JSON, and PNG screenshot exports
 */

import { PARTIES } from '../data/constituencies';

const PARTY_KEYS = Object.keys(PARTIES);

/**
 * Generate CSV for seat totals
 */
export function generateSeatsCsv(fptpSeats, prSeats, totalSeats, nationalVoteShares) {
  const headers = ['Party', 'FPTP Seats', 'PR Seats', 'Total Seats', 'National Vote Share (%)'];
  const rows = PARTY_KEYS
    .filter(p => (totalSeats[p] || 0) > 0 || (nationalVoteShares[p] || 0) > 0.01)
    .sort((a, b) => (totalSeats[b] || 0) - (totalSeats[a] || 0))
    .map(party => [
      `${PARTIES[party]?.name || party} (${party})`,
      fptpSeats[party] || 0,
      prSeats[party] || 0,
      totalSeats[party] || 0,
      ((nationalVoteShares[party] || 0) * 100).toFixed(2),
    ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

/**
 * Generate CSV for constituency-level results
 */
export function generateConstituencyCsv(fptpResults) {
  const partyHeaders = PARTY_KEYS.map(p => `${p} (%)`);
  const headers = ['ID', 'Name', 'District', 'Province', 'Winner', 'Margin (%)', ...partyHeaders];

  const rows = Object.values(fptpResults)
    .sort((a, b) => (a.id || '').localeCompare(b.id || ''))
    .map(result => {
      const votes = result.adjusted || result.results2022 || {};
      return [
        result.id,
        `"${result.name || ''}"`,
        `"${result.district || ''}"`,
        result.province || '',
        result.winner || '',
        ((result.margin || 0) * 100).toFixed(2),
        ...PARTY_KEYS.map(p => ((votes[p] || 0) * 100).toFixed(2)),
      ];
    });

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

/**
 * Generate JSON export of full state
 */
export function generateJsonExport({ sliders, seats, results, alliance }) {
  const exportData = {
    generatedAt: new Date().toISOString(),
    source: 'Nepal Election Simulator',
    sliders,
    seats,
    alliance,
    constituencies: Object.values(results).map(r => ({
      id: r.id,
      name: r.name,
      district: r.district,
      province: r.province,
      winner: r.winner,
      margin: r.margin,
      voteShares: r.adjusted || r.results2022,
    })),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Trigger browser download via Blob URL
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capture screenshot of a DOM element
 */
export async function downloadScreenshot(element, filename = 'nepal-election-results.png') {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element, {
    backgroundColor: '#faf9f6',
    scale: 2,
    logging: false,
  });
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
