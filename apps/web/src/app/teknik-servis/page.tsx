'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, PlusCircle, List, Search, ArrowRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export default function TeknikServisHome() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [solutions, setSolutions] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await api.searchSolutions(searchQuery.trim());
      setSolutions(res ?? []);
    } catch {
      setSolutions([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 mb-4">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Teknik Servis</h1>
        <p className="text-gray-400">Arıza kaydı oluşturun veya mevcut kayıtlarınızı takip edin</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/teknik-servis/ekle"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 p-6 hover:border-brand-500/40 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Arıza Kaydı Oluştur</h3>
              <p className="text-sm text-gray-400 mt-1">Yeni bir arıza talebi gönderin</p>
            </div>
          </div>
          <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/teknik-servis/kayitlarim"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-6 hover:border-amber-500/40 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <List className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Kayıtlarım</h3>
              <p className="text-sm text-gray-400 mt-1">Arıza kayıtlarınızı görüntüleyin</p>
            </div>
          </div>
          <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Solution Search */}
      <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Sık Karşılaşılan Sorunlar</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Yaşadığınız sorunu yazarak daha önce kaydedilmiş çözümleri arayabilirsiniz.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Örn: yazıcı arızası, şifre sıfırlama..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-medium transition-all"
          >
            {searching ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>

        {solutions !== null && (
          <div className="mt-6 space-y-3">
            {solutions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Çözüm bulunamadı.</p>
            ) : (
              solutions.map((s: any) => (
                <div key={s.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="text-white font-medium text-sm mb-1">{s.title}</h4>
                  <p className="text-gray-400 text-sm">{s.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
