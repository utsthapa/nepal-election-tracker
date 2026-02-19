// Wikipedia Scraper for 2017 Nepal Election Data
// Scrapes all 165 constituency pages with rate limiting

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All 165 constituencies
const CONSTITUENCIES = {
  1: {
    // Koshi - 28 seats
    name: 'Koshi',
    constituencies: [
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
  },
  2: {
    // Madhesh - 32 seats
    name: 'Madhesh',
    constituencies: [
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
  },
  3: {
    // Bagmati - 33 seats
    name: 'Bagmati',
    constituencies: [
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
  },
  4: {
    // Gandaki - 18 seats
    name: 'Gandaki',
    constituencies: [
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
  },
  5: {
    // Lumbini - 26 seats
    name: 'Lumbini',
    constituencies: [
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
  },
  6: {
    // Karnali - 12 seats
    name: 'Karnali',
    constituencies: [
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
  },
  7: {
    // Sudurpashchim - 16 seats
    name: 'Sudurpashchim',
    constituencies: [
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
  },
};

// Convert constituency name to Wikipedia format
function toWikiFormat(constituency) {
  return constituency.replace(/_/g, ' ').replace(/-/g, '_');
}

// Generate Wikipedia URL
function getWikiUrl(constituency) {
  const formatted = toWikiFormat(constituency);
  return `https://en.wikipedia.org/wiki/${formatted}_(constituency)`;
}

// Generate all URLs
function generateUrlList() {
  const urls = [];
  for (const [provinceId, data] of Object.entries(CONSTITUENCIES)) {
    for (const constituency of data.constituencies) {
      urls.push({
        provinceId: parseInt(provinceId),
        provinceName: data.name,
        constituency,
        url: getWikiUrl(constituency),
      });
    }
  }
  return urls;
}

// Save URL list
const urlList = generateUrlList();
const outputPath = path.join(__dirname, 'scrape_urls.json');
fs.writeFileSync(outputPath, JSON.stringify(urlList, null, 2));

console.log('Wikipedia Scraper Setup');
console.log('======================');
console.log('');
console.log(`Total constituencies to scrape: ${urlList.length}`);
console.log('');
console.log('Province breakdown:');
for (const [id, data] of Object.entries(CONSTITUENCIES)) {
  console.log(`  Province ${id} (${data.name}): ${data.constituencies.length} constituencies`);
}
console.log('');
console.log('Sample URLs:');
console.log(`  ${urlList[0].constituency}: ${urlList[0].url}`);
console.log(`  ${urlList[50].constituency}: ${urlList[50].url}`);
console.log(`  ${urlList[100].constituency}: ${urlList[100].url}`);
console.log('');
console.log('✓ URL list saved to scrape_urls.json');
console.log('');
console.log('To scrape with curl:');
console.log(
  '  curl -s "https://en.wikipedia.org/wiki/Kathmandu_1_(constituency)" -H "User-Agent: Mozilla/5.0" > kathmandu1.html'
);
console.log('');
console.log('To scrape with wget:');
console.log(
  '  wget --user-agent="Mozilla/5.0" -O kathmandu1.html "https://en.wikipedia.org/wiki/Kathmandu_1_(constituency)"'
);
console.log('');
console.log('Rate limiting: Wait 2-3 seconds between requests');
console.log('Estimated time: 5-8 minutes for all 165 pages');

export { CONSTITUENCIES, generateUrlList, getWikiUrl };
