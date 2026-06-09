'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Stats, AnalyticsSummary, SearchTerm, TopContactView, HourlyUsage, DailyUsage, NoResultQuery, FavStat, Contact } from '@/types';
import {
  Users, Building2, UserCog, Phone, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Sparkles,
  Search, BarChart3, AlertCircle, Layers, Eye, Star,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const COLORS = ['#f97316', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#e11d48', '#6366f1', '#14b8a6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);
  const [topContacts, setTopContacts] = useState<TopContactView[]>([]);
  const [hourlyUsage, setHourlyUsage] = useState<HourlyUsage[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [noResults, setNoResults] = useState<NoResultQuery[]>([]);
  const [favStats, setFavStats] = useState<FavStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [
      statsRes,
      analyticsRes,
      searchTermsRes,
      topContactsRes,
      hourlyRes,
      dailyRes,
      noResultsRes,
      favStatsRes,
    ] = await Promise.all([
      api.getStats().catch(() => null),
      api.getAnalyticsSummary().catch(() => null),
      api.getAnalyticsSearchTerms().catch(() => []),
      api.getAnalyticsTopContacts().catch(() => []),
      api.getAnalyticsUsageHourly().catch(() => []),
      api.getAnalyticsUsageDaily().catch(() => []),
      api.getAnalyticsNoResults().catch(() => []),
      api.getAnalyticsFavStats().catch(() => []),
    ]);

    if (statsRes) setStats(statsRes);
    if (analyticsRes) setAnalytics({
      todaySearches: analyticsRes.todaySearches ?? 0,
      totalSearches: analyticsRes.totalSearches ?? 0,
      noResultSearches: analyticsRes.noResultSearches ?? 0,
      noResultRate: analyticsRes.noResultRate ?? 0,
      avgResultCount: analyticsRes.avgResultCount ?? 0,
    });
    setSearchTerms(searchTermsRes || []);
    setTopContacts(topContactsRes || []);
    setHourlyUsage(hourlyRes || []);
    setDailyUsage(dailyRes || []);
    setNoResults(noResultsRes || []);
    setFavStats(favStatsRes || []);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Toplam Kişi', value: stats?.contactCount || 0, icon: Users,
      gradient: 'from-brand-500/10 to-brand-600/5', border: 'border-brand-500/20',
      iconBg: 'from-brand-500 to-brand-600', iconShadow: 'shadow-brand-500/20',
      trend: '+12', trendUp: true,
    },
    {
      label: 'Aktif Birim', value: stats?.departmentCount || 0, icon: Building2,
      gradient: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20',
      iconBg: 'from-emerald-500 to-emerald-600', iconShadow: 'shadow-emerald-500/20',
      trend: null, trendUp: true,
    },
    {
      label: 'Kullanıcı', value: stats?.userCount || 0, icon: UserCog,
      gradient: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/20',
      iconBg: 'from-violet-500 to-violet-600', iconShadow: 'shadow-violet-500/20',
      trend: null, trendUp: true,
    },
    {
      label: 'Sistem Durumu', value: 'Aktif', icon: TrendingUp,
      gradient: 'from-brand-500/10 to-amber-600/5', border: 'border-amber-500/20',
      iconBg: 'from-amber-500 to-amber-600', iconShadow: 'shadow-amber-500/20',
      trend: null, trendUp: true,
    },
  ];

  const analyticsCards = [
    {
      label: 'Bugünkü Arama', value: analytics?.todaySearches || 0, icon: Search,
      gradient: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20',
      iconBg: 'from-cyan-500 to-cyan-600', iconShadow: 'shadow-cyan-500/20',
    },
    {
      label: 'Toplam Arama', value: analytics?.totalSearches || 0, icon: BarChart3,
      gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20',
      iconBg: 'from-blue-500 to-blue-600', iconShadow: 'shadow-blue-500/20',
    },
    {
      label: 'Boş Sonuç Oranı', value: analytics ? `%${analytics.noResultRate ?? 0}` : '%0', icon: AlertCircle,
      gradient: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20',
      iconBg: 'from-rose-500 to-rose-600', iconShadow: 'shadow-rose-500/20',
    },
    {
      label: 'Ort. Sonuç Sayısı', value: analytics?.avgResultCount || 0, icon: Layers,
      gradient: 'from-teal-500/10 to-teal-600/5', border: 'border-teal-500/20',
      iconBg: 'from-teal-500 to-teal-600', iconShadow: 'shadow-teal-500/20',
    },
  ];

  const deptData = stats?.departmentDistribution?.filter((d) => d.value > 0) || [];
  const titleData = stats?.titleDistribution?.filter((d) => d.value > 0) || [];

  const hasAnalytics = !!(analytics || (searchTerms?.length ?? 0) > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Sisteme genel bakış</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-white/[0.06] text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          Canlı
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`stat-card bg-gradient-to-br ${card.gradient} ${card.border} group`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg ${card.iconShadow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {card.trend && (
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                    card.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trend}
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          );
        })}
      </div>

      {hasAnalytics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {analyticsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`stat-card bg-gradient-to-br ${card.gradient} ${card.border} group`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg ${card.iconShadow} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Saat Bazlı Kullanım (Son 7 Gün)
                </h2>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={(hourlyUsage?.length ?? 0) > 0 ? hourlyUsage : Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))}>
                    <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Günlük Kullanım Trendi (Son 30 Gün)
                </h2>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dailyUsage}>
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4 text-brand-400" />
                  En Çok Aranan Terimler
                </h2>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {(searchTerms?.length ?? 0) > 0 ? (
                  searchTerms.map((term, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <span className="w-6 text-center text-sm font-medium text-gray-500">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{term.query}</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-400">{term.count}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">Henüz arama verisi yok</div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-blue-400" />
                  En Çok Görüntülenen Kişiler
                </h2>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {(topContacts?.length ?? 0) > 0 ? (
                  topContacts.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <span className="w-6 text-center text-sm font-medium text-gray-500">#{i + 1}</span>
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center text-sm font-semibold text-blue-400 flex-shrink-0">
                        {item.contact ? `${item.contact.firstName.charAt(0)}${item.contact.lastName.charAt(0)}` : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.contact ? `${item.contact.firstName} ${item.contact.lastName}` : 'Bilinmeyen Kişi'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.contact?.department?.name || '—'}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-blue-400">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">Henüz görüntüleme verisi yok</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Boş Sonuç Dönen Aramalar
                </h2>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {(noResults?.length ?? 0) > 0 ? (
                  noResults.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <span className="w-6 text-center text-sm font-medium text-gray-500">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">&quot;{item.query}&quot;</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">Boş sonuç dönen arama yok</div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-amber-400" />
                  En Çok Favorilenen Kişiler
                </h2>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {(favStats?.length ?? 0) > 0 ? (
                  favStats.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <span className="w-6 text-center text-sm font-medium text-gray-500">#{i + 1}</span>
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-sm font-semibold text-amber-400 flex-shrink-0">
                        {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.firstName} {item.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{item.department || '—'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">Henüz favori eklenmemiş</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-brand-400" />
              Son Eklenen Kişiler
            </h2>
            <a href="/admin/contacts" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              Tümünü Gör →
            </a>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {stats?.recentContacts && stats.recentContacts.length > 0 ? (
              stats.recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-sm font-semibold text-brand-400 flex-shrink-0">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.title?.name || '—'} · {contact.department?.name || '—'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(contact.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 text-sm">Henüz kişi eklenmemiş</div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Birim Bazında Dağılım
            </h2>
          </div>
          <div className="p-6">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                    {deptData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">Henüz veri yok</p>
            )}
            {deptData.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {deptData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{d.name}</span>
                    <span className="ml-auto text-white font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Ünvan Bazında Dağılım
            </h2>
          </div>
          <div className="p-6">
            {titleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={titleData}>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {titleData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">Henüz veri yok</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white flex items-center gap-2 text-sm mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Hızlı Bilgiler
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/[0.06]">
              <span className="text-sm text-gray-400">Birim başına ortalama kişi</span>
              <span className="text-sm font-semibold text-white">
                {stats && stats.departmentCount > 0
                  ? (stats.contactCount / stats.departmentCount).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/[0.06]">
              <span className="text-sm text-gray-400">Toplam kayıtlı kişi</span>
              <span className="text-sm font-semibold text-white">{stats?.contactCount || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/[0.06]">
              <span className="text-sm text-gray-400">Toplam birim</span>
              <span className="text-sm font-semibold text-white">{stats?.departmentCount || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/[0.06]">
              <span className="text-sm text-gray-400">Sistem kullanıcısı</span>
              <span className="text-sm font-semibold text-white">{stats?.userCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
