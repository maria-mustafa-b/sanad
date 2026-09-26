import React from 'react';
import { useApp } from '../context/AppContext';

export const JourneyHomeView: React.FC = () => {
  const { t, navigate, activeDossier, resetToDemo } = useApp();

  return (
    <div className="w-full space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative space-y-8 max-w-4xl mx-auto text-center">
        {/* Interactive Demo Status Pill */}
        <div 
          onClick={resetToDemo}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-secondary-container shadow-sm hover:bg-surface-container-high transition-all cursor-pointer group"
          title="Click to reset preloaded August Wages scenario"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="text-xs font-semibold text-on-secondary-container tracking-wide">
            Try SANAD Demo Mode (Preloaded: Unpaid August Wages)
          </span>
          <span className="material-symbols-outlined text-[15px] text-tertiary group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>

        {/* Typography Cluster */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest font-bold text-tertiary font-label flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-tertiary/40"></span>
            Support you can find. Proof you can trust.
            <span className="h-px w-6 bg-tertiary/40"></span>
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-on-surface tracking-tight leading-[1.15]">
            Tell SANAD what happened.
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto font-body leading-relaxed">
            Speak or type in your own language. We'll help you understand what support may be relevant and create proof of the situation you confirm.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/tell-sanad')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-on-primary font-semibold text-base shadow-md hover:bg-on-primary-fixed-variant hover:shadow-lg transition-all transform active:scale-95 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">mic</span>
            <span>Tell SANAD What Happened</span>
            <span className="material-symbols-outlined text-[20px] opacity-75">keyboard</span>
          </button>
          <button
            onClick={() => navigate('/verify')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-base transition-colors shadow-sm cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[20px] text-tertiary group-hover:text-primary transition-colors">verified_user</span>
            <span>Verify a Credential</span>
          </button>
        </div>

        {/* Reassurance Micro-cues */}
        <div className="flex items-center justify-center flex-wrap gap-6 pt-2 text-xs text-on-surface-variant font-medium">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
            <span>Private by design</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">graphic_eq</span>
            <span>Speech to text ready</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">gavel</span>
            <span>Non-governmental trust node</span>
          </span>
        </div>
      </section>

      {/* 3 Clear Steps Visual Pathway */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">The Pathway</span>
            <h2 className="text-2xl font-headline font-bold text-on-surface">How SANAD preserves your story</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Three human steps • No complicated forms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div 
            onClick={() => navigate('/tell-sanad')}
            className="p-6 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline font-bold text-lg group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                1
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-xl text-on-surface">Tell Us</h3>
                  <span className="material-symbols-outlined text-tertiary text-[18px]">record_voice_over</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Explain what happened in your own words or voice. Mix languages, everyday phrases, or emotional context — informal speech is welcomed.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low rounded-lg p-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span>Voice / Text / Audio message</span>
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
            </div>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => navigate('/confirm-situation')}
            className="p-6 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-headline font-bold text-lg group-hover:bg-tertiary-fixed-dim transition-colors">
                2
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-xl text-on-surface">Confirm</h3>
                  <span className="material-symbols-outlined text-primary text-[18px]">fact_check</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Check what SANAD extracted from your statement. Adjust dates, amounts, employer names, or add evidence in total safety before anything is sealed.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low rounded-lg p-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span>You stay in 100% control</span>
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            </div>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => navigate('/my-proof')}
            className="p-6 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-headline font-bold text-lg group-hover:bg-primary group-hover:text-on-primary transition-colors">
                3
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-xl text-on-surface">Use Your Proof</h3>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Carry your tamper-evident, verifiable proof (<span className="font-mono font-semibold text-xs text-primary">SANAD-VC</span>) directly into legal support, embassies, or humanitarian aid channels.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low rounded-lg p-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span>W3C Standard Cryptographic Hash</span>
              <span className="material-symbols-outlined text-[16px] text-tertiary">qr_code_2</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Scenario Hub (Bento Panel) */}
      <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-surface-container-high/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                Live Scenario Walkthrough
              </span>
              <span className="text-xs text-on-surface-variant font-mono">Dossier: {activeDossier.id}</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface">
              Walk the 5 Dossier Steps End-to-End
            </h3>
            <p className="text-sm text-on-surface-variant">
              Experience how an informal statement becomes a cryptographically sealed proof and connects to legal triage.
            </p>
          </div>

          <button
            onClick={() => navigate('/tell-sanad')}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-2"
          >
            <span>Start Step 1: Tell SANAD</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* 5-Step Journey Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div 
            onClick={() => navigate('/tell-sanad')}
            className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors shadow-xs cursor-pointer border-t-2 border-primary"
          >
            <span className="text-xs font-bold text-primary block mb-1">Step 1: Intake</span>
            <h4 className="font-bold text-sm text-on-surface">Tell What Happened</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Mixed language voice capture with acoustic waveform</p>
          </div>

          <div 
            onClick={() => navigate('/confirm-situation')}
            className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors shadow-xs cursor-pointer border-t-2 border-primary"
          >
            <span className="text-xs font-bold text-primary block mb-1">Step 2: Structuring</span>
            <h4 className="font-bold text-sm text-on-surface">Confirm Situation</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Review extracted facts, wage amounts &amp; edit inline</p>
          </div>

          <div 
            onClick={() => navigate('/my-proof')}
            className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors shadow-xs cursor-pointer border-t-2 border-primary"
          >
            <span className="text-xs font-bold text-primary block mb-1">Step 3: Credential</span>
            <h4 className="font-bold text-sm text-on-surface">Verifiable Proof</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">W3C tamper-evident JSON &amp; cryptographic hash</p>
          </div>

          <div 
            onClick={() => navigate('/evidence-application')}
            className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors shadow-xs cursor-pointer border-t-2 border-primary"
          >
            <span className="text-xs font-bold text-primary block mb-1">Step 4: Evidence</span>
            <h4 className="font-bold text-sm text-on-surface">Support &amp; Evidence</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Attach salary slips and match vetted pro-bono NGOs</p>
          </div>

          <div 
            onClick={() => navigate('/applications')}
            className="p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors shadow-xs cursor-pointer border-t-2 border-primary"
          >
            <span className="text-xs font-bold text-primary block mb-1">Step 5: Tracking</span>
            <h4 className="font-bold text-sm text-on-surface">Live Case Tracking</h4>
            <p className="text-[11px] text-on-surface-variant mt-1">Real-time milestones from assigned legal advocates</p>
          </div>
        </div>
      </section>
    </div>
  );
};
