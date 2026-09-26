"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicHeader } from '../layouts/PublicHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { verifyCredentialPublic } from '../services/vcService';

export const VerifyPage: React.FC = () => {
  const { credentials } = useApp();
  const [id, setId] = useState(credentials[0]?.id || 'SANAD-VC-00124');
  const [result, setResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [detail, setDetail] = useState<{ claim?: string; trustNode?: string } | null>(null);

  const run = () => {
    const found = verifyCredentialPublic(id, credentials);
    if (found.isValid) {
      setResult('valid');
      setDetail({ claim: found.claimCategory, trustNode: found.trustNode });
    } else {
      setResult('invalid');
      setDetail(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-display-sm text-2xl sm:text-3xl text-ink">
            Verify a <span className="text-brand-dark font-extrabold tracking-tight">SANAD</span> Digital Proof
          </h1>
          <p className="text-[14px] text-ink-secondary leading-relaxed max-w-sm mx-auto">
            No login required. Only proof status is shown â€” never private worker details.
          </p>
        </div>

        <Card className="space-y-4" tone="elevated" padding="lg">
          <Input
            label="Credential ID"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setResult('idle');
            }}
            placeholder="SANAD-VC-00124"
            leftIcon="qr_code_scanner"
          />
          <div className="flex gap-2">
            <Button fullWidth onClick={run}>
              Verify
            </Button>
            <Button variant="outline" leftIcon="photo_camera" aria-label="Scan QR">
              Scan
            </Button>
          </div>
        </Card>

        {result === 'valid' && (
          <Card className="text-center space-y-3 border-success/30 bg-success-soft">
            <Badge tone="success" icon="check_circle">
              Valid
            </Badge>
            <h2 className="text-lg font-semibold text-ink">Credential verified</h2>
            <p className="text-sm text-ink-secondary">{detail?.claim}</p>
            <p className="text-xs text-ink-muted">{detail?.trustNode}</p>
          </Card>
        )}

        {result === 'invalid' && (
          <Card className="text-center space-y-3 border-danger/30 bg-danger-soft">
            <Badge tone="danger" icon="cancel">
              Invalid
            </Badge>
            <h2 className="text-lg font-semibold text-ink">Could not verify</h2>
            <p className="text-sm text-ink-secondary">
              This ID was not found or has been revoked.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
