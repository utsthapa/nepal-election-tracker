#!/usr/bin/env python3
"""
Parse 2017 Nepal election data from CSV
Generate JavaScript constituency data file
"""

import csv
import json
from collections import defaultdict

# Input and output paths
INPUT_FILE = "/home/lbikr/projects/nepalpoltiics/data/2017_HOR.csv"
OUTPUT_FILE = "/home/lbikr/projects/nepalpoltiics/data/historical/election_2017.js"

# Party mapping to standardized codes
PARTY_MAP = {
    "CPN (UML)": "UML",
    "Nepali Congress": "NC",
    "CPN (Maoist Centre)": "Maoist",
    "Federal Socialist Forum, Nepal": "SSFN",
    "Federal Socialist Forum Nepal": "SSFN",
    "Rastriya Janata Party Nepal": "RJPN",
    "Bibeksheel Sajha Party": "Others",
    "Sanghiya Loktantrik Rastriya Manch": "Others",
}

def parse_csv_file(filepath):
    """Parse the CSV file and extract constituency data"""
    constituencies = {}
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            try:
                # Extract data from row
                district = row['DistrictName'].replace(' District', '')
                const_num = row['CenterConstID']
                const_id = f"{district}-{const_num}"
                
                candidate_name = row['CandidateName']
                party_name = row['PoliticalPartyName']
                votes = int(row['TotalVoteReceived']) if row['TotalVoteReceived'] else 0
                rank = int(row['Rank']) if row['Rank'] else 0
                elected = row['Remarks'] == 'Elected'
                
                # Get or create constituency
                if const_id not in constituencies:
                    constituencies[const_id] = {
                        'district': district,
                        'constituencyNumber': int(const_num),
                        'candidates': [],
                        'totalVoters': 0,  # Not in CSV
                        'votesCast': 0,    # Not in CSV
                    }
                
                # Add candidate
                party_code = PARTY_MAP.get(party_name, 'Others')
                constituencies[const_id]['candidates'].append({
                    'name': candidate_name,
                    'party': party_code,
                    'partyDetail': party_name,
                    'votes': votes,
                    'rank': rank,
                    'elected': elected
                })
                
            except Exception as e:
                print(f"Error parsing row: {e}")
                continue
    
    # Process each constituency to calculate percentages and find winners
    for const_id, data in constituencies.items():
        candidates = data['candidates']
        
        # Calculate total votes (approximate from sum of candidate votes)
        total_votes = sum(c['votes'] for c in candidates)
        data['validVotes'] = total_votes
        data['votesCast'] = total_votes
        
        # Sort by votes (descending)
        candidates.sort(key=lambda x: x['votes'], reverse=True)
        
        # Calculate percentages
        for cand in candidates:
            cand['percent'] = round((cand['votes'] / total_votes * 100), 2) if total_votes > 0 else 0
        
        # Determine winner and runner-up
        if candidates:
            winner = candidates[0]
            runner_up = candidates[1] if len(candidates) > 1 else None
            
            data['winner'] = winner['party']
            data['winnerName'] = winner['name']
            data['winnerVotes'] = winner['votes']
            data['winnerPercent'] = winner['percent']
            
            if runner_up:
                data['runnerUp'] = runner_up['party']
                data['runnerUpName'] = runner_up['name']
                data['runnerUpVotes'] = runner_up['votes']
                data['runnerUpPercent'] = runner_up['percent']
                data['margin'] = winner['votes'] - runner_up['votes']
                data['marginPercent'] = round((data['margin'] / total_votes * 100), 2) if total_votes > 0 else 0
            else:
                data['runnerUp'] = None
                data['runnerUpName'] = None
                data['runnerUpVotes'] = 0
                data['runnerUpPercent'] = 0
                data['margin'] = 0
                data['marginPercent'] = 0
            
            # Aggregate results by party
            results = defaultdict(float)
            results_count = defaultdict(int)
            for cand in candidates:
                code = cand['party']
                results[code] += cand['percent']
                results_count[code] += cand['votes']
            
            data['results'] = dict(results)
            data['resultsCount'] = dict(results_count)
    
    return constituencies

def verify_data(constituencies):
    """Verify data integrity"""
    print("\n=== Data Verification ===")
    
    issues = []
    total_valid_votes = 0
    
    for const_id, data in constituencies.items():
        candidates = data['candidates']
        
        # Check sum of votes
        sum_votes = sum(c['votes'] for c in candidates)
        if sum_votes != data['validVotes']:
            issues.append(f"{const_id}: Sum votes mismatch")
        
        # Check winner
        if candidates:
            max_votes = max(c['votes'] for c in candidates)
            if data['winnerVotes'] != max_votes:
                issues.append(f"{const_id}: Winner votes mismatch")
        
        total_valid_votes += data['validVotes']
    
    print(f"Total constituencies: {len(constituencies)}")
    print(f"Total valid votes: {total_valid_votes:,}")
    print(f"Issues found: {len(issues)}")
    
    if issues:
        print("\nFirst 10 issues:")
        for issue in issues[:10]:
            print(f"  - {issue}")
    
    return len(issues) == 0

def generate_js_file(constituencies):
    """Generate JavaScript file content"""
    
    js_content = """// 2017 Election Constituency Data
// Source: Election Commission Nepal / 2017_HOR.csv
// Generated: February 2026
// Total Constituencies: PARTIAL DATA (from available CSV)

import { PARTIES_2017, NATIONAL_SUMMARY_2017, mapPartyName2017 } from './parties_2017.js';

export const CONSTITUENCIES_2017 = {
"""
    
    # Sort by district and constituency number
    sorted_consts = sorted(constituencies.items(), 
                          key=lambda x: (x[1]['district'], x[1]['constituencyNumber']))
    
    for const_id, data in sorted_consts:
        js_content += f'''  "{const_id}": {{
    district: "{data['district']}",
    constituencyNumber: {data['constituencyNumber']},
    totalVoters: {data.get('totalVoters', 0)},
    votesCast: {data['votesCast']},
    validVotes: {data['validVotes']},
    winner: "{data['winner']}",
    winnerName: "{data['winnerName']}",
    winnerVotes: {data['winnerVotes']},
    winnerPercent: {data['winnerPercent']},
    runnerUp: "{data['runnerUp']}",
    runnerUpName: "{data['runnerUpName']}",
    runnerUpVotes: {data['runnerUpVotes']},
    runnerUpPercent: {data['runnerUpPercent']},
    margin: {data['margin']},
    marginPercent: {data['marginPercent']},
    candidates: [
'''
        
        for cand in data['candidates']:
            js_content += f'''      {{ 
        name: "{cand['name']}", 
        party: "{cand['party']}", 
        partyDetail: "{cand['partyDetail']}",
        votes: {cand['votes']}, 
        percent: {cand['percent']}, 
        rank: {cand['rank']},
        elected: {str(cand['elected']).lower()} 
      }},
'''
        
        js_content += '    ],\n    results: {\n'
        for party, pct in sorted(data['results'].items()):
            js_content += f'      {party}: {pct:.4f},\n'
        
        js_content += '    },\n    resultsCount: {\n'
        for party, count in sorted(data['resultsCount'].items()):
            js_content += f'      {party}: {count},\n'
        
        js_content += '    }\n  },\n'
    
    js_content += '''};

// Export complete election data
export const ELECTION_2017 = {
  year: 2017,
  summary: NATIONAL_SUMMARY_2017,
  parties: PARTIES_2017,
  constituencies: CONSTITUENCIES_2017,
  totalConstituencies: Object.keys(CONSTITUENCIES_2017).length,
  
  // Helper methods
  getConstituency(id) {
    return this.constituencies[id] || null;
  },
  
  getWinner(id) {
    const c = this.constituencies[id];
    return c ? c.winner : null;
  },
  
  getResults(id) {
    const c = this.constituencies[id];
    return c ? c.results : null;
  },
  
  getDistricts() {
    const districts = new Set();
    Object.values(this.constituencies).forEach(c => {
      districts.add(c.district);
    });
    return Array.from(districts).sort();
  },
  
  getConstituenciesByDistrict(district) {
    return Object.entries(this.constituencies)
      .filter(([id, c]) => c.district === district)
      .map(([id, c]) => ({ id, ...c }));
  }
};
'''
    
    return js_content

def main():
    print("Parsing 2017 election data from CSV...")
    constituencies = parse_csv_file(INPUT_FILE)
    
    print(f"\nParsed {len(constituencies)} constituencies")
    
    # Show sample
    if constituencies:
        sample_id = list(constituencies.keys())[0]
        print(f"\nSample constituency ({sample_id}):")
        print(json.dumps(constituencies[sample_id], indent=2, default=str))
    
    # Verify data
    is_valid = verify_data(constituencies)
    
    # Generate JS file
    print(f"\nGenerating JavaScript file: {OUTPUT_FILE}")
    js_content = generate_js_file(constituencies)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"File written successfully: {OUTPUT_FILE}")
    print(f"File size: {len(js_content):,} bytes")
    
    if is_valid:
        print("\n✅ Data verification passed!")
    else:
        print("\n⚠️  Data verification found issues (see above)")

if __name__ == "__main__":
    main()
