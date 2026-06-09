'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Ward } from '@/types';
import { Search, Eye, Trash2, Scale, Building2 } from 'lucide-react';

export default function KisitliListesi() {
  const { user } = useAuth();
  const isSuper = user?.role === 'SUPER_ADMIN';
  const router = useRouter();
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadWards = async () => {
    setLoading(true);
    try {
      const data = await api.getWards();
      setWards(data);
    } catch {
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWards(); }, []);

  const filtered = wards.filter((w) => {
    if (!search) return true;
    const q = search.toLocaleLowerCase('tr-TR');
    return (
      w.firstName.toLocaleLowerCase('tr-TR').includes(q) ||
      w.lastName.toLocaleLowerCase('tr-TR').includes(q) ||
      w.tcKimlikNo.includes(q) ||
      w.dosyaNo.toLocaleLowerCase('tr-TR').includes(q)
    );
  });

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteWard(id);
      loadWards();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="vesayet-body" style={{ backgroundColor: '#f1f5f9', padding: '32px 0 64px' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '30.4px', fontWeight: 700, color: '#1e293b', lineHeight: '36.48px' }}>Kısıtlı Listesi</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Tüm kısıtlıları görüntüleyin ve yönetin
            </p>
          </div>
        </div>

        <div className="v-card" style={{ padding: '20px 28px', marginBottom: '20px' }}>
          <div className="relative">
            <Search className="v-search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="v-input"
              style={{ paddingLeft: '44px', fontSize: '15px' }}
              placeholder="Kısıtlı adı, TC veya dosya no ile ara..."
            />
          </div>
        </div>

        <div className="v-card" style={{ padding: '0' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#0d6efd' }} />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="v-table">
                <thead>
                  <tr>
                    <th>Kısıtlı</th>
                    <th className="hidden sm:table-cell">TC Kimlik</th>
                    <th className="hidden md:table-cell">Dosya No</th>
                    <th style={{ textAlign: 'center' }}>Durum</th>
                    <th style={{ textAlign: 'center' }} className="hidden sm:table-cell">Hesap</th>
                    <th style={{ textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ward) => (
                    <tr key={ward.id} onClick={() => router.push(`/vesayet/kisitli/${ward.id}`)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea22, #764ba222)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Scale className="w-4 h-5" style={{ color: '#667eea' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '14px' }}>{ward.firstName} {ward.lastName}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', marginTop: '1px' }}>
                              <Building2 className="w-3 h-3" /> {ward.dosyaNo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className="font-mono" style={{ color: '#64748b', fontSize: '13px' }}>{ward.tcKimlikNo}</span>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="font-mono" style={{ color: '#64748b', fontSize: '13px' }}>{ward.dosyaNo}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {ward.isRemoved ? (
                          <span className="v-badge v-badge-passive">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc3545', display: 'inline-block' }} />
                            Pasif
                          </span>
                        ) : (
                          <span className="v-badge v-badge-active">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                            Aktif
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }} className="hidden sm:table-cell">
                        <span style={{ color: '#64748b', fontSize: '13px' }}>{ward.bankAccounts.length} hesap</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          <a href={`/vesayet/kisitli/${ward.id}`}
                            style={{ padding: '8px', borderRadius: '8px', color: '#9ca3af', display: 'inline-flex', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#0d6efd'; e.currentTarget.style.background = 'rgba(13,110,253,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          {isSuper && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(ward.id, `${ward.firstName} ${ward.lastName}`); }}
                              style={{ padding: '8px', borderRadius: '8px', color: '#9ca3af', display: 'inline-flex', transition: 'all 0.15s', background: 'none', border: 'none', cursor: 'pointer' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
                      {search ? 'Aramanızla eşleşen kısıtlı bulunamadı' : 'Henüz kısıtlı eklenmemiş'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
