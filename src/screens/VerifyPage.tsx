import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from '../layouts/PublicHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { verifyCredentialPublic } from '../services/vcService';
import {
  ApiError,
  isUuid,
  verifyCredentialByGet,
  verifyCredentialRemote,
} from '../services/sanadApi';

export const VerifyPage: React.FC = () => {
  const { credentials } = useApp();
  const [id, setId] = useState(credentials[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [detail, setDetail] = useState<{
    claim?: string;
    issuer?: string;
    status?: string;
    source?: string;
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('id') || params.get('credentialId');
    if (q) setId(q);
  }, []);

  const run = async () => {
    const query = id.trim();
    setError('');
    setResult('idle');
    setDetail(null);
    if (!query) {
      setError('Enter a credential ID to verify.');
      return;
    }

    setLoading(true);
    try {
      if (isUuid(query)) {
        try {
          const remote = await verifyCredentialRemote(query);
          setResult(remote.valid ? 'valid' : 'invalid');
          setDetail({
            claim: remote.claimType || 'Confirmed situation',
            issuer: remote.issuer || 'SANAD',
            status: remote.status,
            source: 'SANAD public API',
          });
          return;
        } catch {
          const remote = await verifyCredentialByGet(query);
          setResult(remote.valid ? 'valid' : 'invalid');
          setDetail({
            claim: remote.claimType || 'Confirmed situation',
            issuer: remote.issuer || 'SANAD',
            status: remote.status,
            source: 'SANAD public API',
          });
          return;
        }
      }

      // Non-UUID: check local wallet only — never invent a "valid" result
      const local = verifyCredentialPublic(query, credentials);
      if (local.status === 'not_found') {
        setResult('invalid');
        setDetail(null);
        setError('Use the UUID from your Digital Proof for public verification.');
      } else {
        setResult(local.isValid ? 'valid' : 'invalid');
        setDetail({
          claim: local.claimCategory,
          issuer: 'SANAD (this device)',
          status: local.status,
          source: 'Local wallet',
        });
      }
    } catch (e) {
      setResult('invalid');
      setError(e instanceof ApiError ? e.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-display-sm text-2xl sm:text-3xl text-ink">
            Verify a <span className="text-brand-dark font-extrabold tracking-tight">SANAD</span> Digital
            Proof
          </h1>
          <p className="text-[14px] text-ink-secondary leading-relaxed max-w-sm mx-auto">
            No login required. Only proof status is shown — never private worker details.
          </p>
        </div>

        <Card className="space-y-4" tone="elevated" padding="lg">
          <Input
            label="Credential ID"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setResult('idle');
              setError('');
            }}
            placeholder="Paste UUID from Digital Proof"
            leftIcon="qr_code_scanner"
          />
          {credentials[0] && (
            <button
              type="button"
              className="text-xs text-brand font-medium cursor-pointer"
              onClick={() => setId(credentials[0].id)}
            >
              Use my latest proof ID
            </button>
          )}
          <div className="flex gap-2">
            <Button fullWidth loading={loading} onClick={() => void run()}>
              Verify
            </Button>
          </div>
          {error && <p className="text-sm text-warning-fg">{error}</p>}
        </Card>

        {result === 'valid' && (
          <Card className="text-center space-y-3 border-success/30 bg-success-soft">
            <Badge tone="success" icon="check_circle">
              Valid
            </Badge>
            <h2 className="text-lg font-semibold text-ink">Digital Proof verified</h2>
            <p className="text-sm text-ink-secondary">{detail?.claim}</p>
            <p className="text-xs text-ink-muted">Issuer: {detail?.issuer}</p>
            <p className="text-xs text-ink-muted">{detail?.source}</p>
          </Card>
        )}

        {result === 'invalid' && (
          <Card className="text-center space-y-3 border-danger/30 bg-danger-soft">
            <Badge tone="danger" icon="cancel">
              Invalid
            </Badge>
            <h2 className="text-lg font-semibold text-ink">Could not verify</h2>
            <p className="text-sm text-ink-secondary">
              This ID was not found, is not a public UUID, or has been revoked.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
