#!/usr/bin/env python3
"""Extract constituency-level election data from 2008 Nepalese Constituent Assembly election"""

from bs4 import BeautifulSoup
import json
import re

# Read the HTML file
with open('/home/lbikr/.local/share/kilo/tool-output/tool_c5fa6694f00153muTpfcXhDrg5', 'r', encoding='utf-8') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Find all tables in the document
tables = soup.find_all('table', {'class': 'wikitable'})

results = []

# Process each table
for table in tables:
    # Get the preceding heading to determine party
    prev_heading = table.find_previous(['h3', 'h4'])
    party_name = None
    if prev_heading:
        # Extract party name from heading
        heading_text = prev_heading.get_text(strip=True)
        # Remove "[edit]" if present
        heading_text = re.sub(r'\[edit\]', '', heading_text).strip()
        party_name = heading_text
    
    # Get all rows
    rows = table.find_all('tr')
    
    for row in rows:
        cells = row.find_all(['td', 'th'])
        if len(cells) >= 2:
            # Check if first cell contains a constituency link or text
            first_cell = cells[0]
            text = first_cell.get_text(strip=True)
            
            # Look for constituency pattern (e.g., "Jhapa 1", "Kathmandu 1")
            constituency_match = re.match(r'^([A-Za-z]+\s+\d+)', text)
            
            if constituency_match:
                constituency = constituency_match.group(1)
                
                # Get winner name - usually in the second cell
                if len(cells) >= 2:
                    winner_cell = cells[1]
                    # Get the text, removing any references like [1], [2], etc.
                    winner_text = winner_cell.get_text(strip=True)
                    winner = re.sub(r'\[\d+\]', '', winner_text).strip()
                    
                    # Determine party - check if there's a party column or use section heading
                    party = party_name
                    if len(cells) >= 3:
                        party_cell = cells[2]
                        party_text = party_cell.get_text(strip=True)
                        if party_text and party_text not in ['', ' ']:
                            party = re.sub(r'\[\d+\]', '', party_text).strip()
                    
                    if constituency and winner and party:
                        results.append({
                            'constituency': constituency,
                            'winner': winner,
                            'party': party
                        })

# Remove duplicates while preserving order
seen = set()
unique_results = []
for r in results:
    key = (r['constituency'], r['winner'])
    if key not in seen:
        seen.add(key)
        unique_results.append(r)

print(f"Total records found: {len(unique_results)}")
print(json.dumps(unique_results, indent=2, ensure_ascii=False))
