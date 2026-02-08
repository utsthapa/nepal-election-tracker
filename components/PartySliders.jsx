import { motion } from 'framer-motion';
import { PARTIES, INITIAL_NATIONAL } from '../data/constituencies';

const partyOrder = Object.keys(INITIAL_NATIONAL);

export function PartySliders({
  title = "Vote Share",
  subtitle = "Adjust sliders to simulate vote shifts",
  sliders,
  fptpSeats,
  prSeats,
  totalSeats,
  onSliderChange,
  showFptp = false,
  showPr = false,
}) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      <h2 className="text-lg font-sans font-semibold text-foreground mb-1">
        {title}
      </h2>
      <p className="text-xs text-muted mb-4 font-mono">
        {subtitle}
      </p>

      <div className="space-y-3">
        {partyOrder.map((party, index) => (
          <PartySlider
            key={party}
            party={party}
            value={sliders[party]}
            fptpSeats={fptpSeats[party] || 0}
            prSeats={prSeats[party] || 0}
            totalSeats={totalSeats[party] || 0}
            onChange={(value) => onSliderChange(party, value)}
            delay={index * 0.03}
            showFptp={showFptp}
            showPr={showPr}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Total</span>
          <span className="font-mono text-foreground">
            {Object.values(sliders).reduce((a, b) => a + b, 0).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function PartySlider({ party, value, fptpSeats, prSeats, totalSeats, onChange, delay, showFptp, showPr }) {
  const partyInfo = PARTIES[party];
  const colorClass = `slider-${party.toLowerCase()}`;
  const fillPercent = Math.max(0, Math.min(100, value ?? 0));

  // Dynamic color classes
  const bgColors = {};
  const textColors = {};
  Object.keys(PARTIES).forEach(p => {
    bgColors[p] = `bg-${p.toLowerCase()}`;
    textColors[p] = `text-${p.toLowerCase()}`;
  });

  // Show relevant seat count based on slider type
  const relevantSeats = showFptp ? fptpSeats : showPr ? prSeats : totalSeats;
  const seatLabel = showFptp ? 'FPTP' : showPr ? 'PR' : 'Total';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${bgColors[party]}`} />
          <div className="leading-tight">
            <span className="block text-xs font-medium text-foreground">
              {partyInfo.short}
            </span>
            <span className="block text-[11px] text-muted">
              {partyInfo.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm font-bold ${textColors[party]}`}>
            {(value ?? 0).toFixed(2)}%
          </span>
          <motion.span
            key={relevantSeats}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`font-mono text-xs ${textColors[party]}`}
          >
            {seatLabel}: {relevantSeats}
          </motion.span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`w-full h-1.5 ${colorClass}`}
          style={{
            background: `linear-gradient(to right, ${partyInfo.color} 0%, ${partyInfo.color} ${fillPercent}%, #1e293b ${fillPercent}%, #1e293b 100%)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default PartySliders;
