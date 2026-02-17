import { ArrowLeft, Trophy, Info } from 'lucide-react';
import Link from 'next/link';

import { SimpleHeader } from '../../../components/SimpleHeader';
import { ELECTIONS, getPartyInfo } from '../../../data/historicalElections';

// Generate static params for all election years
export function generateStaticParams() {
  return Object.keys(ELECTIONS).map((year) => ({
    year: year,
  }));
}

// Generate metadata for each election year
export function generateMetadata({ params }) {
  const year = parseInt(params.year, 10);
  const election = ELECTIONS[year];
  
  if (!election) {
    return {
      title: 'Election Not Found',
    };
  }
  
  return {
    title: `${election.name} | Elections`,
    description: `Election results for ${election.name}. Total seats: ${election.totalSeats}, Turnout: ${election.turnout || 'N/A'}`,
  };
}

export default function ElectionYearPage({ params }) {
  const year = parseInt(params.year, 10);
  const election = ELECTIONS[year];

  if (!election) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/elections"
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Elections
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Not Found</h1>
            <p className="text-gray-700">No election data available for {year}</p>
          </div>
        </main>
      </div>
    );
  }

  // Sort parties by total seats
  const sortedParties = Object.entries(election.results.Total)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, seats]) => seats > 0);

  const hasFPTP = election.fptpSeats > 0;
  const hasPR = election.prSeats > 0;
  const hasNominated = election.nominatedSeats > 0;
  const isCA = election.type.includes('Constituent');

  // Calculate majority threshold
  const majorityThreshold = Math.floor(election.totalSeats / 2) + 1;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/elections"
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Elections
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{election.name}</h1>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                isCA
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}
            >
              {election.type}
            </span>
          </div>
          <p className="text-gray-700">{election.date}</p>
          {election.notes && (
            <p className="text-gray-700 mt-2 max-w-3xl">{election.notes}</p>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-surface border border-neutral rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">
              Total Seats
            </p>
            <p className="text-2xl font-bold text-gray-900">{election.totalSeats}</p>
          </div>
          {hasFPTP && (
            <div className="bg-surface border border-neutral rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">
                FPTP Seats
              </p>
              <p className="text-2xl font-bold text-gray-900">{election.fptpSeats}</p>
            </div>
          )}
          {hasPR && (
            <div className="bg-surface border border-neutral rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">
                PR Seats
              </p>
              <p className="text-2xl font-bold text-gray-900">{election.prSeats}</p>
              {election.prThreshold > 0 && (
                <p className="text-xs text-gray-600">{election.prThreshold}% threshold</p>
              )}
            </div>
          )}
          {hasNominated && (
            <div className="bg-surface border border-neutral rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">
                Nominated
              </p>
              <p className="text-2xl font-bold text-gray-900">{election.nominatedSeats}</p>
            </div>
          )}
          <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-amber-800 mb-1">
              Majority
            </p>
            <p className="text-2xl font-bold text-amber-900">{majorityThreshold}</p>
          </div>
          {election.turnout && (
            <div className="bg-surface border border-neutral rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-gray-600 mb-1">
                Turnout
              </p>
              <p className="text-2xl font-bold text-gray-900">{election.turnout}</p>
            </div>
          )}
        </div>

        {/* Government formed */}
        {election.government && (
          <div className="bg-surface border border-nc/30 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-nc mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-nc mb-1">
                  Government Formed
                </p>
                <p className="text-gray-700">{election.government}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-surface border border-neutral rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-neutral">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Official Seat Distribution
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral bg-neutral/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Party
                  </th>
                  {hasFPTP && (
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
                      FPTP
                    </th>
                  )}
                  {hasPR && (
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
                      PR
                    </th>
                  )}
                  {hasNominated && (
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Nominated
                    </th>
                  )}
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral">
                {sortedParties.map(([party, total]) => {
                  const info = getPartyInfo(party);
                  const fptp = election.results.FPTP?.[party] || 0;
                  const pr = election.results.PR?.[party] || 0;
                  const nominated = election.results.Nominated?.[party] || 0;
                  const share = ((total / election.totalSeats) * 100).toFixed(2);
                  const hasMajority = total >= majorityThreshold;

                  return (
                    <tr key={party} className={`hover:bg-neutral/20 ${hasMajority ? 'bg-amber-500/5' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: info.color }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{info.short}</p>
                            <p className="text-xs text-gray-600">{info.name}</p>
                          </div>
                          {hasMajority && (
                            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                              Majority
                            </span>
                          )}
                        </div>
                      </td>
                      {hasFPTP && (
                        <td className="text-center px-4 py-4 font-mono text-gray-900">
                          {fptp || '-'}
                        </td>
                      )}
                      {hasPR && (
                        <td className="text-center px-4 py-4 font-mono text-gray-900">
                          {pr || '-'}
                        </td>
                      )}
                      {hasNominated && (
                        <td className="text-center px-4 py-4 font-mono text-gray-900">
                          {nominated || '-'}
                        </td>
                      )}
                      <td className="text-center px-4 py-4 font-mono font-bold text-gray-900">
                        {total}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-neutral rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${share}%`,
                                backgroundColor: info.color,
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono text-gray-700">
                            {share}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-neutral/30 border-t border-neutral">
                  <td className="px-6 py-3 font-semibold text-gray-900">Total</td>
                  {hasFPTP && (
                    <td className="text-center px-4 py-3 font-mono font-bold text-gray-900">
                      {election.fptpSeats}
                    </td>
                  )}
                  {hasPR && (
                    <td className="text-center px-4 py-3 font-mono font-bold text-gray-900">
                      {election.prSeats}
                    </td>
                  )}
                  {hasNominated && (
                    <td className="text-center px-4 py-3 font-mono font-bold text-gray-900">
                      {election.nominatedSeats}
                    </td>
                  )}
                  <td className="text-center px-4 py-3 font-mono font-bold text-gray-900">
                    {election.totalSeats}
                  </td>
                  <td className="px-6 py-3 font-mono text-gray-700">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Visual seat distribution */}
        <div className="bg-surface border border-neutral rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parliament Composition
          </h2>
          <div className="space-y-3">
            {sortedParties.map(([party, total]) => {
              const info = getPartyInfo(party);
              const width = (total / election.totalSeats) * 100;

              return (
                <div key={party} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {info.short}
                  </div>
                  <div className="flex-1 h-8 bg-neutral rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all flex items-center justify-end pr-2"
                      style={{
                        width: `${width}%`,
                        backgroundColor: info.color,
                      }}
                    >
                      {width > 8 && (
                        <span className="text-xs font-bold text-white drop-shadow">
                          {total}
                        </span>
                      )}
                    </div>
                    {width <= 8 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-700">
                        {total}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Majority line */}
          <div className="mt-6 pt-4 border-t border-neutral">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-amber-400" />
                <span>Majority threshold: {majorityThreshold} seats</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
