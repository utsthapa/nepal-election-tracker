# RSP Starting Point Mode + Data Mode Fixes
**Date:** 2026-02-19
**Status:** Approved for implementation

---

## Problem Summary

Three issues to address:

1. **Data mode never renders** — `handleGuidedModeSelect` calls `setGuidedStep(4)` for data mode, but the data mode UI checks `guidedStep === 3`. The panel is permanently hidden.

2. **Custom scenario uses equal shares (~7.7%) as starting baseline** — `applyCustomScenario()` builds the initial slider state as `100 / numParties` per party, ignoring 2022 data entirely. It should start from `OFFICIAL_FPTP_VOTE`.

3. **No way to model RSP running in all seats** — In 2022 RSP's FPTP vote share (7.82%) underrepresents their national support because they didn't field candidates in every constituency. Their PR vote (10.70%) is their true national share. There's no UI mechanism to correct for this before manipulating sliders.

---

## Approach: Approach C — RSP Entry as first-class Step 2 option

Step 2 ("Choose Your Starting Point") gets a third card alongside 2022 Baseline and Custom Scenario.

---

## Algorithm: RSP National Entry

RSP's FPTP undercount is corrected by transferring the delta from their FPTP share to their PR share, taken proportionally from all other parties.

```
Given:
  RSP_FPTP = 7.82%   (official 2022 FPTP — underrepresented)
  RSP_PR   = 10.70%  (official 2022 PR   — true national support)
  delta    = RSP_PR - RSP_FPTP = 2.88pp

Algorithm:
  sum_others = Σ(all parties ≠ RSP)              // = 92.18%
  For each party p ≠ RSP:
    p_new = p - (p / sum_others) × delta
  RSP_new = RSP_PR                               // = 10.70%

Post-entry state (verified, sums to 100.00%):
  NC    22.57%   UML   29.55%   Maoist  8.94%
  RSP   10.70%   RPP    5.36%   JSPN    3.45%
  US     3.96%   JP     2.76%   LSP     1.54%
  NUP    1.60%   Others 9.57%
```

After the entry is applied, the standard zero-sum slider mechanic handles all further adjustments. No special treatment needed during slider moves.

### Verified projections

Starting from post-entry state, moving RSP slider:

| RSP target | NC   | UML   | Maoist |
|------------|------|-------|--------|
| 25%        | 19.0%| 24.8% | 7.5%   |
| 30%        | 17.7%| 23.2% | 7.0%   |
| 35%        | 16.4%| 21.5% | 6.5%   |

NC reaches ~18% at RSP=30%. UML stays ~3pp higher than NC at all levels because it starts from a larger base (30.5% vs 23.3%). UML reaches ~20% around RSP=37%.

---

## File Changes

| File | Change |
|------|--------|
| `app/simulator/page.jsx` | Fix data mode: `setGuidedStep(4)` → `setGuidedStep(3)` |
| `app/simulator/page.jsx` | Fix custom scenario: init from `OFFICIAL_FPTP_VOTE` not equal shares |
| `app/simulator/page.jsx` | Add `'rsp-entry'` branch to `handleStartingPointSelect` |
| `app/simulator/page.jsx` | Add third card to Step 2 UI |
| `utils/scenarios.js` *(new)* | `applyRspNationalEntry(fptp)` with full JSDoc |
| `app/simulator/page.jsx` | Import `applyRspNationalEntry` from `utils/scenarios.js` |

---

## Step 2 UI layout

```
┌─────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────┐
│  2022 Baseline      │  │  Custom Scenario      │  │  RSP National Entry      │
│                     │  │                       │  │                          │
│  Official 2022      │  │  Set incumbency       │  │  RSP ran in fewer seats  │
│  results. Click     │  │  decay + RSP          │  │  in 2022. Sets their     │
│  to proceed         │  │  momentum on top      │  │  FPTP to PR proportion   │
│  directly to        │  │  of 2022 baseline     │  │  (10.70%), taking the    │
│  Step 3.            │  │  (configure below).   │  │  diff proportionally     │
│                     │  │                       │  │  from all others.        │
└─────────────────────┘  └──────────────────────┘  └──────────────────────────┘
       ↓ immediately              ↓ sub-panel                ↓ immediately
     Step 3                    config options              Step 3
```

Clicking 2022 Baseline or RSP National Entry advances immediately to Step 3 (no sub-panel). Custom Scenario stays on Step 2 and shows the incumbency decay + RSP boost sliders.

---

## `utils/scenarios.js` — public API

```js
/**
 * Apply RSP National Entry adjustment to an FPTP slider map.
 *
 * In 2022 RSP did not contest all FPTP constituencies, so their FPTP vote
 * share (7.82%) understates their true national support relative to their PR
 * vote (10.70%). This function corrects for that by setting RSP's FPTP share
 * to their PR proportion and proportionally reducing all other parties.
 *
 * The adjustment is purely proportional — each party loses:
 *   loss_p = (share_p / sum_others) × (RSP_PR - RSP_FPTP)
 *
 * @param {Record<string,number>} fptp  Current FPTP slider map (must sum ~100)
 * @returns {Record<string,number>}     Adjusted FPTP map (sums to 100)
 */
export function applyRspNationalEntry(fptp) { ... }
```

---

## Out of scope

- Generalising to any party (can be done later, the algorithm is identical)
- Changing how the PR sliders initialise (RSP PR is already 10.70% at baseline)
- Unit tests for `applyRspNationalEntry` (separate task)
