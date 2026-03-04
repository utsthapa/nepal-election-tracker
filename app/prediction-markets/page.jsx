import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import PredictionMarkets from '../../components/PredictionMarkets';

export const metadata = {
  title: 'Prediction Markets - NepaliSoch',
  description: 'Live prediction market odds for Nepal elections from Kalshi and Polymarket.',
};

export default function PredictionMarketsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(192,48,40,0.07),transparent_36%),radial-gradient(circle_at_86%_14%,rgba(31,60,136,0.08),transparent_38%),linear-gradient(120deg,rgba(255,255,255,0.68),rgba(255,255,255,0))]" />
      <main className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-[#0f172a] leading-tight mb-3">
            Prediction Markets
          </h1>
          <p className="text-lg text-[rgb(var(--color-muted))]">
            Live market odds from prediction platforms tracking Nepal election outcomes.
          </p>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 border-b border-gray-200 pb-2">
              Parliament Winner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PredictionMarkets type="kalshi" marketLabel="Parliament" />
              <PredictionMarkets type="polymarket" marketLabel="Parliament" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-red-600 border-b border-gray-200 pb-2">
              Prime Minister
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <PredictionMarkets type="polymarket-pm" marketLabel="Prime Minister" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
