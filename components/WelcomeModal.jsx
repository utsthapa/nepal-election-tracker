import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map, Sliders, Database } from 'lucide-react';

export function WelcomeModal({ isOpen, onClose }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenWelcomeModal', 'true');
    }
    onClose();
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
            className="fixed inset-0 z-[9999]"
          >
            <div className="absolute top-[35%] left-[35%]">
              <div
                className="bg-surface border border-neutral rounded-xl shadow-2xl max-w-xl w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Welcome to NepaliSoch.com</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Your data hub for Nepal's elections
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-neutral transition-colors text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-neutral/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      We're a work in progress building Nepal's most comprehensive election data platform. Explore historical election results, analyze voting patterns, and try our simulation mode.
                    </p>
                  </div>

                  <h4 className="text-sm font-semibold text-white">What We Offer</h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <Database className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">Election Data</h5>
                        <p className="text-xs text-gray-400">Data from prior elections across all constituencies</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-purple-500/20 rounded-lg">
                        <Map className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">Interactive Maps</h5>
                        <p className="text-xs text-gray-400">Explore all 165 constituencies across Nepal</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <Sliders className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">Simulation Mode</h5>
                        <p className="text-xs text-gray-400">Test different scenarios and see projected outcomes</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-neutral"
                  />
                  <span className="text-sm text-gray-400">Don't show this again</span>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2 rounded-lg text-sm bg-neutral text-gray-200 hover:bg-neutral/80 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default WelcomeModal;
