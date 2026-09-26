import React from 'react';
import { useApp } from '../context/AppContext';
import { languageMeta, extendedLanguages } from '../locales';
import { LanguageCode, TextScale } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    textScale, 
    setTextScale, 
    currentUser, 
    resetToDemo, 
    logoutUser, 
    navigate 
  } = useApp();

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear your local sovereign case cache? This will reset all local credentials and dossiers back to initial demo mode.")) {
      resetToDemo();
      alert("Local cache cleared.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px] text-tertiary">settings</span>
          <span>Preferences &amp; Sovereign Control</span>
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
          {t.settings.title}
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {/* User Account / Profile Card */}
      <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">{currentUser.name}</h3>
              <span className="text-xs text-on-surface-variant font-mono">{currentUser.phone}</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
            {currentUser.isGuest ? 'Demo / Guest Mode' : 'Authenticated Worker Account'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-outline uppercase font-bold tracking-wider block">Nationality / Corridor:</span>
            <strong className="text-on-surface text-sm block mt-0.5">{currentUser.nationality || 'Not Specified'}</strong>
          </div>
          <div>
            <span className="text-outline uppercase font-bold tracking-wider block">Privacy Isolation:</span>
            <strong className="text-primary text-sm block mt-0.5">Device-Local Sovereign Storage</strong>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          {currentUser.isGuest ? (
            <button
              onClick={() => navigate('/auth/register')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 cursor-pointer"
            >
              Create Permanent Protected Account
            </button>
          ) : (
            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-error cursor-pointer"
            >
              {t.settings.signOut}
            </button>
          )}
        </div>
      </div>

      {/* Language Selection Matrix */}
      <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-5">
        <div>
          <h3 className="font-headline font-bold text-xl text-on-surface">
            {t.settings.languageSection}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Choose your preferred language. The entire user interface, RTL layout, and AI interpretation engine re-renders immediately.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(['en', 'ar', 'hi', 'ur', 'bn'] as LanguageCode[]).map((code) => {
            const isSelected = language === code;
            const meta = languageMeta[code];

            return (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-xs'
                    : 'bg-surface hover:bg-surface-container text-on-surface border border-surface-container-high/60'
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'opacity-85' : 'text-tertiary'}`}>
                    {meta.region}
                  </span>
                  <span className="text-xl font-headline font-bold block mt-1" dir={meta.dir}>
                    {meta.nativeLabel}
                  </span>
                </div>
                <span className={`text-[11px] block mt-2 ${isSelected ? 'opacity-90' : 'text-outline'}`}>
                  {meta.label} ({meta.dir === 'rtl' ? 'RTL' : 'LTR'})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Accessibility Display Font Sizing (A / A+ / A++) */}
      <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-5">
        <div>
          <h3 className="font-headline font-bold text-xl text-on-surface">
            {t.settings.textScaleSection}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Adjust font sizing across all screens for relaxed, low-strain reading.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTextScale('normal')}
            className={`p-4 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              textScale === 'normal'
                ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-xs font-bold'
                : 'bg-surface hover:bg-surface-container text-on-surface border border-surface-container-high/60'
            }`}
          >
            <span className="text-lg font-bold">A</span>
            <span className="text-[11px]">Standard (16px)</span>
          </button>

          <button
            onClick={() => setTextScale('large')}
            className={`p-4 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              textScale === 'large'
                ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-xs font-bold'
                : 'bg-surface hover:bg-surface-container text-on-surface border border-surface-container-high/60'
            }`}
          >
            <span className="text-2xl font-bold">A+</span>
            <span className="text-[11px]">Enlarged (18px)</span>
          </button>

          <button
            onClick={() => setTextScale('xlarge')}
            className={`p-4 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              textScale === 'xlarge'
                ? 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-xs font-bold'
                : 'bg-surface hover:bg-surface-container text-on-surface border border-surface-container-high/60'
            }`}
          >
            <span className="text-3xl font-bold">A++</span>
            <span className="text-[11px]">Maximum (20px)</span>
          </button>
        </div>
      </div>

      {/* Privacy & Cache Management */}
      <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-4">
        <div>
          <h3 className="font-headline font-bold text-xl text-on-surface">
            {t.settings.privacySection}
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            All dossiers, credentials, and OCR files are held in sandboxed client storage. You can purge them anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-xl bg-error/10 hover:bg-error/20 text-error font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">delete_forever</span>
            <span>{t.settings.clearData}</span>
          </button>

          <button
            onClick={resetToDemo}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Reload Default August Wages Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
