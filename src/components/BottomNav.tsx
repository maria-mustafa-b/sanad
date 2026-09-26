"use client";
import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate, toggleSosModal, t } = useApp();

  const items = [
    { label: t.nav.home, icon: 'home', path: '/', ariaLabel: 'Home' },
    { label: t.nav.myProof, icon: 'verified_user', path: '/my-proof', ariaLabel: 'My Proof' },
    { label: t.nav.tellSanad, icon: 'mic', path: '/tell-sanad', isPrimary: true, ariaLabel: 'Tell SANAD â€” speak' },
    { label: t.nav.applications, icon: 'assignment', path: '/applications', ariaLabel: 'Applications' },
    { label: 'SOS', icon: 'emergency', action: () => toggleSosModal(true), isDanger: true, ariaLabel: 'Emergency SOS' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-surface-container-high py-2 px-1 shadow-soft"
      aria-label="Main navigation"
    >
      <div className="flex items-end justify-around max-w-lg mx-auto">
        {items.map((item, idx) => {
          if (item.isPrimary) {
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path!)}
                className="flex flex-col items-center justify-center -mt-6 bg-primary text-on-primary w-16 h-16 rounded-full shadow-lg border-4 border-surface transition-transform active:scale-95 cursor-pointer animate-softPulse"
                title={item.ariaLabel}
                aria-label={item.ariaLabel}
              >
                <span className="material-symbols-outlined text-3xl filled">mic</span>
              </button>
            );
          }

          const isActive = item.path && currentRoute === item.path;
          return (
            <button
              key={idx}
              onClick={() => (item.action ? item.action() : navigate(item.path!))}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[4.25rem] min-h-[3.5rem] rounded-xl relative transition-colors cursor-pointer ${
                item.isDanger
                  ? 'text-error hover:bg-error-container/30'
                  : isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-navy'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[28px] ${item.isDanger ? 'animate-pulse' : ''} ${
                  isActive ? 'filled' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="text-xs font-bold mt-0.5 leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
