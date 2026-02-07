#!/usr/bin/env python3
"""Import 2017 Election Data into constituencies.js"""

import csv

# Party ID mapping
PARTY_ID_MAP = {
    'Nepali Congress': 0,
    'Nepali Congress (NC)': 0,
    'NC': 0,
    'CPN (UML)': 1,
    'CPN (Unified Marxist–Leninist)': 1,
    'CPN (Unified Marxist-Leninist)': 1,
    'Communist Party of Nepal (Unified Marxist–Leninist)': 1,
    'CPN-Maoist Centre': 2,
    'CPN (Maoist Centre)': 2,
    'Communist Party of Nepal (Maoist Centre)': 2,
    'Federal Socialist Forum, Nepal': 4,
    'Federal Socialist Forum Nepal': 4,
    'Sanghiya Loktantrik Rastriya Manch': 5,
    'Rastriya Swatantra Party': 6,
    'Rastriya Prajatantra Party Nepal': 7,
}

# Read 2017_HOR.csv
constituency_data_2017 = {}

print("Reading data/2017_HOR.csv...")
with open('data/2017_HOR.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        if row['CandidateName'].strip():
            candidate_id = row['CandidateID'].strip()
            
            # Extract constituency ID from CandidateID
            if candidate_id == '0':
                continue
            
            parts = candidate_id.split('_')
            if len(parts) == 2:
                province = int(parts[0])  # e.g., "1" = Koshi, "2" = Madhesh, etc.
                constituency_num = parts[1]
                const_id = f"{province}-{constituency_num}"
                
                party = row['PoliticalPartyName'].strip()
                party_id = PARTY_ID_MAP.get(party, 999)
                votes_str = row['TotalVoteReceived'].strip().replace(',', '').replace(' ', '')
                elected = row['Remarks'].strip() == 'Elected'
                candidate_name = row['CandidateName'].strip()
                district = row['DistrictName'].strip()
                
                if const_id not in constituency_data_2017:
                    constituency_data_2017[const_id] = {
                        'name': district,
                        'district': district,
                        'province': row['StateName'].strip(),
                        'seats': 28,
                        'totalVotes': 77071,
                        'candidates': []
                    }
                
                constituency_data_2017[const_id]['candidates'].append({
                    'candidate': candidate_name,
                    'party_id': party_id,
                    'votes': int(votes_str) if votes_str else 0,
                    'elected': elected,
                    'candidate_id': candidate_id,
                    'candidate_id': candidate_id,
                    candidate_id: candidate_id,
                    candidate_id: candidate_id,
                    candidate_id: candidate_id,
                })

print(f"Processed: {candidate_name} - {party} ({party_id}), {votes_str} ({votes_str})")
            
            else:
                pass

print(f"\nTotal constituencies with data: {len(constituency_data_2017)}")
print("=" * 80)

# Write to JS file
print("Writing to data/constituencies.js...")

# This is a placeholder - in production, update actual code in data/constituencies.js
print("\n// 2017 Election Data")
print(f"const constituencies_2017 = [\n")
