/* eslint-disable */
"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface ServiceCard {
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  badge: string;
  badgeColor: string;
  detail: string;
  detailIcon: string;
  ctaLabel: string;
  ctaRoute?: string;
  ctaIcon: string;
  urgent?: boolean;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    icon: 'calculate',
    title: 'Unpaid Wages & End of Service Calculation',
    titleAr: 'Ø­Ø³Ø§Ø¨ Ù…ÙƒØ§ÙØ£Ø© Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø®Ø¯Ù…Ø© ÙˆØ§Ù„Ø£Ø¬ÙˆØ± Ø§Ù„Ù…ØªØ£Ø®Ø±Ø©',
    description: 'Calculate exact statutory gratuity, overtime dues, delayed monthly salary penalties, and unpaid leave indemnities under certified labor codes.',
    badge: 'Instant Tool',
    badgeColor: 'bg-surface text-tertiary',
    detail: 'Calculated Baseline Formula: 21 Days/Year',
    detailIcon: 'payments',
    ctaLabel: 'Open Gratuity & Wage Calculator',
    ctaRoute: '/',
    ctaIcon: 'arrow_forward',
  },
  {
    icon: 'document_scanner',
    title: 'Contract Verifier & Camera Scan',
    titleAr: 'Ù‚Ø§Ø±Ø¦ Ø§Ù„Ø¹Ù‚ÙˆØ¯ Ø§Ù„Ø°ÙƒÙŠ ÙˆÙƒØ´Ù Ø§Ù„Ø´Ø±ÙˆØ· ØºÙŠØ± Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ©',
    description: 'Take a photo of any physical contract or offer letter. SANAD checks for prohibited wage deduction clauses, passport surrender requirements, or hidden fees in your language.',
    badge: 'OCR Active',
    badgeColor: 'bg-primary/10 text-primary',
    detail: 'Smart Document Scan â€¢ PDF, JPG, or Live Capture',
    detailIcon: 'photo_camera',
    ctaLabel: 'Upload or Snap Document',
    ctaRoute: '/document-reader',
    ctaIcon: 'upload_file',
  },
  {
    icon: 'badge',
    title: 'Work Permit & Visa Status Tracker',
    titleAr: 'Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø¥Ù‚Ø§Ù…Ø© ÙˆØªØµØ±ÙŠØ­ Ø§Ù„Ø¹Ù…Ù„ ÙˆØ­Ø§Ù„Ø© Ø§Ù„Ø¨Ù„Ø§ØºØ§Øª',
    description: 'Verify if your residency or work permit is active, check if an unlawful absconding notice was filed against you, and check job change transfer status.',
    badge: 'Ministry Sync',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    detail: 'Grace Period Protection: 60 Days Guaranteed',
    detailIcon: 'search_check',
    ctaLabel: 'Check My Permit / Visa Status',
    ctaIcon: 'search_check',
  },
  {
    icon: 'local_hospital',
    title: 'Health Insurance & Medical Clinic Locator',
    titleAr: 'Ø§Ù„ØªØ£Ù…ÙŠÙ† Ø§Ù„ØµØ­ÙŠ ÙˆØ§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø·Ø¨ÙŠØ© Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠØ© Ù„Ù„Ø¹Ù…Ø§Ù„',
    description: 'Find clinics that treat workers without upfront cash demands or insurance rejections. Emergency care is guaranteed by law for work site heat stress and injury.',
    badge: 'Free / Subsidized',
    badgeColor: 'bg-surface text-primary',
    detail: '34 Clinics Within 5km â€¢ Heat stroke & acute pain walk-in',
    detailIcon: 'location_on',
    ctaLabel: 'Find Closest Worker Clinic',
    ctaIcon: 'near_me',
  },
  {
    icon: 'gavel',
    title: 'Official Grievance & Labor Court Support',
    titleAr: 'ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø´ÙƒØ§ÙˆÙ‰ Ø§Ù„Ø±Ø³Ù…ÙŠØ© ÙˆØ§Ù„Ø¯Ø¹Ù… Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠ Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠ',
    description: 'File binding disputes directly to Ministry tribunals. Pro bono attorneys translate and advocate on your behalf with zero court fees for wage claimants.',
    badge: 'Free Legal Aid',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    detail: 'Fee Exemption: 100% Free for Workers',
    detailIcon: 'balance',
    ctaLabel: 'Start Grievance Filing',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'balance',
  },
  {
    icon: 'emergency_share',
    title: '24/7 Emergency Helpline & Safe Shelter',
    titleAr: 'Ø®Ø· Ø§Ù„Ø¥ØºØ§Ø«Ø© Ø§Ù„Ø·Ø§Ø±Ø¦ ÙˆÙ…Ø±Ø§ÙƒØ² Ø§Ù„Ø¥ÙŠÙˆØ§Ø¡ Ø§Ù„Ø¢Ù…Ù†Ø© ÙˆØ§Ù„Ù…Ø¬Ø§Ù†ÙŠØ©',
    description: 'If you are facing abuse, physical confinement, locked quarters, or life threats, reach our emergency dispatch team immediately. Safe crisis shelters are available today.',
    badge: 'SOS Priority',
    badgeColor: 'bg-error text-on-error',
    detail: '800-SANAD-SOS â€¢ Toll-Free â€¢ Multilingual 24/7',
    detailIcon: 'phone_in_talk',
    ctaLabel: 'Immediate Emergency Rescue',
    ctaIcon: 'emergency_share',
    urgent: true,
  },
];

const LANGUAGE_GRID = [
  { code: 'en', label: 'English', sublabel: 'Default UI', region: 'Primary', dir: 'ltr' },
  { code: 'ar', label: 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', sublabel: 'Arabic â€¢ ÙØµØ­Ù‰ ÙˆÙ„ØºØ§Øª Ù…Ø­Ù„ÙŠØ©', region: 'Middle East', dir: 'rtl' },
  { code: 'hi', label: 'à¤¹à¤¿à¤¨à¥à¤¦à¥€', sublabel: 'Hindi â€¢ à¤†à¤µà¤¾à¤œ à¤”à¤° à¤«à¥‰à¤°à¥à¤®', region: 'South Asia', dir: 'ltr' },
  { code: 'bn', label: 'à¦¬à¦¾à¦‚à¦²à¦¾', sublabel: 'Bengali â€¢ à¦¶à§à¦°à¦®à¦¿à¦• à¦¸à¦¹à¦¾à¦¯à¦¼à¦¤à¦¾', region: 'South Asia', dir: 'ltr' },
  { code: 'ta', label: 'à®¤à®®à®¿à®´à¯', sublabel: 'Tamil â€¢ à®¤à¯Šà®´à®¿à®²à®¾à®³à®°à¯ à®‰à®°à®¿à®®à¯ˆ', region: 'South Asia', dir: 'ltr' },
  { code: 'te', label: 'à°¤à±†à°²à±à°—à±', sublabel: 'Telugu â€¢ à°•à°¾à°°à±à°®à°¿à°•à±à°² à°°à°•à±à°·à°£', region: 'South Asia', dir: 'ltr' },
  { code: 'ml', label: 'à´®à´²à´¯à´¾à´³à´‚', sublabel: 'Malayalam â€¢ à´ªàµà´°à´µà´¾à´¸à´¿ à´¸à´¹à´¾à´¯à´‚', region: 'South Asia', dir: 'ltr' },
  { code: 'ur', label: 'Ø§Ø±Ø¯Ùˆ', sublabel: 'Urdu â€¢ Ù…Ø­Ù†Øª Ú©Ø´ Ù‚Ø§Ù†ÙˆÙ†ÛŒ Ù…Ø¯Ø¯', region: 'South Asia', dir: 'rtl' },
  { code: 'tl', label: 'Tagalog', sublabel: 'Filipino â€¢ Gabay sa Manggagawa', region: 'Southeast Asia', dir: 'ltr' },
  { code: 'pa', label: 'à¨ªà©°à¨œà¨¾à¨¬à©€', sublabel: 'Punjabi â€¢ à¨®à¨œà¨¼à¨¦à©‚à¨° à¨…à¨§à¨¿à¨•à¨¾à¨°', region: 'South Asia', dir: 'ltr' },
  { code: 'si', label: 'à·ƒà·’à¶‚à·„à¶½', sublabel: 'Sinhala â€¢ à·ƒà·šà·€à¶š à·ƒà·”à¶»à·à¶šà·”à¶¸', region: 'South Asia', dir: 'ltr' },
  { code: 'ne', label: 'à¤¨à¥‡à¤ªà¤¾à¤²à¥€', sublabel: 'Nepali â€¢ à¤¶à¥à¤°à¤®à¤¿à¤• à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾', region: 'South Asia', dir: 'ltr' },
  { code: 'fr', label: 'FranÃ§ais', sublabel: 'Droits des Travailleurs', region: 'Africa / Europe', dir: 'ltr' },
  { code: 'sw', label: 'Kiswahili', sublabel: 'Haki za Wafanyakazi', region: 'East Africa', dir: 'ltr' },
];

const EXTENDED_DIALECTS = [
  'áŠ áˆ›áˆ­áŠ› (Amharic)', 'Ù¾ÚšØªÙˆ (Pashto)', 'Tiáº¿ng Viá»‡t', 'Bahasa Indonesia',
  'Oromoo (Oromo)', 'á‰µáŒáˆ­áŠ› (Tigrinya)', 'á€—á€™á€¬á€…á€¬ (Burmese)', 'TÃ¼rkÃ§e (Turkish)',
  'à¦¬à¦¾à¦‚à¦²à¦¾ (Sylheti)', 'Ú©ÙˆØ±Ø¯ÛŒ (Kurdish)', 'Marwari / à¤®à¤¾à¤°à¤µà¤¾à¤¡à¤¼à¥€', 'Bhojpuri / à¤­à¥‹à¤œà¤ªà¥à¤°à¥€',
];

const VOICE_PRESETS = [
  { text: 'à¤®à¥‡à¤°à¤¾ 3 à¤®à¤¹à¥€à¤¨à¥‡ à¤•à¤¾ à¤ªà¤—à¤¾à¤° à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾...', label: 'Unpaid wage dispute (Hindi)' },
  { text: 'ÙƒÙÙŠÙ„ÙŠ Ø­Ø¬Ø² Ø¬ÙˆØ§Ø² Ø³ÙØ±ÙŠ ÙˆÙŠØ±ÙØ¶ Ø³ÙØ±ÙŠ...', label: 'Passport retention & return flight (Arabic)' },
  { text: 'May sakit ako, walang clinic pass...', label: 'Medical denial grievance (Tagalog)' },
  { text: 'à¦†à¦®à¦¾à¦° à¦šà§à¦•à§à¦¤à¦¿ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦¬à§‡à¦¤à¦¨ à¦¦à§‡à¦¯à¦¼ à¦¨à¦¾à¦‡...', label: 'Overtime & contract breach (Bengali)' },
];

export const WorkerDignityView: React.FC = () => {
  const { navigate, setLanguage, language } = useApp();
  const [langSearch, setLangSearch] = useState('');
  const [showExtended, setShowExtended] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const filteredLangs = LANGUAGE_GRID.filter(l =>
    !langSearch || l.label.toLowerCase().includes(langSearch.toLowerCase()) || l.sublabel.toLowerCase().includes(langSearch.toLowerCase())
  );

  const handleLangSelect = (code: string) => {
    setSelectedLang(code as any);
    setLanguage(code as any);
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn">
      {/* Language Detection Banner */}
      {!bannerDismissed && (
        <div className="w-full bg-secondary-container text-on-secondary-container px-4 sm:px-8 py-3.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[19px]">translate</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 leading-snug">
                <span className="font-bold text-on-surface">Auto-Detected:</span>
                <span>Your device defaults to <strong className="text-primary font-bold">English (US)</strong>. Would you prefer this interface or your native script?</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-auto">
              <button
                onClick={() => setBannerDismissed(true)}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 shadow-sm transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">check</span> Yes, continue in English
              </button>
              <a href="#language-hub" className="px-3.5 py-1.5 rounded-lg bg-surface text-on-surface font-semibold text-xs shadow-sm hover:bg-surface-container-high transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">public</span> Change Language
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero + Omnibar */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-8 pb-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                Unified Worker Protection Ecosystem
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                Worker Dignity & Multilingual Sanctuary
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Instant legal aid, emergency housing, voice translation, and wage reconciliation. Speak naturally in your native language â€” we listen, protect, and advocate.
              </p>
            </div>
            {/* Text size strip */}
            <div className="bg-surface-container-low p-2 rounded-xl flex items-center gap-3 self-start md:self-auto shadow-sm flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-on-surface-variant px-1.5 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-primary">accessibility_new</span>
                <span>Display Text:</span>
              </div>
              <div className="flex items-center bg-surface-container rounded-lg p-0.5">
                {['A','A+','A++'].map((s, i) => (
                  <button key={s} className={`px-2 py-1 rounded text-xs font-bold transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>{s}</button>
                ))}
              </div>
              <div className="h-4 w-px bg-outline-variant" />
              <button className="p-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[17px]">volume_up</span>
                <span className="hidden sm:inline">Audio Assist</span>
              </button>
            </div>
          </div>

          {/* Omnibar */}
          <div className="relative bg-surface-container-low rounded-2xl p-2.5 sm:p-3.5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-1 bg-surface rounded-xl">
                <span className="material-symbols-outlined text-primary text-2xl">search</span>
                <input
                  className="w-full bg-transparent text-sm sm:text-base text-on-surface placeholder:text-outline focus:outline-none py-2"
                  placeholder="Search services, contracts, salary disputes, or speak naturally..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-outline-variant hover:text-on-surface p-1">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setVoiceActive(v => !v)}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all ${voiceActive ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}
                >
                  <span className="material-symbols-outlined text-xl">{voiceActive ? 'stop_circle' : 'mic'}</span>
                  <span>{voiceActive ? 'Stop Listening' : 'Speak Naturally'}</span>
                </button>
                <button
                  onClick={() => navigate('/tell-sanad')}
                  className="px-4 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-surface-variant transition-colors"
                >
                  <span>Find</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
            {/* Quick chips */}
            <div className="mt-3 pt-3 flex flex-wrap items-center gap-2 text-xs border-t border-outline-variant/30">
              <span className="text-on-surface-variant font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-tertiary">bolt</span> Quick Intent:
              </span>
              {['ðŸ’° Unpaid Salary Calculation','ðŸ›‚ Withheld Passport Emergency','ðŸ“„ Scan Paper Contract','ðŸ¥ Emergency Clinic Access'].map(chip => (
                <button
                  key={chip}
                  onClick={() => setSearchQuery(chip.slice(3))}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voice Sanctuary Banner */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-surface-container-low via-surface-container to-secondary-container rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-primary/5 rounded-full pointer-events-none blur-2xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Copy & presets */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                  Universal Voice Sanctuary & Dialect Freedom
                </div>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface leading-tight">
                  Speak or type naturally. Mix languages or speak your dialect freely.
                </h2>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  No need to struggle with official English or legal jargon. Speak Hindi mixed with Punjabi, Egyptian Arabic, Taglish, Bengali, or Swahili. SANAD interprets context, emotional urgency, and labor rights principles instantly.
                </p>
                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase tracking-wider text-outline font-bold">Try saying or tapping one:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {VOICE_PRESETS.map(preset => (
                      <button
                        key={preset.text}
                        onClick={() => navigate('/tell-sanad')}
                        className="text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">chat_bubble</span>
                        <div>
                          <strong className="text-on-surface block font-semibold leading-snug">"{preset.text}"</strong>
                          <span className="text-outline text-[11px]">{preset.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right: Waveform card */}
              <div className="lg:col-span-5 bg-surface rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping" />
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wide">Audio Engine: Ready</span>
                  </div>
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-mono font-medium">96 Khz Multi-DSP</span>
                </div>
                <div className="py-4 px-2 bg-surface-container-low rounded-xl flex items-center justify-center gap-1.5 h-24 overflow-hidden">
                  {[8,14,20,10,16,12,6,16,10,18,8,14,6].map((h, i) => (
                    <div key={i} className={`w-1.5 rounded-full ${i % 3 === 0 ? 'bg-tertiary' : 'bg-primary'} animate-pulse`} style={{ height: `${h * 4}px`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface leading-relaxed">
                    <span className="font-bold text-primary">Microphone status:</span> Tap the button below to dictate your problem in any language. Audio is processed confidentially and never shared with employers.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/tell-sanad')}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-base">mic</span>
                      Start Audio Dictation
                    </button>
                    <button className="p-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-base">volume_up</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selector Hub */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-14" id="language-hub">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[17px]">language</span>
                Global Mother Tongue Matrix
              </div>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">Choose Your Preferred Native Language</h2>
              <p className="text-sm text-on-surface-variant">Instant, seamless switch. All legal forms, voice tools, and helpline routing immediately update.</p>
            </div>
            <div className="w-full md:w-80">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl text-xs">
                <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                <input
                  className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none"
                  placeholder="Search language or native script..."
                  value={langSearch}
                  onChange={e => setLangSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {filteredLangs.map(lang => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLangSelect(lang.code)}
                  className={`text-left p-4 rounded-xl shadow-sm hover:scale-[1.02] transition-all relative group ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-on-primary" />
                    </span>
                  )}
                  <span className={`text-xs uppercase tracking-wider opacity-85 block mb-1 ${isSelected ? '' : 'text-tertiary font-bold'}`}>{lang.region}</span>
                  <span className="text-xl font-headline font-bold block" dir={lang.dir}>{lang.label}</span>
                  <span className={`text-xs block mt-1 ${isSelected ? 'opacity-90' : 'text-on-surface-variant'}`}>{lang.sublabel}</span>
                </button>
              );
            })}
          </div>

          {/* Extended dialects expander */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface text-primary">
                <span className="material-symbols-outlined text-xl">travel_explore</span>
              </span>
              <div>
                <span className="text-sm font-bold text-on-surface block">Looking for Amharic, Pashto, Vietnamese, Indonesian, or others?</span>
                <span className="text-xs text-on-surface-variant">Over 65 regional dialects and mother tongues are supported in audio and real-time translation.</span>
              </div>
            </div>
            <button
              onClick={() => setShowExtended(e => !e)}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-surface hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{showExtended ? 'Hide Dialects' : 'Show All 65+ Dialects'}</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${showExtended ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
          </div>

          {showExtended && (
            <div className="bg-surface-container p-6 rounded-2xl space-y-4 animate-fadeIn">
              <div className="text-xs uppercase tracking-wider font-bold text-primary">Extended Dialect Directory</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs text-on-surface">
                {EXTENDED_DIALECTS.map(d => (
                  <span key={d} className="p-2 rounded bg-surface">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Relief & Legal Infrastructure</span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mt-1">Active Worker Services & Claims Gateways</h2>
              <p className="text-sm text-on-surface-variant">Direct access to statutory rights, calculators, scanning tools, and emergency intervention.</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Legal Aid Response: <strong className="ml-1">&lt; 15 mins average</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CARDS.map((card, i) => (
              <div key={i} className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.urgent ? 'bg-error/15 text-error' : 'bg-primary/10 text-primary'}`}>
                      <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                        title="Read this card aloud"
                        onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(card.title))}
                      >
                        <span className="material-symbols-outlined text-[18px]">volume_up</span>
                      </button>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${card.badgeColor}`}>{card.badge}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-headline font-bold text-on-surface transition-colors ${card.urgent ? 'group-hover:text-error' : 'group-hover:text-primary'}`}>{card.title}</h3>
                    <p className="text-xs text-outline mt-0.5" dir="rtl">{card.titleAr}</p>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{card.description}</p>
                  <div className="p-3 bg-surface rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined ${card.urgent ? 'text-error text-xl' : 'text-tertiary'}`}>{card.detailIcon}</span>
                      <span className="text-on-surface font-medium">{card.detail}</span>
                    </div>
                    {card.urgent && <span className="inline-flex h-2 w-2 rounded-full bg-error animate-ping" />}
                  </div>
                </div>
                <div className="pt-6 mt-2">
                  <button
                    onClick={() => card.ctaRoute ? navigate(card.ctaRoute) : {}}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${card.urgent ? 'bg-error text-on-error font-bold hover:opacity-90' : 'bg-surface text-on-surface hover:bg-surface-container-high'}`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">{card.ctaIcon}</span>
                    <span>{card.ctaLabel}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile QR Handoff + Trust */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                <div className="w-full h-48 rounded-xl bg-gradient-to-br from-primary-fixed to-secondary-container flex items-center justify-center shadow-sm relative">
                  <span className="material-symbols-outlined text-primary text-7xl opacity-60">shield_person</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent flex items-end p-3 rounded-xl">
                    <span className="text-xs text-inverse-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">offline_pin</span>
                      Works Offline in Low Bandwidth
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">Carry SANAD in Your Pocket</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                    Zero data charge on participating telecom networks. Save offline copies of contracts and legal receipts on any phone.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-5">
                {/* QR Code SVG */}
                <div className="flex-shrink-0 p-3 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col items-center">
                  <svg className="w-28 h-28 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M10,10 h25 v25 h-25 z M15,15 v15 h15 v-15 z M19,19 h7 v7 h-7 z" />
                    <path d="M65,10 h25 v25 h-25 z M70,15 v15 h15 v-15 z M74,19 h7 v7 h-7 z" />
                    <path d="M10,65 h25 v25 h-25 z M15,70 v15 h15 v-15 z M19,74 h7 v7 h-7 z" />
                    <rect x="42" y="12" width="6" height="6" />
                    <rect x="52" y="18" width="6" height="6" />
                    <rect x="42" y="28" width="8" height="6" />
                    <rect x="12" y="45" width="8" height="6" />
                    <rect x="24" y="42" width="5" height="8" />
                    <rect x="42" y="42" width="16" height="16" opacity="0.5" />
                    <rect x="64" y="42" width="6" height="6" />
                    <rect x="74" y="48" width="12" height="5" />
                    <rect x="64" y="58" width="22" height="5" />
                    <rect x="42" y="62" width="6" height="14" />
                    <rect x="52" y="68" width="5" height="8" />
                  </svg>
                  <span className="text-[10px] text-on-surface-variant mt-1 font-mono">SANAD Mobile</span>
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="font-headline font-bold text-base text-on-surface">Scan to Open on Mobile</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Point your phone camera at this QR code to open SANAD instantly. No app download required â€” works in any browser.</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed rounded-lg font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">wifi_off</span> Works Offline
                    </span>
                    <span className="px-2 py-1 bg-surface-container text-on-surface rounded-lg font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">translate</span> 65+ Languages
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <h4 className="font-headline font-bold text-on-surface">Sovereign Trust Guarantees</h4>
                {['No personal documents saved on-chain','Encrypted client-side storage','Portable W3C Verifiable Credentials','Tamper-proof cryptographic hashes'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                    {item}
                  </div>
                ))}
                <button
                  onClick={() => navigate('/verify')}
                  className="mt-2 w-full py-2 px-4 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Verify a Credential
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual footer bar */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <p className="text-xs uppercase font-bold tracking-widest text-secondary font-label">
            SANAD speaks with you in your native language
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {LANGUAGE_GRID.slice(0, 9).map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLangSelect(lang.code)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${selectedLang === lang.code ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface'}`}
              >
                <span dir={lang.dir}>{lang.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-on-surface-variant">Voice dictation and read-aloud available in all supported scripts.</p>
        </div>
      </section>
    </div>
  );
};


