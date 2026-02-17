'use client'

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

const NAV_ITEMS = [
  { href: '/', labelKey: 'nav.home', label: 'Home' },
  { href: '/simulator', labelKey: 'nav.simulator', label: 'Simulator' },
  { href: '/elections', labelKey: 'nav.elections', label: 'Elections' },
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
    if (href === '/') {return pathname === '/';}
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[rgb(219,211,196)] sticky top-0 z-50 shadow-sm">
      {/* Top bar: Brand + toggles */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold text-[rgb(24,26,36)] tracking-tight" style={{ fontFamily: 'Lora, serif' }}>
              {language === 'ne' ? 'नेपाली सोच' : 'NepaliSoch'}
            </span>
            <span className="hidden sm:inline text-xs text-[rgb(100,110,130)] tracking-wide" style={{ fontFamily: 'Figtree, sans-serif' }}>
              {language === 'ne' ? 'डाटा-संचालित विश्लेषण' : 'Data-Driven Analysis'}
            </span>
          </Link>

          {/* Right side: toggles + mobile menu button */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[rgb(219,211,196)]/30 transition-colors text-[rgb(24,26,36)]"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar: desktop */}
      <nav className="hidden md:block border-t border-[rgb(219,211,196)]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-11 -mb-px">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-semibold transition-all relative whitespace-nowrap ${
                  isActive(item.href)
                    ? 'text-[#B91C1C]'
                    : 'text-[rgb(100,110,130)] hover:text-[rgb(24,26,36)]'
                }`}
                style={{ fontFamily: 'Figtree, sans-serif' }}
              >
                {t(item.labelKey, item.label)}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#B91C1C] rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[rgb(219,211,196)] bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#B91C1C]/10 text-[#B91C1C]'
                    : 'text-[rgb(100,110,130)] hover:bg-[rgb(219,211,196)]/30 hover:text-[rgb(24,26,36)]'
                }`}
                style={{ fontFamily: 'Figtree, sans-serif' }}
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
