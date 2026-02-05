'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
  t: (key, fallback) => fallback,
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ne')) {
      setLanguage(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language || navigator.userLanguage
      if (browserLang.startsWith('ne') || browserLang.startsWith('np')) {
        setLanguage('ne')
      }
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ne' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key, fallback = key) => {
    return TRANSLATIONS[key]?.[language] || fallback
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation strings
const TRANSLATIONS = {
  // Navigation
  'nav.home': { en: 'Home', ne: 'गृहपृष्ठ' },
  'nav.simulator': { en: 'Simulator', ne: 'प्रतिरूपक' },
  'nav.elections': { en: 'Elections', ne: 'निर्वाचन' },
  'nav.polls': { en: 'Polls', ne: 'मतदान' },
  'nav.analysis': { en: 'Analysis', ne: 'विश्लेषण' },
  'nav.demographics': { en: 'Demographics', ne: 'जनसांख्यिकी' },
  'nav.districts': { en: 'Districts', ne: 'जिल्लाहरू' },
  'nav.about': { en: 'About', ne: 'बारेमा' },
  'nav.newsletter': { en: 'Newsletter', ne: 'समाचारपत्र' },
  'nav.search': { en: 'Search', ne: 'खोज्नुहोस्' },
  
  // Actions
  'action.readMore': { en: 'Read More', ne: 'थप पढ्नुहोस्' },
  'action.share': { en: 'Share', ne: 'साझा गर्नुहोस्' },
  'action.subscribe': { en: 'Subscribe', ne: 'सदस्यता लिनुहोस्' },
  'action.viewAll': { en: 'View All', ne: 'सबै हेर्नुहोस्' },
  'action.filter': { en: 'Filter', ne: 'फिल्टर गर्नुहोस्' },
  'action.reset': { en: 'Reset', ne: 'पुनः सेट गर्नुहोस्' },
  'action.search': { en: 'Search', ne: 'खोज्नुहोस्' },
  
  // Content types
  'content.article': { en: 'Article', ne: 'लेख' },
  'content.poll': { en: 'Poll', ne: 'मतदान' },
  'content.forecast': { en: 'Forecast', ne: 'पूर्वानुमान' },
  'content.analysis': { en: 'Analysis', ne: 'विश्लेषण' },
  'content.newsletter': { en: 'Newsletter', ne: 'समाचारपत्र' },
  
  // Categories
  'category.forecasts': { en: 'Forecasts', ne: 'पूर्वानुमानहरू' },
  'category.polling': { en: 'Polling', ne: 'मतदान' },
  'category.demographics': { en: 'Demographics', ne: 'जनसांख्यिकी' },
  'category.historical': { en: 'Historical', ne: 'ऐतिहासिक' },
  'category.policy': { en: 'Policy', ne: 'नीति' },
  'category.opinion': { en: 'Opinion', ne: 'मत' },
  
  // Meta
  'meta.readTime': { en: 'min read', ne: 'मिनेट पढ्ने' },
  'meta.published': { en: 'Published', ne: 'प्रकाशित' },
  'meta.updated': { en: 'Updated', ne: 'अपडेट गरिएको' },
  'meta.author': { en: 'Author', ne: 'लेखक' },
  'meta.tags': { en: 'Tags', ne: 'ट्यागहरू' },
  
  // Simulator
  'simulator.title': { en: 'Nepal Election Simulator', ne: 'नेपाल निर्वाचन प्रतिरूपक' },
  'simulator.fptp': { en: 'FPTP Vote Share', ne: 'FPTP मत शेयर' },
  'simulator.pr': { en: 'PR Vote Share', ne: 'PR मत शेयर' },
  'simulator.seats': { en: 'Seats', ne: 'सिटहरू' },
  'simulator.majority': { en: 'Majority', ne: 'बहुमत' },
  'simulator.hung': { en: 'Hung Parliament', ne: 'टाँगिएको संसद' },
  
  // Elections
  'elections.title': { en: 'Elections', ne: 'निर्वाचनहरू' },
  'elections.forecast': { en: 'Forecast', ne: 'पूर्वानुमान' },
  'elections.history': { en: 'History', ne: 'इतिहास' },
  'elections.results': { en: 'Results', ne: 'नतिजाहरू' },
  
  // Polls
  'polls.title': { en: 'Polls', ne: 'मतदान' },
  'polls.trends': { en: 'Polling Trends', ne: 'मतदान प्रवृत्ति' },
  'polls.methodology': { en: 'Methodology', ne: 'पद्धति' },
  'polls.sampleSize': { en: 'Sample Size', ne: 'नमूना आकार' },
  'polls.marginError': { en: 'Margin of Error', ne: 'त्रुटिको सीमा' },
  
  // Newsletter
  'newsletter.title': { en: 'Newsletter', ne: 'समाचारपत्र' },
  'newsletter.subscribe': { en: 'Subscribe to our newsletter', ne: 'हाम्रो समाचारपत्रमा सदस्यता लिनुहोस्' },
  'newsletter.description': { en: 'Get weekly updates on Nepal elections and analysis', ne: 'नेपालको निर्वाचन र विश्लेषणको हप्तावारी अपडेट प्राप्त गर्नुहोस्' },
  'newsletter.email': { en: 'Email address', ne: 'इमेल ठेगाना' },
  'newsletter.archive': { en: 'Newsletter Archive', ne: 'समाचारपत्र संग्रह' },
  
  // About
  'about.title': { en: 'About', ne: 'बारेमा' },
  'about.methodology': { en: 'Methodology', ne: 'पद्धति' },
  'about.dataSources': { en: 'Data Sources', ne: 'डाटा स्रोतहरू' },
  'about.contact': { en: 'Contact', ne: 'सम्पर्क' },
  
  // Common
  'common.loading': { en: 'Loading...', ne: 'लोड हुँदैछ...' },
  'common.error': { en: 'Error', ne: 'त्रुटि' },
  'common.notFound': { en: 'Not Found', ne: 'फेला परेन' },
  'common.back': { en: 'Back', ne: 'पछाडि' },
  'common.next': { en: 'Next', ne: 'अर्को' },
  'common.previous': { en: 'Previous', ne: 'अघिल्लो' },
  'common.all': { en: 'All', ne: 'सबै' },
  'common.none': { en: 'None', ne: 'कुनै पनि होइन' },
  
  // Social
  'social.twitter': { en: 'Share on Twitter', ne: 'ट्विटरमा साझा गर्नुहोस्' },
  'social.facebook': { en: 'Share on Facebook', ne: 'फेसबुकमा साझा गर्नुहोस्' },
  'social.linkedin': { en: 'Share on LinkedIn', ne: 'LinkedIn मा साझा गर्नुहोस्' },
  'social.whatsapp': { en: 'Share on WhatsApp', ne: 'WhatsApp मा साझा गर्नुहोस्' },
  'social.copy': { en: 'Copy Link', ne: 'लिंक कपी गर्नुहोस्' },
}
