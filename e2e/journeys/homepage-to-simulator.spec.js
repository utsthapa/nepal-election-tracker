// e2e/journeys/homepage-to-simulator.spec.js
import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage.js';
import { SimulatorPage } from '../pages/SimulatorPage.js';

test.describe('Homepage → Simulator journey', () => {
  test('loads homepage and navigates to simulator via nav', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(page).toHaveTitle(/nepal/i);

    await home.navigateToSimulator();
    await expect(page).toHaveURL(/simulator/);
  });

  test('simulator shows 275 total seats at baseline', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await expect(simulator.seatsTotalText).toBeVisible();
    await expect(simulator.seatsTotalText).toContainText('275');
  });

  test('Reset button is visible and clickable', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await expect(simulator.resetButton).toBeVisible();
    await simulator.clickReset();

    await expect(simulator.seatsTotalText).toContainText('275');
  });
});
