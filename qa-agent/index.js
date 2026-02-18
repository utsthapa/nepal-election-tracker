// qa-agent/index.js
//
// Orchestrator: runs Phase 1 (chaos) then Phase 2 (AI), then saves the report.
// Requires OPENROUTER_API_KEY environment variable.
//
// Usage: npm run qa:agent
// The app must be running at http://localhost:3001 before invoking this.

import { runAIPhase } from './ai-phase.js';
import { runGremlinsPhase } from './gremlins-phase.js';
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
