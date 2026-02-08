'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Map, Sliders, Users, Lock, Zap, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const features = [
  {
    icon: Sliders,
    title: 'Simulation Mode',
    description: 'Adjust FPTP and PR vote share sliders to see real-time seat projections. Watch as 275 seats are calculated instantly based on your inputs.',
    highlight: true,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Map,
    title: 'Interactive Map',
    description: 'Explore all 165 constituencies across Nepal\'s 7 provinces. Click any region to view detailed demographics, voting patterns, and election results.',
    highlight: false,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Coalition Builder',
    description: 'Pair parties to form alliances with configurable transfer efficiency. Test different coalition scenarios and see the impact on seat distribution.',
    highlight: false,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Lock,
    title: 'Constituency Overrides',
    description: 'Manually override any constituency\'s winner. Useful for modeling local factors, swing regions, or incumbency effects that aren\'t captured in national data.',
    highlight: false,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: Zap,
    title: 'Bayesian Controls',
    description: 'Apply advanced simulation parameters including incumbency decay, party switching matrices, and proxy signals like by-election results.',
    highlight: false,
    gradient: 'from-rose-500 to-red-500'
  }
];

export function FeatureTour({ onComplete }) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenFeatureTour');
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenFeatureTour', 'true');
    }
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  const nextFeature = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const currentFeature = features[currentIndex];
  const FeatureIcon = currentFeature.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={handleComplete}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-auto h-[calc(100%-2rem)] z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-surface border border-neutral rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
              <div className="relative bg-gradient-to-br from-surface to-surface/50 border-b border-neutral p-6">
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 p-2 hover:bg-neutral rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl"
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-sans">
                      {language === 'ne' ? 'स्वागतम्' : 'Welcome to NepaliSoch'}
                    </h2>
                    <p className="text-sm text-gray-700">
                      {language === 'ne' ? 'नेपालको चुनाव सिमुलेटर र विश्लेषण प्लेटफर्म' : 'Nepal\'s election simulator and analytics platform'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-800 font-mono">
                  <span>{currentIndex + 1}</span>
                  <span>/</span>
                  <span>{features.length}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="space-y-6">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${currentFeature.gradient} shadow-lg`}
                      >
                        <FeatureIcon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      {currentFeature.highlight && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -top-2 -right-2 p-2 bg-amber-500 rounded-full"
                        >
                          <Info className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mt-4 mb-2 font-sans">
                      {currentFeature.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentFeature.description}
                    </p>
                  </motion.div>

                  <div className="flex items-center gap-2 pt-4">
                    {features.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentIndex
                            ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                            : 'w-2 bg-neutral'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral p-6 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-neutral"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-700 transition-colors">
                    {language === 'ne' ? 'पुन: नदेखाउनुहोस्' : 'Don\'t show this again'}
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 px-4 py-3 rounded-lg border border-neutral text-gray-700 hover:bg-neutral/80 transition-colors font-medium"
                  >
                    {language === 'ne' ? 'छोड्नुहोस्' : 'Skip'}
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                  >
                    {language === 'ne' ? 'सुरु गर्नुहोस्' : 'Get Started'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={prevFeature}
                    className="p-2 hover:bg-neutral rounded-lg transition-colors"
                    disabled={currentIndex === 0}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
                  </button>
                  <button
                    onClick={nextFeature}
                    className="p-2 hover:bg-neutral rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default FeatureTour;
