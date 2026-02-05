'use client'

import { useLanguage } from '../context/LanguageContext'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-neutral hover:bg-neutral/80 rounded-lg text-sm font-medium transition-colors"
      aria-label={`Switch to ${language === 'en' ? 'Nepali' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="font-mono">{language === 'en' ? 'EN' : 'ने'}</span>
    </button>
  )
}
