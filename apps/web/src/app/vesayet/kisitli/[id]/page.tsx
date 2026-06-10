'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Ward } from '@/types';
import BankNameSelect from '@/components/BankNameSelect';
import {
  ArrowLeft, Scale, Banknote, Pencil, Trash2, Plus,
  Building2, Save, X, User, Hash, FileText, Wallet,
  CreditCard, Calendar, CircleDot,
} from 'lucide-react';

export default function KisitliDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { user } = useAuth();
  const isSuper = user?.role === 'SUPER_ADMIN';

  const [ward, setWard] = useState<Ward | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [dosyaNo, setDosyaNo] = useState('');
  const [isRemoved, setIsRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accBankName, setAccBankName] = useState('');
  const [accIban, setAccIban] = useState('');
  const [accAmount, setAccAmount] = useState('');
  const [accCurrency, setAccCurrency] = useState('TL');
  const [accTermType, setAccTermType] = useState('vadesiz');

  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [editAccBankName, setEditAccBankName] = useState('');
  const [editAccIban, setEditAccIban] = useState('');
  const [editAccAmount, setEditAccAmount] = useState('');
  const [editAccCurrency, setEditAccCurrency] = useState('TL');
  const [editAccTermType, setEditAccTermType] = useState('vadesiz');

  const [showGoldForm, setShowGoldForm] = useState(false);
  const [goldBankName, setGoldBankName] = useState('');
  const [goldType, setGoldType] = useState('');
  const [goldGram, setGoldGram] = useState('');
  const [goldQuantity, setGoldQuantity] = useState('1');

  const [editingGoldId, setEditingGoldId] = useState<number | null>(null);
  const [editGoldBankName, setEditGoldBankName] = useState('');
  const [editGoldType, setEditGoldType] = useState('');
  const [editGoldGram, setEditGoldGram] = useState('');
  const [editGoldQuantity, setEditGoldQuantity] = useState('1');

  useEffect(() => {
    api.getWard(id).then((data) => {
      setWard(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setTcKimlikNo(data.tcKimlikNo);
      setDosyaNo(data.dosyaNo);
      setIsRemoved(data.isRemoved);
    }).catch(() => router.push('/vesayet')).finally(() => setLoading(false));
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.updateWard(id, { firstName, lastName, tcKimlikNo, dosyaNo, isRemoved });
      const updated = await api.getWard(id);
      setWard(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (!confirm('Banka hesabı silinecek. Emin misiniz?')) return;
    try {
      await api.deleteBankAccount(accountId);
      const updated = await api.getWard(id);
      setWard(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBankAccount({
        bankName: accBankName,
        iban: accIban,
        amount: parseFloat(accAmount) || 0,
        currency: accCurrency,
        termType: accTermType,
        wardId: id,
      });
      setShowAccountForm(false);
      setAccBankName('');
      setAccIban('');
      setAccAmount('');
      setAccCurrency('TL');
      setAccTermType('vadesiz');
      const updated = await api.getWard(id);
      setWard(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEditAccount = (acc: Ward['bankAccounts'][0]) => {
    setEditingAccountId(acc.id);
    setEditAccBankName(acc.bankName);
    setEditAccIban(acc.iban);
    setEditAccAmount(String(acc.amount));
    setEditAccCurrency(acc.currency);
    setEditAccTermType(acc.termType);
  };

  const cancelEditAccount = () => {
    setEditingAccountId(null);
  };

  const handleUpdateAccount = async (accountId: number) => {
    try {
      await api.updateBankAccount(accountId, {
        bankName: editAccBankName,
        iban: editAccIban,
        amount: parseFloat(editAccAmount) || 0,
        currency: editAccCurrency,
        termType: editAccTermType,
      });
      setEditingAccountId(null);
      const updated = await api.getWard(id);
      setWard(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ─── Gold Account Handlers ─────────────────────────────

  const handleAddGold = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createGoldAccount({
        bankName: goldBankName,
        goldType,
        gram: parseFloat(goldGram) || 0,
        quantity: parseInt(goldQuantity) || 1,
        wardId: id,
      });
      setShowGoldForm(false);
      setGoldBankName('');
      setGoldType('');
      setGoldGram('');
      setGoldQuantity('1');
      const updated = await api.getWard(id);
      setWard(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEditGold = (acc: Ward['goldAccounts'][0]) => {
    setEditingGoldId(acc.id);
    setEditGoldBankName(acc.bankName);
    setEditGoldType(acc.goldType);
    setEditGoldGram(String(acc.gram));
    setEditGoldQuantity(String(acc.quantity));
  };

  const cancelEditGold = () => {
    setEditingGoldId(null);
  };

  const handleUpdateGold = async (accountId: number) => {
    try {
      await api.updateGoldAccount(accountId, {
        bankName: editGoldBankName,
        goldType: editGoldType,
        gram: parseFloat(editGoldGram) || 0,
        quantity: parseInt(editGoldQuantity) || 1,
      });
      setEditingGoldId(null);
      const updated = await api.getWard(id);
      setWard(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteGold = async (accountId: number) => {
    if (!confirm('Altın hesabı silinecek. Emin misiniz?')) return;
    try {
      await api.deleteGoldAccount(accountId);
      const updated = await api.getWard(id);
      setWard(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="vesayet-body" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#0d6efd' }} />
        </div>
      </div>
    );
  }

  if (!ward) return null;

  const balanceByCurrency = ward.bankAccounts.reduce<Record<string, number>>((map, a) => {
    map[a.currency] = (map[a.currency] || 0) + a.amount;
    return map;
  }, {});
  const currencies = ['TL', 'USD', 'EUR'] as const;

  const totalGoldGram = ward.goldAccounts.reduce((s, g) => s + g.gram * g.quantity, 0);
  const totalGoldItems = ward.goldAccounts.reduce((s, g) => s + g.quantity, 0);

  return (
    <div className="vesayet-body" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ─── Page Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <a href="/vesayet"
              style={{ padding: '8px', borderRadius: '10px', color: '#64748b', display: 'inline-flex', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0d6efd'; e.currentTarget.style.background = 'rgba(13,110,253,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', lineHeight: '28.8px' }}>
                {ward.firstName} {ward.lastName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 className="w-3.5 h-3.5" /> {ward.dosyaNo}
                </span>
                <span>•</span>
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
              </div>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="v-btn-ghost">
              <Pencil className="w-4 h-4" /> Düzenle
            </button>
          )}
        </div>

          {/* ─── Kişisel Bilgiler Kartı / Düzenleme Formu ─── */}
        {editing ? (
          <form onSubmit={handleUpdate} className="v-card" style={{ marginBottom: '24px' }}>
            {error && (
              <div className="v-error">
                <div className="v-error-dot" />
                <p>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Kısıtlı Bilgilerini Düzenle</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Kişisel bilgileri güncelleyin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="v-label">Ad *</label>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="v-input" />
              </div>
              <div>
                <label className="v-label">Soyad *</label>
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="v-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="v-label">TC Kimlik No *</label>
                <input required value={tcKimlikNo} onChange={(e) => setTcKimlikNo(e.target.value.replace(/\D/g, ''))} className="v-input" maxLength={11} />
              </div>
              <div>
                <label className="v-label">Dosya No *</label>
                <input required value={dosyaNo} onChange={(e) => setDosyaNo(e.target.value)} className="v-input" />
              </div>
            </div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginTop: '20px',
              padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0',
              background: isRemoved ? '#fef2f2' : '#f8fafc',
              transition: 'all 0.15s', userSelect: 'none',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = isRemoved ? '#fca5a5' : '#cbd5e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = isRemoved ? '#fca5a5' : '#e2e8f0'; }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isRemoved ? '#dc3545' : '#e2e8f0',
                transition: 'all 0.15s',
              }}>
                {isRemoved && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: isRemoved ? '#991b1b' : '#1e293b' }}>Vesayetten Düştü mü ?</div>
                <div style={{ fontSize: '12px', color: isRemoved ? '#ef4444' : '#64748b', marginTop: '1px' }}>{isRemoved ? 'Evet, vesayet kaydı düşüldü' : 'Hayır, vesayet devam ediyor'}</div>
              </div>
              <input type="checkbox" checked={isRemoved} onChange={(e) => setIsRemoved(e.target.checked)} style={{ display: 'none' }} />
            </label>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button type="submit" disabled={saving} className="v-btn-primary">
                {saving ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Kaydediliyor...</>
                ) : (
                  <><Save className="w-4 h-4" /> Kaydet</>
                )}
              </button>
              <button type="button" onClick={() => { setEditing(false); setError(''); }} className="v-btn-ghost">
                <X className="w-4 h-4" /> İptal
              </button>
            </div>
          </form>
        ) : (
          /* ─── Bilgi Görüntüleme Kartı ─── */
          <div className="v-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 className="v-section-title">Kısıtlı Bilgileri</h3>
                <p className="v-section-desc">Kayıtlı kişisel bilgiler</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '28px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <User className="w-3.5 h-3.5" style={{ color: '#0d6efd' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Ad Soyad</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>{ward.firstName} {ward.lastName}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Hash className="w-3.5 h-3.5" style={{ color: '#667eea' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>TC Kimlik No</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b', fontFamily: 'monospace' }}>{ward.tcKimlikNo}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <FileText className="w-3.5 h-3.5" style={{ color: '#28a745' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Dosya No</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b', fontFamily: 'monospace' }}>{ward.dosyaNo}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: '#ffc107' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Kayıt Tarihi</span>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>
                  {new Date(ward.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Bakiye Özet Kartı ─── */}
        <div className="v-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #28a745, #20a039)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet className="w-5 h-6 text-white" />
            </div>
            <div>
              <h3 className="v-section-title">Bakiye Özeti</h3>
              <p className="v-section-desc">Toplam hesap bakiyesi ve dağılım</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {currencies.map(cur => {
              const total = balanceByCurrency[cur] ?? 0;
              const count = ward.bankAccounts.filter(a => a.currency === cur).length;
              const avg = count > 0 ? total / count : 0;
              if (total === 0) return null;
              return (
                <div key={cur} style={{ padding: '16px', borderRadius: '12px', background: cur === 'TL' ? 'rgba(40,167,69,0.06)' : cur === 'USD' ? 'rgba(13,110,253,0.06)' : 'rgba(102,126,234,0.06)', border: `1px solid ${cur === 'TL' ? 'rgba(40,167,69,0.12)' : cur === 'USD' ? 'rgba(13,110,253,0.12)' : 'rgba(102,126,234,0.12)'}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: cur === 'TL' ? '#28a745' : cur === 'USD' ? '#0d6efd' : '#667eea', marginBottom: '4px' }}>
                    Toplam {cur}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>{total.toLocaleString('tr-TR')}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{count} hesap, ort. {avg.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
                </div>
              );
            })}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(102,126,234,0.06)', border: '1px solid rgba(102,126,234,0.12)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#667eea', marginBottom: '4px' }}>Toplam Hesap</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>{ward.bankAccounts.length}</div>
            </div>
            {ward.goldAccounts.length > 0 && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.12)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#b8860b', marginBottom: '4px' }}>
                  <CircleDot className="w-3 h-3" style={{ display: 'inline', marginRight: '4px' }} />Altın
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>{totalGoldGram.toFixed(2)} gr</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{totalGoldItems} adet, {ward.goldAccounts.length} hesap</div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Banka Hesapları ─── */}
        <div className="v-card" style={{ padding: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Banka Hesapları</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{ward.bankAccounts.length} kayıtlı hesap</p>
              </div>
            </div>
            <button onClick={() => setShowAccountForm(!showAccountForm)} className="v-btn-ghost" style={{ fontSize: '12px' }}>
              {showAccountForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showAccountForm ? 'İptal' : 'Hesap Ekle'}
            </button>
          </div>

          {/* Yeni Hesap Formu */}
          {showAccountForm && (
            <form onSubmit={handleAddAccount} style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #28a745, #20a039)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Yeni Banka Hesabı Ekle</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="v-label">Banka Adı *</label>
                  <BankNameSelect required value={accBankName} onChange={(v) => setAccBankName(v)} />
                </div>
                <div>
                  <label className="v-label">IBAN</label>
                  <input required placeholder="TR12 0000 1234 5678" value={accIban} onChange={(e) => setAccIban(e.target.value)} className="v-input font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="v-label">Tutar</label>
                  <input type="number" step="0.01" placeholder="0.00" value={accAmount} onChange={(e) => setAccAmount(e.target.value)} className="v-input" />
                </div>
                <div>
                  <label className="v-label">Para Birimi</label>
                  <select value={accCurrency} onChange={(e) => setAccCurrency(e.target.value)} className="v-input">
                    <option value="TL">TL</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div>
                  <label className="v-label">Vade</label>
                  <select value={accTermType} onChange={(e) => setAccTermType(e.target.value)} className="v-input">
                    <option value="vadesiz">Vadesiz</option>
                    <option value="vadeli">Vadeli</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="v-btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>Ekle</button>
            </form>
          )}

          {/* Hesap Listesi */}
          {ward.bankAccounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
              <Banknote className="w-8 h-8" style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              Henüz banka hesabı eklenmemiş
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="v-table">
                <thead>
                  <tr>
                    <th>Banka</th>
                    <th className="hidden sm:table-cell">IBAN</th>
                    <th>Bakiye</th>
                    <th className="hidden sm:table-cell">Vade</th>
                    <th style={{ textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {ward.bankAccounts.map((acc) => {
                    const isEditing = editingAccountId === acc.id;
                    return (
                      <tr key={acc.id}>
                        <td>
                          {isEditing ? (
                            <BankNameSelect value={editAccBankName} onChange={(v) => setEditAccBankName(v)} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(13,110,253,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Banknote className="w-3.5 h-4" style={{ color: '#0d6efd' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 500, color: '#1e293b' }}>{acc.bankName}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>{acc.currency}</div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="hidden sm:table-cell">
                          {isEditing ? (
                            <input value={editAccIban} onChange={(e) => setEditAccIban(e.target.value)} className="v-input text-sm font-mono" />
                          ) : (
                            <span className="font-mono" style={{ color: '#64748b', fontSize: '13px' }}>{acc.iban}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <input type="number" step="0.01" value={editAccAmount} onChange={(e) => setEditAccAmount(e.target.value)} className="v-input text-sm" style={{ width: '100px' }} />
                              <select value={editAccCurrency} onChange={(e) => setEditAccCurrency(e.target.value)} className="v-input text-sm" style={{ width: '70px' }}>
                                <option value="TL">TL</option>
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                              </select>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{acc.amount.toLocaleString('tr-TR')} {acc.currency}</span>
                          )}
                        </td>
                        <td className="hidden sm:table-cell">
                          {isEditing ? (
                            <select value={editAccTermType} onChange={(e) => setEditAccTermType(e.target.value)} className="v-input text-sm">
                              <option value="vadesiz">Vadesiz</option>
                              <option value="vadeli">Vadeli</option>
                            </select>
                          ) : (
                            <span className="v-badge" style={{ background: acc.termType === 'vadeli' ? '#fef3c7' : '#e0f2fe', color: acc.termType === 'vadeli' ? '#92400e' : '#0369a1' }}>
                              {acc.termType === 'vadeli' ? 'Vadeli' : 'Vadesiz'}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            {isEditing ? (
                              <>
                                <button onClick={() => handleUpdateAccount(acc.id)}
                                  style={{ padding: '6px', borderRadius: '6px', color: '#28a745', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(40,167,69,0.08)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={cancelEditAccount}
                                  style={{ padding: '6px', borderRadius: '6px', color: '#6c757d', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108,117,125,0.08)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEditAccount(acc)}
                                  style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0d6efd'; e.currentTarget.style.background = 'rgba(13,110,253,0.08)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                {isSuper && (
                                  <button onClick={() => handleDeleteAccount(acc.id)}
                                    style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Altın Hesapları ─── */}
        <div className="v-card" style={{ padding: '0', marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffc107, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircleDot className="w-5 h-6 text-white" />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b' }}>Altın Hesapları</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{ward.goldAccounts.length} kayıtlı altın hesabı</p>
              </div>
            </div>
            <button onClick={() => setShowGoldForm(!showGoldForm)} className="v-btn-ghost" style={{ fontSize: '12px' }}>
              {showGoldForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showGoldForm ? 'İptal' : 'Altın Ekle'}
            </button>
          </div>

          {showGoldForm && (
            <form onSubmit={handleAddGold} style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #ffc107, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Yeni Altın Hesabı Ekle</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="v-label">Banka Adı *</label>
                  <BankNameSelect required value={goldBankName} onChange={(v) => setGoldBankName(v)} />
                </div>
                <div>
                  <label className="v-label">Altın Türü *</label>
                  <input required placeholder="24 Ayar, Çeyrek, Yarım, Tam..." value={goldType} onChange={(e) => setGoldType(e.target.value)} className="v-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="v-label">Gram *</label>
                  <input type="number" step="0.01" placeholder="0.00" value={goldGram} onChange={(e) => setGoldGram(e.target.value)} className="v-input" />
                </div>
                <div>
                  <label className="v-label">Adet</label>
                  <input type="number" min="1" value={goldQuantity} onChange={(e) => setGoldQuantity(e.target.value)} className="v-input" />
                </div>
              </div>
              <button type="submit" className="v-btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>Ekle</button>
            </form>
          )}

          {ward.goldAccounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
              <CircleDot className="w-8 h-8" style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              Henüz altın hesabı eklenmemiş
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="v-table">
                <thead>
                  <tr>
                    <th>Banka</th>
                    <th>Altın Türü</th>
                    <th>Gram</th>
                    <th>Adet</th>
                    <th>Toplam Gram</th>
                    <th style={{ textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {ward.goldAccounts.map((acc) => {
                    const isEditing = editingGoldId === acc.id;
                    return (
                      <tr key={acc.id}>
                        <td>
                          {isEditing ? (
                            <BankNameSelect value={editGoldBankName} onChange={(v) => setEditGoldBankName(v)} />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,193,7,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircleDot className="w-3.5 h-3.5" style={{ color: '#b8860b' }} />
                              </div>
                              <span style={{ fontWeight: 500, color: '#1e293b' }}>{acc.bankName}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input value={editGoldType} onChange={(e) => setEditGoldType(e.target.value)} className="v-input text-sm" />
                          ) : (
                            <span className="v-badge" style={{ background: 'rgba(255,193,7,0.12)', color: '#92400e' }}>{acc.goldType}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input type="number" step="0.01" value={editGoldGram} onChange={(e) => setEditGoldGram(e.target.value)} className="v-input text-sm" style={{ width: '90px' }} />
                          ) : (
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{acc.gram.toFixed(2)} gr</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input type="number" min="1" value={editGoldQuantity} onChange={(e) => setEditGoldQuantity(e.target.value)} className="v-input text-sm" style={{ width: '70px' }} />
                          ) : (
                            <span style={{ color: '#64748b' }}>{acc.quantity} adet</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#b8860b' }}>{(acc.gram * acc.quantity).toFixed(2)} gr</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            {isEditing ? (
                              <>
                                <button onClick={() => handleUpdateGold(acc.id)}
                                  style={{ padding: '6px', borderRadius: '6px', color: '#28a745', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(40,167,69,0.08)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={cancelEditGold}
                                  style={{ padding: '6px', borderRadius: '6px', color: '#6c757d', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108,117,125,0.08)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEditGold(acc)}
                                  style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#b8860b'; e.currentTarget.style.background = 'rgba(255,193,7,0.08)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                {isSuper && (
                                  <button onClick={() => handleDeleteGold(acc.id)}
                                    style={{ padding: '6px', borderRadius: '6px', color: '#64748b', display: 'inline-flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
