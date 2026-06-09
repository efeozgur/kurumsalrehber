'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Department } from '@/types';
import { Plus, Pencil, Trash2, Building2, Users, ChevronRight, ChevronDown } from 'lucide-react';

interface TreeNode {
  id: number;
  name: string;
  parentId: number | null;
  contactCount: number;
  children: TreeNode[];
}

function TreeNodeRow({ node, depth, onEdit, onDelete, isSuper }: { node: TreeNode; depth: number; onEdit: (id: number) => void; onDelete: (id: number, name: string) => void; isSuper: boolean }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <>
      <tr className="hover:bg-white/[0.02] transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(!expanded)} className="p-0.5 rounded text-gray-500 hover:text-white transition-colors">
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-white font-medium">{node.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {node.contactCount}
          </div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(node.id)} className="p-2 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
              <Pencil className="w-4 h-4" />
            </button>
            {isSuper && (
              <button onClick={() => onDelete(node.id, node.name)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && hasChildren && node.children.map((child) => (
        <TreeNodeRow key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} isSuper={isSuper} />
      ))}
    </>
  );
}

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.getDepartmentTree()
      .then((res) => setTree(res.data))
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
  const isSuper = user?.role === 'SUPER_ADMIN';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Birimler</h1>
          <p className="text-sm text-gray-500 mt-1">Hiyerarşik birim yapısı</p>
        </div>
        <a href="/admin/departments/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yeni Birim
        </a>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
            </div>
          </div>
        ) : tree.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Henüz birim eklenmemiş</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Birim</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">Kişi</th>
                <th className="text-right px-4 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {tree.map((node) => (
                <TreeNodeRow key={node.id} node={node} depth={0} onEdit={(id) => window.location.href = `/admin/departments/${id}`} onDelete={handleDelete} isSuper={isSuper} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
