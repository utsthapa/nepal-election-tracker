// app/api/markets/kalshi/route.js
export async function GET() {
  try {
    const response = await fetch(
      'https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXNEPALHOUSE-26MAR05',
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch' }, { status: 500 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
