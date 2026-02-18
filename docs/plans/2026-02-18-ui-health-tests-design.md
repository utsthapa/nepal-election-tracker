# UI Health Tests Design

**Date:** 2026-02-18
**Scope:** Navigation smoke tests + Simulator UI behaviour tests
**Approach:** Two new spec files, extended page objects (Approach A)

---

## Background

The existing 20 Playwright tests cover: homepage→simulator navigation, simulator baseline/reset/export, slider zero-sum and baseline-reset invariants, Nepal map loading, and elections history navigation.

Uncovered: whether all 8 nav routes load without error, whether simulator tabs switch correctly, whether the lock toggle and majority indicator work.

---

## New Files

### `e2e/journeys/navigation.spec.js`

8 tests — one per nav item from `Header.jsx`:

| Route           | Assertion                 |
| --------------- | ------------------------- |
| `/`             | title contains "nepal"    |
| `/simulator`    | URL contains `simulator`  |
| `/elections`    | elections heading visible |
| `/analysis`     | page loads (h1 or title)  |
| `/districts`    | page loads                |
| `/demographics` | page loads                |
| `/nepal-data`   | page loads                |
| `/about`        | page loads                |

Each test clicks the nav link from the homepage and asserts the destination loaded correctly. Active-link highlighting is verified for `/simulator` (red underline from `isActive()` in `Header.jsx`).

### `e2e/journeys/simulator-ui.spec.js`

6 tests:

| Test                                         | Assertion                                      |
| -------------------------------------------- | ---------------------------------------------- |
| Manual tab is active by default              | Manual tab has active styling                  |
| Clicking Demographics tab shows panel        | DemographicInputPanel content visible          |
| Clicking Advanced tab shows advanced section | Switching matrix / advanced content visible    |
| Lock button toggles label                    | "Sliders Locked" → click → "Sliders Unlocked"  |
| Majority indicator present at baseline       | "Majority" or "Hung" text visible              |
| Boosting NC to 70% shows Majority            | Set NC=70, majority indicator reads "Majority" |

---

## Page Object Changes

### `e2e/pages/SimulatorPage.js`

Add locators:

- `manualTab` — tab button with text "Manual"
- `demographicsTab` — tab button with text "Demographics"
- `advancedTab` — tab button with text "Advanced"
- `lockButton` — button matching /sliders (locked|unlocked)/i
- `majorityIndicator` — element matching /majority|hung/i

Add helper:

- `clickTab(name)` — clicks the named tab and waits for content

### `e2e/pages/HomePage.js`

Add nav link locators for all 8 routes.

---

## Implementation Order

1. Extend `SimulatorPage.js` with new locators
2. Extend `HomePage.js` with nav link locators
3. Write `navigation.spec.js`
4. Write `simulator-ui.spec.js`
5. Run full suite — verify 34/34 pass
