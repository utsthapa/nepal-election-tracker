# GeoJSON Data Sources for Nepal Constituencies

## Priority Sources

### 1. Election Commission of Nepal (ECN)
**URL**: https://election.gov.np
**What to look for**:
- Official GIS data portal
- Parliamentary constituency shapefiles
- Downloadable GeoJSON or Shapefile formats

**Pros**:
- Most accurate and official boundaries
- Matches exactly with your constituency IDs
- Updated for 2022 delimitation

**Cons**:
- May require registration or contact
- Data might be in Shapefile format (needs conversion)

### 2. Humanitarian Data Exchange (HDX)
**URL**: https://data.humdata.org
**Search terms**: "Nepal", "administrative boundaries", "constituencies"

**Specific datasets to check**:
- Nepal Administrative Level 3 (Districts)
- Nepal Administrative Level 4 (Municipalities/VDCs)
- Nepal Electoral Boundaries

**Pros**:
- Free and open access
- Multiple formats available (GeoJSON, Shapefile, KML)
- Curated by humanitarian community

**Cons**:
- May not have constituency-level boundaries
- Might need to aggregate from lower levels

### 3. GADM (Global Administrative Areas)
**URL**: https://gadm.org
**Download**: https://geodata.ucdavis.edu/gadm/gadm4.2/shp/gadm41_NEP_shp.zip

**Levels available**:
- Level 0: Country
- Level 1: Province (7)
- Level 2: District (77)
- Level 3: Municipality/VDC (753)
- Level 4: Wards (6,743)

**Pros**:
- Free for non-commercial use
- Well-documented
- Consistent format

**Cons**:
- No constituency boundaries (only administrative)
- Would need to aggregate municipalities

### 4. OpenStreetMap (via Overpass API)
**URL**: https://overpass-turbo.eu/

**Query to try**:
```overpass
[out:json][timeout:300];
relation["boundary"="administrative"]["admin_level"="4"]["name:en"~"Constituency"](27.0,80.0,29.0,89.0);
out geom;
```

**Pros**:
- Free and open
- Can query specific areas
- Community-maintained

**Cons**:
- May not have complete coverage
- Data quality varies
- Requires technical knowledge

### 5. Nepal GIS Portal
**URL**: https://gis.gov.np
**What to look for**:
- National GIS database
- Electoral boundary layers
- Download section

**Pros**:
- Official government source
- Likely to have constituency data
- Multiple formats

**Cons**:
- Website may be slow or unavailable
- May require registration

## Fallback Strategy: District-Level Boundaries

If constituency-level boundaries are unavailable, use district-level boundaries (77 districts):

### Why this works:
- Each district contains 1-5 constituencies
- Can show aggregate results per district
- Still provides geographical context
- Much easier to find data

### Implementation:
```javascript
// Aggregate constituency results by district
const districtResults = {};
constituencies.forEach(c => {
  if (!districtResults[c.district]) {
    districtResults[c.district] = {
      totalSeats: 0,
      partySeats: {}
    };
  }
  const winner = fptpResults[c.id]?.winner || 'Others';
  districtResults[c.district].totalSeats++;
  districtResults[c.district].partySeats[winner] =
    (districtResults[c.district].partySeats[winner] || 0) + 1;
});

// Color districts by dominant party
const getDistrictColor = (district) => {
  const results = districtResults[district];
  const dominantParty = Object.entries(results.partySeats)
    .sort((a, b) => b[1] - a[1])[0][0];
  return PARTIES[dominantParty]?.color || PARTIES['Others'].color;
};
```

## Data Conversion Tools

If you find Shapefile (.shp) data, convert to GeoJSON:

### Option 1: Online Converter
- **Mapshaper**: https://mapshaper.org/
  - Upload .shp, .dbf, .shx files
  - Export as GeoJSON
  - Can simplify geometries

### Option 2: Command Line
```bash
# Install ogr2ogr
brew install gdal  # macOS
apt install gdal-bin  # Ubuntu

# Convert shapefile to GeoJSON
ogr2ogr -f GeoJSON -t_srs EPSG:4326 output.geojson input.shp
```

### Option 3: Python
```python
import geopandas as gpd

# Read shapefile
gdf = gpd.read_file('input.shp')

# Convert to GeoJSON
gdf.to_file('output.geojson', driver='GeoJSON')
```

## Data Validation

After obtaining GeoJSON, validate:

```javascript
// Check all constituencies are present
const geojsonIds = new Set(geojson.features.map(f => f.properties.id));
const requiredIds = new Set(constituencies.map(c => c.id));

const missing = [...requiredIds].filter(id => !geojsonIds.has(id));
console.log('Missing constituencies:', missing);

// Check coordinate system (should be WGS84/EPSG:4326)
const sampleCoord = geojson.features[0].geometry.coordinates[0][0];
console.log('Sample coordinate:', sampleCoord);
// Should be: [longitude, latitude] in decimal degrees
```

## Data Quality Checks

1. **Completeness**: All 165 constituencies present
2. **Accuracy**: Boundaries match official delimitation
3. **Topology**: No gaps or overlaps between polygons
4. **Projection**: WGS84 (EPSG:4326) for web mapping
5. **Simplification**: Reasonable detail level (not too many points)

## Recommended Workflow

1. **Search ECN website first** (most likely to have official data)
2. **Check HDX for electoral boundaries**
3. **Use GADM as fallback** (district-level)
4. **Convert Shapefile to GeoJSON** if needed
5. **Validate against existing constituency IDs**
6. **Test in map viewer** before integrating

## Quick Test

Before full integration, test GeoJSON in a simple viewer:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="map" style="height: 100vh;"></div>
  <script>
    const map = L.map('map').setView([28.3949, 84.1240], 7);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
    fetch('constituencies.geojson')
      .then(r => r.json())
      .then(data => {
        L.geoJSON(data, {
          style: { color: '#fff', weight: 1, fillOpacity: 0.7 }
        }).addTo(map);
      });
  </script>
</body>
</html>
```

## Contact Information

If you can't find data, consider contacting:

- **Election Commission of Nepal**: info@election.gov.np
- **Survey Department**: info@dos.gov.np
- **Nepal GIS Portal**: gis@gov.np
- **OpenStreetMap Nepal Community**: https://community.osm.np

Be specific in your request:
- Need 2022 parliamentary constituency boundaries
- Prefer GeoJSON format
- For non-commercial educational use
