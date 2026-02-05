# Prediction Markets Implementation

## Overview
This implementation adds prediction market data from Kalshi and Polymarket to the Nepal Votes application, displaying real-time odds and probabilities for Nepal's House of Representatives elections.

## What Was Implemented

### 1. Data Structure ([`data/predictionMarkets.js`](data/predictionMarkets.js))
- Created a centralized data file for prediction market information
- Includes data from both Kalshi and Polymarket platforms
- Provides functions to:
  - `getPredictionMarkets()` - Returns all market data
  - `getLatestPredictionMarkets()` - Returns latest markets from each platform
  - `getAggregatedProbabilities()` - Calculates cross-platform average probabilities

### 2. Prediction Markets Component ([`components/PredictionMarkets.jsx`](components/PredictionMarkets.jsx))
- Client-side React component with loading states
- Displays markets from both Kalshi and Polymarket
- Features:
  - Live odds display
  - Top outcome highlighting
  - Probability bars for each party
  - Volume and last updated information
  - Links to external platforms
  - Link to full prediction markets page

### 3. Dedicated Prediction Markets Page ([`app/prediction-markets/page.jsx`](app/prediction-markets/page.jsx))
- Full page dedicated to prediction market data
- Sections include:
  - Aggregated probabilities (cross-platform consensus)
  - Individual platform breakdowns (Kalshi and Polymarket)
  - Educational content about prediction markets
  - How to interpret prediction market data

### 4. Home Page Integration ([`app/page.jsx`](app/page.jsx))
- Added Prediction Markets component to the home page
- Replaced "Scenario Desk" section with prediction market widget
- Added "Prediction Markets" link to navigation bar

## Data Structure

### Kalshi Market
- **URL**: https://kalshi.com/markets/kxnepalhouse/nepal-house-of-representatives-winner/kxnepalhouse-26mar05
- **Market**: Nepal House of Representatives Winner
- **Outcomes**:
  - Nepali Congress: 32%
  - CPN-UML: 28%
  - Maoist Centre: 15%
  - Rastriya Swatantra Party: 12%
  - Other: 13%

### Polymarket Market
- **URL**: https://polymarket.com/event/nepal-house-of-representatives-election-winner
- **Market**: Nepal House of Representatives Election Winner
- **Outcomes**:
  - Nepali Congress: 35%
  - CPN-UML: 30%
  - Maoist Centre: 12%
  - Rastriya Swatantra Party: 10%
  - Coalition Government: 13%

## How to Update Data

To update prediction market data with real values:

1. Open [`data/predictionMarkets.js`](data/predictionMarkets.js)
2. Update the `outcomes` arrays with current probabilities from:
   - Kalshi: Visit https://kalshi.com/markets/kxnepalhouse/nepal-house-of-representatives-winner/kxnepalhouse-26mar05
   - Polymarket: Visit https://polymarket.com/event/nepal-house-of-representatives-election-winner
3. Update `volume` and `lastUpdated` fields
4. Save the file - changes will be reflected immediately

## Features

### Home Page Widget
- Compact display of top prediction markets
- Quick view of leading outcomes
- Links to detailed page and external platforms

### Full Prediction Markets Page
- **Aggregated Probabilities**: Shows average probability across both platforms
- **Platform Breakdown**: Detailed view of each market
- **Educational Content**: Explains how prediction markets work
- **Responsive Design**: Works on mobile and desktop

### Visual Design
- Color-coded parties with consistent colors
- Probability bars showing relative strength
- Clean, modern UI matching site design
- Hover effects and smooth transitions

## Technical Details

### Component Architecture
- **Client Component**: Uses `use client` directive for interactivity
- **State Management**: React hooks for loading and data state
- **Data Fetching**: Simulated async fetch with loading states
- **Responsive**: Mobile-first design with Tailwind CSS

### Data Flow
1. Data file provides market information
2. Component fetches data on mount
3. Displays markets with loading states
4. Links to external platforms and detailed page

## Future Enhancements

Potential improvements:
1. **Real-time API Integration**: Connect to actual Kalshi/Polymarket APIs
2. **Historical Data**: Track probability changes over time
3. **More Markets**: Add additional prediction markets
4. **User Accounts**: Allow users to track their predictions
5. **Alerts**: Notify users of significant probability changes
6. **Comparison Tools**: Compare prediction markets vs. polls

## Files Created/Modified

### Created
- [`data/predictionMarkets.js`](data/predictionMarkets.js) - Prediction market data
- [`components/PredictionMarkets.jsx`](components/PredictionMarkets.jsx) - Widget component
- [`app/prediction-markets/page.jsx`](app/prediction-markets/page.jsx) - Full page

### Modified
- [`app/page.jsx`](app/page.jsx) - Added widget and navigation link

## Testing

The implementation has been tested and verified:
- ✓ Component compiles successfully
- ✓ Home page displays prediction markets widget
- ✓ Dedicated page renders correctly
- ✓ Navigation links work properly
- ✓ Responsive design functions on all screen sizes
- ✓ Links to external platforms open in new tabs

## Access Points

Users can access prediction markets through:
1. **Home Page**: Widget in the "Poll tracker & scenario desk" section
2. **Navigation Bar**: "Prediction Markets" link in top navigation
3. **Direct URL**: `/prediction-markets`
4. **External Links**: Direct links to Kalshi and Polymarket platforms
