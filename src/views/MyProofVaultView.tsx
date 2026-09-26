 
"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerifiableCredential } from '../types';

export const MyProofVaultView: React.FC = () => {
  const { credentials, activeDossier, applications, navigate } = useApp();
  const [selectedVc, setSelectedVc] = useState<VerifiableCredential>(credentials[0]);
  const [showJson, setShowJson] = useState(false);

  const handleDownload = (vc: VerifiableCredential) => {
    const blob = new Blob([vc.rawJson || JSON.stringify(vc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vc.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">dashboard</span>
              <span>Screen 14 â€¢ Sovereign Worker Vault</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
              My Proof &amp; Sovereign Vault
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Your self-sovereign workspace. Your documents and credentials remain encrypted on your device.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => navigate('/tell-sanad')}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Dossier / Statement</span>
            </button>
          </div>
        </div>

        {/* 4-Card Bento Grid Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: My Confirmed Situation */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
                  Confirmed
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">My Situation</p>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {activeDossier.categoryLabel}
              </h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                {activeDossier.incidentPeriod} â€¢ Employer: {activeDossier.employerName}.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-surface-container-highest/70 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-mono">{activeDossier.id}</span>
              <button 
                onClick={() => navigate('/confirm-situation')}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Details</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: My Proof */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold">
                  {credentials.length} Sealed
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Verifiable Proof</p>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {selectedVc?.id || 'SANAD-VC-00124'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Tamper-evident W3C Credential. Zero personal data exposed to the public.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-surface-container-highest/70 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Status: Valid</span>
              <button 
                onClick={() => navigate('/verify')}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Verify</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 3: Active Applications */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">pending_actions</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                  {applications.length} Active
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Case Tracking</p>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {applications[0]?.title || 'Wage Dispute Triage'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Handled by {applications[0]?.orgName || 'Migrant Justice Legal Clinic'}.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-surface-container-highest/70 flex items-center justify-between text-xs">
              <span className="text-primary font-bold">Advocate Assigned</span>
              <button 
                onClick={() => navigate('/applications')}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Track</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 4: 24/7 Human Helpline */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error text-xs font-bold">
                  24/7 Support
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Human Contact</p>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                800-SANAD-SOS
              </h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Connect directly with translators and emergency caseworkers in your native language.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-surface-container-highest/70 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Toll-Free Dispatch</span>
              <button 
                onClick={() => navigate('/help')}
                className="font-semibold text-error hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Get Help</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credential Detailed Inspection Section */}
      <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container-high/60 gap-4">
          <div>
            <h3 className="text-xl font-headline font-bold text-on-surface">
              Credentials Stored in Local Sovereign Vault
            </h3>
            <p className="text-xs text-on-surface-variant">
              Tap any credential to inspect cryptographic proofs or share attestation links
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload(selectedVc)}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-primary">download</span>
              <span>Download JSON</span>
            </button>
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-tertiary">code</span>
              <span>{showJson ? 'Hide Code' : 'View Raw JSON-LD'}</span>
            </button>
          </div>
        </div>

        {/* Credentials Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {credentials.map((vc) => (
            <button
              key={vc.id}
              onClick={() => setSelectedVc(vc)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                selectedVc?.id === vc.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>{vc.id}</span>
              <span className="text-[10px] opacity-75">({vc.status})</span>
            </button>
          ))}
        </div>

        {/* Selected Credential Detail */}
        {selectedVc && (
          <div className="bg-surface rounded-xl p-5 shadow-xs space-y-4 text-xs border border-surface-container-high/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Claim Attested</span>
                <strong className="text-sm font-headline text-on-surface block mt-1">{selectedVc.claimSummary}</strong>
              </div>
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Subject Pseudonym (DID)</span>
                <span className="font-mono text-on-surface font-semibold block mt-1">{selectedVc.subjectPseudonym}</span>
              </div>
              <div>
                <span className="text-outline uppercase font-bold tracking-wider block">Digital Signature</span>
                <span className="font-mono text-primary font-bold block mt-1 truncate">{selectedVc.digitalSignature}</span>
              </div>
            </div>

            {/* Zero-knowledge properties */}
            <div className="p-3.5 rounded-xl bg-primary-fixed/30 space-y-1.5">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wide block">
                Verified Cryptographic Properties:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-on-surface">
                {selectedVc.zkAttestation.verifiedProperties.map((prop, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>{prop}</span>
                  </div>
                ))}
              </div>
            </div>

            {showJson && (
              <pre className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto max-h-56">
                {selectedVc.rawJson}
              </pre>
            )}
          </div>
        )}
      </section>
    </div>
  );
};


