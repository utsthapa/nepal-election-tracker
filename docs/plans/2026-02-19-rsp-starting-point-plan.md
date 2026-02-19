# RSP Starting Point Mode + Data Mode Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix two bugs in the guided simulator flow and add "RSP National Entry" as a first-class starting point option that corrects RSP's 2022 FPTP undercount by initialising their share at their PR proportion (10.70%), taken proportionally from all other parties.

**Architecture:** The entry algorithm lives in a new `utils/scenarios.js` utility (unit-testable, importable). The simulator page consumes it and adds a third card to Step 2. Two one-line bug fixes are done first, each committed separately so they're easy to revert.

**Tech Stack:** Next.js (app router), React hooks, Playwright for E2E, Vitest/Jest for unit tests

---

## Task 1: Fix data mode bug

**Files:**
- Modify: `app/simulator/page.jsx:568`

**Step 1: Reproduce the bug mentally**

In `handleGuidedModeSelect`, the `else` branch (data mode) calls `setGuidedStep(4)`.
The data mode UI at lines 969 and 1174 checks `guidedStep === 3`.
Clicking "Data Mode" therefore shows a blank panel forever.

**Step 2: Apply the fix**

In `app/simulator/page.jsx`, find:
```js
} else {
  setGuidedStep(4);
  setSelectedYear(2026);
  setDataFlowStep(0);
}
```
Change `setGuidedStep(4)` to `setGuidedStep(3)`.

**Step 3: Manual verify in browser**

1. Open http://localhost:3001/simulator
2. Click "Data Mode" in Step 0
3. Confirm the data workspace panel appears (filters, search, constituency table)

**Step 4: Commit**

```bash
git add app/simulator/page.jsx
git commit -m "fix(simulator): data mode was setting guidedStep=4, data UI checks step 3"
```

---

## Task 2: Fix custom scenario baseline

**Files:**
- Modify: `app/simulator/page.jsx:381-464`

**Step 1: Understand the bug**

`applyCustomScenario()` currently builds its initial slider state as equal shares:
```js
const equalShare = 100 / (parties.length + 1); // ~7.7%
let baseFptp = {};
parties.forEach(p => { baseFptp[p] = equalShare; });
```
This ignores 2022 data. NC, UML, and Maoist all start at ~7.7% — impossible.

**Step 2: Apply the fix**

Replace the `baseFptp` / `basePr` initialisation block.

Find this in `applyCustomScenario`:
```js
const parties = Object.keys(PARTIES).filter(p => p !== 'Others' && p !== 'Independent');
const equalShare = 100 / (parties.length + 1); // +1 for Others

let baseFptp = {};
parties.forEach(p => {
  baseFptp[p] = equalShare;
});
baseFptp['Others'] = equalShare;

const basePr = { ...baseFptp };
```

Replace with:
```js
// Start from 2022 official results, not equal shares
let baseFptp = { ...OFFICIAL_FPTP_VOTE };
let basePr = { ...OFFICIAL_PR_VOTE };
```

Note: `OFFICIAL_FPTP_VOTE` and `OFFICIAL_PR_VOTE` are already imported at the top of the file from `../../data/constituencies`.

**Step 3: Manual verify**

1. Open http://localhost:3001/simulator
2. Go through Simulation Mode → National Swing → "Custom Scenario"
3. Set any values on the decay/boost sliders and click "Apply & Continue"
4. Check the Manual tab — NC should be ~23%, UML ~30%, not ~7%

**Step 4: Commit**

```bash
git add app/simulator/page.jsx
git commit -m "fix(simulator): custom scenario was starting from equal shares, now uses 2022 baseline"
```

---

## Task 3: Create `utils/scenarios.js` with `applyRspNationalEntry`

**Files:**
- Create: `utils/scenarios.js`
- Create: `__tests__/scenarios.test.js`

**Step 1: Write the failing test first**

Create `__tests__/scenarios.test.js`:
```js
import { applyRspNationalEntry } from '../utils/scenarios.js';

const FPTP_2022 = {
  NC: 23.3, UML: 30.5, Maoist: 9.23, RSP: 7.82,
  RPP: 5.53, JSPN: 3.56, US: 4.09, JP: 2.85,
  LSP: 1.59, NUP: 1.65, Others: 9.88,
};
const RSP_PR = 10.70;

describe('applyRspNationalEntry', () => {
  let result;
  beforeEach(() => { result = applyRspNationalEntry(FPTP_2022); });

  test('RSP is set to PR proportion', () => {
    expect(result.RSP).toBeCloseTo(RSP_PR, 1);
  });

  test('all shares still sum to 100', () => {
    const total = Object.values(result).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(100, 5);
  });

  test('all other parties are reduced', () => {
    Object.keys(FPTP_2022).forEach(p => {
      if (p !== 'RSP') expect(result[p]).toBeLessThan(FPTP_2022[p]);
    });
  });

  test('NC is ~22.57 after entry', () => {
    expect(result.NC).toBeCloseTo(22.57, 1);
  });

  test('UML is ~29.55 after entry', () => {
    expect(result.UML).toBeCloseTo(29.55, 1);
  });

  test('is a noop when RSP is already at or above PR proportion', () => {
    const alreadyHigh = { ...FPTP_2022, RSP: 15 };
    const out = applyRspNationalEntry(alreadyHigh);
    // RSP should not shrink below what was passed in
    expect(out.RSP).toBeGreaterThanOrEqual(15);
  });

  test('does not mutate the input object', () => {
    const copy = { ...FPTP_2022 };
    applyRspNationalEntry(FPTP_2022);
    expect(FPTP_2022).toEqual(copy);
  });
});
```

**Step 2: Run to confirm failure**

```bash
npx jest __tests__/scenarios.test.js --no-coverage
```
Expected: `Cannot find module '../utils/scenarios.js'`

**Step 3: Implement `utils/scenarios.js`**

```js
// utils/scenarios.js
//
// Starting-point scenario utilities for the election simulator.
// These functions adjust the initial slider state before the user
// makes any manual changes, modelling structural differences between
// parties that pure vote-share sliders don't capture.

import { OFFICIAL_PR_VOTE } from '../data/constituencies';

/**
 * Apply RSP National Entry adjustment to an FPTP slider map.
 *
 * Background
 * ----------
 * In 2022, RSP did not contest every FPTP constituency, so their FPTP
 * national vote share (7.82%) understates their true support relative to
 * their PR vote (10.70%). This function corrects for that by:
 *
 *   1. Setting RSP's FPTP share to their PR proportion (10.70%)
 *   2. Taking the difference (2.88pp) proportionally from every other party
 *
 * The proportional reduction is:
 *   loss_p = (share_p / sum_others) × (RSP_PR - RSP_FPTP)
 *
 * After this call, the standard zero-sum slider mechanic handles all
 * further adjustments normally — no special treatment needed.
 *
 * Verified projections from post-entry baseline (RSP = 10.70%):
 *   RSP → 25%:  NC ~19.0%,  UML ~24.8%
 *   RSP → 30%:  NC ~17.7%,  UML ~23.2%
 *   RSP → 35%:  NC ~16.4%,  UML ~21.5%
 *
 * @param {Record<string, number>} fptp  FPTP slider map, values in %, must sum ~100
 * @returns {Record<string, number>}     New map with RSP at PR proportion; sums to 100
 */
export function applyRspNationalEntry(fptp) {
  const RSP_PR = OFFICIAL_PR_VOTE['RSP']; // 10.70
  const delta = RSP_PR - (fptp['RSP'] ?? 0);

  // If RSP is already at or above their PR proportion, nothing to adjust
  if (delta <= 0) return { ...fptp };

  const sumOthers = Object.entries(fptp)
    .filter(([p]) => p !== 'RSP')
    .reduce((sum, [, v]) => sum + v, 0);

  const result = {};
  Object.entries(fptp).forEach(([party, share]) => {
    if (party === 'RSP') {
      result[party] = RSP_PR;
    } else {
      result[party] = share - (share / sumOthers) * delta;
    }
  });

  return result;
}
```

**Step 4: Run tests to confirm they pass**

```bash
npx jest __tests__/scenarios.test.js --no-coverage
```
Expected: all 7 tests PASS

**Step 5: Commit**

```bash
git add utils/scenarios.js __tests__/scenarios.test.js
git commit -m "feat(scenarios): add applyRspNationalEntry — corrects RSP FPTP undercount to PR proportion"
```

---

## Task 4: Wire `applyRspNationalEntry` into the simulator

**Files:**
- Modify: `app/simulator/page.jsx`

**Step 1: Add import**

At the top of `app/simulator/page.jsx`, find the existing imports from `../../data/constituencies` and add below them:

```js
import { applyRspNationalEntry } from '../../utils/scenarios';
```

**Step 2: Add `'rsp-entry'` branch to `handleStartingPointSelect`**

Find the existing handler:
```js
const handleStartingPointSelect = point => {
  setStartingPoint(point);
  if (point === '2022') {
    resetSliders();
    setGuidedStep(3);
  } else {
    setGuidedStep(2);
  }
};
```

Replace with:
```js
const handleStartingPointSelect = point => {
  setStartingPoint(point);
  if (point === '2022') {
    // Reset to official 2022 baseline
    resetSliders();
    setGuidedStep(3);
  } else if (point === 'rsp-entry') {
    // RSP National Entry: correct RSP's FPTP share to their PR proportion,
    // taking the difference proportionally from all other parties.
    // PR sliders already have RSP at 10.70% so no change needed there.
    const newFptp = applyRspNationalEntry({ ...OFFICIAL_FPTP_VOTE });
    replaceSliders(newFptp, { ...OFFICIAL_PR_VOTE });
    setGuidedStep(3);
  } else {
    // Custom scenario — stay on step 2 to show sub-panel options
    setGuidedStep(2);
  }
};
```

**Step 3: Add the third card to Step 2 UI**

Find the existing two-card grid in `guidedStep === 2 && simulationPath !== 'demographics'`:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
  <button
    onClick={() => handleStartingPointSelect('2022')}
    ...
  >
    ...
  </button>

  <button
    onClick={() => handleStartingPointSelect('custom')}
    ...
  >
    ...
  </button>
</div>
```

Change to `lg:grid-cols-3` and add the third card:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
  <button
    onClick={() => handleStartingPointSelect('2022')}
    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
      startingPoint === '2022'
        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
    }`}
  >
    <p className="text-sm font-semibold text-[rgb(24,26,36)]">2022 Baseline</p>
    <p className="text-xs text-[rgb(100,110,130)] mt-1">
      Start with official 2022 election results as your baseline.
    </p>
  </button>

  <button
    onClick={() => handleStartingPointSelect('rsp-entry')}
    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
      startingPoint === 'rsp-entry'
        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
    }`}
  >
    <p className="text-sm font-semibold text-[rgb(24,26,36)]">RSP National Entry</p>
    <p className="text-xs text-[rgb(100,110,130)] mt-1">
      RSP ran in fewer seats in 2022. This sets their FPTP base to their PR
      proportion (10.70%), taking the difference proportionally from all parties.
    </p>
  </button>

  <button
    onClick={() => handleStartingPointSelect('custom')}
    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
      startingPoint === 'custom'
        ? 'border-[#B91C1C] bg-[#B91C1C]/5'
        : 'border-[rgb(219,211,196)] hover:border-[rgb(24,26,36)]/30'
    }`}
  >
    <p className="text-sm font-semibold text-[rgb(24,26,36)]">Custom Scenario</p>
    <p className="text-xs text-[rgb(100,110,130)] mt-1">
      Apply incumbency decay, RSP boost, or anti-establishment wave.
    </p>
  </button>
</div>
```

**Step 4: Manual verify in browser**

1. Open http://localhost:3001/simulator
2. Simulation Mode → National Swing → Step 2
3. Confirm three cards appear: 2022 Baseline | RSP National Entry | Custom Scenario
4. Click "RSP National Entry" → confirm it advances to Step 3
5. Open Manual tab → confirm RSP slider reads ~10.7%, NC ~22.6%, UML ~29.6%
6. Move RSP slider to 30% → confirm NC drops to ~17.7%, UML to ~23.2%

**Step 5: Commit**

```bash
git add app/simulator/page.jsx
git commit -m "feat(simulator): add RSP National Entry as Step 2 starting point option"
```

---

## Task 5: E2E test for RSP National Entry flow

**Files:**
- Create: `e2e/journeys/rsp-national-entry.spec.js`
- Modify: `e2e/pages/SimulatorPage.js` (add helper if needed)

**Step 1: Write the test**

Create `e2e/journeys/rsp-national-entry.spec.js`:

```js
// e2e/journeys/rsp-national-entry.spec.js
//
// Tests that RSP National Entry starting point:
//   - Advances directly to Step 3 (no sub-panel)
//   - Sets RSP slider to ~10.70% (PR proportion)
//   - Total vote share stays 100
//   - Boosting RSP to 30% puts NC ~17.7% and UML ~23.2%

import { test, expect } from '@playwright/test';
import { SimulatorPage } from '../pages/SimulatorPage.js';

const NC_SLIDER = 'Nepali Congress vote share';
const UML_SLIDER = 'CPN-UML vote share';
const RSP_SLIDER = 'Rastriya Swatantra Party vote share';

const RSP_ENTRY_VALUE = 10.70;
const NC_POST_ENTRY  = 22.57;
const UML_POST_ENTRY = 29.55;

test.describe('RSP National Entry starting point', () => {
  // Navigate through guided flow to Step 2 and click RSP National Entry
  async function selectRspEntry(page) {
    // Don't use SimulatorPage.goto() — that skips the guided flow
    await page.addInitScript(() => localStorage.removeItem('hasSeenQuickStart'));
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Step 0: choose Simulation Mode
    await page.getByRole('button', { name: /simulation mode/i }).click();

    // Step 1: choose National Swing path (default, just click Next)
    await page.getByRole('button', { name: /national swing/i }).click();

    // Step 2: click RSP National Entry
    await page.getByRole('button', { name: /rsp national entry/i }).click();

    // Should jump straight to Step 3
    await page.waitForLoadState('networkidle');
  }

  test('clicking RSP National Entry advances to Step 3 (no sub-panel)', async ({ page }) => {
    await selectRspEntry(page);
    // Step 3 header says "Step 1 of 2: Manual Vote Sliders"
    await expect(page.getByText(/manual vote sliders/i).first()).toBeVisible();
  });

  test('RSP slider is set to ~10.70% after entry', async ({ page }) => {
    await selectRspEntry(page);
    const sim = new SimulatorPage(page);
    const rspValue = await sim.getSliderValue(RSP_SLIDER);
    expect(rspValue).toBeCloseTo(RSP_ENTRY_VALUE, 0);
  });

  test('NC is reduced to ~22.57% after entry', async ({ page }) => {
    await selectRspEntry(page);
    const sim = new SimulatorPage(page);
    const ncValue = await sim.getSliderValue(NC_SLIDER);
    expect(ncValue).toBeCloseTo(NC_POST_ENTRY, 0);
  });

  test('total vote share stays at 100 after entry', async ({ page }) => {
    await selectRspEntry(page);
    const sim = new SimulatorPage(page);
    const total = await sim.getSliderPanelTotal(NC_SLIDER);
    expect(total).toBe(100);
  });

  test('boosting RSP to 30% puts NC at ~17.7%', async ({ page }) => {
    await selectRspEntry(page);
    const sim = new SimulatorPage(page);
    await sim.setSlider(RSP_SLIDER, 30);
    const nc = await sim.getSliderValue(NC_SLIDER);
    expect(nc).toBeCloseTo(17.7, 0);
  });

  test('boosting RSP to 30% keeps total seats at 275', async ({ page }) => {
    await selectRspEntry(page);
    const sim = new SimulatorPage(page);
    await sim.setSlider(RSP_SLIDER, 30);
    await expect(sim.seatsTotalText).toContainText('275');
  });

  test('boosting RSP to 30% keeps vote total at 100', async ({ page }) => {
    await selectRspEntry(page);
    const sim = new SimulatorPage(page);
    await sim.setSlider(RSP_SLIDER, 30);
    const total = await sim.getSliderPanelTotal(RSP_SLIDER);
    expect(total).toBe(100);
  });
});
```

**Step 2: Run to confirm tests exist and can be found**

```bash
npx playwright test e2e/journeys/rsp-national-entry.spec.js --list
```
Expected: 7 tests listed

**Step 3: Run the tests**

```bash
npx playwright test e2e/journeys/rsp-national-entry.spec.js
```
Expected: all 7 PASS (if implementation in Task 4 is correct)

**Step 4: Commit**

```bash
git add e2e/journeys/rsp-national-entry.spec.js
git commit -m "test(e2e): add RSP National Entry journey — entry values, 30% boost, seat invariant"
```

---

## Task 6: Final check and push

**Step 1: Run full test suite**

```bash
npx playwright test
```
Expected: all existing tests pass + 7 new RSP entry tests pass

**Step 2: Run unit tests**

```bash
npx jest --no-coverage
```
Expected: all pass including the 7 scenarios.test.js tests

**Step 3: Push**

```bash
git push
```
