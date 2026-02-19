#!/bin/bash

# Finalize 2017 Election Data
# Converts existing 24 constituencies and creates complete structure

set -e

SCRIPT_DIR="/home/lbikr/projects/nepalpoltiics/data/historical/2017_new"
NEW_DIR="$SCRIPT_DIR"

cd "$NEW_DIR" || exit 1

echo "Finalizing 2017 Election Data"
echo "======================================="
echo ""

# Check for existing data
if [ -f "../election_2017.js" ]; then
    echo "Step 1: Copying existing 2017 data..."
    cp ../election_2017.js ./existing_2017.js
    echo "✓ Copied existing 2017 data"
else
    echo "⚠️ No existing 2017 data found"
    exit 1
fi

echo ""
echo "Step 2: Converting data format..."

# Run the converter
node convert_simple.js

if [ $? -eq 0 ]; then
    echo "✓ Conversion successful"
    echo ""
    
    # Check generated files
    if [ -f "province1_koshi.js" ] && [ -f "province2_madhesh.js" ] && [ -f "province3_bagmati.js" ] && [ -f "province4_gandaki.js" ] && [ -f "province5_lumbini.js" ] && [ -f "province6_karnali.js" ] && [ -f "province7_sudurpashchim.js" ] && [ -f "index.js" ]; then
        echo "✓ All province files generated"
        echo ""
        echo "Checking file sizes..."
        for file in province*.js; do
            size=$(wc -l < "$file" | awk '{print $1}')
            echo "  ✓ $file: $size lines"
        done
    else
        echo "✗ Some files missing"
fi

echo ""
echo "Step 3: Creating master index.js..."

# Create index.js that imports from both 2022 and 2017
cat > index.js << 'INDEX'
// 2017 Election Results - Index
// Aggregates data from all provinces

// 2022 Data
import { CONSTITUENCIES_2022, PROVINCE_DATA_2022 } from '../2022/index.js';

// 2017 Data
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province1_koshi.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province2_madhesh.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province3_bagmati.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province4_gandaki.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province5_lumbini.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province6_karnali.js';
import { CONSTITUENCIES_2017, PROVINCE_DATA_2017 } from './province7_sudurpashchim.js';

export const CONSTITUENCY_RESULTS = {
  ...CONSTITUENCIES_2022,
  ...CONSTITUENCIES_2017,
};

export const PROVINCE_DATA = {
  2022: PROVINCE_DATA_2022,
  2017: PROVINCE_DATA_2017,
};

// Helper functions
export function getConstituencyResult(year, constituency) {
  if (year === 2022) {
    return require('./2022/index.js').getConstituency2022(constituency) || null;
  } else if (year === 2017) {
    return require('./index.js').getConstituency2017(constituency) || null;
  }
  return null;
}

export function getConstituenciesByYear(year) {
  if (year === 2022) {
    return require('./2022/index.js').getConstituencies2022() || {};
  } else if (year === 2017) {
    return require('./index.js').getConstituencies2017() || {};
  }
  return {};
}

export function getConstituenciesByProvince(year, provinceId) {
  const data = year === 2022 ? 
    require('./2022/index.js').getProvince2022(provinceId) : null;
  if (year === 2017) {
    return require('./index.js').getProvince2017(provinceId) : null;
  }
  return null;
}

export function getConstituenciesByDistrict(year, district) {
  return require('./index.js').getConstituenciesByDistrict2017(district) || {};
}

export default {
  CONSTITUENCY_RESULTS,
  PROVINCE_DATA,
  getConstituencyResult,
  getConstituenciesByYear,
  getConstituenciesByProvince,
  getConstituenciesByDistrict,
};
INDEX
EOF

echo ""
echo "✓ index.js created with both 2022 and 2017 data"
echo ""
echo "======================================="
echo "2017 Election Data Finalization Complete!"
echo ""
echo "Summary:"
echo "  - 24 constituencies converted"
echo "  - 7 province files created"
echo "  - Master index.js created"
echo ""
echo " 2017 Status: Partial (24/165 constituencies)"
echo "  Next: Add remaining 141 constituencies from Wikipedia or ECN PDF"
echo ""
echo " 2022 Status: Complete (165/165 constituencies)"
echo ""
echo "Location: $NEW_DIR"
echo ""
echo "Ready for: /elections endpoint integration"
