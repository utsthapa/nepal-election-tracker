const { constituencies } = require('./data/constituencies');

// Group constituencies by district
const byDistrict = {};
constituencies.forEach(c => {
  if (!byDistrict[c.district]) byDistrict[c.district] = [];
  byDistrict[c.district].push(c.id);
});

// Generate mapping
console.log('export const CONSTITUENCY_PROPORTIONS = {');

for (let p = 1; p <= 7; p++) {
  const provConstituencies = constituencies.filter(c => c.province === p);
  const districts = [...new Set(provConstituencies.map(c => c.district))];

  console.log(`  // Province ${p}`);

  districts.forEach(district => {
    const distConstituencies = provConstituencies.filter(c => c.district === district);
    const proportion = (1 / distConstituencies.length).toFixed(3);

    distConstituencies.forEach(c => {
      console.log(`  '${c.id}': { district: '${district}', proportion: ${proportion} },`);
    });
  });

  console.log('');
}

console.log('};');
