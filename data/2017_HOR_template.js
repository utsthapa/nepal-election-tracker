// 2017 Nepal Election - Constituency Level Results
// This file should be populated with detailed constituency-by-constituency results
// Same format as data/2022_HOR.csv

// FIELDS NEEDED:
// - CandidateName (string): Full name of candidate in Nepali
// - Gender (string): पुरुष or महिला
// - Age (number): Age of candidate
// - PartyID (number): Party code matching PARTIES in constituencies.js
// - SymbolID (number): Election symbol ID
// - SymbolName (string): Name of election symbol
// - CandidateID (number): Candidate ID
// - StateName (string): Province name (प्रदेश)
// - PoliticalPartyName (string): Full party name in Nepali
// - ElectionPost (number): Election post type (1 = FPTP HOR)
// - DistrictCd (number): District code
// - DistrictName (string): District name
// - State (number): Province number (1-7)
// - SCConstID (number): State/Constituency ID
// - CenterConstID (number): Center/Constituency ID
// - SerialNo (number): Serial number of candidate in constituency
// - TotalVoteReceived (number): Total votes received
// - CastedVote (number): Total votes cast in constituency
// - TotalVoters (number): Total registered voters in constituency
// - Rank (number): 1 = Winner, 2+ = Losers
// - Remarks (string): Elected/Not Elected
// - Samudaya (string): Community (if available)
// - DOB (string): Date of birth (YYYY.MM.DD)
// - CTZDIST (string): Citizenship district
// - FATHER_NAME (string): Father's name
// - SPOUCE_NAME (string): Spouse's name
// - QUALIFICATION (string): Education qualification
// - EXPERIENCE (string): Previous experience
// - OTHERDETAILS (string): Other details
// - NAMEOFINST (string): Name of institution
// - ADDRESS (string): Candidate address

// Party ID Mapping (must match data/constituencies.js PARTIES):
// 0 = Nepali Congress (NC)
// 1 = CPN-UML (UML)
// 2 = CPN-Maoist Centre (Maoist)
// 3 = Rastriya Janata Party Nepal (RJPN)
// 4 = Federal Socialist Forum, Nepal (FSFN)
// Other IDs as needed for independent candidates

// DATA SOURCES TO CHECK:
// 1. Election Commission Nepal Archive: http://result.election.gov.np/ (Historical results)
// 2. Wikipedia: Check for constituency-specific pages
// 3. Carter Center reports: https://www.cartercenter.org/ (PDF reports with constituency results)
// 4. IPU Parline: https://archive.ipu.org/parline/ (Database of parliamentary elections)

// NOTES:
// - Total constituencies: 165 (same boundaries as 2022)
// - Parties to map: RJPN→RJPN, FSFN→JSPN or FSFN (merged later)
// - Date: 26 Nov 2017 (Phase 1) & 7 Dec 2017 (Phase 2)

// SAMPLE HEADER (same as 2022_HOR.csv):
// CandidateName,Gender,Age,PartyID,SymbolID,SymbolName,CandidateID,StateName,PoliticalPartyName,ElectionPost,DistrictCd,DistrictName,State,SCConstID,CenterConstID,SerialNo,TotalVoteReceived,CastedVote,TotalVoters,Rank,Remarks,Samudaya,DOB,CTZDIST,FATHER_NAME,SPOUCE_NAME,QUALIFICATION,EXPERIENCE,OTHERDETAILS,NAMEOFINST,ADDRESS

// TODO: Populate this CSV file with constituency-level results
// Then use it to generate data/constituencies.js with 2017 data

console.log('TODO: Scrape Election Commission Nepal archives for 2017 constituency results');
console.log('TODO: Parse and validate data format');
console.log('TODO: Map historical party names to current party codes');
console.log('TODO: Generate JavaScript export for use in website');
