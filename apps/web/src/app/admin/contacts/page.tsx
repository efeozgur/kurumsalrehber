'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Contact } from '@/types';
import { Plus, Pencil, Trash2, Search, Phone, Building2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const loadContacts = async (p = 1, q?: string) => {
    setLoading(true);
    setPage(p);
    try {
      const res = await api.getAdminContacts(p, 50, q);
      setContacts(res.data);
      setTotalPages(res.meta.totalPages);
      setTotal(res.meta.total);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(1); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteContact(id);
      loadContacts(page);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getInitials = (f: string, l: string) => `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Kişiler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {total} kayıt</p>
        </div>
        <a href="/admin/contacts/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Yeni Kişi
        </a>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadContacts(1, searchQuery); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

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
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Kişi</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Sicil No</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Unvan</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Birim</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">Telefon</th>
                  <th className="text-right px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-xs font-semibold text-brand-400 flex-shrink-0">
                          {getInitials(contact.firstName, contact.lastName)}
                        </div>
                        <span className="text-white font-medium">{contact.firstName} {contact.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">{contact.sicilNo || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">{contact.title?.name || '—'}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {contact.department ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs">
                          <Building2 className="w-3 h-3" />
                          {contact.department.name}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 hidden lg:table-cell">{contact.phoneInternal || contact.phoneMobile || '—'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={`/admin/contacts/${contact.id}`} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
                          <Pencil className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(contact.id, `${contact.firstName} ${contact.lastName}`)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-500">Henüz kişi eklenmemiş</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.06]">
            <button
              onClick={() => loadContacts(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised text-sm text-gray-400 hover:text-white hover:bg-surface-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Önceki
            </button>
            <span className="text-sm text-gray-500">Sayfa {page} / {totalPages}</span>
            <button
              onClick={() => loadContacts(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised text-sm text-gray-400 hover:text-white hover:bg-surface-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Sonraki <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
