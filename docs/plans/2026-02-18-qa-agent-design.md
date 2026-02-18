# QA Agent Design

**Date:** 2026-02-18
**Goal:** An AI-powered QA agent that explores the NepaliSoch site like a real user, runs chaos testing, and produces a written review report with UX observations and improvement suggestions.

---

## Tools

| Tool                       | Role                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------- |
| **Stagehand**              | AI-driven browser automation (wraps Playwright, handles screenshot + action loops) |
| **Gremlins.js**            | Chaos/monkey testing — random clicks, inputs, scrolls to surface JS crashes        |
| **Kimi K2 via OpenRouter** | LLM that reviews screenshots and narrates UX observations                          |

---

## Architecture

```
npm run qa:agent
       │
       ▼
  qa-agent/index.js        ← orchestrator: loops through all 8 routes
       │
  ┌────┴────────────────────────────────────┐
  │  Phase 1: Chaos (gremlins-phase.js)     │  Gremlins.js injected per page
  │  Phase 2: AI Exploration (ai-phase.js)  │  Stagehand + Kimi K2 reviews
  │  Phase 3: Report (report.js)            │  Markdown file + console stream
  └─────────────────────────────────────────┘
```

### New files

```
qa-agent/
  index.js          ← entry point, orchestrates both phases, calls report.js
  gremlins-phase.js ← launches Playwright, injects gremlins CDN, collects console errors
  ai-phase.js       ← Stagehand agent: visits each route, takes screenshot, asks Kimi K2
  report.js         ← assembles findings into a markdown report
  prompts.js        ← system prompt for Kimi K2 UX reviewer role
reports/            ← generated reports saved here (gitignored)
  qa-YYYY-MM-DD.md
```

---

## Phase 1: Chaos (Gremlins.js)

- Uses standard Playwright (not Stagehand) — no AI needed here
- Injects gremlins from CDN via `page.evaluate()`
- Runs for **30 seconds** on interactive-heavy pages (`/`, `/simulator`, `/nepal-map`)
- Runs for **10 seconds** on the other 5 routes
- Listens to `page.on('console', ...)` and `page.on('pageerror', ...)` to capture JS errors and uncaught exceptions
- Records: error message, route, timestamp, stack trace if available

---

## Phase 2: AI Exploration (Stagehand + Kimi K2)

- Stagehand configured with OpenRouter base URL and Kimi K2 model ID (`moonshotai/kimi-k2`)
- For each of the 8 routes:
  1. Navigate to the page
  2. Wait for load state
  3. Take a full-page screenshot
  4. Send screenshot + page metadata to Kimi K2 with the UX reviewer prompt
  5. Stream the response to console in real-time
  6. Store the rating + observations for the report
- Stagehand also performs **basic interaction checks** per page type:
  - `/simulator` → move a slider, verify seat count updates
  - `/nepal-map` → click a district, verify drawer opens
  - `/elections` → click a year link, verify results page loads

### Kimi K2 system prompt (from `prompts.js`)

```
You are an expert UX reviewer for NepaliSoch, a Nepal politics data and election simulation website.
You are reviewing a screenshot of a page. Your task:
1. Describe what you see (briefly)
2. Identify anything visually broken, missing, or confusing
3. Note what would confuse a first-time visitor unfamiliar with Nepal politics
4. Suggest 2-3 specific improvements
5. Rate the page 1-10 (10 = excellent)

Be concise. Focus on real user experience, not code. Think like a journalist or researcher visiting for the first time.
```

---

## Phase 3: Report

Output file: `reports/qa-YYYY-MM-DD.md`

```markdown
# QA Agent Report — YYYY-MM-DD

## Summary

- Pages reviewed: 8
- Chaos errors found: N
- AI rating average: X.X/10
- Critical issues: N

## Phase 1: Chaos Results

### /simulator

- ⚠️ Uncaught TypeError: ... (N occurrences)
- ✅ No crashes on /elections

## Phase 2: AI Review

### / — Homepage (X/10)

**Observations:** ...
**Issues:** ...
**Suggestions:** ...

### /simulator — Election Simulator (X/10)

...
```

Console stream: each Kimi K2 response is printed as it streams in, prefixed with the route name.

---

## Pages Covered

| Route             | Chaos duration | AI interaction checks            |
| ----------------- | -------------- | -------------------------------- |
| `/`               | 30s            | None (static)                    |
| `/simulator`      | 30s            | Move NC slider, verify 275 seats |
| `/elections`      | 10s            | Click 2022 link                  |
| `/elections/2022` | 10s            | None                             |
| `/nepal-map`      | 30s            | Click a district                 |
| `/districts`      | 10s            | None                             |
| `/demographics`   | 10s            | None                             |
| `/about`          | 10s            | None                             |

---

## npm Script

```json
"qa:agent": "node qa-agent/index.js"
```

Requires `OPENROUTER_API_KEY` env variable.

---

## Dependencies to Add

```
@browserbasehq/stagehand   ← AI browser automation
gremlins.js                ← chaos testing (CDN inject, no npm install needed)
```

No changes to existing Playwright config or test suite.
