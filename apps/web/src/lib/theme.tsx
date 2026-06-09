'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

export type Theme = 'turuncu' | 'mavi' | 'mor' | 'lacivert';

const THEME_KEY = 'theme';
const DEFAULT_THEME: Theme = 'turuncu';

const THEMES: Theme[] = ['turuncu', 'mavi', 'mor', 'lacivert'];

function applyTheme(t: Theme) {
  THEMES.forEach((th) => document.documentElement.classList.remove(`theme-${th}`));
  document.documentElement.classList.add(`theme-${t}`);
}

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

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const initial = saved || DEFAULT_THEME;
    setThemeState(initial);
    applyTheme(initial);
    api.getSettings().then((res) => {
      const t = res?.data?.theme as Theme | undefined;
      if (t && THEMES.includes(t)) {
        setThemeState(t);
        applyTheme(t);
        localStorage.setItem(THEME_KEY, t);
      }
    }).catch(() => {});
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
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
