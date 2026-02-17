#!/usr/bin/env python3
"""Extract constituency-level election data from the 2013 Nepalese Constituent Assembly election."""

import json
import re

# Read the HTML file
with open('/home/lbikr/.local/share/kilo/tool-output/tool_c5fa674da001qwu3JFkDjupw8F', 'r', encoding='utf-8') as f:
    html_content = f.read()

constituency_results = []
seen_constituencies = set()

# Find all party sections with "Directly elected" subsection
# Pattern to match party header followed by Directly elected section
# Stop at Nominated, Proportional, Party list, or end of table
party_section_pattern = r'<th[^>]*colspan="2"[^>]*style="[^"]*background:[^"]*"[^>]*>\s*([^<]+)</th>.*?<th[^>]*colspan="2"[^>]*>\s*Directly elected\s*</th>(.*?)(?=(?:<th[^>]*colspan="2"[^>]*>\s*(?:Nominated|Proportional|Party list))|</table>)'

matches = re.findall(party_section_pattern, html_content, re.DOTALL)
print(f"Found {len(matches)} party sections with 'Directly elected'")

for party_name, section_content in matches:
    party_name = party_name.strip()
    # Clean up party name
    party_name = re.sub(r'\s+', ' ', party_name)
    
    # Find all constituency rows in this section
    # Pattern: <td>Constituency</td><td>Member</td>
    row_pattern = r'<td[^>]*>(?:<a[^>]*>)?\s*([A-Za-z]+\s+\d+)\s*(?:</a>)?\s*</td>\s*<td[^>]*>(?:<a[^>]*>)?\s*([^<]+?)\s*(?:</a>)?\s*</td>'
    
    rows = re.findall(row_pattern, section_content)
    
    print(f"Party: {party_name} - Found {len(rows)} constituencies")
    
    for constituency, member in rows:
        constituency = constituency.strip()
        member = member.strip()
        
        # Skip if we've already seen this constituency (keep first occurrence - original winner)
        if constituency in seen_constituencies:
            print(f"  Skipping duplicate: {constituency} ({member} from {party_name})")
            continue
        
        if constituency and member and len(constituency) < 50:
            seen_constituencies.add(constituency)
            constituency_results.append({
                'constituency': constituency,
                'winner': member,
                'party': party_name
            })

print(f"\nTotal: {len(constituency_results)} unique constituency results")

# Print summary by party
print("\nResults by party:")
party_counts = {}
for r in constituency_results:
    party_counts[r['party']] = party_counts.get(r['party'], 0) + 1
for party, count in sorted(party_counts.items(), key=lambda x: -x[1]):
    print(f"  {party}: {count}")

# Save to JSON
with open('/home/lbikr/projects/nepalpoltiics/constituency_results_2013.json', 'w', encoding='utf-8') as f:
    json.dump(constituency_results, f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(constituency_results)} results to constituency_results_2013.json")
