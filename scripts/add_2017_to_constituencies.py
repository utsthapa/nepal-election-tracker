import csv
import json
import re

# Read 2017 CSV and create a lookup dictionary
with open('data/2017_HOR.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    candidates = list(reader)

# Group candidates by constituency
constituency_data = {}

for row in candidates:
    district = row['DistrictName'].replace(' District', '')
    const_id = row['CenterConstID']
    const_key = (district, const_id)
    
    if const_key not in constituency_data:
        constituency_data[const_key] = {
            'candidates': []
        }
    
    # Parse party
    party_name = row['PoliticalPartyName']
    party_id = 'Others'
    
    if 'Nepali Congress' in party_name:
        party_id = 'NC'
    elif 'CPN (UML)' in party_name or 'UML' in party_name:
        party_id = 'UML'
    elif 'Maoist' in party_name:
        party_id = 'Maoist'
    elif 'Rastriya Swatantra' in party_name:
        party_id = 'RSP'
    elif 'Prajatantra' in party_name:
        party_id = 'RPP'
    elif 'Samajbadi' in party_name:
        party_id = 'JSPN'
    elif 'Unified Socialist' in party_name:
        party_id = 'US'
    elif 'Janamat' in party_name:
        party_id = 'JP'
    elif 'Loktantrik' in party_name:
        party_id = 'LSP'
    elif 'Nagarik Unmukti' in party_name:
        party_id = 'NUP'
    elif 'Rastriya Janata' in party_name:
        party_id = 'RJPN'
    elif 'Federal Socialist' in party_name:
        party_id = 'FSFN'
    elif 'Bibeksheel' in party_name:
        party_id = 'Others'
    elif 'Sanghiya' in party_name:
        party_id = 'Others'
    else:
        party_id = 'Others'
    
    # Parse votes
    try:
        votes = int(row['TotalVoteReceived']) if row['TotalVoteReceived'] else 0
    except:
        votes = 0
    
    rank = int(row['Rank']) if row['Rank'] else 0
    
    constituency_data[const_key]['candidates'].append({
        'name': row['CandidateName'],
        'party_id': party_id,
        'party_name': party_name,
        'votes': votes,
        'rank': rank,
        'is_winner': rank == 1
    })

# Process each constituency to create 2017 results
for const_key, data in constituency_data.items():
    district, const_id = const_key
    candidates = data['candidates']
    
    # Find winner
    winner = next((c for c in candidates if c['is_winner']), None)
    
    if not winner:
        continue
    
    # Calculate total votes and party percentages
    total_votes = sum(c['votes'] for c in candidates)
    party_totals = {}
    
    for c in candidates:
        pid = c['party_id']
        party_totals[pid] = party_totals.get(pid, 0) + c['votes']
    
    # Create results object
    results = {}
    for pid, votes in party_totals.items():
        results[pid] = votes / total_votes if total_votes > 0 else 0
    
    # Ensure all parties are present
    all_parties = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US', 'JP', 'LSP', 'NUP', 'RJPN', 'FSFN', 'Others']
    for pid in all_parties:
        if pid not in results:
            results[pid] = 0
    
    constituency_data[const_key] = {
        'winner2017': winner['party_id'],
        'candidate2017': winner['name'],
        'results2017': results
    }

# Now read and update the constituencies.js file
with open('data/constituencies.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Create a new version with 2017 data added
lines = content.split('\n')
output_lines = []
i = 0

while i < len(lines):
    line = lines[i]
    output_lines.append(line)
    
    # Check if this line contains a constituency object
    if '"id":' in line and '"P' in line:
        # Extract the district and constituency number from the id
        # Format: "P1-Jhapa-1" or similar
        match = re.search(r'"P\d+-([^-]+)-(\d+)"', line)
        if match:
            district = match.group(1)
            const_id = int(match.group(2))
            const_key = (district, const_id)
            
            # Check if we have 2017 data for this constituency
            if const_key in constituency_data:
                data = constituency_data[const_key]
                
                # Add 2017 data after the 2022 data (look for results2022 closing brace)
                # We need to add the data in the right place
                j = i
                found_results2022 = False
                
                while j < len(lines):
                    if '"results2022"' in lines[j]:
                        found_results2022 = True
                    if found_results2022 and '},' in lines[j] and 'results2022' in lines[j-5:j]:
                        # Found the closing brace of results2022, add 2017 data after it
                        output_lines.append('  "winner2017": "{}",'.format(data['winner2017']))
                        output_lines.append('  "candidate2017": "{}",'.format(data['candidate2017']))
                        output_lines.append('  "results2017": {')
                        
                        # Add all parties
                        parties = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US', 'JP', 'LSP', 'NUP', 'RJPN', 'FSFN', 'Others']
                        for idx, pid in enumerate(parties):
                            value = data['results2017'][pid]
                            if idx == len(parties) - 1:
                                output_lines.append('    "{}": {}'.format(pid, json.dumps(value)))
                            else:
                                output_lines.append('    "{}": {},'.format(pid, json.dumps(value)))
                        
                        output_lines.append('  },')
                        break
                    j += 1
    
    i += 1

# Write the updated content
with open('data/constituencies.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print("Updated data/constituencies.js with 2017 election data!")
