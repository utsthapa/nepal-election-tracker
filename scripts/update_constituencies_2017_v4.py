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
    
    name = row['CandidateName']
    
    constituency_data[const_key]['candidates'].append({
        'name': name,
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
print(f"Sample 2017 data: {list(constituency_data.items())[:3]}")

# Read constituencies.js file
print("Reading constituencies.js...")
with open('data/constituencies.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Array starts at line 207 (index 206) and ends at line 4663 (index 4662)
start_idx = 207  # 0-indexed would be 206
end_idx = 4663   # 0-indexed would be 4662

# Keep header and comments
header = lines[:start_idx]

# Extract array content (from "export const constituencies = [" to "];")
array_content = ''.join(lines[start_idx-1:end_idx])  # -1 to include the declaration line

# Remove "export const constituencies = " part and extract just the array
array_start = array_content.find('[')
array_end = array_content.rfind(']') + 1
array_str = array_content[array_start:array_end]

try:
    constituencies = json.loads(array_str)
    print(f"Loaded {len(constituencies)} constituencies")
except json.JSONDecodeError as e:
    print(f"JSON decode error: {e}")
    exit(1)

# Update constituencies with 2017 data
updated_count = 0
for const in constituencies:
    district = const['district']
    name = const['name']
    # Extract constituency number from name (e.g., "Jhapa 1" -> 1)
    match = re.search(r'(\d+)$', name)
    if match:
        const_id = match.group(1)
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

# Rebuild file
# Keep everything before the array declaration line
before_array = lines[:start_idx-1]
# Add new array declaration
array_line = 'export const constituencies = ' + new_array_str + ';\n'
# No content after array (file ends with array)

# Combine everything
new_content = ''.join(before_array) + array_line

# Write the updated content to a test file first
with open('data/constituencies_test.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully created data/constituencies_test.js!")
print(f"\nVerifying test file...")
with open('data/constituencies_test.js', 'r', encoding='utf-8') as f:
    test_content = f.read()
    
# Check if test file has 2017 data
if 'winner2017' in test_content:
    print("✓ Test file contains winner2017 data")
else:
    print("✗ Test file does NOT contain winner2017 data")

# Check Jhapa 5 specifically
if '"id": "P1-Jhapa-5"' in test_content:
    jhapa_section = test_content[test_content.find('"id": "P1-Jhapa-5"'):test_content.find('"id": "P1-Jhapa-5"') + 2000]
    if 'winner2017' in jhapa_section:
        print("✓ Jhapa 5 has 2017 data")
    else:
        print("✗ Jhapa 5 does NOT have 2017 data")
