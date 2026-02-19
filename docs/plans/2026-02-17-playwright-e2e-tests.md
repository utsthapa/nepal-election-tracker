# Playwright E2E Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add four Playwright end-to-end user journey tests covering navigation, the election simulator, the Nepal map, elections history, and CSV export.

**Architecture:** Page Object Model — each page gets a helper class in `e2e/pages/` that centralises selectors. Journey tests in `e2e/journeys/` use those helpers. Playwright config uses `next build && next start` as the web server.

**Tech Stack:** `@playwright/test` (already installed), Next.js 15, Chromium (default browser)

---

### Task 1: Install Playwright browsers and create config

**Files:**
- Create: `playwright.config.js`

**Step 1: Install Playwright browsers**

```bash
npx playwright install chromium
```

Expected: Chromium browser downloaded to `~/.cache/ms-playwright/`

**Step 2: Create the config**

Create `playwright.config.js` at the project root:

```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
```

**Step 3: Add test scripts to package.json**

In `package.json`, add inside `"scripts"`:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed"
```

**Step 4: Create the e2e directory structure**

```bash
mkdir -p e2e/pages e2e/journeys
```

**Step 5: Verify config is valid**

```bash
npx playwright test --list
```

Expected: `No tests found` (we haven't written any yet) — but no config errors.

**Step 6: Commit**

```bash
git add playwright.config.js package.json
git commit -m "feat: add Playwright config with next build webServer"
```

---

### Task 2: HomePage page object

**Files:**
- Create: `e2e/pages/HomePage.js`

**Step 1: Create the page object**

```js
// e2e/pages/HomePage.js
export class HomePage {
  constructor(page) {
    this.page = page;
    this.simulatorNavLink = page.getByRole('link', { name: 'Simulator' }).first();
    this.electionsNavLink = page.getByRole('link', { name: 'Elections' }).first();
    this.heading = page.getByRole('heading').first();
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSimulator() {
    await this.simulatorNavLink.click();
    await this.page.waitForURL('**/simulator');
  }

  async navigateToElections() {
    await this.electionsNavLink.click();
    await this.page.waitForURL('**/elections');
  }
}
```

**Step 2: Verify file exists**

```bash
ls e2e/pages/HomePage.js
```

---

### Task 3: SimulatorPage page object

**Files:**
- Create: `e2e/pages/SimulatorPage.js`

**Step 1: Create the page object**

The simulator shows a QuickStartModal on first visit (checks `localStorage.hasSeenQuickStart`).
We suppress it by setting localStorage before the page loads.

```js
// e2e/pages/SimulatorPage.js
export class SimulatorPage {
  constructor(page) {
    this.page = page;
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.exportButton = page.getByRole('button', { name: /export/i });
    this.seatsTotalText = page.getByText(/seats total/i);
    this.exportSeatsCsvOption = page.getByRole('button', { name: /seats summary/i });
  }

  async goto() {
    // Suppress the QuickStart modal by pre-setting localStorage
    await this.page.addInitScript(() => {
      localStorage.setItem('hasSeenQuickStart', 'true');
    });
    await this.page.goto('/simulator');
    await this.page.waitForLoadState('networkidle');
  }

  async clickReset() {
    await this.resetButton.click();
    // Brief wait for React re-render
    await this.page.waitForTimeout(300);
  }

  async openExportDropdown() {
    await this.exportButton.click();
  }

  async downloadSeatsCsv() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportSeatsCsvOption.click(),
    ]);
    return download;
  }
}
```

---

### Task 4: MapPage page object

**Files:**
- Create: `e2e/pages/MapPage.js`

**Step 1: Create the page object**

```js
// e2e/pages/MapPage.js
export class MapPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /nepal map/i });
    this.mapContainer = page.locator('.leaflet-container');
    this.loadingSpinner = page.getByText(/loading map/i);
  }

  async goto() {
    await this.page.goto('/nepal-map');
  }

  async waitForMapReady() {
    // Wait for loading text to disappear
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 });
  }
}
```

---

### Task 5: ElectionsPage page object

**Files:**
- Create: `e2e/pages/ElectionsPage.js`

**Step 1: Create the page object**

```js
// e2e/pages/ElectionsPage.js
export class ElectionsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /elections/i }).first();
  }

  async goto() {
    await this.page.goto('/elections');
    await this.page.waitForLoadState('networkidle');
  }

  async getYearLinks() {
    // Links to individual election year pages, e.g. /elections/2022
    return this.page.getByRole('link', { name: /\b(19|20)\d{2}\b/ }).all();
  }

  async navigateToYear(year) {
    await this.page.goto(`/elections/${year}`);
    await this.page.waitForLoadState('networkidle');
  }
}
```

---

### Task 6: Journey — Homepage to Simulator

**Files:**
- Create: `e2e/journeys/homepage-to-simulator.spec.js`

**Step 1: Write the test**

```js
// e2e/journeys/homepage-to-simulator.spec.js
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { SimulatorPage } from '../pages/SimulatorPage.js';

test.describe('Homepage → Simulator journey', () => {
  test('loads homepage and navigates to simulator via nav', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Homepage renders
    await expect(page).toHaveTitle(/nepal/i);

    // Navigate to simulator
    await home.navigateToSimulator();
    await expect(page).toHaveURL(/simulator/);
  });

  test('simulator shows 275 total seats at baseline', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    // MajorityBar renders "275 seats total · 138 needed to govern"
    await expect(simulator.seatsTotalText).toBeVisible();
    await expect(simulator.seatsTotalText).toContainText('275');
  });

  test('Reset button is visible and clickable', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await expect(simulator.resetButton).toBeVisible();
    await simulator.clickReset();

    // After reset, 275 seats total still shown
    await expect(simulator.seatsTotalText).toContainText('275');
  });
});
```

**Step 2: Run the test**

```bash
npx playwright test e2e/journeys/homepage-to-simulator.spec.js --headed
```

Expected: 3 tests pass

**Step 3: Commit**

```bash
git add e2e/pages/HomePage.js e2e/pages/SimulatorPage.js e2e/journeys/homepage-to-simulator.spec.js
git commit -m "feat: add homepage-to-simulator Playwright journey test"
```

---

### Task 7: Journey — Nepal Map exploration

**Files:**
- Create: `e2e/journeys/map-exploration.spec.js`

**Step 1: Write the test**

```js
// e2e/journeys/map-exploration.spec.js
import { test, expect } from '@playwright/test';
import { MapPage } from '../pages/MapPage.js';

test.describe('Nepal Map exploration journey', () => {
  test('map page loads and shows heading', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();

    await expect(mapPage.heading).toBeVisible();
  });

  test('map renders (Leaflet container appears)', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await mapPage.waitForMapReady();

    await expect(mapPage.mapContainer).toBeVisible();
  });

  test('page contains district description text', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();

    await expect(page.getByText(/77 districts/i)).toBeVisible();
  });
});
```

**Step 2: Run the test**

```bash
npx playwright test e2e/journeys/map-exploration.spec.js --headed
```

Expected: 3 tests pass

**Step 3: Commit**

```bash
git add e2e/pages/MapPage.js e2e/journeys/map-exploration.spec.js
git commit -m "feat: add Nepal map exploration Playwright journey test"
```

---

### Task 8: Journey — Elections history

**Files:**
- Create: `e2e/journeys/elections-history.spec.js`

**Step 1: Write the test**

```js
// e2e/journeys/elections-history.spec.js
import { test, expect } from '@playwright/test';
import { ElectionsPage } from '../pages/ElectionsPage.js';

test.describe('Elections history journey', () => {
  test('elections page loads with correct heading', async ({ page }) => {
    const electionsPage = new ElectionsPage(page);
    await electionsPage.goto();

    await expect(electionsPage.heading).toBeVisible();
  });

  test('elections page lists year links (1991–2022)', async ({ page }) => {
    const electionsPage = new ElectionsPage(page);
    await electionsPage.goto();

    const yearLinks = await electionsPage.getYearLinks();
    expect(yearLinks.length).toBeGreaterThan(0);
  });

  test('navigating to 2022 election shows results', async ({ page }) => {
    const electionsPage = new ElectionsPage(page);
    await electionsPage.navigateToYear('2022');

    // Page should contain "2022" somewhere prominent
    await expect(page.getByText(/2022/)).toBeVisible();
  });
});
```

**Step 2: Run the test**

```bash
npx playwright test e2e/journeys/elections-history.spec.js --headed
```

Expected: 3 tests pass

**Step 3: Commit**

```bash
git add e2e/pages/ElectionsPage.js e2e/journeys/elections-history.spec.js
git commit -m "feat: add elections history Playwright journey test"
```

---

### Task 9: Journey — Export results

**Files:**
- Create: `e2e/journeys/export-results.spec.js`

**Step 1: Write the test**

```js
// e2e/journeys/export-results.spec.js
import { test, expect } from '@playwright/test';
import { SimulatorPage } from '../pages/SimulatorPage.js';

test.describe('Export results journey', () => {
  test('Export button is visible on simulator', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await expect(simulator.exportButton).toBeVisible();
  });

  test('clicking Export opens the dropdown with CSV option', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.openExportDropdown();

    await expect(simulator.exportSeatsCsvOption).toBeVisible();
  });

  test('clicking Seats Summary CSV triggers a file download', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();
    await simulator.openExportDropdown();

    const download = await simulator.downloadSeatsCsv();

    expect(download.suggestedFilename()).toMatch(/nepal-seats.*\.csv/);
  });
});
```

**Step 2: Run the test**

```bash
npx playwright test e2e/journeys/export-results.spec.js --headed
```

Expected: 3 tests pass

**Step 3: Commit**

```bash
git add e2e/journeys/export-results.spec.js
git commit -m "feat: add export results Playwright journey test"
```

---

### Task 10: Run full suite and add npm script

**Step 1: Run all Playwright tests**

```bash
npx playwright test
```

Expected: 12 tests pass across 4 journey files

**Step 2: Verify package.json scripts work**

```bash
npm run test:e2e
```

Expected: same 12 tests pass

**Step 3: Final commit**

```bash
git add package.json
git commit -m "feat: complete Playwright E2E test suite — 4 user journeys, 12 tests"
```
