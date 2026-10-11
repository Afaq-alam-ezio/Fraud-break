import { useCallback, useMemo, useState } from 'react';
import { ApiError, apiFetch } from './api';
import { AuthContext, STORAGE_KEY } from './auth';

function readStoredSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.token && saved?.role ? saved : null;
  } catch {
    return null;
  }
}

// Keeps { token, role, email } for the whole app and in localStorage, so a refresh keeps you logged in.
// Note: the role stored here only decides which page to show. The server checks the real role on every request.
export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredSession);

  const login = useCallback((session) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  // Use this for every call that needs a token. It adds the token,
  // and logs you out if the server says the token is no longer valid (401).
  const authFetch = useCallback(
    async (path, options = {}) => {
      try {
        return await apiFetch(path, { ...options, token: auth?.token });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [auth, logout],
  );

  const value = useMemo(() => ({ auth, login, logout, authFetch }), [auth, login, logout, authFetch]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
