import { motion, AnimatePresence } from 'framer-motion';
import { X, Unlink, Link2, RotateCcw, BarChart3, Vote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PARTIES, INITIAL_NATIONAL } from '../data/constituencies';
import { DemographicsPanel } from './DemographicsPanel';

const partyOrder = Object.keys(INITIAL_NATIONAL);

export function SeatDrawer({
  constituency,
  isOpen,
  onClose,
  onOverride,
  onClearOverride,
}) {
  const [localResults, setLocalResults] = useState({});
  const [isDetached, setIsDetached] = useState(false);
  const [activeTab, setActiveTab] = useState('voting'); // 'voting' or 'demographics'

  useEffect(() => {
    if (constituency) {
      // Use currentResults if available (from simulator), otherwise fall back to results2022
      setLocalResults(constituency.currentResults || constituency.results2022 || {});
      setIsDetached(constituency.isOverridden || false);
    }
  }, [constituency]);

  if (!constituency) return null;

  const handleSliderChange = (party, value) => {
    if (!localResults || Object.keys(localResults).length === 0) return;

    const newValue = parseFloat(value) / 100;
    const otherParties = partyOrder.filter(p => p !== party);
    const currentSum = otherParties.reduce((sum, p) => sum + (localResults[p] || 0), 0);

    if (currentSum === 0) return;

    const remaining = 1 - newValue;
    const newResults = { [party]: newValue };

    otherParties.forEach((p, index) => {
      if (index === otherParties.length - 1) {
        newResults[p] = Math.max(0, remaining - otherParties.slice(0, -1).reduce((s, op) => s + (newResults[op] || 0), 0));
      } else {
        newResults[p] = (localResults[p] / currentSum) * remaining;
      }
    });

    setLocalResults(newResults);
  };

  const handleApply = () => {
    if (isDetached) {
      onOverride(constituency.id, localResults);
    }
    onClose();
  };

  const handleDetachToggle = () => {
    if (isDetached) {
      onClearOverride(constituency.id);
      setLocalResults(constituency.results2022);
    }
    setIsDetached(!isDetached);
  };

  const handleReset = () => {
    setLocalResults(constituency.results2022);
  };

  // Dynamic color classes
  const bgColors = {};
  const textColors = {};
  Object.keys(PARTIES).forEach(p => {
    bgColors[p] = `bg-${p.toLowerCase()}`;
    textColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  const winProbEntries = constituency.winProbabilities
    ? Object.entries(constituency.winProbabilities).sort((a, b) => b[1] - a[1])
    : [];
  const topProb = winProbEntries[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-surface border-l border-neutral z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-neutral z-10">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-sans font-bold text-white">
                    {constituency.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {constituency.district}, Province {constituency.province}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {topProb && (
                <div className="px-4 py-2 flex items-center justify-between border-t border-neutral text-xs text-gray-700 bg-neutral/40">
                  <span>
                    Projected: <span className={textColors[topProb[0]]}>{formatPartyLabel(topProb[0])}</span>
                  </span>
                  <span className="font-mono">{(topProb[1] * 100).toFixed(1)}%</span>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-t border-neutral">
                <button
                  onClick={() => setActiveTab('voting')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'voting'
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                      : 'text-gray-700 hover:text-gray-200 hover:bg-neutral/50'
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  Voting
                </button>
                <button
                  onClick={() => setActiveTab('demographics')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'demographics'
                      ? 'text-green-400 border-b-2 border-green-400 bg-green-500/10'
                      : 'text-gray-700 hover:text-gray-200 hover:bg-neutral/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Demographics
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Demographics Tab */}
              {activeTab === 'demographics' && (
                <DemographicsPanel
                  constituencyId={constituency.id}
                  constituencyName={constituency.name}
                />
              )}

              {/* Voting Tab */}
              {activeTab === 'voting' && (
                <>
              {/* Detach Toggle */}
              <div className="flex items-center justify-between p-3 bg-neutral/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {isDetached ? (
                    <Unlink className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Link2 className="w-4 h-4 text-gray-700" />
                  )}
                  <span className="text-sm text-gray-700">
                    {isDetached ? 'Detached from global' : 'Following global sliders'}
                  </span>
                </div>
                <button
                  onClick={handleDetachToggle}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    isDetached
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  {isDetached ? 'Reattach' : 'Detach'}
                </button>
              </div>

              {/* Baseline Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">2022 Baseline</h4>
                <div className="space-y-1">
                  {partyOrder.map(party => (
                    <div key={party} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${bgColors[party]}`} />
                        <span className="text-gray-700">{formatPartyLabel(party)}</span>
                      </div>
                      <span className="font-mono text-gray-700">
                        {(constituency.results2022[party] * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Override Sliders */}
              {isDetached && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Manual Override</h4>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 text-xs text-gray-800 hover:text-gray-700 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    {partyOrder.map(party => (
                      <div key={party}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${bgColors[party]}`} />
                            <span className="text-sm text-gray-700">{formatPartyLabel(party)}</span>
                          </div>
                          <span className={`font-mono text-sm font-medium ${textColors[party]}`}>
                            {((localResults[party] || 0) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          step="0.5"
                          value={(localResults[party] || 0) * 100}
                          onChange={(e) => handleSliderChange(party, e.target.value)}
                          className="w-full h-2"
                          style={{
                            background: `linear-gradient(to right, ${PARTIES[party].color} 0%, ${PARTIES[party].color} ${(localResults[party] || 0) * 100 / 0.8}%, #1e293b ${(localResults[party] || 0) * 100 / 0.8}%, #1e293b 100%)`,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Total</span>
                      <span className="font-mono text-white">
                        {(Object.values(localResults).reduce((a, b) => a + b, 0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Current Result Preview */}
              <div className="bg-neutral/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Projected Winner</h4>
                {(() => {
                  if (!localResults || Object.keys(localResults).length === 0) {
                    return <p className="text-gray-800 text-sm">No data available</p>;
                  }
                  const sorted = Object.entries(localResults).sort((a, b) => b[1] - a[1]);
                  const winner = sorted[0];
                  if (!winner) return null;
                  const runnerUp = sorted[1];
                  const margin = runnerUp ? winner[1] - runnerUp[1] : winner[1];

                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${bgColors[winner[0]]}`} />
                        <span className={`text-xl font-bold ${textColors[winner[0]]}`}>
                          {PARTIES[winner[0]]?.name || winner[0]}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-gray-700">
                        {(winner[1] * 100).toFixed(2)}% (+{(margin * 100).toFixed(2)}% margin)
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Apply Button */}
              {isDetached && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="w-full py-3 bg-gradient-to-r from-nc to-rsp text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply Override
                </motion.button>
              )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SeatDrawer;
