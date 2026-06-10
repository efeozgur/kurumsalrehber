'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import UserPicker from '@/components/UserPicker';
import {
  ArrowLeft, Clock, CheckCircle, AlertTriangle, User, Calendar,
  UserCheck, Send, XCircle, UserPlus,
} from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  BEKLIYOR: { label: 'Bekliyor', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ISLEMDE: { label: 'İşlemde', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  COZULDU: { label: 'Çözüldü', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  KAPATILDI: { label: 'Kapatıldı', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

const statusOptions = ['BEKLIYOR', 'ISLEMDE', 'COZULDU', 'KAPATILDI'];

export default function YonetimKayitDetayPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [req, setReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [resolution, setResolution] = useState('');

  const isTech = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const fetchRequest = () => {
    if (!id) return;
    api.getRequest(Number(id))
      .then((data) => {
        setReq(data);
        setResolution(data.resolution ?? '');
      })
      .catch(() => router.push('/teknik-servis/yonetim'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequest(); }, [id, router]);

  const handleAssign = async () => {
    setActionLoading(true);
    try {
      await api.assignToSelf(Number(id));
      fetchRequest();
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatus = async (status: string) => {
    setActionLoading(true);
    try {
      await api.adminUpdateStatus(Number(id), status);
      fetchRequest();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignToUser = async (targetUser: any) => {
    setActionLoading(true);
    try {
      await api.assignToUser(Number(id), targetUser.id);
      fetchRequest();
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return;
    setActionLoading(true);
    try {
      await api.resolveRequest(Number(id), resolution.trim());
      fetchRequest();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  if (!req) return null;

  const st = statusLabels[req.status] ?? statusLabels.BEKLIYOR;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/teknik-servis/yonetim"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Tüm Kayıtlara Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-surface-raised border border-white/[0.06] overflow-hidden">
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-xl font-bold text-white">{req.title}</h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(req.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                {req.createdBy && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {req.createdBy.username ?? `#${req.createdBy.id}`}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 border-b border-white/[0.06]">
              <h2 className="text-sm font-medium text-white mb-2">Açıklama</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{req.description}</p>
            </div>

            {req.image && (
              <div className="p-6 border-b border-white/[0.06]">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || ''}${req.image}`}
                  alt="Arıza fotoğrafı"
                  className="rounded-xl max-h-80 object-cover"
                />
              </div>
            )}

            {req.resolution && (
              <div className="p-6">
                <h2 className="text-sm font-medium text-white mb-2">Çözüm</h2>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <p className="text-gray-400 text-sm leading-relaxed">{req.resolution}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          {req.timeline && req.timeline.length > 0 && (
            <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
              <h2 className="text-sm font-medium text-white mb-4">Zaman Çizelgesi</h2>
              <div className="space-y-3">
                {req.timeline.map((entry: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5" />
                      {i < req.timeline.length - 1 && <div className="w-px flex-1 bg-white/[0.06]" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">{entry.action}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(entry.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-4">
          {/* Assign */}
          {isTech && !req.assignedTo && (
            <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-4">
              <button
                onClick={handleAssign}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-medium transition-all"
              >
                <UserCheck className="w-4 h-4" />
                {actionLoading ? 'İşlem...' : 'Kendime Ata'}
              </button>
            </div>
          )}

          {/* Assign to another */}
          {isTech && (
            <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-4">
              <h3 className="text-sm font-medium text-white mb-3">
                <UserPlus className="w-4 h-4 inline mr-1.5 text-gray-500" />
                Başka Teknisyene Ata
              </h3>
              <UserPicker
                onSelect={handleAssignToUser}
                excludeIds={[req.assignedTo?.id, user?.id].filter(Boolean)}
                placeholder="Kullanıcı ara..."
              />
            </div>
          )}

          {/* Status Update */}
          {isTech && (
            <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-4">
              <h3 className="text-sm font-medium text-white mb-3">Durum Güncelle</h3>
              <div className="space-y-2">
                {statusOptions.map((s) => {
                  const item = statusLabels[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatus(s)}
                      disabled={actionLoading || req.status === s}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        req.status === s
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {s === 'COZULDU' ? <CheckCircle className="w-3.5 h-3.5" /> :
                       s === 'KAPATILDI' ? <XCircle className="w-3.5 h-3.5" /> :
                       s === 'ISLEMDE' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                       <Clock className="w-3.5 h-3.5" />}
                      {item?.label ?? s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resolve */}
          {isTech && req.status !== 'COZULDU' && req.status !== 'KAPATILDI' && (
            <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-4">
              <h3 className="text-sm font-medium text-white mb-3">Çözüm Bildir</h3>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Çözüm açıklaması..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-xs focus:outline-none focus:border-brand-500/40 transition-all resize-none mb-2"
              />
              <button
                onClick={handleResolve}
                disabled={actionLoading || !resolution.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-medium transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                {actionLoading ? 'İşlem...' : 'Çözümü Kaydet'}
              </button>
            </div>
          )}

          {/* Assigned To */}
          {req.assignedTo && (
            <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Atanan</h3>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="w-4 h-4 text-gray-500" />
                {req.assignedTo.username ?? `#${req.assignedTo.id}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
