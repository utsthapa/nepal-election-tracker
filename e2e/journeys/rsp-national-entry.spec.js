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

test.describe('RSP National Entry starting point', () => {
  // Navigate through guided flow to Step 2 and click RSP National Entry
  async function selectRspEntry(page) {
    // Don't use SimulatorPage.goto() — that skips the guided flow
    await page.addInitScript(() => localStorage.removeItem('hasSeenQuickStart'));
    await page.goto('/simulator');
    await page.waitForLoadState('networkidle');

    // Step 0: choose Simulation Mode
    await page.getByRole('button', { name: /simulation mode/i }).click();

    // Step 1: choose National Swing path
    await page.getByRole('button', { name: /national swing/i }).click();

    // Step 2: click RSP National Entry
    await page.getByRole('button', { name: /rsp national entry/i }).click();

    // Should jump straight to Step 3
    await page.waitForLoadState('networkidle');
  }

  test('clicking RSP National Entry advances to Step 3 (no sub-panel)', async ({ page }) => {
    await selectRspEntry(page);
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
