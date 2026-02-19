#!/bin/bash

# Master Script for 2017 Wikipedia Data Extraction
# Orchestrates scraping, parsing, and data generation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "2017 Wikipedia Data Extraction - Master Script"
echo "=============================================="
echo ""

# Step 1: Generate URLs
echo "Step 1: Generating URL list..."
if [ ! -f "scrape_urls.json" ]; then
    node generate_urls.js
else
    echo "  ✓ URL list already exists"
fi
echo ""

# Step 2: Download HTML pages
echo "Step 2: Downloading Wikipedia pages..."
echo "  This will take approximately 5-8 minutes"
echo "  Press Ctrl+C to cancel, or wait 3 seconds to continue..."
sleep 3

./scrape_wikipedia.sh
echo ""

# Step 3: Parse HTML files
echo "Step 3: Parsing HTML files..."
node parse_html.js
echo ""

# Step 4: Generate JavaScript data files
echo "Step 4: Generating JavaScript data files..."
node generate_js_files.js
echo ""

echo "=============================================="
echo "Extraction complete!"
echo ""
echo "Generated files:"
echo "  - province1_koshi.js"
echo "  - province2_madhesh.js"
echo "  - province3_bagmati.js"
echo "  - province4_gandaki.js"
echo "  - province5_lumbini.js"
echo "  - province6_karnali.js"
echo "  - province7_sudurpashchim.js"
echo "  - index.js"
echo ""
echo "Location: $SCRIPT_DIR/"
