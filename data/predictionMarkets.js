// Prediction market data for Nepal elections
//
// ⚠️  IMPORTANT — DATA STATUS ⚠️
// This file contains STATIC PLACEHOLDER DATA only. The prices, volumes, and
// probabilities below are FABRICATED and do NOT reflect real market activity.
// The lastUpdated field uses new Date() which makes the data appear live — it
// is NOT live.
//
// The live UI (PredictionMarkets.jsx) fetches directly from the Kalshi and
// Polymarket APIs via /api/markets/* routes. This static file is a development
// fallback and should NOT be used to display data to users.
//
// At the time of writing, neither Kalshi nor Polymarket have confirmed active
// markets for the Nepal 2026/2027 general election. The URLs below may not
// resolve to real market pages.

/**
 * Returns static placeholder data for development purposes only.
 * Do NOT display this data as live market data to users.
 * Use the /api/markets/* routes for live data instead.
 */
export function getPredictionMarkets() {
  return {
    _disclaimer: 'STATIC PLACEHOLDER — not real market data. Prices and volumes are fabricated.',
    kalshi: {
      name: 'Kalshi',
      // ⚠️ URL may not resolve — no confirmed Nepal election market on Kalshi
      url: 'https://kalshi.com',
      markets: [
        {
          id: 'kxnepalhouse-26mar05',
          title: 'Nepal House of Representatives Winner [PLACEHOLDER]',
          subtitle: 'Which party will win the most seats in the next election?',
          // ⚠️ Fabricated prices — not real market data
          yesPrice: 0.45,
          noPrice: 0.55,
          volume: 125000,
          lastUpdated: new Date().toISOString(),
          isPlaceholder: true,
          outcomes: [
            { name: 'Nepali Congress', probability: 0.32, color: '#0066cc' },
            { name: 'CPN-UML', probability: 0.28, color: '#cc0000' },
            { name: 'Maoist Centre', probability: 0.15, color: '#ff6600' },
            { name: 'Rastriya Swatantra Party', probability: 0.12, color: '#00cc66' },
            { name: 'Other', probability: 0.13, color: '#999999' },
          ]
        }
      ]
    },
    polymarket: {
      name: 'Polymarket',
      // ⚠️ URL may not resolve — no confirmed Nepal election market on Polymarket
      url: 'https://polymarket.com',
      markets: [
        {
          id: 'nepal-hor-winner',
          title: 'Nepal House of Representatives Election Winner [PLACEHOLDER]',
          subtitle: 'Who will form the next government?',
          // ⚠️ Fabricated prices — not real market data
          yesPrice: 0.38,
          noPrice: 0.62,
          volume: 89000,
          lastUpdated: new Date().toISOString(),
          isPlaceholder: true,
          outcomes: [
            { name: 'Nepali Congress', probability: 0.35, color: '#0066cc' },
            { name: 'CPN-UML', probability: 0.30, color: '#cc0000' },
            { name: 'Maoist Centre', probability: 0.12, color: '#ff6600' },
            { name: 'Rastriya Swatantra Party', probability: 0.10, color: '#00cc66' },
            { name: 'Coalition Government', probability: 0.13, color: '#9933ff' },
          ]
        }
      ]
    }
  }
}

export function getLatestPredictionMarkets() {
  const markets = getPredictionMarkets()
  return {
    kalshi: markets.kalshi.markets[0],
    polymarket: markets.polymarket.markets[0]
  }
}

export function getAggregatedProbabilities() {
  const markets = getPredictionMarkets()
  const kalshiOutcomes = markets.kalshi.markets[0].outcomes
  const polymarketOutcomes = markets.polymarket.markets[0].outcomes

  // Aggregate probabilities from both platforms
  const aggregated = {}
  
  // Process Kalshi outcomes
  kalshiOutcomes.forEach(outcome => {
    if (!aggregated[outcome.name]) {
      aggregated[outcome.name] = { 
        name: outcome.name, 
        kalshi: outcome.probability,
        polymarket: 0,
        color: outcome.color 
      }
    }
  })

  // Process Polymarket outcomes
  polymarketOutcomes.forEach(outcome => {
    if (!aggregated[outcome.name]) {
      aggregated[outcome.name] = { 
        name: outcome.name, 
        kalshi: 0,
        polymarket: outcome.probability,
        color: outcome.color 
      }
    } else {
      aggregated[outcome.name].polymarket = outcome.probability
    }
  })

  // Calculate average probability
  return Object.values(aggregated).map(item => ({
    ...item,
    average: (item.kalshi + item.polymarket) / 2
  })).sort((a, b) => b.average - a.average)
}
