'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Utensils, ChevronLeft, ChevronRight, Save, Plus, X, Check, Search, Eye, EyeOff } from 'lucide-react';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
const CATEGORIES = [
  { key: 'soup', label: 'Çorba', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { key: 'main', label: 'Ana Yemek', color: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  { key: 'salad', label: 'Salata', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
] as const;

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00');
  const end = new Date(d);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return `${d.toLocaleDateString('tr-TR', opts)} - ${end.toLocaleDateString('tr-TR', opts)}`;
}

interface DayMeal {
  id?: number;
  weekStart: string;
  dayOfWeek: number;
  soup: string;
  mainDishes: string[];
  salad: string;
}

export default function MealPlansPage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [meals, setMeals] = useState<Record<number, DayMeal>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [todayMealEnabled, setTodayMealEnabled] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<number>(0);
  const [modalCategory, setModalCategory] = useState<'soup' | 'main' | 'salad'>('soup');
  const [foodItems, setFoodItems] = useState<{ id: number; name: string }[]>([]);
  const [selectedSoup, setSelectedSoup] = useState<string>('');
  const [selectedMains, setSelectedMains] = useState<string[]>([]);
  const [selectedSalad, setSelectedSalad] = useState<string>('');
  const [newFoodName, setNewFoodName] = useState('');
  const [foodSearch, setFoodSearch] = useState('');

  const loadWeek = async () => {
    setLoading(true);
    try {
      const res = await api.getMealPlans(weekStart);
      const data = res.data ?? res;
      const map: Record<number, DayMeal> = {};
      for (const m of data) {
        map[m.dayOfWeek] = {
          ...m,
          mainDishes: Array.isArray(m.mainDishes) ? m.mainDishes : JSON.parse(m.mainDishes || '[]'),
        };
      }
      for (let i = 0; i < 5; i++) {
        if (!map[i]) {
          map[i] = { weekStart, dayOfWeek: i, soup: '', mainDishes: [], salad: '' };
        }
      }
      setMeals(map);
    } catch {
      setMeals({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWeek(); }, [weekStart]);

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res?.data?.todayMealEnabled !== undefined) setTodayMealEnabled(res.data.todayMealEnabled !== 'false');
    }).catch(() => {});
  }, []);

  const handleToggleTodayMeal = async (val: boolean) => {
    setTodayMealEnabled(val);
    try {
      await api.updateSetting('todayMealEnabled', val ? 'true' : 'false');
    } catch (err: any) {
      setTodayMealEnabled(!val);
      alert(err.message);
    }
  };

  const openModal = async (day: number, category: 'soup' | 'main' | 'salad') => {
    setModalDay(day);
    setModalCategory(category);
    setFoodSearch('');
    setNewFoodName('');
    const meal = meals[day];
    setSelectedSoup(meal?.soup || '');
    setSelectedMains(meal?.mainDishes || []);
    setSelectedSalad(meal?.salad || '');
    try {
      const res = await api.getFoodItems(category);
      setFoodItems(res.data ?? res);
    } catch {
      setFoodItems([]);
    }
    setModalOpen(true);
  };

  const handleAddFood = async () => {
    if (!newFoodName.trim()) return;
    try {
      const res = await api.createFoodItem(newFoodName.trim(), modalCategory);
      const data = res.data ?? res;
      setFoodItems((prev) => [...prev, { id: data.id, name: data.name }]);
      if (modalCategory === 'soup') setSelectedSoup(data.name);
      else if (modalCategory === 'main') setSelectedMains((prev) => [...prev, data.name]);
      else if (modalCategory === 'salad') setSelectedSalad(data.name);
      setNewFoodName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const selectItem = (name: string) => {
    if (modalCategory === 'soup') setSelectedSoup(selectedSoup === name ? '' : name);
    else if (modalCategory === 'main') {
      setSelectedMains((prev) =>
        prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
      );
    } else if (modalCategory === 'salad') setSelectedSalad(selectedSalad === name ? '' : name);
  };

  const handleModalSave = () => {
    setMeals((prev) => ({
      ...prev,
      [modalDay]: {
        ...prev[modalDay],
        soup: selectedSoup,
        mainDishes: selectedMains,
        salad: selectedSalad,
      },
    }));
    setModalOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      for (const day of Object.values(meals)) {
        if (!day.soup && day.mainDishes.length === 0 && !day.salad) continue;
        if (day.id) {
          await api.updateMealPlan(day.id, {
            soup: day.soup,
            mainDishes: day.mainDishes,
            salad: day.salad,
          });
        } else {
          const res = await api.createMealPlan({
            weekStart: day.weekStart,
            dayOfWeek: day.dayOfWeek,
            soup: day.soup,
            mainDishes: day.mainDishes,
            salad: day.salad,
          });
          const data = res.data ?? res;
          setMeals((prev) => ({
            ...prev,
            [day.dayOfWeek]: { ...prev[day.dayOfWeek], id: data.id },
          }));
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeWeek = (delta: number) => {
    const d = new Date(weekStart + 'T00:00:00');
    d.setDate(d.getDate() + delta * 7);
    setWeekStart(getWeekStart(d));
  };

  const filteredItems = foodItems.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Yemek Listesi</h1>
          <p className="text-sm text-gray-500 mt-1">Haftalık yemek planı</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 glass rounded-xl px-3 py-2">
            <button onClick={() => changeWeek(-1)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-white font-medium px-3 min-w-[200px] text-center">
              {formatWeekLabel(weekStart)}
            </span>
            <button onClick={() => changeWeek(1)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-brand-500/15 text-brand-400 border border-brand-500/30 hover:bg-brand-500/20'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Show/Hide Today's Meal Toggle */}
      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Günün Yemeğini Göster</h3>
              <p className="text-xs text-gray-500 mt-0.5">Anasayfada bugünün yemeği kartının görünmesini aç/kapat</p>
            </div>
          </div>
          <button
            onClick={() => handleToggleTodayMeal(!todayMealEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              todayMealEnabled ? 'bg-brand-500' : 'bg-white/10'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              todayMealEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider w-28">Gün</th>
                  {CATEGORIES.map((cat) => (
                    <th key={cat.key} className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">{cat.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {DAYS.map((dayName, idx) => {
                  const meal = meals[idx];
                  const isToday = new Date().getDay() === ((idx + 1) % 7);
                  return (
                    <tr key={idx} className={`hover:bg-white/[0.02] transition-colors ${isToday ? 'bg-brand-500/[0.03]' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-brand-400' : 'bg-white/10'}`} />
                          <span className={`text-sm font-medium ${isToday ? 'text-brand-400' : 'text-white'}`}>{dayName}</span>
                          {isToday && <span className="text-[10px] text-brand-400/70 font-medium">(bugün)</span>}
                        </div>
                      </td>
                      {CATEGORIES.map((cat) => (
                        <td key={cat.key} className="px-5 py-3">
                          <button
                            onClick={() => openModal(idx, cat.key)}
                            className={`w-full text-left px-3 py-2 rounded-lg border border-dashed transition-all ${
                              (cat.key === 'soup' && meal?.soup) ||
                              (cat.key === 'main' && meal?.mainDishes?.length > 0) ||
                              (cat.key === 'salad' && meal?.salad)
                                ? 'border-white/[0.12] bg-white/[0.03]'
                                : 'border-white/[0.06] hover:border-white/[0.12]'
                            }`}
                          >
                            {cat.key === 'soup' && meal?.soup && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-medium">{meal.soup}</span>
                            )}
                            {cat.key === 'main' && meal?.mainDishes?.map((d, di) => (
                              <span key={di} className="inline-flex items-center px-2.5 py-1 mr-1 mb-1 rounded-lg bg-brand-500/10 text-brand-300 text-xs font-medium">{d}</span>
                            ))}
                            {cat.key === 'salad' && meal?.salad && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium">{meal.salad}</span>
                            )}
                            {((cat.key === 'soup' && !meal?.soup) ||
                              (cat.key === 'main' && (!meal?.mainDishes || meal.mainDishes.length === 0)) ||
                              (cat.key === 'salad' && !meal?.salad)) && (
                              <span className="text-xs text-gray-600">+ Ekle</span>
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Food Selection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-surface-card border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  modalCategory === 'soup' ? 'bg-amber-500/10' : modalCategory === 'main' ? 'bg-brand-500/10' : 'bg-emerald-500/10'
                }`}>
                  <Utensils className={`w-4 h-4 ${
                    modalCategory === 'soup' ? 'text-amber-400' : modalCategory === 'main' ? 'text-brand-400' : 'text-emerald-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{DAYS[modalDay]} - {CATEGORIES.find(c => c.key === modalCategory)?.label}</h3>
                  <p className="text-xs text-gray-500">Yemek seç veya yeni ekle</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  placeholder="Yemek ara..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Food Items Grid */}
            <div className="px-6 py-4 max-h-60 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-8">Henüz yemek eklenmemiş</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredItems.map((item) => {
                    const isSelected = modalCategory === 'soup' ? selectedSoup === item.name
                      : modalCategory === 'main' ? selectedMains.includes(item.name)
                      : selectedSalad === item.name;
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectItem(item.name)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                          isSelected
                            ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                            : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:border-white/[0.12] hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add New */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
                  placeholder="Yeni yemek adı..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface-raised border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/10 outline-none transition-all"
                />
                <button
                  onClick={handleAddFood}
                  disabled={!newFoodName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30 hover:bg-brand-500/20 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Ekle
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
                İptal
              </button>
              <button onClick={handleModalSave} className="px-5 py-2 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30 hover:bg-brand-500/20 text-sm font-medium transition-all">
                Seçimi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
