'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Puzzle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadModules = async () => {
    setLoading(true);
    try {
      const res = await api.getModules();
      setModules(res.data ?? res);
    } catch {
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadModules(); }, []);

  const handleToggle = async (id: number, enabled: boolean) => {
    try {
      await api.updateModule(id, enabled);
      loadModules();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Modüller</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {modules.length} modül</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Modül</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Açıklama</th>
                  <th className="text-right px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {modules.map((mod) => (
                  <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                          <Puzzle className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="text-white font-medium">{mod.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{mod.description || '-'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleToggle(mod.id, !mod.enabled)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          mod.enabled
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-gray-500 border border-white/[0.06]'
                        }`}
                      >
                        {mod.enabled ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        {mod.enabled ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
