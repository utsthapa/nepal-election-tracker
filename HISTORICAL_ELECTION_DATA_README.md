# Historical Election Data Implementation

## Status
✅ **COMPLETED:**
- Infrastructure created for historical election data
- `data/historicalConstituencies.js` updated with 2017 structure
- `data/2017_HOR_template.js` created with documentation
- `data/2017_HOR_sample.csv` created (sample data for testing)
- Search scripts created to find existing datasets
- Party mapping documented (2017 party names → current IDs)

⏳ **IN PROGRESS:**
- Need to find and download 2017 constituency-level data from:
  1. Election Commission Nepal (result.election.gov.np) - Historical results
  2. Carter Center (www.cartercenter.org) - 2017 election reports
  3. Wikipedia - District/constituency pages
  4. IPU Parline (archive.ipu.org) - Parliamentary database

❌ **NOT STARTED:**
- Scraping 2017 data from ECN/Wikipedia (requires substantial work)
- Populating full 2017_HOR.csv with 165 constituencies × candidates
- Testing 2017 election display on website

## Data Requirements

### 2017 Election
- **Constituencies:** 165 (same boundaries as 2022)
- **Fields needed:** Same format as 2022_HOR.csv
- **Expected rows:** ~500-700 (165 constituencies × 3-4 candidates each)

### CSV Format
```
CandidateName,Gender,Age,PartyID,SymbolID,SymbolName,CandidateID,StateName,
PoliticalPartyName,ElectionPost,DistrictCd,DistrictName,State,SCConstID,CenterConstID,
SerialNo,TotalVoteReceived,CastedVote,TotalVoters,Rank,Remarks,Samudaya,DOB,
CTZDIST,FATHER_NAME,SPOUCE_NAME,QUALIFICATION,EXPERIENCE,OTHERDETAILS,NAMEOFINST,ADDRESS
```

### Party ID Mapping (2017 → Current)
| 2017 Party | Current Party ID |
|---------------|----------------|
| Nepali Congress | 0 (NC) |
| CPN-UML | 1 (UML) |
| CPN-Maoist Centre | 2 (Maoist) |
| Rastriya Janata Party Nepal | 3 → JSPN |
| Federal Socialist Forum, Nepal | 4 → FSFN/JSPN |

## Next Steps

### Step 1: Find Data Source
**Priority: HIGH**
Search the following sources for downloadable 2017 election data:
1. **Election Commission Nepal Archive**
   - URL: https://result.election.gov.np/
   - Look for: Historical results, downloadable CSV/Excel files
   - Note: Website is in Nepali, may need translation

2. **Carter Center Reports**
   - URL: https://www.cartercenter.org/resources/peace/election-observations/
   - Look for: Nepal 2017 election final report PDF
   - May contain: Constituency-level results

3. **IPU Parline Database**
   - URL: https://archive.ipu.org/parline/
   - Database of: Parliamentary elections worldwide
   - May have: Detailed Nepal election data

4. **Wikipedia District Pages**
   - Pattern: `https://en.wikipedia.org/wiki/[District_name]_(constituency)`
   - Check: Each of Nepal's 77 districts for constituency pages
   - Example: https://en.wikipedia.org/wiki/Jhapa_(constituency)

### Step 2: Download and Populate CSV
**Priority: HIGH**
Once data source found:
1. Download CSV/Excel file from source
2. Parse and clean data
3. Map party names to current Party IDs
4. Convert to CSV format matching 2022_HOR.csv
5. Save to: `data/2017_HOR.csv`

### Step 3: Create JS Loader
**Priority: MEDIUM**
Create script to:
1. Import 2017_HOR.csv
2. Group by constituency (combine all candidates for each constituency)
3. Identify winner (Rank = 1)
4. Create array of constituency objects with:
   - winner2017 (party ID)
   - results2017 (array of {party, votes, candidate})
5. Export to JS file for import in historicalConstituencies.js

### Step 4: Update Website Integration
**Priority: HIGH**
Once 2017 data is available:
1. Import 2017_HOR.csv into `data/constituencies.js`
2. Add winner2017 and results2017 to each constituency
3. Update `data/historicalConstituencies.js` to properly load 2017 data
4. Test YearSelector shows 2017 option
5. Verify map displays correct colors for 2017 results

## Files Created
- `data/historicalConstituencies.js` - Updated with 2017 structure
- `data/2017_HOR_template.js` - Documentation and field list
- `data/2017_HOR_sample.csv` - Sample data (3 constituencies, 9 candidates)
- `scripts/2017_data_guide.py` - Guide and next steps
- `scripts/search_2017_datasets.py` - Search script for datasets

## Challenges
1. **Party Name Mapping:** 2017 had RJPN, FSFN which later became JSPN, etc.
2. **Website Language:** ECN site is in Nepali, may need translation or alternative source
3. **Data Format:** Converting between different formats (Excel, PDF, HTML) to CSV
4. **Volume:** 165 constituencies × multiple candidates = ~500-700 rows to process

## Estimated Time
- **Finding data source:** 2-4 hours
- **Downloading and parsing:** 1-2 hours
- **Data cleaning and mapping:** 2-4 hours
- **Creating JS loader:** 1-2 hours
- **Testing integration:** 1 hour

**Total estimated time: 6-13 hours** for full implementation
