 
"use client";
import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate, unreadNotificationsCount, toggleSosModal } = useApp();

  const items = [
    { label: 'Services', icon: 'apps', path: '/services' },
    { label: 'My Proof', icon: 'verified_user', path: '/my-proof' },
    { label: 'Tell SANAD', icon: 'mic', path: '/tell-sanad', isPrimary: true },
    { label: 'Alerts', icon: 'notifications', path: '/notifications', badge: unreadNotificationsCount },
    { label: 'SOS', icon: 'emergency', action: () => toggleSosModal(true), isDanger: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-surface-container-high py-1 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item, idx) => {
          if (item.isPrimary) {
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path!)}
                className="flex flex-col items-center justify-center -mt-5 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg border-4 border-surface transition-transform active:scale-95 cursor-pointer"
                title="Speak to SANAD"
              >
                <span className="material-symbols-outlined text-2xl">mic</span>
              </button>
            );
          }

          const isActive = item.path && currentRoute === item.path;
          return (
            <button
              key={idx}
              onClick={() => item.action ? item.action() : navigate(item.path!)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-xs font-semibold relative transition-colors cursor-pointer ${
                item.isDanger
                  ? 'text-error hover:bg-error-container/30'
                  : isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${item.isDanger ? 'animate-pulse' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-error text-on-error text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};


