"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { getSituationBulletsFromDossier } from '../services/aiService';

/**
 * Explicit consent before creating SANAD Digital Proof.
 * Plain language â€” what, why, what is stored, what goes on the credential.
 */
export const ConsentPage: React.FC = () => {
  const { navigate, activeDossier } = useApp();
  const [checks, setChecks] = useState({
    what: false,
    why: false,
    store: false,
    credential: false,
  });

  const bullets = getSituationBulletsFromDossier(activeDossier);
  const allOk = checks.what && checks.why && checks.store && checks.credential;

  const toggle = (k: keyof typeof checks) =>
    setChecks((c) => ({ ...c, [k]: !c[k] }));

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div>
          <p className="text-label text-brand mb-1">
            Before your <span className="font-extrabold tracking-tight">SANAD</span> Digital Proof
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
            Your permission
          </h1>
          <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
            Please read quietly. Nothing is created until you say yes.
          </p>
        </div>

        <Card>
          <CardHeader title="What information is used" />
          <ul className="text-sm text-ink-secondary space-y-2 list-disc pl-5 mb-4">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
            {activeDossier.verbatimTranscript && (
              <li>Your own words: â€œ{activeDossier.verbatimTranscript}â€</li>
            )}
          </ul>
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-brand"
              checked={checks.what}
              onChange={() => toggle('what')}
            />
            <span className="text-ink">I understand what information is being used.</span>
          </label>
        </Card>

        <Card>
          <CardHeader title="Why we use it" />
          <p className="text-sm text-ink-secondary leading-relaxed mb-4">
            So <span className="font-semibold text-brand-dark">SANAD</span> can help you find support
            (such as wage dispute help), prepare a simple Digital Proof of what you confirmed, and
            show status updates. SANAD does not decide legal eligibility and does not resolve disputes.
          </p>
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-brand"
              checked={checks.why}
              onChange={() => toggle('why')}
            />
            <span className="text-ink">I understand why this is used.</span>
          </label>
        </Card>

        <Card>
          <CardHeader title="What will be stored" />
          <p className="text-sm text-ink-secondary leading-relaxed mb-4">
            Your confirmed situation summary, a private reference ID, and (if you attach them later)
            documents you choose. Stored on this device for the demo. You control who you share with.
          </p>
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-brand"
              checked={checks.store}
              onChange={() => toggle('store')}
            />
            <span className="text-ink">I understand what will be stored.</span>
          </label>
        </Card>

        <Card>
          <CardHeader title="What goes on the Digital Proof" />
          <p className="text-sm text-ink-secondary leading-relaxed mb-4">
            A portable summary of the facts you confirmed (for example: job ended, unpaid August
            salary). Private details like passport numbers are not put on the public verify page.
          </p>
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-brand"
              checked={checks.credential}
              onChange={() => toggle('credential')}
            />
            <span className="text-ink">I agree to create a SANAD Digital Proof with this information.</span>
          </label>
        </Card>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" fullWidth onClick={() => navigate('/situation')}>
            Go back
          </Button>
          <Button
            fullWidth
            disabled={!allOk}
            onClick={() => navigate('/credentials/create')}
            rightIcon="verified_user"
          >
            Create SANAD Digital Proof
          </Button>
        </div>

        <HumanHelpCard compact />
      </div>
    </AppShell>
  );
};
