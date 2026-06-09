'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTheme, Theme } from '@/lib/theme';
import { Contact, Department } from '@/types';
import {
  Search, Grid3X3, List, Building2, Phone, Mail, User,
  ArrowRight, Sparkles, ChevronLeft, ChevronRight, X, Users, BadgeCheck, Lightbulb, Star, Clock, Trash2, LayoutDashboard, Pencil, Palette,
} from 'lucide-react';

function getInitials(f: string, l: string) { return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase(); }

function getAvatarColor(name: string) {
  const colors = [
    'from-brand-500 to-brand-600', 'from-emerald-500 to-emerald-600',
    'from-violet-500 to-violet-600', 'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600', 'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600', 'from-rose-500 to-rose-600',
    'from-cyan-500 to-cyan-600', 'from-amber-500 to-amber-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function HomePage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [titleId, setTitleId] = useState<number>(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searched, setSearched] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string; colors: string }[] = [
    { id: 'sabah', label: 'Sabah', colors: 'from-amber-500 to-orange-600' },
    { id: 'ogle', label: 'Öğle', colors: 'from-blue-400 to-blue-600' },
    { id: 'aksam', label: 'Akşam', colors: 'from-purple-400 to-purple-600' },
    { id: 'gece', label: 'Gece', colors: 'from-indigo-400 to-indigo-600' },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('search_history');
      if (stored) setSearchHistory(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Favorites state
  const [favorites, setFavorites] = useState<Contact[]>([]);
  const [favsLoading, setFavsLoading] = useState(true);

  // Tips state
  const [tips, setTips] = useState<any[]>([]);
  const [activeTip, setActiveTip] = useState(0);
  const [tipSpeed, setTipSpeed] = useState(4000);
  const [tipsEnabled, setTipsEnabled] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'title' | 'department'>('title');
  const [modalTypeId, setModalTypeId] = useState<number>(0);
  const [modalContacts, setModalContacts] = useState<Contact[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalQuery, setModalQuery] = useState('');

  useEffect(() => {
    api.getDepartments().then((res) => setDepartments(res.data));
    api.getTitles().then((res) => setTitles(res.data));
    api.getTips().then((res) => {
      const data = res.data ?? res;
      setTips(Array.isArray(data) ? data : []);
    });
    api.getSettings().then((res) => {
      if (res?.data?.tipSpeed) setTipSpeed(Number(res.data.tipSpeed));
      if (res?.data?.tipsEnabled !== undefined) setTipsEnabled(res.data.tipsEnabled !== 'false');
    }).catch(() => {});
    api.getFavorites(1, 50).then((res) => {
      setFavorites(res.data);
    }).catch(() => {}).finally(() => setFavsLoading(false));
  }, []);

  // Auto-rotate tips
  useEffect(() => {
    if (tips.length < 2) return;
    const timer = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length);
    }, tipSpeed);
    return () => clearInterval(timer);
  }, [tips.length, tipSpeed]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    setViewMode(mq.matches ? 'list' : 'grid');
    const handler = (e: MediaQueryListEvent) => setViewMode(e.matches ? 'list' : 'grid');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((s) => s !== q);
      const next = [q, ...filtered].slice(0, 10);
      localStorage.setItem('search_history', JSON.stringify(next));
      return next;
    });
  };

  const doSearch = async (q: string, p = 1) => {
    const trimmed = q.trim();
    if (trimmed && trimmed.length < 2) return;
    if (!trimmed && departmentId === 0) {
      setContacts([]);
      setSearched(false);
      setTotal(0);
      setTotalPages(1);
      return;
    }
    setShowHistory(false);
    addToHistory(trimmed);
    setLoading(true);
    setSearched(true);
    setPage(p);
    try {
      const res = await api.searchContacts(trimmed || undefined, departmentId || undefined, p, 20, titleId || undefined, showFav || undefined);
      setContacts(res.data);
      setTotalPages(res.meta.totalPages);
      setTotal(res.meta.total);
    } catch {
      setContacts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (p = 1) => doSearch(query, p);

  const openModal = useCallback(async (type: 'title' | 'department', id: number, name: string) => {
    setModalType(type);
    setModalTypeId(id);
    setModalTitle(name);
    setModalQuery('');
    setModalOpen(true);
    setModalLoading(true);
    try {
      const params: any = {};
      if (type === 'title') params.titleId = id;
      else params.departmentId = id;
      const res = await api.searchContacts(undefined, type === 'department' ? id : undefined, 1, 100, type === 'title' ? id : undefined);
      setModalContacts(res.data);
    } catch {
      setModalContacts([]);
    } finally {
      setModalLoading(false);
    }
  }, []);

  const isAdmin = isAuthenticated && user?.role && ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
  const isSuper = user?.role === 'SUPER_ADMIN';

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setFavorites((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleFav = async (id: number) => {
    try {
      const updated = await api.toggleFavorite(id);
      setContacts((prev) =>
        showFav && !updated.data.isFav
          ? prev.filter((c) => c.id !== id)
          : prev.map((c) => c.id === id ? { ...c, isFav: updated.data.isFav } : c)
      );
      setFavorites((prev) =>
        updated.data.isFav
          ? prev.some((c) => c.id === id) ? prev : [...prev, updated.data]
          : prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      console.error('Favori değiştirme hatası:', err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContacts([]);
    setModalQuery('');
  };

  const filteredModalContacts = modalContacts.filter((c) => {
    if (!modalQuery.trim()) return true;
    const q = modalQuery.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.phoneInternal || '').includes(q) ||
      (c.phoneMobile || '').includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.sicilNo || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl max-h-[80vh] bg-surface-card rounded-2xl border border-white/[0.07] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
                  {modalType === 'title' ? <BadgeCheck className="w-4 h-4 text-brand-400" /> : <Building2 className="w-4 h-4 text-brand-400" />}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{modalTitle}</h3>
                  <p className="text-xs text-gray-500">{filteredModalContacts.length} kişi</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-white/[0.06]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={modalQuery}
                  onChange={(e) => setModalQuery(e.target.value)}
                  placeholder="Listede ara..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {modalLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
                  </div>
                </div>
              ) : filteredModalContacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">{modalQuery ? 'Eşleşen kişi bulunamadı' : 'Bu grupta kişi bulunmuyor'}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredModalContacts.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                      {c.avatar ? (
                        <img src={c.avatar} alt="" className="w-10 h-10 rounded-lg object-cover ring-2 ring-white/5 flex-shrink-0" />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAvatarColor(c.firstName + c.lastName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {getInitials(c.firstName, c.lastName)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{c.firstName} {c.lastName}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          {c.title?.name && <span>{c.title.name}</span>}
                          {c.department?.name && <span>{c.department.name}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        {c.phoneInternal && <span className="text-gray-400"><span className="text-gray-600">Dahili </span>{c.phoneInternal}</span>}
                        {c.phoneMobile && <span className="text-gray-400">{c.phoneMobile}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-gradient absolute inset-0" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Burdur Adliyesi</h1>
                <p className="text-xs text-gray-500">Telefon Rehberi</p>
              </div>
            </div>
            {/* Theme Switcher */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500
                           border border-white/[0.08] hover:border-brand-500/30 hover:text-brand-400
                           hover:bg-brand-500/5 transition-all duration-200"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline text-xs capitalize">{themes.find((t) => t.id === theme)?.label}</span>
              </button>
              {themeOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-surface-card border border-white/[0.08] shadow-2xl z-50 overflow-hidden">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setThemeOpen(false); }}
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

            {isAuthenticated ? (
              <a
                href="/admin"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                           bg-brand-500/15 text-brand-400 border border-brand-500/30
                           hover:bg-brand-500/20 hover:text-brand-300 transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </a>
            ) : (
              <a
                href="/admin/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300
                           border border-white/[0.08] hover:border-brand-500/30 hover:text-brand-400
                           hover:bg-brand-500/5 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Admin Giriş
                <ArrowRight className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Hero Content */}
          <div className="text-center py-16 md:py-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Burdur Adliyesi Personel Bilgi Sistemi
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight leading-tight">
              <span className="text-gradient-hero">Personel Ara</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
              İsim, birim, ünvan veya telefon numarasıyla hızlıca arayın
            </p>

            {/* Search Card */}
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-2 glow-card relative z-10">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative" ref={searchRef}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
                      placeholder="Ad, soyad, ünvan, birim veya telefon..."
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-white placeholder-gray-600 focus:outline-none text-base"
                    />
                    {showHistory && searchHistory.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-surface-card border border-white/[0.08] shadow-2xl z-50 overflow-hidden">
                        <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-gray-600 font-medium">Son Aramalar</div>
                        {searchHistory.map((s, i) => (
                          <button
                            key={i}
                            onMouseDown={() => { setQuery(s); doSearch(s, 1); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.03] transition-colors text-left"
                          >
                            <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                            <span className="truncate">{s}</span>
                          </button>
                        ))}
                        <button
                          onMouseDown={() => { setSearchHistory([]); localStorage.removeItem('search_history'); setShowHistory(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-600 hover:text-red-400 hover:bg-white/[0.03] transition-colors border-t border-white/[0.06]"
                        >
                          <Trash2 className="w-3 h-3" /> Geçmişi Temizle
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleSearch(1)} className="btn-primary px-8 whitespace-nowrap flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Ara
                  </button>
                </div>
              </div>
            </div>

            {/* Tips Carousel */}
            {tips.length > 0 && tipsEnabled && (
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] px-6 py-4 min-h-[72px] flex items-center">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4.5 h-4.5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-h-[40px] flex items-center overflow-hidden">
                      {tips.map((tip, idx) => (
                        <p
                          key={tip.id}
                          className={`text-sm text-gray-400 transition-all duration-500 w-full ${
                            idx === activeTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute pointer-events-none'
                          }`}
                        >
                          {tip.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                {tips.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {tips.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTip(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeTip ? 'bg-brand-400 w-4' : 'bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Favorites Section */}
        {!favsLoading && !searched && favorites.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h2 className="text-sm font-semibold text-white tracking-wide">Sık Kullanılanlar</h2>
              <span className="text-xs text-gray-600">({favorites.length} kişi)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((contact) => (
                <div
                  key={contact.id}
                  className="group relative bg-surface-card rounded-2xl border border-white/[0.07] overflow-hidden
                             hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5
                             transition-all duration-300 glow-card-hover"
                >
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(contact.id); }}
                    className="absolute top-3 left-3 z-10 p-1.5 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                  {contact.sicilNo && (
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] font-medium text-gray-400 border border-white/[0.06] tracking-wide">
                      {contact.sicilNo}
                    </span>
                  )}
                  <div className="relative px-5 pt-10 pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/[0.08] flex-shrink-0" />
                      ) : (
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(contact.firstName + contact.lastName)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-white/[0.08]`}>
                          {getInitials(contact.firstName, contact.lastName)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                          {contact.firstName} {contact.lastName}
                        </p>
                        {contact.title?.name && (
                          <p className="text-xs text-gray-500 truncate">{contact.title.name}</p>
                        )}
                      </div>
                    </div>
                    {contact.department && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/15 text-xs font-medium text-amber-400">
                          <Building2 className="w-3 h-3" />
                          {contact.department.name}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1.5 pt-3 border-t border-white/[0.06]">
                      {contact.phoneInternal && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Dahili</span>
                          <span className="text-gray-300 font-medium">{contact.phoneInternal}</span>
                        </div>
                      )}
                      {contact.phoneMobile && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Cep</span>
                          <span className="text-gray-300 font-medium">{contact.phoneMobile}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">E-posta</span>
                          <span className="text-gray-300 font-medium truncate max-w-[180px]">{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Search className="w-4 h-4 text-brand-400" />
              </div>
              <p className="text-sm text-gray-500">
                <span className="text-white font-semibold">{total}</span> sonuç bulundu
              </p>
              <button
                onClick={() => { setShowFav(!showFav); if (!showFav) handleSearch(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showFav
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${showFav ? 'fill-amber-400' : ''}`} />
                Favoriler
              </button>
            </div>
            <div className="flex gap-1 p-1 rounded-xl bg-surface-raised border border-white/[0.06]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-brand-500/20 text-brand-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-brand-500/20 text-brand-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
            </div>
            <p className="text-gray-500 mt-4 text-sm">Aranıyor...</p>
          </div>
        )}

        {!loading && searched && contacts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
              <Search className="w-7 h-7 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-500">Farklı bir arama terimi deneyin veya filtreleri temizleyin</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/10 flex items-center justify-center mx-auto mb-8">
              <Phone className="w-9 h-9 text-brand-400/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Burdur Adliyesi Telefon Rehberi</h3>
            <p className="text-gray-500">Yukarıdaki arama çubuğunu kullanarak kişileri görüntüleyebilirsiniz</p>
          </div>
        )}

        {!loading && contacts.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="group relative bg-surface-card rounded-2xl border border-white/[0.07] overflow-hidden
                           hover:border-brand-500/20 hover:shadow-xl hover:shadow-brand-500/5
                           transition-all duration-300 glow-card-hover cursor-default"
              >
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none" />

                <button
                  onClick={(e) => { e.stopPropagation(); toggleFav(contact.id); }}
                  className={`absolute top-3 left-3 z-10 p-1.5 rounded-lg transition-all ${
                    contact.isFav
                      ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                      : 'text-gray-600 hover:text-gray-400 hover:bg-white/5 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Star className={`w-4 h-4 ${contact.isFav ? 'fill-amber-400' : ''}`} />
                </button>
                {contact.sicilNo && (
                  <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] font-medium text-gray-400 border border-white/[0.06] tracking-wide">
                    {contact.sicilNo}
                  </span>
                )}

                <div className="relative px-6 pt-12 pb-5">
                  <div className="flex justify-center -mt-2 mb-4">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-600/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {contact.avatar ? (
                        <img src={contact.avatar} alt="" className="relative w-24 h-24 rounded-2xl object-cover ring-2 ring-white/[0.08] shadow-lg" />
                      ) : (
                        <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarColor(contact.firstName + contact.lastName)} flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-2 ring-white/[0.08]`}>
                          {getInitials(contact.firstName, contact.lastName)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-white text-lg tracking-tight group-hover:text-brand-400 transition-colors">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    {contact.title?.name && (
                      <button
                        onClick={() => openModal('title', contact.title!.id, contact.title!.name)}
                        className="text-sm text-gray-500 mt-0.5 hover:text-brand-400 transition-colors cursor-pointer"
                      >
                        {contact.title.name}
                      </button>
                    )}
                  </div>

                  {contact.department && (
                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() => openModal('department', contact.department!.id, contact.department!.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/15 hover:bg-brand-500/15 hover:border-brand-500/30 transition-all cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-xs font-medium text-brand-400">{contact.department.name}</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                    {contact.phoneInternal && (
                      <div className="flex items-center justify-between text-sm group/phone px-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-gray-500 text-xs font-medium">Dahili</span>
                        </div>
                        <span className="text-gray-300 font-medium group-hover/phone:text-emerald-400 transition-colors">
                          {contact.phoneInternal}
                        </span>
                      </div>
                    )}
                    {contact.phoneMobile && (
                      <div className="flex items-center justify-between text-sm group/phone px-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
                            <Phone className="w-3.5 h-3.5 text-brand-400" />
                          </div>
                          <span className="text-gray-500 text-xs font-medium">Cep</span>
                        </div>
                        <span className="text-gray-300 font-medium group-hover/phone:text-brand-400 transition-colors">
                          {contact.phoneMobile}
                        </span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center justify-between text-sm group/email px-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Mail className="w-3.5 h-3.5 text-purple-400" />
                          </div>
                          <span className="text-gray-500 text-xs font-medium">E-posta</span>
                        </div>
                        <span className="text-gray-300 font-medium truncate max-w-[160px] group-hover/email:text-purple-400 transition-colors">
                          {contact.email}
                        </span>
                      </div>
                    )}
                    {!contact.phoneInternal && !contact.phoneMobile && !contact.email && (
                      <p className="text-center text-xs text-gray-600 py-1">İletişim bilgisi bulunmuyor</p>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center justify-center gap-2 pt-3 mt-3 border-t border-white/[0.06]">
                      <a
                        href={`/admin/contacts/${contact.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Düzenle
                      </a>
                      {isSuper && (
                        <button
                          onClick={() => handleDelete(contact.id, `${contact.firstName} ${contact.lastName}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Sil
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && contacts.length > 0 && viewMode === 'list' && (
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                <button
                  onClick={() => toggleFav(contact.id)}
                  className={`p-1.5 rounded-lg transition-all ${
                    contact.isFav
                      ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                      : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Star className={`w-4 h-4 ${contact.isFav ? 'fill-amber-400' : ''}`} />
                </button>
                {contact.avatar ? (
                  <img src={contact.avatar} alt="" className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/5 flex-shrink-0" />
                ) : (
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAvatarColor(contact.firstName + contact.lastName)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ring-2 ring-white/[0.06]`}>
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>
                )}
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                  <div className="md:col-span-1">
                    <p className="font-medium text-white group-hover:text-brand-400 transition-colors truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    {contact.title?.name && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{contact.title.name}</p>
                    )}
                    {contact.sicilNo && (
                      <p className="text-xs text-gray-600 mt-0.5">Sicil: {contact.sicilNo}</p>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {contact.department ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                        <Building2 className="w-3.5 h-3.5 text-brand-400/60" />
                        {contact.department.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {contact.phoneInternal ? (
                      <span className="text-sm text-gray-400"><span className="text-gray-600 text-xs">Dahili </span>{contact.phoneInternal}</span>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {contact.phoneMobile ? (
                      <span className="text-sm text-gray-400"><span className="text-gray-600 text-xs">Cep </span>{contact.phoneMobile}</span>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {contact.email ? (
                      <span className="text-sm text-gray-400 truncate block group-hover/email:text-brand-400 transition-colors">{contact.email}</span>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`/admin/contacts/${contact.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </a>
                    {isSuper && (
                      <button
                        onClick={() => handleDelete(contact.id, `${contact.firstName} ${contact.lastName}`)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => handleSearch(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-brand-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 inline" /> Önceki
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => handleSearch(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handleSearch(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-brand-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Sonraki <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        )}

        {!loading && contacts.length > 0 && (
          <p className="text-center text-xs text-gray-600 mt-6">
            Toplam {total} kayıt · Sayfa {page}/{totalPages}
          </p>
        )}
      </div>
    </div>
  );
}
