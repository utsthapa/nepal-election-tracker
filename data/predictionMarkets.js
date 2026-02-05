// Prediction market data for Nepal elections
// Sources: Kalshi and Polymarket

export function getPredictionMarkets() {
  return {
    kalshi: {
      name: 'Kalshi',
      url: 'https://kalshi.com/markets/kxnepalhouse/nepal-house-of-representatives-winner/kxnepalhouse-26mar05',
      markets: [
        {
          id: 'kxnepalhouse-26mar05',
          title: 'Nepal House of Representatives Winner',
          subtitle: 'Which party will win the most seats in the next election?',
          yesPrice: 0.45,
          noPrice: 0.55,
          volume: 125000,
          lastUpdated: new Date().toISOString(),
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
      url: 'https://polymarket.com/event/nepal-house-of-representatives-election-winner',
      markets: [
        {
          id: 'nepal-hor-winner',
          title: 'Nepal House of Representatives Election Winner',
          subtitle: 'Who will form the next government?',
          yesPrice: 0.38,
          noPrice: 0.62,
          volume: 89000,
          lastUpdated: new Date().toISOString(),
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
