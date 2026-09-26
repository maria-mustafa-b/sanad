"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { languageMeta } from '../locales';
import { LanguageCode } from '../types';

export const HelpSupportView: React.FC = () => {
  const { t, language, toggleSosModal, navigate } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [prefLang, setPrefLang] = useState<LanguageCode>(language);
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px] text-tertiary">support_agent</span>
          <span>Human Dispatch &amp; Sanctuary</span>
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
          {t.help.title}
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
          {t.help.subtitle}
        </p>
      </div>

      {/* 24/7 Hotline Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-fixed/50 via-surface-container to-secondary-container p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-primary-fixed-dim">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-3xl shadow-sm shrink-0">
            <span className="material-symbols-outlined text-3xl">headset_mic</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              {t.help.hotlineBannerTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
              800-SANAD-SOS (800-72623)
            </h2>
            <p className="text-xs text-on-surface-variant">
              {t.help.hotlineBannerDesc}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a
            href="tel:80072623"
            className="flex-1 md:flex-none px-6 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">call</span>
            <span>Call Toll-Free Now</span>
          </a>
          <button
            onClick={() => toggleSosModal(true)}
            className="flex-1 md:flex-none px-6 py-3.5 rounded-xl bg-error text-on-error font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">emergency</span>
            <span>SOS Urgent Intervention</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Request Callback Form */}
        <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-6">
          <div className="space-y-1">
            <h3 className="font-headline font-bold text-xl text-on-surface">
              {t.help.requestCallback}
            </h3>
            <p className="text-xs text-on-surface-variant">
              A trained counselor who speaks your mother tongue will call or WhatsApp you within 15 minutes.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-primary-fixed/40 text-center space-y-3 border border-primary-fixed-dim animate-fadeIn">
              <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
              <h4 className="font-headline font-bold text-lg text-on-surface">
                Call-Back Request Queued
              </h4>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                Thank you, {name || 'Worker'}. A {languageMeta[prefLang]?.label}-speaking case advocate will contact {phone} shortly. Keep your phone near you.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-primary underline cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  {t.help.nameLabel}:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rashid or prefer to stay anonymous"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  {t.help.phoneLabel} <span className="text-error">*</span>:
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  {t.help.langLabel}:
                </label>
                <select
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value as LanguageCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  {(['en', 'ar', 'hi', 'ur', 'bn'] as LanguageCode[]).map((code) => (
                    <option key={code} value={code}>
                      {languageMeta[code].nativeLabel} ({languageMeta[code].label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  {t.help.problemBrief}:
                </label>
                <textarea
                  rows={3}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g. Unpaid wages, passport withheld, or need shelter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">support_agent</span>
                <span>{t.help.submitHelp}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: How SANAD Works & Safety Principles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-high/60">
            <span className="text-xs uppercase font-bold tracking-wider text-tertiary block">
              Platform Workflow
            </span>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              How SANAD Protects You
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <strong className="text-on-surface block">Speak or Type Freely</strong>
                  <span className="text-on-surface-variant">Natural speech in any dialect or code-switching.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <strong className="text-on-surface block">Review &amp; Calibrate Facts</strong>
                  <span className="text-on-surface-variant">Nothing is finalized until you verify the summary.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <strong className="text-on-surface block">Tamper-Evident W3C Proof</strong>
                  <span className="text-on-surface-variant">A cryptographic token you carry with total privacy.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <div>
                  <strong className="text-on-surface block">Direct Pro Bono Triage</strong>
                  <span className="text-on-surface-variant">Matched with vetted NGOs, shelters, and paralegals.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/tell-sanad')}
                className="w-full py-2.5 rounded-xl bg-surface text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Start a New Grievance</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Emergency Safe Housing Card */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-container-high/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-error">
              <span className="material-symbols-outlined text-base">night_shelter</span>
              <span>Emergency Accommodation</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              If you have been evicted, locked out of company accommodation, or are escaping danger, SANAD coordinates emergency beds and food rations through certified community shelters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
