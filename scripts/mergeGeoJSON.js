// Script to merge all constituency GeoJSON files into one
const fs = require('fs');
const path = require('path');

const geoJsonDir = path.join(__dirname, '../public/maps/geojson');
const outputPath = path.join(__dirname, '../public/maps/nepal-constituencies.geojson');

// District name mapping: GeoJSON name -> Election data name
const districtNameMap = {
  'Chitawan': 'Chitwan',
  'Kabhrepalanchok': 'Kavrepalanchok',
  'Kapilbastu': 'Kapilvastu',
  'Makawanpur': 'Makwanpur',
  'Nawalparasi_E': 'Nawalpur',
  'Nawalparasi_W': 'Nawalparasi West',
  'Rukum_E': 'Rukum East',
  'Rukum_W': 'Rukum West',
  'Tanahu': 'Tanahun',
};

// Read all Const_dist-*.json files
const files = fs.readdirSync(geoJsonDir)
  .filter(f => f.startsWith('Const_dist-') && f.endsWith('.json'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

console.log(`Found ${files.length} GeoJSON files to merge`);

const allFeatures = [];

files.forEach(file => {
  const filePath = path.join(geoJsonDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const geojson = JSON.parse(content);

  if (geojson.features) {
    geojson.features.forEach(feature => {
      // Get district name and map it if needed
      let district = feature.properties.DISTRICT;
      if (districtNameMap[district]) {
        district = districtNameMap[district];
      }

      const constNum = feature.properties.F_CONST;
      feature.properties.constituencyId = `${district}-${constNum}`;
      feature.properties.DISTRICT_MAPPED = district; // Store mapped name
      allFeatures.push(feature);
    });
  }
});

const merged = {
  type: 'FeatureCollection',
  features: allFeatures
};

fs.writeFileSync(outputPath, JSON.stringify(merged));
console.log(`Merged ${allFeatures.length} constituencies into ${outputPath}`);

// Verify mapping
const { constituencies } = require('../data/constituencies.js');
const lookup = {};
constituencies.forEach(c => {
  const match = c.name.match(/(\d+)$/);
  const constNum = match ? parseInt(match[1]) : 1;
  const key = `${c.district}-${constNum}`;
  lookup[key] = c;
});

let matched = 0;
let unmatched = [];
allFeatures.forEach(f => {
  const key = f.properties.constituencyId;
  if (lookup[key]) {
    matched++;
  } else {
    unmatched.push(key);
  }
});

console.log(`\nMatched: ${matched}/${allFeatures.length}`);
if (unmatched.length > 0) {
  console.log('Unmatched:', unmatched.slice(0, 10), unmatched.length > 10 ? `... and ${unmatched.length - 10} more` : '');
}
