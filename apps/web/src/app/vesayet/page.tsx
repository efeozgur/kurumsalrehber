'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Ward } from '@/types';
import {
  Scale, Building2, Banknote, TrendingUp,
  DollarSign, Euro, Download, FileText, PieChart as PieIcon,
  Globe, RefreshCw, Users, CircleDot, BarChart3,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

  const pieData = useMemo(() => {
    const colors = ['#1ecab8', '#5766da', '#f93b7a'];
    return currencies
      .map(cur => ({ name: cur, value: balanceByCurrency[cur] || 0 }))
      .filter(d => d.value > 0)
      .map((d, i) => ({ ...d, fill: colors[i] }));
  }, [balanceByCurrency, currencies]);

  const bankChartData = useMemo(() => {
    return bankTotals.slice(0, 8).map(([bank, byCur]) => ({
      name: bank.length > 14 ? bank.slice(0, 14) + '..' : bank,
      TL: byCur['TL'] || 0,
      USD: byCur['USD'] || 0,
      EUR: byCur['EUR'] || 0,
    }));
  }, [bankTotals]);

  const accountTypeData = useMemo(() => {
    const termCount: Record<string, number> = {};
    wards.forEach(w => w.bankAccounts.forEach(a => {
      const t = a.termType === 'vadeli' ? 'Vadeli' : 'Vadesiz';
      termCount[t] = (termCount[t] || 0) + 1;
    }));
    return [
      { name: 'Vadesiz', value: termCount['Vadesiz'] || 0, fill: '#00bcd4' },
      { name: 'Vadeli', value: termCount['Vadeli'] || 0, fill: '#5766da' },
    ].filter(d => d.value > 0);
  }, [wards]);

  const CURRENCY_COLORS: Record<string, string> = { TL: '#1ecab8', USD: '#5766da', EUR: '#f93b7a' };

  const termData = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    wards.forEach(w => w.bankAccounts.forEach(a => {
      const term = a.termType === 'vadeli' ? 'Vadeli' : 'Vadesiz';
      if (!map[term]) map[term] = {};
      map[term][a.currency] = (map[term][a.currency] || 0) + a.amount;
    }));
    return map;
  }, [wards]);

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
                  if (total === 0 && !report) return null;
                  return (
                    <div key={cur} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{cur}</span>
                        <span style={{ fontSize: '18px', fontWeight: 700 }}>
                          {total.toLocaleString('tr-TR')}
                        </span>
                      </div>
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

        {/* ─── Kur Karşılığı ─── */}
        {rates && (balanceByCurrency['USD'] || balanceByCurrency['EUR']) && (
          <div className="v-card" style={{ marginBottom: '24px' }}>
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(123, 120, 201) 0px, rgb(96, 198, 243) 100%)' }}>
                <DollarSign className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Kur Karşılığı</h3>
                <p className="v-section-desc">Yabancı para bakiyelerinin TL değeri</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {(['USD', 'EUR'] as const).map(cur => {
                const amount = balanceByCurrency[cur] || 0;
                if (amount === 0) return null;
                const rate = cur === 'USD' ? rates.USD : rates.EUR;
                const tlValue = amount * rate;
                return (
                  <div key={cur} style={{
                    padding: '20px', borderRadius: '7px',
                    background: cur === 'USD' ? 'rgba(87,102,218,0.06)' : 'rgba(249,59,122,0.06)',
                    border: `1px solid ${cur === 'USD' ? 'rgba(87,102,218,0.15)' : 'rgba(249,59,122,0.15)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '7px',
                        background: cur === 'USD' ? '#5766da' : '#f93b7a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {cur === 'USD' ? <DollarSign className="w-5 h-5 text-white" /> : <Euro className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>{cur === 'USD' ? 'Dolar' : 'Euro'}</div>
                        <div style={{ fontSize: '11px', color: '#676c79' }}>1 {cur} = {rate.toFixed(4)} TL</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '12px', borderTop: '1px solid #e9ecef' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#676c79' }}>Bakiye</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#212529' }}>{amount.toLocaleString('tr-TR')} {cur}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#676c79' }}>TL Değeri</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: cur === 'USD' ? '#5766da' : '#f93b7a' }}>
                          {tlValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(() => {
                const dovizTL = ((balanceByCurrency['USD'] || 0) * rates.USD) +
                  ((balanceByCurrency['EUR'] || 0) * rates.EUR);
                return (
                  <div style={{
                    padding: '20px', borderRadius: '7px',
                    background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)',
                    color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: '12px', opacity: 0.85 }}>Döviz Toplam TL Değer</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>
                      {dovizTL.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                      {(['USD', 'EUR'] as const).filter(c => (balanceByCurrency[c] || 0) > 0).map(c => `${balanceByCurrency[c]?.toLocaleString('tr-TR')} ${c} × ${(c === 'USD' ? rates.USD : rates.EUR).toFixed(4)}`).join(' + ')}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ─── TL Bakiyesi ─── */}
        {(balanceByCurrency['TL'] || 0) > 0 && (
          <div className="v-card" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '28px',
              background: 'linear-gradient(120deg, #1ecab8 0%, #14a88f 100%)',
              padding: '28px 36px', color: '#fff',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Banknote className="w-7 h-7 text-white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', opacity: 0.8, fontWeight: 500, letterSpacing: '0.3px' }}>TL BAKİYESİ</div>
                <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: '1.1', marginTop: '4px', letterSpacing: '-0.5px' }}>
                  {(balanceByCurrency['TL'] || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>
                  {wards.reduce((s, w) => s + w.bankAccounts.filter(a => a.currency === 'TL').length, 0)} TL hesap,{' '}
                  {report?.averageByCurrency?.['TL'] ? `ort. ${report.averageByCurrency['TL'].toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>Toplam Bakiye İçindeki Payı</div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>
                  {(() => {
                    const totalAll = (balanceByCurrency['TL'] || 0) +
                      ((balanceByCurrency['USD'] || 0) * (rates?.USD || 1)) +
                      ((balanceByCurrency['EUR'] || 0) * (rates?.EUR || 1));
                    const share = totalAll > 0 ? ((balanceByCurrency['TL'] || 0) / totalAll) * 100 : 0;
                    return `%${share.toFixed(1)}`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Vadeli / Vadesiz + Banka Bazlı ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

          <div className="v-card">
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(246, 211, 101) 0px, rgb(255, 120, 80) 100%)' }}>
                <BarChart3 className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Vade Türüne Göre Dağılım</h3>
                <p className="v-section-desc">Vadeli ve vadesiz hesaplardaki bakiyeler</p>
              </div>
            </div>
            {Object.keys(termData).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', color: '#98a6ad', fontSize: '13px' }}>
                Henüz hesap bulunmuyor
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(['Vadesiz', 'Vadeli'] as const).map(term => {
                  const byCur = termData[term];
                  if (!byCur) return null;
                  const currencyEntries = Object.entries(byCur).filter(([, v]) => v > 0);
                  if (currencyEntries.length === 0) return null;
                  const total = currencyEntries.reduce((s, [, v]) => s + v, 0);
                  return (
                    <div key={term} style={{
                      padding: '18px 20px', borderRadius: '7px',
                      background: term === 'Vadesiz' ? 'rgba(0,188,212,0.06)' : 'rgba(87,102,218,0.06)',
                      border: `1px solid ${term === 'Vadesiz' ? 'rgba(0,188,212,0.15)' : 'rgba(87,102,218,0.15)'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: term === 'Vadesiz' ? '#00bcd4' : '#5766da',
                          }} />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>{term}</span>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#212529' }}>
                          {total.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {currencyEntries.map(([cur, amt]) => (
                          <div key={cur} style={{
                            padding: '4px 10px', borderRadius: '4px', fontSize: '11px',
                            background: `${CURRENCY_COLORS[cur]}15`,
                            color: CURRENCY_COLORS[cur], fontWeight: 600,
                          }}>
                            {amt.toLocaleString('tr-TR')} {cur}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="v-card">
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)' }}>
                <Building2 className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Banka Bazlı Bakiye</h3>
                <p className="v-section-desc">Hangi bankada ne kadar para var</p>
              </div>
            </div>
            {bankTotals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', color: '#98a6ad', fontSize: '13px' }}>
                Henüz banka hesabı bulunmuyor
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bankTotals.slice(0, 7).map(([bank, byCur]) => {
                  const currencyEntries = Object.entries(byCur).filter(([, v]) => v > 0);
                  const total = currencyEntries.reduce((s, [, v]) => s + v, 0);
                  const maxVal = bankTotals.slice(0, 7).reduce((s, [, bc]) => s + Math.max(...Object.values(bc).filter(v => v > 0), 0), 0);
                  const pct = maxVal > 0 ? (total / maxVal) * 100 : 0;
                  return (
                    <div key={bank} style={{ padding: '12px 0', borderBottom: '1px solid #f2f5f7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#212529' }}>{bank}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {currencyEntries.map(([cur, amt]) => (
                            <span key={cur} style={{ fontSize: '12px', fontWeight: 600, color: CURRENCY_COLORS[cur] }}>
                              {amt.toLocaleString('tr-TR')} {cur}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ height: '4px', borderRadius: '3px', background: '#e9ecef', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '3px', width: `${pct}%`, background: '#5766da', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  );
                })}
                {bankTotals.length > 7 && (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#5766da', padding: '8px 0' }}>
                    +{bankTotals.length - 7} banka daha...
                  </div>
                )}
              </div>
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
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(123, 120, 201) 0px, rgb(96, 198, 243) 100%)' }}>
                <PieIcon className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Para Birimi Dağılımı</h3>
                <p className="v-section-desc">TL, USD, EUR bakiyelerinin oransal dağılımı</p>
              </div>
            </div>
            {pieData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#98a6ad', fontSize: '13px' }}>
                Henüz hesap bakiyesi bulunmuyor
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <ResponsiveContainer width="55%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      dataKey="value" paddingAngle={3}>
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => v.toLocaleString('tr-TR')} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '120px' }}>
                  {pieData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: d.fill, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#676c79' }}>{d.value.toLocaleString('tr-TR')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="v-card">
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)' }}>
                <BarChart3 className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Banka Bazlı Bakiye</h3>
                <p className="v-section-desc">En yüksek bakiyeli bankalar</p>
              </div>
            </div>
            {bankChartData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#98a6ad', fontSize: '13px' }}>
                Henüz banka hesabı bulunmuyor
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={bankChartData} layout="vertical" margin={{ top: 6, right: 20, left: 8, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#676c79' }} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#676c79' }} />
                  <Tooltip formatter={(v: number) => v.toLocaleString('tr-TR')} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                  <Bar dataKey="TL" name="TL" fill="#1ecab8" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="USD" name="USD" fill="#5766da" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="EUR" name="EUR" fill="#f93b7a" radius={[0, 3, 3, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="v-card">
            <div className="v-section-header">
              <div className="v-section-icon" style={{ background: 'linear-gradient(120deg, rgb(246, 211, 101) 0px, rgb(255, 120, 80) 100%)' }}>
                <BarChart3 className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Hesap Türü Dağılımı</h3>
                <p className="v-section-desc">Vadeli / Vadesiz hesap sayısı</p>
              </div>
            </div>
            {accountTypeData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#98a6ad', fontSize: '13px' }}>
                Henüz hesap bulunmuyor
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <ResponsiveContainer width="55%" height={220}>
                  <PieChart>
                    <Pie data={accountTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value" paddingAngle={4}>
                      {accountTypeData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '120px' }}>
                  {accountTypeData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: d.fill, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#676c79' }}>{d.value} hesap</div>
                      </div>
                    </div>
                  ))}
                </div>
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
