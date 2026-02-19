# 2017 Election Data Status

## Summary

- **Total Constituencies**: 165
- **Complete Data**: 24 constituencies (14.5%)
- **Remaining**: 141 constituencies (85.5%)

## Available Data (24 Constituencies)

### Province 1: Koshi (11 constituencies)

- Jhapa-1, Jhapa-2, Jhapa-3, Jhapa-4, Jhapa-5
- Morang-1, Morang-2, Morang-3
- Sunsari-1, Sunsari-2, Sunsari-3

### Province 2: Madhesh (0 constituencies)

- None

### Province 3: Bagmati (13 constituencies)

- Chitwan-1, Chitwan-2, Chitwan-3
- Kathmandu-1, Kathmandu-2, Kathmandu-3, Kathmandu-4
- Lalitpur-1, Lalitpur-2, Lalitpur-3
- Bhaktapur-1, Bhaktapur-2
- Makwanpur-1

### Province 4: Gandaki (0 constituencies)

- None

### Province 5: Lumbini (0 constituencies)

- None

### Province 6: Karnali (0 constituencies)

- None

### Province 7: Sudurpashchim (0 constituencies)

- None

## Data Sources for Remaining Constituencies

### Option 1: Wikipedia (Recommended)

Each constituency has a Wikipedia page with 2017 results:

- Format: `https://en.wikipedia.org/wiki/[District]_[Number]_(constituency)`
- Example: https://en.wikipedia.org/wiki/Kathmandu_1_(constituency)

### Option 2: Election Commission Nepal PDF

- URL: https://www.election.gov.np/ecn/uploads/userfiles/ElectionResultBook/HoR2074.pdf
- Size: ~10 MB
- Contains complete results for all 165 constituencies
- Requires PDF parsing

### Option 3: Nepal Research

- Website: https://nepalresearch.org/
- Has historical election data

## Next Steps

1. **Immediate**: Use existing 24 constituencies for development/testing
2. **Short-term**: Manually add high-priority constituencies (Kathmandu, major cities)
3. **Long-term**: Complete data entry for all 141 remaining constituencies

## Files Generated

### 2022 Data (Complete)

- `province1_koshi.js` (28 constituencies)
- `province2_madhesh.js` (32 constituencies)
- `province3_bagmati.js` (33 constituencies)
- `province4_gandaki.js` (18 constituencies)
- `province5_lumbini.js` (26 constituencies)
- `province6_karnali.js` (12 constituencies)
- `province7_sudurpashchim.js` (16 constituencies)
- `index.js` (aggregator)

### 2017 Data (Partial)

- `province1_koshi.js` (11 constituencies)
- `province2_madhesh.js` (0 constituencies)
- `province3_bagmati.js` (13 constituencies)
- `province4_gandaki.js` (0 constituencies)
- `province5_lumbini.js` (0 constituencies)
- `province6_karnali.js` (0 constituencies)
- `province7_sudurpashchim.js` (0 constituencies)
- `index.js` (aggregator)

## Recommendation

For production use, prioritize completing the 2017 data by:

1. Using the ECN PDF (most reliable source)
2. Extracting data using PDF parsing tools
3. Or manual data entry from Wikipedia for critical constituencies
