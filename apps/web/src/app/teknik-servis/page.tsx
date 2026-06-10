'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wrench, PlusCircle, List, ArrowRight, BookOpen, ChevronDown, ChevronUp, Monitor, Printer, Network, Smartphone, Code, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api';

const categoryIcons: Record<string, any> = {
  printer: Printer,
  computer: Monitor,
  network: Network,
  phone: Smartphone,
  software: Code,
};

export default function TeknikServisHome() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllSolutions()
      .then((data) => setSolutions(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = showAll ? solutions : solutions.slice(0, 10);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
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

      {/* Sık Karşılaşılan Sorunlar */}
      <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Sık Karşılaşılan Sorunlar</h2>
          {!loading && <span className="text-xs text-gray-600">({solutions.length})</span>}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Daha önce kaydedilmiş sorun ve çözümlere göz atın
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Henüz kaydedilmiş çözüm bulunmuyor</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayed.map((s: any) => {
                const catId = s.keywords?.split(',')[0]?.trim().toLowerCase();
                const Icon = categoryIcons[catId] ?? HelpCircle;
                const keywords = (s.keywords ?? '').split(',').map((k: string) => k.trim()).filter(Boolean);
                return (
                  <div
                    key={s.id}
                    className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4.5 h-4.5 text-amber-400" />
                      </div>
                      <h3 className="text-white font-medium text-sm leading-snug pt-1">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-3">
                      {s.description}
                    </p>
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.map((kw: string) => (
                          <span key={kw} className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-gray-500">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                    {s.createdAt && (
                      <p className="text-[10px] text-gray-700 mt-2">
                        {new Date(s.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {solutions.length > 10 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] text-sm text-gray-400 hover:text-white transition-all"
                >
                  {showAll ? (
                    <>Daha Az Göster <ChevronUp className="w-4 h-4" /></>
                  ) : (
                  <>Tümünü Göster ({solutions.length}) <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
