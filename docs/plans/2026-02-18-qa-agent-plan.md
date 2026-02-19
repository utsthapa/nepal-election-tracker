# QA Agent Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an npm-script-triggered QA agent that runs Gremlins.js chaos testing across all 8 routes, then uses Stagehand + Kimi K2 (OpenRouter) to take full-page screenshots and stream a UX review to the console, finally assembling everything into a dated markdown report in `reports/`.

**Architecture:** Three sequential phases (chaos → AI exploration → report) orchestrated by `qa-agent/index.js`. Gremlins.js is injected via Playwright's `addScriptTag`. Kimi K2 receives base64-encoded screenshots and streams responses to console. Reports are saved to `reports/qa-YYYY-MM-DD.md` (gitignored).

**Tech Stack:** Node.js ESM, `@browserbasehq/stagehand`, `gremlins.js`, `openai` (OpenRouter-compatible client), Playwright (already installed).

---

## Context You Must Know

- App runs on `http://localhost:3001` (must be running before `npm run qa:agent`)
- Project uses ESM (`"type": "module"` is NOT in package.json — but scripts can still use ESM with `.js` extension if you use `import` syntax and run with Node ≥ 18 which supports `--input-type=module` — **IMPORTANT:** since `type: module` is absent, use `.mjs` extension OR add top-level `await` and run with `node --experimental-vm-modules` — actually the simplest fix: just add `"type": "module"` to package.json since all existing JS files already use `import/export`)
- Actually: check `playwright.config.mjs` — it uses `.mjs` which is always ESM regardless of package.json. The qa-agent files should also use `.mjs` OR we should add `"type": "module"`. **Decision: add `"type": "module"` to package.json** — this is safe because `playwright.config.mjs`, `vitest.config.mjs`, and `eslint.config.mjs` all use explicit `.mjs` extension and won't be affected.
- Existing `e2e/` Playwright tests run via `npx playwright test` (uses `playwright.config.mjs`)
- Stagehand API: `new Stagehand({ env: 'LOCAL', modelName, modelClientOptions: { apiKey, baseURL } })` — exact constructor shape may vary by version; see [Stagehand README](https://github.com/browserbasehq/stagehand) if it differs
- OpenRouter base URL: `https://openrouter.ai/api/v1`; model: `moonshotai/kimi-k2`
- Gremlins.js dist path after install: `node_modules/gremlins.js/dist/gremlins.min.js`

---

## Task 1: Install dependencies + enable ESM

**Files to modify:**
- `package.json`

### Step 1: Install packages

```bash
npm install @browserbasehq/stagehand gremlins.js openai
```

Expected: packages added to `node_modules/`, `package-lock.json` updated.

### Step 2: Add `"type": "module"` to package.json

Open `package.json` and add `"type": "module"` after `"version"`:

```json
{
  "name": "nepal-election-simulator",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  ...
}
```

### Step 3: Verify existing tests still pass

```bash
npx playwright test --reporter=list 2>&1 | tail -5
```

Expected: `34 passed` (the `.mjs` config files are unaffected by `type: module`).

### Step 4: Commit

```bash
git add package.json package-lock.json
git commit -m "feat(qa): install stagehand, gremlins.js, openai; enable ESM"
```

---

## Task 2: Create `qa-agent/prompts.js`

**File to create:** `qa-agent/prompts.js`

### Step 1: Create the file

```js
// qa-agent/prompts.js
// System prompt for Kimi K2 acting as a UX reviewer.
// Appending "Rating: X/10" on the last line makes extraction reliable.

export const UX_REVIEWER_SYSTEM_PROMPT = `You are an expert UX reviewer for NepaliSoch, a Nepal politics data and election simulation website.
You are reviewing a screenshot of a page. Your task:
1. Describe what you see (briefly)
2. Identify anything visually broken, missing, or confusing
3. Note what would confuse a first-time visitor unfamiliar with Nepal politics
4. Suggest 2-3 specific improvements
5. Rate the page 1-10 (10 = excellent)

Be concise. Focus on real user experience, not code. Think like a journalist or researcher visiting for the first time.

End your response with exactly this line: "Rating: X/10" where X is your score.`;
```

### Step 2: Verify syntax

```bash
node --input-type=module <<'EOF'
import { UX_REVIEWER_SYSTEM_PROMPT } from './qa-agent/prompts.js';
console.log('OK — length:', UX_REVIEWER_SYSTEM_PROMPT.length);
EOF
```

Expected output: `OK — length: <some number>`

### Step 3: Commit

```bash
git add qa-agent/prompts.js
git commit -m "feat(qa): add Kimi K2 UX reviewer system prompt"
```

---

## Task 3: Create `qa-agent/gremlins-phase.js`

**File to create:** `qa-agent/gremlins-phase.js`

### Step 1: Create the file

```js
// qa-agent/gremlins-phase.js
//
// Launches a headless Chromium browser, visits each of the 8 routes,
// injects gremlins.js, and runs chaos testing for the configured duration.
// Collects console errors and uncaught exceptions per route.
//
// Returns: { [routePath]: Array<{ type, message, stack?, timestamp }> }

import { chromium } from 'playwright';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3001';

// chaosSeconds: how long to run gremlins on each route
const ROUTES = [
  { path: '/',               chaosSeconds: 30 },
  { path: '/simulator',      chaosSeconds: 30 },
  { path: '/elections',      chaosSeconds: 10 },
  { path: '/elections/2022', chaosSeconds: 10 },
  { path: '/nepal-map',      chaosSeconds: 30 },
  { path: '/districts',      chaosSeconds: 10 },
  { path: '/demographics',   chaosSeconds: 10 },
  { path: '/about',          chaosSeconds: 10 },
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
        '../node_modules/gremlins.js/dist/gremlins.min.js',
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
```

### Step 2: Syntax check

```bash
node --input-type=module <<'EOF'
import { runGremlinsPhase } from './qa-agent/gremlins-phase.js';
console.log('OK — runGremlinsPhase is', typeof runGremlinsPhase);
EOF
```

Expected: `OK — runGremlinsPhase is function`

### Step 3: Commit

```bash
git add qa-agent/gremlins-phase.js
git commit -m "feat(qa): add gremlins chaos phase — injects gremlins.js per route, collects JS errors"
```

---

## Task 4: Create `qa-agent/ai-phase.js`

**File to create:** `qa-agent/ai-phase.js`

### Step 1: Create the file

```js
// qa-agent/ai-phase.js
//
// Uses Stagehand (local Playwright) to navigate each route and take a
// full-page screenshot. Sends the screenshot to Kimi K2 via OpenRouter
// using the openai-compatible streaming API. Streams responses to console.
//
// Returns: { [routePath]: { name, rating: number|null, observations: string } }

import { Stagehand } from '@browserbasehq/stagehand';
import OpenAI from 'openai';
import { UX_REVIEWER_SYSTEM_PROMPT } from './prompts.js';

const BASE_URL = 'http://localhost:3001';

// check: optional interaction check type per route
const ROUTES = [
  { path: '/',               name: 'Homepage' },
  { path: '/simulator',      name: 'Election Simulator', check: 'simulator' },
  { path: '/elections',      name: 'Elections',           check: 'elections' },
  { path: '/elections/2022', name: 'Elections 2022' },
  { path: '/nepal-map',      name: 'Nepal Map',           check: 'map' },
  { path: '/districts',      name: 'Districts' },
  { path: '/demographics',   name: 'Demographics' },
  { path: '/about',          name: 'About' },
];

export async function runAIPhase() {
  // Stagehand wraps Playwright; env:'LOCAL' uses a local Chromium (not Browserbase cloud)
  // modelName + modelClientOptions configure Kimi K2 as the AI for act()/observe() actions
  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'moonshotai/kimi-k2',
    modelClientOptions: {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    },
    verbose: 0, // suppress internal debug logs
  });

  await stagehand.init();
  const page = stagehand.page;

  // Separate openai client for streaming vision calls
  // (Stagehand's internal model handles act()/observe(); this client handles screenshot review)
  const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const reviews = {};

  for (const route of ROUTES) {
    console.log(`\n[AI] Reviewing: ${route.name} (${route.path})`);

    await page.goto(BASE_URL + route.path, { waitUntil: 'networkidle' });

    // --- Interaction checks (basic UX flow verification) ---
    if (route.check === 'simulator') {
      // Skip the guided QuickStart flow so we see the full simulator dashboard
      await page.evaluate(() => localStorage.setItem('hasSeenQuickStart', 'true'));
      await page.reload({ waitUntil: 'networkidle' });
    } else if (route.check === 'map') {
      // Click the first district polygon to verify the drawer opens
      try {
        await page.locator('.leaflet-interactive').first().click({ timeout: 5_000 });
        await page.waitForTimeout(1_000);
      } catch {
        console.log('[AI] Map: no interactive district found within 5s, continuing...');
      }
    } else if (route.check === 'elections') {
      // Click the 2022 year link and go back
      try {
        await page.getByRole('link', { name: '2022' }).first().click({ timeout: 5_000 });
        await page.waitForTimeout(1_000);
        await page.goBack({ waitUntil: 'networkidle' });
      } catch {
        console.log('[AI] Elections: 2022 link not found within 5s, continuing...');
      }
    }

    // --- Screenshot ---
    const screenshot = await page.screenshot({ fullPage: true });
    const base64Image = screenshot.toString('base64');

    // --- Stream Kimi K2 UX review ---
    process.stdout.write(`[${route.name}] `);
    let fullText = '';

    const stream = await openrouter.chat.completions.create({
      model: 'moonshotai/kimi-k2',
      messages: [
        { role: 'system', content: UX_REVIEWER_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Page: ${route.name}\nURL: ${BASE_URL + route.path}`,
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/png;base64,${base64Image}` },
            },
          ],
        },
      ],
      stream: true,
      max_tokens: 600,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      process.stdout.write(text);
      fullText += text;
    }
    process.stdout.write('\n'); // newline after streamed output

    // Extract "Rating: X/10" from the response
    const ratingMatch = fullText.match(/Rating:\s*(\d+)\/10/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

    reviews[route.path] = { name: route.name, rating, observations: fullText };
  }

  await stagehand.close();
  return reviews;
}
```

### Step 2: Syntax check

```bash
node --input-type=module <<'EOF'
import { runAIPhase } from './qa-agent/ai-phase.js';
console.log('OK — runAIPhase is', typeof runAIPhase);
EOF
```

Expected: `OK — runAIPhase is function`

### Step 3: Commit

```bash
git add qa-agent/ai-phase.js
git commit -m "feat(qa): add AI exploration phase — Stagehand + Kimi K2 screenshot review with streaming"
```

---

## Task 5: Create `qa-agent/report.js`

**File to create:** `qa-agent/report.js`

### Step 1: Create the file

```js
// qa-agent/report.js
//
// Assembles chaos results + AI reviews into a markdown report.
// Saves to reports/qa-YYYY-MM-DD.md (directory created if needed).

import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Build the markdown report string from both phases.
 *
 * @param {Record<string, Array<{type: string, message: string, stack?: string}>>} chaosResults
 * @param {Record<string, {name: string, rating: number|null, observations: string}>} aiReviews
 * @returns {string}
 */
export function buildReport(chaosResults, aiReviews) {
  const date = new Date().toISOString().slice(0, 10);

  const totalErrors = Object.values(chaosResults).reduce(
    (n, errs) => n + errs.length,
    0,
  );
  const ratings = Object.values(aiReviews)
    .map(r => r.rating)
    .filter(r => r !== null);
  const avgRating =
    ratings.length
      ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1)
      : 'N/A';
  const criticalCount = Object.values(chaosResults).reduce(
    (n, errs) => n + errs.filter(e => e.type === 'uncaught-exception').length,
    0,
  );

  const lines = [];

  lines.push(`# QA Agent Report — ${date}`, '');
  lines.push(`## Summary`, '');
  lines.push(`- Pages reviewed: ${Object.keys(aiReviews).length}`);
  lines.push(`- Chaos errors found: ${totalErrors}`);
  lines.push(`- AI rating average: ${avgRating}/10`);
  lines.push(`- Critical issues (uncaught exceptions): ${criticalCount}`, '');

  lines.push(`## Phase 1: Chaos Results`, '');
  for (const [routePath, errors] of Object.entries(chaosResults)) {
    lines.push(`### ${routePath}`, '');
    if (errors.length === 0) {
      lines.push(`- ✅ No errors`);
    } else {
      for (const err of errors) {
        lines.push(`- ⚠️  \`[${err.type}]\` ${err.message}`);
        if (err.stack) {
          const stackPreview = err.stack.split('\n').slice(0, 3).join('\n  ');
          lines.push(`  \`\`\``, `  ${stackPreview}`, `  \`\`\``);
        }
      }
    }
    lines.push('');
  }

  lines.push(`## Phase 2: AI Review`, '');
  for (const [routePath, review] of Object.entries(aiReviews)) {
    const ratingStr = review.rating !== null ? ` (${review.rating}/10)` : '';
    lines.push(`### ${routePath} — ${review.name}${ratingStr}`, '');
    lines.push(review.observations, '');
  }

  return lines.join('\n');
}

/**
 * Save report content to reports/qa-YYYY-MM-DD.md.
 * @param {string} content
 * @returns {string} path to saved file
 */
export function saveReport(content) {
  const date = new Date().toISOString().slice(0, 10);
  const reportsDir = path.resolve(__dirname, '../reports');
  mkdirSync(reportsDir, { recursive: true });
  const filePath = path.join(reportsDir, `qa-${date}.md`);
  writeFileSync(filePath, content, 'utf-8');
  console.log(`[Report] Saved → ${filePath}`);
  return filePath;
}
```

### Step 2: Syntax + smoke test

```bash
node --input-type=module <<'EOF'
import { buildReport, saveReport } from './qa-agent/report.js';

const fakeChoas = {
  '/': [],
  '/simulator': [{ type: 'console-error', message: 'test error', timestamp: '2026-02-18T00:00:00Z' }],
};
const fakeAI = {
  '/': { name: 'Homepage', rating: 8, observations: 'Looks great.\nRating: 8/10' },
  '/simulator': { name: 'Simulator', rating: 7, observations: 'Decent.\nRating: 7/10' },
};

const md = buildReport(fakeChoas, fakeAI);
console.log(md.slice(0, 200));
console.log('--- report built OK');
EOF
```

Expected: prints first 200 chars of the markdown without errors.

### Step 3: Verify `reports/` directory was NOT committed (just smoke-created)

```bash
ls reports/
```

Delete any test-generated file before committing:

```bash
rm -rf reports/
```

### Step 4: Commit

```bash
git add qa-agent/report.js
git commit -m "feat(qa): add report builder — markdown report with chaos + AI review sections"
```

---

## Task 6: Create `qa-agent/index.js`

**File to create:** `qa-agent/index.js`

### Step 1: Create the file

```js
// qa-agent/index.js
//
// Orchestrator: runs Phase 1 (chaos) then Phase 2 (AI), then saves the report.
// Requires OPENROUTER_API_KEY environment variable.
//
// Usage: npm run qa:agent
// The app must be running at http://localhost:3001 before invoking this.

import { runGremlinsPhase } from './gremlins-phase.js';
import { runAIPhase } from './ai-phase.js';
import { buildReport, saveReport } from './report.js';

// Guard: fail fast if API key is missing
if (!process.env.OPENROUTER_API_KEY) {
  console.error('[QA Agent] ERROR: OPENROUTER_API_KEY is not set.');
  console.error('           Copy .env.example → .env and add your key.');
  console.error('           Then run: OPENROUTER_API_KEY=... npm run qa:agent');
  process.exit(1);
}

console.log('═══════════════════════════════════');
console.log('   QA Agent — NepaliSoch           ');
console.log('═══════════════════════════════════\n');

console.log('▶ Phase 1: Chaos Testing (Gremlins.js)\n');
const chaosResults = await runGremlinsPhase();

console.log('\n▶ Phase 2: AI Exploration (Kimi K2 via OpenRouter)\n');
const aiReviews = await runAIPhase();

console.log('\n▶ Phase 3: Building Report\n');
const reportContent = buildReport(chaosResults, aiReviews);
const reportPath = saveReport(reportContent);

console.log(`\n✅ QA Agent complete. Report → ${reportPath}\n`);
```

### Step 2: Syntax check

```bash
node --check qa-agent/index.js
```

Expected: no output (no syntax errors).

### Step 3: Commit

```bash
git add qa-agent/index.js
git commit -m "feat(qa): add orchestrator index.js — runs chaos → AI → report in sequence"
```

---

## Task 7: Wire up npm script, `.env.example`, and `.gitignore`

**Files to modify:**
- `package.json` — add `qa:agent` script
- `.env.example` — create (documents required env vars)
- `.gitignore` — add `reports/` and `.env`

### Step 1: Add `qa:agent` to `package.json` scripts

In the `"scripts"` block, add after `"prepare"`:

```json
"qa:agent": "node qa-agent/index.js"
```

### Step 2: Create `.env.example`

```
# Required for qa:agent
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Step 3: Update `.gitignore`

Append these lines to `.gitignore` (check it doesn't already have them):

```
# QA agent outputs
reports/
.env
```

### Step 4: Verify the script is wired

```bash
node -e "const p = JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log(p.scripts['qa:agent']);"
```

Expected: `node qa-agent/index.js`

### Step 5: Verify `.env` would be ignored

```bash
echo "OPENROUTER_API_KEY=test" > .env
git status .env
```

Expected output includes `.env` under "Changes not staged" or "Untracked files" **but not tracked** — actually, since `.gitignore` now lists `.env`, it should be:
```
nothing to commit (if .env was never tracked)
```
or `.env` listed as ignored. Clean up:

```bash
rm .env
```

### Step 6: Commit everything

```bash
git add package.json .env.example .gitignore
git commit -m "feat(qa): add qa:agent npm script, .env.example, gitignore reports/"
```

---

## Task 8: End-to-end smoke test

### Step 1: Start the app (separate terminal)

```bash
npm run dev
```

Ensure `http://localhost:3001` is responding.

### Step 2: Run the agent with your key

```bash
OPENROUTER_API_KEY=<your-key> npm run qa:agent
```

Watch for:
- `[Chaos]` lines per route (✅ or ⚠️)
- `[AI] Reviewing: ...` lines with streamed Kimi K2 output
- `[Report] Saved → reports/qa-2026-02-18.md`

### Step 3: Verify report exists and looks correct

```bash
head -30 reports/qa-$(date +%Y-%m-%d).md
```

Expected: shows the summary section with page count, error count, and average rating.

### Step 4: If Stagehand constructor API differs

If you see an error like `TypeError: Cannot read properties of undefined (reading 'page')`, the Stagehand version installed may use a different constructor shape. Check the installed version:

```bash
cat node_modules/@browserbasehq/stagehand/package.json | grep '"version"' | head -1
```

Then check `node_modules/@browserbasehq/stagehand/README.md` for the correct constructor options. Common alternatives:

```js
// Alternative A — model as top-level props
const stagehand = new Stagehand({
  env: 'LOCAL',
  model: 'moonshotai/kimi-k2',
  openaiApiKey: process.env.OPENROUTER_API_KEY,
  openaiBaseUrl: 'https://openrouter.ai/api/v1',
});

// Alternative B — llmClient
import { OpenAIClient } from '@browserbasehq/stagehand';
const stagehand = new Stagehand({
  env: 'LOCAL',
  llmClient: new OpenAIClient({
    modelName: 'moonshotai/kimi-k2',
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  }),
});
```

Update `qa-agent/ai-phase.js` accordingly, then re-run.

### Step 5: Commit report to gitignore verification

```bash
git status
```

Confirm `reports/` is not listed (it should be gitignored).

### Step 6: Final commit (if any fixups were needed from smoke test)

```bash
git add qa-agent/
git commit -m "fix(qa): adjust Stagehand constructor / gremlins path after smoke test"
```
