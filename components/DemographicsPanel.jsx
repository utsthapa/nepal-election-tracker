'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import {
  getConstituencyDemographics,
  formatAgeDataForChart,
  getVotingAgeBreakdown,
  getYouthIndex,
  getDependencyRatio,
  compareToNationalAverage,
  getAgeGroupColor
} from '../utils/demographicUtils';
import { AGE_GROUP_LABELS } from '../data/demographics';

// Age pyramid bar component
function AgeBar({ group, label, percentage, population, isHighlighted, comparison }) {
  const color = getAgeGroupColor(group);
  // Scale bar width: max age group is typically ~35%, so scale to show relative proportions
  // Using 40% as the max reference to make bars visually comparable
  const maxPercentage = 40;
  const barWidth = Math.min((percentage / maxPercentage) * 100, 100);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-700 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-700">{percentage.toFixed(2)}%</span>
          {comparison && (
            <span className={`text-[10px] font-mono ${
              comparison.status === 'above' ? 'text-green-400' :
              comparison.status === 'below' ? 'text-red-400' :
              'text-gray-800'
            }`}>
              {comparison.difference > 0 ? '+' : ''}{(comparison.difference * 100).toFixed(2)}%
            </span>
          )}
        </div>
      </div>
      <div className="relative h-6 bg-neutral/50 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded"
          style={{ backgroundColor: color }}
        />
        {/* National average marker */}
        {comparison && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/40"
            style={{ left: `${(comparison.national * 100 / maxPercentage) * 100}%` }}
            title={`National avg: ${(comparison.national * 100).toFixed(2)}%`}
          />
        )}
        {population && (
          <span className="absolute inset-0 flex items-center justify-end pr-2 text-[10px] font-mono text-foreground/80">
            {population.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <div className="bg-neutral/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded ${colorClasses[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs text-gray-700">{label}</span>
      </div>
      <div className="text-lg font-bold font-mono text-white">{value}</div>
      {subValue && (
        <div className="text-[10px] text-gray-800 font-mono">{subValue}</div>
      )}
    </div>
  );
}

// Main component
export function DemographicsPanel({ constituencyId, constituencyName }) {
  const demographics = getConstituencyDemographics(constituencyId);

  if (!demographics) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-neutral">
        <div className="flex items-center gap-2 text-gray-700">
          <Info className="w-4 h-4" />
          <span className="text-sm">Demographic data not available for this constituency</span>
        </div>
      </div>
    );
  }

  const ageChartData = formatAgeDataForChart(demographics.ageGroups, demographics.estimatedPopulation);
  const votingBreakdown = getVotingAgeBreakdown(demographics.estimatedPopulation, demographics.ageGroups);
  const youthIndex = getYouthIndex(demographics.ageGroups);
  const dependencyRatio = getDependencyRatio(demographics.ageGroups);
  const comparison = compareToNationalAverage(demographics.ageGroups);

  return (
    <div className="bg-surface rounded-xl p-6 border border-neutral">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-sans font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Demographics
          </h2>
          <p className="text-xs text-gray-800 mt-1">
            {constituencyName || constituencyId} • {demographics.district} District
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
            demographics.confidence === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {demographics.confidence === 'high' ? 'District match' : 'Estimated'}
          </span>
        </div>
      </div>

      {/* Population Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Users}
          label="Population (2021)"
          value={demographics.estimatedPopulation.toLocaleString()}
          subValue={`M: ${demographics.male.toLocaleString()} | F: ${demographics.female.toLocaleString()}`}
          color="blue"
        />
        <StatCard
          icon={UserCheck}
          label="Voting Age (18+)"
          value={votingBreakdown.totalVotingAge.toLocaleString()}
          subValue={`${((votingBreakdown.totalVotingAge / demographics.estimatedPopulation) * 100).toFixed(2)}% of population`}
          color="green"
        />
      </div>

      {/* Age Distribution */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Age Distribution</h3>
          <span className="text-[10px] text-gray-800">
            White line = Nepal avg
          </span>
        </div>
        <div className="space-y-2">
          {ageChartData.map((data) => (
            <AgeBar
              key={data.group}
              group={data.group}
              label={data.label}
              percentage={data.percentage}
              population={data.population}
              comparison={comparison[data.group]}
            />
          ))}
        </div>
      </div>

      {/* Age Indices */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-neutral/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold font-mono text-green-400">
            {(youthIndex * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] text-gray-800">Youth Index</div>
          <div className="text-[9px] text-gray-600">(Under 30)</div>
        </div>
        <div className="bg-neutral/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold font-mono text-yellow-400">
            {demographics.medianAge}
          </div>
          <div className="text-[10px] text-gray-800">Median Age</div>
          <div className="text-[9px] text-gray-600">(years)</div>
        </div>
        <div className="bg-neutral/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold font-mono text-purple-400">
            {(dependencyRatio * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-gray-800">Dependency</div>
          <div className="text-[9px] text-gray-600">(0-14 + 60+)</div>
        </div>
      </div>

      {/* Voting Age Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Voter Age Groups</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between bg-neutral/20 rounded px-3 py-2">
            <span className="text-xs text-gray-700">Young (18-29)</span>
            <span className="text-sm font-mono text-green-400">
              {votingBreakdown.youngVoters.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between bg-neutral/20 rounded px-3 py-2">
            <span className="text-xs text-gray-700">Prime (30-44)</span>
            <span className="text-sm font-mono text-yellow-400">
              {votingBreakdown.primeAge.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between bg-neutral/20 rounded px-3 py-2">
            <span className="text-xs text-gray-700">Middle (45-59)</span>
            <span className="text-sm font-mono text-orange-400">
              {votingBreakdown.middleAge.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between bg-neutral/20 rounded px-3 py-2">
            <span className="text-xs text-gray-700">Senior (60+)</span>
            <span className="text-sm font-mono text-red-400">
              {votingBreakdown.seniors.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-800">Literacy Rate</span>
          <span className="text-sm font-mono text-white">
            {(demographics.literacyRate * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-800">Urban Population</span>
          <span className="text-sm font-mono text-white">
            {(demographics.urbanPopulation * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Data Source */}
      <div className="mt-4 pt-3 border-t border-neutral/50">
        <p className="text-[10px] text-gray-600 italic">
          {demographics.dataSource}. Constituency estimates derived from district-level census data.
        </p>
      </div>
    </div>
  );
}

// Compact version for use in cards/tables
export function DemographicsCompact({ constituencyId }) {
  const demographics = getConstituencyDemographics(constituencyId);

  if (!demographics) return null;

  const youthIndex = getYouthIndex(demographics.ageGroups);

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1">
        <Users className="w-3 h-3 text-gray-800" />
        <span className="font-mono text-gray-700">
          {(demographics.estimatedPopulation / 1000).toFixed(0)}k
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-600">Youth:</span>
        <span className={`font-mono ${youthIndex > 0.55 ? 'text-green-400' : 'text-gray-700'}`}>
          {(youthIndex * 100).toFixed(0)}%
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-gray-600">Med:</span>
        <span className="font-mono text-gray-700">{demographics.medianAge}y</span>
      </div>
    </div>
  );
}

// Mini visualization for inline use
export function AgeDistributionMini({ constituencyId }) {
  const demographics = getConstituencyDemographics(constituencyId);

  if (!demographics) return null;

  return (
    <div className="flex h-4 rounded overflow-hidden bg-neutral/30 w-32">
      {Object.entries(demographics.ageGroups).map(([group, percentage]) => (
        <div
          key={group}
          style={{
            width: `${percentage * 100}%`,
            backgroundColor: getAgeGroupColor(group)
          }}
          title={`${AGE_GROUP_LABELS[group]}: ${(percentage * 100).toFixed(2)}%`}
        />
      ))}
    </div>
  );
}

export default DemographicsPanel;
