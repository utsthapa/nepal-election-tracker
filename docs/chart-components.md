# Interactive Chart Components for Analysis Articles

## Overview

The analysis articles now support interactive charts using React components. These charts are rendered using MDX and Recharts.

## Available Chart Components

### 1. `<BarChart>` - Simple Bar Chart

Displays a single series of bars.

**Props:**

- `data` (Array): Array of objects with data points
- `xKey` (string): Key for X-axis labels
- `yKey` (string): Key for Y-axis values
- `colors` (Array, optional): Custom colors for bars
- `height` (number, optional): Chart height in pixels (default: 300)

**Example:**

```jsx
<BarChart
  data={[
    { year: '2017', turnout: 68.8 },
    { year: '2022', turnout: 61.0 },
  ]}
  xKey="year"
  yKey="turnout"
  colors={['#B91C1C']}
  height={350}
/>
```

---

### 2. `<LineChart>` - Line Chart

Displays one or more line series over time or categories.

**Props:**

- `data` (Array): Array of objects with data points
- `xKey` (string): Key for X-axis labels
- `yKeys` (Array): Array of keys for Y-axis values (multiple series)
- `colors` (Array, optional): Custom colors for each line
- `height` (number, optional): Chart height in pixels (default: 300)

**Example:**

```jsx
<LineChart
  data={[
    { year: '1991', turnout: 65.2 },
    { year: '1994', turnout: 62.8 },
    { year: '1999', turnout: 65.8 },
    { year: '2008', turnout: 78.3 },
    { year: '2013', turnout: 78.6 },
    { year: '2017', turnout: 68.8 },
    { year: '2022', turnout: 61.0 },
  ]}
  xKey="year"
  yKeys={['turnout']}
  colors={['#B91C1C']}
  height={350}
/>
```

---

### 3. `<MultiBarChart>` - Multiple Bar Series

Displays multiple bar series side-by-side for comparison.

**Props:**

- `data` (Array): Array of objects with data points
- `xKey` (string): Key for X-axis labels
- `bars` (Array): Array of bar objects:
  - `key` (string): Data key for this bar series
  - `name` (string): Legend name for this bar series
  - `color` (string, optional): Custom color
- `height` (number, optional): Chart height in pixels (default: 300)

**Example:**

```jsx
<MultiBarChart
  data={[
    { area: 'Rural Mountain', year2017: 70.1, year2022: 68.2 },
    { area: 'Rural Hill', year2017: 66.3, year2022: 64.7 },
    { area: 'Rural Plains', year2017: 60.8, year2022: 58.1 },
    { area: 'Urban Hill', year2017: 57.5, year2022: 55.3 },
    { area: 'Urban Valley', year2017: 55.1, year2022: 52.8 },
  ]}
  xKey="area"
  bars={[
    { key: 'year2017', name: '2017', color: '#94A3B8' },
    { key: 'year2022', name: '2022', color: '#B91C1C' },
  ]}
  height={400}
/>
```

---

### 4. `<PieChart>` - Pie Chart

Displays proportions or percentages.

**Props:**

- `data` (Array): Array of objects with data points
- `nameKey` (string): Key for label names
- `valueKey` (string): Key for slice values
- `height` (number, optional): Chart height in pixels (default: 300)

**Example:**

```jsx
<PieChart
  data={[
    { name: '18-25', value: 19 },
    { name: '26-35', value: 26 },
    { name: '36-45', value: 23 },
    { name: '46-60', value: 20 },
    { name: '60+', value: 10 },
  ]}
  nameKey="name"
  valueKey="value"
  height={350}
/>
```

---

## Color Palette

Use these colors for consistency across articles:

- **Primary:** `#B91C1C` (burgundy)
- **Secondary:** `#94A3B8` (slate-400)
- **Success:** `#22C55E` (green-500)
- **Warning:** `#F59E0B` (amber-500)
- **Info:** `#3B82F6` (blue-500)
- **Purple:** `#8B5CF6` (violet-500)
- **Red:** `#EF4444` (red-500)

---

## Best Practices

1. **Add captions:** Always add a figure caption below charts:

   ```jsx
   <BarChart ... />
   *Figure: Voter turnout by province, 2022*
   ```

2. **Keep charts focused:** Each chart should tell one clear story
3. **Use appropriate height:** Adjust `height` prop based on number of data points:
   - Few data points (3-5): `height={300}`
   - Moderate data points (6-10): `height={350}`
   - Many data points (10+): `height={400}`

4. **Maintain accessibility:**
   - Charts are keyboard navigable
   - Tooltips provide detailed information on hover
   - Color choices consider colorblind users

5. **Mobile responsive:** All charts are responsive and adapt to screen size

---

## Complete Example Article

```mdx
---
title: 'Example Article with Charts'
excerpt: 'This article demonstrates using interactive charts'
author: 'Data Team'
date: '2026-02-17'
category: 'Analysis'
tags: ['example', 'charts']
readTime: '5-6'
---

# Example Article with Interactive Charts

## Turnout Over Time

<LineChart
  data={[
    { year: '1991', turnout: 65.2 },
    { year: '2008', turnout: 78.3 },
    { year: '2022', turnout: 61.0 },
  ]}
  xKey="year"
  yKeys={['turnout']}
  colors={['#B91C1C']}
  height={350}
/>

_Figure: National voter turnout trend, 1991-2022_

## Turnout by Province

<BarChart
  data={[
    { province: 'Karnali', turnout: 67.3 },
    { province: 'Bagmati', turnout: 58.2 },
    { province: 'Madhesh', turnout: 56.4 },
  ]}
  xKey="province"
  yKey="turnout"
  colors={['#B91C1C']}
  height={400}
/>

_Figure: Voter turnout by province, 2022_
```

---

## Troubleshooting

**Chart not rendering:**

- Check that all required props are provided
- Ensure `data` is a valid array
- Verify data keys match `xKey` and `yKey`/`yKeys`

**Data not showing:**

- Check browser console for errors
- Verify data structure matches expected format
- Ensure values are numbers, not strings

**Chart looks wrong:**

- Adjust `height` prop
- Check data order
- Verify colors are valid hex codes

---

## Future Enhancements

Planned additions:

- Time series with annotations
- Heatmap charts
- Scatter plots
- Stacked bar charts
- Area charts with fill
- Chart export functionality
- Data table toggle

For feature requests or issues, contact the development team.
