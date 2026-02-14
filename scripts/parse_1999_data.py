#!/usr/bin/env python3
"""
Parse 1999 Nepal election data from Nepal Research HTML
Generate JavaScript constituency data file
"""

import re
import json

# Raw HTML data - truncated for brevity, will process in chunks
# This is a sample of the first few constituencies to demonstrate the format

sample_data = """
Date
1999-05-20
Time
16:04:52
District Name
Taplejung
Constituency
1
Total Voters
48837
Vote Counted
32718
Percent
66.99
Valid Votes
32112
Percent
98.15
Invalid Votes
606
Percent
1.85
Candidate
Party Name
Votecount
Status
Til Kumar Menyangbo Limbu
Nepal Communist Party (UML)
13636
ELECTED
Surya Man Gurung
Nepali Congress
13472
Padam Bahadur Yengden
Rastriya Janamukti Party
1786
Kedar Nath Dahal
Rastriya Prajatantra Party
1502
Kul Prasad Uprety
Nepal Communist Party (M.L)
1289
Ram Bahadur Thebe
Independent
427
Date
1999-05-20
Time
14:26:27
District Name
Taplejung
Constituency
2
Total Voters
43700
Vote Counted
28268
Percent
64.69
Valid Votes
27686
Percent
97.94
Invalid Votes
582
Percent
2.06
Candidate
Party Name
Votecount
Status
Om Prasad Ojha
Nepal Communist Party (UML)
10402
ELECTED
Bishnu Maden
Rastriya Prajatantra Party
8420
Pratap Prakash Hangam
Nepali Congress
6247
Birendra Bahadur Limbu (Ambuhang)
Rastriya Janamukti Party
1875
Tej Bahadur (Yakso)  Limbu
Nepal Communist Party (M.L)
693
Goma Chudal
Independent
49
"""

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

def parse_constituency_data(html_content):
    """Parse constituency data from HTML"""
    constituencies = {}
    
    # Split by "Date" to get individual constituency blocks
    blocks = html_content.split('Date\n')[1:]  # Skip first empty split
    
    for block in blocks:
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        
        try:
            # Extract basic info
            date = lines[0] if len(lines) > 0 else ""
            time_idx = lines.index('Time') if 'Time' in lines else -1
            district_idx = lines.index('District Name') if 'District Name' in lines else -1
            const_idx = lines.index('Constituency') if 'Constituency' in lines else -1
            
            if district_idx == -1 or const_idx == -1:
                continue
                
            district = lines[district_idx + 1]
            constituency_num = lines[const_idx + 1]
            const_id = f"{district}-{constituency_num}"
            
            # Extract voter info
            total_voters_idx = lines.index('Total Voters') if 'Total Voters' in lines else -1
            vote_counted_idx = lines.index('Vote Counted') if 'Vote Counted' in lines else -1
            valid_votes_idx = lines.index('Valid Votes') if 'Valid Votes' in lines else -1
            invalid_votes_idx = lines.index('Invalid Votes') if 'Invalid Votes' in lines else -1
            
            total_voters = int(lines[total_voters_idx + 1]) if total_voters_idx != -1 else 0
            votes_cast = int(lines[vote_counted_idx + 1]) if vote_counted_idx != -1 else 0
            valid_votes = int(lines[valid_votes_idx + 1]) if valid_votes_idx != -1 else 0
            invalid_votes = int(lines[invalid_votes_idx + 1]) if invalid_votes_idx != -1 else 0
            
            # Calculate percentages
            turnout_pct = round((votes_cast / total_voters * 100), 2) if total_voters > 0 else 0
            invalid_pct = round((invalid_votes / votes_cast * 100), 2) if votes_cast > 0 else 0
            
            # Extract candidates
            cand_idx = lines.index('Candidate') if 'Candidate' in lines else -1
            if cand_idx == -1:
                continue
            
            candidates = []
            i = cand_idx + 1
            while i < len(lines) and lines[i] != 'Date':
                # Each candidate has: Name, Party, Votes, [Status]
                if i + 2 < len(lines):
                    name = lines[i]
                    party = lines[i + 1]
                    votes_str = lines[i + 2]
                    
                    # Check if next line is ELECTED or another candidate
                    status = ""
                    if i + 3 < len(lines) and lines[i + 3] == "ELECTED":
                        status = "ELECTED"
                        i += 1
                    
                    try:
                        votes = int(votes_str)
                        candidates.append({
                            'name': name,
                            'party': party,
                            'votes': votes,
                            'elected': status == "ELECTED"
                        })
                    except ValueError:
                        pass
                    
                    i += 3
                else:
                    break
            
            # Calculate percentages and find winner
            for cand in candidates:
                cand['percent'] = round((cand['votes'] / valid_votes * 100), 2) if valid_votes > 0 else 0
                cand['partyCode'] = PARTY_MAP.get(cand['party'], 'Others')
            
            # Sort by votes
            candidates.sort(key=lambda x: x['votes'], reverse=True)
            
            if len(candidates) > 0:
                winner = candidates[0]
                runner_up = candidates[1] if len(candidates) > 1 else None
                
                margin = winner['votes'] - (runner_up['votes'] if runner_up else 0)
                margin_pct = round((margin / valid_votes * 100), 2) if valid_votes > 0 else 0
                
                # Aggregate results by party code
                results = {}
                results_count = {}
                for cand in candidates:
                    code = cand['partyCode']
                    if code not in results:
                        results[code] = 0
                        results_count[code] = 0
                    results[code] += cand['percent']
                    results_count[code] += cand['votes']
                
                constituencies[const_id] = {
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
                    'results': results,
                    'resultsCount': results_count
                }
        except Exception as e:
            print(f"Error parsing block: {e}")
            continue
    
    return constituencies


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
    
    for const_id, data in sorted(constituencies.items()):
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
        
        js_content += '''    ],
    results: {
'''
        for party, pct in data['results'].items():
            js_content += f'      "{party}": {pct:.4f},\n'
        
        js_content += '''    },
    resultsCount: {
'''
        for party, count in data['resultsCount'].items():
            js_content += f'      "{party}": {count},\n'
        
        js_content += '''    }
  },
'''
    
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


if __name__ == "__main__":
    # Parse sample data
    constituencies = parse_constituency_data(sample_data)
    print(f"Parsed {len(constituencies)} constituencies")
    
    # Print sample
    for const_id, data in list(constituencies.items())[:2]:
        print(f"\n{const_id}:")
        print(json.dumps(data, indent=2))
