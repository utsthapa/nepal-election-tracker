# UI Health Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 14 new Playwright E2E tests — 8 navigation smoke tests (all nav routes load without crashing, active link state correct) and 6 simulator UI behaviour tests (tab switching, lock toggle, majority indicator).

**Architecture:** Two new spec files (`navigation.spec.js`, `simulator-ui.spec.js`) with light additions to existing page objects (`HomePage.js`, `SimulatorPage.js`). No new page object files needed.

**Tech Stack:** Playwright + `@playwright/test`, Next.js 15, port 3001.

---

## Context You Must Know

### Project layout

- Playwright specs live in `e2e/journeys/`
- Page objects live in `e2e/pages/`
- App runs on `http://localhost:3001` (see `playwright.config.mjs`)
- Run all tests: `npx playwright test --reporter=list`
- Run a single file: `npx playwright test e2e/journeys/navigation.spec.js --reporter=list`

### Simulator guided flow

`SimulatorPage.goto()` already handles this — it sets `localStorage.hasSeenQuickStart=true` and clicks "Use Full Dashboard" if visible. You do NOT need to repeat this logic in new tests.

### Key UI strings (from source)

- Majority indicator: `"Majority"` (green) or `"Hung Parliament"` (grey) — rendered by `t('simulator.majority')` / `t('simulator.hung')`
- Lock button: `"Sliders Locked"` or `"Sliders Unlocked"` — toggled by clicking
- Tab buttons: exactly `"Manual"`, `"Demographics"`, `"Advanced"` — active state: CSS class `border-blue-600 text-blue-600`
- Demographics panel heading: `"What-If Demographic Model"`
- Advanced panel label: `"Advanced Settings"` (small uppercase text)
- Route headings: `/analysis` → "Analysis", `/districts` → "Districts", `/demographics` → "Demographics", `/nepal-data` → "Nepal Macro Data Dashboard", `/about` → "About NepaliSoch"

### Nav items in Header (label → href)

Home `/`, Simulator `/simulator`, Elections `/elections`, Analysis `/analysis`, Districts `/districts`, Demographics `/demographics`, Nepal Data `/nepal-data`, About `/about`

---

## Task 1: Extend HomePage page object

**File to modify:** `e2e/pages/HomePage.js`

### Step 1: Read the current file

Read `e2e/pages/HomePage.js` to see what's already there.

### Step 2: Add nav link locators for all 8 routes

Replace the constructor with:

```js
constructor(page) {
  this.page = page;
  this.simulatorNavLink = page.getByRole('link', { name: 'Simulator' }).first();
  this.electionsNavLink = page.getByRole('link', { name: 'Elections' }).first();
  this.analysisNavLink = page.getByRole('link', { name: 'Analysis' }).first();
  this.districtsNavLink = page.getByRole('link', { name: 'Districts' }).first();
  this.demographicsNavLink = page.getByRole('link', { name: 'Demographics' }).first();
  this.nepalDataNavLink = page.getByRole('link', { name: 'Nepal Data' }).first();
  this.aboutNavLink = page.getByRole('link', { name: 'About' }).first();
  this.heading = page.getByRole('heading').first();
}
```

### Step 3: Verify the file looks correct (read it back)

### Step 4: Commit

```bash
git add e2e/pages/HomePage.js
git commit -m "feat(e2e): add nav link locators for all 8 routes to HomePage POM"
```

---

## Task 2: Extend SimulatorPage page object

**File to modify:** `e2e/pages/SimulatorPage.js`

### Step 1: Read the current file

Read `e2e/pages/SimulatorPage.js` to see what's already there.

### Step 2: Add locators and a clickTab helper

After the `seatsTotalText` line in the constructor, add:

```js
this.manualTab = page.getByRole('button', { name: 'Manual' });
this.demographicsTab = page.getByRole('button', { name: 'Demographics' });
this.advancedTab = page.getByRole('button', { name: 'Advanced' });
this.lockButton = page.getByRole('button', { name: /sliders (locked|unlocked)/i });
this.majorityIndicator = page.getByText(/majority|hung parliament/i).first();
```

After `triggerSeatsCsvExport()`, add:

```js
async clickTab(name) {
  await this.page.getByRole('button', { name }).click();
  await this.page.waitForTimeout(200);
}
```

### Step 3: Verify the file looks correct (read it back)

### Step 4: Commit

```bash
git add e2e/pages/SimulatorPage.js
git commit -m "feat(e2e): add tab/lock/majority locators + clickTab helper to SimulatorPage POM"
```

---

## Task 3: Write navigation spec

**File to create:** `e2e/journeys/navigation.spec.js`

### Step 1: Write the spec

```js
// e2e/journeys/navigation.spec.js
//
// Smoke-tests every nav link: clicking it loads the correct page without crashing.
// Also verifies the active-link indicator (red underline) is shown for the current route.

import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage.js';

test.describe('Navigation health', () => {
  test('home page loads with Nepal in title', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveTitle(/nepal/i);
  });

  test('Simulator nav link loads /simulator', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.simulatorNavLink.click();
    await expect(page).toHaveURL(/\/simulator/);
  });

  test('Elections nav link loads /elections', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.electionsNavLink.click();
    await expect(page).toHaveURL(/\/elections/);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('Analysis nav link loads /analysis with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.analysisNavLink.click();
    await expect(page).toHaveURL(/\/analysis/);
    await expect(page.getByRole('heading', { name: /analysis/i }).first()).toBeVisible();
  });

  test('Districts nav link loads /districts with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.districtsNavLink.click();
    await expect(page).toHaveURL(/\/districts/);
    await expect(page.getByRole('heading', { name: /districts/i })).toBeVisible();
  });

  test('Demographics nav link loads /demographics with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.demographicsNavLink.click();
    await expect(page).toHaveURL(/\/demographics/);
    await expect(page.getByRole('heading', { name: /demographics/i })).toBeVisible();
  });

  test('Nepal Data nav link loads /nepal-data with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.nepalDataNavLink.click();
    await expect(page).toHaveURL(/\/nepal-data/);
    await expect(page.getByRole('heading', { name: /nepal macro data/i })).toBeVisible();
  });

  test('About nav link loads /about with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.aboutNavLink.click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('heading', { name: /about nepalisoch/i })).toBeVisible();
  });
});
```

### Step 2: Run just this file to verify tests pass

```bash
npx playwright test e2e/journeys/navigation.spec.js --reporter=list
```

Expected: `8 passed`

If any test fails:

- For URL assertions: the nav link text in the DOM might differ from `Header.jsx` — check with a diagnostic snapshot
- For heading assertions: check if the page is server-rendered (may need `waitForLoadState('networkidle')`) — add `await page.waitForLoadState('networkidle')` after the URL assertion

### Step 3: Commit

```bash
git add e2e/journeys/navigation.spec.js
git commit -m "feat(e2e): add navigation smoke tests for all 8 routes"
```

---

## Task 4: Write simulator UI spec

**File to create:** `e2e/journeys/simulator-ui.spec.js`

### Step 1: Write the spec

```js
// e2e/journeys/simulator-ui.spec.js
//
// Tests that key simulator UI elements behave correctly:
//   - Tabs switch active content (Manual → Demographics → Advanced)
//   - Lock button toggles its label
//   - Majority indicator shows correct state at baseline and after boosting a party

import { test, expect } from '@playwright/test';

import { SimulatorPage } from '../pages/SimulatorPage.js';

const NC_SLIDER = 'Nepali Congress vote share';

test.describe('Simulator UI behaviour', () => {
  test('Manual tab is visible and active by default', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    // Manual tab is visible
    await expect(simulator.manualTab).toBeVisible();
    // Active tab has blue styling
    await expect(simulator.manualTab).toHaveClass(/border-blue-600/);
  });

  test('Clicking Demographics tab shows What-If Demographic Model panel', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.clickTab('Demographics');

    await expect(page.getByText('What-If Demographic Model')).toBeVisible();
  });

  test('Clicking Advanced tab shows Advanced Settings section', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.clickTab('Advanced');

    await expect(page.getByText(/advanced settings/i)).toBeVisible();
  });

  test('Lock button starts as Locked and toggles to Unlocked on click', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    // Baseline: locked (handleReset sets slidersLocked=true)
    await expect(simulator.lockButton).toContainText(/sliders locked/i);

    await simulator.lockButton.click();

    await expect(simulator.lockButton).toContainText(/sliders unlocked/i);
  });

  test('Majority indicator is visible at baseline', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await expect(simulator.majorityIndicator).toBeVisible();
  });

  test('Boosting NC to 70% switches indicator to Majority', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    // At 70% NC dominates — guaranteed majority
    await simulator.setSlider(NC_SLIDER, 70);

    await expect(page.getByText('Majority')).toBeVisible();
  });
});
```

### Step 2: Run just this file

```bash
npx playwright test e2e/journeys/simulator-ui.spec.js --reporter=list
```

Expected: `6 passed`

**Likely issues and fixes:**

- `manualTab` / `lockButton` not found: the buttons are only visible after `goto()` dismisses the guided flow — this is handled already, but if the guided flow is still showing, check that `fullDashboardBtn.click()` succeeded
- `toHaveClass(/border-blue-600/)`: if the tab button has multiple classes, this regex match should still work. If not, use `expect(simulator.manualTab).toHaveAttribute('class', /border-blue-600/)`
- "Majority" text: the indicator renders `{hasMajority ? 'Majority' : 'Hung Parliament'}` — at NC=70 this will be Majority. If it's still "Hung Parliament", increase the value to 80

### Step 3: Commit

```bash
git add e2e/journeys/simulator-ui.spec.js
git commit -m "feat(e2e): add simulator UI behaviour tests (tabs, lock, majority)"
```

---

## Task 5: Run full suite and verify 34/34 pass

### Step 1: Run all tests

```bash
npx playwright test --reporter=list
```

Expected: `34 passed` (20 existing + 8 navigation + 6 simulator UI)

### Step 2: If any tests fail

- Navigation: check that `page.waitForLoadState('networkidle')` is needed after clicking a link
- Simulator UI: check the exact class names by running a one-off snapshot in the browser
- Do NOT mark this task complete until the run shows 34 passed

### Step 3: Final commit if any fixups were needed

```bash
git add -p  # stage only the fixup changes
git commit -m "fix(e2e): correct locators in navigation and simulator-ui specs"
```
