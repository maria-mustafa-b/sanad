import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { verifyCredentialPublic, PublicVerificationResult } from '../services/vcService';

export const PublicVerificationView: React.FC = () => {
  const { t, credentials } = useApp();

  const [inputHash, setInputHash] = useState('SANAD-VC-00124');
  const [result, setResult] = useState<PublicVerificationResult>(() => 
    verifyCredentialPublic('SANAD-VC-00124', credentials)
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showTechData, setShowTechData] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyCredentialPublic(inputHash, credentials);
      setResult(res);
      setIsVerifying(false);
    }, 600);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              <span>Screen 13 • Zero-Knowledge Trust Node</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
              {t.verification.title}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-on-surface-variant font-normal leading-relaxed">
              {t.verification.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-mono text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span>Ledger Anchor: Sync'd</span>
            </span>
          </div>
        </div>

        {/* Verification Search Bar & Form */}
        <div className="bg-surface-container rounded-2xl p-4 sm:p-6 shadow-sm mb-8 border border-surface-container-high/60">
          <form onSubmit={handleVerify} className="flex flex-col lg:flex-row items-stretch gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </span>
              <input
                type="text"
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                placeholder={t.verification.inputPlaceholder}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-surface text-on-surface font-mono text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-surface-container-high"
              />
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-95 transition-opacity shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isVerifying ? 'Checking Node...' : t.verification.verifyBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-surface text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors shadow-sm cursor-pointer border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">qr_code_scanner</span>
                <span>{t.verification.scanQrBtn}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Verification Result Module */}
        {result && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border-2 border-primary/20 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-44 h-44 -mr-12 -mt-12 bg-primary/5 rounded-full pointer-events-none"></div>

            {/* Top Status Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 gap-4 border-b border-surface-container-high/60">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-on-primary shadow-sm ${
                  result.isValid ? 'bg-primary' : 'bg-error'
                }`}>
                  <span className="material-symbols-outlined text-[28px]">
                    {result.isValid ? 'verified' : 'cancel'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.isValid ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                      {result.isValid ? t.verification.validBadge : '✗ Unverified / Revoked'}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      Status: {result.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-headline font-bold text-on-surface mt-1">
                    {t.verification.certTitle}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>{t.verification.auditSlip}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  <span>{copied ? 'Link Copied!' : t.verification.copyLink}</span>
                </button>
              </div>
            </div>

            {/* Cryptographic and Meta Claims Grid */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl bg-surface-container-low border border-surface-container-high/60 text-xs">
                <div>
                  <span className="text-outline block uppercase font-bold tracking-wider">Credential ID</span>
                  <p className="font-mono font-bold text-on-surface text-base mt-1">{result.credentialId}</p>
                  <span className="text-[11px] text-on-surface-variant">Issued: {result.issueDate}</span>
                </div>
                <div>
                  <span className="text-outline block uppercase font-bold tracking-wider">Node Status</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full ${result.isValid ? 'bg-primary' : 'bg-error'}`}></span>
                    <span className={`font-bold text-base ${result.isValid ? 'text-primary' : 'text-error'}`}>
                      {result.isValid ? 'Active Valid' : 'Not Valid'}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">{t.verification.revocationActive}</span>
                </div>
                <div>
                  <span className="text-outline block uppercase font-bold tracking-wider">Attested Claim</span>
                  <p className="font-semibold text-on-surface text-sm mt-1 leading-snug">{result.claimCategory}</p>
                  <span className="text-[11px] text-tertiary font-mono font-medium block mt-0.5">W3C VC Verified</span>
                </div>
                <div>
                  <span className="text-outline block uppercase font-bold tracking-wider">Confirmation Type</span>
                  <p className="font-semibold text-primary text-sm mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>User Confirmed Attestation</span>
                  </p>
                  <span className="text-[11px] text-on-surface-variant">Zero-Knowledge Sealed</span>
                </div>
              </div>

              {/* Technical Verification Data Dropdown */}
              <div className="bg-surface-container-low rounded-xl border border-surface-container-high/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTechData(!showTechData)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer font-semibold text-xs text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                    <span>{t.verification.techDetails}</span>
                  </span>
                  <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${showTechData ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {showTechData && (
                  <div className="p-4 border-t border-surface-container-high/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-surface-container-lowest animate-fadeIn">
                    <div className="space-y-2">
                      <div>
                        <span className="text-on-surface-variant block text-[11px]">Subject Pseudonym Anchor:</span>
                        <span className="text-on-surface truncate block">{result.subjectPseudonym}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[11px]">Trust Root Authority:</span>
                        <span className="text-on-surface block">{result.trustNode}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[11px]">Attestation Standard:</span>
                        <span className="text-on-surface block">{result.standard}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-on-surface-variant block text-[11px]">Ledger Proof Anchor:</span>
                        <span className="text-on-surface block">Poly-Ledger Merkle Tree Root (Consensus Testnet)</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[11px]">Cryptographic Merkle Hash:</span>
                        <span className="text-on-surface break-all block">{result.merkleHash}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Strict Privacy Guard Callout */}
            <div className="rounded-xl bg-surface-container-high/60 p-4 sm:p-5 flex items-start gap-3.5">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">security</span>
              <div className="space-y-1 text-xs text-on-surface-variant leading-relaxed">
                <span className="font-bold text-on-surface text-sm block">
                  {t.verification.privacyGuardTitle}
                </span>
                <p>
                  {t.verification.privacyGuardDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Simulated QR Code Camera Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center border border-surface-container-high">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <h3 className="font-headline font-bold text-lg text-on-surface">Scan Credential QR Code</h3>
              <button onClick={() => setIsScannerOpen(false)} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Simulated camera viewfinder */}
            <div className="w-full h-56 rounded-xl bg-inverse-surface flex flex-col items-center justify-center text-inverse-on-surface relative overflow-hidden">
              <div className="w-40 h-40 border-2 border-primary rounded-xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse"></div>
                <span className="material-symbols-outlined text-4xl text-primary opacity-60">qr_code_scanner</span>
              </div>
              <span className="text-[11px] font-mono mt-3 opacity-75">Align QR code within the frame</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setInputHash('SANAD-VC-00124');
                  setIsScannerOpen(false);
                  handleVerify();
                }}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 cursor-pointer shadow-sm"
              >
                Scan Sample QR: SANAD-VC-00124
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
