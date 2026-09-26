import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import { languageMeta } from '../locales';
import { speakText } from '../services/speechService';

export const Header: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    textScale,
    setTextScale,
    currentRoute,
    navigate,
    isDemoMode,
    toggleSosModal,
    unreadNotificationsCount,
    currentUser,
    resetToDemo,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const onHero = currentRoute === '/';

  // Icon-first destinations — keep labels short; icons must stand alone
  const navItems = [
    { label: t.nav.home, path: '/', icon: 'home' },
    { label: t.nav.tellSanad, path: '/tell-sanad', icon: 'mic' },
    { label: t.nav.myProof, path: '/my-proof', icon: 'verified_user' },
    { label: t.nav.applications, path: '/applications', icon: 'assignment' },
    { label: t.nav.publicVerification, path: '/verify', icon: 'qr_code_scanner' },
  ];

  const handleAudioAssist = () => {
    const screenPrompt = `${t.brandName}. ${t.brandSlogan}. ${t.landing.heroSubtitle}`;
    speakText(screenPrompt, language);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
      onHero
        ? 'bg-navy/80 backdrop-blur-md border-white/10 shadow-none'
        : 'bg-surface/95 backdrop-blur-md shadow-soft border-surface-container-high/50'
    }`}>
      {/* Compact urgency strip */}
      <div className={`w-full px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 text-xs ${
        onHero ? 'bg-black/20 text-white' : 'bg-navy text-white'
      }`}>
        <span className="flex items-center gap-1.5 truncate">
          <span className="material-symbols-outlined text-[15px] text-accent">call</span>
          <span className="truncate">{t.hotline247}</span>
        </span>
        <button
          onClick={() => toggleSosModal(true)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-error text-on-error font-bold tracking-wide hover:opacity-90 transition-opacity cursor-pointer shrink-0 min-h-[32px]"
        >
          <span className="material-symbols-outlined text-[16px]">emergency</span>
          <span>SOS</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Logo mark */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            aria-label="SANAD home"
          >
            <img
              src="/sanad-icon-64.png"
              alt=""
              className="w-11 h-11 object-contain shrink-0 drop-shadow-sm"
              width={44}
              height={44}
            />
            <span className="flex flex-col items-start min-w-0">
              <span className={`font-headline font-bold text-xl tracking-tight leading-none ${onHero ? 'text-white' : 'text-navy'}`}>
                SANAD
              </span>
              <span className={`text-[11px] font-semibold tracking-wide ${onHero ? 'text-accent' : 'text-primary'}`} dir="rtl">
                سند
              </span>
            </span>
            {isDemoMode && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  resetToDemo();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    resetToDemo();
                  }
                }}
                title="Reset demo"
                className={`hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xl text-[11px] font-bold ${
                  onHero ? 'bg-gold/40 text-white' : 'bg-gold/30 text-navy'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Demo
              </span>
            )}
          </button>

          {/* Desktop icon nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {navItems.map((item) => {
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center min-w-[4.5rem] min-h-[3.25rem] px-2 py-1.5 rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : onHero
                      ? 'text-white/75 hover:bg-white/10 hover:text-white'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-navy'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[26px] ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold mt-0.5 leading-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className={`hidden lg:flex items-center rounded-xl p-0.5 ${onHero ? 'bg-white/10' : 'bg-surface-container'}`}>
              {(['normal', 'large', 'xlarge'] as const).map((scale, i) => (
                <button
                  key={scale}
                  onClick={() => setTextScale(scale)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-colors min-h-[36px] ${
                    textScale === scale
                      ? 'bg-primary text-on-primary'
                      : onHero
                      ? 'text-white/70 hover:text-white'
                      : 'text-on-surface-variant hover:text-navy'
                  }`}
                  title={scale}
                >
                  {i === 0 ? 'A' : i === 1 ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            <button
              onClick={handleAudioAssist}
              className={`p-2.5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                onHero ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-surface-container hover:bg-primary-container/40 text-navy'
              }`}
              title="Listen"
              aria-label="Read page aloud"
            >
              <span className={`material-symbols-outlined text-[22px] ${onHero ? 'text-accent' : 'text-primary'}`}>volume_up</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold min-h-[44px] cursor-pointer ${
                  onHero ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-surface-container hover:bg-surface-container-high text-navy'
                }`}
                aria-label="Language"
              >
                <span className={`material-symbols-outlined text-[20px] ${onHero ? 'text-accent' : 'text-primary'}`}>language</span>
                <span className="hidden sm:inline max-w-[4.5rem] truncate">
                  {languageMeta[language]?.nativeLabel}
                </span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container-high py-1.5 z-50">
                  {(['en', 'ar', 'hi', 'ur', 'bn'] as LanguageCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-3 text-sm font-semibold flex items-center justify-between min-h-[48px] ${
                        language === code
                          ? 'bg-primary-container/40 text-navy'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span>{languageMeta[code].nativeLabel}</span>
                      {language === code && (
                        <span className="material-symbols-outlined text-sm text-primary">check</span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-surface-container my-1" />
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-primary hover:bg-surface-container"
                  >
                    {t.nav.settings}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/notifications')}
              className={`relative p-2.5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                onHero ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-surface-container hover:bg-surface-container-high text-navy'
              }`}
              title={t.nav.notifications}
              aria-label={t.nav.notifications}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate(currentUser.isGuest ? '/auth/welcome' : '/settings')}
              className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-on-primary hover:bg-on-primary-fixed-variant transition-colors cursor-pointer"
              title={currentUser.name}
              aria-label="Account"
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
