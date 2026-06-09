'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | ''>('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDepartments().then((res) => {
      const dept = res.data.find((d: any) => d.id === id);
      if (dept) {
        setName(dept.name);
        setParentId(dept.parentId ?? '');
      }
      setDepartments(res.data.filter((d: any) => d.id !== id));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.updateDepartment(id, name, parentId || undefined);
      router.push('/admin/departments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
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
        <a href="/admin/departments" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Birim Düzenle</h1>
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">Birim Bilgileri</h3>
            <p className="text-xs text-gray-500">Birim adını ve üst birimi güncelleyin</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Birim Adı *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Birim adı" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Üst Birim</label>
          <select value={parentId} onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : '')} className="input-field">
            <option value="">— Üst Birim Yok (Ana Birim) —</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <a href="/admin/departments" className="btn-ghost">İptal</a>
        </div>
      </form>
    </div>
  );
}
