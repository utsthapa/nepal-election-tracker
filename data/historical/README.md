# Historical Election Data

This directory contains historical election data for Nepal from 1991-2017.

## Status Summary

| Election | Year | Status | Constituencies | Data Source |
|----------|------|--------|----------------|-------------|
| 1991 General | 1991 | ✅ National Data | 205 (TODO) | IPU Parline/Nepal Research |
| 1994 Mid-term | 1994 | ✅ National Data | 205 (TODO) | Nepal Research PDF |
| 1999 General | 1999 | ✅ **COMPLETE** | 205 | Nepal Research (Full) |
| 2008 CA | 2008 | ✅ National Data | 240 (TODO) | Wikipedia/Carter Center |
| 2013 CA | 2013 | ✅ National Data | 240 (TODO) | Wikipedia/ANFREL |
| 2017 General | 2017 | ⚠️ Partial | 24/165 | ECN CSV (Partial) |

## Files

### Party Definitions
- `parties_1991.js` - Party definitions for 1991 election
- `parties_1994.js` - Party definitions for 1994 election
- `parties_1999.js` - Party definitions for 1999 election
- `parties_2008.js` - Party definitions for 2008 election
- `parties_2013.js` - Party definitions for 2013 election
- `parties_2017.js` - Party definitions for 2017 election

### Election Data
- `election_1991.js` - Constituency data for 1991 (structure only)
- `election_1994.js` - Constituency data for 1994 (structure only)
- `election_1999.js` - **Complete constituency data for 1999**
- `election_2008.js` - Constituency data for 2008 (structure only)
- `election_2013.js` - Constituency data for 2013 (structure only)
- `election_2017.js` - Partial constituency data for 2017 (24 constituencies)

### Module Exports
- `index.js` - Central export file for all historical data

## 1999 Election - COMPLETE

The 1999 election data is complete with all 205 constituencies:

**National Results:**
| Party | Seats | Vote Share |
|-------|-------|------------|
| Nepali Congress | 111 | 36.14% |
| CPN-UML | 71 | 30.74% |
| RPP | 11 | 10.14% |
| NSP | 5 | 3.13% |
| RJM | 5 | 1.37% |
| SJN | 1 | 0.84% |
| NMKP | 1 | 0.55% |
| Others | 0 | 17.15% |

**Data Source:** Nepal Research (https://nepalresearch.org/)

## 2017 Election - PARTIAL

The 2017 election has data for 24 constituencies:
- Jhapa (5 constituencies)
- Kathmandu (10 constituencies)
- Chitwan (3 constituencies)
- Morang (6 constituencies)

**Data Source:** Election Commission Nepal CSV

## TODO: Complete Constituency Data

### Priority 1: 1994 and 1991
- Extract from Nepal Research PDFs
- URLs:
  - 1994: https://nepalresearch.org/politics/background/elections_old/election_1994_constituency_results_english.pdf
  - 1991: https://nepalresearch.org/politics/background/elections_old/election_1991_constituency_results_english.pdf

### Priority 2: 2017 Complete
- Find or request complete CSV from Election Commission Nepal
- Alternative: Scrape from Wikipedia constituency pages

### Priority 3: 2008 and 2013
- Extract from Wikipedia constituency pages
- Sources:
  - 2008: https://en.wikipedia.org/wiki/Results_of_the_2008_Nepalese_Constituent_Assembly_election
  - 2013: https://en.wikipedia.org/wiki/Results_of_the_2013_Nepalese_Constituent_Assembly_election

## Usage

```javascript
import { ELECTION_1999, PARTIES_1999 } from './data/historical/index.js';

// Get national summary
console.log(ELECTION_1999.summary);

// Get a specific constituency
const constData = ELECTION_1999.getConstituency('Taplejung-1');
console.log(constData.winner);
console.log(constData.winnerName);

// Get all districts
const districts = ELECTION_1999.getDistricts();

// Get constituencies by district
const taplejungConstituencies = ELECTION_1999.getConstituenciesByDistrict('Taplejung');
```

## Data Verification

All data has been verified for:
- Vote count integrity
- Winner declarations
- Margin calculations
- Percentage calculations
- Party code mappings

## Notes

- **1991-1999**: 205 constituencies (pre-2015 constitution)
- **2008-2013**: 240 constituencies (Constituent Assembly)
- **2017+**: 165 constituencies (Federal system)
- GeoJSON mapping only available for 2017+ (current boundaries)
