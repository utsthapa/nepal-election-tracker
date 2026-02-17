# Nepal Election Simulator - Development Skills & Best Practices

This document serves as a comprehensive guide to prevent common issues and maintain code quality in the Nepal Election Simulator project.

## Table of Contents

1. [Tailwind CSS Best Practices](#tailwind-css-best-practices)
2. [React & Next.js Patterns](#react--nextjs-patterns)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [Data Management](#data-management)
5. [Performance Optimization](#performance-optimization)
6. [Accessibility (a11y)](#accessibility-a11y)
7. [SEO & Metadata](#seo--metadata)
8. [Error Handling](#error-handling)
9. [Code Quality Tools](#code-quality-tools)
10. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)

---

## Tailwind CSS Best Practices

### NEVER Use Dynamic Class Names

**❌ BAD - Breaks Tailwind JIT Compiler:**
```jsx
// This will NOT work in production!
const bgColor = `bg-${party.toLowerCase()}`;
<div className={bgColor} />
```

**✅ GOOD - Use Static Mapping:**
```jsx
// lib/partyColors.js
export const PARTY_BG_COLORS = {
  'nc': 'bg-nc',
  'uml': 'bg-uml',
  'maoist': 'bg-maoist',
  // ... etc
};

// Component
import { getPartyBgColor } from '../lib/partyColors';
<div className={getPartyBgColor(party)} />
```

### Complete Class Names Required

Tailwind's JIT compiler scans source files for complete class names. Any dynamic string concatenation will fail.

**Safe Patterns:**
- Use static mapping objects
- Use data attributes for dynamic values
- Use inline styles for truly dynamic values

---

## React & Next.js Patterns

### useMemo vs useCallback

**❌ BAD - useMemo returning functions:**
```jsx
const getData = useMemo(() => (id) => {
  return fetchData(id);
}, [deps]);
```

**✅ GOOD - useCallback for functions:**
```jsx
const getData = useCallback((id) => {
  return fetchData(id);
}, [deps]);
```

**Rule:**
- `useMemo` - For memoizing VALUES
- `useCallback` - For memoizing FUNCTIONS

### Server vs Client Components

**Use Server Components when:**
- Fetching data that doesn't need interactivity
- Accessing backend resources directly
- Rendering static content
- SEO-critical pages

**Use Client Components ('use client') when:**
- Using browser APIs (window, localStorage)
- Using React hooks (useState, useEffect)
- Handling user interactions
- Using third-party libraries that need DOM

### Dynamic Routes - Always Use generateStaticParams

**✅ REQUIRED for dynamic routes:**
```jsx
// app/elections/[year]/page.jsx
export function generateStaticParams() {
  return Object.keys(ELECTIONS).map((year) => ({
    year: year,
  }));
}

// For async data
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}
```

### Metadata Export

**Every page MUST export metadata:**
```jsx
export const metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
  },
};
```

For client components, create a `layout.jsx` file:
```jsx
// app/simulator/layout.jsx
export const metadata = {
  title: 'Election Simulator',
  description: '...',
};

export default function Layout({ children }) {
  return children;
}
```

---

## TypeScript Guidelines

### Always Define Return Types for Public Functions

```typescript
// utils/calculations.ts
export function calculateSeats(
  votes: Record<string, number>
): SeatAllocation {
  // Implementation
}
```

### Use Strict Type Checking

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Interface vs Type

- Use `interface` for object shapes that may be extended
- Use `type` for unions, tuples, and mapped types

```typescript
// Interface - can be extended
interface Constituency {
  id: string;
  name: string;
}

interface UrbanConstituency extends Constituency {
  urbanPercent: number;
}

// Type - for unions
type Party = 'NC' | 'UML' | 'Maoist';
```

---

## Data Management

### Single Source of Truth

**❌ BAD - Duplicated data:**
```javascript
// data/parties.js
export const PARTIES = { NC: { color: '#22c55e' } };

// data/partyMeta.js
export const PARTY_COLORS = { NC: '#22c55e' };
```

**✅ GOOD - Centralized:**
```javascript
// data/parties.js
export const PARTIES = {
  NC: { name: 'Nepali Congress', short: 'NC', color: '#22c55e' }
};

// Other files import from parties.js
import { PARTIES } from '../data/parties';
```

### Validate Data at Runtime

```typescript
export function validateVoteShares(shares: PartyVoteShares): {
  isValid: boolean;
  error?: string;
} {
  if (!shares || typeof shares !== 'object') {
    return { isValid: false, error: 'Invalid input' };
  }
  
  for (const [party, share] of Object.entries(shares)) {
    if (typeof share !== 'number' || isNaN(share)) {
      return { isValid: false, error: `${party}: must be a number` };
    }
    if (share < 0 || share > 100) {
      return { isValid: false, error: `${party}: must be 0-100` };
    }
  }
  
  return { isValid: true };
}
```

### Safe LocalStorage Access

```typescript
function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return defaultValue;
  }
}
```

---

## Performance Optimization

### Memoization Guidelines

**Use memoization when:**
- Computing derived data from props/state
- Passing callbacks to child components
- Rendering expensive components

**Don't over-memoize:**
- Simple calculations (cost of memo > cost of calc)
- Values that change every render

```jsx
// ✅ Good - expensive calculation
const sortedData = useMemo(() => {
  return data.sort((a, b) => complexComparison(a, b));
}, [data]);

// ❌ Bad - simple calculation
const doubled = useMemo(() => count * 2, [count]); // Just use count * 2
```

### Debounce User Input

```jsx
import { useDebouncedCallback } from '../hooks/useDebounce';

function SearchInput({ onSearch }) {
  const debouncedSearch = useDebouncedCallback(onSearch, 300);
  
  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
    />
  );
}
```

### Code Splitting

```jsx
// Use dynamic imports for heavy components
const NepalMap = dynamic(() => import('../components/NepalMap'), {
  loading: () => <MapSkeleton />,
  ssr: false, // If component uses browser APIs
});
```

---

## Color Contrast Rules

### NEVER Use Light Text on Light Backgrounds

**❌ BAD - Poor contrast:**
```jsx
// Light text on light background - ILLEGAL
<div className="bg-surface text-white">Content</div>
<div className="bg-white text-gray-300">Content</div>
<div className="bg-neutral text-white">Content</div>
<div className="bg-gray-50 text-gray-400">Content</div>
```

**✅ GOOD - Proper contrast:**
```jsx
// Dark text on light background
<div className="bg-surface text-gray-900">Content</div>
<div className="bg-white text-gray-900">Content</div>
<div className="bg-neutral text-gray-900">Content</div>
<div className="bg-gray-50 text-gray-700">Content</div>

// White text only on DARK backgrounds
<div className="bg-blue-600 text-white">Content</div>
<div className="bg-gray-900 text-white">Content</div>
<div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Content</div>
```

### Color Contrast Quick Reference

| Background | Allowed Text Colors | Forbidden Text Colors |
|------------|---------------------|----------------------|
| `bg-white` | `text-gray-900`, `text-gray-700`, `text-gray-600` | `text-white`, `text-gray-300`, `text-gray-400` |
| `bg-surface` | `text-gray-900`, `text-gray-700` | `text-white`, `text-gray-300` |
| `bg-neutral` | `text-gray-900`, `text-gray-800` | `text-white`, `text-gray-400` |
| `bg-gray-50` | `text-gray-900`, `text-gray-700` | `text-white`, `text-gray-300` |
| `bg-blue-50` | `text-blue-900`, `text-gray-900` | `text-white`, `text-blue-300` |
| `bg-amber-100` | `text-amber-900`, `text-gray-900` | `text-white`, `text-amber-400` |

### Contrast Ratio Requirements

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Testing Contrast

Use these tools to verify contrast:
- Browser DevTools (Lighthouse accessibility audit)
- WebAIM Contrast Checker
- Stark plugin for Figma

---

## Accessibility (a11y)

### Required for All Interactive Elements

```jsx
// ✅ Good - Accessible slider
<input
  type="range"
  aria-label="Vote share percentage"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={value}
  aria-valuetext={`${value}%`}
/>

// ✅ Good - Accessible button
<button
  aria-label="Close dialog"
  aria-pressed={isOpen}
  onClick={handleClose}
>
  <XIcon aria-hidden="true" />
</button>
```

### Keyboard Navigation

All interactive elements must be keyboard accessible:
- Use native `<button>` elements (not divs with onClick)
- Ensure visible focus indicators
- Support Escape key for modals
- Trap focus in modals

### Semantic HTML

```jsx
// ❌ Bad
<div className="button" onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

---

## SEO & Metadata

### Every Page Must Have Metadata

```jsx
// Server Component
export const metadata = {
  title: 'Election Simulator | NepaliSoch',
  description: 'Interactive election simulation...',
  keywords: ['Nepal election', 'simulator', 'politics'],
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

### Root Layout Metadata Template

```jsx
// app/layout.jsx
export const metadata = {
  title: {
    default: 'NepaliSoch - Nepal Election Analysis',
    template: '%s | NepaliSoch'
  },
  description: '...',
  robots: {
    index: true,
    follow: true,
  },
};
```

---

## Error Handling

### Error Boundaries

Always wrap your app in error boundaries:

```jsx
// app/layout.jsx
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
```

### Graceful Degradation

```jsx
function DataComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch((err) => {
        console.error('Failed to load data:', err);
        setError(err);
      });
  }, []);
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  if (!data) {
    return <LoadingSkeleton />;
  }
  
  return <DataView data={data} />;
}
```

---

## Code Quality Tools

### Pre-Commit Hooks

This project uses Husky + lint-staged to ensure code quality:

```bash
# Runs automatically on git commit
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
npm run type-check    # TypeScript check
```

### Available Scripts

```bash
# Development
npm run dev           # Start dev server

# Code Quality
npm run lint          # Check ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
npm run format:check  # Check formatting
npm run type-check    # TypeScript check

# Testing
npm run test          # Run tests
npm run test:watch    # Watch mode

# Build
npm run build         # Production build
```

### ESLint Rules

Key rules enforced:
- `no-console` - Warns on console.log (allowed: console.warn, console.error)
- `unused-imports/no-unused-imports` - Error on unused imports
- `react-hooks/exhaustive-deps` - Warns on missing hook dependencies
- `import/order` - Enforces import ordering

---

## Common Pitfalls to Avoid

### 1. Missing Return in Array Methods

**❌ BAD:**
```javascript
const filtered = items.filter(item => {
  item.id > 5;  // Missing return!
});
```

**✅ GOOD:**
```javascript
const filtered = items.filter(item => {
  return item.id > 5;
});
// Or use implicit return:
const filtered = items.filter(item => item.id > 5);
```

### 2. useEffect Missing Dependencies

**❌ BAD:**
```jsx
useEffect(() => {
  fetchData(userId);
}, []); // Missing dependency: userId
```

**✅ GOOD:**
```jsx
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### 3. Mutating State Directly

**❌ BAD:**
```jsx
const [items, setItems] = useState([]);
items.push(newItem); // Mutates state!
```

**✅ GOOD:**
```jsx
const [items, setItems] = useState([]);
setItems([...items, newItem]);
```

### 4. Not Handling Loading/Error States

Every data fetch must handle:
- Loading state
- Error state
- Success state

### 5. Inline Function Definitions in Render

**❌ BAD:**
```jsx
<button onClick={() => handleClick(id)}>Click</button>
```

**✅ GOOD:**
```jsx
const handleClick = useCallback(() => {
  onClick(id);
}, [id, onClick]);

<button onClick={handleClick}>Click</button>
```

### 6. Hardcoded Values

**❌ BAD:**
```javascript
const MAJORITY = 138; // What is this?
```

**✅ GOOD:**
```javascript
import { MAJORITY_THRESHOLD } from '../config/constants';
// Or add comment
const MAJORITY = 138; // 50% + 1 of 275 seats
```

---

## Quick Reference Checklist

Before committing code, ensure:

- [ ] No dynamic Tailwind class names
- [ ] All interactive elements have ARIA labels
- [ ] Pages have metadata exports
- [ ] Dynamic routes use generateStaticParams
- [ ] TypeScript types are defined
- [ ] No console.log statements (use warn/error)
- [ ] No unused imports
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] useCallback used for functions in JSX
- [ ] Dependencies arrays are complete
- [ ] Data validation for user inputs

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated:** February 2026
**Maintained by:** Development Team
