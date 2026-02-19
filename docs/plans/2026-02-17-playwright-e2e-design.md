# Playwright E2E Test Design

**Date:** 2026-02-17
**Status:** Approved

## Goal

Add end-to-end Playwright tests covering full user journeys across the Nepal Election Simulator app.

## Approach: Page Object Model (POM)

Each page gets a helper class encapsulating selectors and actions. Tests read as plain English. Selectors are centralised — one fix propagates everywhere.

## File Structure

```
e2e/
  pages/
    HomePage.js
    SimulatorPage.js
    MapPage.js
    ElectionsPage.js
  journeys/
    homepage-to-simulator.spec.js
    map-exploration.spec.js
    elections-history.spec.js
    export-results.spec.js
playwright.config.js
```

## Server

- `webServer`: `next build && next start` (production build)
- `baseURL`: `http://localhost:3000`
- Playwright waits for server before running tests

## Journeys

1. **Homepage → Simulator** — load `/`, click Simulator nav, verify 275 total seats at baseline, click Reset, confirm seats unchanged
2. **Map exploration** — load `/nepal-map`, verify map renders, check province content visible
3. **Elections history** — load `/elections`, verify year links, navigate to a year, verify results render
4. **Export results** — open Export dropdown on `/simulator`, click CSV option, verify download is triggered

## Test script

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```
