'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, User, Calendar, MessageSquare } from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  BEKLIYOR: { label: 'Bekliyor', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ISLEMDE: { label: 'İşlemde', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  COZULDU: { label: 'Çözüldü', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  KAPATILDI: { label: 'Kapatıldı', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
};

export default function KayitDetayPage() {
  const { id } = useParams();
  const router = useRouter();
  const [req, setReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getRequest(Number(id))
      .then((data) => setReq(data))
      .catch(() => router.push('/teknik-servis/kayitlarim'))
      .finally(() => setLoading(false));
  }, [id, router]);

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/teknik-servis/kayitlarim"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kayıtlarıma Dön
      </Link>

      <div className="rounded-2xl bg-surface-raised border border-white/[0.06] overflow-hidden">
        {/* Header */}
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
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-white/[0.06]">
          <h2 className="text-sm font-medium text-white mb-2">Açıklama</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{req.description}</p>
        </div>

        {/* Image */}
        {req.image && (
          <div className="p-6 border-b border-white/[0.06]">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL || ''}${req.image}`}
              alt="Arıza fotoğrafı"
              className="rounded-xl max-h-80 object-cover"
            />
          </div>
        )}

        {/* Assignee */}
        {req.assignedTo && (
          <div className="p-6 border-b border-white/[0.06]">
            <h2 className="text-sm font-medium text-white mb-2">Atanan Teknik Personel</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              {req.assignedTo.username ?? `#${req.assignedTo.id}`}
            </div>
          </div>
        )}

        {/* Resolution */}
        {req.resolution && (
          <div className="p-6">
            <h2 className="text-sm font-medium text-white mb-2">Çözüm</h2>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-gray-400 text-sm leading-relaxed">{req.resolution}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {req.timeline && req.timeline.length > 0 && (
          <div className="p-6 border-t border-white/[0.06]">
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
    </div>
  );
}
