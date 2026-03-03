// app/api/markets/kalshi/route.js
export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      'https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXNEPALHOUSE-26MAR05',
      {
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch Kalshi market data' }, { status: 502 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Kalshi market request failed' }, { status: 502 });
  } finally {
    clearTimeout(timeoutId);
  }
}
