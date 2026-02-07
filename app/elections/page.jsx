'use client';

import Link from 'next/link';
import { Calendar, Trophy, Users, TrendingUp } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ELECTIONS, getElectionYears, getPartyInfo } from '../../data/historicalElections';

export default function ElectionsPage() {
  const electionYears = getElectionYears();

  const getWinner = (election) => {
    const totals = election.results.Total;
    let maxSeats = 0;
    let winner = null;
    Object.entries(totals).forEach(([party, seats]) => {
      if (seats > maxSeats) {
        maxSeats = seats;
        winner = party;
      }
    });
    return { party: winner, seats: maxSeats };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Elections</h1>
          <p className="text-muted">
            Historical election results from Nepal&apos;s parliamentary and constituent assembly elections (1991-2022)
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral hidden md:block" />

          <div className="space-y-6">
            {electionYears.map((year) => {
              const election = ELECTIONS[year];
              const winner = getWinner(election);
              const winnerInfo = getPartyInfo(winner.party);
              const isCA = election.type.includes('Constituent');

              return (
                <Link
                  key={year}
                  href={`/elections/${year}`}
                  className="group block"
                >
                  <div className="flex gap-6">
                    {/* Year marker */}
                    <div className="hidden md:flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all group-hover:scale-110"
                        style={{
                          borderColor: winnerInfo.color,
                          backgroundColor: `${winnerInfo.color}20`,
                          color: winnerInfo.color,
                        }}
                      >
                        {year}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-surface border border-neutral rounded-lg p-6 group-hover:border-nc/50 transition-all">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="md:hidden text-2xl font-bold"
                              style={{ color: winnerInfo.color }}
                            >
                              {year}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                isCA
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {isCA ? 'Constituent Assembly' : 'General Election'}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-foreground group-hover:text-nc transition-colors">
                            {election.name}
                          </h2>
                          <p className="text-sm text-muted mt-1">{election.date}</p>
                          {election.notes && (
                            <p className="text-sm text-muted mt-2 max-w-xl">
                              {election.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {/* Winner */}
                          <div className="bg-neutral/50 rounded-lg px-4 py-3 min-w-[120px]">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-muted">Winner</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: winnerInfo.color }}
                              />
                              <span
                                className="font-bold"
                                style={{ color: winnerInfo.color }}
                              >
                                {winnerInfo.short}
                              </span>
                              <span className="text-sm text-muted font-mono">
                                {winner.seats}
                              </span>
                            </div>
                          </div>

                          {/* Total seats */}
                          <div className="bg-neutral/50 rounded-lg px-4 py-3 min-w-[100px]">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-muted" />
                              <span className="text-xs text-muted">Seats</span>
                            </div>
                            <p className="font-bold text-foreground">{election.totalSeats}</p>
                          </div>

                          {/* Turnout */}
                          {election.turnout && (
                            <div className="bg-neutral/50 rounded-lg px-4 py-3 min-w-[100px]">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-muted" />
                                <span className="text-xs text-muted">Turnout</span>
                              </div>
                              <p className="font-bold text-foreground">{election.turnout}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Seat distribution preview */}
                      <div className="mt-4 pt-4 border-t border-neutral">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted">Seat Distribution</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden flex">
                          {Object.entries(election.results.Total)
                            .sort((a, b) => b[1] - a[1])
                            .map(([party, seats]) => {
                              const info = getPartyInfo(party);
                              const width = (seats / election.totalSeats) * 100;
                              if (width < 1) return null;
                              return (
                                <div
                                  key={party}
                                  className="h-full transition-all"
                                  style={{
                                    width: `${width}%`,
                                    backgroundColor: info.color,
                                  }}
                                  title={`${info.short}: ${seats} seats`}
                                />
                              );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {Object.entries(election.results.Total)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([party, seats]) => {
                              const info = getPartyInfo(party);
                              return (
                                <div key={party} className="flex items-center gap-1 text-xs">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: info.color }}
                                  />
                                  <span className="text-muted">{info.short}:</span>
                                  <span className="text-foreground font-mono">{seats}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="text-sm text-nc group-hover:underline">
                          View detailed results →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
