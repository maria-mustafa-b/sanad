import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

interface ProcessingStep {
  id: number;
  label: string;
  sublabel: string;
  tags?: string[];
  status: 'done' | 'active' | 'pending';
}

export const NarrativeProcessingView: React.FC = () => {
  const { navigate, t, activeDossier } = useApp();
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Listening to what you told us', sublabel: 'Speech raw stream verified • Audio integrity sealed', status: 'done' },
    { id: 2, label: 'Understanding your message', sublabel: 'Colloquial Hindi + English dialect recognized smoothly', status: 'done' },
    { id: 3, label: 'Identifying reported facts', sublabel: '', tags: ['Unpaid Wages (August)', 'Employment Termination'], status: 'active' },
    { id: 4, label: 'Preparing situation summary', sublabel: 'Personal details remain securely on your device', status: 'pending' },
  ]);
  const [consentChecked, setConsentChecked] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([4,8,12,14,9,16,11,13,7,15,10,14,8,12,6,11,15,10,5,3]);

  // Animate waveform
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 14) + 3));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Simulate processing steps advancing
  useEffect(() => {
    const t1 = setTimeout(() => {
      setSteps(s => s.map(step =>
        step.id === 3 ? { ...step, status: 'done' } :
        step.id === 4 ? { ...step, status: 'active' } : step
      ));
    }, 1800);
    const t2 = setTimeout(() => {
      setSteps(s => s.map(step => step.id === 4 ? { ...step, status: 'done' } : step));
      setIsReady(true);
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const transcript = activeDossier?.verbatimTranscript ??
    '"August ka salary abhi tak nahi mila aur meri job bhi khatam ho gayi."';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fadeIn">
      {/* Step Tracker Bar */}
      <div className="w-full bg-surface-container rounded-2xl p-4 sm:p-5 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Worker Rights Dossier — Process Flow
          </div>
          <div className="text-xs text-on-surface-variant font-medium">
            Dossier ID: <span className="font-mono text-primary font-semibold">SND-2024-8842-DXB</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-4 pt-3">
          {['Tell SANAD','Confirm Situation','Proof Created','Find Support','Evidence & Apply','Track & Verify'].map((label, i) => (
            <div key={i} className={`flex flex-col gap-1.5 p-2.5 rounded-xl ${i === 0 ? 'bg-primary-container/40' : 'bg-surface-container-high/60'}`}>
              <div className="flex items-center justify-between">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{i+1}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${i === 0 ? 'text-primary' : 'text-secondary'}`}>{i === 0 ? 'Active' : i === 1 ? 'Next' : `Step ${i+1}`}</span>
              </div>
              <span className={`text-xs font-bold leading-tight mt-1 ${i === 0 ? 'text-primary' : 'text-on-surface'}`}>{label}</span>
              <span className="text-[10px] text-on-surface-variant">
                {['Voice & Speech capture','Structured summary','Verifiable credential','NGOs & legal aid','Direct submissions','Smart receipt tracker'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Page Heading */}
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-3">
          <span className="material-symbols-outlined text-[15px] text-tertiary">mic_none</span>
          Natural Conversational Intake • Screen 02–04
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
          Tell SANAD what happened
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant mt-3 leading-relaxed">
          You can speak or type in any language, dialect, or combination. Don't worry about using formal legal terms — just share your experience in your own words.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Voice Input Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-tertiary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Microphone Active</span>
                <span className="text-xs text-on-surface-variant font-mono">00:42 recorded</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-xs font-medium text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-tertiary">graphic_eq</span>
                Noise reduction active
              </div>
            </div>

            {/* Waveform visualizer */}
            <div className="bg-surface-container-lowest/80 rounded-xl p-5 mb-6 shadow-sm relative z-10">
              <div className="flex items-center justify-between mb-3 text-xs text-on-surface-variant">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">hearing</span>
                  Audio Waveform Signature
                </span>
                <span className="font-mono text-[11px] text-secondary">44.1 kHz • PCM Lossless</span>
              </div>
              <div className="w-full h-16 flex items-center justify-between gap-1 sm:gap-1.5 px-2">
                {waveHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full transition-all duration-300"
                    style={{ height: `${h * 4}px`, opacity: 0.4 + (i % 3) * 0.2 }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 mt-1 text-[11px] text-on-surface-variant font-mono">
                <span>0:00</span>
                <span className="text-primary font-bold">● Transcribing in real time</span>
                <span>0:42</span>
              </div>
            </div>

            {/* Mic controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 relative z-10">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-xs font-semibold text-on-surface transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">replay</span>
                Replay Voice
              </button>
              <button className="relative group flex items-center justify-center w-20 h-20 rounded-full bg-primary text-on-primary shadow-lg hover:bg-on-primary-fixed-variant transition-transform hover:scale-105 active:scale-95">
                <span className="absolute -inset-2 rounded-full bg-primary/20 animate-ping pointer-events-none" />
                <span className="material-symbols-outlined text-4xl">mic</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-xs font-semibold text-on-surface transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">pause</span>
                Pause / Hold
              </button>
            </div>
            <div className="text-center mt-1 mb-5">
              <span className="text-xs text-on-surface-variant">Tap the center icon to pause recording anytime. Your voice is encrypted directly on your device.</span>
            </div>

            {/* Language detection notice */}
            <div className="bg-secondary-container rounded-xl p-3.5 flex items-start gap-3 text-xs text-on-secondary-container mb-4 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">translate</span>
              <div className="flex-1">
                <div className="font-bold flex items-center gap-2">
                  Language understood: Hindi + English
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-container-lowest font-medium text-tertiary">Mixed Dialect Detected</span>
                </div>
                <p className="text-on-secondary-container/90 mt-0.5">
                  That's completely fine. SANAD captures colloquial expressions, vernacular dates, and code-switched phrasing seamlessly.
                </p>
              </div>
            </div>

            {/* Verbatim transcript */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                <label className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                  Worker Input Verbatim (Live Transcript / Editable)
                </label>
                <button className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">edit</span> Edit text
                </button>
              </div>
              <div className="relative">
                <textarea
                  className="w-full bg-surface-container-lowest text-on-surface text-base sm:text-lg font-body p-4 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-none transition-all"
                  rows={3}
                  defaultValue={transcript}
                />
                <div className="absolute bottom-3 right-3 text-[11px] text-on-surface-variant font-mono bg-surface-container px-2 py-0.5 rounded">
                  Colloquial Transcription
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-2">
              <button className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-on-primary-fixed-variant transition-colors">
                <span className="material-symbols-outlined text-[16px]">keyboard</span>
                Type instead of speaking
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
                Hear transcription readout
              </button>
            </div>
          </div>

          {/* Safe space note */}
          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-primary-fixed flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-3xl">shield_person</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-headline font-bold text-sm text-on-surface">You are in complete control of your story</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Nothing you speak or write here is shared with employers, recruiters, or immigration databases without your explicit and confirmed consent.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Processing + Consent */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Understanding / Processing card */}
          <div className="bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-xs">03</div>
                <h2 className="font-headline font-bold text-lg text-on-surface">Understanding your situation</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Live Pipeline</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
              SANAD's local privacy engine extracts verifiable claims from your testimony without altering your voice record:
            </p>
            <div className="space-y-3.5">
              {steps.map(step => (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-xl shadow-sm transition-all duration-500 ${
                    step.status === 'active' ? 'bg-tertiary-fixed/30' :
                    step.status === 'done' ? 'bg-surface-container-lowest' :
                    'bg-surface-container-high/50 opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    step.status === 'done' ? 'bg-primary-fixed text-primary' :
                    step.status === 'active' ? 'bg-tertiary text-on-tertiary' :
                    'bg-surface-variant text-on-surface-variant'
                  }`}>
                    {step.status === 'done' ? (
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                    ) : step.status === 'active' ? (
                      <span className="w-2 h-2 rounded-full bg-surface-bright animate-ping" />
                    ) : (
                      <span className="text-[11px] font-bold">{step.id}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${step.status === 'active' ? 'text-tertiary' : 'text-on-surface'}`}>
                      {step.label}
                    </span>
                    {step.sublabel && (
                      <span className="text-[11px] text-on-surface-variant">{step.sublabel}</span>
                    )}
                    {step.tags && step.status !== 'pending' && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {step.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-error-container text-on-error-container font-semibold px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isReady && (
              <div className="mt-4 p-3 bg-primary-fixed/30 rounded-xl text-xs text-primary font-semibold flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Analysis complete — ready to confirm
              </div>
            )}
          </div>

          {/* Consent card */}
          <div className="bg-surface-container-low rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
              <h3 className="font-headline font-bold text-lg text-on-surface">SANAD Prototype Consent</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              SANAD will use the information you provide to understand your situation, match relevant humanitarian support, and create your self-sovereign portable proof.
            </p>
            <div className="bg-surface-container rounded-xl p-4 mb-4 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">What this dossier contains:</span>
              {['Your situation details & incident chronology', 'Information you review and confirm in the next step', 'Documents & payslips you choose to attach later'].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[17px]">check_circle</span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Privacy accordion */}
            <div className="bg-surface-container-lowest rounded-xl p-3.5 mb-5 shadow-inner">
              <button
                className="w-full flex items-center justify-between text-left text-xs font-bold text-on-surface hover:text-primary transition-colors"
                onClick={() => setPrivacyOpen(o => !o)}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                  Privacy Notice: What exactly is stored?
                </span>
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${privacyOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              {privacyOpen && (
                <div className="pt-3 mt-2 text-xs text-on-surface-variant leading-relaxed animate-fadeIn">
                  <p className="mb-2"><strong>Personal details remain securely on your device for this demonstration.</strong></p>
                  <p>SANAD is designed so that your voice recording and personal information stay private under your control. No unconfirmed personal details are shared with employers or public databases.</p>
                </div>
              )}
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none group p-2 rounded-lg hover:bg-surface-container transition-colors mb-6">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={e => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <span className="text-xs text-on-surface leading-normal">
                <strong>I understand and consent</strong> to SANAD processing my statement to generate my verifiable incident record and search matching aid networks.
              </span>
            </label>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-on-primary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!consentChecked || !isReady}
                onClick={() => navigate('/confirm-situation')}
              >
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">fact_check</span>
                {isReady ? 'Confirm & Review Summary' : 'Processing...'}
              </button>
              <button
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                onClick={() => navigate('/tell-sanad')}
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Re-record
              </button>
            </div>

            {/* Skip to demo */}
            {!isReady && (
              <div className="mt-4 text-center">
                <button
                  className="text-xs text-primary hover:underline font-semibold"
                  onClick={() => navigate('/confirm-situation')}
                >
                  Skip to Confirm (Demo)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
