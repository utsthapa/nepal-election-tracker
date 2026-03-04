# Comprehensive Site Audit Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all critical, high, and medium severity issues found across the NepaliSoch codebase audit.

**Architecture:** Fixes are grouped into independent batches that can be parallelized. Phase 1 fixes runtime crashes and security issues. Phase 2 fixes data accuracy. Phase 3 fixes UX and SEO.

**Tech Stack:** Next.js 15 (App Router), React 18, Tailwind CSS, MDX

---

## Phase 1: Critical Runtime & Security Fixes

### Task 1: Fix Next.js 15 async params (4 files)

**Files:**
- Modify: `app/elections/[year]/page.jsx:15-16,31-32`
- Modify: `app/districts/[slug]/page.jsx:91-92,126-127`
- Modify: `app/polls/[id]/page.jsx:13-14,30-31`
- Modify: `app/api/simulations/[id]/route.js:16-17`

In Next.js 15, `params` is a Promise. All 4 files access it synchronously.

**Fix pattern for each:**
```js
// Before
export function generateMetadata({ params }) {
  const year = parseInt(params.year, 10);

// After
export async function generateMetadata({ params }) {
  const { year } = await params;
```

### Task 2: Fix path traversal in lib/content.js

**Files:**
- Modify: `lib/content.js:8-9,35-36`

Add slug/dir sanitization to prevent `../../` traversal:
```js
function sanitizePath(input) {
  return input.replace(/[^a-zA-Z0-9_-]/g, '');
}
```

### Task 3: Fix invisible text on nepal-map page

**Files:**
- Modify: `app/nepal-map/page.jsx:46,54,57,80`

Change all `text-white` to `text-foreground` for headings on light background.

### Task 4: Fix dynamic Tailwind classes on about page

**Files:**
- Modify: `app/about/page.jsx:366-367`

Replace dynamic `bg-${item.color}-500/20` with a color map object.

### Task 5: Fix Recharts axes + Nepali string on forecast page

**Files:**
- Modify: `app/elections/forecast/page.jsx:106-112,152`

Swap XAxis/YAxis for vertical layout. Fix Nepali template literal.

### Task 6: Fix determineFPTPWinner crash on empty input

**Files:**
- Modify: `utils/calculations.js:130-132`

Add empty object guard.

### Task 7: Fix lucide-react Link shadow in simulator

**Files:**
- Modify: `app/simulator/[year]/page.jsx:10`

Rename lucide `Link` import to `LinkIcon`.

### Task 8: Fix election year page duplicate party name

**Files:**
- Modify: `app/elections/[year]/page.jsx:213`

Change second `info.name` to display party code.

### Task 9: Fix Footer simulator link + add missing nav

**Files:**
- Modify: `components/Footer.jsx:8`
- Modify: `components/Header.jsx:11-19`

Footer: Change `href: '/'` to `href: '/simulator/2026'`. Header: Add polls, prediction-markets links.

### Task 10: Add Header/Footer to orphaned pages

**Files:**
- Modify: `app/prediction-markets/page.jsx`
- Modify: `app/elections/forecast/page.jsx`

### Task 11: Fix layout.jsx metadata issues

**Files:**
- Modify: `app/layout.jsx:5,15,38-40,55`

Add `metadataBase`, OG url/images, remove placeholder verification, add `<main>` landmark.

### Task 12: Fix OG image URLs in metadata.js

**Files:**
- Modify: `lib/metadata.js:19-21,33`

Prefix image URLs with BASE_URL, use PNG fallback instead of SVG.

### Task 13: Fix Turso schema promise retry

**Files:**
- Modify: `lib/turso.js:24-43`

Reset `schemaPromise = null` on failure.

### Task 14: Fix config.js casing + dead code

**Files:**
- Modify: `lib/config.js:187`

Change `others` to `Others`.

### Task 15: Fix SVG spinner in newsletter page

**Files:**
- Modify: `app/newsletter/page.jsx:76`

Replace malformed SVG path.

## Phase 2: Data Accuracy Fixes

### Task 16: Fix Bardiya province assignment in demographics.js

**Files:**
- Modify: `data/demographics.js:1076`

Move Bardiya from Province 7 section to Province 5 (Lumbini).

### Task 17: Fix DETAILED_AGE_GROUPS sum (104% → 100%)

**Files:**
- Modify: `data/demographics.js:1250-1268`

Adjust values to sum to 1.0.

### Task 18: Fix parties_2013.js PR seat counts

**Files:**
- Modify: `data/historical/parties_2013.js:14,28,42,55`

Separate nominated seats from PR: NC 80 PR + 11 nom, UML 76 + 8, Maoist 49 + 5, RPP 22 + 2.

### Task 19: Fix parties_1994.js Others seat count

**Files:**
- Modify: `data/historical/parties_1994.js:79`

Change `seatsWon: 5` to `seatsWon: 7`.

### Task 20: Fix config Others key casing and useElectionState

**Files:**
- Modify: `hooks/useElectionState.js:579`

Add comment clarifying Others=0 design choice or handle properly.

## Phase 3: Article Fixes

### Task 21: Fix factual errors in MDX articles

- Fix RSP "20 FPTP seats" → 7 in welcome-to-nepal-votes.mdx and youth-voter-trends.mdx
- Fix "UMP" → "UML" in women-in-parliament.mdx
- Fix broken /methodology links → /about or /analysis
- Fix Nepali string interpolation issues
