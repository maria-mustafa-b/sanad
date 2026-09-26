import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Badge } from '../components/ui/Badge';

export type NavItem = {
  label: string;
  path: string;
  icon: string;
  badge?: number;
};

const USER_NAV: NavItem[] = [
  { label: 'Home', path: '/dashboard', icon: 'home' },
  { label: 'Tell SANAD', path: '/chat', icon: 'mic' },
  { label: 'My Situation', path: '/situation', icon: 'psychology' },
  { label: 'Services', path: '/services', icon: 'apps' },
  { label: 'Applications', path: '/applications', icon: 'assignment' },
  { label: 'Digital Proof', path: '/credentials', icon: 'verified_user' },
  { label: 'Documents', path: '/documents', icon: 'folder' },
  { label: 'Notifications', path: '/notifications', icon: 'notifications' },
  { label: 'Accessibility', path: '/settings/accessibility', icon: 'accessibility_new' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', path: '/admin', icon: 'monitoring' },
  { label: 'Users', path: '/admin/users', icon: 'group' },
  { label: 'Applications', path: '/admin/applications', icon: 'assignment' },
  { label: 'Credentials', path: '/admin/credentials', icon: 'verified' },
  { label: 'Escalations', path: '/admin/escalations', icon: 'warning' },
];

const MOBILE_TABS = [
  { label: 'Home', path: '/dashboard', icon: 'home' },
  { label: 'Tell', path: '/chat', icon: 'mic' },
  { label: 'Apps', path: '/applications', icon: 'assignment' },
  { label: 'Proof', path: '/credentials', icon: 'verified_user' },
  { label: 'More', path: '/notifications', icon: 'menu' },
];

export const AppShell: React.FC<{
  children: React.ReactNode;
  mode?: 'user' | 'admin';
}> = ({ children, mode = 'user' }) => {
  const { navigate, currentRoute, currentUser, unreadNotificationsCount, logoutUser } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = mode === 'admin';
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;

  const isActive = (path: string) =>
    currentRoute === path || (path !== '/dashboard' && path !== '/admin' && currentRoute.startsWith(path));

  const sidebarBg = isAdmin ? 'bg-admin-bg text-white' : 'bg-white border-r border-border text-ink';
  const activeItem = isAdmin
    ? 'bg-brand text-white'
    : 'bg-brand-muted text-brand-dark font-semibold';
  const idleItem = isAdmin
    ? 'text-white/70 hover:bg-white/10 hover:text-white'
    : 'text-ink-secondary hover:bg-surface-container hover:text-ink';

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-5 h-[4.5rem] flex items-center border-b ${isAdmin ? 'border-admin-border' : 'border-border'}`}>
        <Logo
          variant={isAdmin ? 'dark' : 'light'}
          size={isAdmin ? 'md' : 'md'}
          onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
        />
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Main">
        {nav.map((item) => {
          const active = isActive(item.path);
          const count =
            item.path === '/notifications' ? unreadNotificationsCount : item.badge;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] min-h-touch transition-all duration-200 cursor-pointer ${
                active ? activeItem : idleItem
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${active ? 'filled' : ''}`}
                style={{ fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {item.icon}
              </span>
              <span className="flex-1 text-left tracking-[-0.01em]">{item.label}</span>
              {Boolean(count && count > 0) && (
                <Badge tone="danger">{count}</Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`px-4 py-4 border-t ${isAdmin ? 'border-admin-border' : 'border-border'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
            {(currentUser.name || 'U').charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-sm font-semibold truncate ${isAdmin ? 'text-white' : 'text-ink'}`}>
              {currentUser.name}
            </div>
            <div className={`text-xs truncate ${isAdmin ? 'text-white/50' : 'text-ink-muted'}`}>
              {isAdmin ? 'Administrator' : currentUser.isGuest ? 'Guest worker' : 'Worker account'}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex-1 text-xs font-semibold py-2 rounded-lg bg-surface-container text-ink-secondary hover:text-brand cursor-pointer"
            >
              Admin
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 text-xs font-semibold py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 cursor-pointer"
            >
              User app
            </button>
          )}
          <button
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg cursor-pointer ${
              isAdmin ? 'bg-white/10 text-white/80' : 'bg-surface-container text-ink-secondary'
            }`}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex w-64 shrink-0 flex-col sticky top-0 h-screen ${sidebarBg}`}>
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            className="absolute inset-0 bg-ink/40 cursor-pointer"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className={`relative w-72 max-w-[85vw] h-full shadow-elev ${sidebarBg}`}>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-container cursor-pointer"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Logo size="sm" onClick={() => navigate('/dashboard')} />
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-container cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
            )}
          </button>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      {!isAdmin && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border px-1 py-1 safe-bottom">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {MOBILE_TABS.map((tab) => {
              const active = isActive(tab.path);
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center justify-center min-w-[3.75rem] min-h-[3.25rem] rounded-lg text-[10px] font-semibold cursor-pointer ${
                    active ? 'text-brand' : 'text-ink-muted'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] ${active ? 'filled' : ''}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
