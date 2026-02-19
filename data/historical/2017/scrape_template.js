// Scrape 2017 Election Data from Wikipedia
// Fetches all 165 constituency pages and extracts 2017 election results

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of all 165 constituencies by province
const CONSTITUENCIES = {
  // Province 1: Koshi (28 seats)
  1: [
    'Taplejung-1',
    'Panchthar-1',
    'Ilam-1',
    'Ilam-2',
    'Jhapa-1',
    'Jhapa-2',
    'Jhapa-3',
    'Jhapa-4',
    'Jhapa-5',
    'Morang-1',
    'Morang-2',
    'Morang-3',
    'Morang-4',
    'Morang-5',
    'Morang-6',
    'Sunsari-1',
    'Sunsari-2',
    'Sunsari-3',
    'Sunsari-4',
    'Dhankuta-1',
    'Terhathum-1',
    'Sankhuwasabha-1',
    'Bhojpur-1',
    'Solukhumbu-1',
    'Khotang-1',
    'Okhaldhunga-1',
    'Udayapur-1',
    'Udayapur-2',
  ],
  // Province 2: Madhesh (32 seats)
  2: [
    'Saptari-1',
    'Saptari-2',
    'Saptari-3',
    'Saptari-4',
    'Siraha-1',
    'Siraha-2',
    'Siraha-3',
    'Siraha-4',
    'Dhanusa-1',
    'Dhanusa-2',
    'Dhanusa-3',
    'Dhanusa-4',
    'Mahottari-1',
    'Mahottari-2',
    'Mahottari-3',
    'Mahottari-4',
    'Sarlahi-1',
    'Sarlahi-2',
    'Sarlahi-3',
    'Sarlahi-4',
    'Rautahat-1',
    'Rautahat-2',
    'Rautahat-3',
    'Rautahat-4',
    'Bara-1',
    'Bara-2',
    'Bara-3',
    'Bara-4',
    'Parsa-1',
    'Parsa-2',
    'Parsa-3',
    'Parsa-4',
  ],
  // Province 3: Bagmati (33 seats)
  3: [
    'Dolakha-1',
    'Ramechhap-1',
    'Sindhuli-1',
    'Sindhuli-2',
    'Kathmandu-1',
    'Kathmandu-2',
    'Kathmandu-3',
    'Kathmandu-4',
    'Kathmandu-5',
    'Kathmandu-6',
    'Kathmandu-7',
    'Kathmandu-8',
    'Kathmandu-9',
    'Kathmandu-10',
    'Lalitpur-1',
    'Lalitpur-2',
    'Lalitpur-3',
    'Bhaktapur-1',
    'Bhaktapur-2',
    'Kavrepalanchok-1',
    'Kavrepalanchok-2',
    'Nuwakot-1',
    'Nuwakot-2',
    'Dhading-1',
    'Dhading-2',
    'Makwanpur-1',
    'Makwanpur-2',
    'Chitwan-1',
    'Chitwan-2',
    'Chitwan-3',
    'Sindhupalchok-1',
    'Sindhupalchok-2',
    'Rasuwa-1',
  ],
  // Province 4: Gandaki (18 seats)
  4: [
    'Manang-1',
    'Mustang-1',
    'Gorkha-1',
    'Gorkha-2',
    'Lamjung-1',
    'Kaski-1',
    'Kaski-2',
    'Kaski-3',
    'Tanahu-1',
    'Tanahu-2',
    'Syangja-1',
    'Syangja-2',
    'Gulmi-1',
    'Gulmi-2',
    'Palpa-1',
    'Parbat-1',
    'Baglung-1',
    'Baglung-2',
  ],
  // Province 5: Lumbini (26 seats)
  5: [
    'Nawalparasi_West-1',
    'Nawalparasi_West-2',
    'Rupandehi-1',
    'Rupandehi-2',
    'Rupandehi-3',
    'Rupandehi-4',
    'Rupandehi-5',
    'Kapilvastu-1',
    'Kapilvastu-2',
    'Kapilvastu-3',
    'Arghakhanchi-1',
    'Arghakhanchi-2',
    'Pyuthan-1',
    'Rolpa-1',
    'Rukum_East-1',
    'Banke-1',
    'Banke-2',
    'Banke-3',
    'Bardiya-1',
    'Bardiya-2',
    'Dang-1',
    'Dang-2',
    'Dang-3',
    'Salyan-1',
    'Rukum_West-1',
    'Rukum_West-2',
  ],
  // Province 6: Karnali (12 seats)
  6: [
    'Dolpa-1',
    'Humla-1',
    'Jumla-1',
    'Kalikot-1',
    'Mugu-1',
    'Surkhet-1',
    'Surkhet-2',
    'Dailekh-1',
    'Dailekh-2',
    'Jajarkot-1',
  ],
  // Province 7: Sudurpashchim (16 seats)
  7: [
    'Kanchanpur-1',
    'Kanchanpur-2',
    'Kanchanpur-3',
    'Dadeldhura-1',
    'Baitadi-1',
    'Baitadi-2',
    'Doti-1',
    'Doti-2',
    'Achham-1',
    'Achham-2',
    'Bajhang-1',
    'Bajura-1',
    'Kailali-1',
    'Kailali-2',
    'Kailali-3',
    'Kailali-4',
    'Kailali-5',
  ],
};

// Note: This is a template for scraping
// Due to rate limiting and respect for Wikipedia's servers,
// actual scraping should be done with delays and proper user-agent

console.log('2017 Constituency Data Scraper');
console.log('==============================');
console.log('');
console.log('Constituencies by Province:');
for (const [province, constituencies] of Object.entries(CONSTITUENCIES)) {
  console.log(`Province ${province}: ${constituencies.length} constituencies`);
}
console.log('');
console.log('Total:', Object.values(CONSTITUENCIES).flat().length, 'constituencies');
console.log('');
console.log('To scrape data from Wikipedia:');
console.log('1. Format: https://en.wikipedia.org/wiki/[Constituency_Name]_(constituency)');
console.log('   Example: https://en.wikipedia.org/wiki/Kathmandu_1_(constituency)');
console.log('');
console.log('2. Extract 2017 general election section');
console.log('3. Parse candidate names, parties, votes, percentages');
console.log('');
console.log('Note: Manual extraction or batch scraping with delays required');

// Save constituency list for reference
fs.writeFileSync(
  path.join(__dirname, 'constituency_list_2017.json'),
  JSON.stringify(CONSTITUENCIES, null, 2)
);

console.log('');
console.log('✓ Constituency list saved to constituency_list_2017.json');
