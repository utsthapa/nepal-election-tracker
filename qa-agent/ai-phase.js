// qa-agent/ai-phase.js
//
// Uses Playwright to navigate each route and take a full-page screenshot.
// Sends the screenshot to Kimi K2 via OpenRouter using the openai-compatible
// streaming API. Streams responses to console.
//
// Returns: { [routePath]: { name, rating: number|null, observations: string } }

import OpenAI from 'openai';
import { chromium } from 'playwright';

import { UX_REVIEWER_SYSTEM_PROMPT } from './prompts.js';

const BASE_URL = 'http://localhost:3001';

// check: optional interaction check type per route
const ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/simulator', name: 'Election Simulator', check: 'simulator' },
  { path: '/elections', name: 'Elections', check: 'elections' },
  { path: '/elections/2022', name: 'Elections 2022' },
  { path: '/nepal-map', name: 'Nepal Map', check: 'map' },
  { path: '/districts', name: 'Districts' },
  { path: '/demographics', name: 'Demographics' },
  { path: '/about', name: 'About' },
];

export async function runAIPhase() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // OpenRouter-compatible client for streaming vision calls to Kimi K2
  const openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const reviews = {};

  try {
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
        // Click the 2022 year link and go back.
        try {
          await page
            .locator('a:has-text("2022"), a[href*="2022"]')
            .first()
            .click({ timeout: 5_000 });
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

      const stream = await openrouter.chat.completions.create(
        {
          model: 'bytedance/ui-tars-1.5-7b',
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
        },
        { timeout: 60_000 }
      );

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
  } finally {
    await browser.close();
  }
  return reviews;
}
