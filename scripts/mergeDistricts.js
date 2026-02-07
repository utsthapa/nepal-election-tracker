// Script to merge all district GeoJSON files into one
const fs = require('fs');
const path = require('path');

const geoJsonDir = path.join(__dirname, '../public/maps/geojson');
const outputPath = path.join(__dirname, '../public/maps/nepal-districts.geojson');

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

const provinces = [1, 2, 3, 4, 5, 6, 7];
console.log('Merging district GeoJSON files...');

const allFeatures = [];
const districtNames = new Set();

provinces.forEach(province => {
  const filePath = path.join(geoJsonDir, `District_STATE_C_${province}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Warning: File not found: ${filePath}`);
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(content);

    if (geojson.features) {
      geojson.features.forEach(feature => {
        let district = feature.properties.DISTRICT;
        
        if (districtNameMap[district]) {
          district = districtNameMap[district];
        }

        feature.properties.DISTRICT_MAPPED = district;
        feature.properties.PROVINCE = province;
        allFeatures.push(feature);
        districtNames.add(district);
      });
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
});

const merged = {
  type: 'FeatureCollection',
  name: 'Nepal_Districts',
  crs: {
    type: 'name',
    properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
  },
  features: allFeatures
};

fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));
console.log(`Merged ${allFeatures.length} districts into ${outputPath}`);
console.log(`Unique districts: ${districtNames.size}`);

const { constituencies } = require('../data/constituencies.js');
const constituencyDistricts = new Set(constituencies.map(c => c.district));

const matched = [...districtNames].filter(d => constituencyDistricts.has(d));
const unmatched = [...districtNames].filter(d => !constituencyDistricts.has(d));

console.log(`\nMatched ${matched.length}/${districtNames.size} districts with constituency data`);
if (unmatched.length > 0) {
  console.log('Unmatched districts:', unmatched);
}
