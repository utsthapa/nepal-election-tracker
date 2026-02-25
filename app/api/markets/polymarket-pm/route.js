// app/api/markets/polymarket-pm/route.js
// Proxies the Polymarket Gamma API for Next Prime Minister of Nepal market.
// Polymarket Gamma API is public and does not require authentication.
// Ref: https://gamma-api.polymarket.com/events?slug=next-prime-minister-of-nepal

export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      'https://gamma-api.polymarket.com/events?slug=next-prime-minister-of-nepal',
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: `Polymarket API responded with status ${response.status}` },
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
      { error: error.message },
      { status: 502 }
    );
  }
}
