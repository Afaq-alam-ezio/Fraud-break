import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError } from '../api';
import { useAuth } from '../auth';
import AppHeader from '../components/AppHeader.jsx';
import { rupees } from '../format';

const CATEGORIES = ['Grocery', 'Electronics', 'Travel', 'Fuel', 'Dining', 'Utilities', 'Fashion', 'Entertainment'];
const CITY_KEY = 'fraudbreak.city';
const DEVICE_KEY = 'fraudbreak.device';

// City and device are remembered between sends, so you only change them when you want to.
function remembered(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
function remember(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage not available, no problem
  }
}

function messageFor(err) {
  if (!(err instanceof ApiError)) return 'Something went wrong. Try again.';
  if (err.status === 0) return "Can't reach the server. Check that the backend is running on port 8080.";
  if (err.status === 403) return "This account can't send transactions.";
  if (err.status === 400) return 'The server rejected these details. Check the amount and that no field is empty.';
  return 'The server had a problem. Try again in a moment.';
}

export default function SubmitPage() {
  const { authFetch } = useAuth();
  const amountRef = useRef(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState(() => remembered(CITY_KEY, 'Pune'));
  const [device, setDevice] = useState(() => remembered(DEVICE_KEY, 'Dell laptop'));
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null); // what we just sent, for the confirmation line
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSent(null);

    const cleanAmount = amount.replace(/,/g, '').trim(); // "1,240.50" is fine
    const value = Number(cleanAmount);
    if (!/^\d+(\.\d{1,2})?$/.test(cleanAmount) || value <= 0) {
      setError('Enter an amount greater than 0, with up to 2 decimals.');
      amountRef.current?.focus();
      return;
    }
    const body = {
      amount: value,
      merchantCategory: category.trim(),
      location: city.trim(),
      deviceId: device.trim(),
    };
    if (!body.merchantCategory || !body.location || !body.deviceId) {
      setError('Fill in the merchant category, city and device.');
      return;
    }

    setBusy(true);
    try {
      await authFetch('/kafka/create', { method: 'POST', body });
      remember(CITY_KEY, body.location);
      remember(DEVICE_KEY, body.deviceId);
      setSent({ amount: value, category: body.merchantCategory, city: body.location });
      setAmount('');
      amountRef.current?.focus(); // ready for the next one
    } catch (err) {
      setError(messageFor(err)); // a 401 logs you out and sends you to the login page by itself
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto box-content max-w-6xl px-3 py-8 sm:px-6">
        <form onSubmit={handleSubmit} noValidate className="glass max-w-xl space-y-6 px-6 py-7 sm:px-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Send a transaction</h1>
            <p className="mt-2 text-white/70">
              It is scored a few seconds after you send it. To see one flagged, send four within a minute.
            </p>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <div className="mt-1 flex items-baseline gap-2 border-b-2 border-white/50">
              <span aria-hidden="true" className="font-display text-3xl text-white/60">
                ₹
              </span>
              <input
                id="amount"
                ref={amountRef}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent py-2 font-display text-4xl font-semibold tabular-nums placeholder:text-white/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Merchant category
            </label>
            <input
              id="category"
              list="categories"
              autoComplete="off"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field"
            />
            <datalist id="categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-sm font-medium">
                City
              </label>
              <input
                id="city"
                autoComplete="off"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="device" className="block text-sm font-medium">
                Device
              </label>
              <input
                id="device"
                autoComplete="off"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="field"
              />
              <p className="mt-1 text-sm text-white/65">Brand and model, like Samsung S23.</p>
            </div>
          </div>

          <div className="min-h-12 text-sm">
            {error && (
              <p role="alert" className="border-l-2 border-coral pl-3 text-coral">
                {error}
              </p>
            )}
            {sent && (
              <p role="status" className="border-l-2 border-mint pl-3">
                <span className="font-semibold text-mint">Transaction sent.</span> {rupees.format(sent.amount)} for{' '}
                {sent.category} in {sent.city}. It is being checked now.{' '}
                <Link to="/my-transactions" className="font-semibold underline underline-offset-2">
                  See the result
                </Link>
              </p>
            )}
          </div>

          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? 'Sending…' : 'Send transaction'}
          </button>
        </form>
      </main>
    </div>
  );
}
