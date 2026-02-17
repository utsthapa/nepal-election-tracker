import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Users } from 'lucide-react';
import { useState, useMemo } from 'react';

import { AgeDistributionMini } from './DemographicsPanel';
import { PARTIES, PROVINCES, constituencies } from '../data/constituencies';

export function ConstituencyTable({ fptpResults, overrides, onSelectConstituency }) {
  const constituenciesData = useMemo(() => {
    const data = {};
    constituencies.forEach(c => {
      data[c.id] = c;
    });
    return data;
  }, []);
  const [sortBy, setSortBy] = useState('margin'); // 'margin', 'name', 'province', 'winner'
  const [sortAsc, setSortAsc] = useState(true);
  const [filterProvince, setFilterProvince] = useState(null);
  const [filterWinner, setFilterWinner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

const results = useMemo(() => {
    let data = Object.values(fptpResults).map(result => {
      const constituency = constituenciesData[result.id];
      return {
        ...result,
        winner2022: constituency?.winner2022,
        results2022: constituency?.results2022,
        margin2022: constituency?.margin,
      };
    });

    // Filter by province
    if (filterProvince) {
      data = data.filter(r => r.province === filterProvince);
    }

    // Filter by winner
    if (filterWinner) {
      data = data.filter(r => r.winner === filterWinner);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.district.toLowerCase().includes(term)
      );
    }

    // Sort
    data.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'margin':
          comparison = a.margin - b.margin;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'province':
          comparison = a.province - b.province;
          break;
        case 'winner':
          comparison = a.winner.localeCompare(b.winner);
          break;
        default:
          comparison = a.margin - b.margin;
      }
      return sortAsc ? comparison : -comparison;
    });

    return data;
  }, [fptpResults, constituenciesData, sortBy, sortAsc, filterProvince, filterWinner, searchTerm]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {return null;}
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // Dynamic color classes
  const bgColors = {};
  const textColors = {};
  Object.keys(PARTIES).forEach(p => {
    bgColors[p] = `bg-${p.toLowerCase()}`;
    textColors[p] = `text-${p.toLowerCase()}`;
  });

  const getPartyLabel = (partyId) => {
    const party = PARTIES[partyId];
    return party ? `${party.short} (${party.name})` : partyId;
  };

  return (
    <div className="bg-surface rounded-xl border border-neutral overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-sans font-semibold text-foreground">
              FPTP Constituencies
            </h2>
            <p className="text-xs text-muted font-mono">
              165 seats • Sorted by margin (closest races first)
            </p>
          </div>
          <span className="text-sm font-mono text-muted">
            {results.length} results
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search constituency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface border border-neutral rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:border-foreground"
            />
          </div>

          {/* Province Filter */}
          <select
            value={filterProvince || ''}
            onChange={(e) => setFilterProvince(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 bg-surface border border-neutral rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground"
          >
            <option value="">All Provinces</option>
            {Object.entries(PROVINCES).map(([id, prov]) => (
              <option key={id} value={id}>{prov.name}</option>
            ))}
          </select>

          {/* Winner Filter */}
          <select
            value={filterWinner || ''}
            onChange={(e) => setFilterWinner(e.target.value || null)}
            className="px-3 py-2 bg-surface border border-neutral rounded-lg text-sm text-foreground focus:outline-none focus:border-foreground"
          >
            <option value="">All Parties</option>
            {Object.entries(PARTIES).map(([id, _party]) => (
              <option key={id} value={id}>{getPartyLabel(id)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[600px] overflow-y-auto">
        <table className="w-full">
      <thead className="bg-neutral/50 sticky top-0">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Constituency
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('province')}
              >
                <div className="flex items-center gap-1">
                  Province
                  <SortIcon column="province" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                2022 Winner
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                2022 Margin
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('winner')}
              >
                <div className="flex items-center gap-1">
                  Sim. Winner
                  <SortIcon column="winner" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground"
                onClick={() => handleSort('margin')}
              >
                <div className="flex items-center justify-end gap-1">
                  Sim. Margin
                  <SortIcon column="margin" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                Vote Share
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Age
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral">
            <AnimatePresence>
              {results.map((result, index) => (
<motion.tr
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.01 }}
                  onClick={() => onSelectConstituency(result.id)}
                  className={`hover:bg-neutral/50 cursor-pointer transition-colors ${
                    overrides[result.id] ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {overrides[result.id] && (
                        <span className="text-others text-xs">⚡</span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{result.name}</p>
                        <p className="text-xs text-muted">{result.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted">
                      {PROVINCES[result.province]?.name || `P${result.province}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {result.winner2022 && (
                        <>
                          <div className={`w-3 h-3 rounded-full ${bgColors[result.winner2022]}`} />
                          <span className={`text-sm font-medium ${textColors[result.winner2022]}`}>
                            {getPartyLabel(result.winner2022)}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-mono text-muted`}>
                      {result.margin2022 ? (result.margin2022 * 100).toFixed(2) + '%' : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${bgColors[result.winner]}`} />
                      <span className={`text-sm font-medium ${textColors[result.winner]}`}>
                        {getPartyLabel(result.winner)}
                      </span>
                      {result.winner !== result.winner2022 && (
                        <span className="text-xs text-others">→</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-mono ${
                      result.margin < 0.03 ? 'text-others' :
                      result.margin < 0.05 ? 'text-yellow-600' :
                      'text-muted'
                    }`}>
                      {(result.margin * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <div className="w-32 h-2 bg-neutral rounded-full overflow-hidden flex">
                        {Object.entries(result.adjusted || {})
                          .sort((a, b) => b[1] - a[1])
                          .map(([party, share]) => (
                            <div
                              key={party}
                              className={bgColors[party]}
                              style={{ width: `${share * 100}%` }}
                            />
                          ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <AgeDistributionMini constituencyId={result.id} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-neutral bg-neutral/30">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-muted">Parties:</span>
          {Object.entries(PARTIES).map(([id, _party]) => (
            <div key={id} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${bgColors[id]}`} />
              <span className="text-muted">{getPartyLabel(id)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="text-others">⚡</span> Manual override
          </span>
          <span className="flex items-center gap-1">
            <span className="text-others">●</span> Margin &lt; 3%
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-600">●</span> Margin 3-5%
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> Age Distribution:
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 0-14
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-600"></span> 15-29
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-600"></span> 30-44
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span> 45-59
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span> 60+
          </span>
        </div>
      </div>
    </div>
  );
}

export default ConstituencyTable;
