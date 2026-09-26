"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export const PublicHeader: React.FC = () => {
  const { navigate, currentRoute } = useApp();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'Services', path: '/#features' },
    { label: 'How it works', path: '/#how' },
    { label: 'Verify', path: '/verify' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center justify-between gap-4">
        <Logo size="md" onClick={() => navigate('/')} />

        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => {
                if (l.path.startsWith('/#')) {
                  navigate('/');
                  window.setTimeout(() => {
                    document.getElementById(l.path.slice(2))?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                } else {
                  navigate(l.path);
                }
              }}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                currentRoute === l.path
                  ? 'text-brand'
                  : 'text-ink-secondary hover:text-ink hover:bg-surface-container'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/auth/signin')}>
            Sign In
          </Button>
          <Button leftIcon="mic" onClick={() => navigate('/chat')}>
            Try SANAD
          </Button>
        </div>

        <button
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-container cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => {
                setOpen(false);
                navigate(l.path.startsWith('/#') ? '/' : l.path);
              }}
              className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-ink hover:bg-surface-container cursor-pointer min-h-touch"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" fullWidth onClick={() => { setOpen(false); navigate('/auth/signin'); }}>
              Sign In
            </Button>
            <Button fullWidth leftIcon="mic" onClick={() => { setOpen(false); navigate('/chat'); }}>
              Try SANAD
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
