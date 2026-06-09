'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Ward, BankAccount } from '@/types';
import { Search, Building2 } from 'lucide-react';

interface AccountWithWard extends BankAccount {
  wardName: string;
}

export default function BankaHesaplari() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankFilter, setBankFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getWards();
        setWards(data);
      } catch {
        setWards([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allAccounts = useMemo<AccountWithWard[]>(() => {
    const list: AccountWithWard[] = [];
    wards.forEach(w => {
      w.bankAccounts.forEach(a => {
        list.push({ ...a, wardName: `${w.firstName} ${w.lastName}` });
      });
    });
    return list;
  }, [wards]);

  const banks = useMemo(() => {
    const set = new Set(allAccounts.map(a => a.bankName));
    return Array.from(set).sort();
  }, [allAccounts]);

  const currencies = useMemo(() => {
    const set = new Set(allAccounts.map(a => a.currency));
    return Array.from(set).sort();
  }, [allAccounts]);

  const filtered = allAccounts.filter(a => {
    if (bankFilter && a.bankName !== bankFilter) return false;
    if (currencyFilter && a.currency !== currencyFilter) return false;
    return true;
  });

  const currencyBadgeStyle = (cur: string) => {
    if (cur === 'TL') return { background: '#d1fae5', color: '#065f46' };
    if (cur === 'USD') return { background: '#dbeafe', color: '#1e40af' };
    return { background: '#e0e7ff', color: '#3730a3' };
  };

  return (
    <div className="vesayet-body" style={{ backgroundColor: '#f1f5f9', padding: '32px 0 64px' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '30.4px', fontWeight: 700, color: '#1e293b', lineHeight: '36.48px' }}>Banka Hesapları</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Tüm kısıtlılara ait banka hesaplarını görüntüleyin
            </p>
          </div>
        </div>

        <div className="v-card" style={{ padding: '20px 28px', marginBottom: '20px' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="v-search-icon" />
              <select
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
                className="v-input"
                style={{ paddingLeft: '44px', fontSize: '15px' }}
              >
                <option value="">Tüm Bankalar</option>
                {banks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div style={{ minWidth: '200px' }}>
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="v-input"
                style={{ fontSize: '15px' }}
              >
                <option value="">Tüm Para Birimleri</option>
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
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
                    <th>Banka Adı</th>
                    <th className="hidden sm:table-cell">IBAN</th>
                    <th>Kısıtlı Adı</th>
                    <th style={{ textAlign: 'right' }}>Bakiye</th>
                    <th style={{ textAlign: 'center' }}>Para Birimi</th>
                    <th style={{ textAlign: 'center' }} className="hidden md:table-cell">Vade</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((acc) => (
                    <tr key={acc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(13,110,253,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 className="w-4 h-5" style={{ color: '#0d6efd' }} />
                          </div>
                          <span style={{ fontWeight: 500, color: '#1e293b', fontSize: '14px' }}>{acc.bankName}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className="font-mono" style={{ color: '#64748b', fontSize: '13px' }}>{acc.iban}</span>
                      </td>
                      <td>
                        <span style={{ color: '#1e293b', fontSize: '14px' }}>{acc.wardName}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                          {acc.amount.toLocaleString('tr-TR')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="v-badge" style={currencyBadgeStyle(acc.currency)}>
                          {acc.currency}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }} className="hidden md:table-cell">
                        <span style={{ color: '#64748b', fontSize: '13px' }}>{acc.termType || '-'}</span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
                      Hesap bulunamadı
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
