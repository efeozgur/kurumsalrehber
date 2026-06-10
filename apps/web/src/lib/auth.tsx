'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface AuthUser {
  id: number;
  username: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  sicilNo?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  firstTimeLogin: boolean;
  login: (username: string, password: string) => Promise<{ user: AuthUser; firstTimeLogin: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
  displayName: string;
}

const noopLogin = async (_username: string, _password: string): Promise<{ user: AuthUser; firstTimeLogin: boolean }> => {
  throw new Error('AuthContext not initialized');
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  firstTimeLogin: false,
  login: noopLogin,
  logout: () => {},
  isAuthenticated: false,
  displayName: '',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      api.getMe()
        .then((res) => {
          const data = res.data ?? res;
          setUser(data);
          setFirstTimeLogin(data.firstTimeLogin ?? false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    const payload = res.data ?? res;
    localStorage.setItem('token', payload.access_token);
    setToken(payload.access_token);
    setUser(payload.user);
    setFirstTimeLogin(payload.firstTimeLogin ?? false);
    return { user: payload.user, firstTimeLogin: payload.firstTimeLogin ?? false };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setFirstTimeLogin(false);
  };

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
    : '';

  return (
    <AuthContext.Provider
      value={{ user, token, loading, firstTimeLogin, login, logout, isAuthenticated: !!token, displayName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
