import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

import { ensureSimulationStateTable, getTursoClient, isTursoConfigured } from '../../../lib/turso';
import { buildShareableUrlFromId, sanitizeSharedState } from '../../../utils/stateSerializer';

export const runtime = 'nodejs';

const MAX_STATE_BYTES = 100_000;

function createId() {
  return randomBytes(9).toString('base64url').replace(/[-_]/g, '').toLowerCase().slice(0, 12);
}

function isUniqueConstraintError(error) {
  const message = error?.message || '';
  const code = error?.code || '';
  return code.includes('SQLITE_CONSTRAINT') || message.includes('UNIQUE constraint failed');
}

export async function POST(request) {
  if (!isTursoConfigured()) {
    return NextResponse.json(
      { error: 'Simulation sharing is unavailable. Turso is not configured.' },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sanitizedState = sanitizeSharedState(payload?.state);
  if (!sanitizedState) {
    return NextResponse.json({ error: 'Invalid simulation state payload' }, { status: 400 });
  }

  const requestedYear = Number(payload?.year);
  const year = Number.isInteger(requestedYear) ? requestedYear : 2026;

  const stateJson = JSON.stringify(sanitizedState);
  if (Buffer.byteLength(stateJson, 'utf8') > MAX_STATE_BYTES) {
    return NextResponse.json({ error: 'Simulation state is too large' }, { status: 413 });
  }

  try {
    await ensureSimulationStateTable();
    const client = getTursoClient();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = createId();
      try {
        await client.execute({
          sql: `INSERT INTO simulation_states (id, year, state_json, created_at, updated_at)
                VALUES (?1, ?2, ?3, unixepoch(), unixepoch())`,
          args: [id, year, stateJson],
        });

        return NextResponse.json({
          id,
          year,
          url: buildShareableUrlFromId(id, year, request.nextUrl?.origin),
        });
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json(
      { error: 'Could not generate a unique simulation ID. Please retry.' },
      { status: 500 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to save simulation state' }, { status: 500 });
  }
}
