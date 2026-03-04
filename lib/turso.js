import { createClient } from '@libsql/client';

let cachedClient = null;
let schemaPromise = null;
let newsletterSchemaPromise = null;

export function isTursoConfigured() {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not configured');
  }
  if (!cachedClient) {
    cachedClient = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return cachedClient;
}

export async function ensureSimulationStateTable() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const client = getTursoClient();
      await client.execute(`
        CREATE TABLE IF NOT EXISTS simulation_states (
          id TEXT PRIMARY KEY,
          year INTEGER NOT NULL,
          state_json TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      await client.execute(
        'CREATE INDEX IF NOT EXISTS idx_simulation_states_created_at ON simulation_states(created_at)'
      );
    })().catch(err => {
      schemaPromise = null;
      throw err;
    });
  }
  return schemaPromise;
}

export async function ensureNewsletterSubscribersTable() {
  if (!newsletterSchemaPromise) {
    newsletterSchemaPromise = (async () => {
      const client = getTursoClient();
      await client.execute(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          email TEXT PRIMARY KEY,
          source TEXT NOT NULL DEFAULT 'site',
          status TEXT NOT NULL DEFAULT 'subscribed',
          subscribed_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      await client.execute(
        'CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at)'
      );
    })().catch(err => {
      newsletterSchemaPromise = null;
      throw err;
    });
  }
  return newsletterSchemaPromise;
}
