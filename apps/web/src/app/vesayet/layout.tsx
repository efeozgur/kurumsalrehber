'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import {
  LogOut, ChevronDown, Home, Scale,
  LayoutDashboard, Search, UserPlus, Banknote, Landmark,
} from 'lucide-react';

export default function VesayetLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && user && user.role !== 'VESAYET_ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f2f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" style={{ borderTopColor: '#5766da' }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const navItems = [
    { href: '/vesayet', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/vesayet/kisitli', icon: Search, label: 'Kısıtlı Ara' },
    { href: '/vesayet/kisitli/new', icon: UserPlus, label: 'Kısıtlı Ekle' },
    { href: '/vesayet/hesaplar', icon: Banknote, label: 'Banka Hesapları' },
    { href: '/vesayet/bankalar', icon: Landmark, label: 'Banka Yönetimi' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f2f5f7' }}>
      <aside style={{
        width: '64px',
        background: '#2f394e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 50,
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.04)',
      }}>
        <a
          href="/vesayet"
          style={{
            width: '40px', height: '40px', borderRadius: '7px',
            background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <Scale className="w-5 h-5 text-white" />
        </a>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '0 8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                title={item.label}
                style={{
                  width: '48px', height: '44px', borderRadius: '7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(152,166,173,0.7)',
                  textDecoration: 'none',
                  margin: '0 auto',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(152,166,173,0.7)';
                  }
                }}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </nav>
      </aside>

      <div style={{ flex: 1, marginLeft: '64px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: '#fff',
          borderBottom: '1px solid #dee2e6',
        }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: '64px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#212529', lineHeight: '1.2' }}>Vesayet Modülü</div>
                <div style={{ fontSize: '12px', color: '#98a6ad' }}>Kısıtlı Yönetimi</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a href="/"
                style={{
                  padding: '8px 14px', borderRadius: '7px',
                  color: '#6c757d', fontSize: '13px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f2f5f7'; e.currentTarget.style.color = '#212529'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6c757d'; }}
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </a>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '6px 12px 6px 6px', borderRadius: '7px',
                    border: '1px solid #dee2e6', background: '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ced4da'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#dee2e6'; }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '7px',
                    background: 'linear-gradient(120deg, rgb(0, 231, 149) 0px, rgb(0, 149, 226) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, color: '#fff',
                  }}>
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529', lineHeight: '1.2' }}>{user?.username}</div>
                    <div style={{ fontSize: '10px', color: '#98a6ad' }}>
                      {user?.role === 'SUPER_ADMIN' ? 'Süper Admin' : 'Vesayet Admin'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: '#98a6ad' }} />
                </button>

                {profileOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
                      minWidth: '200px', background: '#fff', borderRadius: '7px',
                      boxShadow: 'rgba(0, 0, 0, 0.06) 0px 0px 24px 0px, rgba(0, 0, 0, 0.02) 0px 1px 0px 0px',
                      border: '1px solid #e9ecef',
                      padding: '6px', overflow: 'hidden',
                    }}>
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid #f2f5f7', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#212529' }}>{user?.username}</div>
                        <div style={{ fontSize: '11px', color: '#676c79' }}>{user?.role}</div>
                      </div>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '9px 12px', borderRadius: '7px', border: 'none',
                          background: 'none', cursor: 'pointer', fontSize: '13px', color: '#f93b7a',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,59,122,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
