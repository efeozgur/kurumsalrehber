'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '@/lib/theme';
import { Palette } from 'lucide-react';

const themes: { id: Theme; label: string; colors: string }[] = [
  { id: 'turuncu', label: 'Turuncu', colors: 'from-amber-500 to-orange-600' },
  { id: 'mavi', label: 'Mavi', colors: 'from-blue-400 to-blue-600' },
  { id: 'mor', label: 'Mor', colors: 'from-purple-400 to-purple-600' },
  { id: 'lacivert', label: 'Lacivert', colors: 'from-indigo-400 to-indigo-600' },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium
                   bg-surface-card border border-white/[0.08] shadow-2xl
                   text-gray-400 hover:text-brand-400 hover:border-brand-500/30
                   hover:bg-brand-500/5 transition-all duration-200"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline text-xs capitalize">
          {themes.find((t) => t.id === theme)?.label}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-40 rounded-xl bg-surface-card border border-white/[0.08] shadow-2xl overflow-hidden">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                theme === t.id ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${t.colors} flex-shrink-0`} />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
