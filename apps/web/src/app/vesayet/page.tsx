'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Ward } from '@/types';
import {
  Scale, Building2, Banknote, TrendingUp,
  DollarSign, Euro, Download, FileText, PieChart,
  Globe, RefreshCw,
} from 'lucide-react';

interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  CHF: number;
  updatedAt: string;
}

interface ReportSummary {
  totalWards: number;
  activeWards: number;
  totalAccounts: number;
  balanceByCurrency: Record<string, number>;
  bankBreakdown: Record<string, { count: number; byCurrency: Record<string, number> }>;
  currencyBreakdown: Record<string, number>;
  averageByCurrency: Record<string, number>;
}

export default function VesayetDashboard() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(true);

  const currencies = ['TL', 'USD', 'EUR'] as const;

  const loadAll = async () => {
    setLoading(true);
    try {
      const [wardsData, ratesData, reportData] = await Promise.all([
        api.getWards(),
        api.getExchangeRates(),
        api.getReportSummary(),
      ]);
      setWards(wardsData);
      setRates(ratesData);
      setReport(reportData);
    } catch {
      setWards([]);
    } finally {
      setLoading(false);
      setRatesLoading(false);
      setReportLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const totalWards = wards.length;
  const totalAccounts = wards.reduce((sum, w) => sum + w.bankAccounts.length, 0);

  const balanceByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    wards.forEach(w => w.bankAccounts.forEach(a => {
      map[a.currency] = (map[a.currency] || 0) + a.amount;
    }));
    return map;
  }, [wards]);

  const bankTotals = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    wards.forEach(w => w.bankAccounts.forEach(a => {
      if (!map[a.bankName]) map[a.bankName] = {};
      map[a.bankName][a.currency] = (map[a.bankName][a.currency] || 0) + a.amount;
    }));
    return Object.entries(map).sort((a, b) => {
      const aTl = a[1]['TL'] || 0, bTl = b[1]['TL'] || 0;
      return bTl - aTl;
    });
  }, [wards]);

  const formatRate = (rate: number) => rate.toFixed(4);

  const totalWardsStat = report?.totalWards ?? totalWards;
  const activeWardsStat = report?.activeWards ?? wards.filter(w => !w.isRemoved).length;
  const totalAccountsStat = report?.totalAccounts ?? totalAccounts;

  return (
    <div className="vesayet-body" style={{ backgroundColor: '#f1f5f9', padding: '32px 0 64px' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 style={{ fontSize: '30.4px', fontWeight: 700, color: '#1e293b', lineHeight: '36.48px' }}>Vesayet Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Vesayet altındaki kısıtlıları ve banka hesaplarını yönetin
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="v-card-stat flex items-center gap-5">
            <div className="v-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="v-stat-value">{totalWardsStat}</div>
              <div className="v-stat-label">Toplam Kısıtlı</div>
              <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', fontWeight: 500 }}>{activeWardsStat} aktif</div>
            </div>
          </div>

          <div className="v-card-stat flex items-center gap-5">
            <div className="v-stat-icon" style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}>
              <Banknote className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="v-stat-value">{totalAccountsStat}</div>
              <div className="v-stat-label">Toplam Hesap</div>
            </div>
          </div>

          <div className="v-card-stat">
            <div className="v-stat-label" style={{ marginBottom: '10px', fontSize: '13px' }}>Toplam Bakiye</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currencies.map(cur => {
                const total = balanceByCurrency[cur] ?? 0;
                const avg = report?.averageByCurrency?.[cur];
                if (total === 0 && !report) return null;
                return (
                  <div key={cur} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff',
                        background: cur === 'TL' ? '#28a745' : cur === 'USD' ? '#0d6efd' : '#667eea' }}>
                        {cur}
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                        {total.toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {avg != null && (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Ort: {avg.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                    )}
                  </div>
                );
              })}
              {Object.keys(balanceByCurrency).length === 0 && !report && (
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Veri yok</span>
              )}
            </div>
          </div>

          <div className="v-card-stat flex items-center gap-5">
            <div className="v-stat-icon" style={{ background: 'linear-gradient(135deg, #ffc107, #d4a005)' }}>
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="v-stat-label">Para Birimleri</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                {Object.entries(balanceByCurrency).length > 0 ? currencies.map(cur => {
                  const total = balanceByCurrency[cur] ?? 0;
                  if (total === 0) return null;
                  return (
                    <div key={cur} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{cur}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{total.toLocaleString('tr-TR')}</div>
                    </div>
                  );
                }) : (
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Veri yok</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="v-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign className="w-5 h-6 text-white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Güncel Kurlar</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {rates?.updatedAt ? `Güncelleme: ${rates.updatedAt}` : 'Yükleniyor...'}
                  </p>
                </div>
              </div>
              <button onClick={loadAll} className="v-btn-ghost" style={{ padding: '8px 12px', fontSize: '12px' }}>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            {ratesLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#0d6efd' }} />
                </div>
              </div>
            ) : rates ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { code: 'USD', name: 'Dolar', icon: DollarSign, rate: rates.USD, color: '#0d6efd', bg: 'rgba(13,110,253,0.08)' },
                  { code: 'EUR', name: 'Euro', icon: Euro, rate: rates.EUR, color: '#0d6efd', bg: 'rgba(13,110,253,0.08)' },
                  { code: 'GBP', name: 'Sterlin', icon: Banknote, rate: rates.GBP, color: '#667eea', bg: 'rgba(102,126,234,0.08)' },
                  { code: 'CHF', name: 'İsviçre Frangı', icon: Banknote, rate: rates.CHF, color: '#28a745', bg: 'rgba(40,167,69,0.08)' },
                ].map((cur) => (
                  <div key={cur.code} style={{ padding: '12px', borderRadius: '10px', background: cur.bg, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: cur.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <cur.icon className="w-3.5 h-4 text-white" />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{cur.name} ({cur.code})</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{formatRate(cur.rate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>Kur bilgisi alınamadı</div>
            )}
          </div>

          <div className="v-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #28a745, #20a039)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Hesap Bakiye Özeti</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Bankalara göre dağılım</p>
              </div>
            </div>
            {bankTotals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>
                Henüz banka hesabı bulunmuyor
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {bankTotals.slice(0, 6).map(([bank, byCur]) => {
                  const tlAmt = byCur['TL'] || 0;
                  const tlPct = (balanceByCurrency['TL'] || 1) > 0 ? (tlAmt / (balanceByCurrency['TL'] || 1)) * 100 : 0;
                  return (
                    <div key={bank}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>{bank}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {currencies.map(cur => {
                            const amt = byCur[cur];
                            if (!amt) return null;
                            return (
                              <span key={cur} style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                                {amt.toLocaleString('tr-TR')} {cur}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      {tlAmt > 0 && (
                        <>
                          <div style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: '3px', width: `${tlPct}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)', transition: 'width 0.5s ease' }} />
                          </div>
                          <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>TL dağılım: %{tlPct.toFixed(1)}</div>
                        </>
                      )}
                    </div>
                  );
                })}
                {bankTotals.length > 6 && (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#0d6efd', marginTop: '4px' }}>
                    +{bankTotals.length - 6} banka daha...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="v-card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffc107, #d4a005)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText className="w-5 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Raporlamalar</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Hızlı rapor erişimi</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            <a href="/vesayet" onClick={(e) => { e.preventDefault(); window.print(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0d6efd'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,110,253,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(13,110,253,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download className="w-4 h-5" style={{ color: '#0d6efd' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Kısıtlı Listesi</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Tüm kısıtlıları görüntüle</div>
              </div>
            </a>
            <a href="/vesayet" onClick={(e) => { e.preventDefault(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(102,126,234,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 className="w-4 h-5" style={{ color: '#667eea' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Banka Hesap Raporu</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Hesap bazlı detaylı döküm</div>
              </div>
            </a>
            <a href="/vesayet" onClick={(e) => { e.preventDefault(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#28a745'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(40,167,69,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(40,167,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp className="w-4 h-5" style={{ color: '#28a745' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Bakiye Raporu</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Toplam bakiye ve dağılım</div>
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
