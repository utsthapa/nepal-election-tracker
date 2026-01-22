import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FACTOR_MODES } from '../data/modes';

export function FactorModes({ activeModes, onToggleMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = activeModes.size;

  return (
    <div className="bg-surface rounded-2xl border border-neutral overflow-hidden shadow-2xl shadow-black/30">
      <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-6 ${isOpen ? 'border-b border-neutral/70' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-rsp/50 to-blue-500/10 border border-blue-400/40 text-2xl flex items-center justify-center shadow-inner shadow-blue-500/30">
            ⚡
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500">Scenario Lab</p>
            <h2 className="text-xl font-semibold text-white">Political Factors</h2>
            <p className="text-sm text-gray-400 mt-1">
              Stack these pulses before moving the sliders to stress-test the map.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-gray-300">
                {activeCount} active | additive &amp; auto-normalized
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-white/10 text-emerald-200">
                Applies to FPTP + PR
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-3 rounded-xl border border-neutral bg-neutral/60 shadow-lg shadow-black/40">
            <p className="text-3xl font-semibold text-white leading-none">{activeCount}</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mt-1">Active factors</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? 'Hide factors' : 'Show factors'}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="factor-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {Object.values(FACTOR_MODES).map((mode) => (
                <FactorModeCard
                  key={mode.id}
                  mode={mode}
                  isActive={activeModes.has(mode.id)}
                  onToggle={() => onToggleMode(mode.id)}
                />
              ))}
            </div>

            <div className="px-6 pb-5">
              <AnimatePresence initial={false}>
                {activeCount > 0 ? (
                  <motion.div
                    key="active-stack"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3"
                  >
                    <span className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.12em]">Active stack</span>
                    {Array.from(activeModes).map((modeId) => (
                      <span
                        key={modeId}
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/15 bg-white/5 flex items-center gap-2"
                        style={{ boxShadow: `0 8px 24px -14px ${FACTOR_MODES[modeId].color}` }}
                      >
                        <span className="text-base leading-none">{FACTOR_MODES[modeId].icon}</span>
                        {FACTOR_MODES[modeId].name}
                      </span>
                    ))}
                    <span className="text-[11px] text-gray-400">Tap a card again to remove it.</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-stack"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-xl border border-dashed border-neutral/80 bg-neutral/30 px-4 py-3 text-sm text-gray-400"
                  >
                    No factors toggled yet. Start with one to see how the map reacts.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactorModeCard({ mode, isActive, onToggle }) {
  const accent = mode.color;
  const softAccent = `${accent}22`;
  const glowAccent = `${accent}55`;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      className="relative text-left overflow-hidden rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        borderColor: isActive ? `${accent}80` : 'rgba(148, 163, 184, 0.35)',
        background: `radial-gradient(circle at 18% 10%, ${softAccent}, transparent 35%), radial-gradient(circle at 85% 0%, ${softAccent}, transparent 30%)`,
        boxShadow: isActive ? `0 16px 44px -22px ${glowAccent}` : 'none',
      }}
    >
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${softAccent}, transparent 55%)` }}
      />

      <div className="relative flex flex-col gap-3 p-4 h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none drop-shadow">{mode.icon}</span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-mono">Factor</p>
              <p className="text-base font-semibold text-white">{mode.name}</p>
              <p className="text-xs text-gray-400">{mode.description}</p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${isActive
              ? 'bg-white/15 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-gray-300'
            }`}
          >
            {isActive ? 'Active' : 'Add'}
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed min-h-[48px]">
          {mode.explanation}
        </p>

        <div className="space-y-2">
          {Object.entries(mode.effects).map(([party, effect]) => (
            <EffectRow key={party} party={party} effect={effect} />
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
          <span>Stacks with other modes</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            <span className="h-2 w-2 rounded-full bg-rose-400/80" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </span>
        </div>
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      )}
    </motion.button>
  );
}

function EffectRow({ party, effect }) {
  const width = Math.min(Math.abs(effect) * 10, 100);
  const isPositive = effect > 0;
  const barColor = isPositive ? 'bg-emerald-400/90' : 'bg-rose-500/90';
  const textColor = isPositive ? 'text-emerald-200' : 'text-rose-200';

  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-[11px] tracking-wide text-gray-400 font-mono">{party}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`${barColor} h-full`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>
        {isPositive ? '+' : ''}{effect}%
      </span>
    </div>
  );
}

export default FactorModes;
