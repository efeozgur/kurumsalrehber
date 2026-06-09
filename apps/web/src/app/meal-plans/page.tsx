'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Utensils, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

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

export default function MealPlansPublicPage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getMealPlans(weekStart).then((res) => {
      const data = res.data ?? res;
      setMeals(data.map((m: any) => ({
        ...m,
        mainDishes: Array.isArray(m.mainDishes) ? m.mainDishes : JSON.parse(m.mainDishes || '[]'),
      })));
    }).catch(() => setMeals([])).finally(() => setLoading(false));
  }, [weekStart]);

  const changeWeek = (delta: number) => {
    const d = new Date(weekStart + 'T00:00:00');
    d.setDate(d.getDate() + delta * 7);
    setWeekStart(getWeekStart(d));
  };

  const getMeal = (dayOfWeek: number) => meals.find((m) => m.dayOfWeek === dayOfWeek);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">← Ana Sayfa</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
              <Utensils className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Haftalık Yemek Listesi</h1>
              <p className="text-sm text-gray-400 mt-1">Burdur Adliyesi personel yemek menüsü</p>
            </div>
          </div>

          {/* Week Selector */}
          <div className="flex items-center gap-2 mt-6">
            <button onClick={() => changeWeek(-1)} className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08]">
              <Calendar className="w-4 h-4 text-brand-400" />
              <span className="text-sm text-white font-medium">{formatWeekLabel(weekStart)}</span>
            </div>
            <button onClick={() => changeWeek(1)} className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Meal Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {DAYS.map((dayName, idx) => {
              const meal = getMeal(idx);
              const isToday = new Date().getDay() === ((idx + 1) % 7);
              return (
                <div
                  key={idx}
                  className={`glass rounded-2xl p-5 border transition-all ${
                    isToday ? 'border-brand-500/30 ring-1 ring-brand-500/20' : 'border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${isToday ? 'bg-brand-400' : 'bg-white/10'}`} />
                    <h3 className={`text-sm font-semibold ${isToday ? 'text-brand-400' : 'text-white'}`}>{dayName}</h3>
                    {isToday && <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-[10px] font-medium">Bugün</span>}
                  </div>
                  {meal ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">Çorba</p>
                        <p className="text-sm text-gray-200">{meal.soup}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">Ana Yemek</p>
                        <div className="flex flex-wrap gap-1.5">
                          {meal.mainDishes.map((dish: string, di: number) => (
                            <span key={di} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 text-xs font-medium">{dish}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">Salata</p>
                        <p className="text-sm text-gray-200">{meal.salad}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Kayıt yok</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
