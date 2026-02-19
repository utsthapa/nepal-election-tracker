// Parse 2017 Election Data from Wikipedia HTML
// Extracts candidate information, votes, and percentages

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse a single HTML file
function parseHTML(html, constituency) {
  const result = {
    constituency,
    district: constituency.split('-')[0],
    constituencyNumber: parseInt(constituency.split('-')[1]) || 1,
    candidates: [],
    totalVotes: 0,
    validVotes: 0,
    turnout: 0,
    winner: null,
    runnerUp: null,
    margin: 0,
    marginPercent: 0,
  };

  // Find 2017 general election section
  const election2017Match = html.match(
    /2017 general election[\s\S]*?<table[^>]*>[\s\S]*?<\/table>/i
  );
  if (!election2017Match) {
    console.warn(`  No 2017 election data found for ${constituency}`);
    return null;
  }

  const tableHtml = election2017Match[0];

  // Extract rows from table
  const rowMatches = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
  if (!rowMatches) {
    return null;
  }

  // Parse each row (skip header)
  for (let i = 1; i < rowMatches.length; i++) {
    const row = rowMatches[i];

    // Extract cells
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    if (!cells || cells.length < 3) continue;

    // Parse candidate name (first cell with link)
    const nameMatch = cells[0].match(/<a[^>]*>([^<]+)<\/a>/);
    const name = nameMatch ? nameMatch[1].trim() : cells[0].replace(/<[^>]+>/g, '').trim();

    // Parse party
    const partyMatch = cells[1].match(/<a[^>]*>([^<]+)<\/a>/);
    const partyFull = partyMatch ? partyMatch[1].trim() : cells[1].replace(/<[^>]+>/g, '').trim();

    // Parse votes
    const votesText = cells[2]
      .replace(/<[^>]+>/g, '')
      .replace(/,/g, '')
      .trim();
    const votes = parseInt(votesText) || 0;

    // Parse percentage (if available)
    let percent = 0;
    if (cells.length > 3) {
      const percentText = cells[3]
        .replace(/<[^>]+>/g, '')
        .replace(/%/g, '')
        .trim();
      percent = parseFloat(percentText) || 0;
    }

    if (name && votes > 0) {
      result.candidates.push({
        name,
        partyFull,
        votes,
        percent,
        rank: 0, // Will be set after sorting
      });
    }
  }

  // Sort by votes descending
  result.candidates.sort((a, b) => b.votes - a.votes);

  // Set ranks
  result.candidates.forEach((c, idx) => {
    c.rank = idx + 1;
    c.elected = idx === 0;
  });

  // Calculate totals
  if (result.candidates.length > 0) {
    result.totalVotes = result.candidates.reduce((sum, c) => sum + c.votes, 0);
    result.validVotes = result.totalVotes;

    // Set winner and runner-up
    result.winner = result.candidates[0];
    result.runnerUp = result.candidates[1] || null;

    if (result.runnerUp) {
      result.margin = result.winner.votes - result.runnerUp.votes;
      result.marginPercent =
        result.totalVotes > 0
          ? parseFloat(((result.margin / result.totalVotes) * 100).toFixed(2))
          : 0;
    }

    // Recalculate percentages if not provided
    result.candidates.forEach(c => {
      if (c.percent === 0 && result.totalVotes > 0) {
        c.percent = parseFloat(((c.votes / result.totalVotes) * 100).toFixed(2));
      }
    });
  }

  return result;
}

// Map party names to codes
function mapParty(partyFull) {
  const partyMap = {
    'Nepali Congress': 'NC',
    'CPN (UML)': 'UML',
    'CPN (Unified Marxist–Leninist)': 'UML',
    'Communist Party of Nepal (Unified Marxist–Leninist)': 'UML',
    'CPN (Maoist Centre)': 'Maoist',
    'Communist Party of Nepal (Maoist Centre)': 'Maoist',
    'Rastriya Swatantra Party': 'RSP',
    'Rastriya Prajatantra Party': 'RPP',
    'Janata Samajbadi Party, Nepal': 'JSPN',
    'Janata Samajwadi Party, Nepal': 'JSPN',
    'CPN (Unified Socialist)': 'US',
    'Janamat Party': 'JP',
    'Loktantrik Samajwadi Party, Nepal': 'LSP',
    'Nagarik Unmukti Party': 'NUP',
    'Bibeksheel Sajha Party': 'BSP',
    'Rastriya Janamorcha': 'RJM',
    'Nepal Majdoor Kisan Party': 'NMKP',
    Independent: 'Independent',
    'Independent politician': 'Independent',
  };

  return partyMap[partyFull] || 'Others';
}

// Process all HTML files
function processAll() {
  const htmlDir = path.join(__dirname, 'html_cache');
  const outputDir = path.join(__dirname, 'parsed_data');

  if (!fs.existsSync(htmlDir)) {
    console.error('Error: html_cache directory not found. Run scrape_wikipedia.sh first.');
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  console.log(`Found ${files.length} HTML files to parse`);
  console.log('');

  const results = {};
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const constituency = file.replace('.html', '');
    const html = fs.readFileSync(path.join(htmlDir, file), 'utf-8');

    const data = parseHTML(html, constituency);
    if (data && data.candidates.length > 0) {
      // Map party codes
      data.candidates.forEach(c => {
        c.party = mapParty(c.partyFull);
      });

      results[constituency] = data;
      successCount++;
      console.log(
        `✓ ${constituency}: ${data.candidates.length} candidates, winner: ${data.winner?.name || 'N/A'}`
      );
    } else {
      failCount++;
      console.log(`✗ ${constituency}: No data extracted`);
    }
  }

  console.log('');
  console.log('================================');
  console.log(`Successfully parsed: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log('');

  // Save results
  const outputFile = path.join(outputDir, 'all_constituencies.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`✓ Results saved to ${outputFile}`);

  return results;
}

// Run if called directly
if (process.argv[1] === __filename) {
  processAll();
}

export { parseHTML, processAll, mapParty };
