'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Stats } from '@/types';
import {
  Users, Building2, UserCog, Phone, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Sparkles,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {stats && stats.recentContacts.length > 0 ? (
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
