import { NavLink } from 'react-router-dom';
import { roleLabel, useAuth } from '../auth';

const userLinks = [
  { to: '/submit', label: 'Send transaction' },
  { to: '/my-transactions', label: 'My transactions' },
];

// A frosted bar that stays at the top while you scroll: brand, page links, who you are, Log out.
export default function AppHeader() {
  const { auth, logout } = useAuth();

  return (
    <header className="sticky top-3 z-20 px-3 pt-3 sm:px-6">
      <div className="glass mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-3">
        <span className="flex items-center gap-2 font-display text-xl font-semibold">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="9" cy="9" r="6.5" fill="none" stroke="#ff8f80" strokeWidth="2.5" />
          </svg>
          Fraud Break
        </span>

        {auth.role === 'USER' && (
          <nav aria-label="Main" className="order-last flex w-full gap-2 sm:order-none sm:w-auto sm:flex-1">
            {userLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-white/70 sm:inline">
            {auth.email} ({roleLabel(auth.role)})
          </span>
          <button type="button" onClick={logout} className="btn-ghost">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
