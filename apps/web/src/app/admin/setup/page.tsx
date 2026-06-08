'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Phone, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function SetupPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/setup-check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.needsSetup) {
          setSetupDone(true);
          router.push('/admin/login');
        }
      })
      .catch(() => {});
  }, [router]);

  if (setupDone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    if (password.length < 3) {
      setError('Şifre en az 3 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await api.setup(username, password);
      setSuccess(true);
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Kurulum sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-xl font-bold text-white">Telefon Rehberi</h1>
            <p className="text-sm text-gray-500">Kurulum</p>
          </div>
        </div>

        {success ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Kurulum Tamamlandı</h2>
            <p className="text-sm text-gray-400">Giriş sayfasına yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">İlk Admin Kurulumu</h2>
                <p className="text-xs text-gray-500 mt-0.5">Sistem ilk kez çalıştırılıyor</p>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Kullanıcı Adı</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Şifre Tekrar</label>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Kurulum yapılıyor...' : 'Kurulumu Tamamla'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
