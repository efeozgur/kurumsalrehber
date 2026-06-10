'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Phone, KeyRound, Copy, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SifreUnuttumPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ token: string; firstName?: string; lastName?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res: any = await api.forgotPassword(username);
      const data = res.data ?? res;
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Talep gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (result) {
      navigator.clipboard.writeText(result.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />

        <div className="relative w-full max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Burdur Adliyesi</h1>
              <p className="text-sm text-gray-500">Telefon Rehberi</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Şifre Sıfırlama Kodu</h2>
            {result.firstName && (
              <p className="text-sm text-gray-400 mb-2">
                {result.firstName} {result.lastName}
              </p>
            )}
            <p className="text-xs text-gray-500 mb-6">
              Aşağıdaki kodu not alın ve &quot;Kod ile Devam Et&quot; sayfasında kullanın.
            </p>

            <div className="bg-surface-raised rounded-xl p-4 mb-6 border border-white/[0.08]">
              <code className="text-lg font-mono font-bold text-brand-400 tracking-widest select-all">
                {result.token}
              </code>
            </div>

            <button
              onClick={copyToken}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kodu Kopyala
                </>
              )}
            </button>

            <a
              href="/giris/sifre-sifirla"
              className="flex items-center justify-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Kod ile Devam Et
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="mt-4">
              <a href="/giris" className="text-sm text-gray-500 hover:text-brand-400 transition-colors">
                ← Giriş Sayfasına Dön
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Burdur Adliyesi</h1>
            <p className="text-sm text-gray-500">Telefon Rehberi</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Şifremi Unuttum</h2>
              <p className="text-xs text-gray-500 mt-0.5">Sicil numaranızı girin, sıfırlama kodu alın</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sicil No</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Sicil numaranızı girin"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Kod Al
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/giris" className="text-sm text-gray-500 hover:text-brand-400 transition-colors">
              ← Giriş Sayfasına Dön
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
