import { NextResponse } from 'next/server';

import {
  ensureSimulationStateTable,
  getTursoClient,
  isTursoConfigured,
} from '../../../../lib/turso';
import { sanitizeSharedState } from '../../../../utils/stateSerializer';

export const runtime = 'nodejs';

function isValidId(id) {
  return typeof id === 'string' && /^[a-z0-9]{6,24}$/.test(id);
}

export async function GET(_request, { params }) {
  const id = params?.id;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid simulation ID' }, { status: 400 });
  }

  if (!isTursoConfigured()) {
    return NextResponse.json(
      { error: 'Simulation sharing is unavailable. Turso is not configured.' },
      { status: 503 }
    );
  }

  try {
    await ensureSimulationStateTable();
    const client = getTursoClient();

    const result = await client.execute({
      sql: 'SELECT id, year, state_json FROM simulation_states WHERE id = ?1 LIMIT 1',
      args: [id],
    });

    const row = result.rows?.[0];
    if (!row) {
      return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
    }

    let parsedState = null;
    try {
      parsedState = JSON.parse(row.state_json);
    } catch {
      return NextResponse.json({ error: 'Stored simulation data is invalid' }, { status: 500 });
    }

    const sanitizedState = sanitizeSharedState(parsedState);
    if (!sanitizedState) {
      return NextResponse.json(
        { error: 'Stored simulation data failed validation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: row.id,
      year: Number(row.year) || 2026,
      state: sanitizedState,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load simulation state' }, { status: 500 });
  }
}
