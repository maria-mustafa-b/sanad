import React from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, IconWell } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { getSituationBulletsFromDossier } from '../services/aiService';

export const DashboardPage: React.FC = () => {
  const { navigate, currentUser, credentials, applications, activeDossier } = useApp();
  const proof = credentials.find((c) => c.status === 'valid') || credentials[0];
  const app = applications[0];
  const bullets = getSituationBulletsFromDossier(activeDossier);

  const statusLabel: Record<string, string> = {
    draft: 'Needs confirmation',
    confirmed: 'Confirmed — ready for proof',
    proof_generated: 'Digital Proof ready',
    submitted: 'Application in progress',
  };

  const nextAction = (() => {
    if (activeDossier.status === 'draft') {
      return { label: 'Confirm your situation', path: '/situation', icon: 'psychology' as const };
    }
    if (activeDossier.status === 'confirmed' && !proof) {
      return { label: 'Create Digital Proof', path: '/consent', icon: 'verified_user' as const };
    }
    if (!app) {
      return { label: 'Open Wage Dispute support', path: '/services', icon: 'payments' as const };
    }
    return { label: 'Check application status', path: '/applications', icon: 'timeline' as const };
  })();

  return (
    <AppShell>
      <div className="space-y-8 max-w-3xl pb-8">
        <div className="space-y-2">
          <p className="text-label text-brand">
            Your <span className="font-extrabold tracking-tight">SANAD</span> case
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
            Hello, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-ink-secondary">One place for your situation, proof, and next step.</p>
        </div>

        {/* Active case — main focus */}
        <Card tone="elevated" className="border-brand/20">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-ink tracking-[-0.02em]">Current situation</h2>
              <p className="text-sm text-ink-secondary mt-0.5">{activeDossier.categoryLabel}</p>
            </div>
            <Badge tone="brand">{statusLabel[activeDossier.status] || activeDossier.status}</Badge>
          </div>
          <ul className="space-y-2 mb-5">
            {bullets.slice(0, 3).map((b, i) => (
              <li key={i} className="text-sm text-ink flex gap-2">
                <span className="text-brand mt-0.5">•</span>
                {b}
              </li>
            ))}
          </ul>
          <Button fullWidth size="lg" leftIcon={nextAction.icon} onClick={() => navigate(nextAction.path)}>
            Next: {nextAction.label}
          </Button>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card tone="flat" padding="md" hover onClick={() => navigate('/credentials')}>
            <div className="text-label mb-2">SANAD Digital Proof</div>
            {proof ? (
              <>
                <div className="font-semibold text-ink text-sm">{proof.claimSummary}</div>
                <Badge tone="success" className="mt-2">
                  Valid
                </Badge>
              </>
            ) : (
              <p className="text-sm text-ink-muted">Not created yet</p>
            )}
          </Card>
          <Card tone="flat" padding="md" hover onClick={() => navigate('/applications')}>
            <div className="text-label mb-2">Application status</div>
            {app ? (
              <>
                <div className="font-semibold text-ink text-sm">{app.title}</div>
                <Badge tone="warning" className="mt-2">
                  {app.status.replace(/_/g, ' ')}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-ink-muted">No application yet</p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="rounded-xl border border-border bg-white p-4 text-left hover:border-brand/30 cursor-pointer min-h-[88px]"
          >
            <IconWell icon="folder" className="mb-2" />
            <div className="text-sm font-semibold text-ink">Documents</div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="rounded-xl border border-border bg-white p-4 text-left hover:border-brand/30 cursor-pointer min-h-[88px]"
          >
            <IconWell icon="mic" className="mb-2" />
            <div className="text-sm font-semibold text-ink">Tell SANAD again</div>
          </button>
        </div>

        <Card tone="soft" padding="lg" className="bg-brand-dark border-0">
          <h3 className="text-lg font-semibold tracking-[-0.02em] !text-white mb-1">
            Speak to SANAD
          </h3>
          <p className="text-sm text-white/70 mb-4">Voice-first — in your own words</p>
          <Button variant="inverse" leftIcon="mic" onClick={() => navigate('/chat')}>
            Start voice intake
          </Button>
        </Card>

        <HumanHelpCard />
      </div>
    </AppShell>
  );
};
