'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Lightbulb, Timer, ChevronLeft, ChevronRight, Save } from 'lucide-react';

export default function TipsPage() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipSpeed, setTipSpeed] = useState('4000');
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [speedSaved, setSpeedSaved] = useState(false);

  const loadTips = async () => {
    setLoading(true);
    try {
      const [tipsRes, settingsRes] = await Promise.all([
        api.getTips(),
        api.getSettings(),
      ]);
      setTips(tipsRes.data ?? tipsRes);
      if (settingsRes?.data?.tipSpeed) setTipSpeed(settingsRes.data.tipSpeed);
      if (settingsRes?.data?.tipsEnabled !== undefined) setTipsEnabled(settingsRes.data.tipsEnabled !== 'false');
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

  const handleToggleTips = async (val: boolean) => {
    setTipsEnabled(val);
    try {
      await api.updateSetting('tipsEnabled', val ? 'true' : 'false');
    } catch (err: any) {
      setTipsEnabled(!val);
      alert(err.message);
    }
  };

  const handleSpeedSave = async () => {
    const val = parseInt(tipSpeed, 10);
    if (isNaN(val) || val < 500) { alert('En az 500 ms olabilir'); return; }
    try {
      const res = await api.updateSetting('tipSpeed', String(val));
      if (res?.data?.value) setTipSpeed(res.data.value);
      setSpeedSaved(true);
      setTimeout(() => setSpeedSaved(false), 2000);
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

      {/* Show/Hide Toggle */}
      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">İpuçlarını Göster</h3>
              <p className="text-xs text-gray-500 mt-0.5">Anasayfada ipuçlarının görünmesini aç/kapat</p>
            </div>
          </div>
          <button
            onClick={() => handleToggleTips(!tipsEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              tipsEnabled ? 'bg-brand-500' : 'bg-white/10'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              tipsEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Speed Setting */}
      {tipsEnabled && (
        <div className="glass rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Timer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">İpucu Geçiş Hızı</h3>
                <p className="text-xs text-gray-500 mt-0.5">İpuçlarının otomatik geçiş süresi (milisaniye)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={tipSpeed}
                onChange={(e) => setTipSpeed(e.target.value)}
                className="w-28 px-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm text-center focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
                min={500}
                step={500}
              />
              <button onClick={handleSpeedSave} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                speedSaved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-brand-500/15 text-brand-400 border border-brand-500/30 hover:bg-brand-500/20'
              }`}>
                <Save className="w-4 h-4" />
                {speedSaved ? 'Kaydedildi' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

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
