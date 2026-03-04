import { NextResponse } from 'next/server';

import {
  ensureNewsletterSubscribersTable,
  getTursoClient,
  isTursoConfigured,
} from '../../../lib/turso';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase();
}

function isValidEmail(email) {
  return email.length > 3 && email.length <= 320 && EMAIL_REGEX.test(email);
}

export async function POST(request) {
  if (!isTursoConfigured()) {
    return NextResponse.json(
      { error: 'Newsletter subscriptions are unavailable. Turso is not configured.' },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = normalizeEmail(payload?.email);
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const source =
    typeof payload?.source === 'string' && payload.source.trim()
      ? payload.source.trim().slice(0, 64)
      : 'site';

  try {
    await ensureNewsletterSubscribersTable();
    const client = getTursoClient();
    const result = await client.execute({
      sql: `
        INSERT OR IGNORE INTO newsletter_subscribers (email, source, status, subscribed_at, updated_at)
        VALUES (?1, ?2, 'subscribed', unixepoch(), unixepoch())
      `,
      args: [email, source],
    });

    if (result.rowsAffected === 0) {
      await client.execute({
        sql: `
          UPDATE newsletter_subscribers
          SET status = 'subscribed', updated_at = unixepoch()
          WHERE email = ?1
        `,
        args: [email],
      });

      return NextResponse.json({ success: true, alreadySubscribed: true }, { status: 200 });
    }

    return NextResponse.json({ success: true, alreadySubscribed: false }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save newsletter subscription.' }, { status: 500 });
  }
}
