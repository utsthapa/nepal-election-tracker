#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scrape all 2017 Nepal election constituency results from Wikipedia
This script will fetch all 165 constituencies and extract 2017 FPTP results
"""

import re
import csv
import requests
from bs4 import BeautifulSoup

# Party ID mapping based on data/constituencies.js
PARTY_ID_MAP = {
    'Nepali Congress': 0,
    'Nepali Congress (NC)': 0,
    'NC': 0,
    'CPN (UML)': 1,
    'CPN (Unified Marxist–Leninist)': 1,
    'Communist Party of Nepal (Unified Marxist–Leninist)': 1,
    'CPN-Maoist Centre': 2,
    'CPN (Maoist Centre)': 2,
    'Communist Party of Nepal (Maoist Centre)': 2,
    'Federal Socialist Forum, Nepal': 4,
    'Federal Socialist Forum Nepal': 4,
    'Sanghiya Loktantrik Rastriya Manch': 5,
    'Rastriya Swatantra Party': 6,
    'Rastriya Prajatantra Party Nepal': 7,
    'Janamat Party': 8,
}

# Province and district mapping
PROVINCE_MAP = {
    'Koshi Province': 1,
    'Madhesh Province': 2,
    'Bagmati Province': 3,
    'Gandaki Province': 4,
    'Lumbini Province': 5,
    'Karnali Province': 6,
    'Sudurpashchim Province': 7,
}

DISTRICT_MAP = {
    'Jhapa District': '1',
    'Morang District': '2',
    'Sunsari District': '3',
    'Chitwan District': '4',
    'Kathmandu District': '5',
    # Add all 77 districts...
}

def fetch_constituency_results(url):
    """Fetch 2017 election results from a constituency page"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the 2017 legislative election section
        # Look for: "#### 2017 legislative elections"
        results = []
        found_2017 = False
        
        # Parse the page for 2017 results
        # This is simplified - in production, need more robust parsing
        for heading in soup.find_all('h4'):
            if '2017 legislative elections' in heading.get_text():
                found_2017 = True
                # Get the next table
                table = heading.find_next('table')
                if table:
                    rows = table.find_all('tr')
                    for row in rows[1:]:  # Skip header
                        cols = row.find_all(['td', 'th'])
                        if len(cols) >= 2:
                            party_link = cols[0].find('a')
                            party = party_link.get_text().strip() if party_link else cols[0].get_text().strip()
                            candidate_link = cols[1].find('a')
                            candidate = candidate_link.get_text().strip() if candidate_link else cols[1].get_text().strip()
                            if len(cols) >= 3:
                                votes = cols[2].get_text().strip().replace(',', '')
                                
                                results.append({
                                    'party': party,
                                    'candidate': candidate,
                                    'votes': votes,
                                })
        
        if not found_2017:
            # Try alternative parsing
            pass
            
        return results
        
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def get_all_constituencies():
    """Get list of all 165 constituencies"""
    # Start from the 1st Federal Parliament page
    base_url = "https://en.wikipedia.org/wiki/1st_Federal_Parliament_of_Nepal"
    
    # This is a placeholder - in production, need to properly parse the page
    # to extract all constituency links
    constituencies = []
    
    # Known constituencies from the template
    known_constituencies = [
        ('Jhapa_1', 'Koshi Province', 'Jhapa District', 1),
        ('Jhapa_2', 'Koshi Province', 'Jhapa District', 2),
        ('Jhapa_3', 'Koshi Province', 'Jhapa District', 3),
        ('Jhapa_4', 'Koshi Province', 'Jhapa District', 4),
        ('Jhapa_5', 'Koshi Province', 'Jhapa District', 5),
        # Need all 165 constituencies here
    ]
    
    return known_constituencies

def main():
    print("=" * 80)
    print("Scraping 2017 Nepal Election Constituency Results")
    print("=" * 80)
    print()
    
    constituencies = get_all_constituencies()
    print(f"Found {len(constituencies)} constituencies")
    print()
    
    # For demo, fetch a few known constituencies
    demo_urls = [
        'https://en.wikipedia.org/wiki/Jhapa_5_(constituency)',
        'https://en.wikipedia.org/wiki/Chitwan_2_(constituency)',
        'https://en.wikipedia.org/wiki/Kathmandu_1_(constituency)',
    ]
    
    all_results = []
    
    for url in demo_urls:
        print(f"Fetching: {url}")
        results = fetch_constituency_results(url)
        all_results.extend(results)
        print(f"  Found {len(results)} candidates")
        print()
    
    # Write to CSV
    if all_results:
        with open('data/2017_HOR_scraped.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            # Write header matching 2022_HOR.csv format
            writer.writerow([
                'CandidateName', 'Gender', 'Age', 'PartyID', 'SymbolID', 'SymbolName',
                'CandidateID', 'StateName', 'PoliticalPartyName', 'ElectionPost',
                'DistrictCd', 'DistrictName', 'State', 'SCConstID', 'CenterConstID',
                'SerialNo', 'TotalVoteReceived', 'CastedVote', 'TotalVoters', 'Rank', 'Remarks'
            ])
            
            # Write data
            for i, result in enumerate(all_results):
                party_id = PARTY_ID_MAP.get(result['party'], 999)
                
                writer.writerow([
                    result['candidate'],  # CandidateName
                    '',  # Gender
                    '',  # Age
                    party_id,  # PartyID
                    '',  # SymbolID
                    '',  # SymbolName
                    '',  # CandidateID
                    '',  # StateName
                    result['party'],  # PoliticalPartyName
                    '1',  # ElectionPost (1 = FPTP HOR)
                    '',  # DistrictCd
                    '',  # DistrictName
                    '',  # State
                    '',  # SCConstID
                    '',  # CenterConstID
                    '',  # SerialNo
                    result['votes'],  # TotalVoteReceived
                    '',  # CastedVote
                    '',  # TotalVoters
                    '1' if i == 0 else '2',  # Rank (1 = winner)
                    'Elected' if i == 0 else '',  # Remarks
                ])
        
        print(f"Wrote {len(all_results)} candidates to data/2017_HOR_scraped.csv")
    
    print()
    print("=" * 80)
    print("NEXT STEPS:")
    print("1. Parse all 165 constituency pages from Wikipedia")
    print("2. Extract candidate details (age, gender, etc.)")
    print("3. Map to correct district codes and IDs")
    print("4. Import into data/constituencies.js")
    print("=" * 80)

if __name__ == "__main__":
    main()
