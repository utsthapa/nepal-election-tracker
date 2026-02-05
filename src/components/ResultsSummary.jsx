import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PARTIES, INITIAL_NATIONAL, ACTUAL_2022_SEATS } from '../data/constituencies';

const partyOrder = Object.keys(INITIAL_NATIONAL);

// Use actual 2022 results from data
const BASELINE_SEATS = ACTUAL_2022_SEATS.Total;

export function ResultsSummary({ fptpSeats, prSeats, totalSeats, fptpSliders, prSliders, adjustedFptpSliders, adjustedPrSliders }) {
  // Dynamic color classes
  const bgColors = {};
  const textColors = {};
  const borderColors = {};
  Object.keys(PARTIES).forEach(p => {
    bgColors[p] = `bg-${p.toLowerCase()}`;
    textColors[p] = `text-${p.toLowerCase()}`;
    borderColors[p] = `border-${p.toLowerCase()}`;
  });

  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      <h2 className="text-lg font-outfit font-semibold text-white mb-1">
        Results Summary
      </h2>
      <p className="text-xs text-gray-500 mb-4 font-mono">
        Compared to 2022 actual results
      </p>

      <div className="grid gap-3">
        {partyOrder.map((party, index) => {
          const fptp = fptpSeats[party] || 0;
          const pr = prSeats[party] || 0;
          const total = totalSeats[party] || 0;
          const baseline = BASELINE_SEATS[party];
          const change = total - baseline;
          const fptpVoteChange = (adjustedFptpSliders || fptpSliders)[party] - INITIAL_NATIONAL[party];
          const prVoteChange = (adjustedPrSliders || prSliders)[party] - INITIAL_NATIONAL[party];

          return (
            <motion.div
              key={party}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg bg-neutral/30 border-l-4 ${borderColors[party]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${bgColors[party]}`} />
                  <span className="font-medium text-gray-200">
                    {PARTIES[party].name}
                  </span>
                </div>
                <motion.span
                  key={total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={`text-2xl font-bold font-mono ${textColors[party]}`}
                >
                  {total}
                </motion.span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4 text-gray-400 font-mono">
                  <span>FPTP: {fptp}</span>
                  <span>PR: {pr}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Seat change indicator */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    change > 0 ? 'bg-green-500/20 text-green-400' :
                    change < 0 ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : change < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    <span>{change > 0 ? '+' : ''}{change}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Row */}
      <div className="mt-4 pt-4 border-t border-neutral">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Seats</span>
          <span className="text-xl font-bold font-mono text-white">
            {Object.values(totalSeats).reduce((a, b) => a + b, 0)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1 text-sm">
          <span className="text-gray-500">FPTP + PR</span>
          <span className="font-mono text-gray-400">
            {Object.values(fptpSeats).reduce((a, b) => a + b, 0)} + {Object.values(prSeats).reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResultsSummary;
