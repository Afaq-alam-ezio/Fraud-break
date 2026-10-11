import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import TransactionList from '../components/TransactionList.jsx';
import useTransactionFeed from '../useTransactionFeed';

const PATH = '/api/v1/getTransactionsForUser'; // the endpoint that returns the logged-in user's transactions
const POLL_MS = 3000;
const MAX_POLLS = 40; // about 2 minutes of checking, then stop and let the person press Refresh

export default function MyTransactionsPage() {
  const { rows, error, justScored, load } = useTransactionFeed(PATH);
  const [polls, setPolls] = useState(0);

  // First load.
  useEffect(() => {
    load();
  }, [load]);

  // While something is Pending, check again every few seconds.
  const hasPending = rows?.some((r) => r.status === 'PENDING') ?? false;
  const gaveUp = hasPending && polls >= MAX_POLLS;
  useEffect(() => {
    if (!hasPending || polls >= MAX_POLLS) return undefined;
    const id = setTimeout(() => {
      setPolls((p) => p + 1);
      load();
    }, POLL_MS);
    return () => clearTimeout(id);
  }, [hasPending, polls, rows, load]);

  function refresh() {
    setPolls(0);
    load();
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto box-content max-w-6xl px-3 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">My transactions</h1>
            <p className="mt-2 text-white/70">Newest first. Each one is scored a few seconds after you send it.</p>
          </div>
          <button type="button" onClick={refresh} className="btn-ghost">
            Refresh
          </button>
        </div>

        <div role="status" className="mt-4 min-h-6 text-sm text-white/70">
          {hasPending && !gaveUp && 'Checking for results every few seconds…'}
          {gaveUp && 'Some transactions are still pending. Press Refresh to check again.'}
        </div>

        {error && (
          <p role="alert" className="mt-2 border-l-2 border-coral pl-3 text-sm text-coral">
            {error}
          </p>
        )}

        {rows === null && !error && <p className="mt-8 text-white/70">Loading your transactions…</p>}

        {rows?.length === 0 && !error && (
          <div className="glass mt-6 border-dashed px-6 py-10">
            <p className="font-display text-xl font-semibold">No transactions yet</p>
            <p className="mt-1 text-white/70">Send one and its result will show up here.</p>
            <Link to="/submit" className="btn-primary mt-5 inline-block w-auto text-center">
              Send a transaction
            </Link>
          </div>
        )}

        {rows?.length > 0 && (
          <div className="mt-4">
            <TransactionList rows={rows} justScored={justScored} />
          </div>
        )}
      </main>
    </div>
  );
}
