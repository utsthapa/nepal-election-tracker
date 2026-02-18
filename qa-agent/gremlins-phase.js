// qa-agent/gremlins-phase.js
//
// Launches a headless Chromium browser, visits each of the 8 routes,
// injects gremlins.js, and runs chaos testing for the configured duration.
// Collects console errors and uncaught exceptions per route.
//
// Returns: { [routePath]: Array<{ type, message, stack?, timestamp }> }

import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3001';

// chaosSeconds: how long to run gremlins on each route
const ROUTES = [
  { path: '/', chaosSeconds: 30 },
  { path: '/simulator', chaosSeconds: 30 },
  { path: '/elections', chaosSeconds: 10 },
  { path: '/elections/2022', chaosSeconds: 10 },
  { path: '/nepal-map', chaosSeconds: 30 },
  { path: '/districts', chaosSeconds: 10 },
  { path: '/demographics', chaosSeconds: 10 },
  { path: '/about', chaosSeconds: 10 },
];

export async function runGremlinsPhase() {
  const browser = await chromium.launch();
  const results = {};

  for (const route of ROUTES) {
    const errors = [];
    const page = await browser.newPage();

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push({
          type: 'console-error',
          message: msg.text(),
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Capture uncaught JS exceptions
    page.on('pageerror', err => {
      errors.push({
        type: 'uncaught-exception',
        message: err.message,
        stack: err.stack ?? '',
        timestamp: new Date().toISOString(),
      });
    });

    console.log(`[Chaos] ${route.path} — starting ${route.chaosSeconds}s run...`);

    try {
      await page.goto(BASE_URL + route.path, {
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
      });

      // Inject gremlins.js from node_modules (no CDN dependency)
      const gremlinsPath = path.resolve(
        __dirname,
        '../node_modules/gremlins.js/dist/gremlins.min.js'
      );
      await page.addScriptTag({ path: gremlinsPath });

      // Unleash the horde
      await page.evaluate(() => {
        window.gremlins.createHorde().unleash();
      });

      // Let gremlins run for the configured duration
      await page.waitForTimeout(route.chaosSeconds * 1_000);
    } catch (err) {
      errors.push({
        type: 'phase-error',
        message: err.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      await page.close();
    }

    results[route.path] = errors;
    const icon = errors.length === 0 ? '✅' : `⚠️  ${errors.length} error(s)`;
    console.log(`[Chaos] ${route.path}: ${icon}`);
  }

  await browser.close();
  return results;
}
