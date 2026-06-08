'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Lightbulb } from 'lucide-react';

export default function NewTipPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.createTip(text);
      router.push('/admin/tips');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/tips" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni İpucu</h1>
          <p className="text-sm text-gray-500 mt-0.5">Anasayfada gösterilecek kullanım ipucu</p>
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
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">İpucu Bilgisi</h3>
            <p className="text-xs text-gray-500">Anasayfada kayan kart olarak gösterilir</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">İpucu Metni *</label>
          <textarea required value={text} onChange={(e) => setText(e.target.value)} rows={3} className="input-field resize-none" placeholder="Örn: Kişi ünvanına tıklayarak o ünvandaki personeli listeleyebilirsiniz." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <a href="/admin/tips" className="btn-ghost">İptal</a>
        </div>
      </form>
    </div>
  );
}
