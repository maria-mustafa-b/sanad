"use client";
import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, navigate } = useApp();

  const links = [
    { label: t.nav.tellSanad, path: '/tell-sanad' },
    { label: t.nav.myProof, path: '/my-proof' },
    { label: t.nav.applications, path: '/applications' },
    { label: t.nav.publicVerification, path: '/verify' },
    { label: t.nav.help, path: '/help' },
  ];

  return (
    <footer className="w-full bg-navy text-white mt-16 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
          <div className="space-y-4 max-w-sm">
            <img
              src="/sanad-logo-full-transparent.png"
              alt="SANAD"
              className="h-14 w-auto object-contain"
            />
            <p className="text-sm text-white/70 leading-relaxed">
              {t.brandSlogan}
            </p>
            <p className="text-xl font-headline font-bold text-accent">800-SANAD-SOS</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold mb-4">
              {t.nav.home}
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              {links.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-accent transition-colors cursor-pointer text-left min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/15 text-xs text-white/50">
          Â© 2026 SANAD Â· Support Â· Access Â· Verify
        </div>
      </div>
    </footer>
  );
};
