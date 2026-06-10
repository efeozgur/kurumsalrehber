'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Search, User, X, Check } from 'lucide-react';

interface UserItem {
  id: number;
  username: string;
  role: string;
  contact?: {
    firstName: string;
    lastName: string;
    sicilNo?: string;
  } | null;
}

interface UserPickerProps {
  onSelect: (user: UserItem) => void;
  excludeIds?: number[];
  placeholder?: string;
}

export default function UserPicker({ onSelect, excludeIds = [], placeholder = 'Kullanıcı ara...' }: UserPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api.searchTechUsers(query).then((data) => {
        setResults((data ?? []).filter((u: UserItem) => !excludeIds.includes(u.id)));
      }).catch(() => setResults([])).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, excludeIds]);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query.length >= 2) setOpen(true); }}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
        />
      </div>

      {open && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-surface-card border border-white/[0.08] shadow-2xl z-50 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-3">
              <div className="w-4 h-4 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
            </div>
          )}
          {!loading && results.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => { onSelect(user); setQuery(''); setResults([]); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-semibold text-brand-400 flex-shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="truncate block">
                  {user.contact
                    ? `${user.contact.firstName} ${user.contact.lastName}`
                    : user.username}
                </span>
                {user.contact?.sicilNo && (
                  <span className="text-xs text-gray-600">{user.contact.sicilNo}</span>
                )}
              </div>
              {user.role === 'SUPER_ADMIN' && (
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">Süper</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
