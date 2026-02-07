#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Search for existing 2017 Nepal election datasets online
"""

import re
import requests

def search_github():
    """Search GitHub for 2017 Nepal election data"""
    print("Searching GitHub...")
    queries = [
        "nepal 2017 election csv",
        "nepal 2017 election data",
        "nepal general election 2017 results",
        "2017 Nepal election constituency",
    ]

    for query in queries:
        print(f"  Query: {query}")
        # Note: Would need GitHub API access for proper search

def search_direct_sources():
    """Try direct source URLs"""
    print("\nChecking direct sources...")
    sources = [
        {
            'name': 'Election Commission Nepal',
            'url': 'https://result.election.gov.np/',
            'note': 'Check for historical results/download section'
        },
        {
            'name': 'Carter Center',
            'url': 'https://www.cartercenter.org/resources/peace/election-observations/',
            'note': 'Look for Nepal 2017 election reports'
        },
        {
            'name': 'Kathmandu Post',
            'url': 'https://kathmandupost.com/',
            'note': 'Search for 2017 election data'
        },
        {
            'name': 'IPU Parline',
            'url': 'https://archive.ipu.org/parline/',
            'note': 'Database of parliamentary elections'
        },
    ]

    for source in sources:
        print(f"\n{source['name']}: {source['url']}")
        print(f"  Note: {source['note']}")

def main():
    print("=" * 80)
    print("2017 Nepal Election Dataset Search")
    print("=" * 80)
    print()
    print("This script searches for existing datasets to avoid manual data entry.")
    print()
    search_github()
    search_direct_sources()
    print()
    print("=" * 80)
    print("\nNEXT STEPS:")
    print("1. Manually check the sources listed above")
    print("2. If found, download CSV/Excel files")
    print("3. Populate data/2017_HOR.csv with the data")
    print("4. Format should match 2022_HOR.csv structure")
    print("5. Test integration with website")
    print()
    print("EXPECTED FILE STRUCTURE:")
    print("- CSV with headers: CandidateName, Gender, Age, PartyID, SymbolID,")
    print("  SymbolName, CandidateID, StateName, PoliticalPartyName,")
    print("  ElectionPost, DistrictCd, DistrictName, State, SCConstID,")
    print("  CenterConstID, SerialNo, TotalVoteReceived, CastedVote,")
    print("  TotalVoters, Rank, Remarks, Samudaya, DOB, CTZDIST,")
    print("  FATHER_NAME, SPOUCE_NAME, QUALIFICATION, EXPERIENCE,")
    print("  OTHERDETAILS, NAMEOFINST, ADDRESS")
    print()
    print("- One row per candidate per constituency")
    print("- Multiple rows per constituency (one for each candidate)")
    print("- ~500-700 total rows expected (165 constituencies × 3-4 candidates)")

if __name__ == "__main__":
    main()
