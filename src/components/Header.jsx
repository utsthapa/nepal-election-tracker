import { motion } from 'framer-motion';
import { Vote, RotateCcw, Target } from 'lucide-react';

export function Header({ totalSeats, leadingParty, hasMajority, onReset }) {
  const partyColors = {
    NC: 'text-nc',
    UML: 'text-uml',
    Maoist: 'text-maoist',
    RSP: 'text-rsp',
    Others: 'text-others',
  };

  const partyNames = {
    NC: 'Nepali Congress',
    UML: 'CPN-UML',
    Maoist: 'CPN-Maoist',
    RSP: 'RSP',
    Others: 'Others',
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
              <Vote className="w-8 h-8 text-foreground" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-sans font-bold text-foreground tracking-tight">
                Nepal Election Simulator
              </h1>
              <p className="text-sm text-muted font-mono">
                165 FPTP + 110 PR = 275 Seats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Leading Party Indicator */}
            {leadingParty && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-right"
              >
                <p className="text-xs text-muted uppercase tracking-wider">Leading</p>
                <p className={`text-lg font-bold ${partyColors[leadingParty]}`}>
                  {partyNames[leadingParty]}
                </p>
                <p className="text-sm font-mono text-muted">
                  {totalSeats[leadingParty]} seats
                </p>
              </motion.div>
            )}

            {/* Majority Status */}
            <div className="flex items-center gap-2">
              <Target
                className={`w-5 h-5 ${hasMajority ? 'text-nc' : 'text-muted'}`}
              />
              <span className={`text-sm font-medium ${hasMajority ? 'text-nc' : 'text-muted'}`}>
                {hasMajority ? 'Majority' : 'Hung Parliament'}
              </span>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-neutral hover:bg-neutral/80 rounded-lg text-foreground transition-colors"
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
