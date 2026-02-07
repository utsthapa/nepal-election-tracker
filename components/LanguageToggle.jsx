'use client'

import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-muted hover:text-foreground hover:bg-neutral/50 transition-colors"
      aria-label={`Switch to ${language === 'en' ? 'Nepali' : 'English'}`}
    >
      {language === 'en' ? 'ने' : 'EN'}
    </button>
  )
}
