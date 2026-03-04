import { chromium } from 'playwright';

const baseURL = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const viewport = { width: 390, height: 844 };

const routes = [
  '/',
  '/about',
  '/analysis',
  '/analysis/30-years-democracy',
  '/demographics',
  '/districts',
  '/districts/bhojpur',
  '/elections',
  '/elections/2022',
  '/elections/forecast',
  '/methodology',
  '/methodology/economic-voting',
  '/nepal-data',
  '/nepal-map',
  '/newsletter',
  '/polls',
  '/polls/poll-001',
  '/prediction-markets',
  '/simulator',
  '/simulator/2026',
];

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140);
}

async function auditRoute(browser, route) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(cleanText(msg.text()));
    }
  });

  page.on('pageerror', error => {
    pageErrors.push(cleanText(error?.message || error));
  });

  let status = 'ok';
  let reason = '';
  let details = null;

  try {
    const response = await page.goto(`${baseURL}${route}`, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });

    if (!response || !response.ok()) {
      status = 'http_error';
      reason = `HTTP ${response?.status?.() ?? 'no_response'}`;
    } else {
      await page.waitForTimeout(350);
      details = await page.evaluate(() => {
        const vw = window.innerWidth;
        const sw = document.documentElement.scrollWidth;
        const overflow = sw - vw;

        const offenders = Array.from(document.querySelectorAll('body *'))
          .map(el => {
            const rect = el.getBoundingClientRect();
            return {
              rightOverflow: rect.right - vw,
              leftOverflow: Math.max(0, -rect.left),
              width: rect.width,
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              className: (el.className || '').toString().slice(0, 100) || null,
            };
          })
          .filter(item => item.rightOverflow > 1 || item.leftOverflow > 1)
          .sort((a, b) => b.rightOverflow - a.rightOverflow)
          .slice(0, 5);

        return { vw, sw, overflow, offenders };
      });

      if ((details?.overflow || 0) > 1) {
        status = 'overflow';
        reason = `scrollWidth ${details.sw} > viewport ${details.vw}`;
      }
    }
  } catch (error) {
    status = 'exception';
    reason = cleanText(error?.message || error);
  }

  if (status === 'ok' && (consoleErrors.length > 0 || pageErrors.length > 0)) {
    status = 'runtime_error';
    reason = 'Console or runtime errors detected';
  }

  await page.close();
  return {
    route,
    status,
    reason,
    overflow: details?.overflow ?? null,
    offenders: details?.offenders ?? [],
    consoleErrors: consoleErrors.slice(0, 3),
    pageErrors: pageErrors.slice(0, 3),
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const route of routes) {
    // eslint-disable-next-line no-await-in-loop
    const result = await auditRoute(browser, route);
    results.push(result);
    console.log(
      `${result.status === 'ok' ? 'PASS' : 'FAIL'} ${route} ${result.reason ? `- ${result.reason}` : ''}`
    );
  }
  await browser.close();

  const failing = results.filter(r => r.status !== 'ok');
  console.log('\nSummary');
  console.log(`Total: ${results.length}`);
  console.log(`Passing: ${results.length - failing.length}`);
  console.log(`Failing: ${failing.length}`);

  if (failing.length > 0) {
    console.log('\nFailures');
    for (const item of failing) {
      console.log(`- ${item.route}: ${item.status} (${item.reason || 'no reason'})`);
      if (item.offenders?.length) {
        const off = item.offenders[0];
        console.log(
          `  Top offender: <${off.tag}> width=${Math.round(off.width)} rightOverflow=${Math.round(off.rightOverflow)} class="${off.className || ''}"`
        );
      }
      if (item.consoleErrors?.length) {
        console.log(`  Console: ${item.consoleErrors[0]}`);
      }
      if (item.pageErrors?.length) {
        console.log(`  Runtime: ${item.pageErrors[0]}`);
      }
    }
  }

  process.exit(failing.length === 0 ? 0 : 1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
