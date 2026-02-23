# Chart Recommendations for Analysis Articles

## Overview

This document provides specific chart recommendations for each analysis article to enhance data storytelling and reader engagement.

---

## 1. voter-turnout-analysis.mdx ✅ COMPLETED

**Charts Added:**

- ✅ Line chart: Turnout over time (1991-2022)
- ✅ Bar chart: Turnout by province (2022)
- ✅ Multi-bar chart: Urban-rural turnout gap (2017 vs 2022)
- ✅ Bar chart: Turnout by age group (2022)
- ✅ Pie chart: Share of actual voters by age

**All key data visualizations are complete.**

---

## 2. 30-years-democracy.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Government Duration Timeline** (Line Chart)
   - Data: Duration of each government since 1991
   - Story: Shows volatility and instability

   ```jsx
   <LineChart
     data={[...]}
     xKey="year"
     yKeys={['duration']}
     height={400}
   />
   ```

2. **Prime Minister Count** (Bar Chart)
   - Data: Number of PMs by decade
   - Story: Increasing frequency of leadership changes

   ```jsx
   <BarChart data={[...]} xKey="decade" yKey="pmCount" />
   ```

3. **Party Dominance Over Time** (Multi-Bar Chart)
   - Data: NC and UML seat share by election
   - Story: Shift in party system
   ```jsx
   <MultiBarChart data={[...]} xKey="election" bars={[...]} />
   ```

---

## 3. understanding-election-polls.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Poll Accuracy Comparison** (Bar Chart)
   - Data: Actual vs predicted results
   - Story: How well polls performed

   ```jsx
   <BarChart data={[...]} xKey="party" yKey="accuracy" />
   ```

2. **Poll Trend Over Time** (Line Chart)
   - Data: Party polling trends 6 months before election
   - Story: How voter intentions shifted

   ```jsx
   <LineChart data={[...]} xKey="month" yKeys={['nc', 'uml']} />
   ```

3. **Pollster Accuracy Rankings** (Bar Chart)
   - Data: Error rates by polling organization
   - Story: Which pollsters are most reliable
   ```jsx
   <BarChart data={[...]} xKey="pollster" yKey="errorRate" />
   ```

---

## 4. youth-voter-trends.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Youth Turnout vs Overall** (Multi-Bar Chart)
   - Data: Turnout rates by age group across elections
   - Story: Youth disengagement trend

   ```jsx
   <MultiBarChart data={[...]} xKey="election" bars={[...]} />
   ```

2. **Youth Policy Priorities** (Bar Chart)
   - Data: Survey responses on important issues
   - Story: What young voters care about

   ```jsx
   <BarChart data={[...]} xKey="issue" yKey="priority" />
   ```

3. **Youth Party Preference** (Pie Chart)
   - Data: Party support among 18-25 year olds
   - Story: Political leanings of younger generation
   ```jsx
   <PieChart data={[...]} nameKey="party" valueKey="support" />
   ```

---

## 5. regional-voting-patterns.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Voter Volatility by Province** (Bar Chart)
   - Data: Average swing by province
   - Story: Mountain regions most volatile

   ```jsx
   <BarChart data={[...]} xKey="province" yKey="volatility" />
   ```

2. **Identity Voting Decline** (Line Chart)
   - Data: Predictive power of identity over time
   - Story: Shift from identity to other factors

   ```jsx
   <LineChart data={[...]} xKey="year" yKeys={['identity']} />
   ```

3. **Regional Party Performance** (Multi-Bar Chart)
   - Data: Regional vs national party seat shares by province
   - Story: Where each party performs best

   ```jsx
   <MultiBarChart data={[...]} xKey="province" bars={[...]} />
   ```

4. **Urban Reform Party Support** (Bar Chart)
   - Data: RSP support in urban areas
   - Story: Urban political realignment
   ```jsx
   <BarChart data={[...]} xKey="city" yKey="rspSupport" />
   ```

---

## 6. coalition-stability.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Government Survival Duration** (Bar Chart)
   - Data: How long each coalition lasted
   - Story: Most governments collapse quickly

   ```jsx
   <BarChart data={[...]} xKey="coalition" yKey="duration" />
   ```

2. **CSI Scores by Coalition Type** (Bar Chart)
   - Data: Stability scores for different coalition configurations
   - Story: Which combinations are most stable

   ```jsx
   <BarChart data={[...]} xKey="type" yKey="csiScore" />
   ```

3. **Ideological Distance vs Survival** (Line Chart)
   - Data: Correlation between ideological coherence and duration
   - Story: Why some coalitions last longer

   ```jsx
   <LineChart data={[...]} xKey="distance" yKeys={['duration']} />
   ```

4. **Coalition Scenario Predictions** (Multi-Bar Chart)
   - Data: Predicted duration for 3 coalition scenarios
   - Story: What 2027 coalitions might look like
   ```jsx
   <MultiBarChart data={[...]} xKey="scenario" bars={[...]} />
   ```

---

## 7. understanding-nepals-electoral-system.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Seat Allocation Method Comparison** (Bar Chart)
   - Data: Seats under different methods (Sainte-Laguë vs D'Hondt)
   - Story: How formula affects outcomes

   ```jsx
   <MultiBarChart data={[...]} xKey="party" bars={[...]} />
   ```

2. **Vote Share vs Seat Share** (Scatter/Line Chart)
   - Data: Comparison of vote % and seat % for each party
   - Story: Proportionality of the system

   ```jsx
   <LineChart data={[...]} xKey="party" yKeys={['votes', 'seats']} />
   ```

3. **FPTP-PR Seat Distribution** (Pie Chart)
   - Data: Seats by party, broken down by FPTP vs PR
   - Story: How mixed system shapes representation

   ```jsx
   <PieChart data={[...]} nameKey="type" valueKey="seats" />
   ```

4. **Fragmentation Trend** (Line Chart)
   - Data: Effective number of parties over time
   - Story: Growing party system complexity
   ```jsx
   <LineChart data={[...]} xKey="election" yKeys={['enp']} />
   ```

---

## 8. sainte-lague-method-explained.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Sainte-Laguë Quotient Process** (Animated/Step-by-Step)
   - Data: Quotients at each round of allocation
   - Story: How the algorithm works visually

   ```jsx
   <MultiBarChart data={[...]} xKey="round" bars={[...]} />
   ```

2. **Method Comparison** (Multi-Bar Chart)
   - Data: Seats under Sainte-Laguë vs D'Hondt
   - Story: Impact of formula choice

   ```jsx
   <MultiBarChart data={[...]} xKey="party" bars={[...]} />
   ```

3. **Deviation from Perfect Proportionality** (Bar Chart)
   - Data: Vote % vs seat % deviation for each party
   - Story: Fairness of allocation
   ```jsx
   <BarChart data={[...]} xKey="party" yKey="deviation" />
   ```

---

## 9. economic-voting.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Inflation vs Incumbent Vote Share** (Line Chart)
   - Data: Correlation over time
   - Story: Economic voting in action

   ```jsx
   <LineChart data={[...]} xKey="inflation" yKeys={['incumbentShare']} />
   ```

2. **Unemployment Impact by Region** (Bar Chart)
   - Data: Anti-incumbent swing by unemployment rate
   - Story: Where economics matters most

   ```jsx
   <BarChart data={[...]} xKey="region" yKey="swing" />
   ```

3. **GDP Growth Impact** (Multi-Bar Chart)
   - Data: Incumbent boost at different GDP growth levels
   - Story: Economic conditions translate to votes

   ```jsx
   <MultiBarChart data={[...]} xKey="growth" bars={[...]} />
   ```

4. **2022 Predictions vs Actual** (Bar Chart)
   - Data: Model accuracy by constituency type
   - Story: How well economic models predict elections
   ```jsx
   <BarChart data={[...]} xKey="type" yKey="accuracy" />
   ```

---

## 10. madhesh-province-analysis.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Madhesh Seat Share of Total Parliament** (Pie Chart)
   - Data: 32 seats out of 275
   - Story: Why Madhesh is kingmaker

   ```jsx
   <PieChart data={[...]} nameKey="region" valueKey="seats" />
   ```

2. **Madhesh Party Performance 2017-2022** (Multi-Bar Chart)
   - Data: Seats by party in both elections
   - Story: Realignment in Madhesh politics

   ```jsx
   <MultiBarChart data={[...]} xKey="party" bars={[...]} />
   ```

3. **Caste Vote Share** (Pie Chart)
   - Data: Estimated vote share by caste group
   - Story: Demographic composition

   ```jsx
   <PieChart data={[...]} nameKey="caste" valueKey="voteShare" />
   ```

4. **Madhesh Development Indicators** (Bar Chart)
   - Data: Road connectivity, electrification, etc.
   - Story: Progress in the region

   ```jsx
   <BarChart data={[...]} xKey="indicator" yKey="value" />
   ```

5. **2027 Seat Projections** (Multi-Bar Chart)
   - Data: Projected seats by party grouping
   - Story: What 2027 might bring
   ```jsx
   <MultiBarChart data={[...]} xKey="grouping" bars={[...]} />
   ```

---

## 11. welcome-to-nepal-votes.mdx ⚡ RECOMMENDED

**Suggested Charts:**

1. **Party Fragmentation Over Time** (Line Chart)
   - Data: Two-party share of FPTP seats
   - Story: From two-party to multi-party system

   ```jsx
   <LineChart data={[...]} xKey="year" yKeys={['twoPartyShare']} />
   ```

2. **Election Coverage by Year** (Bar Chart)
   - Data: Number of elections, polls, analyses
   - Story: Growing election data availability

   ```jsx
   <BarChart data={[...]} xKey="year" yKey="coverage" />
   ```

3. **Database Growth Timeline** (Line Chart)
   - Data: Articles, datasets, tools added
   - Story: Platform evolution
   ```jsx
   <LineChart data={[...]} xKey="year" yKeys={['articles', 'datasets']} />
   ```

---

## Implementation Priority

**High Priority** (Most impact, best data fit):

1. ✅ voter-turnout-analysis.mdx - DONE
2. coalition-stability.mdx - Strong data, clear story
3. regional-voting-patterns.mdx - Many visualization opportunities
4. understanding-nepals-electoral-system.mdx - Complex concept needs visual explanation

**Medium Priority:** 5. youth-voter-trends.mdx - Good data, moderate impact 6. economic-voting.mdx - Interesting correlations 7. madhesh-province-analysis.mdx - Important regional focus

**Lower Priority:** 8. understanding-election-polls.mdx - More conceptual 9. sainte-lague-method-explained.mdx - Technical explanation 10. 30-years-democracy.mdx - Historical narrative 11. welcome-to-nepal-votes.mdx - Introduction, less data-heavy

---

## Tips for Adding Charts

1. **Identify the key insight** each section presents
2. **Find the data** that supports that insight
3. **Choose the right chart type** for that data
4. **Place charts strategically** - right after the relevant text
5. **Add clear captions** - explain what the chart shows
6. **Use consistent colors** - follow the color palette
7. **Test responsiveness** - ensure charts work on mobile

---

## Getting Help

- Review `docs/chart-components.md` for technical reference
- Check completed example in `voter-turnout-analysis.mdx`
- Run `npm run dev` to preview changes
- Contact dev team for complex visualizations

---

_Last updated: February 21, 2026_
