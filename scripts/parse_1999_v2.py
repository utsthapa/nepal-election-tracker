#!/usr/bin/env python3
"""
Parse 1999 Nepal election data from Nepal Research HTML file
Generate JavaScript constituency data file
"""

import re
import json
from collections import defaultdict

# Input and output paths
INPUT_FILE = "/home/lbikr/.local/share/kilo/tool-output/tool_c5e8d59850019Uabut5djGUqTj"
OUTPUT_FILE = "/home/lbikr/projects/nepalpoltiics/data/historical/election_1999.js"

# Party mapping to standardized codes
PARTY_MAP = {
    "Nepali Congress": "NC",
    "Nepal Communist Party (UML)": "UML",
    "Nepal Communist Party (Unified Marxist-Leninist)": "UML",
    "Rastriya Prajatantra Party": "RPP",
    "Nepal Sadbhawana Party": "NSP",
    "Rastriya Jana Morcha": "RJM",
    "Sanyunkta Janamorcha Nepal": "SJN",
    "Nepal Majdoor Kissan Party": "NMKP",
}

def clean_text(text):
    """Clean up HTML entities but preserve structure"""
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&#8592;', '<-')
    text = text.replace('&#160;', ' ')
    # Don't normalize all whitespace - preserve line breaks
    lines = text.split('\n')
    lines = [' '.join(l.split()) for l in lines]  # Normalize within lines
    return '\n'.join(lines)

def parse_html_file(filepath):
    """Parse the HTML file and extract constituency data"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Clean HTML entities
    content = clean_text(content)
    
    constituencies = {}
    
    # Split by "Date" followed by date pattern at start of line
    pattern = r'(?:^|\n)Date\s*\n\s*(\d{4}-\d{2}-\d{2})'
    matches = list(re.finditer(pattern, content))
    
    print(f"Found {len(matches)} potential constituency blocks")
    
    for i, match in enumerate(matches):
        try:
            start_pos = match.start()
            end_pos = matches[i + 1].start() if i + 1 < len(matches) else len(content)
            block = content[start_pos:end_pos]
            
            # Parse the block
            const_data = parse_block(block)
            if const_data:
                const_id = f"{const_data['district']}-{const_data['constituencyNumber']}"
                constituencies[const_id] = const_data
                
        except Exception as e:
            print(f"Error parsing block {i}: {e}")
            continue
    
    return constituencies

def parse_block(block):
    """Parse a single constituency block"""
    lines = [l.strip() for l in block.split('\n') if l.strip()]
    
    try:
        # Find key indices
        district_idx = -1
        const_idx = -1
        
        for i, line in enumerate(lines):
            if line == 'District Name':
                district_idx = i
            elif line == 'Constituency':
                const_idx = i
        
        if district_idx == -1 or const_idx == -1:
            return None
        
        district = lines[district_idx + 1]
        constituency_num = lines[const_idx + 1]
        
        # Extract voter info
        total_voters_idx = -1
        vote_counted_idx = -1
        valid_votes_idx = -1
        invalid_votes_idx = -1
        
        for i, line in enumerate(lines):
            if line == 'Total Voters':
                total_voters_idx = i
            elif line == 'Vote Counted':
                vote_counted_idx = i
            elif line == 'Valid Votes':
                valid_votes_idx = i
            elif line == 'Invalid Votes':
                invalid_votes_idx = i
        
        total_voters = int(lines[total_voters_idx + 1]) if total_voters_idx != -1 else 0
        votes_cast = int(lines[vote_counted_idx + 1]) if vote_counted_idx != -1 else 0
        valid_votes = int(lines[valid_votes_idx + 1]) if valid_votes_idx != -1 else 0
        invalid_votes = int(lines[invalid_votes_idx + 1]) if invalid_votes_idx != -1 else 0
        
        # Calculate percentages
        turnout_pct = round((votes_cast / total_voters * 100), 2) if total_voters > 0 else 0
        invalid_pct = round((invalid_votes / votes_cast * 100), 2) if votes_cast > 0 else 0
        
        # Extract candidates
        cand_idx = -1
        for i, line in enumerate(lines):
            if line == 'Candidate':
                cand_idx = i
                break
        
        if cand_idx == -1:
            return None
        
        candidates = []
        i = cand_idx + 1
        
        # Skip header row if present
        if i < len(lines) and lines[i] == 'Party Name':
            i += 1
        if i < len(lines) and lines[i] == 'Votecount':
            i += 1
        if i < len(lines) and lines[i] == 'Status':
            i += 1
        
        while i < len(lines):
            # Check if we've reached the end of candidates
            if lines[i] == 'Date' or lines[i].startswith('1999-'):
                break
            
            # Try to parse candidate: Name, Party, Votes
            if i + 2 < len(lines):
                name = lines[i]
                party = lines[i + 1]
                votes_str = lines[i + 2]
                
                # Check if votes_str is a number
                if not votes_str.isdigit():
                    i += 1
                    continue
                
                # Check if next line is ELECTED
                status = ""
                if i + 3 < len(lines) and lines[i + 3] == "ELECTED":
                    status = "ELECTED"
                    i += 4
                else:
                    i += 3
                
                votes = int(votes_str)
                candidates.append({
                    'name': name,
                    'party': party,
                    'votes': votes,
                    'elected': status == "ELECTED"
                })
            else:
                break
        
        if not candidates:
            return None
        
        # Calculate percentages and map party codes
        for cand in candidates:
            cand['percent'] = round((cand['votes'] / valid_votes * 100), 2) if valid_votes > 0 else 0
            cand['partyCode'] = PARTY_MAP.get(cand['party'], 'Others')
        
        # Sort by votes (descending)
        candidates.sort(key=lambda x: x['votes'], reverse=True)
        
        # Determine winner and runner-up
        winner = candidates[0]
        runner_up = candidates[1] if len(candidates) > 1 else None
        
        margin = winner['votes'] - (runner_up['votes'] if runner_up else 0)
        margin_pct = round((margin / valid_votes * 100), 2) if valid_votes > 0 else 0
        
        # Aggregate results by party code
        results = defaultdict(float)
        results_count = defaultdict(int)
        
        for cand in candidates:
            code = cand['partyCode']
            results[code] += cand['percent']
            results_count[code] += cand['votes']
        
        return {
            'district': district,
            'constituencyNumber': int(constituency_num),
            'totalVoters': total_voters,
            'votesCast': votes_cast,
            'turnoutPercent': turnout_pct,
            'validVotes': valid_votes,
            'invalidVotes': invalid_votes,
            'invalidPercent': invalid_pct,
            'winner': winner['partyCode'],
            'winnerName': winner['name'],
            'winnerVotes': winner['votes'],
            'winnerPercent': winner['percent'],
            'runnerUp': runner_up['partyCode'] if runner_up else None,
            'runnerUpName': runner_up['name'] if runner_up else None,
            'runnerUpVotes': runner_up['votes'] if runner_up else 0,
            'runnerUpPercent': runner_up['percent'] if runner_up else 0,
            'margin': margin,
            'marginPercent': margin_pct,
            'candidates': candidates,
            'results': dict(results),
            'resultsCount': dict(results_count)
        }
        
    except Exception as e:
        print(f"Error in parse_block: {e}")
        import traceback
        traceback.print_exc()
        return None

def verify_data(constituencies):
    """Verify data integrity"""
    print("\n=== Data Verification ===")
    
    issues = []
    total_valid_votes = 0
    total_votes_cast = 0
    
    for const_id, data in constituencies.items():
        # Check 1: Total voters >= votes cast
        if data['totalVoters'] < data['votesCast']:
            issues.append(f"{const_id}: Total voters ({data['totalVoters']}) < votes cast ({data['votesCast']})")
        
        # Check 2: Votes cast = valid + invalid
        expected_cast = data['validVotes'] + data['invalidVotes']
        if data['votesCast'] != expected_cast:
            issues.append(f"{const_id}: Votes cast ({data['votesCast']}) != valid + invalid ({expected_cast})")
        
        # Check 3: Sum of candidate votes = valid votes
        sum_candidate_votes = sum(c['votes'] for c in data['candidates'])
        if sum_candidate_votes != data['validVotes']:
            issues.append(f"{const_id}: Sum candidate votes ({sum_candidate_votes}) != valid votes ({data['validVotes']})")
        
        # Check 4: Winner has most votes
        max_votes = max(c['votes'] for c in data['candidates'])
        winner_votes = data['winnerVotes']
        if winner_votes != max_votes:
            issues.append(f"{const_id}: Winner votes ({winner_votes}) != max votes ({max_votes})")
        
        # Check 5: Margin calculation
        if data['runnerUp']:
            expected_margin = data['winnerVotes'] - data['runnerUpVotes']
            if data['margin'] != expected_margin:
                issues.append(f"{const_id}: Margin ({data['margin']}) != expected ({expected_margin})")
        
        total_valid_votes += data['validVotes']
        total_votes_cast += data['votesCast']
    
    print(f"Total constituencies: {len(constituencies)}")
    print(f"Total valid votes: {total_valid_votes:,}")
    print(f"Total votes cast: {total_votes_cast:,}")
    print(f"Issues found: {len(issues)}")
    
    if issues:
        print("\nFirst 10 issues:")
        for issue in issues[:10]:
            print(f"  - {issue}")
    
    return len(issues) == 0

def generate_js_file(constituencies):
    """Generate JavaScript file content"""
    
    js_content = """// 1999 Election Constituency Data
// Source: Nepal Research / Election Commission Nepal
// URL: https://nepalresearch.org/politics/background/elections_old/ec/alldistconst.htm
// Generated: February 2026
// Total Constituencies: 205

import { PARTIES_1999, NATIONAL_SUMMARY_1999, mapPartyName1999 } from './parties_1999';

export const CONSTITUENCIES_1999 = {
"""
    
    # Sort by district and constituency number
    sorted_consts = sorted(constituencies.items(), 
                          key=lambda x: (x[1]['district'], x[1]['constituencyNumber']))
    
    for const_id, data in sorted_consts:
        js_content += f'''  "{const_id}": {{
    district: "{data['district']}",
    constituencyNumber: {data['constituencyNumber']},
    totalVoters: {data['totalVoters']},
    votesCast: {data['votesCast']},
    turnoutPercent: {data['turnoutPercent']},
    validVotes: {data['validVotes']},
    invalidVotes: {data['invalidVotes']},
    invalidPercent: {data['invalidPercent']},
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
        party: "{cand['partyCode']}", 
        partyDetail: "{cand['party']}",
        votes: {cand['votes']}, 
        percent: {cand['percent']}, 
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
export const ELECTION_1999 = {
  year: 1999,
  summary: NATIONAL_SUMMARY_1999,
  parties: PARTIES_1999,
  constituencies: CONSTITUENCIES_1999,
  totalConstituencies: 205,
  
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
    print("Parsing 1999 election data...")
    constituencies = parse_html_file(INPUT_FILE)
    
    print(f"\nParsed {len(constituencies)} constituencies")
    
    # Show sample
    if constituencies:
        sample_id = list(constituencies.keys())[0]
        print(f"\nSample constituency ({sample_id}):")
        print(json.dumps(constituencies[sample_id], indent=2))
    
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
