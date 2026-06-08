'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Department, Title } from '@/types';
import { ArrowLeft, Upload, X } from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', sicilNo: '', titleId: 0, phoneInternal: '', phoneMobile: '', email: '', departmentId: 0,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDepartments().then((res) => setDepartments(res.data));
    api.getTitles().then((res) => setTitles(res.data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { setError('Dosya boyutu 2MB\'dan küçük olmalıdır'); return; }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let avatarUrl = '';
      if (avatar) {
        const uploadRes = await api.uploadFile(avatar);
        avatarUrl = uploadRes.url ?? uploadRes.data?.url;
      }
      await api.createContact({
        ...form,
        titleId: form.titleId || undefined,
        departmentId: form.departmentId || undefined,
        avatar: avatarUrl || undefined,
      });
      router.push('/admin/contacts');
    } catch (err: any) {
      setError(err.message || 'Kaydetme hatası');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/contacts" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-white">Yeni Kişi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Telefon rehberine yeni kişi ekleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Ad *</label>
            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" placeholder="Ad" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Soyad *</label>
            <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" placeholder="Soyad" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Sicil No</label>
          <input value={form.sicilNo} onChange={(e) => setForm({ ...form, sicilNo: e.target.value })} className="input-field" placeholder="S-1001" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ünvan</label>
          <select value={form.titleId} onChange={(e) => setForm({ ...form, titleId: Number(e.target.value) })} className="input-field">
            <option value={0} className="bg-surface">Ünvan Seçin</option>
            {titles.map((t) => (<option key={t.id} value={t.id} className="bg-surface">{t.name}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Dahili Telefon</label>
            <input value={form.phoneInternal} onChange={(e) => setForm({ ...form, phoneInternal: e.target.value })} className="input-field" placeholder="1001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cep Telefonu</label>
            <input value={form.phoneMobile} onChange={(e) => setForm({ ...form, phoneMobile: e.target.value })} className="input-field" placeholder="05XX XXX XX XX" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">E-posta</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="ornek@kurum.gov.tr" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Birim</label>
          <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: Number(e.target.value) })} className="input-field">
            <option value={0} className="bg-surface">Birim Seçin</option>
            {departments.map((d) => (<option key={d.id} value={d.id} className="bg-surface">{d.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Fotoğraf</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-raised border border-dashed border-white/[0.08] hover:border-brand-500/30 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Yükle</span>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="hidden" />
            </label>
            {avatarPreview && (
              <div className="relative">
                <img src={avatarPreview} alt="preview" className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/5" />
                <button type="button" onClick={() => { setAvatar(null); setAvatarPreview(''); }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <a href="/admin/contacts" className="btn-ghost">İptal</a>
        </div>
      </form>
    </div>
  );
}
