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
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">FPTP (First-Past-The-Post) Seats</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                {language === 'ne'
                  ? 'FPTP सिटहरू नेपालको पारम्परिगत बहुमत प्रणालीमा गणना गरिन्छ। प्रत्येक निर्वाचन क्षेत्रबाट उच्चतम मत प्राप्त गर्ने उम्मेदवार सिट जित्छ।'
                  : 'FPTP seats are calculated using Nepal\'s traditional winner-takes-all system. In each constituency, the candidate with the highest vote share wins the seat.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? '१६५ निर्वाचन क्षेत्रहरू' : '165 constituencies across 7 provinces'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? 'प्रत्येक क्षेत्रबाट १ जना विजेता' : '1 winner per constituency'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? 'मत शेयरको आधारमा तुरुन्त परिणाम' : 'Instant results based on vote share'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">PR (Proportional Representation) Seats</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                {language === 'ne'
                  ? 'PR सिटहरू Sainte-Laguë विधि प्रयोग गरेर गणना गरिन्छ। पार्टीहरूले राष्ट्रिय मत शेयर अनुसार सिटहरू प्राप्त गर्छन्।'
                  : 'PR seats are calculated using the Sainte-Laguë method. Parties receive seats proportional to their national vote share.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? '११० PR सिटहरू' : '110 PR seats total'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? '३% मत थ्रेसहोल्ड' : '3% vote threshold to qualify'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? 'Sainte-Laguë विधि प्रयोग गरिन्छ' : 'Sainte-Laguë method applied'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Bayesian Simulation Model</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                {language === 'ne'
                  ? 'हाम्रो सिमुलेसनले Bayes\' theorem आधारित दृष्टिकोण अपनाउँछ। यसले नयाँ सूचना (पोल, उप-निर्वाचन, गठबन्धन) पुरानो डाटासँग एकीकृत गर्छ।'
                  : 'Our simulation uses a Bayesian approach that incorporates prior knowledge with new information. The model updates beliefs based on evidence from polls, by-elections, and coalition dynamics.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>{language === 'ne' ? '२०२२ निर्वाचन बेसलाइन प्राथमिकता' : '2022 election baseline as prior'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>{language === 'ne' ? 'उप-निर्वाचन संकेतहरू समावेश' : 'By-election signals incorporated'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>{language === 'ne' ? 'पार्टी स्विचिङ म्याट्रिक्स' : 'Party switching matrix modeling'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Constituency Overrides</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                {language === 'ne'
                  ? 'प्रयोगकर्ताहरूले कुनै पनि निर्वाचन क्षेत्रलाई म्यानुअली ओभरराइड गर्न सक्छन्। यसले स्थानीय कारकहरू, स्विङ क्षेत्रहरू, वा राष्ट्रिय डाटामा कब्जा नगरिएको इन्कम्बेन्सी प्रभावहरूलाई मोडेलिङ गर्न मद्दत गर्छ।'
                  : 'Users can manually override any constituency\'s winner. This feature allows modeling local factors, swing regions, or incumbency effects not captured in national data.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{language === 'ne' ? 'कुनै पनि निर्वाचन क्षेत्रमा क्लिक गर्नुहोस्' : 'Click any constituency to override'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{language === 'ne' ? 'विजेता पार्टी र मत शेयर सेट गर्नुहोस्' : 'Set winner party and vote share'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{language === 'ne' ? 'ओभरराइडहरू स्वत: साथ बचत हुन्छ' : 'Overrides automatically saved'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Alliance Transfer Efficiency</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                {language === 'ne'
                  ? 'गठबन्धनहरूले दुई पार्टीहरू बीच मत स्थानान्तरण मोडेलिङ गर्छ। ट्रान्सफर दक्षताले ट्रान्सफर गर्ने मतहरूको प्रतिशत निर्धारण गर्छ।'
                  : 'Alliances model vote transfer between two parties. Transfer efficiency determines what percentage of votes are transferred, accounting for voter loyalty and party compatibility.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>{language === 'ne' ? 'ह्यान्डिक्याप प्रतिशत कन्फिगरेबल' : 'Handicap percentage configurable'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>{language === 'ne' ? 'पार्टी संगतता स्कोर' : 'Party compatibility score calculated'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <span>{language === 'ne' ? 'विचारधारा आयामहरूमा आधारित' : 'Based on ideological dimensions'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="bg-surface border border-neutral rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-purple-400" />
            {t('about.dataSources')}
          </h2>
          
          <div className="space-y-6">
            <div className="p-4 bg-neutral rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Election Commission of Nepal</h3>
              <p className="text-gray-300 mb-3">
                {language === 'ne'
                  ? 'आधिकारिक निर्वाचन प्राधिकरणबाट प्राप्त डाटा।'
                  : 'Official data from Nepal\'s electoral authority.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? '२०२२ संघीय चुनाव नतिजाहरू' : '2022 Federal Election results'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? '१६५ निर्वाचन क्षेत्रहरूको विवरण' : 'Details for 165 constituencies'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? 'मतदाता सूची र जनसांख्यिकी' : 'Voter rolls and demographics'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{language === 'ne' ? 'सूत्र: result.election.gov.np' : 'Source: result.election.gov.np'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-neutral rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">National Statistics Office</h3>
              <p className="text-gray-300 mb-3">
                {language === 'ne'
                  ? 'नेपालको २०२१ जनगणनाबाट आधिकारिक जनसांख्यिकी।'
                  : 'Official demographics from Nepal\'s 2021 census.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? 'जनसंख्या र लिङ्ग वितरण' : 'Population and gender distribution'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? 'आयु वर्ग र जनसांख्यिकी' : 'Age groups and demographics'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? 'शहरी-ग्रामीण वितरण' : 'Urban-rural distribution'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{language === 'ne' ? 'सूत्र: cbs.gov.np' : 'Source: cbs.gov.np'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-neutral rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Media Organizations</h3>
              <p className="text-gray-300 mb-3">
                {language === 'ne'
                  ? 'नेपालका अग्रणी सञ्चार माध्यमहरूबाट समाचार र विश्लेषण।'
                  : 'News and analysis from Nepal\'s leading media organizations.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Kantipur Publications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Republica Media</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>The Kathmandu Post</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>{language === 'ne' ? 'विश्लेषण र समाचार लेखहरू' : 'Analysis and news articles'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-neutral rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Academic & Research Sources</h3>
              <p className="text-gray-300 mb-3">
                {language === 'ne'
                  ? 'नेपाली राजनीति र चुनावको अध्ययन गर्ने शैक्षिक स्रोतहरू।'
                  : 'Academic sources studying Nepali politics and elections.'
                }
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{language === 'ne' ? 'पीआर संकेत अनुसन्धान' : 'PR signal research papers'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{language === 'ne' ? 'चुनाव प्रणाली तुलना अध्ययन' : 'Electoral system comparative studies'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{language === 'ne' ? 'विचारधारा मापन अनुसन्धान' : 'Ideology measurement research'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong className="text-blue-400">{language === 'ne' ? 'खुला स्रोत:' : 'Open Source:'}</strong>{' '}
              {language === 'ne'
                ? 'हाम्रो सबै कोड, गणना, र डाटा GitHub मा उपलब्ध छ। तपाईंले हाम्रो कामलाई समीक्षा, योगदान, र सुधार गर्न सक्नुहुन्छ।'
                : 'All our code, calculations, and data are available on GitHub. You can review, contribute, and improve our work.'
              }
            </p>
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="bg-surface border border-neutral rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-400" />
            {language === 'ne' ? 'भविष्यको रोडम्याप' : 'Future Roadmap'}
          </h2>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            {language === 'ne'
              ? 'हामी Nepal Votes लाई सुधार गर्न र थप सुविधाहरू थप्न निरन्तर प्रयास गरिरहेका छौं। यहाँ हाम्रो भविष्यको योजनाहरू छन्:'
              : 'We are continuously working to improve Nepal Votes and add more features. Here are our planned developments:'
            }
          </p>

          <div className="grid gap-4">
            <div className="p-4 bg-neutral rounded-lg hover:bg-neutral/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {language === 'ne' ? 'रियल-टाइम पोलिङ एकीकरण' : 'Real-time Polling Integration'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ne'
                      ? 'सार्वजनिक मतदानलाई स्वचालित रूपमा संकलन गर्ने र सिमुलेसनमा एकीकृत गर्ने प्रणाली।'
                      : 'Automatically aggregate public polls and integrate them into the simulation as Bayesian priors.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral rounded-lg hover:bg-neutral/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {language === 'ne' ? 'ऐतिहासिक तुलना' : 'Historical Comparisons'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ne'
                      ? '२०१७ र २०२२ चुनाव बीचको तुलना, प्रवृत्ति विश्लेषण, र समय-श्रृंखला चार्टहरू।'
                      : 'Compare 2017 and 2022 elections, analyze trends, and visualize time-series data across multiple cycles.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral rounded-lg hover:bg-neutral/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {language === 'ne' ? 'उन्नत जनसांख्यिकी क्रस-ट्याबहरू' : 'Advanced Demographic Cross-Tabs'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ne'
                      ? 'उमेर, लिङ्ग, शिक्षा, र आय स्तर अनुसार मतदाता प्रोफाइल र पार्टी समर्थन।'
                      : 'Voter profiles and party support by age, gender, education, and income level across constituencies.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral rounded-lg hover:bg-neutral/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
                  <Code className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {language === 'ne' ? 'मोबाइल एप विकास' : 'Mobile App Development'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ne'
                      ? 'iOS र Android लागि नेटिभ एप, अफलाइन मोड, र पुश सूचनाहरू।'
                      : 'Native apps for iOS and Android with offline mode and push notifications for updates.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral rounded-lg hover:bg-neutral/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500/20 rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {language === 'ne' ? 'लाइभ निर्वाचन रात कभरेज' : 'Live Election Night Coverage'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ne'
                      ? 'वास्तविक-समयमा नतिजा, अपडेट, र विश्लेषण, निर्वाचन दिनमा लाइभ।'
                      : 'Real-time results, updates, and analysis streamed live on election day with interactive dashboards.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral rounded-lg hover:bg-neutral/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {language === 'ne' ? 'जिल्ला-स्तरीय अनुमान' : 'District-Level Forecasts'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ne'
                      ? 'प्रत्येक जिल्लामा प्रोजेक्टेड नतिजाहरू, ऐतिहासिक प्रवृत्ति र जनसांख्यिकी विश्लेषण।'
                      : 'Projected results for each district with historical trends and demographic analysis.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong className="text-green-400">{language === 'ne' ? 'योगदान स्वागत छ:' : 'Contributions Welcome:'}</strong>{' '}
              {language === 'ne'
                ? 'हाम्रो रोडम्यापको बारेमा विचार छ? हामीलाई सम्पर्क गर्नुहोस् वा GitHub मा योगदान गर्नुहोस्।'
                : 'Have ideas for our roadmap? Contact us or contribute on GitHub. We welcome feedback and collaboration.'
              }
            </p>
          </div>
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



