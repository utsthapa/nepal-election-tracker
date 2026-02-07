'use client';

import { ELECTIONS, getElectionYears } from '../data/historicalElections';
import { Clock, TrendingUp } from 'lucide-react';

export default function YearSelector({ selectedYear, onYearChange }) {
  const years = [...getElectionYears().sort((a, b) => b - a), 2026];
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {selectedYear === 2026 ? (
          <TrendingUp className="w-4 h-4 text-blue-400" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        <span className="font-medium">Select Election Year:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {years.map(year => {
          const election = ELECTIONS[year];
          const isSimulation = year === 2026;
          
          return (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedYear === year
                  ? isSimulation
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-surface border-2 border-blue-500 text-white shadow-lg scale-105'
                  : isSimulation
                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20'
                    : 'bg-surface border border-neutral text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
            >
              {isSimulation ? `${year} (Simulation)` : year}
            </button>
          );
        })}
      </div>
      
      {selectedYear !== 2026 && ELECTIONS[selectedYear] && (
        <div className="text-xs text-gray-500 ml-2">
          <span className="font-medium">{ELECTIONS[selectedYear].name}</span>
          {' • '}
          {ELECTIONS[selectedYear].date}
        </div>
      )}
    </div>
  );
}
