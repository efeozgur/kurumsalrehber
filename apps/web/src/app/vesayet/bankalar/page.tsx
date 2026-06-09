'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Bank } from '@/types';
import { Landmark, Plus, Pencil, Trash2, Save, X } from 'lucide-react';

export default function BankalarPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const loadBanks = async () => {
    setLoading(true);
    try {
      const data = await api.getBanks();
      setBanks(data);
    } catch {
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBanks(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.createBank(name.trim());
      setName('');
      await loadBanks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (bank: Bank) => {
    setEditingId(bank.id);
    setEditName(bank.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await api.updateBank(id, editName.trim());
      setEditingId(null);
      setEditName('');
      await loadBanks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="vesayet-body" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="v-section-header" style={{ paddingBottom: 0, marginBottom: 0 }}>
            <div className="v-section-icon" style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}>
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="v-section-title" style={{ fontSize: '22px' }}>Banka Yönetimi</h1>
              <p className="v-section-desc">Banka listesini görüntüleyin ve yeni banka ekleyin</p>
            </div>
          </div>
        </div>

        <div className="v-card" style={{ marginBottom: '24px' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px' }}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="v-input"
              placeholder="Banka adı yazın"
              style={{ flex: 1 }}
            />
            <button type="submit" className="v-btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <Plus className="w-4 h-4" /> Ekle
            </button>
          </form>
        </div>

        <div className="v-card" style={{ padding: '0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>Yükleniyor...</div>
          ) : banks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
              <Landmark className="w-8 h-8" style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              Henüz banka eklenmemiş
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="v-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Banka Adı</th>
                    <th style={{ textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((bank) => (
                    <tr key={bank.id}>
                      <td style={{ color: '#94a3b8', fontSize: '13px' }}>{bank.id}</td>
                      <td style={{ fontWeight: 500, color: '#1e293b' }}>
                        {editingId === bank.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="v-input text-sm"
                            style={{ maxWidth: '320px' }}
                            autoFocus
                          />
                        ) : (
                          bank.name
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          {editingId === bank.id ? (
                            <>
                              <button
                                onClick={() => saveEdit(bank.id)}
                                style={{ padding: '6px', borderRadius: '6px', color: '#28a745', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(40,167,69,0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                style={{ padding: '6px', borderRadius: '6px', color: '#6c757d', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108,117,125,0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEdit(bank)}
                              style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#0d6efd'; e.currentTarget.style.background = 'rgba(13,110,253,0.08)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (!confirm(`${bank.name} silinecek. Emin misiniz?`)) return;
                              try {
                                await api.deleteBank(bank.id);
                                await loadBanks();
                              } catch (err: any) {
                                alert(err.message);
                              }
                            }}
                            style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
