'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';
import { useState } from 'react';

export function QuickStartModal({ isOpen, onClose, onSelectAction }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenQuickStart', 'true');
    }
    onClose();
  };

  const handleAction = (action) => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenQuickStart', 'true');
    }
    onSelectAction?.(action);
  };

  const quickActions = [
    {
      id: 'explore',
      icon: Target,
      title: 'Start Exploring',
      description: 'Use the 2022 baseline and adjust sliders manually',
      color: 'blue',
      action: () => handleAction('explore'),
    },
    {
      id: 'scenario',
      icon: TrendingUp,
      title: 'Try a Scenario',
      description: 'Load a demographic scenario like "Youth Surge" or "Urban Wave"',
      color: 'purple',
      action: () => handleAction('scenario'),
    },
    {
      id: 'example',
      icon: Lightbulb,
      title: 'See an Example',
      description: 'Watch how changing one party affects the results',
      color: 'green',
      action: () => handleAction('example'),
    },
    {
      id: 'learn',
      icon: BookOpen,
      title: 'Learn More',
      description: "Understand how Nepal's electoral system works",
      color: 'amber',
      action: () => {
        window.open('/about', '_blank');
        handleClose();
      },
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-100 hover:border-blue-400',
      iconBg: 'bg-blue-100',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      icon: 'text-purple-600',
      hover: 'hover:bg-purple-100 hover:border-purple-400',
      iconBg: 'bg-purple-100',
    },
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      icon: 'text-emerald-600',
      hover: 'hover:bg-emerald-100 hover:border-emerald-400',
      iconBg: 'bg-emerald-100',
    },
    amber: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      icon: 'text-orange-600',
      hover: 'hover:bg-orange-100 hover:border-orange-400',
      iconBg: 'bg-orange-100',
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[1001]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div
              className="bg-white border-2 border-gray-300 rounded-xl shadow-2xl max-w-3xl w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Welcome to Nepal Election Simulator
                  </h3>
                  <p className="text-sm text-gray-600">
                    You&apos;re starting with the 2022 election baseline
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Baseline Info Badge */}
              <div className="mb-6 p-4 bg-sky-50 border-2 border-sky-300 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📊</span>
                  <h4 className="text-sm font-bold text-sky-700">
                    2022 Official Results Loaded
                  </h4>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your sliders are set to the actual 2022 FPTP and PR vote shares.
                  <span className="font-semibold"> Major parties: NC 23.3%, UML 30.5%, Maoist 13.4%, RSP 7.8%, JSPN 4.8%</span>
                </p>
              </div>

              {/* Quick Action Cards */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  What would you like to do?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    const colors = colorClasses[action.color];
                    const isPrimary = action.id === 'explore';

                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className={`
                          flex items-start gap-3 p-4 rounded-lg border-2 transition-all
                          ${isPrimary
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 ring-2 ring-blue-200 shadow-md'
                            : `${colors.bg} ${colors.border} ${colors.hover}`
                          }
                        `}
                      >
                        <div className={`p-2.5 rounded-lg ${colors.iconBg} flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <div className="text-left flex-1">
                          <h5 className={`text-sm font-bold mb-1 ${isPrimary ? 'text-blue-700' : 'text-gray-800'}`}>
                            {action.title}
                            {isPrimary && (
                              <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                          </h5>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-600 group-hover:text-gray-800">Don&apos;t show this again</span>
                  </label>
                  <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    💡 Tip: Use the Reset button anytime to return to 2022 baseline
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default QuickStartModal;
