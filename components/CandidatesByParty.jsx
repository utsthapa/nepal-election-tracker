import React from 'react';
import { getPartyColor } from '../utils/election2026Data';
import { PARTIES } from '../data/constituencies';

export const CandidatesByParty = ({ election2026Data }) => {
  if (!election2026Data || !election2026Data.parties || election2026Data.parties.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[rgb(219,211,196)] bg-white/60 backdrop-blur-md shadow-sm p-4 relative overflow-hidden transition-all duration-300">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none" />

      <h3 className="text-lg font-bold text-[rgb(24,26,36)] mb-4 flex items-center gap-2 relative z-10">
        <span className="w-1.5 h-6 bg-[#B91C1C] rounded-full inline-block"></span>
        2026 Candidates by Party
      </h3>

      <div className="overflow-x-auto relative z-10">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-[minmax(120px,1.5fr)_80px_100px_160px_80px] gap-x-4 px-4 py-3 bg-[rgb(250,249,246)]/80 rounded-t-lg text-xs font-bold tracking-wider uppercase text-[rgb(100,110,130)] border-b border-[rgb(219,211,196)]">
            <span>Party</span>
            <span className="text-right">Seats</span>
            <span className="text-right">Leader</span>
            <span className="text-center">Gender Split</span>
            <span className="text-right">Women %</span>
          </div>

          {/* List Body */}
          <div className="divide-y divide-[rgb(219,211,196)]/60 bg-white/40 rounded-b-lg">
            {election2026Data.parties.map((party, index) => {
              const male = party.male_candidates || 0;
              const female = party.female_candidates || 0;
              const total = male + female;
              const femalePct = total > 0 ? (female / total) * 100 : 0;
              const color = getPartyColor(party.name);

              // Get standard party info if available
              const partyInfo =
                PARTIES[party.abbreviation] ||
                Object.values(PARTIES).find(p => p.short === party.abbreviation);

              return (
                <div
                  key={`${party.abbreviation}-${index}`}
                  className="grid grid-cols-[minmax(120px,1.5fr)_80px_100px_160px_80px] gap-x-4 items-center px-4 py-3 hover:bg-[rgb(250,249,246)] transition-colors duration-200 group"
                >
                  {/* Party Name & Color */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="shrink-0 w-3 h-3 rounded-full shadow-sm ring-2 ring-white transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[rgb(24,26,36)] truncate text-sm">
                        {party.name}
                      </span>
                    </div>
                  </div>

                  {/* Seats Contested */}
                  <span className="text-right font-medium text-[rgb(24,26,36)] text-sm">
                    {total}
                  </span>

                  {/* Leader */}
                  <span
                    className="text-right text-xs font-medium text-[rgb(100,110,130)] truncate transition-colors duration-200 group-hover:text-[rgb(24,26,36)]"
                    title={party.leader}
                  >
                    {party.leader?.split(' ').slice(-1)[0]}
                  </span>

                  {/* Gender Split Visual */}
                  <div className="flex flex-col justify-center gap-1.5 px-2">
                    <div className="flex justify-between items-end text-[10px] font-medium leading-none px-0.5">
                      <span className="text-[rgb(100,110,130)]">
                        <span className="text-[rgb(24,26,36)]">{male}</span> M
                      </span>
                      <span className="text-[rgb(100,110,130)]">
                        <span style={{ color: femalePct > 0 ? color : 'inherit' }}>{female}</span> F
                      </span>
                    </div>
                    {/* The Bar */}
                    <div className="h-2.5 w-full rounded-full bg-[rgb(240,236,228)] overflow-hidden shadow-inner flex relative">
                      {/* Male (Gray) section */}
                      <div
                        className="h-full bg-[rgb(200,205,215)] transition-all duration-500 ease-out"
                        style={{ width: `${100 - femalePct}%` }}
                      />
                      {/* Female (Colored) section */}
                      <div
                        className="h-full transition-all duration-500 ease-out relative"
                        style={{
                          width: `${femalePct}%`,
                          backgroundColor: color,
                          // subtle gradient or shine
                          backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
                        }}
                      >
                        {/* Shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>

                  {/* Women Percentage Badge */}
                  <div className="flex justify-end">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        femalePct >= 33
                          ? 'bg-green-100/80 text-green-700 border border-green-200 shadow-sm'
                          : femalePct >= 10
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-[rgb(240,236,228)] text-[rgb(100,110,130)] border border-transparent group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-100'
                      }`}
                    >
                      {femalePct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesByParty;
