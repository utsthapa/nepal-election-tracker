'use client'

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const SECTION_LINKS = [
  { href: '/', labelKey: 'nav.simulator', label: 'Simulator' },
  { href: '/elections', labelKey: 'nav.elections', label: 'Elections' },
  { href: '/analysis', labelKey: 'nav.analysis', label: 'Analysis' },
  { href: '/districts', labelKey: 'nav.districts', label: 'Districts' },
  { href: '/demographics', labelKey: 'nav.demographics', label: 'Demographics' },
  { href: '/newsletter', labelKey: 'nav.newsletter', label: 'Newsletter' },
  { href: '/about', labelKey: 'nav.about', label: 'About' },
];

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-neutral mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-display font-bold text-foreground mb-2">
              {language === 'ne' ? 'नेपाली सोच' : 'NepaliSoch'}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {language === 'ne'
                ? 'डाटा-आधारित विश्लेषण र पत्रकारिता मार्फत नेपालको राजनीतिलाई बुझ्ने।'
                : 'Understanding Nepal\'s politics through data-driven analysis and journalism.'
              }
            </p>
          </div>

          {/* Section links */}
          <div>
            <h4 className="section-label mb-3">
              {language === 'ne' ? 'खण्डहरू' : 'Sections'}
            </h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {SECTION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {t(link.labelKey, link.label)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Data & newsletter */}
          <div>
            <h4 className="section-label mb-3">
              {language === 'ne' ? 'स्रोतहरू' : 'Sources'}
            </h4>
            <p className="text-sm text-muted mb-3">
              {language === 'ne'
                ? 'डाटा स्रोत: निर्वाचन आयोग नेपाल, राष्ट्रिय सांख्यिकी कार्यालय'
                : 'Data: Election Commission of Nepal, National Statistics Office'
              }
            </p>
            <Link
              href="/newsletter"
              className="inline-block text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
            >
              {language === 'ne' ? 'समाचारपत्रमा सदस्यता लिनुहोस् →' : 'Subscribe to our newsletter →'}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-neutral flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>
            {language === 'ne'
              ? `© ${new Date().getFullYear()} नेपाली सोच। सबै अधिकार सुरक्षित।`
              : `© ${new Date().getFullYear()} NepaliSoch. All rights reserved.`
            }
          </p>
          <p className="font-mono">
            {language === 'ne' ? 'डाटासँग निर्मित' : 'Built with data'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
