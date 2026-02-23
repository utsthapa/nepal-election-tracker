'use client';

import surnames2022 from '../data/surnames2022.json';

const BAR_COLOR = '#B91C1C';

export default function CandidateSurnameChart() {
  const { total_candidates, unique_surnames, surnames } = surnames2022;
  const maxCount = surnames[0]?.count || 1;

  const repeated = surnames.filter(w => w.count > 1);
  const singles  = surnames.filter(w => w.count === 1);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-sm font-semibold text-[rgb(24,26,36)]">Candidate Surnames (2022)</p>
      </div>
      <p className="text-xs text-[rgb(100,110,130)] mb-3">
        All <span className="font-medium text-[rgb(24,26,36)]">{total_candidates.toLocaleString()} candidates</span> from the official 2022 ECN filing · {unique_surnames} unique surnames
      </p>

      <div className="overflow-hidden rounded-lg border border-[rgb(219,211,196)] mb-3">
        <div className="grid grid-cols-[1fr_1fr_32px] gap-x-3 bg-[rgb(250,249,246)] px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)]">
          <span>Surname</span>
          <span>Frequency</span>
          <span className="text-right">#</span>
        </div>
        <div className="divide-y divide-[rgb(219,211,196)] max-h-96 overflow-y-auto">
          {repeated.map(({ name, count }) => {
            const pct = (count / maxCount) * 100;
            return (
              <div
                key={name}
                className="grid grid-cols-[1fr_1fr_32px] gap-x-3 items-center px-4 py-1.5"
              >
                <span className="text-sm font-medium text-[rgb(24,26,36)]">{name}</span>
                <div className="h-4 rounded bg-[rgb(244,238,229)] overflow-hidden">
                  <div
                    className="h-full rounded"
                    style={{ width: `${pct}%`, backgroundColor: BAR_COLOR, opacity: 0.6 + (pct / 100) * 0.4 }}
                  />
                </div>
                <span className="text-right text-sm font-bold tabular-nums" style={{ color: BAR_COLOR }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-[rgb(219,211,196)] bg-[rgb(250,249,246)] px-4 py-3">
        <p className="text-xs font-semibold tracking-wider uppercase text-[rgb(100,110,130)] mb-2">
          Appearing once ({singles.length} surnames)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {singles.map(({ name }) => (
            <span
              key={name}
              className="px-2 py-0.5 rounded text-xs text-[rgb(24,26,36)] bg-white border border-[rgb(219,211,196)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
