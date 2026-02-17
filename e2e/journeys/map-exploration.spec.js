// e2e/journeys/map-exploration.spec.js
import { test, expect } from '@playwright/test';

import { MapPage } from '../pages/MapPage.js';

test.describe('Nepal Map exploration journey', () => {
  test('map page loads and shows heading', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();

    await expect(mapPage.heading).toBeVisible();
  });

  test('map renders (Leaflet container appears)', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();
    await mapPage.waitForMapReady();

    await expect(mapPage.mapContainer).toBeVisible();
  });

  test('page contains district description text', async ({ page }) => {
    const mapPage = new MapPage(page);
    await mapPage.goto();

    await expect(page.getByText(/77 districts/i).first()).toBeVisible();
  });
});
