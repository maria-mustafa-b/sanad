import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StepTracker } from '../components/StepTracker';
import { issueVerifiableCredential } from '../services/vcService';

export const ConfirmProofView: React.FC = () => {
  const { 
    t, 
    activeDossier, 
    updateDossier, 
    addCredential, 
    navigate, 
    setActiveStep 
  } = useApp();

  const [facts, setFacts] = useState(activeDossier.facts);
  const [editingFactKey, setEditingFactKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [createdCredential, setCreatedCredential] = useState<any>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  React.useEffect(() => {
    setActiveStep(2);
  }, [setActiveStep]);

  const handleStartEdit = (key: string, currentValue: string) => {
    setEditingFactKey(key);
    setEditingValue(currentValue);
  };

  const handleSaveEdit = (key: string) => {
    const updated = facts.map(f => {
      if (f.key === key) {
        return {
          ...f,
          value: editingValue,
          isAiExtracted: false,
          confidence: 1.0,
        };
      }
      return f;
    });
    setFacts(updated);
    updateDossier({ facts: updated });
    setEditingFactKey(null);
  };

  const handleSealProof = async () => {
    setIsSealing(true);
    try {
      const vc = await issueVerifiableCredential(activeDossier);
      addCredential(vc);
      setCreatedCredential(vc);
      updateDossier({ status: 'proof_generated' });
      setActiveStep(3);

      try {
        const confettiMod = await import('canvas-confetti');
        const trigger = (confettiMod as any).default || confettiMod;
        if (typeof trigger === 'function') {
          trigger({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch {
        // confetti fallback
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSealing(false);
    }
  };

  const handleDownloadJson = () => {
    if (!createdCredential) return;
    const blob = new Blob([createdCredential.rawJson || JSON.stringify(createdCredential, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${createdCredential.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 6-Step Stepper Header */}
      <StepTracker currentStepIndex={createdCredential ? 3 : 2} />

      {/* Section 1: Review What SANAD Understood */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">fact_check</span>
              <span>Screen 05 • Verification &amp; Calibration</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
              {t.confirm.title}
            </h1>
            <p className="font-body text-base text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
              {t.confirm.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-container px-4 py-2.5 rounded-xl shrink-0">
            <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div className="text-xs">
              <p className="text-secondary font-medium">Dossier Context</p>
              <p className="text-on-surface font-bold font-mono">{activeDossier.id}</p>
            </div>
          </div>
        </div>

        {/* Fact Cards Grid */}
        <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-surface-container-high">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {t.confirm.extractedFacts}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {t.confirm.provenanceDesc}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-xs font-mono">
              {facts.length} items reviewed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.map((fact) => {
              const isEditing = editingFactKey === fact.key;

              return (
                <div 
                  key={fact.key}
                  className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high/80 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                        {fact.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        fact.isAiExtracted 
                          ? 'bg-primary-fixed text-on-primary-fixed' 
                          : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}>
                        <span className="material-symbols-outlined text-[11px]">
                          {fact.isAiExtracted ? 'auto_awesome' : 'verified'}
                        </span>
                        <span>{fact.isAiExtracted ? t.confirm.aiExtractedBadge : t.confirm.verifiedBadge}</span>
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-surface text-on-surface font-semibold border border-primary focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(fact.key)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:opacity-90 cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFactKey(null)}
                          className="px-2 py-1.5 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-base font-bold text-on-surface pt-1">
                        {fact.value}
                      </p>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/40">
                      <span className="text-[10px] text-outline font-mono">
                        Confidence: {(fact.confidence * 100).toFixed(0)}%
                      </span>
                      <button
                        onClick={() => handleStartEdit(fact.key, fact.value)}
                        className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">edit</span>
                        <span>{t.confirm.editInline}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Callout */}
          <div className="p-5 rounded-xl bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-on-surface-variant">
              <span className="font-bold text-on-surface block">
                Everything accurate and confirmed by you?
              </span>
              <p>
                By proceeding, your confirmed statement is cryptographically signed using a decentralized identifier (DID) and anchored to the SANAD Trust Node.
              </p>
            </div>

            <button
              onClick={handleSealProof}
              disabled={isSealing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{isSealing ? t.confirm.sealingWait : t.confirm.createProofBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Sealed Verifiable Proof Certificate (Appears upon sealing or if preloaded) */}
      {createdCredential && (
        <section className="space-y-6 pt-4 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[15px]">workspace_premium</span>
                <span>Stage 03 • Cryptographic Seal Active</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
                {t.confirm.proofCardTitle}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {t.confirm.proofCardDesc}
              </p>
            </div>
          </div>

          {/* Sealed Credential Box */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border-2 border-primary/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 -mr-12 -mt-12 bg-primary/5 rounded-full pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-container-high/60 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-sm">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                      ✓ Tamper-Evident Signed
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant font-bold">
                      ID: {createdCredential.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-headline font-bold text-on-surface mt-0.5">
                    {createdCredential.claimSummary}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-primary">download</span>
                  <span>{t.confirm.downloadJson}</span>
                </button>
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-tertiary">terminal</span>
                  <span>{showRawJson ? 'Hide Raw VC' : 'Inspect JSON-LD'}</span>
                </button>
              </div>
            </div>

            {/* Cryptographic properties grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-container-low text-xs">
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Subject Pseudonym</span>
                <span className="font-mono font-bold text-on-surface mt-1 block truncate">
                  {createdCredential.subjectPseudonym}
                </span>
              </div>
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Trust Node Standard</span>
                <span className="font-bold text-primary mt-1 block">W3C VC v2.0 (ZK-Ready)</span>
              </div>
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Issuance Date</span>
                <span className="font-bold text-on-surface mt-1 block">{createdCredential.issuanceDate}</span>
              </div>
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Merkle Root Hash</span>
                <span className="font-mono font-bold text-on-surface mt-1 block truncate" title={createdCredential.merkleHash}>
                  {createdCredential.merkleHash.substring(0, 16)}...
                </span>
              </div>
            </div>

            {/* Raw JSON-LD Viewer */}
            {showRawJson && (
              <pre className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto max-h-64">
                {createdCredential.rawJson}
              </pre>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[18px]">security</span>
                <span>Zero-Knowledge Node verified. Full audit provenance intact.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/my-proof')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  View in My Proof Vault
                </button>
                <button
                  onClick={() => navigate('/evidence-application')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                >
                  <span>Step 4: Find Support &amp; Apply</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
