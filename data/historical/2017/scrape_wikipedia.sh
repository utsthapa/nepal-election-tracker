#!/bin/bash

# Wikipedia Scraper for Nepal 2017 Election Data
# Scrapes all 165 constituency pages with rate limiting

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML_DIR="$SCRIPT_DIR/html_cache"
mkdir -p "$HTML_DIR"

echo "Wikipedia Scraper - 2017 Nepal Election"
echo "======================================="
echo ""

# Generate URL list with node
echo "Generating URL list..."
node generate_urls.js
if [ ! -f "scrape_urls.json" ]; then
    echo "Error: scrape_urls.json not found."
    exit 1
fi

TOTAL=$(node -e "console.log(Object.keys(require('./scrape_urls.json').length)" 2>&1)
echo "Total constituencies to scrape: $TOTAL"
echo ""

# Function to scrape a single page
scrape_page() {
    local idx=$1
    local constituency=$2
    local url=$3
    local output_file="$HTML_DIR/${constituency}.html"
    
    # Skip if already downloaded
    if [ -f "$output_file" ] && [ -s "$output_file" ]; then
        echo "[$idx/$TOTAL] ✓ $constituency (cached)"
        return 0
    fi
    
    echo "[$idx/$TOTAL] Downloading $constituency..."
    
    # Download with curl
    if curl -s -L "$url" \
        -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
        -H "Accept: text/html" \
        --max-time 30 \
        -o "$output_file"; then
        
        # Check if file was downloaded successfully
        if [ -s "$output_file" ]; then
            echo "  ✓ Saved to ${constituency}.html"
        else
            echo "  ✗ Empty file"
            rm -f "$output_file"
        fi
    else
        echo "  ✗ Download failed"
        rm -f "$output_file"
    fi
}

# Main scraping loop
echo "Starting download..."
echo "Rate limit: 2 seconds between requests"
echo ""

for ((i=0; i<TOTAL; i++)); do
    constituency=$(jq -r ".[$i].constituency" "$URL_FILE")
    url=$(jq -r ".[$i].url" "$URL_FILE")
    
    scrape_page $((i+1)) "$constituency" "$url"
    
    # Rate limiting: 2 seconds between requests
    if [ $i -lt $((TOTAL-1)) ]; then
        sleep 2
    fi
done

echo ""
echo "======================================="
echo "Scraping complete!"
echo ""
echo "Downloaded files: $(ls -1 $HTML_DIR/*.html 2>/dev/null | wc -l) / $TOTAL"
echo "HTML cache location: $HTML_DIR"
echo ""
echo "Next step: Parse HTML files to extract 2017 election data"
