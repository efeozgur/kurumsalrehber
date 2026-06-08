'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, BadgeCheck } from 'lucide-react';

export default function EditTitlePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getTitles()
      .then((res) => {
        const item = res.data.find((t: any) => t.id === id);
        if (item) setName(item.name);
        else router.push('/admin/titles');
      })
      .catch(() => router.push('/admin/titles'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.updateTitle(id, name);
      router.push('/admin/titles');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/titles" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Ünvan Düzenle</h1>
          <p className="text-sm text-gray-500 mt-0.5">{name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
            <BadgeCheck className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">Ünvan Bilgileri</h3>
            <p className="text-xs text-gray-500">Ünvan adını düzenleyin</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ünvan Adı *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Örn: İdari İşler Müdürü" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <a href="/admin/titles" className="btn-ghost">İptal</a>
        </div>
      </form>
    </div>
  );
}
