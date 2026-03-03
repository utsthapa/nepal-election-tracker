// app/api/markets/polymarket-pm/route.js
export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      'https://gamma-api.polymarket.com/events?slug=next-prime-minister-of-nepal',
      {
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch Polymarket PM data' }, { status: 502 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Polymarket PM request failed' }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }
}
