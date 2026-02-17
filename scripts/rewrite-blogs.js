#!/usr/bin/env node

/**
 * Blog Rewrite Engine
 * Uses Claude Opus 4.6 to rewrite articles in 538 style
 * Heavy data integration, natural human-like prose
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getArticleDataContext, formatDataForPrompt } from './data-context.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  model: 'anthropic/claude-opus-4.6',
  thinking: 'high',
  temperature: 0.7,
  maxTokens: 8000,
  apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
};

// Paths
const PATHS = {
  contentDir: path.join(__dirname, '../content/analysis'),
  outputDir: path.join(__dirname, '../content/analysis'),
  promptTemplate: path.join(__dirname, '538-style-prompt.md'),
};

/**
 * Read the 538 style guide
 */
function loadStyleGuide() {
  try {
    return fs.readFileSync(PATHS.promptTemplate, 'utf-8');
  } catch (error) {
    console.error('Error loading style guide:', error.message);
    process.exit(1);
  }
}

/**
 * Parse frontmatter from MDX content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterText = match[1];
  const body = content.slice(match[0].length).trim();

  const frontmatter = {};
  for (const line of frontmatterText.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Build the rewrite prompt
 */
function buildPrompt(articleSlug, originalContent, styleGuide, dataContext) {
  const { frontmatter, body } = parseFrontmatter(originalContent);

  const prompt = `
You are rewriting a Nepal politics article in FiveThirtyEight style. 

## STYLE GUIDELINES
${styleGuide}

## CRITICAL: WRITE LIKE A HUMAN
- Use contractions (it's, don't, can't)
- Vary sentence length dramatically
- Start sentences with conjunctions (But, And, So)
- Use occasional fragments
- Write like you're explaining to a smart friend at a bar
- NEVER use AI-tell words: "delve", "tapestry", "landscape", "illuminate", "underscore", "multifaceted", "nuanced", "moreover", "furthermore"
- NEVER use hedging phrases: "it's worth noting", "it's important to remember"
- NEVER use predictable patterns: "not only... but also", "in the world of", "when it comes to"

## ORIGINAL ARTICLE
Title: ${frontmatter.title || 'Untitled'}
Slug: ${articleSlug}

Original content:
${body}

${formatDataForPrompt(dataContext)}

## REWRITE INSTRUCTIONS

1. Rewrite this article in 538 style (400-500 lines, ~3,000-4,000 words)
2. Use the data context to enrich the narrative with specific statistics
3. Write naturally - like a human journalist, not an AI
4. Create compelling narrative flow with varied sentence structures
5. Include specific examples and concrete details
6. Address counterarguments and caveats
7. End with what we know and what remains uncertain

## OUTPUT FORMAT

Return ONLY the rewritten article in this format:

---
title: "${frontmatter.title || 'Untitled'}"
excerpt: "[Write a compelling 1-2 sentence excerpt]"
author: "Data Journalism Team"
date: "${frontmatter.date || new Date().toISOString().split('T')[0]}"
category: "${frontmatter.category || 'Analysis'}"
tags: [${(frontmatter.tags || '')
    .replace(/\[|\]/g, '')
    .split(',')
    .map(t => `"${t.trim()}"`)
    .join(', ')}]
featuredImage: "${frontmatter.featuredImage || ''}"
featured: ${frontmatter.featured || 'false'}
---

[Full article content in 538 style, 400-500 lines]

Do not include any meta-commentary, explanations, or notes. Just the article.
`;

  return prompt;
}

/**
 * Call Claude Opus 4.6 via OpenRouter
 */
async function callClaude(prompt, apiKey) {
  const response = await fetch(CONFIG.apiEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://nepalvotes.com',
      'X-Title': 'Nepal Votes Blog Rewriter',
    },
    body: JSON.stringify({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior data journalist at FiveThirtyEight writing about Nepali politics. You write naturally, like a human, with personality and voice. You never sound like an AI.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens,
      thinking: {
        type: 'enabled',
        budget_tokens: 4000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Rewrite a single article
 */
async function rewriteArticle(articleSlug, apiKey) {
  console.log(`\n📝 Rewriting: ${articleSlug}`);

  const inputPath = path.join(PATHS.contentDir, `${articleSlug}.mdx`);
  const outputPath = path.join(PATHS.outputDir, `${articleSlug}-v2.mdx`);

  // Check if input exists
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Article not found: ${inputPath}`);
  }

  // Read original content
  const originalContent = fs.readFileSync(inputPath, 'utf-8');
  console.log(`   Original: ${originalContent.split('\n').length} lines`);

  // Load style guide
  const styleGuide = loadStyleGuide();

  // Build data context
  console.log('   Building data context...');
  const dataContext = await getArticleDataContext(articleSlug);

  // Build prompt
  const prompt = buildPrompt(articleSlug, originalContent, styleGuide, dataContext);
  console.log(`   Prompt: ~${prompt.length} chars`);

  // Call Claude
  console.log('   Calling Claude Opus 4.6...');
  const rewritten = await callClaude(prompt, apiKey);

  // Write output
  fs.writeFileSync(outputPath, rewritten, 'utf-8');
  console.log(`   ✓ Written: ${outputPath}`);
  console.log(`   New length: ${rewritten.split('\n').length} lines`);

  // Estimate cost
  const inputTokens = Math.ceil(prompt.length / 4);
  const outputTokens = Math.ceil(rewritten.length / 4);
  const cost = (inputTokens / 1000000) * 5 + (outputTokens / 1000000) * 25;
  console.log(`   Estimated cost: $${cost.toFixed(4)}`);

  return {
    slug: articleSlug,
    inputTokens,
    outputTokens,
    cost,
    outputPath,
  };
}

/**
 * Main function
 */
async function main() {
  // Get API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: OPENROUTER_API_KEY environment variable required');
    console.error('   Set it with: export OPENROUTER_API_KEY=your_key_here');
    process.exit(1);
  }

  // Get article slug from command line
  const articleSlug = process.argv[2];
  if (!articleSlug) {
    console.error('❌ Error: Please provide an article slug');
    console.error('   Usage: node rewrite-blogs.js <article-slug>');
    console.error('   Example: node rewrite-blogs.js 30-years-democracy');
    process.exit(1);
  }

  console.log('🚀 Nepal Votes Blog Rewrite Engine');
  console.log('   Model: Claude Opus 4.6 (thinking: high)');
  console.log('   Style: FiveThirtyEight data journalism');
  console.log('   Mode: Heavy data integration + natural prose');

  try {
    const result = await rewriteArticle(articleSlug, apiKey);

    console.log('\n✅ Rewrite complete!');
    console.log(`   File: ${result.outputPath}`);
    console.log(`   Input tokens: ${result.inputTokens.toLocaleString()}`);
    console.log(`   Output tokens: ${result.outputTokens.toLocaleString()}`);
    console.log(`   Cost: $${result.cost.toFixed(4)}`);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { rewriteArticle, buildPrompt };
