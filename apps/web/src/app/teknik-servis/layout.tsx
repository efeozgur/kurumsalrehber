'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wrench, PlusCircle, List, Home, LogOut, Menu, X, Phone, ArrowLeft,
} from 'lucide-react';
import { api } from '@/lib/api';

const navItems = [
  { href: '/teknik-servis', label: 'Ana Sayfa', icon: Home },
  { href: '/teknik-servis/ekle', label: 'Arıza Kaydı', icon: PlusCircle },
  { href: '/teknik-servis/kayitlarim', label: 'Kayıtlarım', icon: List },
];

export default function TeknikServisLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isDetailPage = pathname.startsWith('/teknik-servis/kayit/') && !pathname.startsWith('/teknik-servis/kayitlarim');
  const isYonetim = pathname.startsWith('/teknik-servis/yonetim');

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 sidebar-gradient border-r border-white/[0.06] flex flex-col
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}>
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Teknik Servis</p>
              <p className="text-xs text-gray-500">Arıza Takip Sistemi</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/teknik-servis' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </Link>
              );
            })}

            {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Yönetim</p>
                </div>
                <Link
                  href="/teknik-servis/yonetim"
                  className={`sidebar-item ${isYonetim ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <List className="w-4 h-4" />
                  Tüm Kayıtlar
                  {isYonetim && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03]">
              <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Admin Panel
              </Link>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-2 text-gray-400">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm font-medium text-white">Teknik Servis</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
