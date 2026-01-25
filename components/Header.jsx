import { motion } from 'framer-motion';
import { Vote, RotateCcw, Target } from 'lucide-react';
import Link from 'next/link';
import { PARTIES } from '../data/constituencies';

export function Header({ totalSeats, leadingParty, hasMajority, onReset }) {
  const partyColors = {};
  Object.keys(PARTIES).forEach(p => {
    partyColors[p] = `text-${p.toLowerCase()}`;
  });

  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short} (${info.name})` : partyId;
  };

  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-neutral sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="p-2 bg-gradient-to-br from-nc/20 to-uml/20 rounded-lg"
            >
              <Vote className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-outfit font-bold text-white tracking-tight">
                  Nepal Election Simulator
                </h1>
              </Link>
              <p className="text-sm text-gray-400 font-mono">
                165 FPTP + 110 PR = 275 Seats
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/elections"
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-neutral/60 rounded-lg transition-colors"
            >
              Elections
            </Link>
            <Link
              href="/districts"
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-neutral/60 rounded-lg transition-colors"
            >
              Districts
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            {/* Leading Party Indicator */}
            {leadingParty && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-right"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">Leading</p>
                <p className={`text-lg font-bold ${partyColors[leadingParty] || 'text-white'}`}>
                  {formatPartyLabel(leadingParty)}
                </p>
                <p className="text-sm font-mono text-gray-400">
                  {totalSeats[leadingParty]} seats
                </p>
              </motion.div>
            )}

            {/* Majority Status */}
            <div className="flex items-center gap-2">
              <Target
                className={`w-5 h-5 ${hasMajority ? 'text-green-400' : 'text-gray-500'}`}
              />
              <span className={`text-sm font-medium ${hasMajority ? 'text-green-400' : 'text-gray-500'}`}>
                {hasMajority ? 'Majority' : 'Hung Parliament'}
              </span>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-neutral hover:bg-neutral/80 rounded-lg text-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reset</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
