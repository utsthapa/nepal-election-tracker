import Link from 'next/link'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Prediction Markets (paused) - NepaliSoch',
  description: 'Prediction market view is paused while we focus on the simulator.',
}

export default function PredictionMarketsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(192,48,40,0.07),transparent_36%),radial-gradient(circle_at_86%_14%,rgba(31,60,136,0.08),transparent_38%),linear-gradient(120deg,rgba(255,255,255,0.68),rgba(255,255,255,0))]" />
      <main className="relative max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[color:var(--accent-primary)] text-white text-[11px] uppercase tracking-[0.2em] rounded-full shadow-sm">
          <Sparkles className="w-4 h-4" />
          Feature paused
        </div>

        <h1 className="text-4xl font-display text-[#0f172a] leading-tight">
          Prediction markets will return after we finish the simulator.
        </h1>
        <p className="text-lg text-[rgb(var(--color-muted))]">
          We are focusing all updates on the NepaliSoch. Live odds, cross-platform probabilities, and market explainers will come back once the simulator is stable.
        </p>

        <div className="rounded-3xl border border-neutral bg-surface/90 backdrop-blur-md shadow-[0_18px_55px_rgba(0,0,0,0.08)] p-6 space-y-4">
          <h2 className="text-xl font-display text-[#0f172a]">What stays active</h2>
          <ul className="list-disc list-inside space-y-2 text-[15px] text-[rgb(var(--color-muted))]">
            <li>Full simulator with FPTP and PR sliders</li>
            <li>Alliance builder and constituency overrides</li>
            <li>Seat ranges, majority probability, and switching matrix controls</li>
          </ul>
          <p className="text-sm text-[#374151]">
            Market data hooks are still in the codebase but not shown while we harden the simulator UX. Expect a relaunch once the core model is locked.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--accent-secondary)] text-white shadow-sm hover:shadow-md transition-shadow"
          >
            Go to simulator
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-neutral bg-white/70 text-[#0f172a] hover:border-[color:var(--accent-primary)] hover:text-[color:var(--accent-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>
      </main>
    </div>
  )
}
