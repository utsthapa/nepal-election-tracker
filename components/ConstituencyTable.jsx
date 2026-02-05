import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Filter, Search, Users } from 'lucide-react';
import { PARTIES, PROVINCES } from '../data/constituencies';
import { AgeDistributionMini } from './DemographicsPanel';
import { getConstituencyDemographics, getYouthIndex } from '../utils/demographicUtils';

export function ConstituencyTable({ fptpResults, overrides, onSelectConstituency }) {
  const [sortBy, setSortBy] = useState('margin'); // 'margin', 'name', 'province', 'winner'
  const [sortAsc, setSortAsc] = useState(true);
  const [filterProvince, setFilterProvince] = useState(null);
  const [filterWinner, setFilterWinner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => {
    let data = Object.values(fptpResults);

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
  }, [fptpResults, sortBy, sortAsc, filterProvince, filterWinner, searchTerm]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
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
            <h2 className="text-lg font-outfit font-semibold text-white">
              FPTP Constituencies
            </h2>
            <p className="text-xs text-gray-500 font-mono">
              165 seats • Sorted by margin (closest races first)
            </p>
          </div>
          <span className="text-sm font-mono text-gray-400">
            {results.length} results
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search constituency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral border border-neutral rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Province Filter */}
          <select
            value={filterProvince || ''}
            onChange={(e) => setFilterProvince(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 bg-neutral border border-neutral rounded-lg text-sm text-gray-200 focus:outline-none focus:border-gray-500"
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
            className="px-3 py-2 bg-neutral border border-neutral rounded-lg text-sm text-gray-200 focus:outline-none focus:border-gray-500"
          >
            <option value="">All Parties</option>
            {Object.entries(PARTIES).map(([id, party]) => (
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Constituency
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200"
                onClick={() => handleSort('province')}
              >
                <div className="flex items-center gap-1">
                  Province
                  <SortIcon column="province" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200"
                onClick={() => handleSort('winner')}
              >
                <div className="flex items-center gap-1">
                  Winner
                  <SortIcon column="winner" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200"
                onClick={() => handleSort('margin')}
              >
                <div className="flex items-center justify-end gap-1">
                  Margin
                  <SortIcon column="margin" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vote Share
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                        <span className="text-amber-400 text-xs">⚡</span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-200">{result.name}</p>
                        <p className="text-xs text-gray-500">{result.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-400">
                      {PROVINCES[result.province]?.name || `P${result.province}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${bgColors[result.winner]}`} />
                      <span className={`text-sm font-medium ${textColors[result.winner]}`}>
                        {getPartyLabel(result.winner)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-mono ${
                      result.margin < 0.03 ? 'text-amber-400' :
                      result.margin < 0.05 ? 'text-yellow-400' :
                      'text-gray-400'
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
          <span className="text-gray-500">Parties:</span>
          {Object.entries(PARTIES).map(([id, party]) => (
            <div key={id} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${bgColors[id]}`} />
              <span className="text-gray-400">{getPartyLabel(id)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="text-amber-400">⚡</span> Manual override
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400">●</span> Margin &lt; 3%
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">●</span> Margin 3-5%
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> Age Distribution:
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> 0-14
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400"></span> 15-29
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> 30-44
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span> 45-59
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span> 60+
          </span>
        </div>
      </div>
    </div>
  );
}

export default ConstituencyTable;
