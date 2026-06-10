'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  Wrench, Settings, Users, BookOpen, Plus, Trash2, Save,
} from 'lucide-react';

export default function AdminTeknikServisPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<any>({ closedBy: 'user' });
  const [assignments, setAssignments] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'assignments' | 'solutions'>('settings');

  // Settings
  const [closedBy, setClosedBy] = useState('user');
  const [saving, setSaving] = useState(false);

  // Assignments
  const [newUserId, setNewUserId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Solutions
  const [newSolution, setNewSolution] = useState({ title: '', description: '', keywords: '' });
  const [solutionLoading, setSolutionLoading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      router.push('/admin');
      return;
    }

    api.getTechSettings().then((r) => {
      setSettings(r ?? { closedBy: 'user' });
      setClosedBy(r?.closedBy ?? 'user');
    }).catch(() => {});

    api.getTechAssignments().then((r) => setAssignments(r ?? [])).catch(() => {});
    api.getTechSolutions().then((r) => setSolutions(r ?? [])).catch(() => {});
  }, [user, router]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.updateTechSettings(closedBy);
      const r = await api.getTechSettings();
      setSettings(r ?? { closedBy });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAssignment = async () => {
    if (!newUserId) return;
    setAssignLoading(true);
    try {
      await api.assignTechUser(Number(newUserId));
      setNewUserId('');
      const r = await api.getTechAssignments();
      setAssignments(r ?? []);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveAssignment = async (userId: number) => {
    try {
      await api.removeTechUser(userId);
      const r = await api.getTechAssignments();
      setAssignments(r ?? []);
    } catch {}
  };

  const handleAddSolution = async () => {
    if (!newSolution.title || !newSolution.description) return;
    setSolutionLoading(true);
    try {
      await api.createTechSolution(newSolution);
      setNewSolution({ title: '', description: '', keywords: '' });
      const r = await api.getTechSolutions();
      setSolutions(r ?? []);
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleDeleteSolution = async (id: number) => {
    try {
      await api.deleteTechSolution(id);
      const r = await api.getTechSolutions();
      setSolutions(r ?? []);
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Wrench className="w-5 h-5 text-amber-400" />
        <h1 className="text-xl font-bold text-white">Teknik Servis Yönetimi</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-surface-raised border border-white/[0.06] w-fit">
        {[
          { id: 'settings', label: 'Ayarlar', icon: Settings },
          { id: 'assignments', label: 'Personel', icon: Users },
          { id: 'solutions', label: 'Çözümler', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Kayıt Kapatma Yetkisi</label>
            <p className="text-xs text-gray-500 mb-2">Arıza kaydını kimlerin kapatabileceğini belirleyin.</p>
            <select
              value={closedBy}
              onChange={(e) => setClosedBy(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white text-sm focus:outline-none focus:border-brand-500/40 transition-all"
            >
              <option value="user">Kullanıcı (talep sahibi)</option>
              <option value="tech">Teknik Personel</option>
            </select>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-medium transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>

          {saving && <p className="text-xs text-gray-500">Değişiklikler kaydedildi.</p>}
        </div>
      )}

      {/* Assignments */}
      {activeTab === 'assignments' && (
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6 space-y-5">
          <div>
            <h2 className="text-sm font-medium text-white mb-1">Teknik Personel</h2>
            <p className="text-xs text-gray-500 mb-4">Arıza kayıtlarına atanabilecek kullanıcıları yönetin.</p>

            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="Kullanıcı ID"
                className="flex-1 max-w-xs px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
              />
              <button
                onClick={handleAddAssignment}
                disabled={assignLoading || !newUserId}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                {assignLoading ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </div>
          </div>

          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz atanmış personel yok.</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((a: any) => (
                <div key={a.userId} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-sm font-semibold text-brand-400">
                      {a.user?.username?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm text-white">{a.user?.username ?? `#${a.userId}`}</p>
                      <p className="text-xs text-gray-500">{a.user?.email ?? ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAssignment(a.userId)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Solutions */}
      {activeTab === 'solutions' && (
        <div className="rounded-2xl bg-surface-raised border border-white/[0.06] p-6 space-y-5">
          <div>
            <h2 className="text-sm font-medium text-white mb-1">Sık Karşılaşılan Sorunlar</h2>
            <p className="text-xs text-gray-500 mb-4">Kullanıcıların arayabileceği çözümleri yönetin.</p>

            <div className="space-y-3 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <input
                type="text"
                value={newSolution.title}
                onChange={(e) => setNewSolution({ ...newSolution, title: e.target.value })}
                placeholder="Sorun başlığı"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
              />
              <textarea
                value={newSolution.description}
                onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })}
                placeholder="Çözüm açıklaması"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all resize-none"
              />
              <input
                type="text"
                value={newSolution.keywords}
                onChange={(e) => setNewSolution({ ...newSolution, keywords: e.target.value })}
                placeholder="Anahtar kelimeler (virgülle ayırın)"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
              />
              <button
                onClick={handleAddSolution}
                disabled={solutionLoading || !newSolution.title || !newSolution.description}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                {solutionLoading ? 'Ekleniyor...' : 'Çözüm Ekle'}
              </button>
            </div>
          </div>

          {solutions.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz çözüm eklenmemiş.</p>
          ) : (
            <div className="space-y-2">
              {solutions.map((s: any) => (
                <div key={s.id} className="flex items-start justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <h4 className="text-sm font-medium text-white">{s.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{s.description}</p>
                    {s.keywords && (
                      <p className="text-xs text-gray-600 mt-1">Anahtar: {s.keywords}</p>
                    )}
                  </div>
                  {user?.role === 'SUPER_ADMIN' && (
                    <button
                      onClick={() => handleDeleteSolution(s.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
