import { useCallback, useRef, useState } from 'react';
import { ApiError } from './api';
import { useAuth } from './auth';
import { toDate } from './format';

const time = (r) => toDate(r.timestamp)?.getTime() ?? 0;
const newestFirst = (list) => [...list].sort((a, b) => time(b) - time(a) || b.id - a.id);

function messageFor(err, forbidden) {
  if (!(err instanceof ApiError)) return 'Something went wrong. Try again.';
  if (err.status === 0) return "Can't reach the server. Check that the backend is running on port 8080.";
  if (err.status === 403) return forbidden;
  return 'The server had a problem. Try again in a moment.';
}

// Loads a list of transactions from `path` with the logged-in token.
// Gives back the rows (newest first), an error message, the load() function, when it last worked,
// and the ids of rows that went from Pending to a result since the last load (their stamp lands).
export default function useTransactionFeed(path, { forbidden = "This account can't view transactions." } = {}) {
  const { authFetch } = useAuth();
  const [rows, setRows] = useState(null); // null = first load not finished yet
  const [error, setError] = useState('');
  const [justScored, setJustScored] = useState(() => new Set());
  const [updatedAt, setUpdatedAt] = useState(null);
  const lastStatus = useRef(new Map()); // id -> status we saw last time

  const load = useCallback(async () => {
    try {
      const data = await authFetch(path);
      const list = newestFirst(Array.isArray(data) ? data : []);

      const flipped = new Set();
      for (const r of list) {
        if (lastStatus.current.get(r.id) === 'PENDING' && r.status !== 'PENDING') flipped.add(r.id);
      }
      lastStatus.current = new Map(list.map((r) => [r.id, r.status]));

      setJustScored(flipped);
      setRows(list);
      setUpdatedAt(new Date());
      setError('');
    } catch (err) {
      setError(messageFor(err, forbidden)); // a 401 logs you out and sends you to the login page by itself
    }
  }, [authFetch, path, forbidden]);

  return { rows, error, justScored, updatedAt, load };
}
