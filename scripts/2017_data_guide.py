#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2017 Nepal Election - Documentation and Next Steps Guide
This file documents what needs to be done to display 2017 election data
"""

PARTY_MAPPING = {
    # Current party IDs (from data/constituencies.js)
    'NC': 'Nepali Congress',
    'UML': 'CPN-UML',
    'Maoist': 'CPN-Maoist Centre',
    'RPP': 'Rastriya Prajatantra Party',
    'JSPN': 'Rastriya Janata Party Nepal',
    'LSP': 'Loktantrik Samajbadi Party',

    # 2017 party names (may need to be mapped)
    'Rastriya Janata Party Nepal': 'RJPN',  # Later became JSPN
    'Federal Socialist Forum, Nepal': 'FSFN', # Later merged
}

def main():
    print("=" * 80)
    print("2017 Nepal Election Data - Implementation Guide")
    print("=" * 80)
    print()
    print("DATA REQUIREMENTS:")
    print("1. Constituency-level results for 165 constituencies")
    print("2. Fields: Candidate name, party, votes, winner, etc.")
    print()
    print("DATA SOURCES TO CHECK:")
    print("1. Election Commission Nepal (result.election.gov.np)")
    print("   - Look for: Historical results archive, downloadable CSV/Excel")
    print()
    print("2. Carter Center (www.cartercenter.org)")
    print("   - Look for: Final report PDFs with constituency breakdown")
    print()
    print("3. Wikipedia District Pages")
    print("   - Check: Each district may have constituency-specific results")
    print("   - Pattern: wiki/[District_name]_(constituency)")
    print()
    print("4. IPU Parline (archive.ipu.org)")
    print("   - Look for: Nepal parliamentary election database")
    print()
    print("IMPLEMENTATION APPROACHES:")
    print()
    print("OPTION A - Find existing dataset:")
    print("  - Search GitHub/online for: '2017 Nepal election CSV'")
    print("  - Check if someone has already compiled this data")
    print()
    print("OPTION B - Scrape from ECN:")
    print("  - Download historical results if available")
    print("  - Parse HTML pages for each constituency")
    print("  - May need: Nepali language support")
    print()
    print("OPTION C - Manual compilation:")
    print("  - Use known sources to compile constituency-by-constituency results")
    print("  - Reference: 2022_HOR.csv format for field structure")
    print("  - Start with major districts, work through all 165")
    print()
    print("FILE STRUCTURE (matching 2022_HOR.csv):")
    print("  - 165 rows (one per constituency × multiple candidates)")
    print("  - Columns: CandidateName, Gender, Age, PartyID, SymbolID,")
    print("    SymbolName, CandidateID, StateName, PoliticalPartyName,")
    print("    ElectionPost, DistrictCd, DistrictName, State,")
    print("    SCConstID, CenterConstID, SerialNo, TotalVoteReceived,")
    print("    CastedVote, TotalVoters, Rank, Remarks, etc.")
    print()
    print("NEXT STEPS TO DISPLAY 2017 DATA:")
    print("1. Create data/2017_HOR.csv with constituency results")
    print("2. Generate 2017 constituencies array in data/constituencies.js")
    print("3. Add winner2017 and results2017 fields to each constituency")
    print("4. Update historicalConstituencies.js with 2017 functions")
    print("5. Test website displays 2017 election correctly")
    print()
    print("=" * 80)

if __name__ == "__main__":
    main()
