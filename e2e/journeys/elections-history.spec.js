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

    // Use Playwright's retrying assertion instead of .all() which doesn't retry
    await expect(page.getByRole('link', { name: /\b(19|20)\d{2}\b/ }).first()).toBeVisible();
  });

  test('navigating to 2022 election shows results', async ({ page }) => {
    const electionsPage = new ElectionsPage(page);
    await electionsPage.navigateToYear('2022');

    await expect(page.getByText(/2022/)).toBeVisible();
  });
});
