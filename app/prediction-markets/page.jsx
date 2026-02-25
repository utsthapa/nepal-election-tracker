import PredictionMarkets from '../../components/PredictionMarkets'

export const metadata = {
  title: 'Prediction Markets - NepaliSoch',
  description: 'Live prediction market odds for Nepal elections from Kalshi and Polymarket.',
}

export default function PredictionMarketsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(192,48,40,0.07),transparent_36%),radial-gradient(circle_at_86%_14%,rgba(31,60,136,0.08),transparent_38%),linear-gradient(120deg,rgba(255,255,255,0.68),rgba(255,255,255,0))]" />
      <main className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-[#0f172a] leading-tight mb-3">
            Prediction Markets
          </h1>
          <p className="text-lg text-[rgb(var(--color-muted))]">
            Live market odds from prediction platforms tracking Nepal election outcomes.
            Prices refresh automatically every 60 seconds.
          </p>
          <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Data is fetched live from Kalshi and Polymarket public APIs. If a market has not yet been
            listed on a platform, that widget will show &quot;No data&quot;.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Kalshi — Most Seats
            </h2>
            <PredictionMarkets type="kalshi" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Polymarket — Most Seats
            </h2>
            <PredictionMarkets type="polymarket" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Polymarket — Next PM
            </h2>
            <PredictionMarkets type="pm" />
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-800">How to read prediction markets</p>
          <p>
            Prediction markets are financial contracts where traders bet real money on outcomes.
            Prices represent the market&apos;s collective probability estimate — a price of 0.45 means
            traders believe a 45% chance of that outcome occurring.
          </p>
          <p>
            Markets are not polls. They reflect the aggregated beliefs of traders, who may include
            well-informed analysts as well as retail speculators. Treat them as one signal among many.
          </p>
          <div className="flex gap-4 pt-1">
            <a
              href="https://kalshi.com/markets/nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Kalshi ↗
            </a>
            <a
              href="https://polymarket.com/event/nepal-house-of-representatives-election-winner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Polymarket ↗
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
