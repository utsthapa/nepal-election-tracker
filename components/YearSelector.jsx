'use client';

import { Clock, TrendingUp, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { memo } from 'react';

import { getAvailableYears, getCompleteYears } from '../data/historicalConstituencies';
import { ELECTIONS, getElectionYears } from '../data/historicalElections';

function YearSelector({ selectedYear, onYearChange }) {
  const years = [2026, ...getElectionYears().filter(y => y !== 2026).sort((a, b) => b - a)];
  const availableYears = getAvailableYears();
  const completeYears = getCompleteYears();
  
  // Data availability status for each year
  const getDataStatus = (year) => {
    if (year === 2026) {return { status: 'simulation', label: 'Simulation' };}
    if (!availableYears.includes(year)) {return { status: 'unavailable', label: 'No Data' };}
    if (completeYears.includes(year)) {return { status: 'complete', label: 'Complete' };}
    return { status: 'partial', label: 'Partial' };
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        {selectedYear === 2026 ? (
          <TrendingUp className="w-4 h-4 text-blue-400" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
        <span className="font-medium">Select Election Year:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {years.map(year => {
          const isSimulation = year === 2026;
          const dataStatus = getDataStatus(year);
          
          return (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              disabled={dataStatus.status === 'unavailable'}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all relative ${
                selectedYear === year
                  ? isSimulation
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-surface border-2 border-blue-500 text-gray-900 shadow-lg scale-105'
                    : isSimulation
                    ? 'bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200'
                    : dataStatus.status === 'unavailable'
                      ? 'bg-neutral/30 text-gray-600 border border-neutral/50 cursor-not-allowed opacity-50'
                      : dataStatus.status === 'partial'
                        ? 'bg-surface border border-amber-500/50 text-amber-700 hover:border-amber-500 hover:text-amber-800'
                        : 'bg-surface border border-neutral text-gray-700 hover:border-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {year}
                {dataStatus.status === 'complete' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                )}
                {dataStatus.status === 'partial' && (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                {dataStatus.status === 'unavailable' && (
                  <Database className="w-3.5 h-3.5 text-gray-500" />
                )}
              </span>
              {isSimulation && (
                <span className="block text-[10px] opacity-70">Simulation</span>
              )}
              {!isSimulation && dataStatus.status !== 'complete' && (
                <span className="block text-[10px] opacity-70">{dataStatus.label}</span>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedYear !== 2026 && ELECTIONS[selectedYear] && (
        <div className="text-xs text-gray-800 ml-2">
          <span className="font-medium">{ELECTIONS[selectedYear].name}</span>
          {' • '}
          {ELECTIONS[selectedYear].date}
        </div>
      )}
    </div>
  );
}

export default memo(YearSelector);
