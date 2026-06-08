'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Title } from '@/types';
import { Plus, Pencil, Trash2, BadgeCheck, Users } from 'lucide-react';

export default function TitlesPage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTitles = async () => {
    setLoading(true);
    try {
      const res = await api.getTitles();
      setTitles(res.data);
    } catch {
      setTitles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTitles(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteTitle(id);
      loadTitles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Ünvanlar</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {titles.length} kayıt</p>
        </div>
        <a href="/admin/titles/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Yeni Ünvan
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
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Ünvan</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Kişi Sayısı</th>
                  <th className="text-right px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {titles.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
                          <BadgeCheck className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs">
                        <Users className="w-3.5 h-3.5" />
                        {item._count?.contacts ?? 0} kişi
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={`/admin/titles/${item.id}`} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
                          <Pencil className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {titles.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-12 text-gray-500">Henüz ünvan eklenmemiş</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
