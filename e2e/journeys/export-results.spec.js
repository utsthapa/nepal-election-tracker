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

  test('clicking Seats Summary CSV triggers the export handler', async ({ page }) => {
    const simulator = new SimulatorPage(page);
    await simulator.goto();

    await simulator.triggerSeatsCsvExport();

    // Export ran — dropdown should now be closed (exportSeatsCsvOption hidden)
    await expect(simulator.exportSeatsCsvOption).not.toBeVisible();
  });
});
