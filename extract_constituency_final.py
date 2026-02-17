#!/usr/bin/env python3
"""Extract constituency-level election data from 2008 Nepalese Constituent Assembly election"""

import re
import json

# Read the HTML file
with open('/home/lbikr/.local/share/kilo/tool-output/tool_c5fa6694f00153muTpfcXhDrg5', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the section with party members
section_start = html.find('List of members elected by party')
section_html = html[section_start:section_start + 900000]

# Find all tables in this section
table_pattern = r'<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)</table>'
tables = re.findall(table_pattern, section_html, re.DOTALL)

results = []

# Skip the first summary table (index 0)
for table in tables[1:]:
    # Extract party name from the first header row
    party_match = re.search(r'<th[^>]*colspan="2"[^>]*>([^<]+)</th>', table)
    if not party_match:
        continue
    
    party_name = party_match.group(1).strip()
    
    # Skip tables that don't have "Directly elected" section
    if 'Directly elected' not in table:
        continue
    
    # Extract all constituency-member pairs from the table
    row_pattern = r'<td[^>]*>(.*?)</td>\s*<td[^>]*>(.*?)</td>'
    rows = re.findall(row_pattern, table, re.DOTALL)
    
    for const_cell, member_cell in rows:
        # Extract constituency name
        # It might be a link: <a href="...">Name</a> or plain text
        const_link_match = re.search(r'<a[^>]*>([^<]+)</a>', const_cell)
        if const_link_match:
            constituency = const_link_match.group(1).strip()
        else:
            constituency = const_cell.strip()
        
        # Clean up constituency name
        constituency = re.sub(r'\s+', ' ', constituency).strip()
        
        # Fix known typos in Wikipedia data
        if constituency == 'Balung 2':
            constituency = 'Baglung 2'
        
        # Extract member name
        member_link_match = re.search(r'<a[^>]*>([^<]+)</a>', member_cell)
        if member_link_match:
            member = member_link_match.group(1).strip()
        else:
            member = member_cell.strip()
        
        # Clean up member name - remove references like [1], [2], etc.
        member = re.sub(r'\[\d+\]', '', member).strip()
        member = re.sub(r'\s+', ' ', member).strip()
        
        # Validate constituency format (should be "Name Number")
        if re.match(r'^[A-Za-z]+\s+\d+$', constituency):
            results.append({
                'constituency': constituency,
                'winner': member,
                'party': party_name
            })

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

print(f"Total constituencies found: {len(unique_results)}")
print()
print(json.dumps(unique_results, indent=2, ensure_ascii=False))
