'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function NewDepartmentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.createDepartment(name);
      router.push('/admin/departments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/departments" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni Birim</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kuruma yeni birim ekleyin</p>
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">Birim Bilgileri</h3>
            <p className="text-xs text-gray-500">Birim adını girin</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Birim Adı *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Örn: İnsan Kaynakları" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <a href="/admin/departments" className="btn-ghost">İptal</a>
        </div>
      </form>
    </div>
  );
}
