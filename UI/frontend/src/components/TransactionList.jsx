import { formatClock, formatDay, rupees, toDate } from '../format';

const STAMP = {
  PENDING: 'border-dashed border-amber bg-amber/10 text-amber',
  CLEAN: 'border-mint bg-mint/10 text-mint -rotate-3',
  SUSPICIOUS: 'border-coral bg-coral/10 text-coral -rotate-6',
};
const LABEL = { PENDING: 'Pending', CLEAN: 'Clean', SUSPICIOUS: 'Suspicious' };

// Full class names, written out, so Tailwind can see them.
const COLUMNS = 'sm:grid-cols-[5.5rem_minmax(0,1fr)_6.5rem_3.5rem_7rem]';
const COLUMNS_WITH_USER = 'sm:grid-cols-[5.5rem_minmax(0,1.2fr)_minmax(0,1fr)_6.5rem_3.5rem_7rem]';

// A frosted statement. `rows` is already sorted. `justScored` holds the ids of rows that went from
// Pending to a result while you were watching: their stamp lands. `showUser` adds the user's email (analyst view).
export default function TransactionList({ rows, justScored, showUser = false }) {
  const columns = showUser ? COLUMNS_WITH_USER : COLUMNS;

  return (
    <div className="glass overflow-hidden">
      <div className={`hidden gap-x-4 border-b border-white/15 px-5 py-2.5 text-xs text-white/65 sm:grid ${columns}`}>
        <span>Time</span>
        <span>Payment</span>
        {showUser && <span>User</span>}
        <span className="text-right">Amount</span>
        <span className="text-right">Score</span>
        <span className="text-right">Status</span>
      </div>

      <ol>
        {rows.map((r) => {
          const when = toDate(r.timestamp);
          const landed = justScored.has(r.id);
          const pending = r.status === 'PENDING';
          const email = r.user?.email ?? 'Unknown user';

          return (
            <li
              key={r.id}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-1 border-b border-white/10 px-5 py-4 last:border-b-0 ${columns}`}
            >
              <span className="hidden sm:block">
                <span className="block text-sm tabular-nums">{when ? formatClock(when) : ''}</span>
                <span className="block text-xs text-white/60">{when ? formatDay(when) : ''}</span>
              </span>

              <span className="min-w-0">
                <span className="block font-medium">{r.merchantCategory}</span>
                <span className="block truncate text-sm text-white/65">
                  {r.location}, {r.deviceId}
                </span>
                {showUser && <span className="block truncate text-xs text-white/60 sm:hidden">{email}</span>}
                {when && (
                  <span className="block text-xs text-white/60 sm:hidden">
                    {formatDay(when)}, {formatClock(when)}
                  </span>
                )}
              </span>

              {showUser && <span className="hidden min-w-0 truncate text-sm text-white/80 sm:block">{email}</span>}

              <span className="text-right tabular-nums">{rupees.format(Number(r.amount))}</span>

              <span className={`hidden text-right tabular-nums sm:block ${pending ? 'text-sm text-amber' : ''}`}>
                {pending ? 'Scoring' : r.riskScore}
              </span>

              <span className="flex justify-end">
                <span
                  className={`inline-block rounded-md border-2 px-2 py-0.5 font-display text-sm font-semibold ${
                    STAMP[r.status] ?? 'border-white/30 text-white/70'
                  } ${landed ? 'stamp-in' : ''}`}
                  style={landed ? { animationDelay: '0ms' } : undefined}
                >
                  {LABEL[r.status] ?? r.status}
                </span>
              </span>

              {r.status === 'SUSPICIOUS' && r.aiExplanation && (
                <p className="col-span-full mt-2 border-l-2 border-coral pl-3 text-sm text-white/75">{r.aiExplanation}</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
