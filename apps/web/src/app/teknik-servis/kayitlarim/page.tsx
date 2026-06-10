'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { List, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  BEKLIYOR: { label: 'Bekliyor', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ISLEMDE: { label: 'İşlemde', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  COZULDU: { label: 'Çözüldü', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  KAPATILDI: { label: 'Kapatıldı', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

const statusIcons: Record<string, any> = {
  BEKLIYOR: Clock,
  ISLEMDE: AlertTriangle,
  COZULDU: CheckCircle,
  KAPATILDI: CheckCircle,
};

export default function KayitlarimPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.getMyRequests()
      .then((data) => setRequests(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white">Kayıtlarım</h1>
        </div>
        <Link
          href="/teknik-servis/ekle"
          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all"
        >
          Yeni Kayıt
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'BEKLIYOR', 'ISLEMDE', 'COZULDU', 'KAPATILDI'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === s
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            {s === 'all' ? 'Tümü' : statusLabels[s]?.label ?? s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <List className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">Hiç kayıt bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const st = statusLabels[req.status] ?? statusLabels.BEKLIYOR;
            const Icon = statusIcons[req.status] ?? Clock;
            return (
              <Link
                key={req.id}
                href={`/teknik-servis/kayit/${req.id}`}
                className="block p-4 rounded-xl bg-surface-raised border border-white/[0.06] hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium text-sm truncate">{req.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${st.color}`}>
                        <Icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs truncate">{req.description}</p>
                    <p className="text-gray-600 text-xs mt-2">
                      {new Date(req.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
