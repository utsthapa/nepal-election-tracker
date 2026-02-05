'use client'

import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Mail, CheckCircle, ArrowRight, Archive } from 'lucide-react'

export default function NewsletterPage() {
  const { language, t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('newsletter.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('newsletter.description')}
          </p>
        </div>

        {/* Newsletter Signup */}
        {!isSubmitted ? (
          <div className="bg-surface border border-neutral rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {language === 'ne' ? 'हाम्रो समाचारपत्रमा सदस्यता लिनुहोस्' : 'Subscribe to our newsletter'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('newsletter.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'ne' ? 'तपाईंको इमेल' : 'your@email.com'}
                  required
                  className="w-full px-4 py-3 bg-neutral border border-neutral rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 018 8 0 018 8 0 018-8 018-8 0 018z" />
                    </svg>
                    {language === 'ne' ? 'प्रक्रिया गरिँदैछ...' : 'Subscribing...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {t('action.subscribe')}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'ne' ? 'हाम्रो समाचारपत्रमा के प्राप्त हुनेछ' : 'What you\'ll get:'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    {language === 'ne' 
                      ? 'हप्तावारी निर्वाचन विश्लेषण र पूर्वानुमान'
                      : 'Weekly election analysis and forecasts'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    {language === 'ne' 
                      ? 'नवीनतम मतदान अपडेट'
                      : 'Latest polling updates'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    {language === 'ne' 
                      ? 'विशेष विश्लेषण र डाटा भिजुअलाइजेसनहरू'
                      : 'Exclusive data visualizations'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    {language === 'ne' 
                      ? 'निर्वाचन समयमा विशेष अपडेट'
                      : 'Election day live coverage'
                    }
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 mb-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              {language === 'ne' ? 'धन्यवाद!' : 'Successfully Subscribed!'}
            </h2>
            <p className="text-gray-300 mb-6">
              {language === 'ne' 
                ? 'तपाईंलाई हाम्रो समाचारपत्रमा स्वागत छ।'
                : `You're now subscribed to our newsletter. Check ${email} for confirmation.`
              }
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral hover:bg-neutral/80 text-white font-medium rounded-lg transition-colors"
            >
              {language === 'ne' ? 'अर्कै सदस्यता गर्नुहोस्' : 'Subscribe another email'}
            </button>
          </div>
        )}

        {/* Newsletter Archive */}
        <div className="bg-surface border border-neutral rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Archive className="w-6 h-6" />
              {t('newsletter.archive')}
            </h2>
            <a
              href="/newsletter/archive"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View all past issues'}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(issue => (
              <div key={issue} className="bg-neutral rounded-lg p-4 hover:bg-neutral/80 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                      {language === 'ne' ? 'समस्या' : 'Issue'}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      Week {issue}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    January 2025
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  {language === 'ne' 
                    ? `हप्तावारी ${issue}: नेपालको निर्वाचन परिदृश्यको समीक्षण`
                    : `Weekly update ${issue}: Summary of Nepal election developments`
                  }
                </p>
              </div>
            ))}
            <a
              href="/newsletter/archive"
              className="block text-center py-4 text-blue-400 hover:text-blue-300 font-medium"
            >
              {language === 'ne' ? 'सबै हेर्नुहोस्...' : 'View all past issues →'}
            </a>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-neutral/30 rounded-lg text-center">
          <p className="text-xs text-gray-500">
            {language === 'ne' 
              ? 'हामी तपाईंको इमेल गोपनीपनतामा प्रयोग गर्छौं र कहिल्यै तेस्रो पार्टीको लागि प्रयोग गर्छौं।'
              : 'We respect your privacy and will never share your email with third parties. You can unsubscribe at any time.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
