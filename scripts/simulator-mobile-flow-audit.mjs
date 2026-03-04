import { chromium } from 'playwright';

const baseURL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const viewport = { width: 390, height: 844 };

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

async function overflowAmount(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

async function clickIfVisible(page, selector) {
  const loc = page.locator(selector);
  if ((await loc.count()) > 0 && (await loc.first().isVisible())) {
    await loc.first().click();
    return true;
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });

  const consoleErrors = [];
  const pageErrors = [];
  const checkpoints = [];
  const issues = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(cleanText(msg.text()));
    }
  });
  page.on('pageerror', error => {
    pageErrors.push(cleanText(error?.message || error));
  });

  try {
    await page.goto(`${baseURL}/simulator`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(500);

    checkpoints.push({
      step: 'initial_load',
      url: page.url(),
      overflow: await overflowAmount(page),
    });

    if (!page.url().includes('/simulator/2026')) {
      issues.push(`Expected redirect to /simulator/2026, got ${page.url()}`);
    }

    await clickIfVisible(page, 'button:has-text("Use Full Dashboard")');

    const switchedToTable = await clickIfVisible(page, 'button:has-text("TABLE")');
    if (switchedToTable) {
      await page.waitForTimeout(250);
      checkpoints.push({ step: 'table_view', overflow: await overflowAmount(page) });
      await clickIfVisible(page, 'button:has-text("MAP")');
      await page.waitForTimeout(250);
      checkpoints.push({ step: 'map_view', overflow: await overflowAmount(page) });
    } else {
      issues.push('Could not find TABLE toggle button in simulator flow.');
    }

    const sliders = page.locator('input[type="range"]');
    const sliderCount = await sliders.count();
    if (sliderCount > 0) {
      const interactions = Math.min(4, sliderCount);
      for (let i = 0; i < interactions; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sliders.nth(i).fill('55').catch(() => {});
      }
      await page.waitForTimeout(300);
      checkpoints.push({ step: 'after_slider_changes', overflow: await overflowAmount(page) });
    } else {
      issues.push('No range sliders found on simulator page.');
    }

    // Scroll full page and sample overflow at multiple points.
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const steps = [0, 0.25, 0.5, 0.75, 1];
    for (const fraction of steps) {
      const y = Math.floor(bodyHeight * fraction);
      // eslint-disable-next-line no-await-in-loop
      await page.evaluate(val => window.scrollTo(0, val), y);
      // eslint-disable-next-line no-await-in-loop
      await page.waitForTimeout(140);
      // eslint-disable-next-line no-await-in-loop
      checkpoints.push({ step: `scroll_${fraction}`, overflow: await overflowAmount(page) });
    }

    const maxOverflow = Math.max(...checkpoints.map(c => c.overflow ?? 0), 0);
    if (maxOverflow > 1) {
      issues.push(`Detected horizontal overflow up to ${maxOverflow}px during simulator flow.`);
    }
    if (consoleErrors.length > 0) {
      issues.push(`Console errors detected (${consoleErrors.length}).`);
    }
    if (pageErrors.length > 0) {
      issues.push(`Runtime errors detected (${pageErrors.length}).`);
    }

    console.log('Simulator mobile flow audit');
    console.log(`URL: ${page.url()}`);
    console.log(`Checkpoints: ${checkpoints.length}`);
    console.log(`Max overflow: ${Math.max(...checkpoints.map(c => c.overflow ?? 0), 0)}`);
    console.log(`Console errors: ${consoleErrors.length}`);
    console.log(`Runtime errors: ${pageErrors.length}`);

    if (issues.length > 0) {
      console.log('\nIssues');
      issues.forEach(item => console.log(`- ${item}`));
      if (consoleErrors[0]) {
        console.log(`- First console error: ${consoleErrors[0]}`);
      }
      if (pageErrors[0]) {
        console.log(`- First runtime error: ${pageErrors[0]}`);
      }
      process.exitCode = 1;
    } else {
      console.log('\nPASS: Simulator mobile flow looks healthy.');
      process.exitCode = 0;
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
