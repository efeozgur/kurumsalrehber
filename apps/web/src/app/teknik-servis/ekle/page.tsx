'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Camera, Send, X } from 'lucide-react';

export default function EklePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Başlık ve açıklama zorunludur');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.createServiceRequest(title.trim(), description.trim(), image ?? undefined);
      router.push('/teknik-servis/kayitlarim');
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-white mb-6">Arıza Kaydı Oluştur</h1>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Yazıcı arızası"
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Arızayı detaylı olarak açıklayın..."
            rows={5}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Fotoğraf (isteğe bağlı)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="rounded-xl max-h-48 object-cover" />
              <button
                onClick={() => { setImage(null); setPreview(null); }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all"
            >
              <Camera className="w-4 h-4" />
              Fotoğraf Seç
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium transition-all"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Gönderiliyor...' : 'Arıza Kaydı Oluştur'}
        </button>
      </div>
    </div>
  );
}
