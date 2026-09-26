 
"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { speakText } from '../services/speechService';
import { languageMeta, extendedLanguages } from '../locales';
import { LanguageCode } from '../types';

export const LandingHubView: React.FC = () => {
  const { t, language, setLanguage, navigate, resetToDemo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);
  const [langSearchFilter, setLangSearchFilter] = useState('');
  const [showLanguageBanner, setShowLanguageBanner] = useState(true);

  // Wage Calculator modal state
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcYears, setCalcYears] = useState('2');
  const [calcBasic, setCalcBasic] = useState('3200');
  const [calcDelayedMonths, setCalcDelayedMonths] = useState('2');

  const toggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceFeedback("ðŸŽ™ï¸ Listening in real-time... Say your situation in any language or dialect. SANAD will auto-detect it.");
      const timer = setTimeout(() => {
        setIsRecording(false);
        setVoiceFeedback('Transcribed: "Checking pending wages for 2 months and passport return..."');
        setSearchQuery("Unpaid 2 months salary and passport return");
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setIsRecording(false);
      setVoiceFeedback(null);
    }
  };

  const handleSimulatePrompt = (phrase: string, meaning: string) => {
    setSearchQuery(phrase);
    setVoiceFeedback(`Dialect Recognized: "${phrase}" (${meaning}) â€” Mapping to relevant grievance category...`);
    speakText(phrase, language);
  };

  const handleCardRead = (text: string) => {
    speakText(text, language);
  };

  // Calculate End of Service Severance + Unpaid Salary
  const years = parseFloat(calcYears) || 0;
  const basic = parseFloat(calcBasic) || 0;
  const delayed = parseFloat(calcDelayedMonths) || 0;
  const gratuityPerYear = (basic / 30) * 21;
  const totalGratuity = Math.round(years * gratuityPerYear);
  const totalDelayedWages = Math.round(delayed * basic);
  const grandTotalDue = totalGratuity + totalDelayedWages;

  const supportedLanguages: LanguageCode[] = ['en', 'ar', 'hi', 'bn', 'ur'];

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Top Ambient Banner: Language Detection */}
      {showLanguageBanner && (
        <div className="w-full bg-secondary-container text-on-secondary-container px-4 sm:px-8 py-3.5 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[19px]">translate</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 leading-snug">
                <span className="font-bold text-on-surface">Auto-Detected:</span>
                <span>
                  Your device defaults to <strong className="text-primary font-bold">{languageMeta[language]?.label || 'English'}</strong>. Would you prefer this interface or your native script?
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
              <button 
                onClick={() => setShowLanguageBanner(false)}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">check</span>
                <span>Yes, continue in {languageMeta[language]?.label}</span>
              </button>
              <a 
                href="#languageSelectorHub" 
                className="px-3.5 py-1.5 rounded-lg bg-surface text-on-surface font-semibold text-xs shadow-sm hover:bg-surface-container-high transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">public</span>
                <span>Change Language</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Context Header & Omnibar */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span>{t.landing.heroOverline}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                {t.landing.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                {t.landing.heroSubtitle}
              </p>
            </div>

            {/* Quick Demo Mode Launch Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={resetToDemo}
                className="px-5 py-3 rounded-xl bg-secondary-container hover:bg-surface-container-high text-on-secondary-container text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span>Try Demo Mode (Unpaid Wages)</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Live Omnibar Search & Voice Trigger */}
          <div className="relative bg-surface-container-low rounded-2xl p-2.5 sm:p-3.5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-1 bg-surface rounded-xl">
                <span className="material-symbols-outlined text-primary text-2xl">search</span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.landing.searchPlaceholder}
                  className="w-full bg-transparent text-sm sm:text-base text-on-surface placeholder:text-outline focus:outline-none py-2"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-outline-variant hover:text-on-surface p-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={toggleVoice}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-tertiary text-on-tertiary animate-pulse' 
                      : 'bg-primary text-on-primary hover:opacity-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {isRecording ? 'graphic_eq' : 'mic'}
                  </span>
                  <span>{isRecording ? 'Listening...' : t.landing.speakNaturally}</span>
                </button>
                <button 
                  onClick={() => navigate('/tell-sanad')}
                  className="px-4 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span>{t.landing.find}</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Quick intent chips */}
            <div className="mt-3 pt-3 flex flex-wrap items-center gap-2 text-xs border-t border-surface-container-high/40">
              <span className="text-on-surface-variant font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-tertiary">bolt</span>
                <span>{t.landing.quickIntent}</span>
              </span>
              <button 
                onClick={() => setShowCalcModal(true)}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
              >
                {t.landing.unpaidSalaryCalc}
              </button>
              <button 
                onClick={() => setSearchQuery('Passport withheld by sponsor or agency')}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
              >
                {t.landing.passportEmergency}
              </button>
              <button 
                onClick={() => navigate('/document-reader')}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
              >
                {t.landing.scanContract}
              </button>
              <button 
                onClick={() => setSearchQuery('Medical clinic with no insurance card')}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
              >
                {t.landing.clinicAccess}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Voice-First Dignity Guidance Banner (Bento Element) */}
      <section className="w-full px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-surface-container-low via-surface-container to-secondary-container rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-primary/5 rounded-full pointer-events-none blur-2xl"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                  <span>{t.landing.voiceBannerTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface leading-tight">
                  Speak or type naturally. Mix languages or speak your dialect freely.
                </h2>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  {t.landing.voiceBannerDesc}
                </p>

                {/* Spoken Prompt Presets */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase tracking-wider text-outline font-bold">
                    {t.landing.trySaying}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleSimulatePrompt('à¤®à¥‡à¤°à¤¾ 3 à¤®à¤¹à¥€à¤¨à¥‡ à¤•à¤¾ à¤ªà¤—à¤¾à¤° à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾, à¤•à¤‚à¤ªà¤¨à¥€ à¤›à¥à¤Ÿà¥à¤Ÿà¥€ à¤­à¥€ à¤¨à¤¹à¥€à¤‚ à¤¦à¥‡ à¤°à¤¹à¥€', 'Unpaid wage dispute (Hindi)')}
                      className="text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">chat_bubble</span>
                      <div>
                        <strong className="text-on-surface block font-semibold">â€œà¤®à¥‡à¤°à¤¾ 3 à¤®à¤¹à¥€à¤¨à¥‡ à¤•à¤¾ à¤ªà¤—à¤¾à¤° à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾...â€</strong>
                        <span className="text-outline text-[11px]">Unpaid wage dispute (Hindi)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSimulatePrompt('ÙƒÙÙŠÙ„ÙŠ Ø­Ø¬Ø² Ø¬ÙˆØ§Ø² Ø³ÙØ±ÙŠ ÙˆØ±ÙØ¶ ÙŠØ¯ÙØ¹ ØªØ°ÙƒØ±Ø© Ø§Ù„Ø¹ÙˆØ¯Ø©', 'Passport retention & return flight (Arabic)')}
                      className="text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">chat_bubble</span>
                      <div>
                        <strong className="text-on-surface block font-semibold leading-snug">â€œÙƒÙÙŠÙ„ÙŠ Ø­Ø¬Ø² Ø¬ÙˆØ§Ø² Ø³ÙØ±ÙŠ ÙˆÙŠØ±ÙØ¶ Ø³ÙØ±ÙŠ...â€</strong>
                        <span className="text-outline text-[11px]">Passport retention (Arabic)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSimulatePrompt('May sakit ako pero hindi ako binibigyan ng clinic pass ng employer ko', 'Medical denial grievance (Tagalog)')}
                      className="text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">chat_bubble</span>
                      <div>
                        <strong className="text-on-surface block font-semibold leading-snug">â€œMay sakit ako, walang clinic pass...â€</strong>
                        <span className="text-outline text-[11px]">Medical denial (Tagalog)</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSimulatePrompt('à¦†à¦®à¦¾à¦° à¦šà§à¦•à§à¦¤à¦¿ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦¬à§‡à¦¤à¦¨ à¦¦à§‡à§Ÿ à¦¨à¦¾à¦‡, à¦…à¦¤à¦¿à¦°à¦¿à¦•à§à¦¤ à¦•à¦¾à¦œ à¦•à¦°à¦¾à§Ÿ', 'Overtime & contract breach (Bengali)')}
                      className="text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-lg shrink-0">chat_bubble</span>
                      <div>
                        <strong className="text-on-surface block font-semibold leading-snug">â€œà¦†à¦®à¦¾à¦° à¦šà§à¦•à§à¦¤à¦¿ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦¬à§‡à¦¤à¦¨ à¦¦à§‡à§Ÿ à¦¨à¦¾à¦‡...â€</strong>
                        <span className="text-outline text-[11px]">Overtime breach (Bengali)</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Voice Waveform Visualizer Card */}
              <div className="lg:col-span-5 bg-surface rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wide">
                      {t.landing.micActive}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-mono font-medium">
                    96 Khz Multi-DSP
                  </span>
                </div>

                {/* Animated Waveform Bars */}
                <div className="py-4 px-2 bg-surface-container-low rounded-xl flex items-center justify-center gap-1.5 h-24 overflow-hidden">
                  <div className="w-1.5 bg-primary/40 rounded-full h-8 animate-pulse"></div>
                  <div className="w-1.5 bg-primary/70 rounded-full h-14"></div>
                  <div className="w-1.5 bg-primary rounded-full h-20 animate-pulse"></div>
                  <div className="w-1.5 bg-primary rounded-full h-10"></div>
                  <div className="w-1.5 bg-tertiary rounded-full h-16 animate-pulse"></div>
                  <div className="w-1.5 bg-primary rounded-full h-12"></div>
                  <div className="w-1.5 bg-primary/80 rounded-full h-6"></div>
                  <div className="w-1.5 bg-primary rounded-full h-16"></div>
                  <div className="w-1.5 bg-primary/60 rounded-full h-10"></div>
                  <div className="w-1.5 bg-primary rounded-full h-18 animate-pulse"></div>
                  <div className="w-1.5 bg-primary/50 rounded-full h-8"></div>
                  <div className="w-1.5 bg-primary rounded-full h-14"></div>
                  <div className="w-1.5 bg-primary/30 rounded-full h-6"></div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface leading-relaxed">
                    {voiceFeedback ? (
                      <span className="font-medium text-primary">{voiceFeedback}</span>
                    ) : (
                      <span>
                        <strong className="text-primary font-bold">Microphone status:</strong> Tap the button below to dictate your problem in any language. Audio is processed confidentially and never shared with employers.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/tell-sanad')}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">mic</span>
                      <span>{t.landing.startDictation}</span>
                    </button>
                    <button
                      onClick={() => handleCardRead(t.landing.voiceBannerDesc)}
                      className="p-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                      title="Listen to audio instructions"
                    >
                      <span className="material-symbols-outlined text-base">volume_up</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Native Language Selector Hub */}
      <section className="w-full px-4 sm:px-6 lg:px-12" id="languageSelectorHub">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[17px]">language</span>
                <span>Global Mother Tongue Matrix</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
                {t.landing.langHubTitle}
              </h2>
              <p className="text-sm text-on-surface-variant">
                {t.landing.langHubSubtitle}
              </p>
            </div>
            <div className="w-full md:w-80">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl text-xs">
                <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search language or native script..."
                  value={langSearchFilter}
                  onChange={(e) => setLangSearchFilter(e.target.value)}
                  className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Primary 5 Language Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {supportedLanguages
              .filter(code => {
                if (!langSearchFilter) return true;
                const filter = langSearchFilter.toLowerCase();
                const meta = languageMeta[code];
                return meta.label.toLowerCase().includes(filter) || meta.nativeLabel.toLowerCase().includes(filter);
              })
              .map((code) => {
                const isSelected = language === code;
                const meta = languageMeta[code];

                return (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`text-left p-4 rounded-xl shadow-sm transition-all relative cursor-pointer hover:scale-[1.02] ${
                      isSelected
                        ? 'bg-primary text-on-primary ring-2 ring-primary/40'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-on-primary"></span>
                      </span>
                    )}
                    <span className={`text-xs uppercase tracking-wider block mb-1 font-bold ${isSelected ? 'opacity-85' : 'text-tertiary'}`}>
                      {meta.region}
                    </span>
                    <span className="text-2xl font-headline font-bold block" dir={meta.dir}>
                      {meta.nativeLabel}
                    </span>
                    <span className={`text-xs block mt-1 ${isSelected ? 'opacity-90' : 'text-on-surface-variant'}`}>
                      {meta.label} â€¢ {meta.dir === 'rtl' ? 'RTL Layout' : 'Standard'}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* 65+ Dialects Expander */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface text-primary">
                <span className="material-symbols-outlined text-xl">travel_explore</span>
              </span>
              <div>
                <span className="text-sm font-bold text-on-surface block">
                  Looking for Tagalog, Nepali, Amharic, Pashto, Swahili, or others?
                </span>
                <span className="text-xs text-on-surface-variant">
                  Over 65 regional mother tongues are supported in audio interpretation and real-time translation.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsExtendedOpen(!isExtendedOpen)}
              className="shrink-0 px-4 py-2 rounded-xl bg-surface hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{isExtendedOpen ? 'Hide Extended Dialects' : 'Show All 65+ Dialects'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {isExtendedOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {isExtendedOpen && (
            <div className="bg-surface-container p-6 rounded-2xl space-y-4 animate-fadeIn">
              <div className="text-xs uppercase tracking-wider font-bold text-primary">
                Extended Dialect &amp; Audio Support Directory
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs text-on-surface">
                {extendedLanguages.map((el) => (
                  <button
                    key={el.code}
                    onClick={() => {
                      alert(`Selected ${el.name}. Audio processing will apply ${el.script} vocabulary models.`);
                    }}
                    className="p-2.5 rounded-lg bg-surface hover:bg-surface-container-high transition-colors text-left cursor-pointer flex flex-col"
                  >
                    <span className="font-bold">{el.script}</span>
                    <span className="text-[11px] text-outline">{el.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6-Card High Impact Bento Grid: Active Worker Services */}
      <section className="w-full px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Core Relief &amp; Legal Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mt-1">
                {t.landing.servicesTitle}
              </h2>
              <p className="text-sm text-on-surface-variant">
                {t.landing.servicesSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Legal Aid Response: <strong>&lt; 15 mins average</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Unpaid Wages & EOSB Calculator */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">calculate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCardRead("Wage & End of Service calculator. Automatically calculates severance pay and delayed salaries.")}
                      className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
                      title="Read aloud"
                    >
                      <span className="material-symbols-outlined text-[18px]">volume_up</span>
                    </button>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface text-tertiary font-bold text-[11px]">
                      Instant Tool
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                    Unpaid Wages &amp; End of Service Calculation
                  </h3>
                  <p className="text-xs text-outline mt-0.5" dir="rtl">Ø­Ø³Ø§Ø¨ Ù…ÙƒØ§ÙØ£Ø© Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø®Ø¯Ù…Ø© ÙˆØ§Ù„Ø£Ø¬ÙˆØ± Ø§Ù„Ù…ØªØ£Ø®Ø±Ø©</p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Calculate statutory gratuity, overtime dues, delayed monthly salary penalties, and unpaid leave indemnities under certified labor codes.
                </p>

                <div className="p-3 bg-surface rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-outline">
                    <span>Calculated Baseline Formula:</span>
                    <span className="font-mono text-on-surface font-bold">21 Days/Year</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full w-3/4 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-on-surface-variant">
                    <span>100% Confidential Calculation</span>
                    <span className="text-primary font-bold">No Employer Alert</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-2">
                <button
                  onClick={() => setShowCalcModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-sm transition-all cursor-pointer"
                >
                  <span>Open Gratuity &amp; Wage Calculator</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Card 2: Employment Contract Verifier & OCR Scanner */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">document_scanner</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCardRead("Contract Verifier and Scanner. Point your phone camera at any paper contract to translate illegal clauses.")}
                      className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">volume_up</span>
                    </button>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                      OCR Active
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                    Contract Verifier &amp; Camera Scan
                  </h3>
                  <p className="text-xs text-outline mt-0.5" dir="rtl">Ù‚Ø§Ø±Ø¦ Ø§Ù„Ø¹Ù‚ÙˆØ¯ Ø§Ù„Ø°ÙƒÙŠ ÙˆÙƒØ´Ù Ø§Ù„Ø´Ø±ÙˆØ· ØºÙŠØ± Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ©</p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Take a photo of any physical contract or offer letter. SANAD checks for prohibited wage deduction clauses, passport surrender requirements, or hidden fees.
                </p>

                <div 
                  onClick={() => navigate('/document-reader')}
                  className="p-3 bg-surface rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">photo_camera</span>
                    <div>
                      <span className="font-bold text-on-surface block">Smart Document Scan</span>
                      <span className="text-outline text-[11px]">Supports PDF, JPG, or Live Capture</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-primary underline">Scan Now</span>
                </div>
              </div>

              <div className="pt-6 mt-2">
                <button
                  onClick={() => navigate('/document-reader')}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface text-on-surface font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">upload_file</span>
                  <span>Upload or Snap Document</span>
                </button>
              </div>
            </div>

            {/* Card 3: Work Permit & Visa Status Tracker */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">badge</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[11px]">
                      Ministry Sync
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                    Work Permit &amp; Visa Status Tracker
                  </h3>
                  <p className="text-xs text-outline mt-0.5" dir="rtl">Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© ÙˆØªØµØ±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„ ÙˆØ­Ø§Ù„Ø© Ø§Ù„Ø¨Ù„Ø§ØºØ§Øª</p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Verify if your residency or work permit is active, check if an unlawful absconding notice was filed against you, and check job change transfer status.
                </p>

                <div className="p-3 bg-surface rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Recent Sample Status:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Legal Residency Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>Grace Period Protection:</span>
                    <span className="font-bold">60 Days Guaranteed</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-2">
                <button
                  onClick={() => navigate('/worker-rights')}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface text-on-surface font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">search_check</span>
                  <span>Check Transfer Rights</span>
                </button>
              </div>
            </div>

            {/* Card 4: Health Insurance & Free Clinic Locator */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">local_hospital</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface text-primary font-bold text-[11px]">
                    Free / Subsidized
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                    Health Insurance &amp; Medical Clinic Locator
                  </h3>
                  <p className="text-xs text-outline mt-0.5" dir="rtl">Ø§Ù„ØªØ£Ù…ÙŠÙ† Ø§Ù„ØµØ­ÙŠ ÙˆØ§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø·Ø¨ÙŠØ© Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠØ© Ù„Ù„Ø¹Ù…Ø§Ù„</p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Find clinics that treat workers without upfront cash demands or insurance rejections. Emergency care is guaranteed by law for work site heat stress and injury.
                </p>

                <div className="p-3 bg-surface rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <span className="font-bold text-on-surface block">34 Clinics Within 5km</span>
                      <span className="text-outline text-[11px]">Heat stroke &amp; acute pain walk-in</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-tertiary">GPS Active</span>
                </div>
              </div>

              <div className="pt-6 mt-2">
                <button
                  onClick={() => alert("Connecting to nearest 24/7 worker medical triage clinic...")}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface text-on-surface font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
                  <span>Find Closest Worker Clinic</span>
                </button>
              </div>
            </div>

            {/* Card 5: Official Grievance & Labor Court Support */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">gavel</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px]">
                    Free Legal Aid
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
                    Official Grievance &amp; Labor Court Support
                  </h3>
                  <p className="text-xs text-outline mt-0.5" dir="rtl">ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø´ÙƒØ§ÙˆÙ‰ Ø§Ù„Ø±Ø³Ù…ÙŠØ© ÙˆØ§Ù„Ø¯Ø¹Ù… Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠ</p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  File binding disputes directly to Ministry tribunals. Pro bono attorneys translate and advocate on your behalf with zero court fees for wage claimants.
                </p>

                <div className="p-3 bg-surface rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-outline">
                    <span>Fee Exemption Status:</span>
                    <span className="text-primary font-bold">100% Free for Workers</span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant">Confidential anonymous pre-filing assessment.</div>
                </div>
              </div>

              <div className="pt-6 mt-2">
                <button
                  onClick={() => navigate('/tell-sanad')}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface text-on-surface font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">balance</span>
                  <span>Start Grievance Filing</span>
                </button>
              </div>
            </div>

            {/* Card 6: Emergency 24/7 Worker Helpline & Safe Shelter */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-error/15 text-error flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error font-bold text-[11px] tracking-wide">
                    SOS Priority
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface group-hover:text-error transition-colors">
                    24/7 Emergency Helpline &amp; Safe Shelter
                  </h3>
                  <p className="text-xs text-outline mt-0.5" dir="rtl">Ø®Ø· Ø§Ù„Ø¥ØºØ§Ø«Ø© Ø§Ù„Ø·Ø§Ø±Ø¦ ÙˆÙ…Ø±Ø§ÙƒØ² Ø§Ù„Ø¥ÙŠÙˆØ§Ø¡ Ø§Ù„Ø¢Ù…Ù†Ø© ÙˆØ§Ù„Ù…Ø¬Ø§Ù†ÙŠØ©</p>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  If you are facing abuse, physical confinement, locked quarters, or life threats, reach our emergency dispatch team immediately. Safe crisis shelters are available today.
                </p>

                <div className="p-3 bg-surface rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-xl">phone_in_talk</span>
                    <div>
                      <span className="font-bold text-error block text-sm">800-SANAD-SOS</span>
                      <span className="text-outline text-[11px]">Toll-Free â€¢ Multilingual 24/7</span>
                    </div>
                  </div>
                  <span className="inline-flex h-2 w-2 rounded-full bg-error animate-ping"></span>
                </div>
              </div>

              <div className="pt-6 mt-2">
                <a
                  href="tel:80072623"
                  className="w-full py-2.5 px-4 rounded-xl bg-error text-on-error font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">emergency_share</span>
                  <span>Immediate Emergency Rescue</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Companion QR Handoff & Trust Showcase Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                <div className="w-full h-44 rounded-xl bg-primary-fixed/30 flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                  <span className="material-symbols-outlined text-5xl text-primary mb-2">signal_cellular_alt</span>
                  <span className="text-sm font-bold text-on-surface">Works Offline in Low Bandwidth</span>
                  <span className="text-xs text-on-surface-variant mt-1">Zero data charge on participating carrier networks</span>
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">
                    Carry SANAD in Your Pocket
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                    Save offline copies of contracts and legal receipts on any phone without requiring expensive data plans.
                  </p>
                </div>
              </div>

              {/* QR Code Handoff */}
              <div className="lg:col-span-5 bg-surface p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="shrink-0 p-3 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col items-center">
                  <svg className="w-24 h-24 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M10,10 h25 v25 h-25 z M15,15 v15 h15 v-15 z M19,19 h7 v7 h-7 z"></path>
                    <path d="M65,10 h25 v25 h-25 z M70,15 v15 h15 v-15 z M74,19 h7 v7 h-7 z"></path>
                    <path d="M10,65 h25 v25 h-25 z M15,70 v15 h15 v-15 z M19,74 h7 v7 h-7 z"></path>
                    <rect x="42" y="12" width="6" height="6"></rect>
                    <rect x="52" y="18" width="6" height="6"></rect>
                    <rect x="42" y="28" width="8" height="6"></rect>
                    <rect x="12" y="45" width="8" height="6"></rect>
                    <rect x="25" y="42" width="6" height="8"></rect>
                    <rect x="35" y="42" width="12" height="6"></rect>
                    <rect x="52" y="40" width="8" height="8"></rect>
                    <rect x="68" y="45" width="10" height="6"></rect>
                    <rect x="45" y="55" width="8" height="8"></rect>
                    <rect x="60" y="60" width="14" height="6"></rect>
                    <rect x="42" y="70" width="6" height="14"></rect>
                    <rect x="55" y="75" width="12" height="6"></rect>
                  </svg>
                  <span className="text-[10px] text-outline font-mono mt-1 font-bold">SCAN WITH PHONE</span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-primary uppercase">
                    <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
                    <span>{t.landing.openChannel}</span>
                  </div>
                  <h4 className="text-base font-headline font-bold text-on-surface">
                    WhatsApp &amp; Telegram Bot
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {t.landing.mobileSyncDesc}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container font-mono text-on-surface font-semibold">
                      WA: +800-72623-SOS
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="lg:col-span-3 space-y-3">
                <div className="p-3.5 rounded-xl bg-surface shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[17px]">security</span>
                    <span>{t.landing.whistleblowerTitle}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {t.landing.whistleblowerDesc}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-[17px]">volunteer_activism</span>
                    <span>{t.landing.rightsCertifiedTitle}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {t.landing.rightsCertifiedDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Unpaid Wage & Gratuity Calculator Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-surface-container-high">
            <button
              onClick={() => setShowCalcModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">calculate</span>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-on-surface">
                  Statutory Wage &amp; Severance Calculator
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Certified labor formula (21 days basic wage per completed year + unpaid wages)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">
                  Basic Monthly Salary (AED):
                </label>
                <input
                  type="number"
                  value={calcBasic}
                  onChange={(e) => setCalcBasic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Completed Years of Service:
                  </label>
                  <input
                    type="number"
                    value={calcYears}
                    onChange={(e) => setCalcYears(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Unpaid Months Delayed:
                  </label>
                  <input
                    type="number"
                    value={calcDelayedMonths}
                    onChange={(e) => setCalcDelayedMonths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Calculated Totals Box */}
              <div className="p-4 rounded-xl bg-primary-fixed/40 space-y-2 border border-primary-fixed-dim">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Severance Gratuity (EOSB):</span>
                  <span className="font-mono font-bold text-on-surface">AED {totalGratuity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Delayed Wages ({calcDelayedMonths} Months):</span>
                  <span className="font-mono font-bold text-on-surface">AED {totalDelayedWages.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-primary/20 flex justify-between text-sm font-bold text-on-surface">
                  <span className="text-primary font-headline">Total Statutory Entitlement:</span>
                  <span className="font-mono text-base text-primary font-bold">AED {grandTotalDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCalcModal(false);
                  navigate('/tell-sanad');
                }}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 cursor-pointer"
              >
                <span>Record Claim with this Calculation</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


