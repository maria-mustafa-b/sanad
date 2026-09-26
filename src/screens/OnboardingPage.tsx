"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import { languageMeta } from '../locales';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { Stepper } from '../components/ui/Stepper';
import { Input } from '../components/ui/Input';

const STEPS = [
  { id: 'pref', label: 'Preferences' },
  { id: 'profile', label: 'Profile' },
  { id: 'done', label: 'Complete' },
];

const LANGS: LanguageCode[] = ['en', 'ar', 'hi', 'ur'];

export const OnboardingPage: React.FC = () => {
  const { navigate, setLanguage, language, setTextScale, loginUser } = useApp();
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState(true);
  const [screenReader, setScreenReader] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const finish = () => {
    if (largeText) setTextScale('large');
    loginUser({
      id: 'onboarded',
      name: name || 'Worker',
      phone: phone || '',
      preferredLanguage: language,
      isGuest: false,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8 sm:py-10">
        <Logo size="md" onClick={() => navigate('/')} />
        <div className="mt-10 mb-10">
          <Stepper steps={STEPS} current={step} />
        </div>

        {step === 0 && (
          <Card padding="lg" className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-ink">Language & accessibility</h1>
              <p className="text-sm text-ink-secondary mt-1">Choose what feels comfortable. You can change this later.</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-ink mb-2">Preferred language</div>
              {LANGS.map((code) => {
                const meta = languageMeta[code];
                const selected = language === code;
                return (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg border min-h-touch cursor-pointer ${
                      selected
                        ? 'border-brand bg-brand-muted'
                        : 'border-border bg-white hover:bg-surface'
                    }`}
                  >
                    <span className="font-semibold text-ink" dir={meta.dir}>
                      {meta.nativeLabel}
                    </span>
                    <span className="text-sm text-ink-muted">{meta.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="divide-y divide-border border-t border-border pt-2">
              <Toggle checked={voice} onChange={setVoice} label="Voice assistance" description="Read screens aloud and prefer mic input" />
              <Toggle checked={screenReader} onChange={setScreenReader} label="Screen reader mode" description="Optimize labels for assistive tech" />
              <Toggle
                checked={largeText}
                onChange={(v) => {
                  setLargeText(v);
                  setTextScale(v ? 'large' : 'normal');
                }}
                label="Larger text size"
              />
              <Toggle checked={highContrast} onChange={setHighContrast} label="High contrast" />
              <Toggle checked={reducedMotion} onChange={setReducedMotion} label="Reduced motion" />
            </div>

            <Button fullWidth size="lg" onClick={() => setStep(1)}>
              Continue
            </Button>
          </Card>
        )}

        {step === 1 && (
          <Card padding="lg" className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-ink">Your profile</h1>
              <p className="text-sm text-ink-secondary mt-1">Only stored on this device for now.</p>
            </div>
            <Input label="Name or nickname" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we greet you?" />
            <Input label="Mobile (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 â€¦" leftIcon="call" />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" fullWidth onClick={() => setStep(0)}>
                Back
              </Button>
              <Button fullWidth onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card padding="lg" className="text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-success-soft text-success flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold text-ink">You&apos;re ready</h1>
            <p className="text-ink-secondary text-sm">
              Next, tell SANAD what happened â€” or explore services from your dashboard.
            </p>
            <Button fullWidth size="lg" onClick={finish}>
              Go to Dashboard
            </Button>
            <Button variant="ghost" fullWidth onClick={() => navigate('/chat')}>
              Start with AI chat
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
