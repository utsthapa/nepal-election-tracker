import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { PARTIES, INITIAL_NATIONAL, ACTUAL_2022_SEATS } from '../data/constituencies';

const partyOrder = Object.keys(INITIAL_NATIONAL);
const BASELINE_SEATS = ACTUAL_2022_SEATS.Total;

export function ResultsSummary({ fptpSeats, prSeats, totalSeats }) {
  const formatPartyLabel = (partyId) => {
    const info = PARTIES[partyId];
    return info ? `${info.short}` : partyId;
  };

  const getPartyColor = (partyId) => PARTIES[partyId]?.color || '#6b7280';

  // Memoize expensive pie chart data calculations
  const fptpData = useMemo(() => {
    return partyOrder
      .map((party) => ({
        name: formatPartyLabel(party),
        fullName: PARTIES[party]?.name || party,
        value: fptpSeats[party] || 0,
        partyId: party,
        color: getPartyColor(party),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [fptpSeats]);

  const prData = useMemo(() => {
    return partyOrder
      .map((party) => ({
        name: formatPartyLabel(party),
        fullName: PARTIES[party]?.name || party,
        value: prSeats[party] || 0,
        partyId: party,
        color: getPartyColor(party),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [prSeats]);

      const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-neutral rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium text-sm mb-1">{data.fullName}</p>
          <p className="text-muted text-xs font-mono">{data.value} seats</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 px-2 py-1 bg-neutral/30 rounded-full hover:bg-neutral/50 transition-colors cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-foreground font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-sans font-semibold text-foreground">
          Results Summary
        </h2>
        <p className="text-xs text-muted font-mono">
          Compared to 2022 actual results
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral/30 rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">FPTP Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fptpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {fptpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <CustomLegend payload={fptpData.map((d) => ({ value: d.name, color: d.color }))} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-neutral/30 rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">PR Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {prData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <CustomLegend payload={prData.map((d) => ({ value: d.name, color: d.color }))} />
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 px-3 pb-2 border-b border-neutral/50 text-xs font-mono text-muted">
            <div className="w-[25%]">Party</div>
            <div className="w-[12%] text-center">FPTP</div>
            <div className="w-[12%] text-center">PR</div>
            <div className="w-[12%] text-center">2022</div>
            <div className="w-[12%] text-center">Total</div>
            <div className="w-[27%] text-center">Change</div>
          </div>

          {partyOrder.map((party, index) => {
            const fptp = fptpSeats[party] || 0;
            const pr = prSeats[party] || 0;
            const total = totalSeats[party] || 0;
            const baseline = BASELINE_SEATS[party] || 0;
            const change = total - baseline;

            return (
              <motion.div
                key={party}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex gap-2 px-3 py-2 rounded-lg hover:bg-neutral/30 transition-colors items-center"
              >
                <div className="w-[25%] flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getPartyColor(party) }}
                  />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatPartyLabel(party)}
                  </span>
                </div>
                <div className="w-[12%] text-center">
                  <span className="text-xs font-mono text-muted">{fptp}</span>
                </div>
                <div className="w-[12%] text-center">
                  <span className="text-xs font-mono text-muted">{pr}</span>
                </div>
                 <div className="w-[12%] text-center">
                  <span className="text-xs font-mono text-muted">{baseline}</span>
                </div>
                <div className="w-[12%] text-center">
                  <motion.span
                    key={total}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-bold font-mono"
                    style={{ color: getPartyColor(party) }}
                  >
                    {total}
                  </motion.span>
                </div>
                <div className="w-[27%] text-center">
                  <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
                    change > 0 ? 'bg-green-500/20 text-green-600' :
                    change < 0 ? 'bg-red-500/20 text-red-600' :
                    'bg-neutral/20 text-muted'
                  }`}>
                    {change > 0 ? <TrendingUp className="w-3 h-3" /> :
                     change < 0 ? <TrendingDown className="w-3 h-3" /> :
                     <Minus className="w-3 h-3" />}
                    <span>{change > 0 ? '+' : ''}{change}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral">
        <div className="flex items-center justify-between">
          <span className="text-muted text-sm">Total Seats</span>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-foreground">
              {Object.values(totalSeats).reduce((a, b) => a + b, 0)}
            </span>
            <span className="text-sm text-muted ml-2">
              ({Object.values(fptpSeats).reduce((a, b) => a + b, 0)} FPTP + {Object.values(prSeats).reduce((a, b) => a + b, 0)} PR)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsSummary;
