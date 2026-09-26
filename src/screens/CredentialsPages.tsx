import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/ChatBubble';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { getSituationBulletsFromDossier } from '../services/aiService';

const TRUST_STEPS = [
  { label: 'User reported', done: true },
  { label: 'AI extracted', done: true },
  { label: 'User confirmed', done: true },
  { label: 'Issuer verified', done: false },
];

export const CredentialCreatePage: React.FC = () => {
  const { navigate, activeDossier, addCredential, updateDossier } = useApp();
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [showTech, setShowTech] = useState(false);
  const bullets = getSituationBulletsFromDossier(activeDossier);

  const issue = () => {
    const id = `SANAD-VC-${String(Date.now()).slice(-5)}`;
    addCredential({
      id,
      dossierId: activeDossier.id,
      subjectPseudonym: 'did:sanad:worker:ae82…994f',
      issuanceDate: new Date().toISOString(),
      status: 'valid',
      claimSummary: activeDossier.categoryLabel,
      merkleHash: '0x' + Math.random().toString(16).slice(2, 18),
      digitalSignature: 'sig_' + Math.random().toString(36).slice(2, 10),
      zkAttestation: {
        trustNode: 'SANAD Independent Sovereign Trust Root Node',
        standard: 'W3C VC Data Model 2.0',
        verifiedProperties: ['category', 'period', 'employer_hash'],
        piiProtected: true,
      },
    });
    updateDossier({ status: 'proof_generated' });
    setCreatedId(id);
  };

  if (createdId) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto space-y-6 pb-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand text-white mb-2">
              <span className="material-symbols-outlined text-3xl filled">verified_user</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
              <span className="text-brand-dark">SANAD</span> Digital Proof
            </h1>
            <p className="text-sm text-ink-secondary">
              Portable proof of the information you confirmed. You choose who sees it.
            </p>
          </div>

          <Card tone="elevated" className="border-brand/20">
            <div className="flex items-start justify-between gap-3 mb-4">
              <Badge tone="success">Valid</Badge>
              <span className="font-mono text-xs text-ink-muted">{createdId}</span>
            </div>
            <h2 className="font-semibold text-ink text-lg mb-3">{activeDossier.categoryLabel}</h2>
            <ul className="space-y-2 mb-6">
              {bullets.map((b, i) => (
                <li key={i} className="text-sm text-ink-secondary flex gap-2">
                  <span className="text-brand">•</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="rounded-xl bg-surface p-4 mb-4">
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
                Trust progression
              </div>
              <ol className="flex flex-col gap-2">
                {TRUST_STEPS.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i < 3 ? 'bg-success text-white' : 'bg-brand text-white'
                      }`}
                    >
                      {i < 3 ? '✓' : '4'}
                    </span>
                    <span className="font-medium text-ink">{s.label}</span>
                    {i === 3 && <Badge tone="brand">Just now</Badge>}
                  </li>
                ))}
              </ol>
            </div>

            <button
              type="button"
              className="text-sm text-brand font-medium cursor-pointer mb-4"
              onClick={() => setShowTech((v) => !v)}
            >
              {showTech ? 'Hide' : 'Show'} technical details
            </button>
            {showTech && (
              <dl className="text-xs space-y-2 text-ink-muted font-mono mb-4">
                <div className="flex justify-between gap-2">
                  <dt>ID</dt>
                  <dd>{createdId}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Standard</dt>
                  <dd>W3C VC (demo)</dd>
                </div>
              </dl>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button fullWidth onClick={() => navigate('/services')} rightIcon="arrow_forward">
                Find support
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate('/credentials')}>
                My Digital Proofs
              </Button>
            </div>
          </Card>

          <Button variant="ghost" fullWidth onClick={() => navigate('/verify')}>
            Open public verification (/verify)
          </Button>
          <HumanHelpCard compact />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-xl mx-auto space-y-6 pb-8">
        <div>
          <p className="text-label text-brand mb-1">Almost ready</p>
          <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">
            Create your <span className="text-brand-dark">SANAD</span> Digital Proof
          </h1>
          <p className="text-sm text-ink-secondary mt-2">
            This is portable proof of what you confirmed — not a court decision.
          </p>
        </div>

        <Card>
          <CardHeader title="What will be included" />
          <ul className="space-y-2 mb-6">
            {bullets.map((b, i) => (
              <li key={i} className="text-sm text-ink flex gap-2">
                <span className="material-symbols-outlined text-brand text-[18px]">check_circle</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={() => navigate('/consent')}>
              Cancel
            </Button>
            <Button fullWidth leftIcon="verified_user" onClick={issue}>
              Issue Digital Proof
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export const CredentialWalletPage: React.FC = () => {
  const { navigate, credentials } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = credentials.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">
              <span className="text-brand-dark">SANAD</span> Digital Proofs
            </h1>
            <p className="text-sm text-ink-secondary">Proof you can carry and share when you choose</p>
          </div>
          <Button leftIcon="add" onClick={() => navigate('/consent')}>
            Create
          </Button>
        </div>

        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'valid', label: 'Valid' },
            { id: 'revoked', label: 'Revoked' },
            { id: 'expired', label: 'Expired' },
          ]}
          active={filter}
          onChange={setFilter}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge tone={c.status === 'valid' ? 'success' : c.status === 'revoked' ? 'danger' : 'warning'}>
                  {c.status}
                </Badge>
                <span className="text-xs text-ink-muted font-mono">{c.id}</span>
              </div>
              <h3 className="font-semibold text-ink">{c.claimSummary}</h3>
              <p className="text-xs text-ink-muted mt-1">
                Issued {new Date(c.issuanceDate).toLocaleDateString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/credentials/detail')}>
                  View
                </Button>
                <Button size="sm" variant="ghost" leftIcon="qr_code" onClick={() => navigate('/verify')}>
                  Verify
                </Button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="sm:col-span-2 text-center py-10 text-ink-muted">
              No Digital Proofs yet.
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export const CredentialDetailPage: React.FC = () => {
  const { navigate, credentials } = useApp();
  const [tab, setTab] = useState('details');
  const [showTech, setShowTech] = useState(false);
  const c = credentials[0];

  if (!c) {
    return (
      <AppShell>
        <Card className="text-center py-12">
          <p className="text-ink-muted mb-4">No Digital Proof selected.</p>
          <Button onClick={() => navigate('/credentials')}>Back</Button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <button
          type="button"
          onClick={() => navigate('/credentials')}
          className="text-sm font-medium text-brand inline-flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          All proofs
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">
            <span className="text-brand-dark">SANAD</span> Digital Proof
          </h1>
          <Badge tone="success">Valid</Badge>
        </div>
        <p className="text-sm text-ink-muted font-mono">{c.id}</p>

        <Tabs
          tabs={[
            { id: 'details', label: 'Summary' },
            { id: 'trust', label: 'Trust ladder' },
            { id: 'history', label: 'History' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'details' && (
          <Card className="flex flex-col sm:flex-row gap-6">
            <div className="w-40 h-40 mx-auto sm:mx-0 rounded-lg border border-border bg-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-7xl text-ink">qr_code_2</span>
            </div>
            <div className="flex-1 space-y-3 text-sm">
              <div>
                <div className="text-ink-muted">What you confirmed</div>
                <div className="font-semibold text-ink">{c.claimSummary}</div>
              </div>
              <div>
                <div className="text-ink-muted">Issuer</div>
                <div className="font-semibold text-brand-dark">SANAD</div>
              </div>
              <button
                type="button"
                className="text-brand font-medium cursor-pointer"
                onClick={() => setShowTech((v) => !v)}
              >
                {showTech ? 'Hide' : 'Show'} technical details
              </button>
              {showTech && (
                <div className="font-mono text-xs text-ink-muted space-y-1">
                  <div>Subject: {c.subjectPseudonym}</div>
                  <div>Hash: {c.merkleHash}</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {tab === 'trust' && (
          <Card>
            <ol className="space-y-3">
              {['User reported', 'AI extracted', 'User confirmed', 'Issuer verified'].map((label, i) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <span className="font-medium text-ink">{label}</span>
                  {i === 3 && <Badge tone="brand">SANAD</Badge>}
                </li>
              ))}
            </ol>
          </Card>
        )}

        {tab === 'history' && (
          <Card>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
                <div>
                  <div className="font-medium">Issued</div>
                  <div className="text-ink-muted text-xs">{new Date(c.issuanceDate).toLocaleString()}</div>
                </div>
              </li>
            </ul>
          </Card>
        )}

        <Button variant="outline" onClick={() => navigate('/verify')}>
          Open public verification
        </Button>
      </div>
    </AppShell>
  );
};
