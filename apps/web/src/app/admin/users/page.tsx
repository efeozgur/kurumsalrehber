'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { User } from '@/types';
import { Plus, Trash2, UserCog, Shield, RefreshCw, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  USER: 'Personel',
  TEKNIK_SERVIS: 'Teknik Servis',
  VESAYET_ADMIN: 'Vesayet Admin',
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-500/10 text-purple-400',
  ADMIN: 'bg-brand-500/10 text-brand-400',
  USER: 'bg-emerald-500/10 text-emerald-400',
  TEKNIK_SERVIS: 'bg-amber-500/10 text-amber-400',
  VESAYET_ADMIN: 'bg-blue-500/10 text-blue-400',
};

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

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = (p = page, q = searchQuery) => {
    setLoading(true);
    api.getUsers(q || undefined, p, limit)
      .then((res) => {
        const body = res.data ?? res;
        setUsers(Array.isArray(body) ? body : body.data ?? []);
        const meta = res.meta ?? body.meta;
        if (meta) {
          setTotalPages(meta.totalPages ?? 1);
          setTotal(meta.total ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1, searchQuery); }, []);

  const handleSearch = () => {
    setPage(1);
    load(1, searchQuery);
  };

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    load(1, '');
  };

  const goToPage = (p: number) => {
    setPage(p);
    load(p, searchQuery);
  };

  const syncUsers = async () => {
    setSyncing(true);
    try {
      const res: any = await api.syncUsers();
      const data = res.data ?? res;
      alert(data.message || JSON.stringify(data));
      load(1, searchQuery);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createUser(username, password, role);
      setUsername(''); setPassword(''); setRole('ADMIN'); setShowForm(false);
      load(1, searchQuery);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number, uname: string) => {
    if (!confirm(`"${uname}" kullanıcısı silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteUser(id);
      load(page, searchQuery);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await api.updateUserRole(id, newRole);
      load(page, searchQuery);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getRoleBadge = (role: string) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${ROLE_COLORS[role] ?? 'bg-gray-500/10 text-gray-400'}`}>
      <Shield className="w-3 h-3" />
      {ROLE_LABELS[role] ?? role}
    </span>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kullanıcılar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total > 0 ? `${total} kayıt` : 'Sistem yöneticileri'}
          </p>
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

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-6 max-w-lg space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Yeni Kullanıcı Ekle</h3>
              <p className="text-xs text-gray-500">Yeni kullanıcı hesabı oluşturun</p>
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
              <option value="TEKNIK_SERVIS" className="bg-surface">Teknik Servis</option>
              <option value="USER" className="bg-surface">Personel</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm">Oluştur</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">İptal</button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder="Kullanıcı adı, ad, soyad veya sicil ile ara..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-brand-500/40 transition-all"
          />
          {searchQuery && (
            <button onClick={handleClearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={handleSearch} className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-all">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Users Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-8 h-8"><div className="absolute inset-0 rounded-full border-2 border-brand-500/20" /><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" /></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <UserCog className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Kullanıcı bulunamadı</p>
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSuper && (
                        <>
                          <select
                            value=""
                            onChange={(e) => { if (e.target.value) handleRoleChange(user.id, e.target.value); }}
                            className="px-2 py-1.5 rounded-lg text-xs bg-surface border border-white/[0.08] text-gray-400 hover:text-white focus:outline-none focus:border-brand-500/40 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-surface">Yetki Ver</option>
                            <option value="USER" className="bg-surface">Personel</option>
                            <option value="TEKNIK_SERVIS" className="bg-surface">Teknik Servis</option>
                            <option value="ADMIN" className="bg-surface">Admin</option>
                            <option value="SUPER_ADMIN" className="bg-surface">Süper Admin</option>
                            <option value="VESAYET_ADMIN" className="bg-surface">Vesayet Admin</option>
                          </select>
                          {user.role !== 'USER' && (
                            <button
                              onClick={() => handleDelete(user.id, user.username)}
                              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Kullanıcıyı Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-brand-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 inline" /> Önceki
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                      : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-400 hover:text-white hover:border-brand-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Sonraki <ChevronRight className="w-4 h-4 inline" />
          </button>
        </div>
      )}

      {total > 0 && (
        <p className="text-center text-xs text-gray-600 mt-4">
          Toplam {total} kayıt · Sayfa {page}/{totalPages}
        </p>
      )}
    </div>
  );
}
