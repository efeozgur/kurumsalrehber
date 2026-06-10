'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  Wrench, Clock, CheckCircle, AlertTriangle, XCircle, Users,
  TrendingUp, UserCheck, List,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  BEKLIYOR: '#eab308',
  ISLEMDE: '#3b82f6',
  COZULDU: '#22c55e',
  KAPATILDI: '#6b7280',
};

const statusLabels: Record<string, string> = {
  BEKLIYOR: 'Bekliyor',
  ISLEMDE: 'İşlemde',
  COZULDU: 'Çözüldü',
  KAPATILDI: 'Kapatıldı',
};

const PIE_COLORS = ['#eab308', '#3b82f6', '#22c55e', '#6b7280'];

export default function YonetimDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'USER') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const statusPie = Object.entries(data.statusCounts)
    .filter(([_, count]) => (count as number) > 0)
    .map(([name, value]) => ({ name: statusLabels[name] ?? name, value }));

  const cards = [
    { label: 'Toplam Arıza', value: data.total, icon: Wrench, color: 'from-brand-500/20 to-brand-600/10', iconColor: 'text-brand-400', border: 'border-brand-500/20' },
    { label: 'Bekliyor', value: data.statusCounts.BEKLIYOR, icon: Clock, color: 'from-yellow-500/20 to-yellow-600/10', iconColor: 'text-yellow-400', border: 'border-yellow-500/20' },
    { label: 'İşlemde', value: data.statusCounts.ISLEMDE, icon: AlertTriangle, color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400', border: 'border-blue-500/20' },
    { label: 'Çözüldü', value: data.statusCounts.COZULDU, icon: CheckCircle, color: 'from-green-500/20 to-green-600/10', iconColor: 'text-green-400', border: 'border-green-500/20' },
    { label: 'Kapatıldı', value: data.statusCounts.KAPATILDI, icon: XCircle, color: 'from-gray-500/20 to-gray-600/10', iconColor: 'text-gray-400', border: 'border-gray-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Teknik Servis Paneli</h1>
        <p className="text-sm text-gray-500 mt-1">Arıza istatistikleri ve yönetim</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} p-5 transition-all hover:border-white/20`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-400">{card.label}</p>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution - Pie */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Durum Dağılımı</h2>
          </div>
          {statusPie.length > 0 ? (
            <div className="flex items-center justify-center gap-8">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={statusPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPie.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {statusPie.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-gray-400">{item.name}</span>
                    <span className="text-white font-medium ml-2">{(item.value as number)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Henüz veri yok</p>
          )}
        </div>

        {/* Monthly Trend - Line */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Aylık Arıza Trendi</h2>
          </div>
          {data.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Henüz veri yok</p>
          )}
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Reporters */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">En Çok Arıza Bildirenler</h2>
          </div>
          {data.topReporters.length > 0 ? (
            <div className="space-y-2">
              {data.topReporters.map((r: any, i: number) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-medium text-gray-600">{i + 1}</span>
                    <span className="text-sm text-gray-300">{r.username}</span>
                  </div>
                  <span className="text-sm font-medium text-brand-400">{r.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Henüz veri yok</p>
          )}
        </div>

        {/* Tech Performance */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Teknisyen Performansı</h2>
          </div>
          {data.techPerformance.length > 0 ? (
            <div className="space-y-2">
              {data.techPerformance.map((t: any, i: number) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-medium text-gray-600">{i + 1}</span>
                    <span className="text-sm text-gray-300">{t.username}</span>
                  </div>
                  <span className="text-sm font-medium text-green-400">{t.count} çözüm</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Henüz veri yok</p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link
          href="/teknik-servis/yonetim/kayitlar"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all"
        >
          <List className="w-4 h-4" />
          Tüm Kayıtları Gör
        </Link>
      </div>
    </div>
  );
}
