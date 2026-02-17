#!/usr/bin/env python3
"""Extract constituency-level election data from 2008 Nepalese Constituent Assembly election"""

import re
import json

# Read the HTML file
with open('/home/lbikr/.local/share/kilo/tool-output/tool_c5fa6694f00153muTpfcXhDrg5', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the section with party members (up to party changes)
section_start = html.find('List of members elected by party')
party_changes_pos = html.find('id="Party_changes_or_defections"')

# Only process up to party changes section
section_html = html[section_start:party_changes_pos]

table_pattern = r'<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)</table>'
tables = re.findall(table_pattern, section_html, re.DOTALL)

results = []

# Process main tables
for table in tables[1:]:
    party_match = re.search(r'<th[^>]*colspan="2"[^>]*>([^<]+)</th>', table)
    if not party_match:
        continue
    
    party_name = party_match.group(1).strip()
    
    if 'Directly elected' not in table:
        continue
    
    row_pattern = r'<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>'
    rows = re.findall(row_pattern, table, re.DOTALL)
    
    for const_cell, member_cell in rows:
        const_link_match = re.search(r'<a[^>]*>([^<]+)</a>', const_cell)
        if const_link_match:
            constituency = const_link_match.group(1).strip()
        else:
            constituency = const_cell.strip()
        
        constituency = re.sub(r'\s+', ' ', constituency).strip()
        
        # Fix known typos
        if constituency == 'Balung 2':
            constituency = 'Baglung 2'
        if constituency == 'Dhadhing 3':
            constituency = 'Dhading 3'
        
        member_link_match = re.search(r'<a[^>]*>([^<]+)</a>', member_cell)
        if member_link_match:
            member = member_link_match.group(1).strip()
        else:
            member = member_cell.strip()
        
        member = re.sub(r'\[\d+\]', '', member).strip()
        member = re.sub(r'\s+', ' ', member).strip()
        
        if re.match(r'^[A-Za-z]+\s+\d+$', constituency):
            results.append({
                'constituency': constituency,
                'winner': member,
                'party': party_name
            })

# Add the 3 missing constituencies from party changes section
# These were originally elected in 2008 but later changed parties
party_changes_pos = html.find('id="Party_changes_or_defections"')
by_elections_pos = html.find('id="By-elections_or_replacements"')
party_changes_html = html[party_changes_pos:by_elections_pos]

# Manually add the missing 4 constituencies based on the party changes table
# These were originally elected in 2008 but later changed parties or died
missing_data = [
    {
        'constituency': 'Dhanusha 6',
        'winner': 'Ram Kumari Devi Yadav',
        'party': 'Communist Party of Nepal (Marxist–Leninist) (2002)'
    },
    {
        'constituency': 'Mahottari 4',
        'winner': 'Ram Kumar Sharma',
        'party': 'Terai Madhesh Loktantrik Party'
    },
    {
        'constituency': 'Sankhuwasabha 2',
        'winner': 'Dambar Bahadur Khadka',
        'party': 'CPN (Unified Marxist–Leninist)'
    },
    {
        'constituency': 'Saptari 2',
        'winner': 'Jay Prakash Gupta',
        'party': 'Madheshi Jana Adhikar Forum (Republican)'
    }
]

for item in missing_data:
    results.append(item)

# Remove duplicates while preserving order
seen = set()
unique_results = []
for r in results:
    key = r['constituency']
    if key not in seen:
        seen.add(key)
        unique_results.append(r)

# Sort by constituency name
unique_results.sort(key=lambda x: x['constituency'])

print(f"Total constituencies: {len(unique_results)}")

# Verify we have 240
if len(unique_results) != 240:
    print(f"WARNING: Expected 240 constituencies, got {len(unique_results)}")

# Save to file
with open('/home/lbikr/projects/nepalpoltiics/constituency_results_2008.json', 'w') as f:
    json.dump(unique_results, f, indent=2, ensure_ascii=False)

print(f"Saved to constituency_results_2008.json")

# Print summary by party
party_counts = {}
for r in unique_results:
    party = r['party']
    party_counts[party] = party_counts.get(party, 0) + 1

print("\nConstituencies by party:")
for party, count in sorted(party_counts.items(), key=lambda x: -x[1]):
    print(f"  {party}: {count}")
