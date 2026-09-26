import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Stepper } from '../components/ui/Stepper';
import { Badge } from '../components/ui/Badge';
import { HumanHelpCard } from '../components/HumanHelpCard';

const SUBMIT_STEPS = [
  { id: 'review', label: 'Review' },
  { id: 'docs', label: 'Evidence' },
  { id: 'cred', label: 'Proof' },
  { id: 'submit', label: 'Send' },
];

export const ApplicationSubmitPage: React.FC = () => {
  const { navigate, activeDossier, credentials, addApplication, updateDossier } = useApp();
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const submit = () => {
    addApplication({
      id: `APP-${Date.now()}`,
      dossierId: activeDossier.id,
      credentialId: credentials[0]?.id || 'pending',
      orgId: 'org_wage_dispute',
      orgName: 'Wage Dispute Resolution desk',
      title: 'Wage Dispute Resolution',
      category: activeDossier.category,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      notes: 'Submitted via SANAD guided application',
      timeline: [
        {
          title: 'You told SANAD what happened',
          date: new Date().toISOString(),
          completed: true,
          description: 'Your words were recorded and confirmed.',
        },
        {
          title: 'Digital Proof attached',
          date: new Date().toISOString(),
          completed: true,
          description: credentials[0]?.id || 'Proof linked',
        },
        {
          title: 'Application sent',
          date: new Date().toISOString(),
          completed: true,
          description: 'Waiting for a case advisor to review.',
        },
        {
          title: 'Under review',
          date: '',
          completed: false,
          description: 'You may be contacted for more papers.',
        },
        {
          title: 'Next update',
          date: '',
          completed: false,
          description: 'We will show what happens next here.',
        },
      ],
    });
    updateDossier({ status: 'submitted' });
    navigate('/applications');
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <div>
          <p className="text-label text-brand mb-1">Guided application</p>
          <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">
            Wage Dispute Resolution
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            We reuse what you already confirmed. This is not a long form.
          </p>
        </div>
        <Stepper steps={SUBMIT_STEPS} current={step} />

        <Card>
          {step === 0 && (
            <>
              <CardHeader title="Check this summary" />
              <dl className="space-y-2 text-sm mb-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Service</dt>
                  <dd className="font-semibold text-right">Wage Dispute Resolution</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Your situation</dt>
                  <dd className="font-semibold text-right max-w-[60%]">{activeDossier.categoryLabel}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">When</dt>
                  <dd className="font-semibold text-right">{activeDossier.incidentPeriod}</dd>
                </div>
              </dl>
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-brand"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span className="text-ink">
                  This looks right. I want to continue. (SANAD does not decide legal eligibility.)
                </span>
              </label>
            </>
          )}
          {step === 1 && (
            <div className="text-sm text-ink-secondary space-y-3">
              <p>Simple checklist — add what you have. Missing papers is OK to start.</p>
              <ul className="space-y-2 text-ink">
                <li className="flex gap-2"><span className="text-brand">☐</span> Salary slip or bank screenshot</li>
                <li className="flex gap-2"><span className="text-brand">☐</span> Message from employer (if any)</li>
                <li className="flex gap-2"><span className="text-brand">☑</span> Your confirmed situation (already saved)</li>
              </ul>
              <Button variant="outline" leftIcon="folder" onClick={() => navigate('/documents')}>
                Open documents
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="text-sm space-y-3">
              <p className="text-ink-secondary">
                Your <span className="font-semibold text-brand-dark">SANAD</span> Digital Proof can be attached as supporting evidence.
              </p>
              {credentials[0] ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                  <span className="font-mono text-xs text-ink">{credentials[0].id}</span>
                  <Badge tone="success">Attached</Badge>
                </div>
              ) : (
                <Button variant="outline" onClick={() => navigate('/consent')}>
                  Create Digital Proof first
                </Button>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="text-center space-y-3 py-4">
              <span className="material-symbols-outlined text-4xl text-brand">send</span>
              <p className="text-sm text-ink-secondary">
                Ready to send to the Wage Dispute Resolution desk for review.
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Button
              variant="outline"
              fullWidth
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                fullWidth
                disabled={step === 0 && !confirmed}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button fullWidth onClick={submit}>
                Send application
              </Button>
            )}
          </div>
        </Card>
        <HumanHelpCard compact />
      </div>
    </AppShell>
  );
};

export const ApplicationTrackingPage: React.FC = () => {
  const { navigate, applications } = useApp();
  const app = applications[0];

  const steps = app?.timeline?.length
    ? app.timeline
    : [
        {
          title: 'You told SANAD what happened',
          date: '2026-09-25T10:00:00Z',
          completed: true,
          description: 'Situation confirmed.',
        },
        {
          title: 'Application sent',
          date: '2026-09-25T10:20:00Z',
          completed: true,
          description: 'Wage Dispute Resolution desk received it.',
        },
        {
          title: 'Under review',
          date: '2026-09-25T14:00:00Z',
          completed: true,
          description: 'A case advisor is looking at your file.',
        },
        {
          title: 'Action needed',
          date: '',
          completed: false,
          description: 'None right now — we will tell you if papers are needed.',
        },
        {
          title: 'Next update',
          date: '',
          completed: false,
          description: 'Waiting for advisor response.',
        },
      ];

  const activeIdx = steps.findIndex((s) => !s.completed);
  const current = activeIdx === -1 ? steps[steps.length - 1] : steps[Math.max(0, activeIdx)];

  const formatDate = (date: string) => {
    if (!date) return 'Pending';
    const parsed = Date.parse(date);
    if (!Number.isNaN(parsed)) return new Date(parsed).toLocaleString();
    return date;
  };

  return (
    <AppShell>
      <div className="max-w-2xl space-y-6 pb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-label text-brand mb-1">Status</p>
            <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">Your case timeline</h1>
            <p className="text-sm text-ink-secondary mt-1">
              {app?.title || 'Wage Dispute Resolution'}
            </p>
          </div>
          <Badge tone="warning">Under review</Badge>
        </div>

        <Card tone="soft" padding="md">
          <div className="text-xs font-semibold text-ink-muted uppercase mb-1">Current status</div>
          <div className="font-semibold text-ink">{current?.title}</div>
          <p className="text-sm text-ink-secondary mt-1">{current?.description}</p>
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
          >
            Current status: {current?.title}. {current?.description}
          </div>
        </Card>

        <Card>
          <ol className="relative">
            {steps.map((s, i) => {
              const done = s.completed;
              const isActive = i === activeIdx || (activeIdx === -1 && i === steps.length - 1 && done);
              return (
                <li key={`${s.title}-${i}`} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        done
                          ? 'bg-success text-white'
                          : isActive
                          ? 'bg-warning text-white'
                          : 'bg-border text-ink-muted'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {done ? 'check' : isActive ? 'hourglass_top' : 'circle'}
                      </span>
                    </span>
                    {i < steps.length - 1 && (
                      <span className={`w-0.5 flex-1 min-h-[2rem] mt-1 ${done ? 'bg-success' : 'bg-border'}`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="font-semibold text-ink">{s.title}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{formatDate(s.date)}</div>
                    {s.description && (
                      <p className="text-sm text-ink-secondary mt-1">{s.description}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" fullWidth onClick={() => navigate('/dashboard')}>
            Back to home
          </Button>
          <Button fullWidth onClick={() => navigate('/chat')} leftIcon="mic">
            Tell SANAD something new
          </Button>
        </div>
        <HumanHelpCard />
      </div>
    </AppShell>
  );
};
