// app/api/markets/kalshi/route.js
// Proxies the Kalshi Elections API for Nepal House of Representatives market.
// Kalshi Elections API is public and does not require authentication.
// Ref: https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXNEPALHOUSE-26MAR05

export const revalidate = 60; // Cache response for 60 seconds (Next.js route segment config)

export async function GET() {
  try {
    const response = await fetch(
      'https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=KXNEPALHOUSE-26MAR05',
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 60 }, // Next.js fetch cache: refresh every 60s
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: `Kalshi API responded with status ${response.status}`, markets: [] },
        { status: 502 }
      );
    }

    const data = await response.json();
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return Response.json(
      { error: error.message, markets: [] },
      { status: 502 }
    );
  }
}
