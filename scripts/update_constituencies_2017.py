import csv
import json
import re

# Read 2017 CSV and create a lookup dictionary
print("Reading 2017 CSV...")
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
print("Processing 2017 results...")
for const_key in list(constituency_data.keys()):
    district, const_id = const_key
    candidates = constituency_data[const_key]['candidates']
    
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

print(f"Processed {len(constituency_data)} constituencies with 2017 data")

# Read the constituencies.js file
print("Reading constituencies.js...")
with open('data/constituencies.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the export const constituencies = [ line and extract the array
match = re.search(r'export const constituencies = (\[.*\]);', content, re.DOTALL)
if match:
    constituencies_array_str = match.group(1)
    constituencies = json.loads(constituencies_array_str)
    
    # Update constituencies with 2017 data
    updated_count = 0
    for const in constituencies:
        district = const['district']
        const_id = int(re.search(r'(\d+)$', const['name']).group(1))
        const_key = (district, const_id)
        
        if const_key in constituency_data:
            const['winner2017'] = constituency_data[const_key]['winner2017']
            const['candidate2017'] = constituency_data[const_key]['candidate2017']
            const['results2017'] = constituency_data[const_key]['results2017']
            updated_count += 1
    
    print(f"Updated {updated_count} constituencies with 2017 data")
    
    # Convert back to JSON string
    new_array_str = json.dumps(constituencies, indent=2)
    
    # Replace the old array with the new one
    new_content = re.sub(
        r'export const constituencies = \[.*\];',
        f'export const constituencies = {new_array_str};',
        content,
        flags=re.DOTALL
    )
    
    # Write the updated content
    with open('data/constituencies.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully updated data/constituencies.js!")
else:
    print("ERROR: Could not find constituencies array in the file")
