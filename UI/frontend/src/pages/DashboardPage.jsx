import { useEffect, useMemo, useState } from 'react';
import AppHeader from '../components/AppHeader.jsx';
import TransactionList from '../components/TransactionList.jsx';
import { formatClock } from '../format';
import useTransactionFeed from '../useTransactionFeed';

const PATH = '/api/v1/transactions'; // analyst only: every user's transactions
const POLL_MS = 5000;
const SHOW_MAX = 200; // the list shows the latest 200, so the page stays fast

// The four cards are also the filters. Suspicious comes first because it is what an analyst checks first.
const FILTERS = [
  { id: 'SUSPICIOUS', label: 'Suspicious', tone: 'text-coral', empty: 'No suspicious transactions right now.' },
  { id: 'PENDING', label: 'Pending', tone: 'text-amber', empty: 'Nothing is waiting to be scored.' },
  { id: 'CLEAN', label: 'Clean', tone: 'text-mint', empty: 'No clean transactions yet.' },
  { id: 'ALL', label: 'All transactions', tone: 'text-white', empty: 'No transactions yet.' },
];

export default function DashboardPage() {
  const { rows, error, justScored, updatedAt, load } = useTransactionFeed(PATH, {
    forbidden: "This account can't view all transactions.",
  });
  const [filter, setFilter] = useState('SUSPICIOUS');

  // First load, then every few seconds while this browser tab is visible.
  useEffect(() => {
    load();
    const tick = () => {
      if (document.visibilityState === 'visible') load();
    };
    const id = setInterval(tick, POLL_MS);
    document.addEventListener('visibilitychange', tick); // catch up as soon as you come back to the tab
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [load]);

  const counts = useMemo(() => {
    const c = { SUSPICIOUS: 0, PENDING: 0, CLEAN: 0, ALL: rows?.length ?? 0 };
    for (const r of rows ?? []) if (r.status in c) c[r.status] += 1;
    return c;
  }, [rows]);

  const shown = useMemo(
    () => (rows ?? []).filter((r) => filter === 'ALL' || r.status === filter),
    [rows, filter],
  );
  const active = FILTERS.find((f) => f.id === filter);
  const number = (n) => n.toLocaleString('en-IN');

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto box-content max-w-6xl px-3 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Analyst dashboard</h1>
            <p className="mt-2 text-white/70">Every user's transactions, newest first. This page updates every few seconds.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            {updatedAt && <span>Updated {formatClock(updatedAt)}</span>}
            <button type="button" onClick={load} className="btn-ghost text-white">
              Refresh
            </button>
          </div>
        </div>

        <div role="group" aria-label="Filter by status" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`glass p-4 text-left transition ${
                filter === f.id ? 'bg-white/10 ring-2 ring-white/70' : 'hover:bg-white/10'
              }`}
            >
              <span className={`block font-display text-4xl font-semibold tabular-nums ${f.tone}`}>
                {rows ? number(counts[f.id]) : '–'}
              </span>
              <span className="mt-1 block text-sm text-white/75">{f.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-6 border-l-2 border-coral pl-3 text-sm text-coral">
            {error}
          </p>
        )}

        {rows === null && !error && <p className="mt-8 text-white/70">Loading transactions…</p>}

        {rows && shown.length === 0 && (
          <div className="glass mt-6 border-dashed px-6 py-10">
            <p className="font-display text-xl font-semibold">{active.empty}</p>
          </div>
        )}

        {shown.length > 0 && (
          <div className="mt-6">
            <TransactionList rows={shown.slice(0, SHOW_MAX)} justScored={justScored} showUser />
            {shown.length > SHOW_MAX && (
              <p className="mt-3 text-sm text-white/70">
                Showing the latest {SHOW_MAX} of {number(shown.length)}.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
