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
    lines = f.readlines()

# Find the start and end of the constituencies array
start_idx = None
end_idx = None
in_array = False
depth = 0

for i, line in enumerate(lines):
    if 'export const constituencies = [' in line:
        start_idx = i
        # Find the opening bracket
        bracket_pos = line.find('[')
        if bracket_pos != -1:
            in_array = True
            depth = 1
    elif in_array:
        depth += line.count('{') - line.count('}')
        if depth == 0:
            end_idx = i
            break

if start_idx is None or end_idx is None:
    print("ERROR: Could not find constituencies array")
    exit(1)

print(f"Found array from line {start_idx} to {end_idx}")

# Extract the array content
array_content = ''.join(lines[start_idx:end_idx + 1])
match = re.search(r'export const constituencies = (\[.*\]);', array_content, re.DOTALL)

if match:
    array_str = match.group(1)
    try:
        constituencies = json.loads(array_str)
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"Trying to fix common JSON issues...")
        # Try to fix by ensuring keys are quoted
        array_str_fixed = re.sub(r'(\w+):', r'"\1":', array_str)
        constituencies = json.loads(array_str_fixed)
    
    # Update constituencies with 2017 data
    updated_count = 0
    for const in constituencies:
        district = const['district']
        name = const['name']
        # Extract constituency number from name (e.g., "Jhapa 1" -> 1)
        const_id = int(re.search(r'(\d+)$', name).group(1))
        const_key = (district, const_id)
        
        if const_key in constituency_data:
            const['winner2017'] = constituency_data[const_key]['winner2017']
            const['candidate2017'] = constituency_data[const_key]['candidate2017']
            const['results2017'] = constituency_data[const_key]['results2017']
            updated_count += 1
            print(f"Updated: {district} {const_id} - Winner: {constituency_data[const_key]['winner2017']}")
    
    print(f"\nTotal updated: {updated_count} constituencies")
    
    # Convert back to JSON string
    new_array_str = json.dumps(constituencies, indent=2, ensure_ascii=False)
    
    # Rebuild the file
    # Keep everything before the array
    before_array = ''.join(lines[:start_idx])
    # Add the new array
    after_array = 'export const constituencies = ' + new_array_str + ';\n'
    # Keep everything after the array
    after_content = ''.join(lines[end_idx + 1:])
    
    # Write the updated content
    new_content = before_array + after_array + after_content
    with open('data/constituencies.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully updated data/constituencies.js!")
else:
    print("ERROR: Could not extract constituencies array")
