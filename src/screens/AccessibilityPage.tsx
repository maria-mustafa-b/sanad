"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';

export const AccessibilityPage: React.FC = () => {
  const { textScale, setTextScale } = useApp();
  const [voice, setVoice] = useState(true);
  const [screenReader, setScreenReader] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <AppShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Accessibility settings</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Adjust display and interaction preferences. Changes apply immediately.
          </p>
        </div>

        <Card>
          <CardHeader title="Display" />
          <div className="mb-4">
            <div className="text-sm font-medium text-ink mb-2">Text size</div>
            <div className="flex gap-2 p-1 bg-surface-container rounded-lg">
              {([
                { id: 'normal', label: 'A' },
                { id: 'large', label: 'A+' },
                { id: 'xlarge', label: 'A++' },
              ] as const).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTextScale(s.id)}
                  className={`flex-1 py-2.5 rounded-md text-sm font-bold min-h-touch cursor-pointer ${
                    textScale === s.id
                      ? 'bg-white text-brand-dark shadow-card'
                      : 'text-ink-muted'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            <Toggle checked={voice} onChange={setVoice} label="Voice assistance" description="Prefer microphone and read-aloud" />
            <Toggle checked={screenReader} onChange={setScreenReader} label="Screen reader mode" />
            <Toggle checked={highContrast} onChange={setHighContrast} label="High contrast" />
            <Toggle checked={reducedMotion} onChange={setReducedMotion} label="Reduced motion" />
          </div>
        </Card>

        <Card className={highContrast ? 'bg-ink text-white border-ink' : ''}>
          <CardHeader title="Live preview" />
          <p className={`leading-relaxed ${highContrast ? 'text-white' : 'text-ink-secondary'}`}>
            This is how body text will appear with your current settings. SANAD helps you access support and carry proof you can trust.
          </p>
          <p className={`mt-3 font-semibold ${highContrast ? 'text-white' : 'text-ink'}`}>
            Support you can access. Proof you can carry.
          </p>
        </Card>
      </div>
    </AppShell>
  );
};
