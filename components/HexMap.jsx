import { motion } from 'framer-motion';
import { useState } from 'react';
import { constituencies, PARTIES } from '../data/constituencies';

const HEX_SIZE = 28;
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3);

// Dynamic party colors
const partyColors = {};
const partyBgColors = {};
Object.keys(PARTIES).forEach(p => {
  partyColors[p] = PARTIES[p].color;
  partyBgColors[p] = `bg-${p.toLowerCase()}`;
});

const formatPartyLabel = (partyId) => {
  const info = PARTIES[partyId];
  return info ? `${info.short} (${info.name})` : partyId;
};

export function HexMap({ fptpResults, overrides, onSelectConstituency }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  // Calculate bounds for positioning
  const positions = constituencies.map(c => c.hexPosition);
  const minQ = Math.min(...positions.map(p => p.q));
  const maxQ = Math.max(...positions.map(p => p.q));
  const minR = Math.min(...positions.map(p => p.r));
  const maxR = Math.max(...positions.map(p => p.r));

  const gridWidth = (maxQ - minQ + 2) * HEX_WIDTH * 0.75 + HEX_WIDTH;
  const gridHeight = (maxR - minR + 2) * HEX_HEIGHT + HEX_HEIGHT;

  const getHexPosition = (q, r) => {
    const x = (q - minQ) * HEX_WIDTH * 0.75 + HEX_SIZE;
    const y = (r - minR) * HEX_HEIGHT + (q % 2 === 1 ? HEX_HEIGHT / 2 : 0) + HEX_SIZE;
    return { x, y };
  };

  const hoveredResult = hoveredId ? fptpResults[hoveredId] : null;

  return (
    <div className="relative bg-surface rounded-xl p-4 border border-neutral overflow-hidden">
      <h2 className="text-lg font-sans font-semibold text-white mb-1">
        FPTP Constituencies
      </h2>
      <p className="text-xs text-gray-800 mb-4 font-mono">
        165 seats • Click to override • Hover for details
      </p>

      <div
        className="relative overflow-auto max-h-[500px]"
        style={{ minWidth: gridWidth, minHeight: gridHeight }}
        onMouseMove={handleMouseMove}
      >
        <svg
          width={gridWidth}
          height={gridHeight}
          viewBox={`0 0 ${gridWidth} ${gridHeight}`}
          className="mx-auto"
        >
          {constituencies.map((constituency, index) => {
            const result = fptpResults[constituency.id];
            const winner = result?.winner || 'Others';
            const isOverridden = !!overrides[constituency.id];
            const pos = getHexPosition(constituency.hexPosition.q, constituency.hexPosition.r);

            return (
              <motion.g
                key={constituency.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.008,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <Hexagon
                  x={pos.x}
                  y={pos.y}
                  size={HEX_SIZE - 2}
                  fill={partyColors[winner]}
                  isOverridden={isOverridden}
                  isHovered={hoveredId === constituency.id}
                  onClick={() => onSelectConstituency(constituency.id)}
                  onMouseEnter={() => setHoveredId(constituency.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 bg-surface border border-neutral rounded-lg p-3 shadow-xl pointer-events-none"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y + 15,
          }}
        >
          <p className="text-sm font-semibold text-white">{hoveredResult.name}</p>
          <p className="text-xs text-gray-700 mb-2">
            {hoveredResult.district}, Province {hoveredResult.province}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${partyBgColors[hoveredResult.winner]}`} />
            <span className="text-sm font-medium text-white">
              {formatPartyLabel(hoveredResult.winner)}
            </span>
            <span className="text-xs font-mono text-gray-700">
              {(hoveredResult.share * 100).toFixed(2)}%
            </span>
          </div>
          <p className="text-xs font-mono text-gray-800">
            Margin: {(hoveredResult.margin * 100).toFixed(2)}%
          </p>
          {hoveredResult.isOverridden && (
            <p className="text-xs text-amber-400 mt-1">⚡ Manual Override</p>
          )}
        </motion.div>
      )}

      {/* Province Legend */}
      <div className="mt-4 pt-4 border-t border-neutral">
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(partyColors).map(([party, color]) => (
            <div key={party} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-700">{party}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hexagon({ x, y, size, fill, isOverridden, isHovered, onClick, onMouseEnter, onMouseLeave }) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
  }

  return (
    <polygon
      points={points.join(' ')}
      fill={fill}
      stroke={isOverridden ? '#fbbf24' : isHovered ? '#ffffff' : '#1e293b'}
      strokeWidth={isOverridden ? 2 : isHovered ? 2 : 1}
      opacity={isHovered ? 1 : 0.85}
      style={{
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        filter: isHovered ? 'brightness(1.2)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

export default HexMap;
