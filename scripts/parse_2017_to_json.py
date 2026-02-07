import csv

# Read the 2017 election results CSV
with open('data/2017_HOR.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    candidates = list(reader)

# Group candidates by constituency
constituencies = {}

for row in candidates:
    # Extract constituency info
    district = row['DistrictName'].replace(' District', '')
    const_id = row['CenterConstID']
    const_key = f"{district}-{const_id}"
    
    if const_key not in constituencies:
        constituencies[const_key] = {
            'district': district,
            'const_id': const_id,
            'candidates': []
        }
    
    # Parse party
    party_name = row['PoliticalPartyName']
    party_id = None
    
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
    is_winner = rank == 1
    
    constituencies[const_key]['candidates'].append({
        'name': row['CandidateName'],
        'party_id': party_id,
        'party_name': party_name,
        'votes': votes,
        'rank': rank,
        'is_winner': is_winner
    })

# Generate results for each constituency
for const_key, const_data in constituencies.items():
    district = const_data['district']
    const_id = const_data['const_id']
    candidates = const_data['candidates']
    
    # Find winner
    winner = None
    for c in candidates:
        if c['is_winner']:
            winner = c
            break
    
    if not winner:
        print(f"No winner found for {const_key}")
        continue
    
    # Calculate total votes
    total_votes = sum(c['votes'] for c in candidates)
    
    # Calculate party percentages
    party_votes = {}
    party_totals = {}
    
    for c in candidates:
        pid = c['party_id']
        if pid not in party_totals:
            party_totals[pid] = 0
        party_totals[pid] += c['votes']
    
    # Create results object
    results = {}
    for pid, votes in party_totals.items():
        if total_votes > 0:
            results[pid] = votes / total_votes
        else:
            results[pid] = 0
    
    # Add missing parties as 0
    all_parties = ['NC', 'UML', 'Maoist', 'RSP', 'RPP', 'JSPN', 'US', 'JP', 'LSP', 'NUP', 'RJPN', 'FSFN', 'Others']
    for pid in all_parties:
        if pid not in results:
            results[pid] = 0
    
    # Print the result
    print(f"// {district} {const_id}")
    print(f'"winner2017": "{winner["party_id"]}",')
    print(f'"candidate2017": "{winner["name"]}",')
    print(f'"results2017": {{')
    first = True
    for pid in sorted(results.keys()):
        if not first:
            print(',')
        print(f'  "{pid}": {results[pid]:.15f}', end='')
        first = False
    print()
    print('},')
    print()
