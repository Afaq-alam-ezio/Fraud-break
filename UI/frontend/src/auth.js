import { createContext, useContext } from 'react';

export const STORAGE_KEY = 'fraudbreak.session';
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Which page each role lands on after logging in.
export const homeFor = (role) => (role === 'ANALYST' ? '/dashboard' : '/submit');
export const roleLabel = (role) => (role === 'ANALYST' ? 'Analyst' : 'User');
