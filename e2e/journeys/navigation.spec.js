// e2e/journeys/navigation.spec.js
//
// Smoke-tests every nav link: clicking it loads the correct page without crashing.

import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage.js';

test.describe('Navigation health', () => {
  test('home page loads with Nepal in title', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveTitle(/nepal/i);
  });

  test('Simulator nav link loads /simulator', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.simulatorNavLink.click();
    await expect(page).toHaveURL(/\/simulator/);
  });

  test('Elections nav link loads /elections', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.electionsNavLink.click();
    await expect(page).toHaveURL(/\/elections/);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('Analysis nav link loads /analysis with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.analysisNavLink.click();
    await expect(page).toHaveURL(/\/analysis/);
    await expect(page.getByRole('heading', { name: /analysis/i }).first()).toBeVisible();
  });

  test('Districts nav link loads /districts with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.districtsNavLink.click();
    await expect(page).toHaveURL(/\/districts/);
    await expect(page.getByRole('heading', { name: /districts/i })).toBeVisible();
  });

  test('Demographics nav link loads /demographics with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.demographicsNavLink.click();
    await expect(page).toHaveURL(/\/demographics/);
    await expect(page.getByRole('heading', { name: /demographics/i }).first()).toBeVisible();
  });

  test('Nepal Data nav link loads /nepal-data with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.nepalDataNavLink.click();
    await expect(page).toHaveURL(/\/nepal-data/);
    await expect(page.getByRole('heading', { name: /nepal macro data/i })).toBeVisible();
  });

  test('About nav link loads /about with heading', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.aboutNavLink.click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('heading', { name: /about nepalisoch/i })).toBeVisible();
  });
});
