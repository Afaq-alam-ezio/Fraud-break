import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ApiError, apiFetch } from '../api';
import { homeFor, useAuth } from '../auth';
import Ledger from '../components/Ledger.jsx';

const MIN_PASSWORD = 4; // same as the @Size(min = ...) on CredDTO in the backend

const tabs = [
  { id: 'login', label: 'Log in' },
  { id: 'signup', label: 'Create account' },
];

function validate(email, password) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  if (password.length < MIN_PASSWORD) return `Use a password of at least ${MIN_PASSWORD} characters.`;
  return '';
}

function messageFor(err) {
  if (!(err instanceof ApiError)) return 'Something went wrong. Try again.';
  if (err.status === 0) return "Can't reach the server. Check that the backend is running on port 8080.";
  if (err.status === 401) return 'Email or password is incorrect.';
  if (err.status === 409) return 'An account with this email already exists. Log in instead.';
  if (err.status === 400) return `Check the email format and use a password of at least ${MIN_PASSWORD} characters.`;
  return 'The server had a problem. Try again in a moment.';
}

export default function AuthPage() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Already logged in? Go straight to your page.
  if (auth) return <Navigate to={homeFor(auth.role)} replace />;

  const isLogin = mode === 'login';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const problem = validate(cleanEmail, password);
    if (problem) {
      setError(problem);
      return;
    }

    setBusy(true);
    try {
      const data = await apiFetch(isLogin ? '/api/v1/login' : '/api/v1/signup', {
        method: 'POST',
        body: { email: cleanEmail, password },
      });
      if (!data?.token || !data?.role) {
        setError('The server did not send a token and role. Check the login response.');
        return;
      }
      login({ token: data.token, role: data.role, email: cleanEmail });
      navigate(homeFor(data.role), { replace: true });
    } catch (err) {
      setError(messageFor(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <span className="flex items-center gap-2 font-display text-2xl font-semibold">
          <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="9" cy="9" r="6.5" fill="none" stroke="#ff8f80" strokeWidth="2.5" />
          </svg>
          Fraud Break
        </span>

        <div className="my-auto grid items-center gap-10 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          <section>
            <h1 className="font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl">
              See why a payment looks risky
            </h1>
            <p className="mt-4 max-w-md text-white/75">
              Fraud Break scores each transaction in seconds and explains the suspicious ones in plain English.
            </p>

            <div className="glass mt-8 max-w-md p-6 sm:p-7">
              <div role="tablist" aria-label="Account" className="flex rounded-xl bg-black/20 p-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={mode === t.id}
                    onClick={() => {
                      setMode(t.id);
                      setError('');
                    }}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                      mode === t.id ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <form role="tabpanel" onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-describedby="form-error"
                    className="field"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-describedby="form-error"
                    className="field"
                  />
                  {!isLogin && <p className="mt-1 text-sm text-white/65">At least {MIN_PASSWORD} characters.</p>}
                </div>

                <p id="form-error" role="alert" className="min-h-5 text-sm text-coral">
                  {error}
                </p>

                <button type="submit" disabled={busy} className="btn-primary">
                  {busy ? (isLogin ? 'Logging in…' : 'Creating account…') : isLogin ? 'Log in' : 'Create account'}
                </button>

                {!isLogin && (
                  <p className="text-sm text-white/65">
                    New accounts can submit and track transactions. Analyst access is given by an administrator.
                  </p>
                )}
              </form>
            </div>
          </section>

          <aside className="flex justify-center lg:justify-end" aria-hidden="true">
            <Ledger />
          </aside>
        </div>
      </div>
    </div>
  );
}
