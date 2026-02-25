// Prediction market metadata for Nepal elections
//
// IMPORTANT: This file does NOT contain live market prices.
// Live prices are fetched at runtime from the real APIs via:
//   - /api/markets/kalshi       → Kalshi Elections API (KXNEPALHOUSE-26MAR05)
//   - /api/markets/polymarket   → Polymarket Gamma API (nepal-house-of-representatives-election-winner)
//   - /api/markets/polymarket-pm → Polymarket Gamma API (next-prime-minister-of-nepal)
//
// This file provides static metadata (platform names, URLs, market titles)
// used by data-context scripts. Do NOT use it as a source of prices or probabilities.

export const PREDICTION_MARKET_METADATA = {
  kalshi: {
    name: 'Kalshi',
    url: 'https://kalshi.com/markets/kxnepalhouse/nepal-house-of-representatives-winner/kxnepalhouse-26mar05',
    apiEndpoint: '/api/markets/kalshi',
    description: 'Nepal House of Representatives Winner — which party wins the most seats?',
    note: 'Kalshi is a US-regulated prediction market exchange.',
  },
  polymarket: {
    name: 'Polymarket',
    url: 'https://polymarket.com/event/nepal-house-of-representatives-election-winner',
    apiEndpoint: '/api/markets/polymarket',
    description: 'Nepal House of Representatives Election Winner — who forms the next government?',
    note: 'Polymarket is a decentralized prediction market on the Polygon blockchain.',
  },
  polymarketPM: {
    name: 'Polymarket — Next PM',
    url: 'https://polymarket.com/event/next-prime-minister-of-nepal',
    apiEndpoint: '/api/markets/polymarket-pm',
    description: 'Who will be the next Prime Minister of Nepal?',
    note: 'Polymarket is a decentralized prediction market on the Polygon blockchain.',
  },
}

// Returns metadata only — no prices, no probabilities.
// To get live prices, call the API endpoints directly.
export function getPredictionMarketMetadata() {
  return PREDICTION_MARKET_METADATA
}
