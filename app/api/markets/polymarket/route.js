// app/api/markets/polymarket/route.js
export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      'https://gamma-api.polymarket.com/events?slug=nepal-house-of-representatives-election-winner',
      {
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch Polymarket data' }, { status: 502 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Polymarket request failed' }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }
}
