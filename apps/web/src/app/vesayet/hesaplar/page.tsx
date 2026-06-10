'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Ward, BankAccount, GoldAccount } from '@/types';
import { Search, Building2, CircleDot } from 'lucide-react';

interface AccountWithWard extends BankAccount {
  wardName: string;
}

interface GoldWithWard extends GoldAccount {
  wardName: string;
}

export default function BankaHesaplari() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'bank' | 'gold'>('bank');
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

  const allGoldAccounts = useMemo<GoldWithWard[]>(() => {
    const list: GoldWithWard[] = [];
    wards.forEach(w => {
      (w.goldAccounts || []).forEach(g => {
        list.push({ ...g, wardName: `${w.firstName} ${w.lastName}` });
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

  const goldBanks = useMemo(() => {
    const set = new Set(allGoldAccounts.map(g => g.bankName));
    return Array.from(set).sort();
  }, [allGoldAccounts]);

  const goldTypes = useMemo(() => {
    const set = new Set(allGoldAccounts.map(g => g.goldType));
    return Array.from(set).sort();
  }, [allGoldAccounts]);

  const [goldBankFilter, setGoldBankFilter] = useState('');
  const [goldTypeFilter, setGoldTypeFilter] = useState('');

  const filteredGold = allGoldAccounts.filter(g => {
    if (goldBankFilter && g.bankName !== goldBankFilter) return false;
    if (goldTypeFilter && g.goldType !== goldTypeFilter) return false;
    return true;
  });

  const currencyBadgeStyle = (cur: string) => {
    if (cur === 'TL') return { background: '#d1fae5', color: '#065f46' };
    if (cur === 'USD') return { background: '#dbeafe', color: '#1e40af' };
    return { background: '#e0e7ff', color: '#3730a3' };
  };

  return (
    <div className="vesayet-body" style={{ backgroundColor: '#f2f5f7', padding: '32px 0 64px' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '30.4px', fontWeight: 700, color: '#212529', lineHeight: '36.48px' }}>Hesaplar</h1>
            <p style={{ color: '#676c79', fontSize: '14px', marginTop: '4px' }}>
              Tüm kısıtlılara ait hesap ve altın bilgilerini görüntüleyin
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
          <button
            onClick={() => setTab('bank')}
            style={{
              padding: '10px 20px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 500, transition: 'all 0.15s',
              background: tab === 'bank' ? '#5766da' : '#fff',
              color: tab === 'bank' ? '#fff' : '#6c757d',
              boxShadow: tab === 'bank' ? 'rgba(87,102,218,0.3) 0px 2px 6px 0px' : 'rgba(0, 0, 0, 0.06) 0px 0px 24px 0px, rgba(0, 0, 0, 0.02) 0px 1px 0px 0px',
            }}
          >
            <Building2 className="w-4 h-4" style={{ display: 'inline', marginRight: '6px' }} />
            Banka Hesapları ({allAccounts.length})
          </button>
          <button
            onClick={() => setTab('gold')}
            style={{
              padding: '10px 20px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 500, transition: 'all 0.15s',
              background: tab === 'gold' ? '#5766da' : '#fff',
              color: tab === 'gold' ? '#fff' : '#6c757d',
              boxShadow: tab === 'gold' ? 'rgba(87,102,218,0.3) 0px 2px 6px 0px' : 'rgba(0, 0, 0, 0.06) 0px 0px 24px 0px, rgba(0, 0, 0, 0.02) 0px 1px 0px 0px',
            }}
          >
            <CircleDot className="w-4 h-4" style={{ display: 'inline', marginRight: '6px' }} />
            Altın Hesapları ({allGoldAccounts.length})
          </button>
        </div>

        {tab === 'bank' && (
          <>
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
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#5766da' }} />
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
                              <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: 'rgba(87,102,218,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building2 className="w-4 h-5" style={{ color: '#5766da' }} />
                              </div>
                              <span style={{ fontWeight: 500, color: '#212529', fontSize: '14px' }}>{acc.bankName}</span>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell">
                            <span className="font-mono" style={{ color: '#676c79', fontSize: '13px' }}>{acc.iban}</span>
                          </td>
                          <td>
                            <span style={{ color: '#212529', fontSize: '14px' }}>{acc.wardName}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 600, color: '#212529', fontSize: '14px' }}>
                              {acc.amount.toLocaleString('tr-TR')}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="v-badge" style={currencyBadgeStyle(acc.currency)}>
                              {acc.currency}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }} className="hidden md:table-cell">
                            <span style={{ color: '#676c79', fontSize: '13px' }}>{acc.termType || '-'}</span>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: '#98a6ad', fontSize: '14px' }}>
                          Hesap bulunamadı
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'gold' && (
          <>
            <div className="v-card" style={{ padding: '20px 28px', marginBottom: '20px' }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="v-search-icon" />
                  <select
                    value={goldBankFilter}
                    onChange={(e) => setGoldBankFilter(e.target.value)}
                    className="v-input"
                    style={{ paddingLeft: '44px', fontSize: '15px' }}
                  >
                    <option value="">Tüm Bankalar</option>
                    {goldBanks.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div style={{ minWidth: '200px' }}>
                  <select
                    value={goldTypeFilter}
                    onChange={(e) => setGoldTypeFilter(e.target.value)}
                    className="v-input"
                    style={{ fontSize: '15px' }}
                  >
                    <option value="">Tüm Altın Türleri</option>
                    {goldTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
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
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#5766da' }} />
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="v-table">
                    <thead>
                      <tr>
                        <th>Banka Adı</th>
                        <th>Kısıtlı Adı</th>
                        <th>Altın Türü</th>
                        <th style={{ textAlign: 'right' }}>Gram</th>
                        <th style={{ textAlign: 'center' }}>Adet</th>
                        <th style={{ textAlign: 'right' }}>Toplam Gram</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGold.map((g) => (
                        <tr key={g.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: 'rgba(255,193,7,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircleDot className="w-4 h-5" style={{ color: '#b8860b' }} />
                              </div>
                              <span style={{ fontWeight: 500, color: '#212529', fontSize: '14px' }}>{g.bankName}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ color: '#212529', fontSize: '14px' }}>{g.wardName}</span>
                          </td>
                          <td>
                            <span className="v-badge" style={{ background: 'rgba(255,193,7,0.12)', color: '#92400e' }}>{g.goldType}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 600, color: '#212529' }}>{g.gram.toFixed(2)}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ color: '#676c79' }}>{g.quantity}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 700, color: '#b8860b' }}>{(g.gram * g.quantity).toFixed(2)} gr</span>
                          </td>
                        </tr>
                      ))}
                      {filteredGold.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: '#98a6ad', fontSize: '14px' }}>
                          Altın hesabı bulunamadı
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
