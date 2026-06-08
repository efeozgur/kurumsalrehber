'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Department } from '@/types';
import { Plus, Pencil, Trash2, Building2, Users } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" silinecek. Emin misiniz?`)) return;
    try {
      await api.deleteDepartment(id);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Birimler</h1>
          <p className="text-sm text-gray-500 mt-1">Kurum birimleri</p>
        </div>
        <a href="/admin/departments/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yeni Birim
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
            </div>
          </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Henüz birim eklenmemiş</p>
          </div>
        ) : (
          departments.map((dept) => (
            <div key={dept.id} className="glass rounded-2xl p-5 hover:border-brand-500/20 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={`/admin/departments/${dept.id}`} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
                    <Pencil className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(dept.id, dept.name)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2">{dept.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{dept._count?.contacts || 0} kişi</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
