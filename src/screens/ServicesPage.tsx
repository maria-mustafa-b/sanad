"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, IconWell } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/ChatBubble';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { getSituationBulletsFromDossier } from '../services/aiService';

export const ServicesPage: React.FC = () => {
  const { navigate, activeDossier } = useApp();
  const bullets = getSituationBulletsFromDossier(activeDossier);

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl pb-8">
        <div>
          <p className="text-label text-brand mb-1">
            Based on the information you provided
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
            Support that may fit
          </h1>
          <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
            <span className="font-semibold text-brand-dark">SANAD</span> matches services to your
            situation. This is not a legal eligibility decision.
          </p>
        </div>

        <Card tone="elevated" className="border-brand/25 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 glow-brand pointer-events-none opacity-40" />
          <div className="relative flex flex-col sm:flex-row gap-4">
            <IconWell icon="payments" size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-ink tracking-[-0.02em]">
                  Wage Dispute Resolution
                </h2>
                <Badge tone="success">Scheme match: High</Badge>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed mb-4">
                Help preparing and submitting a wage-related complaint with the information you
                already confirmed. SANAD guides the steps â€” support organisations handle the case.
              </p>
              <div className="rounded-lg bg-surface p-3 mb-4">
                <div className="text-xs font-semibold text-ink-muted mb-2">Why this matches</div>
                <ul className="space-y-1">
                  {bullets.slice(0, 3).map((b, i) => (
                    <li key={i} className="text-sm text-ink flex gap-2">
                      <span className="text-brand">â€¢</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => navigate('/services/detail')} rightIcon="arrow_forward">
                  See next steps
                </Button>
                <Button variant="outline" onClick={() => navigate('/documents')}>
                  Prepare documents
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card tone="flat" padding="md" className="opacity-90">
          <div className="flex items-center gap-3">
            <IconWell icon="badge" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink">Passport retention support</h3>
                <Badge tone="warning">Scheme match: Low</Badge>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Not the main match for your current statement.
              </p>
            </div>
          </div>
        </Card>

        <HumanHelpCard />
      </div>
    </AppShell>
  );
};

export const ServiceDetailPage: React.FC = () => {
  const { navigate, credentials } = useApp();
  const [tab, setTab] = useState('overview');

  const content: Record<string, React.ReactNode> = {
    overview: (
      <div className="space-y-3 text-sm text-ink-secondary leading-relaxed">
        <p>
          Based on the information you provided, Wage Dispute Resolution can help you organise
          evidence and apply for support with unpaid wages.
        </p>
        <p className="font-medium text-ink">
          SANAD does not resolve the dispute and does not decide if you are legally eligible.
        </p>
      </div>
    ),
    next: (
      <ol className="text-sm text-ink-secondary space-y-3 list-decimal pl-5">
        <li>Gather salary slips or bank screenshots (if you have them)</li>
        <li>Attach your SANAD Digital Proof as supporting evidence</li>
        <li>Submit a guided application</li>
        <li>Track status and ask a human advisor anytime</li>
      </ol>
    ),
    documents: (
      <ul className="text-sm text-ink-secondary space-y-2 list-disc pl-5">
        <li>Any salary slip or payment message (helpful, not required to start)</li>
        <li>Your SANAD Digital Proof {credentials[0] ? `(${credentials[0].id})` : '(create if needed)'}</li>
        <li>Notes about when the job ended</li>
      </ul>
    ),
    apply: (
      <div className="space-y-3">
        <p className="text-sm text-ink-secondary">
          We reuse what you already confirmed â€” this is not a long government form.
        </p>
        <Button onClick={() => navigate('/applications/submit')}>Start guided application</Button>
      </div>
    ),
  };

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6 pb-8">
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="text-sm font-medium text-brand inline-flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">Wage Dispute Resolution</h1>
          <Badge tone="success" className="mt-2">
            Scheme match: High
          </Badge>
        </div>
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'next', label: 'What next' },
            { id: 'documents', label: 'Documents' },
            { id: 'apply', label: 'Apply' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <Card>{content[tab]}</Card>
        <HumanHelpCard compact />
      </div>
    </AppShell>
  );
};
