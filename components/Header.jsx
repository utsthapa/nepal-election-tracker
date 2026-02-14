'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

const NAV_ITEMS = [
  { href: '/', labelKey: 'nav.simulator', label: 'Simulator' },
  { href: '/elections', labelKey: 'nav.elections', label: 'Elections' },
  { href: '/prediction-markets', labelKey: 'nav.markets', label: 'Markets' },
  { href: '/analysis', labelKey: 'nav.analysis', label: 'Analysis' },
  { href: '/districts', labelKey: 'nav.districts', label: 'Districts' },
  { href: '/demographics', labelKey: 'nav.demographics', label: 'Demographics' },
  { href: '/nepal-data', labelKey: 'nav.nepalData', label: 'Nepal Data' },
  { href: '/about', labelKey: 'nav.about', label: 'About' },
];

export function Header() {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-neutral sticky top-0 z-50">
      {/* Top bar: Brand + toggles */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-display font-bold text-foreground tracking-tight">
              {language === 'ne' ? 'नेपाली सोच' : 'NepaliSoch'}
            </span>
            <span className="hidden sm:inline text-xs text-muted font-sans tracking-wide">
              {language === 'ne' ? 'डाटा-संचालित विश्लेषण' : 'Data-Driven Analysis'}
            </span>
          </Link>

          {/* Right side: toggles + mobile menu button */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral/50 transition-colors text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar: desktop */}
      <nav className="hidden md:block border-t border-neutral/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-10 -mb-px">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {t(item.labelKey, item.label)}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-neutral bg-surface">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-neutral/50 text-foreground'
                    : 'text-muted hover:bg-neutral/30 hover:text-foreground'
                }`}
              >
                {t(item.labelKey, item.label)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
