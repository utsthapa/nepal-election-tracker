# Nepal Election Simulator

A comprehensive Next.js application for simulating, analyzing, and forecasting Nepali elections with interactive constituency maps, demographic analysis, and proportional representation calculations.

## Features

- **Interactive Constituency Map** - Visualize election results across all 165 constituencies with hover details
- **Election Simulator** - Adjust party vote shares and see real-time seat projections using Sainte-Laguë method
- **Forecast Dashboard** - View election forecasts with demographic modeling and historical patterns
- **Historical Data** - Access 2022 election results with partial 2017 data
- **Demographic Analysis** - Explore constituency-level population, urbanization, and literacy data
- **Polling Aggregation** - Track public opinion polls over time
- **District Breakdowns** - Detailed analysis for all 77 districts
- **Prediction Markets** - Track market-based election predictions

## Tech Stack

- **Framework**: Next.js 15.1.3 (App Router)
- **UI**: React 18.2, Tailwind CSS 3.4
- **Maps**: Leaflet 1.9.4, React Leaflet 4.2.1
- **Charts**: Recharts 3.7
- **Content**: MDX (next-mdx-remote)
- **Data Viz**: D3-geo, Turf.js
- **Animation**: Framer Motion 11
- **TypeScript**: 5.9.3

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nepalpoltiics

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app                    # Next.js app router pages
  /analysis             # Articles and analysis pages
  /demographics         # Demographic analysis
  /districts            # District-level breakdowns
  /elections            # Election results & forecasts
  /nepal-map            # Interactive map page
  /polls                # Polling data
  /prediction-markets   # Prediction markets feature
  layout.jsx            # Root layout with providers
  page.jsx              # Homepage with simulator

/components             # React components
  /mdx                  # MDX custom components
  ConstituencyMap.jsx   # Leaflet-based map
  NepalMap.jsx          # SVG-based map
  ElectionSimulator.jsx # Main simulator UI
  AdvancedControls.jsx  # Advanced simulation settings
  [... 20+ more]

/data                   # Election data & GeoJSON
  constituencies.js     # 165 constituency data
  demographics.js       # Population data
  historicalElections.js # Past elections
  polls.js              # Poll aggregation
  partyMeta.js          # Party info & colors
  /geojson              # Map boundaries

/hooks                  # React hooks
  useElectionState.js   # Main state management

/utils                  # Utility functions
  calculations.js       # Electoral math
  sainteLague.js        # PR seat allocation
  demographicUtils.js   # Population analysis

/lib                    # Shared libraries
  content.js            # MDX content parser
  metadata.js           # SEO metadata

/scripts                # Data processing scripts
  [See scripts/README.md]

/content                # MDX articles
  /analysis             # Analysis pieces
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Data Sources

- **Election Results**: Election Commission of Nepal (ECN)
- **GeoJSON Boundaries**: Natural Earth, OSM contributors
- **Demographics**: Nepal Census 2021 estimates
- **Polling Data**: Various Nepal media outlets

## Key Features Explained

### Election Simulator

Uses the **Sainte-Laguë method** (divisor: 1, 3, 5, 7...) for proportional representation seat allocation, matching Nepal's electoral system. Supports:
- Separate FPTP and PR vote adjustments
- Constituency-level overrides
- Alliance/coalition simulations
- Vote transfer matrices

### Demographic Forecasting

Incorporates demographic patterns (age groups, urban/rural, provincial, literacy levels) for constituency-level predictions with scenario-based modeling.

### Interactive Maps

Two map implementations:
- **SVG Map** (NepalMap.jsx) - Lightweight, fast rendering
- **Leaflet Map** (ConstituencyMap.jsx) - Full GIS features, zoomable

## Contributing

Contributions welcome! Please ensure:
- Code follows existing patterns
- ESLint passes (`npm run lint`)
- Build succeeds (`npm run build`)
- Test on multiple pages before committing

## License

[Add your license here]

## Acknowledgments

- Election Commission of Nepal for official results
- Nepal census data contributors
- OpenStreetMap contributors for geographic data
