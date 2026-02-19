// app/api/markets/polymarket-pm/route.js
export async function GET() {
  try {
    const response = await fetch(
      'https://gamma-api.polymarket.com/events?slug=next-prime-minister-of-nepal',
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
