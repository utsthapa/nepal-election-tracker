/**
 * Data Context Module
 * Harvests and aggregates data from all available sources for article enrichment
 * Heavy integration mode - pulls maximum relevant data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file paths
const DATA_PATHS = {
  historicalElections: path.join(__dirname, '../data/historicalElections.js'),
  demographics: path.join(__dirname, '../data/demographics.js'),
  polls: path.join(__dirname, '../data/polls.js'),
  forecasts: path.join(__dirname, '../data/forecasts.js'),
  nepalMacro: path.join(__dirname, '../data/nepalMacroData.js'),
  provincialMacro: path.join(__dirname, '../data/provincialMacroData.js'),
  constituencyDemo: path.join(__dirname, '../data/constituency_demographics_mapping.js'),
  districtEthnicity: path.join(__dirname, '../data/districtEthnicity.js'),
  ethnicDemo: path.join(__dirname, '../data/ethnicDemographics.js'),
  predictionMarkets: path.join(__dirname, '../data/predictionMarkets.js'),
  geographicClusters: path.join(__dirname, '../data/geographicClusters.js'),
  rspProxy: path.join(__dirname, '../data/rspDemographicProxy.js'),
  internationalComp: path.join(__dirname, '../data/internationalComparisons.js'),
  election2026: path.join(__dirname, '../nepal_2026_election_data.json'),
  results2017: path.join(__dirname, '../nepal_2017_election_results.json'),
  results2013: path.join(__dirname, '../constituency_results_2013.json'),
  results2008: path.join(__dirname, '../constituency_results_2008.json'),
  results1994: path.join(__dirname, '../1994_constituency_results.json'),
};

/**
 * Extract data from JS files by evaluating exports
 */
async function extractJSData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    // For ESM modules, we'll read and parse manually
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract ELECTIONS object if present
    if (content.includes('export const ELECTIONS')) {
      const match = content.match(/export const ELECTIONS = ({[\s\S]*?});\s*\n/);
      if (match) {
        // Safe eval of the object structure
        try {
          const electionsData = eval('(' + match[1] + ')');
          return { ELECTIONS: electionsData };
        } catch (e) {
          return null;
        }
      }
    }

    // Extract other exports
    const exports = {};
    const exportMatches = content.matchAll(/export const (\w+) = /g);
    for (const match of exportMatches) {
      const varName = match[1];
      const varMatch = content.match(new RegExp(`export const ${varName} = ([\\s\\S]*?);\\s*\\n`));
      if (varMatch) {
        try {
          exports[varName] = eval('(' + varMatch[1] + ')');
        } catch (e) {
          // Skip if can't parse
        }
      }
    }

    return Object.keys(exports).length > 0 ? exports : null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract JSON data
 */
function extractJSONData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Build comprehensive data context for historical analysis articles
 */
function buildHistoricalContext(data) {
  const elections = data.historicalElections?.ELECTIONS || {};

  const context = {
    overview: {
      totalElections: Object.keys(elections).length,
      years: Object.keys(elections)
        .map(Number)
        .sort((a, b) => b - a),
      partySystemEvolution: [],
    },
    elections: {},
    trends: {
      turnoutTrend: [],
      fragmentationTrend: [],
      partyPerformance: {},
    },
    keyStatistics: {
      highestTurnout: { year: null, percentage: 0 },
      lowestTurnout: { year: null, percentage: 100 },
      mostFragmented: { year: null, enp: 0 },
      mostDominant: { year: null, seatShare: 0 },
    },
  };

  // Process each election
  for (const [year, election] of Object.entries(elections)) {
    const yearNum = parseInt(year);

    context.elections[year] = {
      year: yearNum,
      type: election.type,
      date: election.date,
      totalSeats: election.totalSeats,
      turnout: election.turnout,
      government: election.government,
      notes: election.notes,
      results: election.results?.Total || election.results?.FPTP || {},
    };

    // Track turnout trends
    if (election.turnout && election.turnout !== 'TBD') {
      const turnoutNum = parseFloat(election.turnout);
      if (!isNaN(turnoutNum)) {
        context.trends.turnoutTrend.push({ year: yearNum, turnout: turnoutNum });

        if (turnoutNum > context.keyStatistics.highestTurnout.percentage) {
          context.keyStatistics.highestTurnout = { year: yearNum, percentage: turnoutNum };
        }
        if (turnoutNum < context.keyStatistics.lowestTurnout.percentage) {
          context.keyStatistics.lowestTurnout = { year: yearNum, percentage: turnoutNum };
        }
      }
    }

    // Calculate effective number of parties (ENP) for fragmentation
    const results = election.results?.Total || election.results?.FPTP || {};
    const totalSeats = election.totalSeats;
    let enp = 0;
    let largestPartyShare = 0;

    for (const [party, seats] of Object.entries(results)) {
      if (party !== 'Others' && seats > 0) {
        const seatShare = seats / totalSeats;
        enp += Math.pow(seatShare, 2);
        if (seatShare > largestPartyShare) {
          largestPartyShare = seatShare;
        }
      }
    }

    if (enp > 0) {
      enp = 1 / enp;
      context.trends.fragmentationTrend.push({ year: yearNum, enp });

      if (enp > context.keyStatistics.mostFragmented.enp) {
        context.keyStatistics.mostFragmented = { year: yearNum, enp };
      }
    }

    if (largestPartyShare > 0) {
      if (largestPartyShare > context.keyStatistics.mostDominant.seatShare) {
        context.keyStatistics.mostDominant = { year: yearNum, seatShare: largestPartyShare };
      }
    }
  }

  // Party performance over time
  const parties = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN'];
  for (const party of parties) {
    context.trends.partyPerformance[party] = [];
    for (const [year, election] of Object.entries(elections)) {
      const results = election.results?.Total || election.results?.FPTP || {};
      const seats = results[party] || 0;
      const totalSeats = election.totalSeats;
      context.trends.partyPerformance[party].push({
        year: parseInt(year),
        seats,
        seatShare: totalSeats ? ((seats / totalSeats) * 100).toFixed(1) : 0,
      });
    }
  }

  return context;
}

/**
 * Build demographic context
 */
function buildDemographicContext(data) {
  const context = {
    national: data.nepalMacro || {},
    provincial: data.provincialMacro || {},
    constituencies: {},
    ethnic: data.ethnicDemo || {},
    district: data.districtEthnicity || {},
  };

  // Extract constituency demographics if available
  if (data.constituencyDemo) {
    context.constituencies = data.constituencyDemo;
  }

  return context;
}

/**
 * Build polling and forecasting context
 */
function buildForecastingContext(data) {
  return {
    polls: data.polls || {},
    forecasts: data.forecasts || {},
    predictionMarkets: data.predictionMarkets || {},
    rspProxy: data.rspProxy || {},
  };
}

/**
 * Build comparative international context
 */
function buildInternationalContext(data) {
  return data.internationalComp || {};
}

/**
 * Build 2026 election specific context
 */
function build2026Context(data) {
  if (!data.election2026) return null;

  return {
    election: data.election2026,
    candidates: data.election2026?.candidates || {},
    majorParties: data.election2026?.majorParties || [],
    keyBattlegrounds: data.election2026?.keyBattlegrounds || [],
  };
}

/**
 * Get data context for a specific article topic
 */
export async function getArticleDataContext(articleSlug) {
  console.log(`Building heavy data context for: ${articleSlug}`);

  // Load all data sources
  const data = {
    historicalElections: await extractJSData(DATA_PATHS.historicalElections),
    demographics: await extractJSData(DATA_PATHS.demographics),
    polls: await extractJSData(DATA_PATHS.polls),
    forecasts: await extractJSData(DATA_PATHS.forecasts),
    nepalMacro: await extractJSData(DATA_PATHS.nepalMacro),
    provincialMacro: await extractJSData(DATA_PATHS.provincialMacro),
    constituencyDemo: await extractJSData(DATA_PATHS.constituencyDemo),
    districtEthnicity: await extractJSData(DATA_PATHS.districtEthnicity),
    ethnicDemographics: await extractJSData(DATA_PATHS.ethnicDemo),
    predictionMarkets: await extractJSData(DATA_PATHS.predictionMarkets),
    geographicClusters: await extractJSData(DATA_PATHS.geographicClusters),
    rspProxy: await extractJSData(DATA_PATHS.rspProxy),
    internationalComp: await extractJSData(DATA_PATHS.internationalComp),
    election2026: extractJSONData(DATA_PATHS.election2026),
    results2017: extractJSONData(DATA_PATHS.results2017),
    results2013: extractJSONData(DATA_PATHS.results2013),
    results2008: extractJSONData(DATA_PATHS.results2008),
    results1994: extractJSONData(DATA_PATHS.results1994),
  };

  // Build comprehensive context based on article topic
  const context = {
    timestamp: new Date().toISOString(),
    articleSlug,
    dataSources: {},
  };

  // Map article slugs to relevant data
  const topicMappings = {
    '30-years-democracy': ['historicalElections', 'nepalMacro', 'internationalComp'],
    'voter-turnout-analysis': [
      'historicalElections',
      'demographics',
      'nepalMacro',
      'provincialMacro',
    ],
    'coalition-stability': ['historicalElections', 'polls', 'forecasts', 'predictionMarkets'],
    'youth-voter-trends': ['demographics', 'polls', 'rspProxy', 'forecasts'],
    'regional-voting-patterns': [
      'demographics',
      'provincialMacro',
      'geographicClusters',
      'constituencyDemo',
    ],
    'madhesh-province-analysis': [
      'demographics',
      'provincialMacro',
      'districtEthnicity',
      'ethnicDemographics',
    ],
    'economic-voting': ['nepalMacro', 'historicalElections', 'internationalComp'],
    'understanding-nepals-electoral-system': ['historicalElections', 'internationalComp'],
    'understanding-election-polls': ['polls', 'forecasts', 'predictionMarkets'],
    'sainte-lague-method-explained': ['historicalElections', 'results2017', 'results2022'],
    'welcome-to-nepal-votes': ['election2026', 'forecasts', 'nepalMacro'],
  };

  const relevantSources = topicMappings[articleSlug] || ['historicalElections', 'nepalMacro'];

  // Build specific contexts
  if (relevantSources.includes('historicalElections')) {
    context.dataSources.historical = buildHistoricalContext(data);
  }

  if (relevantSources.includes('demographics')) {
    context.dataSources.demographics = buildDemographicContext(data);
  }

  if (relevantSources.includes('polls') || relevantSources.includes('forecasts')) {
    context.dataSources.forecasting = buildForecastingContext(data);
  }

  if (relevantSources.includes('internationalComp')) {
    context.dataSources.international = buildInternationalContext(data);
  }

  if (relevantSources.includes('election2026')) {
    context.dataSources.election2026 = build2026Context(data);
  }

  // Add raw election results for detailed analysis
  context.dataSources.rawResults = {
    2017: data.results2017,
    2013: data.results2013,
    2008: data.results2008,
    1994: data.results1994,
  };

  console.log(
    `Data context built with ${Object.keys(context.dataSources).length} source categories`
  );

  return context;
}

/**
 * Format data context for prompt injection
 */
export function formatDataForPrompt(context) {
  let promptSection = '\n\n## DATA CONTEXT\n\n';

  // Historical elections summary
  if (context.dataSources.historical) {
    const hist = context.dataSources.historical;
    promptSection += `### HISTORICAL ELECTION OVERVIEW\n`;
    promptSection += `- Total elections analyzed: ${hist.overview.totalElections}\n`;
    promptSection += `- Election years: ${hist.overview.years.join(', ')}\n`;
    promptSection += `- Highest turnout: ${hist.keyStatistics.highestTurnout.percentage}% (${hist.keyStatistics.highestTurnout.year})\n`;
    promptSection += `- Lowest turnout: ${hist.keyStatistics.lowestTurnout.percentage}% (${hist.keyStatistics.lowestTurnout.year})\n`;
    promptSection += `- Most fragmented: ENP ${hist.keyStatistics.mostFragmented.enp.toFixed(2)} (${hist.keyStatistics.mostFragmented.year})\n\n`;

    // Party trajectories
    promptSection += `### PARTY PERFORMANCE TRAJECTORIES\n`;
    for (const [party, trajectory] of Object.entries(hist.trends.partyPerformance)) {
      const recent = trajectory.slice(-3);
      if (recent.some(r => r.seats > 0)) {
        promptSection += `- ${party}: `;
        promptSection += recent.map(r => `${r.year}=${r.seats} seats (${r.seatShare}%)`).join(', ');
        promptSection += '\n';
      }
    }
    promptSection += '\n';
  }

  // Demographics
  if (context.dataSources.demographics) {
    const demo = context.dataSources.demographics;
    promptSection += `### DEMOGRAPHIC CONTEXT\n`;
    if (demo.national?.population) {
      promptSection += `- Population: ${demo.national.population}\n`;
    }
    if (demo.national?.voterTurnout) {
      promptSection += `- Voter turnout trends: Available\n`;
    }
    promptSection += '\n';
  }

  // 2026 election
  if (context.dataSources.election2026) {
    const e2026 = context.dataSources.election2026;
    promptSection += `### 2026 ELECTION CONTEXT\n`;
    promptSection += `- Election date: ${e2026.election?.date || 'TBD'}\n`;
    promptSection += `- Total candidates: ${e2026.candidates?.total || 'N/A'}\n`;
    promptSection += `- Major parties: ${e2026.majorParties?.map(p => p.name).join(', ') || 'N/A'}\n`;
    promptSection += `- Key battlegrounds: ${e2026.keyBattlegrounds?.length || 0} identified\n\n`;
  }

  return promptSection;
}

export default {
  getArticleDataContext,
  formatDataForPrompt,
};
