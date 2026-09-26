"use client";
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { getSituationBulletsFromDossier } from '../services/aiService';
import { ExtractedFact } from '../types';

/**
 * AI Extracted â†’ User Confirmed. No credential yet â€” next step is consent.
 */
export const SituationPage: React.FC = () => {
  const { navigate, activeDossier, updateDossier } = useApp();
  const initialBullets = useMemo(
    () => getSituationBulletsFromDossier(activeDossier),
    [activeDossier]
  );
  const [bullets, setBullets] = useState(initialBullets);
  const [facts, setFacts] = useState<ExtractedFact[]>(
    activeDossier.facts.map((f) => ({ ...f }))
  );
  const [confirmed, setConfirmed] = useState(false);
  const [editing, setEditing] = useState(false);

  const confirmAndContinue = () => {
    updateDossier({
      facts: facts.map((f) => ({ ...f, isAiExtracted: false })),
      narrativeSummary: bullets.join('. ') + '.',
      employmentStatus: facts.find((f) => f.key === 'employment_status')?.value || activeDossier.employmentStatus,
      categoryLabel: facts.find((f) => f.key === 'primary_issue')?.value || activeDossier.categoryLabel,
      incidentPeriod: facts.find((f) => f.key === 'period')?.value || activeDossier.incidentPeriod,
      employerName: facts.find((f) => f.key === 'employer')?.value || activeDossier.employerName,
      status: 'confirmed',
    });
    navigate('/consent');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl pb-8">
        <div>
          <p className="text-label text-brand mb-1">
            <span className="font-extrabold tracking-tight">SANAD</span> understood
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
            Is this what happened?
          </h1>
          <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
            Check carefully. You can correct anything before we create your Digital Proof.
          </p>
        </div>

        {activeDossier.verbatimTranscript && (
          <Card tone="flat" padding="md">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">
              Your words
            </div>
            <p className="text-ink leading-relaxed italic">
              â€œ{activeDossier.verbatimTranscript}â€
            </p>
          </Card>
        )}

        <Card>
          <CardHeader
            title="We understood that"
            action={
              <Badge tone={confirmed ? 'success' : 'info'}>
                {confirmed ? 'User confirmed' : 'AI extracted'}
              </Badge>
            }
          />
          <ul className="space-y-3 mb-6">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-0.5 w-6 h-6 rounded-md bg-brand-muted text-brand-dark flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </span>
                {editing ? (
                  <Input
                    value={b}
                    onChange={(e) =>
                      setBullets((list) => list.map((x, idx) => (idx === i ? e.target.value : x)))
                    }
                    aria-label={`Situation point ${i + 1}`}
                  />
                ) : (
                  <span className="text-base text-ink leading-snug pt-0.5">{b}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-ink">Details (optional to edit)</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
                {editing ? 'Done editing' : 'Correct details'}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.map((f, i) => (
                <div key={f.key} className="rounded-lg bg-surface p-3 border border-border/60">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-ink-muted font-medium">{f.label}</span>
                    <Badge tone={f.isAiExtracted && !confirmed ? 'info' : 'success'}>
                      {f.isAiExtracted && !confirmed ? 'AI extracted' : 'User confirmed'}
                    </Badge>
                  </div>
                  {editing ? (
                    <Input
                      value={f.value}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFacts((list) =>
                          list.map((item, idx) =>
                            idx === i ? { ...item, value: v, isAiExtracted: false } : item
                          )
                        );
                      }}
                    />
                  ) : (
                    <div className="text-sm font-semibold text-ink">{f.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 accent-brand"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <span className="text-ink leading-snug">
              Yes â€” this is correct. I want <span className="font-bold text-brand-dark">SANAD</span> to
              continue with this information.
            </span>
          </label>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" fullWidth onClick={() => navigate('/chat')}>
              Speak again
            </Button>
            <Button fullWidth disabled={!confirmed} onClick={confirmAndContinue} rightIcon="arrow_forward">
              Continue to consent
            </Button>
          </div>
        </Card>

        <HumanHelpCard compact />
      </div>
    </AppShell>
  );
};
