'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  Camera, Send, X, Monitor, Printer, Network, Smartphone,
  Code, HelpCircle, AlertTriangle, CheckCircle, ChevronRight,
  FileText, Upload, Trash2,
} from 'lucide-react';

const categories = [
  { id: 'printer', label: 'Yazıcı', icon: Printer, desc: 'Çıktı alma, toner, kağıt sıkışması' },
  { id: 'computer', label: 'Bilgisayar', icon: Monitor, desc: 'Donanım, yazılım, yavaşlama' },
  { id: 'network', label: 'Ağ / İnternet', icon: Network, desc: 'Bağlantı sorunu, hız, kopma' },
  { id: 'phone', label: 'Telefon', icon: Smartphone, desc: 'Santral, hat, görüşme sorunu' },
  { id: 'software', label: 'Yazılım', icon: Code, desc: 'Program hataları, lisans, güncelleme' },
  { id: 'other', label: 'Diğer', icon: HelpCircle, desc: 'Yukarıdakilere uymayan sorunlar' },
];

const priorities = [
  { id: 'low', label: 'Düşük', color: 'text-gray-400 border-gray-500/30', dot: 'bg-gray-400' },
  { id: 'normal', label: 'Normal', color: 'text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  { id: 'high', label: 'Yüksek', color: 'text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  { id: 'urgent', label: 'Acil', color: 'text-red-400 border-red-500/30', dot: 'bg-red-400' },
];

export default function EklePage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.role === 'TEKNIK_SERVIS') {
      router.push('/teknik-servis/yonetim');
    }
  }, [user, router]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { setError('Dosya boyutu 5MB\'dan küçük olmalıdır'); return; }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Dosya boyutu 5MB\'dan küçük olmalıdır'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const removeImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Başlık ve açıklama zorunludur');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fullTitle = category ? `[${categories.find(c => c.id === category)?.label}] ${title.trim()}` : title.trim();
      await api.createServiceRequest(fullTitle, description.trim(), image ?? undefined);
      setSuccess(true);
      setTimeout(() => router.push('/teknik-servis/kayitlarim'), 1500);
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Arıza Kaydı Oluşturuldu</h2>
          <p className="text-gray-400">Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  const descCount = description.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Arıza Kaydı Oluştur</h1>
          <p className="text-sm text-gray-500 mt-0.5">Karşılaştığınız sorunu detaylıca açıklayın, size en kısa sürede yardımcı olalım.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Step 1: Category */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">1</span>
            <h2 className="text-sm font-semibold text-white">Arıza Türü</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 ml-8">Sorun hangi kategoriye ait?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const selected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(selected ? '' : cat.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-brand-500/10 border-brand-500/40'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-brand-400' : 'text-gray-500'}`} />
                  <p className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-300'}`}>{cat.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Title */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">2</span>
            <h2 className="text-sm font-semibold text-white">Başlık</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 ml-8">Sorunu özetleyen kısa bir başlık yazın</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={category ? `Örn: ${categories.find(c => c.id === category)?.desc.split(',')[0]} sorunu` : 'Örn: "Yazıcı çıktı almıyor", "İnternet bağlantısı kopuyor"'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
          />
        </div>

        {/* Step 3: Description */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">3</span>
            <h2 className="text-sm font-semibold text-white">Açıklama</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 ml-8">Sorunu mümkün olduğunca detaylı anlatın</p>
          <div className="bg-surface rounded-xl border border-white/[0.06] focus-within:border-brand-500/40 transition-all">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sorun ne zaman başladı?&#10;Hangi hata mesajını alıyorsunuz?&#10;Daha önce bu sorunla karşılaştınız mı?&#10;Sorunu çözmek için ne yapmayı denediniz?"
              rows={6}
              className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-600 text-sm resize-none focus:outline-none"
            />
            <div className="flex justify-end px-4 pb-2">
              <span className={`text-xs ${descCount > 500 ? 'text-orange-400' : 'text-gray-600'}`}>{descCount}/1000</span>
            </div>
          </div>
        </div>

        {/* Step 4: Priority */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">4</span>
            <h2 className="text-sm font-semibold text-white">Öncelik</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 ml-8">Sorunun aciliyetini belirtin</p>
          <div className="flex gap-2 flex-wrap">
            {priorities.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  priority === p.id
                    ? `${p.color} bg-white/5`
                    : 'text-gray-500 border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${p.dot}`} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 5: Image */}
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">5</span>
            <h2 className="text-sm font-semibold text-white">Fotoğraf</h2>
          </div>
          <p className="text-xs text-gray-600 mb-4 ml-8">Sorunu görselleştiren bir fotoğraf ekleyin (isteğe bağlı, max 5MB)</p>

          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Önizleme" className="rounded-xl max-h-56 object-cover border border-white/[0.06]" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              ref={dropRef}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver
                  ? 'border-brand-500/50 bg-brand-500/5'
                  : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <Upload className={`w-8 h-8 mb-3 ${dragOver ? 'text-brand-400' : 'text-gray-600'}`} />
              <p className="text-sm text-gray-400 font-medium">Fotoğraf seçmek için tıklayın</p>
              <p className="text-xs text-gray-600 mt-1">veya sürükleyip bırakın</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </div>

        {/* Preview */}
        {title.trim() && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-white">Kayıt Önizleme</h3>
            </div>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-gray-500">Tür:</span> <span className="text-gray-300">{category ? categories.find(c => c.id === category)?.label : 'Belirtilmemiş'}</span></p>
              <p><span className="text-gray-500">Öncelik:</span> <span className="text-gray-300">{priorities.find(p => p.id === priority)?.label}</span></p>
              <p><span className="text-gray-500">Başlık:</span> <span className="text-gray-300">{title}</span></p>
              <p><span className="text-gray-500">Açıklama:</span> <span className="text-gray-300">{description.slice(0, 100)}{description.length > 100 ? '...' : ''}</span></p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !description.trim()}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg shadow-brand-500/20"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Arıza Kaydı Oluştur
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
