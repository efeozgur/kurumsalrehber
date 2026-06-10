'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  List, Clock, CheckCircle, AlertTriangle, User, Eye, Search,
  Trash2, X, AlertTriangle as AlertIcon,
} from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  BEKLIYOR: { label: 'Bekliyor', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ISLEMDE: { label: 'İşlemde', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  COZULDU: { label: 'Çözüldü', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  KAPATILDI: { label: 'Kapatıldı', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

export default function TumKayitlarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmBatch, setConfirmBatch] = useState(false);

  useEffect(() => {
    if (user && user.role === 'USER') {
      router.push('/');
    }
  }, [user, router]);

  const fetchAll = () => {
    setLoading(true);
    api.getAllRequests()
      .then((data) => setRequests(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = requests.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.filter(r => r.status === 'KAPATILDI').map(r => r.id)));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteRequest(id);
      setConfirmDelete(null);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      fetchAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBatchDelete = async () => {
    try {
      await api.batchDeleteRequests(Array.from(selectedIds));
      setConfirmBatch(false);
      setSelectedIds(new Set());
      fetchAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <List className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white">Tüm Kayıtlar</h1>
          <span className="text-sm text-gray-500">({requests.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={() => setConfirmBatch(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {selectedIds.size} Kaydı Sil
            </button>
          )}
          <Link
            href="/teknik-servis/yonetim"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-surface-raised border border-white/[0.06] transition-all"
          >
            Dashboard
          </Link>
          <button
            onClick={fetchAll}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-surface-raised border border-white/[0.06] transition-all"
          >
            Yenile
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kayıtlarda ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'BEKLIYOR', 'ISLEMDE', 'COZULDU', 'KAPATILDI'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setSelectedIds(new Set()); }}
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
          <p className="text-gray-500">Kayıt bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select All */}
          <div className="flex items-center gap-3 px-1 py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === filtered.filter(r => r.status === 'KAPATILDI').length && filtered.some(r => r.status === 'KAPATILDI')}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-white/[0.1] bg-surface text-brand-500 focus:ring-brand-500/30"
              />
              <span className="text-xs text-gray-500">Tümünü Seç (sadece kapatılmış)</span>
            </label>
          </div>

          {filtered.map((req) => {
            const st = statusLabels[req.status] ?? statusLabels.BEKLIYOR;
            const isClosed = req.status === 'KAPATILDI';
            return (
              <div
                key={req.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-surface-raised border border-white/[0.06] hover:border-white/20 transition-all group"
              >
                <label className="mt-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(req.id)}
                    onChange={() => toggleSelect(req.id)}
                    className="w-4 h-4 rounded border-white/[0.1] bg-surface text-brand-500 focus:ring-brand-500/30"
                  />
                </label>
                <Link
                  href={`/teknik-servis/yonetim/kayit/${req.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm truncate">{req.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate">{req.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>
                          {new Date(req.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </span>
                        {req.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {req.assignedTo.username ?? `#${req.assignedTo.id}`}
                          </span>
                        )}
                        {req.reportedBy && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {req.reportedBy.username ?? `#${req.reportedBy.id}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {isClosed && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(req.id); }}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Kaydı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <Eye className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Delete Confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertIcon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Kaydı Sil</h3>
                <p className="text-xs text-gray-500">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">Bu arıza kaydını kalıcı olarak silmek istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all">Evet, Sil</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all">İptal</button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Delete Confirm */}
      {confirmBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirmBatch(false)}>
          <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertIcon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Toplu Silme</h3>
                <p className="text-xs text-gray-500">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6"><strong className="text-white">{selectedIds.size}</strong> adet arıza kaydını kalıcı olarak silmek istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button onClick={handleBatchDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all">Evet, Sil</button>
              <button onClick={() => setConfirmBatch(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all">İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
