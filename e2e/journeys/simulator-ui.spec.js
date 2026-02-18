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

    // Use exact match to target only the standalone "Majority" indicator span,
    // not partial matches like "Path to Majority" or "Stable majority"
    await expect(page.getByText('Majority', { exact: true }).first()).toBeVisible();
  });
});
