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

  const totalErrors = Object.values(chaosResults).reduce((n, errs) => n + errs.length, 0);
  const ratings = Object.values(aiReviews)
    .map(r => r.rating)
    .filter(r => r !== null);
  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1)
    : 'N/A';
  const criticalCount = Object.values(chaosResults).reduce(
    (n, errs) => n + errs.filter(e => e.type === 'uncaught-exception').length,
    0
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
