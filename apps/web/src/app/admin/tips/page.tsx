'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TipsPage() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTips = async () => {
    setLoading(true);
    try {
      const res = await api.getTips();
      setTips(res.data ?? res);
    } catch {
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTips(); }, []);

  const handleDelete = async (id: number, text: string) => {
    if (!confirm(`"${text.substring(0, 40)}..." silinecek?`)) return;
    try {
      await api.deleteTip(id);
      loadTips();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">İpuçları</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {tips.length} kayıt</p>
        </div>
        <a href="/admin/tips/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Yeni İpucu
        </a>
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
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">İpucu</th>
                  <th className="text-right px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {tips.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5 text-gray-500 w-12">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                        </div>
                        <span className="text-white">{item.text}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(item.id, item.text)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tips.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-12 text-gray-500">Henüz ipucu eklenmemiş</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
