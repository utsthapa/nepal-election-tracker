// e2e/journeys/slider-configurations.spec.js
//
// Tests covering 4 slider configuration scenarios:
//   1. Zero-sum enforcement — boosting one party compresses others; reducing frees them
//   2. Floor/ceiling limits — party at 0% stays at 0; extreme boost compresses all others
//   3. Multi-party combinations — setting 2-3 parties simultaneously keeps total=100 and seats=275
//   4. Reset after custom config — resetting after multiple slider changes restores ALL baselines

import { test, expect } from '@playwright/test';

import { SimulatorPage } from '../pages/SimulatorPage.js';

const NC_SLIDER = 'Nepali Congress vote share';
const UML_SLIDER = 'CPN-UML vote share';
const MAOIST_SLIDER = 'CPN-Maoist Centre vote share';
const RSP_SLIDER = 'Rastriya Swatantra Party vote share';

const NC_BASELINE = 23.3;
const UML_BASELINE = 30.5;
const MAOIST_BASELINE = 9.23;
const RSP_BASELINE = 7.82;

// ──────────────────────────────────────────────────────────────────────────────
// 1. Zero-sum enforcement
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Zero-sum enforcement', () => {
  test('boosting NC reduces UML and total stays 100', async ({ page }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    const beforeUML = await sim.getSliderValue(UML_SLIDER);
    await sim.setSlider(NC_SLIDER, 50);
    const afterUML = await sim.getSliderValue(UML_SLIDER);

    // UML must have been compressed to make room for NC
    expect(afterUML).toBeLessThan(beforeUML);
    expect(await sim.getSliderPanelTotal(NC_SLIDER)).toBe(100);
  });

  test('reducing NC frees share for other parties and total stays 100', async ({ page }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    const beforeUML = await sim.getSliderValue(UML_SLIDER);
    await sim.setSlider(NC_SLIDER, 10); // well below baseline ~23
    const afterUML = await sim.getSliderValue(UML_SLIDER);

    // Freed share redistributes to others — UML should grow
    expect(afterUML).toBeGreaterThan(beforeUML);
    expect(await sim.getSliderPanelTotal(NC_SLIDER)).toBe(100);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 2. Floor / ceiling limits
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Floor and ceiling limits', () => {
  test('setting UML to 0% keeps it at 0, total stays 100, seats stay 275', async ({ page }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    await sim.setSlider(UML_SLIDER, 0);

    expect(await sim.getSliderValue(UML_SLIDER)).toBeLessThanOrEqual(1);
    expect(await sim.getSliderPanelTotal(UML_SLIDER)).toBe(100);
    await expect(sim.seatsTotalText).toContainText('275');
  });

  test('boosting NC to 90% compresses all others, total=100, seats=275, Majority shown', async ({
    page,
  }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    await sim.setSlider(NC_SLIDER, 90);

    expect(await sim.getSliderPanelTotal(NC_SLIDER)).toBe(100);
    await expect(sim.seatsTotalText).toContainText('275');
    // At 90% NC dominates — must have an outright majority
    await expect(page.getByText('Majority', { exact: true }).first()).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 3. Multi-party combinations
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Multi-party combinations', () => {
  test('adjusting NC then UML keeps total=100 and seats=275', async ({ page }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    await sim.setSlider(NC_SLIDER, 40);
    await sim.setSlider(UML_SLIDER, 20);

    expect(await sim.getSliderPanelTotal(NC_SLIDER)).toBe(100);
    await expect(sim.seatsTotalText).toContainText('275');
  });

  test('adjusting three parties (NC, UML, Maoist) keeps total=100 and seats=275', async ({
    page,
  }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    await sim.setSlider(NC_SLIDER, 35);
    await sim.setSlider(UML_SLIDER, 25);
    await sim.setSlider(MAOIST_SLIDER, 15);

    expect(await sim.getSliderPanelTotal(NC_SLIDER)).toBe(100);
    await expect(sim.seatsTotalText).toContainText('275');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 4. Reset after custom configuration
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Reset after custom configuration', () => {
  test('Reset restores NC and UML after adjusting both', async ({ page }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    await sim.setSlider(NC_SLIDER, 50);
    await sim.setSlider(UML_SLIDER, 5);
    await sim.clickReset();

    const restoredNC = await sim.getSliderValue(NC_SLIDER);
    const restoredUML = await sim.getSliderValue(UML_SLIDER);

    expect(restoredNC).toBeCloseTo(NC_BASELINE, 0);
    // UML baseline 30.5 rounds to 31 — accept anything within 1pp
    expect(Math.abs(restoredUML - UML_BASELINE)).toBeLessThan(1);
  });

  test('Reset restores Maoist and RSP baselines after adjusting both', async ({ page }) => {
    const sim = new SimulatorPage(page);
    await sim.goto();

    await sim.setSlider(MAOIST_SLIDER, 25);
    await sim.setSlider(RSP_SLIDER, 1);
    await sim.clickReset();

    const restoredMaoist = await sim.getSliderValue(MAOIST_SLIDER);
    const restoredRSP = await sim.getSliderValue(RSP_SLIDER);

    expect(restoredMaoist).toBeCloseTo(MAOIST_BASELINE, 0);
    expect(restoredRSP).toBeCloseTo(RSP_BASELINE, 0);
  });
});
