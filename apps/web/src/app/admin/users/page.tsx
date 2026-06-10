'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { User } from '@/types';
import { Plus, Trash2, UserCog, Shield, RefreshCw } from 'lucide-react';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isSuper = currentUser?.role === 'SUPER_ADMIN';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  const syncUsers = async () => {
    setSyncing(true);
    try {
      const res: any = await api.syncUsers();
      const data = res.data ?? res;
      alert(data.message || JSON.stringify(data));
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const load = () => {
    api.getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createUser(username, password, role);
      setUsername(''); setPassword(''); setRole('ADMIN'); setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number, uname: string) => {
    if (!confirm(`"${uname}" kullanıcısı silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteUser(id);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kullanıcılar</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem yöneticileri</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={syncUsers} disabled={syncing} className="btn-ghost flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Hesapları Oluştur
          </button>
          {isSuper && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Yeni Kullanıcı
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-6 max-w-lg space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Yeni Kullanıcı Ekle</h3>
              <p className="text-xs text-gray-500">Admin yetkilerine sahip yeni kullanıcı</p>
            </div>
          </div>
          {error && <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /><p className="text-sm text-red-400">{error}</p></div>}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Kullanıcı Adı</label>
            <input required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="Kullanıcı adı" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Şifre</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
              <option value="ADMIN" className="bg-surface">Admin</option>
              <option value="SUPER_ADMIN" className="bg-surface">Süper Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm">Oluştur</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">İptal</button>
          </div>
        </form>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-8 h-8"><div className="absolute inset-0 rounded-full border-2 border-brand-500/20" /><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" /></div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Kullanıcı</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Ad Soyad</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Rol</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Oluşturulma</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-sm font-semibold text-brand-400">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-400 text-sm">
                      {user.contact ? [user.contact.firstName, user.contact.lastName].filter(Boolean).join(' ') : '-'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.role === 'SUPER_ADMIN'
                        ? 'bg-purple-500/10 text-purple-400'
                        : user.role === 'USER'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-brand-500/10 text-brand-400'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role === 'SUPER_ADMIN' ? 'Süper Admin' : user.role === 'USER' ? 'Personel' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {isSuper && user.role !== 'USER' && (
                      <button onClick={() => handleDelete(user.id, user.username)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">Henüz kullanıcı yok</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
