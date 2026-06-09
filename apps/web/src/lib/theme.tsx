'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

export type Theme = 'sabah' | 'ogle' | 'aksam' | 'gece';

const THEME_KEY = 'theme';
const DEFAULT_THEME: Theme = 'sabah';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const initial = saved || DEFAULT_THEME;
    setThemeState(initial);
    document.documentElement.className = `theme-${initial}`;
    setLoaded(true);
    api.getSettings().then((res) => {
      const t = res?.data?.theme as Theme | undefined;
      if (t && ['sabah', 'ogle', 'aksam', 'gece'].includes(t)) {
        setThemeState(t);
        document.documentElement.className = `theme-${t}`;
        localStorage.setItem(THEME_KEY, t);
      }
    }).catch(() => {});
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.className = `theme-${t}`;
    localStorage.setItem(THEME_KEY, t);
    api.updateSetting('theme', t).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
