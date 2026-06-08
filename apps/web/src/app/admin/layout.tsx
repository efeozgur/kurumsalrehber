'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, UserCog, BadgeCheck, Lightbulb, LogOut, Menu, X, Phone, Search, ChevronDown, Bell,
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Kişiler', icon: Users },
  { href: '/admin/titles', label: 'Ünvanlar', icon: BadgeCheck },
  { href: '/admin/departments', label: 'Birimler', icon: Building2 },
  { href: '/admin/tips', label: 'İpuçları', icon: Lightbulb },
  { href: '/admin/users', label: 'Kullanıcılar', icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [setupCheck, setSetupCheck] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/setup') return;

    if (!loading && !isAuthenticated) {
      fetch('/api/auth/setup-check')
        .then((res) => res.json())
        .then((data) => {
          if (data.needsSetup) {
            setNeedsSetup(true);
            router.push('/admin/setup');
          } else {
            setNeedsSetup(false);
            router.push('/admin/login');
          }
        })
        .catch(() => router.push('/admin/login'))
        .finally(() => setSetupCheck(false));
    } else {
      setSetupCheck(false);
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return <>{children}</>;
  }

  if (loading || setupCheck) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

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
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Telefon Rehberi</p>
              <p className="text-xs text-gray-500">Admin Paneli</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
                </a>
              );
            })}
          </nav>

          {/* User Footer */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-sm font-semibold text-brand-400">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'SUPER_ADMIN' ? 'Süper Admin' : 'Admin'}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Çıkış"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-white/[0.06] text-gray-500 text-sm">
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-xs">Ara...</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-xs text-gray-600">Ctrl+K</kbd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="relative p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
