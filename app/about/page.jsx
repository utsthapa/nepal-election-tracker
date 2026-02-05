'use client'

import { useLanguage } from '../../context/LanguageContext'
import Link from 'next/link'
import { BarChart3, Code, Users, Target, Globe } from 'lucide-react'

export default function AboutPage() {
  const { language, t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {language === 'ne' ? 'बारेमा' : 'About Nepal Votes'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {language === 'ne'
              ? 'नेपालको निर्वाचनको लागि डाटा-आधारित विश्लेषण र विश्लेषण ल्याउन्ने'
              : 'Bringing data-driven analysis and journalism to Nepal elections'
            }
          </p>
        </div>

        {/* Mission */}
        <section className="bg-surface border border-neutral rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            {language === 'ne' ? 'हाम्रो मिशन' : 'Our Mission'}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {language === 'ne'
              ? 'नेपाल ५३८ को मिशन नेपालको राजनीतिक परिदृश्यमा पारदर्शिता, विश्लेषण, र पारदर्शिता ल्याउन्ने हो। हामी पाँचौ र सटीकताको साथ राजनीतिलाई बुझ्न मद्दत गर्छौं।'
              : 'Nepal Votes\'s mission is to bring transparency, analysis, and insight to Nepal politics. We believe that data-driven journalism can help citizens make informed decisions and hold leaders accountable.'
            }
          </p>
          <p className="text-gray-300 leading-relaxed">
            {language === 'ne'
              ? 'हामी पाँचौ, विश्लेषण, र जवाफदारिता ल्याउन्छौं, र हाम्रो सबै विश्लेषण र डाटा स्रोतहरूलाई उद्धृत गर्छौं।'
              : 'We are independent, non-partisan, and transparent in our analysis. All our sources and methodologies are documented and available for review.'
            }
          </p>
        </section>

        {/* What We Do */}
        <section className="bg-surface border border-neutral rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-green-400" />
            {language === 'ne' ? 'हामी के गर्छौं' : 'What We Do'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'ne' ? 'निर्वाचन विश्लेषण' : 'Election Analysis'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'ne'
                    ? 'नेपालको निर्वाचन प्रणाली, पार्टीहरू, र गठबन्धनहरूको गहिराइ विश्लेषण'
                    : 'In-depth analysis of Nepal\'s electoral system, parties, and coalitions'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'ne' ? 'मतदान संकलन' : 'Polling Aggregation'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'ne'
                    ? 'सार्वजनिक मतदानको संकलन र विश्लेषण'
                    : 'Aggregation and analysis of public opinion polls'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'ne' ? 'पूर्वानुमान' : 'Forecasts & Models'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'ne'
                    ? 'सांख्यिक मोडेलहरूमा आधारित निर्वाचन पूर्वानुमान'
                    : 'Statistical models and election projections'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'ne' ? 'जनसांख्यिकी अन्तर्दृष्ट' : 'Demographics Research'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'ne'
                    ? 'निर्वाचन क्षेत्र र जिल्लाको जनसांख्यिकी डाटा'
                    : 'Analysis of electoral constituencies and district demographics'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-surface border border-neutral rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-400" />
            {t('about.methodology')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {language === 'ne'
              ? 'हामी पारदर्शिता र सटीकतामा विश्वास गर्छौं। हाम्रो सबै मोडेलहरू, डाटा स्रोतहरू, र गणनाका विधिहरू कागजात गरिएका छन् र समीक्षाको लागि उपलब्ध छन्।'
              : 'We believe in transparency and rigor. All our models, data sources, and calculation methods are documented and available for review.'
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/elections"
              className="block bg-neutral rounded-lg p-4 hover:bg-neutral/80 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('nav.elections')}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'ne'
                  ? 'ऐतिहासिक निर्वाचन नतिजाहरू र विधिहरू'
                  : 'Historical election results and methodologies'
                }
              </p>
            </Link>
            <Link
              href="/demographics"
              className="block bg-neutral rounded-lg p-4 hover:bg-neutral/80 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('nav.demographics')}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'ne'
                  ? 'डाटा स्रोतहरू र जनसांख्यिकी पद्धति'
                  : 'Data sources and demographic methodology'
                }
              </p>
            </Link>
          </div>
        </section>

        {/* Data Sources */}
        <section className="bg-surface border border-neutral rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-purple-400" />
            {t('about.dataSources')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {language === 'ne'
              ? 'हाम्रो डाटा नेपालको आधिकारिक स्रोतहरूबाट आउँछ।'
              : 'Our data comes from official and reputable sources.'
            }
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-300">
                <strong className="text-white">Election Commission of Nepal:</strong> {language === 'ne'
                  ? ' आधिकारिक निर्वाचन नतिजा, मतदाता सूची, र निर्वाचन क्षेत्रहरू'
                  : ' Official election results, voter rolls, and constituency boundaries'
                }
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-300">
                <strong className="text-white">National Statistics Office:</strong> {language === 'ne'
                  ? ' २०२१ को जनगणना डाटा'
                  : ' 2021 Census data'
                }
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-300">
                <strong className="text-white">Media Organizations:</strong> {language === 'ne'
                  ? ' कान्तिपुर, रिपब्लिका, द काठमाण्डु पोस्ट, र अन्य स्रोतहरू'
                  : ' Kantipur, Republica, The Kathmandu Post, and other sources'
                }
              </span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-surface border border-neutral rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('about.contact')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            {language === 'ne'
              ? 'प्रश्नहरू, प्रतिक्रियता, वा सहयोगारीको लागि हामीलाई सम्पर्क गर्नुहोस्:'
              : 'Have questions, feedback, or suggestions? We\'d love to hear from you:'
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:contact@nepalvotes.com"
              className="block bg-neutral rounded-lg p-4 hover:bg-neutral/80 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === 'ne' ? 'इमेल' : 'Email'}
              </h3>
              <p className="text-sm text-gray-400">
                contact@nepalvotes.com
              </p>
            </a>
            <Link
              href="/newsletter"
              className="block bg-neutral rounded-lg p-4 hover:bg-neutral/80 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('nav.newsletter')}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'ne'
                  ? 'हाम्रो समाचारपत्रमा सदस्यता लिनुहोस्'
                  : 'Subscribe to our newsletter for updates'
                }
              </p>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral text-center">
          <p className="text-sm text-gray-500">
            {language === 'ne'
              ? '© २०२५ Nepal Votes. सबै अधिकार सुरक्षित छ।'
              : '© 2025 Nepal Votes. All rights reserved.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}



