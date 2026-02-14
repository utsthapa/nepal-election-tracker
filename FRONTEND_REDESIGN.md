# NepaliSoch Editorial Homepage - Design Documentation

## Overview

A state-of-the-art editorial homepage inspired by NYT's design philosophy, featuring bold typography, sophisticated animations, and a premium editorial aesthetic.

## Design Philosophy

### Aesthetic Direction: "Premium Editorial Broadsheet"

**Core Principles:**
- Bold serif typography with dramatic scale contrasts
- Generous white space with strategic color accents
- Strong typographic hierarchy
- Grid-based layout with asymmetric elements
- Subtle animations using Framer Motion
- Nepal-specific color palette (crimson red + blue accents)

## Typography System

### Font Families

1. **Spectral** (Display/Masthead)
   - Used for the main site masthead
   - Dramatic, editorial presence
   - Weight: 700-800 (Bold/Extra Bold)

2. **Lora** (Headlines)
   - Article titles and headings
   - Classic editorial serif
   - Weight: 400-800

3. **Figtree** (Body/UI)
   - Body text and interface elements
   - Modern, highly readable sans-serif
   - Weight: 400-800

4. **Libre Baskerville** (Alternative Display)
   - Available for special editorial treatments
   - Weight: 400, 700

5. **JetBrains Mono** (Data/Numbers)
   - Statistics, dates, numerical data
   - Monospace for data precision

### Type Scale

- Display XL: 7rem (112px) - Masthead
- Display LG: 5rem (80px) - Hero headlines
- Display MD: 3.5rem (56px) - Section headlines
- Large: 2.5rem (40px) - Article titles
- Medium: 1.5rem (24px) - Subheadings
- Body: 1rem (16px) - Regular text

## Color Palette

### Base Colors

```css
--color-background: #FAF9F6 (Warm ivory)
--color-surface: #FFFFFF (Crisp white)
--color-neutral: #DBD3C4 (Warm borders)
--color-foreground: #181A24 (Deep text)
--color-muted: #646E82 (Secondary text)
```

### Accent Colors

```css
--crimson-dark: #B91C1C (Nepal flag red)
--crimson-darker: #991B1B (Deeper crimson)
```

### Political Party Colors
Maintained from existing system:
- NC: Green (#22c55e)
- UML: Red (#ef4444)
- Maoist: Dark Red (#991b1b)
- RSP: Blue (#3b82f6)
- And others...

## Layout Structure

### Homepage Sections

1. **Masthead**
   - Large Spectral typography
   - Date and location metadata
   - Subtle border separators

2. **Hero Article**
   - 500px height gradient placeholder
   - Dramatic headline (5xl-7xl)
   - Category badge
   - Smooth hover transitions

3. **Article Grid**
   - 3-column responsive layout
   - Varying article sizes (small/medium/large)
   - Border-top accents on hover
   - Staggered animations

4. **Widgets Section**
   - 3-column grid
   - Betting Odds: Dark gradient background
   - 2022 Results: Light bordered card
   - Map Teaser: Blue-purple gradient
   - Interactive hover states

5. **Call-to-Action**
   - Centered layout
   - Large headline
   - Primary action button

## Animation System

### Motion Principles

- **Entrance animations**: Fade up with stagger delays
- **Hover states**: Smooth color transitions (300ms)
- **Interactive elements**: Subtle transforms (translate, scale)
- **Page load**: Orchestrated sequence with delays

### Framer Motion Usage

```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.4 }}
```

## Components Created

### Article Components

1. **HeroArticle**
   - Full-width featured story
   - Large image placeholder with gradient overlay
   - Category badge
   - Title, excerpt, date

2. **ArticleCard**
   - Three sizes: small, medium, large
   - Border-top accent
   - Hover state transitions
   - Arrow icon for links

### Widget Components

1. **BettingOddsWidget**
   - Dark themed
   - Bar chart visualization
   - Political party probabilities
   - Link to full markets page

2. **ResultsWidget**
   - 2022 election results
   - Progress bars
   - Top 5 parties
   - Link to full analysis

3. **MapWidget**
   - Gradient background
   - Call-to-action for interactive map
   - Decorative elements

## Dummy Content Created

### Analysis Articles (6 total)

1. **Understanding Nepal's Electoral System** (Existing)
2. **Welcome to Nepal Votes** (Existing)
3. **Regional Voting Patterns** (New)
   - Provincial analysis
   - Urban-rural divide
   - Demographic determinants

4. **Youth Voter Trends** (New)
   - First-time voter analysis
   - 40 battleground constituencies
   - Digital native segments

5. **Coalition Stability Index** (New)
   - Quantitative framework
   - Predictive modeling
   - Case studies

6. **Economic Voting Patterns** (New)
   - Inflation correlation
   - GDP growth effects
   - Unemployment analysis

7. **Madhesh Province Analysis** (New)
   - Regional kingmaker dynamics
   - Caste calculus
   - 12 battleground constituencies

## Navigation Updates

### Route Changes

- **/** → Editorial Homepage (NEW)
- **/simulator** → Election Simulator (MOVED from /)
- Other routes unchanged

### Header Navigation

```jsx
- Home (/)
- Simulator (/simulator)
- Elections (/elections)
- Markets (/prediction-markets)
- Analysis (/analysis)
- Districts (/districts)
- About (/about)
```

## Technical Implementation

### Stack
- Next.js 15
- React 18
- Framer Motion 11
- Tailwind CSS 3
- TypeScript

### File Structure

```
app/
├── page.jsx (NEW - Editorial Homepage)
├── simulator/
│   └── page.jsx (MOVED from app/page.jsx)
├── layout.jsx (UPDATED - New fonts)
└── globals.css (ENHANCED - New design tokens)

content/
└── analysis/
    ├── regional-voting-patterns.mdx (NEW)
    ├── youth-voter-trends.mdx (NEW)
    ├── coalition-stability.mdx (NEW)
    ├── economic-voting.mdx (NEW)
    └── madhesh-province-analysis.mdx (NEW)
```

## Design Differentiation from Generic AI Aesthetics

### What We AVOIDED

❌ Inter/Roboto/Arial fonts
❌ Purple gradients on white backgrounds
❌ Cookie-cutter layouts
❌ Generic card patterns
❌ Predictable spacing
❌ Overused color schemes

### What We CREATED

✅ Spectral + Lora + Figtree (distinctive editorial pairing)
✅ Warm ivory background (#FAF9F6) with crimson accents
✅ Asymmetric grid with varying article sizes
✅ Border-top accents instead of card shadows
✅ Dramatic type scale (7rem masthead)
✅ Context-specific Nepal flag colors
✅ Noise texture overlay
✅ Editorial section dividers
✅ Sophisticated hover states
✅ Staggered entrance animations

## Responsive Behavior

### Breakpoints
- Mobile: 1 column layout
- Tablet (md): 2 column article grid
- Desktop (lg): 3 column article grid

### Typography Scaling
- Uses `clamp()` for fluid typography
- Maintains hierarchy across screen sizes
- Readable on all devices

## Performance Considerations

- Framer Motion already installed (no new dependencies)
- Google Fonts preconnect in layout
- Optimized image placeholders
- CSS-only animations where possible
- Smooth scroll behavior

## Future Enhancements

### Recommended Additions

1. **Real Images**: Replace gradient placeholders with actual article images
2. **MDX Integration**: Connect article cards to real MDX content
3. **Featured Article Logic**: Dynamic hero article selection
4. **Reading Time**: Calculate and display article reading time
5. **Author Bylines**: Add author information and photos
6. **Social Sharing**: Add share buttons for articles
7. **Newsletter Signup**: Integrate email collection
8. **Dark Mode**: Add toggle for dark theme
9. **Accessibility**: Enhanced ARIA labels and keyboard navigation
10. **Analytics**: Track article engagement

## Accessibility Features

- Semantic HTML structure
- High contrast ratios (WCAG AA compliant)
- Keyboard navigable
- Screen reader friendly
- Focus states on interactive elements
- Alternative text ready for images

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS Custom Properties
- Framer Motion (requires JavaScript)

## Conclusion

This editorial homepage establishes NepaliSoch as a premium, data-driven political analysis platform with a distinctive visual identity that rivals international news publications while maintaining a uniquely Nepali character through color choices and content focus.

The design is both timeless and contemporary, sophisticated yet accessible, and provides a strong foundation for building trust with readers seeking authoritative political analysis.
