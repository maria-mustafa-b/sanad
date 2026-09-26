import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, IconWell } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/ChatBubble';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { getSituationBulletsFromDossier } from '../services/aiService';
import { BackendService, loadMatchedServices } from '../services/sanadApi';

export const ServicesPage: React.FC = () => {
  const { navigate, activeDossier } = useApp();
  const bullets = getSituationBulletsFromDossier(activeDossier);
  const [services, setServices] = useState<BackendService[]>([]);
  const [source, setSource] = useState<'api' | 'api-match' | 'official-fallback'>('api');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const result = await loadMatchedServices(activeDossier);
        if (cancelled) return;
        setServices(result.services);
        setSource(result.source);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load services');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeDossier]);

  const top = services[0];
  const rest = services.slice(1, 6);

  const matchLabel = (score?: number) => {
    if (score === undefined) return 'Matched';
    if (score >= 3) return 'Scheme match: High';
    if (score >= 1) return 'Scheme match: Medium';
    return 'Scheme match: Low';
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl pb-8">
        <div>
          <p className="text-label text-brand mb-1">Based on the information you provided</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-[-0.03em]">
            Support that may fit
          </h1>
          <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
            <span className="font-semibold text-brand-dark">SANAD</span> matches official guidance to
            your situation. This is not a legal eligibility decision.
          </p>
          {source === 'official-fallback' && (
            <p className="text-xs text-ink-muted mt-2">
              Showing official u.ae / MOHRE guidance catalog (live services table is empty).
            </p>
          )}
        </div>

        {loading && (
          <Card className="text-center py-10 text-ink-muted">
            <span className="material-symbols-outlined animate-spin text-3xl text-brand">progress_activity</span>
            <p className="mt-2 text-sm">Finding support that may fit…</p>
          </Card>
        )}

        {error && !loading && (
          <Card className="border-danger/30 bg-danger-soft text-sm text-danger-fg">{error}</Card>
        )}

        {!loading && top && (
          <Card tone="elevated" className="border-brand/25 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 glow-brand pointer-events-none opacity-40" />
            <div className="relative flex flex-col sm:flex-row gap-4">
              <IconWell icon="payments" size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-ink tracking-[-0.02em]">{top.title}</h2>
                  <Badge tone={(top.matchScore || 0) >= 3 ? 'success' : 'warning'}>
                    {matchLabel(top.matchScore)}
                  </Badge>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed mb-4">{top.description}</p>
                <div className="rounded-lg bg-surface p-3 mb-4">
                  <div className="text-xs font-semibold text-ink-muted mb-2">Why this matches</div>
                  <ul className="space-y-1">
                    {bullets.slice(0, 3).map((b, i) => (
                      <li key={i} className="text-sm text-ink flex gap-2">
                        <span className="text-brand">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => {
                      sessionStorage.setItem('sanad_selected_service', JSON.stringify(top));
                      navigate('/services/detail');
                    }}
                    rightIcon="arrow_forward"
                  >
                    See next steps
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/documents')}>
                    Prepare documents
                  </Button>
                  {(top.official_url || top.details?.official_url) && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        window.open(top.official_url || top.details?.official_url, '_blank', 'noopener')
                      }
                    >
                      Official page
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {!loading &&
          rest.map((s) => (
            <Card key={s.id} tone="flat" padding="md" className="opacity-95">
              <div className="flex items-center gap-3">
                <IconWell icon="gavel" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{s.title}</h3>
                    <Badge tone={(s.matchScore || 0) >= 2 ? 'success' : 'warning'}>
                      {matchLabel(s.matchScore)}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{s.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    sessionStorage.setItem('sanad_selected_service', JSON.stringify(s));
                    navigate('/services/detail');
                  }}
                >
                  View
                </Button>
              </div>
            </Card>
          ))}

        {!loading && !top && !error && (
          <Card className="text-center py-10 text-ink-muted text-sm">
            No matching services yet. Confirm your situation first, then return here.
          </Card>
        )}

        <HumanHelpCard />
      </div>
    </AppShell>
  );
};

export const ServiceDetailPage: React.FC = () => {
  const { navigate, credentials } = useApp();
  const [tab, setTab] = useState('overview');
  const [service, setService] = useState<BackendService | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('sanad_selected_service');
      if (raw) setService(JSON.parse(raw) as BackendService);
    } catch {
      setService(null);
    }
  }, []);

  const title = service?.title || 'Wage Dispute Resolution';
  const desc =
    service?.description ||
    'Based on the information you provided, this pathway helps you organise evidence for unpaid wages.';

  const content: Record<string, React.ReactNode> = {
    overview: (
      <div className="space-y-3 text-sm text-ink-secondary leading-relaxed">
        <p>{desc}</p>
        <p className="font-medium text-ink">
          SANAD does not resolve the dispute and does not decide if you are legally eligible.
        </p>
      </div>
    ),
    next: (
      <ol className="text-sm text-ink-secondary space-y-3 list-decimal pl-5">
        {(service?.steps?.length
          ? service.steps
          : [
              'Gather salary slips or bank screenshots (if you have them)',
              'Attach your SANAD Digital Proof as supporting evidence',
              'Submit a guided application',
              'Track status and ask a human advisor anytime',
            ]
        ).map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    ),
    documents: (
      <ul className="text-sm text-ink-secondary space-y-2 list-disc pl-5">
        <li>Any salary slip or payment message (helpful, not required to start)</li>
        <li>
          Your SANAD Digital Proof {credentials[0] ? `(${credentials[0].id})` : '(create if needed)'}
        </li>
        <li>Notes about when the job ended</li>
      </ul>
    ),
    apply: (
      <div className="space-y-3">
        <p className="text-sm text-ink-secondary">
          We reuse what you already confirmed — this is not a long government form.
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
          <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">{title}</h1>
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
