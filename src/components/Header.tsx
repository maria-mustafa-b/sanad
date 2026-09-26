 
"use client";
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
    resetToDemo
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, path: '/' },
    { label: 'Services', path: '/services' },
    { label: t.nav.journey, path: '/journey' },
    { label: t.nav.tellSanad, path: '/tell-sanad' },
    { label: t.nav.myProof, path: '/my-proof' },
    { label: t.nav.applications, path: '/applications' },
    { label: t.nav.publicVerification, path: '/verify' },
    { label: t.nav.documentReader, path: '/document-reader' },
    { label: t.nav.workerRights, path: '/worker-rights' },
  ];

  const handleAudioAssist = () => {
    const screenPrompt = `${t.brandName}. ${t.brandSlogan}. ${t.landing.heroSubtitle}`;
    speakText(screenPrompt, language);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-soft border-b border-surface-container-high/40">
      {/* Top Prototype & Hotline Bar */}
      <div className="w-full bg-surface-container-high text-xs text-on-surface-variant px-4 sm:px-6 lg:px-12 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center gap-1.5 font-medium text-primary shrink-0">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            <span className="hidden sm:inline">{t.certifiedBadge}</span>
          </span>
          <span className="hidden sm:inline text-secondary-fixed-dim">â€¢</span>
          <span className="flex items-center gap-1 text-[11px] sm:text-xs truncate">
            <span className="material-symbols-outlined text-[15px] text-primary">call</span>
            <span>{t.hotline247}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-secondary-container px-2 py-0.5 rounded-full text-on-secondary-container font-semibold">
            <span className="material-symbols-outlined text-[13px]">radar</span>
            <span>{t.autoDetectLanguage}</span>
          </span>
          <button 
            onClick={() => toggleSosModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error text-on-error font-bold text-xs tracking-wide hover:bg-error-container hover:text-on-error-container transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">emergency</span>
            <span>{t.sosButton}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Logo & Demo pill */}
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-xl shadow-sm tracking-tight group-hover:bg-on-primary-fixed-variant transition-colors">
                Ø³Ù€
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline font-bold text-lg text-primary tracking-tight">SANAD</span>
                  <span className="font-headline text-base text-tertiary font-semibold">Ø³ÙŽÙ†ÙŽØ¯</span>
                  {isDemoMode && (
                    <span 
                      onClick={(e) => { e.stopPropagation(); resetToDemo(); }}
                      title="Click to reset preloaded August Wages scenario"
                      className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <span>{t.nav.demoMode}</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-on-surface-variant truncate font-normal">
                  {t.brandSlogan}
                </span>
              </div>
            </button>
          </div>

          {/* Right Controls: Accessibility A/A+/A++, Language, Audio Assist, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Real Text Sizing Accessibility Controls */}
            <div className="hidden lg:flex items-center bg-surface-container rounded-lg p-0.5 shadow-sm">
              <button 
                onClick={() => setTextScale('normal')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${textScale === 'normal' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                title="Standard font size (16px)"
              >
                A
              </button>
              <button 
                onClick={() => setTextScale('large')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${textScale === 'large' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                title="Enlarge font size (18px)"
              >
                A+
              </button>
              <button 
                onClick={() => setTextScale('xlarge')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${textScale === 'xlarge' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                title="Maximum accessible font size (20px)"
              >
                A++
              </button>
            </div>

            {/* Read Aloud Audio Assist Button */}
            <button 
              onClick={handleAudioAssist}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-tertiary-container/30 hover:bg-tertiary-container text-on-tertiary-fixed-variant text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Read aloud page overview"
            >
              <span className="material-symbols-outlined text-[17px] text-tertiary">volume_up</span>
              <span className="hidden sm:inline">Audio</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative inline-block">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[17px] text-tertiary">language</span>
                <span>{languageMeta[language]?.nativeLabel || 'Language'}</span>
                <span className="material-symbols-outlined text-[15px]">expand_more</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container-high py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-outline">
                    Select Mother Tongue
                  </div>
                  {(['en', 'ar', 'hi', 'ur', 'bn'] as LanguageCode[]).map(code => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${language === code ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'}`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{languageMeta[code].nativeLabel}</span>
                        <span className="text-[11px] opacity-75">({languageMeta[code].label})</span>
                      </span>
                      {language === code && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-surface-container my-1"></div>
                  <button 
                    onClick={() => { navigate('/settings'); setIsLangMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-surface-container flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">public</span>
                    <span>All 65+ Dialects &amp; Matrix</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => navigate(currentUser.isGuest ? '/auth/welcome' : '/settings')}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity cursor-pointer shadow-sm relative group"
              title={currentUser.name}
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Stream */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-0 scrollbar-none">
          {navItems.map(item => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container shadow-xs font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => navigate('/help')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentRoute === '/help'
                ? 'bg-primary-container text-on-primary-container font-bold'
                : 'text-tertiary hover:bg-tertiary-container/30'
            }`}
          >
            {t.nav.help}
          </button>
        </nav>
      </div>
    </header>
  );
};


