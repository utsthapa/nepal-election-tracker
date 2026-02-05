# Geographical Map Implementation Plan

## Overview
Replace the hex-based visualization with an actual geographical map of Nepal showing the 165 parliamentary constituencies filled with winning party colors.

## Current State Analysis

### Existing Components
- **HexMap.jsx**: Displays constituencies as hexagons in a grid layout
- **ConstituencyTable.jsx**: Table-based view of all constituencies
- **constituencies.js**: Contains 165 constituencies with election data (votes, winners, margins)
- **PARTIES**: Color-coded party definitions (NC, UML, Maoist, RSP, RPP, JSPN, US, JP, LSP, NUP, Others)

### Key Observations
- HexMap component exists but is not currently used in the main app
- Main app uses ConstituencyTable for constituency display
- temp_map.html shows Leaflet has been used previously for mapping
- No GeoJSON data currently exists in the project

## Technical Approach

### 1. Mapping Library Selection

**Recommended: react-leaflet**
- **Pros**:
  - Lightweight and well-maintained
  - Easy integration with React
  - Good documentation and community support
  - Supports GeoJSON natively
  - Works well with existing Tailwind CSS styling
  - No API keys required (uses OpenStreetMap tiles)

**Alternative Options**:
- **react-map-gl (Mapbox)**: More features but requires API key
- **d3-geo**: Powerful but steeper learning curve
- **react-simple-maps**: Simple but less flexible

### 2. GeoJSON Data Strategy

**Challenge**: Finding accurate GeoJSON for Nepal's 165 parliamentary constituencies

**Potential Sources**:
1. **Election Commission of Nepal (ECN)** - Official source
2. **Humanitarian Data Exchange (HDX)** - Nepal administrative boundaries
3. **GADM** - Global administrative areas
4. **OpenStreetMap** - Via Overpass API
5. **Nepal GIS Portal** - Government GIS data

**Fallback Strategy**:
- If constituency-level boundaries unavailable, use district-level boundaries (77 districts)
- Group constituencies by district and show aggregate results
- This is less ideal but still provides geographical context

**Data Structure Required**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "P1-25",
        "name": "Bhojpur",
        "province": 1,
        "district": "Bhojpur"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      }
    }
  ]
}
```

### 3. Component Architecture

```
components/
├── GeoMap.jsx              # Main map component (new)
├── ConstituencyPolygon.jsx # Individual constituency polygon (new)
├── MapTooltip.jsx          # Hover tooltip (new)
└── MapLegend.jsx           # Party color legend (new)
```

### 4. GeoMap Component Design

**Props**:
```javascript
{
  fptpResults: Object,      // Current election results
  overrides: Object,        // Manual overrides
  onSelectConstituency: Function,
  showProvinceBoundaries: Boolean
}
```

**Features**:
- Display all 165 constituency polygons
- Fill color based on winning party
- Highlight overridden constituencies
- Hover effects with tooltip
- Click to select constituency
- Zoom and pan controls
- Fit bounds to show entire Nepal
- Province boundary overlay
- Responsive design

### 5. Integration Points

**State Management**:
- Use existing `useElectionState` hook
- Leverage `fptpResults`, `overrides`, `onSelectConstituency`
- No changes to existing state logic needed

**UI Integration**:
- Option A: Replace ConstituencyTable entirely
- Option B: Add toggle between Table and Map views
- Option C: Display both side-by-side on large screens

**Recommended**: Option B (toggle) for best UX

## Implementation Steps

### Phase 1: Data Acquisition & Setup
1. Research and download GeoJSON data for Nepal constituencies
2. Validate data completeness (all 165 constituencies present)
3. Match constituency IDs with existing data in constituencies.js
4. Create `data/constituencies.geojson` file

### Phase 2: Library Installation
1. Install react-leaflet: `npm install react-leaflet leaflet`
2. Install types (if using TypeScript): `npm install @types/leaflet`
3. Add Leaflet CSS to globals.css

### Phase 3: Component Development
1. Create `GeoMap.jsx` with Leaflet MapContainer
2. Create `ConstituencyPolygon.jsx` for individual polygons
3. Implement color mapping based on party winners
4. Add hover and click handlers
5. Create tooltip component with constituency details

### Phase 4: Advanced Features
1. Add province boundary overlay
2. Implement map controls (zoom, pan, fit bounds)
3. Create legend component
4. Add loading state
5. Optimize polygon rendering (simplify geometries if needed)

### Phase 5: Integration
1. Update `app/page.jsx` to import GeoMap
2. Add view toggle (Table/Map)
3. Ensure responsive layout
4. Test with existing state management
5. Verify all interactions work correctly

### Phase 6: Polish & Optimization
1. Performance optimization (165 polygons)
2. Accessibility improvements
3. Mobile responsiveness
4. Error handling
5. Documentation

## Key Technical Considerations

### Performance
- 165 polygons may cause rendering lag
- Use `useMemo` for GeoJSON processing
- Consider simplifying polygon geometries
- Implement virtualization if needed
- Use Leaflet's built-in optimization features

### Styling
- Match existing dark theme (bg-surface, border-neutral)
- Use Tailwind classes for container styling
- Custom Leaflet CSS for map-specific styles
- Ensure contrast for accessibility

### Data Mapping
```javascript
const getPartyColor = (constituencyId, fptpResults, overrides) => {
  const result = fptpResults[constituencyId];
  const winner = result?.winner || 'Others';
  return PARTIES[winner]?.color || PARTIES['Others'].color;
};
```

### Province Boundaries
- Use separate GeoJSON layer
- Style with different stroke color/width
- Add toggle to show/hide
- Label provinces on hover

## Risk Mitigation

### Risk 1: GeoJSON Data Unavailable
**Mitigation**: Use district-level boundaries as fallback
- 77 districts vs 165 constituencies
- Show aggregate results per district
- Still provides geographical context

### Risk 2: Performance Issues
**Mitigation**: Multiple optimization strategies
- Simplify polygon geometries
- Use WebGL renderer
- Implement level-of-detail
- Lazy load off-screen polygons

### Risk 3: ID Mismatch
**Mitigation**: Robust data matching logic
- Fuzzy matching on names
- Manual mapping table for edge cases
- Validation script to check coverage

## Success Criteria

1. ✅ Map displays all 165 constituencies with correct boundaries
2. ✅ Constituencies colored by winning party
3. ✅ Hover shows constituency details (name, district, winner, vote share)
4. ✅ Click opens constituency override drawer
5. ✅ Manual overrides visually highlighted
6. ✅ Province boundaries visible and toggleable
7. ✅ Map responsive on mobile and desktop
8. ✅ Performance smooth (no lag on pan/zoom)
9. ✅ Accessible (keyboard navigation, screen reader support)
10. ✅ Matches existing dark theme design

## File Structure

```
nepalpoltiics/
├── data/
│   ├── constituencies.js          # Existing election data
│   └── constituencies.geojson     # NEW: Geographical boundaries
├── components/
│   ├── GeoMap.jsx                # NEW: Main map component
│   ├── ConstituencyPolygon.jsx    # NEW: Polygon component
│   ├── MapTooltip.jsx            # NEW: Tooltip component
│   └── MapLegend.jsx             # NEW: Legend component
├── app/
│   ├── globals.css               # Add Leaflet CSS
│   └── page.jsx                 # Add map view toggle
└── package.json                 # Add react-leaflet dependency
```

## Next Steps

1. **Immediate**: Research GeoJSON data sources
2. **Short-term**: Install dependencies and create basic map
3. **Medium-term**: Integrate with election state
4. **Long-term**: Polish and optimize

## Questions for User

1. Do you have a preference for map tile provider (OpenStreetMap, CartoDB, etc.)?
2. Should we prioritize constituency-level or district-level boundaries?
3. Do you want the map to replace the table or be an additional view?
4. Any specific styling preferences for the map?
