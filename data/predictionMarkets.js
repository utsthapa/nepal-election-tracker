// Prediction market data for Nepal elections
// Live data is fetched from Kalshi and Polymarket APIs via /api/markets/* routes.
// No active Nepal 2026/2027 election markets have been confirmed on these platforms yet.

/**
 * Returns prediction market data.
 * Live data is fetched from /api/markets/* routes; this fallback returns empty markets.
 */
export function getPredictionMarkets() {
  return {
    kalshi: {
      name: 'Kalshi',
      url: 'https://kalshi.com',
      markets: []
    },
    polymarket: {
      name: 'Polymarket',
      url: 'https://polymarket.com',
      markets: []
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
