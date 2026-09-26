import React from 'react';
import { useApp } from '../context/AppContext';

export const SOSModal: React.FC = () => {
  const { isSosModalOpen, toggleSosModal, t } = useApp();

  if (!isSosModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-error/20 space-y-6 relative">
        <button
          onClick={() => toggleSosModal(false)}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-error/15 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-3xl">emergency</span>
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-error bg-error/10 px-2.5 py-0.5 rounded-full">
              High Urgency Protocol
            </span>
            <h2 className="text-xl sm:text-2xl font-headline font-bold text-on-surface mt-1">
              {t.sos.modalTitle}
            </h2>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed">
          {t.sos.modalSubtitle}
        </p>

        <div className="space-y-3 pt-2">
          {/* Call 800-SANAD-SOS */}
          <a
            href="tel:80072623"
            className="w-full py-4 px-6 rounded-xl bg-error text-on-error font-bold text-base flex items-center justify-center gap-3 shadow-md hover:bg-error/90 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">call</span>
            <span>{t.sos.callHotline}</span>
          </a>

          {/* Emergency Shelter Locator */}
          <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">home_pin</span>
              <div className="text-xs">
                <span className="font-bold text-on-surface block">Safe Crisis Accommodation</span>
                <span className="text-on-surface-variant">Confidential locations with 24/7 security &amp; meals</span>
              </div>
            </div>
            <span className="text-xs font-bold text-primary">Open 24/7</span>
          </div>

          {/* Embassy Liaison */}
          <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl">flag</span>
              <div className="text-xs">
                <span className="font-bold text-on-surface block">Consular Emergency Outreach</span>
                <span className="text-on-surface-variant">Outpass &amp; immediate diplomatic intervention</span>
              </div>
            </div>
            <span className="text-xs font-bold text-tertiary">Active</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => toggleSosModal(false)}
            className="text-xs text-on-surface-variant hover:text-on-surface font-semibold underline cursor-pointer"
          >
            {t.sos.close}
          </button>
        </div>
      </div>
    </div>
  );
};
