'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Upload, Database, ArrowRight, CheckCircle2, AlertCircle, X, ChevronDown, Settings2, Play, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

interface TableInfo {
  name: string;
  columns: { name: string; type: string; nullable: boolean }[];
}

interface MappingConfig {
  contactTable: string;
  departmentTable: string;
  nameMode: 'separate' | 'full';
  splitMode: 'last' | 'first';
  mapping: {
    fullName: string;
    firstName: string;
    lastName: string;
    sicilNo: string;
    phoneInternal: string;
    phoneMobile: string;
    email: string;
    departmentName: string;
    departmentContactId: string;
    deptTableIdColumn: string;
    titleName: string;
  };
}

type Step = 'upload' | 'mapping' | 'result';

export default function ImportPage() {
  const { user } = useAuth();
  const isSuper = user?.role === 'SUPER_ADMIN';
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [config, setConfig] = useState<MappingConfig>({
    contactTable: '',
    departmentTable: '',
    nameMode: 'separate',
    splitMode: 'last',
    mapping: {
      fullName: '',
      firstName: '',
      lastName: '',
      sicilNo: '',
      phoneInternal: '',
      phoneMobile: '',
      email: '',
      departmentName: '',
      departmentContactId: '',
      deptTableIdColumn: '',
      titleName: '',
    },
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setError(null);
    setLoading(true);

    try {
      const res = await api.importDiscover(f);
      setTables(res.tables);
      setStep('mapping');
      setConfig({
        contactTable: '',
        departmentTable: '',
        nameMode: 'separate',
        splitMode: 'last',
        mapping: {
          fullName: '',
          firstName: '',
          lastName: '',
          sicilNo: '',
          phoneInternal: '',
          phoneMobile: '',
          email: '',
          departmentName: '',
          departmentContactId: '',
          deptTableIdColumn: '',
          titleName: '',
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file || !config.contactTable) return;
    if (config.nameMode === 'full' && !config.mapping.fullName) return;
    if (config.nameMode === 'separate' && (!config.mapping.firstName || !config.mapping.lastName)) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.importExecute(file, config);
      setResult(res);
      setStep('result');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await api.importClear();
      setShowClearConfirm(false);
      setError(null);
      alert('Tüm kayıtlar silindi.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setTables([]);
    setResult(null);
    setError(null);
  };

  const selectedTable = tables.find((t) => t.name === config.contactTable);
  const selectedDeptTable = tables.find((t) => t.name === config.departmentTable);

  const canImport = config.contactTable && (
    config.nameMode === 'full' ? config.mapping.fullName :
    (config.mapping.firstName && config.mapping.lastName)
  );

  const mappedColumns = [
    ...(config.nameMode === 'full' ? [config.mapping.fullName] : [config.mapping.firstName, config.mapping.lastName]),
    config.mapping.sicilNo,
    config.mapping.phoneInternal,
    config.mapping.phoneMobile,
    config.mapping.email,
    config.mapping.departmentName,
    config.mapping.departmentContactId,
    config.mapping.titleName,
  ];

  const setMapping = (field: string, value: string) => {
    setConfig({ ...config, mapping: { ...config.mapping, [field]: value } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">İçe Aktarma</h1>
          <p className="text-sm text-gray-500 mt-1">SQLite veritabanından kişileri içe aktarın</p>
        </div>
        <div className="flex items-center gap-2">
          {isSuper && step !== 'result' && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Tüm Kayıtları Sil
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-white/[0.06]">
            {['upload', 'mapping', 'result'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s ? 'bg-brand-500 text-white' :
                  ['upload', 'mapping', 'result'].indexOf(step) > i ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-hover text-gray-500'
                }`}>
                  {['upload', 'mapping', 'result'].indexOf(step) > i ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-xs ${step === s ? 'text-white' : 'text-gray-500'}`}>
                  {s === 'upload' ? 'Dosya Seç' : s === 'mapping' ? 'Eşleştirme' : 'Sonuç'}
                </span>
                {i < 2 && <ChevronDown className="w-3 h-3 text-gray-600 -rotate-90" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 mb-4 rounded-xl bg-red-500/10 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto p-1 rounded hover:bg-red-500/10">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="glass rounded-2xl p-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">SQLite Veritabanı Seçin</h2>
            <p className="text-sm text-gray-500 mb-6">
              Eski telefon rehberi veritabanı dosyanızı seçin (.db, .sqlite)
            </p>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                loading ? 'border-brand-500/20 opacity-50 pointer-events-none' : 'border-white/[0.1] hover:border-brand-500/40'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
                  <p className="text-sm text-gray-400">Dosya okunuyor...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                  <p className="text-sm text-gray-400">
                    Dosyayı sürükleyip bırakın veya <span className="text-brand-400">seçin</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">.db, .sqlite, .sqlite3 (max 10MB)</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".db,.sqlite,.sqlite3"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 'mapping' && (
        <div className="space-y-6">
          {/* Table Selection */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-400" />
              Tablo Seçimi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Kişi Tablosu *</label>
                <select
                  value={config.contactTable}
                  onChange={(e) => setConfig({ ...config, contactTable: e.target.value, departmentTable: e.target.value === config.departmentTable ? '' : config.departmentTable })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm outline-none focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all"
                >
                  <option value="">Seçin</option>
                  {tables.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Birim Tablosu</label>
                <select
                  value={config.departmentTable}
                  onChange={(e) => setConfig({ ...config, departmentTable: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm outline-none focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all"
                >
                  <option value="">Seçin (opsiyonel)</option>
                  {tables.filter((t) => t.name !== config.contactTable && t.name !== config.departmentTable).map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <div className="px-3 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08]">
                  <p className="text-xs text-gray-500">Ünvan, kişi tablosundan <br/>doğrudan alınacak.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Field Mapping */}
          {selectedTable && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-brand-400" />
                "{config.contactTable}" - Alan Eşleştirme
              </h3>

              {/* Adlandirma Modu */}
              <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-surface-raised">
                <span className="text-xs text-gray-500 font-medium">Ad Soyad:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nameMode"
                    checked={config.nameMode === 'separate'}
                    onChange={() => setConfig({ ...config, nameMode: 'separate', mapping: { ...config.mapping, fullName: '', firstName: '', lastName: '' } })}
                    className="accent-brand-500"
                  />
                  <span className="text-sm text-gray-300">Ayrı (Ad + Soyad)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nameMode"
                    checked={config.nameMode === 'full'}
                    onChange={() => setConfig({ ...config, nameMode: 'full', mapping: { ...config.mapping, fullName: '', firstName: '', lastName: '' } })}
                    className="accent-brand-500"
                  />
                  <span className="text-sm text-gray-300">Tek Alan (AdSoyad)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.nameMode === 'full' ? (
                  <>
                    <FieldSelect
                      label="Ad Soyad (tek alan) *"
                      columns={selectedTable.columns}
                      value={config.mapping.fullName}
                      onChange={(v) => setMapping('fullName', v)}
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Bölme Yöntemi</label>
                      <select
                        value={config.splitMode}
                        onChange={(e) => setConfig({ ...config, splitMode: e.target.value as 'last' | 'first' })}
                        className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm outline-none focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all"
                      >
                        <option value="last">Son boşluktan ayır (önerilen)</option>
                        <option value="first">İlk boşluktan ayır</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-1.5">
                        {config.splitMode === 'last'
                          ? '"Ali Rıza Kaya" → Ali Rıza / Kaya'
                          : '"Ali Rıza Kaya" → Ali / Rıza Kaya'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FieldSelect
                      label="Ad *"
                      columns={selectedTable.columns}
                      value={config.mapping.firstName}
                      onChange={(v) => setMapping('firstName', v)}
                    />
                    <FieldSelect
                      label="Soyad *"
                      columns={selectedTable.columns}
                      value={config.mapping.lastName}
                      onChange={(v) => setMapping('lastName', v)}
                    />
                  </>
                )}
                <FieldSelect
                  label="Sicil No"
                  columns={selectedTable.columns}
                  value={config.mapping.sicilNo}
                  onChange={(v) => setMapping('sicilNo', v)}
                />
                <FieldSelect
                  label="Dahili Telefon"
                  columns={selectedTable.columns}
                  value={config.mapping.phoneInternal}
                  onChange={(v) => setMapping('phoneInternal', v)}
                />
                <FieldSelect
                  label="Cep Telefonu"
                  columns={selectedTable.columns}
                  value={config.mapping.phoneMobile}
                  onChange={(v) => setMapping('phoneMobile', v)}
                />
                <FieldSelect
                  label="E-posta"
                  columns={selectedTable.columns}
                  value={config.mapping.email}
                  onChange={(v) => setMapping('email', v)}
                />

                {/* Birim Adi (dogrudan) - sadece ayri birim tablosu yoksa */}
                {!config.departmentTable && (
                  <FieldSelect
                    label="Birim Adı (doğrudan)"
                    columns={selectedTable.columns}
                    value={config.mapping.departmentName}
                    onChange={(v) => setMapping('departmentName', v)}
                  />
                )}

                {/* Birim ID FK - sadece ayri birim tablosu varsa */}
                {config.departmentTable && (
                  <FieldSelect
                    label="Birim ID (FK)"
                    columns={selectedTable.columns}
                    value={config.mapping.departmentContactId}
                    onChange={(v) => setMapping('departmentContactId', v)}
                  />
                )}

                {/* Unvan (dogrudan) */}
                <FieldSelect
                  label="Ünvan Adı"
                  columns={selectedTable.columns}
                  value={config.mapping.titleName}
                  onChange={(v) => setMapping('titleName', v)}
                />
              </div>
            </div>
          )}

          {/* Department Table Mapping */}
          {selectedDeptTable && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">"{config.departmentTable}" - Birim Tablosu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <FieldSelect
                  label="Birim Adı Kolonu *"
                  columns={selectedDeptTable.columns}
                  value={config.mapping.departmentName}
                  onChange={(v) => setMapping('departmentName', v)}
                />
                <FieldSelect
                  label="Birim ID Kolonu"
                  columns={selectedDeptTable.columns}
                  value={config.mapping.deptTableIdColumn}
                  onChange={(v) => setMapping('deptTableIdColumn', v)}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedTable && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">"{config.contactTable}" Tablo Kolonları</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {selectedTable.columns.map((col) => {
                  const isMapped = mappedColumns.includes(col.name);
                  return (
                    <div
                      key={col.name}
                      className={`px-3 py-2 rounded-lg text-xs font-mono ${
                        isMapped ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' : 'bg-surface-raised text-gray-400'
                      }`}
                    >
                      {col.name}
                      <span className="text-gray-600 ml-1">({col.type})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="px-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-300 hover:text-white transition-all">
              Geri Dön
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !canImport}
              className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Aktarılıyor...</>
              ) : (
                <><Play className="w-4 h-4" /> Aktarımı Başlat</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === 'result' && result && (
        <div className="glass rounded-2xl p-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Aktarım Tamamlandı</h2>
            <p className="text-sm text-gray-500 mb-6">İçe aktarma işlemi başarıyla tamamlandı.</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-surface-raised">
                <p className="text-2xl font-bold text-white">{result.total}</p>
                <p className="text-xs text-gray-500 mt-1">Toplam Kayıt</p>
              </div>
              <div className="p-4 rounded-xl bg-brand-500/10">
                <p className="text-2xl font-bold text-brand-400">{result.imported}</p>
                <p className="text-xs text-brand-400/70 mt-1">Aktarılan</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-raised">
                <p className="text-2xl font-bold text-gray-400">{result.skipped}</p>
                <p className="text-xs text-gray-500 mt-1">Atlanan</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={handleReset} className="px-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-300 hover:text-white transition-all">
                Yeni Aktarım
              </button>
              <a href="/admin/contacts" className="btn-primary flex items-center gap-2 text-sm">
                Kişilere Git <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowClearConfirm(false)} className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Tüm Kayıtları Sil</h2>
              <p className="text-sm text-gray-500 mb-2">
                Bu işlem tüm kişileri, birimleri, ünvanları, yemek listelerini ve vesayet kayıtlarını kalıcı olarak silecektir.
              </p>
              <p className="text-sm text-red-400 font-medium mb-6">Bu işlem geri alınamaz!</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-sm text-gray-300 hover:text-white transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleClear}
                  disabled={clearing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {clearing ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Siliniyor...</>
                  ) : (
                    <><Trash2 className="w-4 h-4" /> Sil</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldSelect({ label, columns, value, onChange }: {
  label: string;
  columns: { name: string; type: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm outline-none focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 transition-all"
      >
        <option value="">Seçin</option>
        {columns.map((col) => (
          <option key={col.name} value={col.name}>{col.name} ({col.type})</option>
        ))}
      </select>
    </div>
  );
}
