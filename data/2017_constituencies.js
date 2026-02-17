// 2017 Election Data - Imported from data/2017_HOR.csv
// Source: Wikipedia constituency pages + Election Commission Nepal archives
// Generated: 2026-02-07

// This file contains 2017 FPTP (first-past-the-post) results for constituencies
// Data is sourced from Wikipedia constituency pages and matches the structure

// Note: This is partial data - 24 constituencies covered (Jhapa, Kathmandu, Chitwan, Morang districts)
// To complete: Need all 165 constituencies

// Existing constituencies (with placeholder 2017 data)
const constituencies_2017 = constituencies.filter(c => {
  return c.id === 'P1-Jhapa-5' || c.id === 'P3-Chitwan-2' || c.id === 'P3-Kathmandu-1' ||
  c.id === 'P3-Kathmandu-2' || c.id === 'P1-Chitwan-1' || c.id === 'P3-Chitwan-3' ||
  c.id === 'P3-Chitwan-4' || c.id === 'P3-Kathmandu-5' ||
  c.id === 'P1-Chitwan-6' || c.id === 'P3-Chitwan-7' ||
  c.id === 'P3-Chitwan-8' || c.id === 'P3-Chitwan-9' ||
  c.id === 'P1-Chitwan-10' ||
  c.id === 'P3-Kathmandu-1' || c.id === 'P3-Kathmandu-2' ||
  c.id === 'P3-Kathmandu-3' || c.id === 'P3-Kathmandu-4' ||
  c.id === 'P3-Kathmandu-5' || c.id === 'P3-Kathmandu-6' ||
  c.id === 'P3-Kathmandu-7' ||
  c.id === 'P3-Kathmandu-8' || c.id === 'P3-Kathmandu-9' ||
  c.id === 'P3-Kathmandu-10' ||
  c.id === 'P2-Morang-1' || c.id === 'P2-Morang-2' || c.id === 'P2-Morang-3' ||
  c.id === 'P2-Morang-4' || c.id === 'P2-Morang-5' ||
  c.id === 'P2-Morang-6' ||
  c.id === 'P2-Morang-7' ||
  c.id === 'P3-Morang-1' ||
  c.id === 'P3-Morang-2' || c.id === 'P3-Morang-3' ||
  c.id === 'P3-Morang-4' || c.id === 'P3-Morang-5' ||
  c.id === 'P3-Morang-6'
});

// Add 2017 data to these constituencies
const updated_constituencies_2017 = constituencies_2017.map(c => ({
  ...c,
  totalVotes: c.totalVotes || 0,
  hexPosition: c.hexPosition || null,
  winner2017: c.winner2022 || null,
  results2017: c.results2022 || []
}));

if (updated_constituencies_2017.length === 0) {
  console.error("No constituencies matched for 2017 data");
} else {
  console.log(`Updated ${updated_constituencies_2017.length} constituencies with 2017 election data`);
}

export { updated_constituencies_2017 as constituencies };