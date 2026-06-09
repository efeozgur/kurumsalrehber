'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Scale, Plus, Trash2, Banknote, Info } from 'lucide-react';

interface AccountForm {
  bankName: string;
  iban: string;
  amount: string;
  currency: string;
  termType: string;
}

export default function NewKisitliPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [dosyaNo, setDosyaNo] = useState('');
  const [accounts, setAccounts] = useState<AccountForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addAccount = () => {
    setAccounts([...accounts, { bankName: '', iban: '', amount: '', currency: 'TL', termType: 'vadesiz' }]);
  };

  const updateAccount = (i: number, field: keyof AccountForm, value: string) => {
    const copy = [...accounts];
    copy[i] = { ...copy[i], [field]: value };
    setAccounts(copy);
  };

  const removeAccount = (i: number) => {
    setAccounts(accounts.filter((_, idx) => idx !== i));
  };

  const handleTcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setTcKimlikNo(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{11}$/.test(tcKimlikNo)) {
      setError('TC Kimlik No 11 haneli olmalıdır');
      return;
    }

    setSaving(true);
    try {
      await api.createWard({
        firstName,
        lastName,
        tcKimlikNo,
        dosyaNo,
        bankAccounts: accounts.map((a) => ({
          bankName: a.bankName,
          iban: a.iban,
          amount: parseFloat(a.amount) || 0,
          currency: a.currency,
          termType: a.termType,
        })),
      });
      router.push('/vesayet');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vesayet-body min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <a href="/vesayet" className="p-2 rounded-lg transition-all" style={{ color: '#64748b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0d6efd'; e.currentTarget.style.background = 'rgba(13,110,253,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>Yeni Kısıtlı</h1>
            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>Vesayet altındaki kişiyi kaydedin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="v-card">
          {error && (
            <div className="v-error">
              <div className="v-error-dot" />
              <p>{error}</p>
            </div>
          )}

          {/* Personal Info Section */}
          <div className="v-section-header" style={{ paddingBottom: '20px', marginBottom: '24px' }}>
            <div className="v-section-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="v-section-title">Kısıtlı Bilgileri</h3>
              <p className="v-section-desc">Kişisel bilgileri girin</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="v-label">Ad *</label>
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="v-input" placeholder="Ad" />
            </div>
            <div>
              <label className="v-label">Soyad *</label>
              <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="v-input" placeholder="Soyad" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="v-label">TC Kimlik No *</label>
              <input
                required
                value={tcKimlikNo}
                onChange={handleTcChange}
                className="v-input"
                placeholder="12345678901"
                maxLength={11}
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="v-label">Dosya No *</label>
              <input required value={dosyaNo} onChange={(e) => setDosyaNo(e.target.value)} className="v-input" placeholder="2024/123" />
            </div>
          </div>

          {/* Bank Accounts Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #28a74515, #20a03915)' }}>
                  <Banknote className="w-4 h-5" style={{ color: '#28a745' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: '#1e293b' }}>Banka Hesapları</h3>
                  <p className="text-xs" style={{ color: '#64748b' }}>Opsiyonel, sonradan da eklenebilir</p>
                </div>
              </div>
              <button type="button" onClick={addAccount} className="v-btn-ghost text-xs">
                <Plus className="w-3.5 h-3.5" /> Hesap Ekle
              </button>
            </div>
          </div>

          {accounts.length > 0 && (
            <div className="space-y-4">
              {accounts.map((acc, i) => (
                <div key={i} className="relative p-4 sm:p-5 rounded-xl border" style={{ borderColor: '#e2e8f0', background: '#fafbfc' }}>
                  <button type="button" onClick={() => removeAccount(i)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg transition-all"
                    style={{ color: '#9ca3af' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#dc3545'; e.currentTarget.style.background = 'rgba(220,53,69,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="v-label">Banka Adı</label>
                      <input required value={acc.bankName} onChange={(e) => updateAccount(i, 'bankName', e.target.value)} className="v-input text-sm" placeholder="Ziraat Bankası" />
                    </div>
                    <div>
                      <label className="v-label">IBAN</label>
                      <input required value={acc.iban} onChange={(e) => updateAccount(i, 'iban', e.target.value)} className="v-input text-sm font-mono" placeholder="TR12 0000 1234..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div>
                      <label className="v-label">Tutar</label>
                      <input type="number" step="0.01" value={acc.amount} onChange={(e) => updateAccount(i, 'amount', e.target.value)} className="v-input text-sm" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="v-label">Para Birimi</label>
                      <select value={acc.currency} onChange={(e) => updateAccount(i, 'currency', e.target.value)} className="v-input text-sm">
                        <option value="TL">TL</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <div>
                      <label className="v-label">Vade</label>
                      <select value={acc.termType} onChange={(e) => updateAccount(i, 'termType', e.target.value)} className="v-input text-sm">
                        <option value="vadesiz">Vadesiz</option>
                        <option value="vadeli">Vadeli</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {accounts.length === 0 && (
            <div className="flex items-center gap-3 py-4" style={{ color: '#9ca3af' }}>
              <Info className="w-4 h-4" />
              <span className="text-sm">Henüz banka hesabı eklenmedi. İsterseniz yukarıdan hesap ekleyebilirsiniz.</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="v-btn-primary">
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Kaydediliyor...
                </>
              ) : 'Kaydet'}
            </button>
            <a href="/vesayet" className="v-btn-ghost">İptal</a>
          </div>
        </form>
      </div>
    </div>
  );
}
