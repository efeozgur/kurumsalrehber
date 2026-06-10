'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Ward } from '@/types';
import {
  Scale, Building2, Banknote, TrendingUp,
  DollarSign, Euro, Download, FileText, PieChart,
  Globe, RefreshCw, Users, CircleDot,
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
  totalGoldAccounts: number;
  totalGoldGram: number;
  averageGoldGram: number;
  goldByType: Record<string, { gram: number; quantity: number }>;
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
    <div className="vesayet-body" style={{ backgroundColor: 'var(--v-bg)', padding: '28px 0 64px' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        <div className="flex items-center gap-4 mb-8">
          <div className="v-section-header" style={{ paddingBottom: 0, marginBottom: 0, borderBottom: 'none' }}>
            <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)' }}>
              <Scale className="w-5 h-6 text-white" />
            </div>
            <div>
              <h1 className="v-section-title" style={{ fontSize: '22px' }}>Vesayet Dashboard</h1>
              <p className="v-section-desc">Vesayet altındaki kısıtlıları ve banka hesaplarını yönetin</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="v-card-stat" style={{ background: 'linear-gradient(120deg, rgb(123, 120, 201) 0px, rgb(96, 198, 243) 100%)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '30px', fontWeight: 700, lineHeight: '1.2' }}>{totalWardsStat}</div>
                <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>Toplam Kısıtlı</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>{activeWardsStat} aktif</div>
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '7px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="v-card-stat" style={{ background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '30px', fontWeight: 700, lineHeight: '1.2' }}>{totalAccountsStat}</div>
                <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>Toplam Hesap</div>
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '7px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Banknote className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="v-card-stat" style={{ background: 'linear-gradient(120deg, rgb(246, 211, 101) 0px, rgb(255, 120, 80) 100%)', color: '#fff' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.85, marginBottom: '8px' }}>Toplam Bakiye</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {currencies.map(cur => {
                  const total = balanceByCurrency[cur] ?? 0;
                  const avg = report?.averageByCurrency?.[cur];
                  if (total === 0 && !report) return null;
                  return (
                    <div key={cur} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{cur}</span>
                        <span style={{ fontSize: '18px', fontWeight: 700 }}>
                          {total.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      {avg != null && (
                        <span style={{ fontSize: '11px', opacity: 0.7 }}>Ort: {avg.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                      )}
                    </div>
                  );
                })}
                {Object.keys(balanceByCurrency).length === 0 && !report && (
                  <span style={{ fontSize: '13px', opacity: 0.7 }}>Veri yok</span>
                )}
              </div>
            </div>
          </div>

          <div className="v-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div className="v-stat-label" style={{ margin: 0 }}>Altın</div>
              <CircleDot className="w-4 h-4" style={{ color: '#98a6ad' }} />
            </div>
            {report || wards.some(w => w.goldAccounts?.length) ? (
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#212529' }}>
                  {report ? report.totalGoldGram.toFixed(2) : wards.reduce((s, w) => s + (w.goldAccounts || []).reduce((sg, g) => sg + g.gram * g.quantity, 0), 0).toFixed(2)} gr
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {report && Object.entries(report.goldByType).length > 0 ? Object.entries(report.goldByType).slice(0, 4).map(([type, data]) => (
                    <div key={type} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#212529' }}>{type}</div>
                      <div style={{ fontSize: '11px', color: '#676c79' }}>{data.gram.toFixed(1)} gr / {data.quantity} adet</div>
                    </div>
                  )) : (
                    <div style={{ fontSize: '12px', color: '#98a6ad' }}>Altın hesabı bulunmuyor</div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#98a6ad' }}>Altın hesabı bulunmuyor</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="v-card">
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(123, 120, 201) 0px, rgb(96, 198, 243) 100%)' }}>
                <DollarSign className="w-5 h-6 text-white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="v-section-title">Güncel Kurlar</h3>
                <p className="v-section-desc">{rates?.updatedAt ? `Güncelleme: ${rates.updatedAt}` : 'Yükleniyor...'}</p>
              </div>
              <button onClick={loadAll} className="v-btn-ghost" style={{ padding: '7px 11px', fontSize: '12px' }}>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            {ratesLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#5766da' }} />
                </div>
              </div>
            ) : rates ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { code: 'USD', name: 'Dolar', icon: DollarSign, rate: rates.USD, color: '#5766da', bg: 'rgba(87,102,218,0.06)' },
                  { code: 'EUR', name: 'Euro', icon: Euro, rate: rates.EUR, color: '#1ecab8', bg: 'rgba(30,202,184,0.06)' },
                  { code: 'GBP', name: 'Sterlin', icon: Banknote, rate: rates.GBP, color: '#f93b7a', bg: 'rgba(249,59,122,0.06)' },
                  { code: 'CHF', name: 'İsviçre Frangı', icon: Banknote, rate: rates.CHF, color: '#00bcd4', bg: 'rgba(0,188,212,0.06)' },
                ].map((cur) => (
                  <div key={cur.code} style={{ padding: '12px', borderRadius: '7px', background: cur.bg, display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e9ecef' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '7px', background: cur.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <cur.icon className="w-3.5 h-4 text-white" />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#676c79' }}>{cur.name} ({cur.code})</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#212529' }}>{formatRate(cur.rate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#98a6ad', fontSize: '13px' }}>Kur bilgisi alınamadı</div>
            )}
          </div>

          <div className="v-card">
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)' }}>
                <PieChart className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Hesap Bakiye Özeti</h3>
                <p className="v-section-desc">Bankalara göre dağılım</p>
              </div>
            </div>
            {bankTotals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#98a6ad', fontSize: '13px' }}>
                Henüz banka hesabı bulunmuyor
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bankTotals.slice(0, 6).map(([bank, byCur]) => {
                  const tlAmt = byCur['TL'] || 0;
                  const tlPct = (balanceByCurrency['TL'] || 1) > 0 ? (tlAmt / (balanceByCurrency['TL'] || 1)) * 100 : 0;
                  return (
                    <div key={bank}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#212529' }}>{bank}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {currencies.map(cur => {
                            const amt = byCur[cur];
                            if (!amt) return null;
                            return (
                              <span key={cur} style={{ fontSize: '12px', fontWeight: 600, color: '#212529' }}>
                                {amt.toLocaleString('tr-TR')} {cur}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      {tlAmt > 0 && (
                        <>
                          <div style={{ height: '5px', borderRadius: '3px', background: '#e9ecef', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: '3px', width: `${tlPct}%`, background: '#5766da', transition: 'width 0.5s ease' }} />
                          </div>
                          <div style={{ fontSize: '10px', color: '#98a6ad', marginTop: '2px' }}>TL dağılım: %{tlPct.toFixed(1)}</div>
                        </>
                      )}
                    </div>
                  );
                })}
                {bankTotals.length > 6 && (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#5766da', marginTop: '4px' }}>
                    +{bankTotals.length - 6} banka daha...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="v-card">
          <div className="v-section-header">
            <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(246, 211, 101) 0px, rgb(255, 120, 80) 100%)' }}>
              <FileText className="w-5 h-6 text-white" />
            </div>
            <div>
              <h3 className="v-section-title">Raporlamalar</h3>
              <p className="v-section-desc">Hızlı rapor erişimi</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            <div onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '7px', border: '1px solid #e9ecef', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5766da'; e.currentTarget.style.boxShadow = 'rgba(87,102,218,0.5) 0px 2px 6px 0px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: 'rgba(87,102,218,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download className="w-4 h-4" style={{ color: '#5766da' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>Kısıtlı Listesi</div>
                <div style={{ fontSize: '11px', color: '#676c79' }}>Tüm kısıtlıları görüntüle</div>
              </div>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '7px', border: '1px solid #e9ecef', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1ecab8'; e.currentTarget.style.boxShadow = 'rgba(30,202,184,0.5) 0px 2px 6px 0px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: 'rgba(30,202,184,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 className="w-4 h-4" style={{ color: '#1ecab8' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>Banka Hesap Raporu</div>
                <div style={{ fontSize: '11px', color: '#676c79' }}>Hesap bazlı detaylı döküm</div>
              </div>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '7px', border: '1px solid #e9ecef', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00bcd4'; e.currentTarget.style.boxShadow = 'rgba(0,188,212,0.5) 0px 2px 6px 0px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e9ecef'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: 'rgba(0,188,212,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#00bcd4' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>Bakiye Raporu</div>
                <div style={{ fontSize: '11px', color: '#676c79' }}>Toplam bakiye ve dağılım</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
