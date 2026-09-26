import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { speakText } from '../services/speechService';
import { languageMeta } from '../locales';
import { LanguageCode } from '../types';
import { Reveal } from '../components/Reveal';
import { TrustMarquee } from '../components/TrustMarquee';
import { HowStorySteps } from '../components/HowStorySteps';

export const LandingHubView: React.FC = () => {
  const { t, language, setLanguage, navigate, toggleSosModal } = useApp();
  const [isListening, setIsListening] = useState(false);

  const featureActions = [
    { label: t.landing.actionTell, icon: 'mic', path: '/tell-sanad', primary: true },
    { label: t.landing.actionProof, icon: 'verified_user', path: '/my-proof' },
    { label: t.landing.actionApps, icon: 'assignment', path: '/applications' },
    { label: t.landing.actionVerify, icon: 'qr_code_scanner', path: '/verify' },
  ];

  const languages: LanguageCode[] = ['en', 'ar', 'hi', 'ur', 'bn'];

  const howSteps = [
    {
      num: '01',
      title: t.landing.howStep1Title,
      body: t.landing.howStep1Body,
      icon: 'mic',
    },
    {
      num: '02',
      title: t.landing.howStep2Title,
      body: t.landing.howStep2Body,
      icon: 'fact_check',
    },
    {
      num: '03',
      title: t.landing.howStep3Title,
      body: t.landing.howStep3Body,
      icon: 'shield_lock',
    },
  ];

  const startVoiceJourney = () => {
    setIsListening(true);
    speakText(t.landing.heroListenPrompt, language);
    window.setTimeout(() => {
      setIsListening(false);
      navigate('/tell-sanad');
    }, 900);
  };

  const listenSection = (text: string) => {
    speakText(text, language);
  };

  return (
    <div className="w-full">
      {/* Hero — immediate, no scroll reveal */}
      <section className="relative w-full min-h-[100svh] flex items-end sm:items-center overflow-hidden bg-navy">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: 'url(/sanad-icon-512.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '85% 55%',
            backgroundSize: 'min(55vw, 420px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(96,197,181,0.25),transparent_55%)]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-16 sm:py-28">
          <div className="max-w-xl space-y-8 animate-floatIn">
            <img
              src="/sanad-icon-192.png"
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
            />
            <h1 className="font-headline font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
              {t.landing.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-md leading-relaxed font-body">
              {t.landing.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={startVoiceJourney}
                disabled={isListening}
                className={`inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-primary hover:bg-accent text-on-primary font-bold text-lg shadow-lg min-h-[64px] transition-all cursor-pointer active:scale-[0.98] ${
                  isListening ? 'animate-softPulse' : ''
                }`}
              >
                <span className="material-symbols-outlined text-3xl filled">mic</span>
                <span>{isListening ? t.landing.listening : t.landing.heroCta}</span>
              </button>
              <button
                onClick={() => listenSection(`${t.landing.heroTitle}. ${t.landing.heroSubtitle}`)}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-white/30 text-white font-semibold min-h-[56px] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Listen to this page"
              >
                <span className="material-symbols-outlined text-2xl">volume_up</span>
                <span>{t.landing.listen}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <TrustMarquee label={t.landing.marqueeLabel} />

      {/* Icon actions */}
      <section className="w-full bg-surface py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featureActions.map((action, i) => (
              <Reveal key={action.path} delayMs={i * 70}>
                <button
                  onClick={() => navigate(action.path)}
                  className={`hover-elevate group w-full flex flex-col items-center text-center gap-4 p-6 sm:p-8 min-h-[160px] rounded-xl cursor-pointer ${
                    action.primary
                      ? 'bg-primary text-on-primary shadow-soft'
                      : 'bg-surface-container-lowest shadow-card text-navy'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-5xl sm:text-6xl ${
                      action.primary ? '' : 'text-primary'
                    }`}
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}
                  >
                    {action.icon}
                  </span>
                  <span className="font-headline font-bold text-base sm:text-lg leading-snug">
                    {action.label}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HowStorySteps title={t.landing.howTitle} steps={howSteps} />

      {/* Speak */}
      <section className="w-full bg-surface-container-low">
        <Reveal>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
            <div className="relative bg-navy min-h-[240px] lg:min-h-full flex items-center justify-center p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
              <span
                className="material-symbols-outlined text-white/90 relative z-10"
                style={{ fontSize: '120px', fontVariationSettings: "'FILL' 0, 'wght' 200, 'opsz' 48" }}
              >
                record_voice_over
              </span>
            </div>
            <div className="flex flex-col justify-center gap-5 px-8 sm:px-12 lg:px-16 py-14 sm:py-20">
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-navy leading-tight">
                {t.landing.sectionSpeakTitle}
              </h2>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-md">
                {t.landing.sectionSpeakBody}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/tell-sanad')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-bold min-h-[52px] hover:bg-on-primary-fixed-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">mic</span>
                  {t.landing.heroCta}
                </button>
                <button
                  onClick={() => listenSection(t.landing.sectionSpeakBody)}
                  className="p-3.5 rounded-xl bg-surface-container-high text-primary min-h-[52px] min-w-[52px] cursor-pointer"
                  aria-label="Listen"
                >
                  <span className="material-symbols-outlined text-2xl">volume_up</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Proof */}
      <section className="w-full bg-surface">
        <Reveal>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
            <div className="flex flex-col justify-center gap-5 px-8 sm:px-12 lg:px-16 py-14 sm:py-20 order-2 lg:order-1">
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-navy leading-tight">
                {t.landing.sectionProofTitle}
              </h2>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-md">
                {t.landing.sectionProofBody}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/my-proof')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy text-white font-bold min-h-[52px] hover:bg-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">verified_user</span>
                  {t.landing.actionProof}
                </button>
                <button
                  onClick={() => listenSection(t.landing.sectionProofBody)}
                  className="p-3.5 rounded-xl bg-surface-container text-primary min-h-[52px] min-w-[52px] cursor-pointer"
                  aria-label="Listen"
                >
                  <span className="material-symbols-outlined text-2xl">volume_up</span>
                </button>
              </div>
            </div>
            <div className="relative bg-primary/10 min-h-[240px] lg:min-h-full flex items-center justify-center p-12 order-1 lg:order-2">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: '120px', fontVariationSettings: "'FILL' 0, 'wght' 200, 'opsz' 48" }}
              >
                shield_lock
              </span>
              <span className="absolute top-8 right-8 px-3 py-1 rounded-xl bg-gold text-navy text-xs font-bold">
                {t.landing.proofBadge}
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="w-full bg-navy text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
            {[
              { value: '100%', label: t.landing.statSovereignty, color: 'text-accent' },
              { value: '9+', label: t.landing.statDialects, color: 'text-gold' },
              { value: 'Zero', label: t.landing.statLeaks, color: 'text-white' },
            ].map((stat, i) => (
              <Reveal key={stat.value} delayMs={i * 90}>
                <div className="space-y-2">
                  <div className={`font-headline font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-white/70 font-medium">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Language picker */}
      <section className="w-full bg-surface py-16 sm:py-20" id="languageSelectorHub">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
          <Reveal>
            <div className="text-center space-y-3 max-w-lg mx-auto">
              <h2 className="font-headline font-bold text-3xl sm:text-4xl text-navy">
                {t.landing.langHubTitle}
              </h2>
              <p className="text-on-surface-variant">{t.landing.langHubSubtitle}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {languages.map((code, i) => {
              const meta = languageMeta[code];
              const selected = language === code;
              return (
                <Reveal key={code} delayMs={i * 50}>
                  <button
                    onClick={() => setLanguage(code)}
                    className={`hover-elevate w-full flex flex-col items-center justify-center gap-2 p-6 min-h-[120px] rounded-xl cursor-pointer ${
                      selected
                        ? 'bg-primary text-on-primary shadow-soft ring-2 ring-accent'
                        : 'bg-surface-container-lowest shadow-card text-navy'
                    }`}
                  >
                    <span className="font-headline font-bold text-2xl" dir={meta.dir}>
                      {meta.nativeLabel}
                    </span>
                    <span className={`text-xs font-semibold ${selected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                      {meta.label}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full bg-surface-container-low py-16 sm:py-24">
        <Reveal>
          <div className="max-w-3xl mx-auto px-5 text-center space-y-8">
            <h2 className="font-headline font-bold text-3xl sm:text-4xl text-navy leading-tight">
              {t.landing.finalCtaTitle}
            </h2>
            <button
              onClick={startVoiceJourney}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-primary hover:bg-accent text-on-primary font-bold text-xl shadow-lg min-h-[68px] transition-all cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-3xl filled">mic</span>
              <span>{t.landing.heroCta}</span>
            </button>
            <button
              onClick={() => toggleSosModal(true)}
              className="block mx-auto text-error font-bold text-sm underline-offset-4 hover:underline cursor-pointer min-h-[44px]"
            >
              {t.sosButton}
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="w-full bg-navy text-white py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <img src="/sanad-logo-full-transparent.png" alt="SANAD" className="h-12 w-auto object-contain" />
          <p className="text-sm text-white/60 text-center sm:text-right">
            Support · Access · Verify
            <br />
            <span className="text-accent font-semibold">800-SANAD-SOS</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
