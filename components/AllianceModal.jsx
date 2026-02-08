import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Link2, Slash } from 'lucide-react';
import { PARTIES, INITIAL_NATIONAL } from '../data/constituencies';

const partyOrder = Object.keys(INITIAL_NATIONAL);

export function AllianceModal({ isOpen, onClose, allianceConfig, onSave, onClear }) {
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [handicap, setHandicap] = useState(allianceConfig?.handicap ?? 10);

  useEffect(() => {
    if (isOpen) {
      setPartyA(allianceConfig?.parties?.[0] || '');
      setPartyB(allianceConfig?.parties?.[1] || '');
      setHandicap(allianceConfig?.handicap ?? 10);
    }
  }, [isOpen, allianceConfig]);

  const canSave = partyA && partyB && partyA !== partyB;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      parties: [partyA, partyB],
      handicap: Number(handicap),
    });
    onClose();
  };

  const handleClear = () => {
    onClear?.();
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
            onClick={onClose}
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
                    <div className="flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-white">Gathabandan Mode</h3>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Pair two parties. In every seat where both appear, the leading ally receives the partner&apos;s votes with a handicap.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-neutral transition-colors text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-800 mb-1">Lead Partner</label>
                      <select
                        value={partyA}
                        onChange={(e) => setPartyA(e.target.value)}
                        className="w-full bg-neutral border border-neutral rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500"
                      >
                        <option value="">Choose party</option>
                        {partyOrder.map(party => (
                          <option
                            key={party}
                            value={party}
                            disabled={party === partyB}
                          >
                            {PARTIES[party].name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-800 mb-1">Supporting Partner</label>
                      <select
                        value={partyB}
                        onChange={(e) => setPartyB(e.target.value)}
                        className="w-full bg-neutral border border-neutral rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500"
                      >
                        <option value="">Choose party</option>
                        {partyOrder.map(party => (
                          <option
                            key={party}
                            value={party}
                            disabled={party === partyA}
                          >
                            {PARTIES[party].name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-800">Handicap on transferred votes</label>
                      <span className="text-sm font-mono text-gray-700">{handicap}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={handicap}
                      onChange={(e) => setHandicap(Number(e.target.value))}
                      className="w-full h-2 mt-2"
                    />
                    <p className="text-xs text-gray-800 mt-2">
                      The supporting party sends {(100 - handicap)}% of its votes to the stronger ally in each riding they both contest.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  {allianceConfig?.enabled && (
                    <button
                      onClick={handleClear}
                      className="flex items-center gap-2 px-3 py-2 border border-neutral rounded-lg text-sm text-gray-700 hover:bg-neutral/70 transition-colors"
                    >
                      <Slash className="w-4 h-4" />
                      Disable
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm bg-neutral text-gray-200 hover:bg-neutral/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canSave
                        ? 'bg-gradient-to-r from-nc to-rsp text-white hover:opacity-90'
                        : 'bg-neutral text-gray-800 cursor-not-allowed'
                    }`}
                  >
                    Save alliance
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

export default AllianceModal;
