'use client'

import Link from 'next/link'

import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { useLanguage } from '../../context/LanguageContext'

export default function MethodologyPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {language === 'ne' ? 'पद्धति' : 'Methodology'}
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            {language === 'ne'
              ? 'हाम्रा मोडेल, डाटा स्रोत, र गणना विधिहरूको संक्षिप्त विवरण।'
              : 'A concise overview of our models, data sources, and calculation methods.'}
          </p>
        </div>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'आधार डेटा र दायरा' : 'Inputs and Scope'}
          </h2>
          <ul className="space-y-2 text-muted">
            <li>{language === 'ne' ? 'कुल सीट: २७५ (FPTP १६५ + PR ११०)' : 'Total seats: 275 (FPTP 165 + PR 110)'}</li>
            <li>{language === 'ne' ? 'बहुमत: १३८ सीट' : 'Majority threshold: 138 seats'}</li>
            <li>
              {language === 'ne'
                ? 'आधार वर्ष: २०२२ आधिकारिक निर्वाचन नतिजा (निर्वाचन आयोग)।'
                : 'Baseline year: official 2022 election results (Election Commission).'}
            </li>
            <li>
              {language === 'ne'
                ? 'सबै निर्वाचन क्षेत्रमा पार्टी मत-हिस्साको योग १.० मा राखिन्छ (vote conservation)।'
                : 'Constituency vote shares are always renormalized to sum to 1.0 (vote conservation).'}
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'FPTP गणित' : 'FPTP Math'}
          </h2>
          <p className="text-muted mb-3">
            {language === 'ne'
              ? 'राष्ट्रिय स्लाइडर परिवर्तन प्रत्येक निर्वाचन क्षेत्रमा समान रूपमा होइन, भौगोलिक गुणकसहित लागू हुन्छ।'
              : 'National slider changes are applied at constituency level using geographic multipliers.'}
          </p>
          <pre className="bg-neutral/30 border border-neutral rounded-lg p-4 text-sm text-muted overflow-x-auto">
{`shift_party = (slider_party - baseline_party) / 100
multiplier = ruralBias + (urbanBias - ruralBias) * urbanRate
adjusted_share = clamp(baseline_share + shift_party * multiplier, 0, 1)

After all parties are adjusted:
normalized_share_party = adjusted_share_party / sum(adjusted_share_all_parties)

FPTP winner = argmax(normalized_share_party)`}
          </pre>
          <p className="text-sm text-muted mt-3">
            {language === 'ne'
              ? 'म्यानुअल constituency override प्रयोग भएमा उक्त क्षेत्रमा माथिका गणना लागू हुँदैन।'
              : 'If a constituency is manually overridden, these calculations are skipped for that seat.'}
          </p>
        </section>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'PR गणित (Sainte-Laguë)' : 'PR Math (Sainte-Laguë)'}
          </h2>
          <ul className="space-y-2 text-muted mb-4">
            <li>
              {language === 'ne'
                ? '३% भन्दा कम राष्ट्रिय PR मत भएको पार्टी हटाइन्छ।'
                : 'Parties below the 3% national PR threshold are excluded.'}
            </li>
            <li>{language === 'ne' ? '"Others" लाई PR सीट वितरणमा समावेश गरिँदैन।' : '"Others" is excluded from PR seat allocation.'}</li>
            <li>
              {language === 'ne'
                ? '११० सीटका लागि प्रत्येक चरणमा सबैभन्दा ठूलो quotient पाएको पार्टीलाई सीट।'
                : 'For 110 seats, each round awards one seat to the party with the highest quotient.'}
            </li>
          </ul>
          <pre className="bg-neutral/30 border border-neutral rounded-lg p-4 text-sm text-muted overflow-x-auto">
{`For party p with s seats already assigned:
quotient_p = votes_p / (2*s + 1)

At each round:
seat goes to party with max(quotient_p)
repeat until 110 seats assigned`}
          </pre>
        </section>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'गठबन्धन र ट्रान्सफर गणित' : 'Alliance and Transfer Math'}
          </h2>
          <pre className="bg-neutral/30 border border-neutral rounded-lg p-4 text-sm text-muted overflow-x-auto">
{`efficiency = 1 - handicap/100
transfer = donor_share * efficiency
leader_share = leader_share + transfer
donor_share = 0

Then renormalize all party shares to sum to 1.0`}
          </pre>
          <p className="text-sm text-muted mt-3">
            {language === 'ne'
              ? 'leader पार्टी प्रत्येक निर्वाचन क्षेत्रमा स्थानीय मत-हिस्साको आधारमा छुट्टै निर्धारण हुन्छ।'
              : 'The leader party is determined per constituency based on local vote share, not fixed nationally.'}
          </p>
        </section>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'पारदर्शिता र पुन:उत्पादन' : 'Transparency and Reproducibility'}
          </h2>
          <ul className="space-y-2 text-muted">
            <li>
              {language === 'ne'
                ? 'सबै मुख्य सूत्रहरू यहाँ सार्वजनिक छन्; hidden seat बोनस वा weights छैन।'
                : 'Core formulas are public here; there are no hidden seat bonuses or hidden weights.'}
            </li>
            <li>
              {language === 'ne'
                ? 'मोडेलका मुख्य नियमहरू simulator मा Methodology section मा पनि दस्तावेजीकृत छन्।'
                : 'The same core rules are also documented inside the Simulator Methodology section.'}
            </li>
            <li>
              <Link href="/simulator/2026" className="text-blue-500 hover:underline">
                {language === 'ne' ? 'सिमुलेटर खोल्नुहोस्' : 'Open simulator'}
              </Link>
            </li>
            <li>
              <Link href="/methodology/economic-voting" className="text-blue-500 hover:underline">
                {language === 'ne'
                  ? 'आर्थिक मतदान विश्लेषणको प्राविधिक परिशिष्ट'
                  : 'Economic voting technical appendix'}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-blue-500 hover:underline">
                {language === 'ne' ? 'स्रोत र प्रक्रिया सारांश (About)' : 'Data sources and process summary (About)'}
              </Link>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
