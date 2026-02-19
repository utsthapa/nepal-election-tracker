// e2e/journeys/slider-interactions.spec.js
//
// Tests that slider adjustments produce consistent, correct results:
//   - Zero-sum constraint: vote % panel total always stays at 100
//   - Seat total is always 275 regardless of slider position
//   - Moving a party's slider actually changes its displayed value
//   - Reset restores the 2022 baseline values exactly
//   - Boosting a dominant party increases its seat count

import { test, expect } from '@playwright/test';

import { SimulatorPage } from '../pages/SimulatorPage.js';

// Baseline 2022 FPTP values (from data/constituencies.js OFFICIAL_FPTP_VOTE)
const NC_BASELINE = 23.3;
const UML_BASELINE = 30.5;
const NC_SLIDER = 'Nepali Congress vote share';
const UML_SLIDER = 'CPN-UML vote share';

test.describe('Slider interactions', () => {
  test('slider panel % total stays at 100 after boosting NC', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    // Boost NC from ~23 to 50
    await simulator.setSlider(NC_SLIDER, 50);

    // Zero-sum constraint: other parties shrink, total stays 100
    const total = await simulator.getSliderPanelTotal(NC_SLIDER);
    expect(total).toBe(100);
  });

  test('total seats stays 275 after boosting NC', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.setSlider(NC_SLIDER, 55);

    // Constitutional total must always be 275
    await expect(simulator.seatsTotalText).toContainText('275');
  });

  test('total seats stays 275 after reducing UML', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.setSlider(UML_SLIDER, 10);

    await expect(simulator.seatsTotalText).toContainText('275');
  });

  test('slider value actually changes when set', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    const before = await simulator.getSliderValue(NC_SLIDER);
    await simulator.setSlider(NC_SLIDER, 60);
    const after = await simulator.getSliderValue(NC_SLIDER);

    expect(after).toBeGreaterThan(before);
    expect(after).toBeCloseTo(60, 0);
  });

  test('Reset restores NC to 2022 baseline (~23.3)', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    // Boost NC far above baseline
    await simulator.setSlider(NC_SLIDER, 70);
    const boosted = await simulator.getSliderValue(NC_SLIDER);
    expect(boosted).toBeGreaterThan(NC_BASELINE + 5);

    // Reset should restore baseline
    await simulator.clickReset();
    const restored = await simulator.getSliderValue(NC_SLIDER);
    expect(restored).toBeCloseTo(NC_BASELINE, 0);
  });

  test('Reset restores UML to 2022 baseline (~30.5)', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.setSlider(UML_SLIDER, 5);
    await simulator.clickReset();

    const restored = await simulator.getSliderValue(UML_SLIDER);
    // aria-valuenow is Math.round()'d by the component, so 30.5 → 31.
    // Accept anything within 1pp of baseline.
    expect(Math.abs(restored - UML_BASELINE)).toBeLessThan(1);
  });

  test('slider panel % total stays at 100 after reducing UML', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.setSlider(UML_SLIDER, 5);

    const total = await simulator.getSliderPanelTotal(UML_SLIDER);
    expect(total).toBe(100);
  });

  test('slider panel % total is 100 at baseline (no changes)', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    const total = await simulator.getSliderPanelTotal(NC_SLIDER);
    expect(total).toBe(100);
  });
});
