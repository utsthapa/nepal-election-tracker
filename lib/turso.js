import { createClient } from '@libsql/client';

let cachedClient = null;
let schemaPromise = null;

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
    })();
  }
  return schemaPromise;
}
