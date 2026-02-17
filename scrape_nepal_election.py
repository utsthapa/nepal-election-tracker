#!/usr/bin/env python3
"""
Scrape 2017 Nepalese general election constituency-level data from Wikipedia.
Uses only standard library modules.
"""

import json
import re
import subprocess
import time
import html

# List of all 165 constituencies based on the Wikipedia list
CONSTITUENCIES = [
    # Koshi Province (28)
    ("Taplejung 1", "Taplejung_1_(constituency)"),
    ("Panchthar 1", "Panchthar_1_(constituency)"),
    ("Ilam 1", "Ilam_1_(constituency)"),
    ("Ilam 2", "Ilam_2_(constituency)"),
    ("Jhapa 1", "Jhapa_1_(constituency)"),
    ("Jhapa 2", "Jhapa_2_(constituency)"),
    ("Jhapa 3", "Jhapa_3_(constituency)"),
    ("Jhapa 4", "Jhapa_4_(constituency)"),
    ("Jhapa 5", "Jhapa_5_(constituency)"),
    ("Sankhuwasabha 1", "Sankhuwasabha_1_(constituency)"),
    ("Tehrathum 1", "Tehrathum_1_(constituency)"),
    ("Bhojpur 1", "Bhojpur_1_(constituency)"),
    ("Dhankuta 1", "Dhankuta_1_(constituency)"),
    ("Morang 1", "Morang_1_(constituency)"),
    ("Morang 2", "Morang_2_(constituency)"),
    ("Morang 3", "Morang_3_(constituency)"),
    ("Morang 4", "Morang_4_(constituency)"),
    ("Morang 5", "Morang_5_(constituency)"),
    ("Morang 6", "Morang_6_(constituency)"),
    ("Sunsari 1", "Sunsari_1_(constituency)"),
    ("Sunsari 2", "Sunsari_2_(constituency)"),
    ("Sunsari 3", "Sunsari_3_(constituency)"),
    ("Sunsari 4", "Sunsari_4_(constituency)"),
    ("Solukhumbu 1", "Solukhumbu_1_(constituency)"),
    ("Khotang 1", "Khotang_1_(constituency)"),
    ("Okhaldhunga 1", "Okhaldhunga_1_(constituency)"),
    ("Udayapur 1", "Udayapur_1_(constituency)"),
    ("Udayapur 2", "Udayapur_2_(constituency)"),
    
    # Madhesh Province (32)
    ("Saptari 1", "Saptari_1_(constituency)"),
    ("Saptari 2", "Saptari_2_(constituency)"),
    ("Saptari 3", "Saptari_3_(constituency)"),
    ("Saptari 4", "Saptari_4_(constituency)"),
    ("Siraha 1", "Siraha_1_(constituency)"),
    ("Siraha 2", "Siraha_2_(constituency)"),
    ("Siraha 3", "Siraha_3_(constituency)"),
    ("Siraha 4", "Siraha_4_(constituency)"),
    ("Dhanusha 1", "Dhanusha_1_(constituency)"),
    ("Dhanusha 2", "Dhanusha_2_(constituency)"),
    ("Dhanusha 3", "Dhanusha_3_(constituency)"),
    ("Dhanusha 4", "Dhanusha_4_(constituency)"),
    ("Mahottari 1", "Mahottari_1_(constituency)"),
    ("Mahottari 2", "Mahottari_2_(constituency)"),
    ("Mahottari 3", "Mahottari_3_(constituency)"),
    ("Mahottari 4", "Mahottari_4_(constituency)"),
    ("Sarlahi 1", "Sarlahi_1_(constituency)"),
    ("Sarlahi 2", "Sarlahi_2_(constituency)"),
    ("Sarlahi 3", "Sarlahi_3_(constituency)"),
    ("Sarlahi 4", "Sarlahi_4_(constituency)"),
    ("Rautahat 1", "Rautahat_1_(constituency)"),
    ("Rautahat 2", "Rautahat_2_(constituency)"),
    ("Rautahat 3", "Rautahat_3_(constituency)"),
    ("Rautahat 4", "Rautahat_4_(constituency)"),
    ("Bara 1", "Bara_1_(constituency)"),
    ("Bara 2", "Bara_2_(constituency)"),
    ("Bara 3", "Bara_3_(constituency)"),
    ("Bara 4", "Bara_4_(constituency)"),
    ("Parsa 1", "Parsa_1_(constituency)"),
    ("Parsa 2", "Parsa_2_(constituency)"),
    ("Parsa 3", "Parsa_3_(constituency)"),
    ("Parsa 4", "Parsa_4_(constituency)"),
    
    # Bagmati Province (33)
    ("Dolakha 1", "Dolakha_1"),
    ("Ramechhap 1", "Ramechhap_1"),
    ("Sindhuli 1", "Sindhuli_1"),
    ("Sindhuli 2", "Sindhuli_2"),
    ("Rasuwa 1", "Rasuwa_1"),
    ("Dhading 1", "Dhading_1"),
    ("Dhading 2", "Dhading_2"),
    ("Nuwakot 1", "Nuwakot_1"),
    ("Nuwakot 2", "Nuwakot_2"),
    ("Kathmandu 1", "Kathmandu_1_(constituency)"),
    ("Kathmandu 2", "Kathmandu_2_(constituency)"),
    ("Kathmandu 3", "Kathmandu_3_(constituency)"),
    ("Kathmandu 4", "Kathmandu_4_(constituency)"),
    ("Kathmandu 5", "Kathmandu_5_(constituency)"),
    ("Kathmandu 6", "Kathmandu_6_(constituency)"),
    ("Kathmandu 7", "Kathmandu_7_(constituency)"),
    ("Kathmandu 8", "Kathmandu_8_(constituency)"),
    ("Kathmandu 9", "Kathmandu_9_(constituency)"),
    ("Kathmandu 10", "Kathmandu_10_(constituency)"),
    ("Bhaktapur 1", "Bhaktapur_1_(constituency)"),
    ("Bhaktapur 2", "Bhaktapur_2_(constituency)"),
    ("Lalitpur 1", "Lalitpur_1"),
    ("Lalitpur 2", "Lalitpur_2"),
    ("Lalitpur 3", "Lalitpur_3"),
    ("Kavrepalanchok 1", "Kavrepalanchok_1"),
    ("Kavrepalanchok 2", "Kavrepalanchok_2"),
    ("Sindhupalchok 1", "Sindhupalchok_1"),
    ("Sindhupalchok 2", "Sindhupalchok_2"),
    ("Makwanpur 1", "Makwanpur_1"),
    ("Makwanpur 2", "Makwanpur_2"),
    ("Chitwan 1", "Chitwan_1"),
    ("Chitwan 2", "Chitwan_2"),
    ("Chitwan 3", "Chitwan_3"),
    
    # Gandaki Province (18)
    ("Gorkha 1", "Gorkha_1"),
    ("Gorkha 2", "Gorkha_2"),
    ("Manang 1", "Manang_1"),
    ("Lamjung 1", "Lamjung_1"),
    ("Kaski 1", "Kaski_1"),
    ("Kaski 2", "Kaski_2"),
    ("Kaski 3", "Kaski_3"),
    ("Tanahun 1", "Tanahun_1"),
    ("Tanahun 2", "Tanahun_2"),
    ("Syangja 1", "Syangja_1"),
    ("Syangja 2", "Syangja_2"),
    ("Nawalparasi (Bardaghat Susta East) 1", "Nawalparasi_(Bardaghat_Susta_East)_1"),
    ("Nawalparasi (Bardaghat Susta East) 2", "Nawalparasi_(Bardaghat_Susta_East)_2"),
    ("Mustang 1", "Mustang_1"),
    ("Myagdi 1", "Myagdi_1"),
    ("Baglung 1", "Baglung_1"),
    ("Baglung 2", "Baglung_2"),
    ("Parbat 1", "Parbat_1"),
    
    # Lumbini Province (26)
    ("Gulmi 1", "Gulmi_1"),
    ("Gulmi 2", "Gulmi_2"),
    ("Palpa 1", "Palpa_1"),
    ("Palpa 2", "Palpa_2"),
    ("Arghakhanchi 1", "Arghakhanchi_1"),
    ("Nawalparasi (Bardaghat Susta West) 1", "Nawalparasi_(Bardaghat_Susta_West)_1"),
    ("Nawalparasi (Bardaghat Susta West) 2", "Nawalparasi_(Bardaghat_Susta_West)_2"),
    ("Rupandehi 1", "Rupandehi_1_(constituency)"),
    ("Rupandehi 2", "Rupandehi_2_(constituency)"),
    ("Rupandehi 3", "Rupandehi_3_(constituency)"),
    ("Rupandehi 4", "Rupandehi_4_(constituency)"),
    ("Rupandehi 5", "Rupandehi_5_(constituency)"),
    ("Kapilvastu 1", "Kapilvastu_1"),
    ("Kapilvastu 2", "Kapilvastu_2"),
    ("Kapilvastu 3", "Kapilvastu_3"),
    ("Eastern Rukum 1", "Eastern_Rukum_1"),
    ("Rolpa 1", "Rolpa_1"),
    ("Pyuthan 1", "Pyuthan_1"),
    ("Dang 1", "Dang_1"),
    ("Dang 2", "Dang_2"),
    ("Dang 3", "Dang_3"),
    ("Banke 1", "Banke_1"),
    ("Banke 2", "Banke_2"),
    ("Banke 3", "Banke_3"),
    ("Bardiya 1", "Bardiya_1"),
    ("Bardiya 2", "Bardiya_2"),
    
    # Karnali Province (12)
    ("Salyan 1", "Salyan_1"),
    ("Dolpa 1", "Dolpa_1"),
    ("Mugu 1", "Mugu_1"),
    ("Jumla 1", "Jumla_1"),
    ("Kalikot 1", "Kalikot_1"),
    ("Humla 1", "Humla_1"),
    ("Jajarkot 1", "Jajarkot_1"),
    ("Dailekh 1", "Dailekh_1"),
    ("Dailekh 2", "Dailekh_2"),
    ("Surkhet 1", "Surkhet_1"),
    ("Surkhet 2", "Surkhet_2"),
    ("Western Rukum 1", "Western_Rukum_1"),
    
    # Sudurpashchim Province (16)
    ("Bajura 1", "Bajura_1"),
    ("Achham 1", "Achham_1"),
    ("Achham 2", "Achham_2"),
    ("Bajhang 1", "Bajhang_1"),
    ("Doti 1", "Doti_1"),
    ("Kailali 1", "Kailali_1_(constituency)"),
    ("Kailali 2", "Kailali_2_(constituency)"),
    ("Kailali 3", "Kailali_3_(constituency)"),
    ("Kailali 4", "Kailali_4_(constituency)"),
    ("Kailali 5", "Kailali_5_(constituency)"),
    ("Darchula 1", "Darchula_1"),
    ("Baitadi 1", "Baitadi_1"),
    ("Dadeldhura 1", "Dadeldhura_1"),
    ("Kanchanpur 1", "Kanchanpur_1"),
    ("Kanchanpur 2", "Kanchanpur_2"),
    ("Kanchanpur 3", "Kanchanpur_3"),
]

def fetch_page(wiki_page):
    """Fetch Wikipedia page using curl."""
    url = f"https://en.wikipedia.org/wiki/{wiki_page}"
    try:
        result = subprocess.run(
            ['curl', '-s', '-L', '--max-time', '30', url],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            return result.stdout
        return None
    except Exception as e:
        print(f"Error fetching page: {e}")
        return None

def parse_election_data(html_content, constituency_name):
    """Parse 2017 election data from HTML."""
    result = {
        'constituency': constituency_name,
        'winner': None,
        'winnerParty': None,
        'winnerVotes': None,
        'runnerUp': None,
        'runnerUpParty': None,
        'runnerUpVotes': None,
        'status': 'incomplete'
    }
    
    if not html_content:
        result['status'] = 'error'
        result['error'] = 'No content fetched'
        return result
    
    # Find the 2017 legislative election section
    # Look for heading with id containing 2017 and legislative
    section_pattern = r'<h[234][^>]*id="[^"]*2017_legislative[^"]*"[^>]*>.*?</h[234]>'
    match = re.search(section_pattern, html_content, re.IGNORECASE | re.DOTALL)
    
    if not match:
        # Try alternative patterns
        alt_patterns = [
            r'<h[234][^>]*>.*?2017.*?general election.*?</h[234]>',
            r'<h[234][^>]*>.*?2017 Nepalese general election.*?</h[234]>',
        ]
        for pattern in alt_patterns:
            match = re.search(pattern, html_content, re.IGNORECASE | re.DOTALL)
            if match:
                break
    
    if not match:
        result['status'] = 'error'
        result['error'] = '2017 election section not found'
        return result
    
    section_start = match.end()
    
    # Get content after the heading up to the next h2 or h3
    section_content = html_content[section_start:]
    next_heading = re.search(r'<h[23][^>]*>', section_content)
    if next_heading:
        section_content = section_content[:next_heading.start()]
    
    # Find the table in this section
    table_match = re.search(r'<table[^>]*>(.*?)</table>', section_content, re.DOTALL | re.IGNORECASE)
    if not table_match:
        result['status'] = 'error'
        result['error'] = 'Election table not found'
        return result
    
    table_html = table_match.group(1)
    
    # Extract rows from table
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_html, re.DOTALL | re.IGNORECASE)
    
    candidates = []
    for row in rows:
        # Extract cells - handle both th and td
        cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.DOTALL | re.IGNORECASE)
        if len(cells) >= 3:
            # Clean up cell content
            cleaned_cells = []
            for cell in cells:
                # Remove HTML tags
                cell = re.sub(r'<[^>]+>', '', cell)
                # Decode HTML entities
                cell = html.unescape(cell)
                # Strip whitespace
                cell = cell.strip()
                cleaned_cells.append(cell)
            
            # Check if this looks like a data row (has candidate name and votes)
            if cleaned_cells and cleaned_cells[0]:
                # Skip header rows
                first_lower = cleaned_cells[0].lower()
                if 'party' not in first_lower and 'candidate' not in first_lower:
                    candidates.append(cleaned_cells)
    
    # The table structure is: [color] | Party | Candidate | Votes
    # Extract winner and runner-up
    if len(candidates) >= 1:
        winner = candidates[0]
        # Structure could be: [color, party, candidate, votes] or [party, candidate, votes]
        if len(winner) >= 4:
            # Has color cell at start
            result['winnerParty'] = winner[1] if winner[1] else None
            result['winner'] = winner[2] if winner[2] else None
            votes_str = winner[3] if len(winner) > 3 else ''
        elif len(winner) == 3:
            result['winnerParty'] = winner[0] if winner[0] else None
            result['winner'] = winner[1] if winner[1] else None
            votes_str = winner[2] if winner[2] else None
        else:
            votes_str = None
        
        # Extract number from votes
        if votes_str:
            votes_match = re.search(r'([\d,]+)', str(votes_str))
            if votes_match:
                try:
                    result['winnerVotes'] = int(votes_match.group(1).replace(',', ''))
                except:
                    pass
    
    if len(candidates) >= 2:
        runner = candidates[1]
        if len(runner) >= 4:
            result['runnerUpParty'] = runner[1] if runner[1] else None
            result['runnerUp'] = runner[2] if runner[2] else None
            votes_str = runner[3] if len(runner) > 3 else ''
        elif len(runner) == 3:
            result['runnerUpParty'] = runner[0] if runner[0] else None
            result['runnerUp'] = runner[1] if runner[1] else None
            votes_str = runner[2] if runner[2] else None
        else:
            votes_str = None
        
        if votes_str:
            votes_match = re.search(r'([\d,]+)', str(votes_str))
            if votes_match:
                try:
                    result['runnerUpVotes'] = int(votes_match.group(1).replace(',', ''))
                except:
                    pass
    
    # Check completeness
    if result['winner'] and result['winnerParty'] and result['winnerVotes'] is not None:
        if result['runnerUp'] and result['runnerUpParty'] and result['runnerUpVotes'] is not None:
            result['status'] = 'complete'
    
    return result

def main():
    results = []
    incomplete = []
    errors = []
    
    print(f"Fetching data for {len(CONSTITUENCIES)} constituencies...")
    
    for i, (name, wiki_page) in enumerate(CONSTITUENCIES):
        print(f"[{i+1}/{len(CONSTITUENCIES)}] Fetching {name}...", end=' ', flush=True)
        
        html_content = fetch_page(wiki_page)
        if html_content:
            data = parse_election_data(html_content, name)
            results.append(data)
            if data['status'] == 'complete':
                winner_short = data['winner'][:15] + '...' if data['winner'] and len(data['winner']) > 15 else data['winner']
                print(f"✓ ({winner_short})")
            elif data['status'] == 'incomplete':
                print(f"⚠ (incomplete - W:{data['winner'] is not None}/P:{data['winnerParty'] is not None}/V:{data['winnerVotes'] is not None})")
                incomplete.append(name)
            else:
                print(f"✗ ({data.get('error', 'error')})")
                errors.append(name)
        else:
            print("✗ (fetch failed)")
            errors.append(name)
            results.append({
                'constituency': name,
                'winner': None,
                'winnerParty': None,
                'winnerVotes': None,
                'runnerUp': None,
                'runnerUpParty': None,
                'runnerUpVotes': None,
                'status': 'error',
                'error': 'Fetch failed'
            })
        
        # Be nice to Wikipedia's servers
        time.sleep(0.3)
    
    # Save results
    with open('nepal_2017_election_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n\nSummary:")
    print(f"Total constituencies: {len(CONSTITUENCIES)}")
    print(f"Complete: {len([r for r in results if r['status'] == 'complete'])}")
    print(f"Incomplete: {len(incomplete)}")
    print(f"Errors: {len(errors)}")
    
    if incomplete:
        print(f"\nIncomplete constituencies: {', '.join(incomplete[:10])}{'...' if len(incomplete) > 10 else ''}")
    if errors:
        print(f"\nErrors in: {', '.join(errors[:10])}{'...' if len(errors) > 10 else ''}")
    
    print(f"\nResults saved to nepal_2017_election_results.json")

if __name__ == '__main__':
    main()
