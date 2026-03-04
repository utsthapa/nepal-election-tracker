'use client'

import Link from 'next/link'

import { Footer } from '../../../components/Footer'
import { Header } from '../../../components/Header'
import { useLanguage } from '../../../context/LanguageContext'

export default function EconomicVotingMethodologyPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {language === 'ne' ? 'आर्थिक मतदान: पद्धति परिशिष्ट' : 'Economic Voting: Methodology Appendix'}
          </h1>
          <p className="text-lg text-muted">
            {language === 'ne'
              ? 'आर्थिक मतदान विश्लेषणमा प्रयोग गरिएको डेटा, मोडेल, र सीमाहरू।'
              : 'Data, model structure, and limitations used in our economic voting analysis.'}
          </p>
        </div>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'डेटा स्रोत' : 'Data Sources'}
          </h2>
          <ul className="space-y-2 text-muted">
            <li>
              {language === 'ne'
                ? 'निर्वाचन आयोग नेपाल: निर्वाचन नतिजा (१९९१-२०२२)।'
                : 'Election Commission of Nepal: election outcomes (1991-2022).'}
            </li>
            <li>
              {language === 'ne'
                ? 'नेपाल राष्ट्र बैंक: मूल्यसूचक, वृद्धि, वित्तीय संकेतक।'
                : 'Nepal Rastra Bank: inflation, growth, and macro-financial indicators.'}
            </li>
            <li>
              {language === 'ne'
                ? 'विश्व बैंक: विकास र सामाजिक-आर्थिक सूचकांक।'
                : 'World Bank: development and socio-economic indicators.'}
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'मोडेल ढाँचा' : 'Model Framework'}
          </h2>
          <ul className="space-y-2 text-muted">
            <li>
              {language === 'ne'
                ? 'निर्वाचन-समय प्यानेल प्रतिगमन (panel regression)।'
                : 'Election-cycle panel regression design.'}
            </li>
            <li>
              {language === 'ne'
                ? 'आश्रित चर: पार्टी मत-हिस्सा वा सीट-प्रदर्शन सूचक।'
                : 'Dependent variables: party vote share and seat-performance indicators.'}
            </li>
            <li>
              {language === 'ne'
                ? 'स्वतन्त्र चर: वृद्धि, मुद्रास्फीति, रोजगार, र जनसांख्यिक नियन्त्रण।'
                : 'Independent variables: growth, inflation, employment, and demographic controls.'}
            </li>
          </ul>
          <pre className="mt-4 bg-neutral/30 border border-neutral rounded-lg p-4 text-sm text-muted overflow-x-auto">
{`VoteShare_{p,c,t} = alpha_p
  + beta1 * Growth_{c,t}
  + beta2 * Inflation_{c,t}
  + beta3 * Employment_{c,t}
  + gamma * Demographics_{c,t}
  + delta_c + tau_t + epsilon_{p,c,t}

where:
- p = party, c = constituency, t = election cycle
- delta_c = constituency fixed effect
- tau_t = cycle fixed effect`}
          </pre>
        </section>

        <section className="bg-surface border border-neutral rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            {language === 'ne' ? 'सीमाहरू' : 'Limitations'}
          </h2>
          <ul className="space-y-2 text-muted mb-4">
            <li>
              {language === 'ne'
                ? 'क्षेत्रीय आर्थिक सूचकहरू कतिपय अवस्थामा अनुमानित वा प्रोक्सी-आधारित।'
                : 'Some subnational economic indicators are estimated or proxy-based.'}
            </li>
            <li>
              {language === 'ne'
                ? 'प्रत्यक्ष कारण-परिणाम भन्दा सम्बन्ध (association) व्याख्यामा जोड।'
                : 'Findings prioritize association over strict causal claims.'}
            </li>
            <li>
              {language === 'ne'
                ? 'आंकडा गुणस्तर र समय-अन्तरका कारण अनिश्चितता।'
                : 'Uncertainty remains due to data quality and release-timing gaps.'}
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            {language === 'ne' ? 'पारदर्शिता नोट' : 'Transparency Note'}
          </h3>
          <ul className="space-y-2 text-muted mb-4">
            <li>
              {language === 'ne'
                ? 'कारण-परिणाम (causal) दाबी भन्दा सम्बन्ध (association) नतिजामा जोड।'
                : 'Results are interpreted as associations, not definitive causal claims.'}
            </li>
            <li>
              {language === 'ne'
                ? 'अनुमानित सूचकहरू प्रयोग भएको ठाउँमा त्यसलाई स्पष्ट रूपमा चिन्ह लगाइन्छ।'
                : 'Estimated/proxy indicators are explicitly marked where used.'}
            </li>
            <li>
              {language === 'ne'
                ? 'विश्लेषणात्मक धारणाहरू (controls, fixed effects) सार्वजनिक राखिन्छन्।'
                : 'Analytical assumptions (controls, fixed effects) are listed publicly.'}
            </li>
          </ul>

          <Link href="/analysis/economic-voting" className="text-blue-500 hover:underline">
            {language === 'ne' ? 'आर्थिक मतदान लेखमा फर्किनुहोस्' : 'Back to Economic Voting article'}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
