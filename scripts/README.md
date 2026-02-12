# Data Processing Scripts

This directory contains development scripts for generating, validating, and processing election data. These scripts are **development tools only** and are not part of the production application.

## Scripts Overview

### `generate-constituencies.js`
Generates constituency data from source files.

**Purpose**: Process raw election data into the structured format used by the application.

**Usage**:
```bash
node scripts/generate-constituencies.js
```

**Output**: Updates `/data/constituencies.js`

---

### `rebuild-constituencies.js`
Rebuilds constituency mappings and metadata.

**Purpose**: Regenerate constituency ID mappings and ensure data integrity across all 165 constituencies.

**Usage**:
```bash
node scripts/rebuild-constituencies.js
```

**Output**: Updates constituency lookup tables

---

### `mergeGeoJSON.js`
Merges multiple GeoJSON files into a single consolidated file.

**Purpose**: Combine district or constituency boundary files from different sources.

**Usage**:
```bash
node scripts/mergeGeoJSON.js
```

**Input**: Individual GeoJSON files in `/data/geojson/`
**Output**: Merged GeoJSON file

---

### `mergeDistricts.js`
Merges district-level data across multiple sources.

**Purpose**: Consolidate district demographic and electoral data from various datasets.

**Usage**:
```bash
node scripts/mergeDistricts.js
```

**Output**: Updates `/data/demographics.js`

---

## Development Notes

### Console Output
All scripts use `console.log` for progress reporting. This is **intentional** for development tools and does not indicate a code quality issue.

### When to Run
- After updating source election data
- When adding new constituencies or districts
- Before major data releases
- To regenerate mappings after structural changes

### Data Sources
Scripts expect source data in specific formats:
- Election results: CSV from Election Commission of Nepal
- GeoJSON: Natural Earth or OpenStreetMap exports
- Demographics: Nepal Census Bureau formats

### Error Handling
Scripts include basic error handling but are meant for developer use. Always review output and validate results before committing changes to `/data`.

## Adding New Scripts

When creating new data processing scripts:
1. Place in `/scripts` directory
2. Document purpose and usage in this README
3. Use clear console logging for progress
4. Validate output before committing to `/data`
5. Include error handling for missing files

## Common Issues

### Missing Source Files
Ensure source data files exist in expected locations before running scripts.

### Encoding Issues
Use UTF-8 encoding for all data files. Some legacy files had encoding problems (see `constituencies_old_utf8.js` history).

### GeoJSON Validation
Always validate GeoJSON output with tools like [geojson.io](https://geojson.io) before using in production.

## Related Files

- `/data/constituencies.js` - Main constituency data (generated)
- `/data/demographics.js` - District demographics (generated)
- `/data/geojson/` - Map boundary files (source & generated)
