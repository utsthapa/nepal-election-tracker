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

    await expect(page.getByText(/2022/)).toBeVisible();
  });
});
