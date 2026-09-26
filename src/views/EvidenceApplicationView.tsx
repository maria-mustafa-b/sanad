import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StepTracker } from '../components/StepTracker';
import { matchSupportOrganizations } from '../services/supportService';
import { processDocumentOcr, createDocumentEvidence } from '../services/ocrService';
import { ApplicationCase } from '../types';

export const EvidenceApplicationView: React.FC = () => {
  const { 
    t, 
    activeDossier, 
    language, 
    credentials, 
    documents, 
    addDocument, 
    addApplication, 
    navigate, 
    setActiveStep 
  } = useApp();

  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('org_migrant_legal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  React.useEffect(() => {
    setActiveStep(4);
  }, [setActiveStep]);

  const [matches, setMatches] = useState<any[]>([]);

  React.useEffect(() => {
    setActiveStep(4);
    matchSupportOrganizations(activeDossier.category, language).then(res => setMatches(res));
  }, [setActiveStep, activeDossier.category, language]);

  const primaryMatch = matches[0]?.organization || null;
  const linkedVc = credentials[0] || { id: 'SANAD-VC-00124' };

  const handleSimulateFileUpload = async () => {
    setIsUploading(true);
    try {
      const ocr = await processDocumentOcr('Salary_Slip_August_WPS.pdf');
      const newDoc = createDocumentEvidence('August Supplemental Wage Ledger (WPS.pdf)', ocr);
      addDocument(newDoc);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newApp: ApplicationCase = {
      id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dossierId: activeDossier.id,
      credentialId: linkedVc.id,
      orgId: selectedOrgId,
      orgName: matches.find(m => m.organization.id === selectedOrgId)?.organization.name || 'Migrant Justice Legal Clinic',
      title: `${activeDossier.categoryLabel} Dispute Triage`,
      category: activeDossier.category,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      notes: 'Initial dossier submitted with verified W3C proof. Case assigned to pro bono paralegal queue.',
      timeline: [
        { title: 'Application Submitted with Verifiable Proof', date: 'Just now', completed: true, current: true, description: `Proof ${linkedVc.id} verified and attached.` },
        { title: 'Triage & Case Review Meeting', date: 'Estimated: 24h', completed: false, description: 'Neutral consultation to evaluate employer mediation.' },
        { title: 'Formal Dispute Notice to Employer', date: 'Upcoming', completed: false, description: 'Statutory demand for delayed wages and passport retrieval.' }
      ]
    };

    addApplication(newApp);
    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 6-Step Stepper Header */}
      <StepTracker currentStepIndex={4} />

      {/* Prototype Alert Region */}
      <div className="rounded-xl bg-secondary-container text-on-secondary-container p-4 shadow-sm flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[24px] flex-shrink-0 mt-0.5">info</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
              SANAD Prototype Demonstration
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Proof Linked: <strong className="text-primary">{linkedVc.id}</strong>
            </span>
          </div>
          <p className="text-sm font-semibold mt-1 text-on-secondary-fixed">
            Matches computed locally based on your cryptographically confirmed situation: <strong className="text-on-surface">{activeDossier.categoryLabel}</strong>. No identity records are exposed to employers.
          </p>
        </div>
      </div>

      {/* Section A: Curated Support Match */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-tertiary">
              Curated Intake Portal
            </span>
            <h1 className="font-headline text-2xl sm:text-3xl text-on-surface font-bold tracking-tight mt-1">
              {t.support.title}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1 max-w-2xl">
              {t.support.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            <span>Directory Sync: Verified Pro Bono Partners</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Match Card */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 border border-surface-container-high/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold tracking-wide flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Scheme Match: High</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                  100% Pro Bono Legal Aid
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">
                Triage Ref: DEMO-WPS-882
              </span>
            </div>

            <div>
              <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
                {primaryMatch?.name || 'Migrant Justice Legal Clinic'}
              </h2>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                {primaryMatch?.description || 'Independent mediation and guidance pathway for workers addressing unpaid wages and documentation review in a supportive environment.'}
              </p>
            </div>

            {/* Accordion: Why am I seeing this? */}
            <div className="rounded-xl bg-surface-container p-4 space-y-2">
              <button 
                onClick={() => setIsWhyOpen(!isWhyOpen)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-primary cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>{t.support.whySeeingThis}</span>
                </span>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isWhyOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isWhyOpen && (
                <div className="text-xs text-on-surface-variant leading-relaxed pt-2 space-y-1 animate-fadeIn">
                  <p className="text-on-surface font-medium">
                    {t.support.whySeeingThisExplanation}
                  </p>
                  <p>
                    Matches are determined transparently by comparing your verified claim category with registered NGO mandates. No private case notes or biometric details were shared.
                  </p>
                </div>
              )}
            </div>

            {/* 3 Step Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-surface-container rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] uppercase font-bold text-secondary">Step 1: Intake</span>
                <p className="text-xs font-semibold text-on-surface">Confidential Case Review</p>
                <p className="text-[11px] text-on-surface-variant">Neutral community consultation to discuss amicable options.</p>
              </div>
              <div className="bg-surface-container rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] uppercase font-bold text-secondary">Step 2: Proof</span>
                <p className="text-xs font-semibold text-on-surface">Verified Proof + WPS</p>
                <p className="text-[11px] text-on-surface-variant">Your SANAD credential summarizes validated payroll discrepancies.</p>
              </div>
              <div className="bg-surface-container rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] uppercase font-bold text-secondary">Step 3: Action</span>
                <p className="text-xs font-semibold text-on-surface">Tribunal Referral</p>
                <p className="text-[11px] text-on-surface-variant">Direct filing to labor tribunal with fee exemption guarantee.</p>
              </div>
            </div>
          </div>

          {/* Volunteer Counselor Card */}
          <div className="lg:col-span-4 bg-surface-container rounded-2xl p-6 shadow-sm space-y-5">
            <div className="rounded-xl p-6 bg-primary/10 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-3xl">support_agent</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                {t.support.communityDeskTitle}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t.support.communityDeskDesc}
              </p>
            </div>

            <button 
              onClick={() => navigate('/help')}
              className="w-full py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span>{t.support.talkAdvisor}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section B: Documents & Verification Evidence */}
      <section className="space-y-6 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-tertiary">
            Cryptographic Ingestion
          </span>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mt-1">
            {t.support.documentsTitle}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            {t.support.documentsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Document list */}
          <div className="lg:col-span-7 space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="bg-surface-container-low rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container-high/60"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-on-surface truncate">{doc.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary-fixed-dim text-on-primary-fixed font-bold">
                        {doc.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      File Size: {doc.fileSize} • Uploaded: {doc.uploadDate}
                    </p>
                    <p className="text-[11px] text-secondary font-mono">
                      Digest: {doc.sha256}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button 
                    onClick={() => alert(`Inspecting ${doc.name}\n\nSHA-256 Digest: ${doc.sha256}\nOCR Verified: Yes\nEncrypted: AES-256`)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Check details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Dropzone */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 shadow-sm space-y-4 border border-surface-container-high/60">
            <div className="text-xs font-bold uppercase tracking-wider text-secondary">
              Document Ingestion Box
            </div>

            <div 
              onClick={handleSimulateFileUpload}
              className="rounded-xl p-6 flex flex-col items-center justify-center text-center bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group border-2 border-dashed border-outline-variant/60"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-highest text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
              </div>
              <p className="text-xs font-bold text-on-surface">
                {isUploading ? 'Scanning & Encrypting Document...' : t.support.dragDropText}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1">
                PDF, JPG, PNG up to 15MB. Encrypted locally before dispatch.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">file_upload</span>
                  <span>{t.support.uploadBtn}</span>
                </button>
                <button
                  type="button"
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-xs font-semibold hover:bg-surface-variant flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span>{t.support.takePhoto}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0">shield</span>
              <span>{t.support.zkGuarantee}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Application Review with Verifiable Evidence Bridge */}
      <section className="space-y-6 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-tertiary">
            Pre-Submission Verification
          </span>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mt-1">
            Application Review with Verifiable Evidence Bridge
          </h2>
        </div>

        {/* Trust Callout */}
        <div className="rounded-xl bg-primary-fixed/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-primary-fixed-dim">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-on-surface">No redundant questionnaires or re-telling</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Instead of repeatedly explaining your situation, your verified SANAD proof <span className="font-mono font-bold text-primary bg-surface-container px-1.5 py-0.5 rounded">{linkedVc.id}</span> is automatically linked as machine-verifiable structured evidence.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary font-mono bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm shrink-0">
            W3C VC 1.1 Compliant
          </span>
        </div>

        {/* Review Summary Grid */}
        <div className="bg-surface-container-low rounded-xl p-6 sm:p-8 shadow-sm space-y-6 border border-surface-container-high/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                <span>1. Verified Situation</span>
              </div>
              <p className="text-base font-bold text-on-surface">{activeDossier.categoryLabel}</p>
              <p className="text-xs text-on-surface-variant">{activeDossier.incidentPeriod} • Employer: {activeDossier.employerName}</p>
            </div>

            <div className="space-y-2 bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                <span className="material-symbols-outlined text-[16px]">attach_file</span>
                <span>2. Evidence Attached</span>
              </div>
              <p className="text-base font-bold text-on-surface">{documents.length} Cryptographic Files</p>
              <p className="text-xs text-on-surface-variant">WPS statement &amp; Ministry Labour Contract verified.</p>
            </div>

            <div className="space-y-2 bg-surface-container p-4 rounded-xl">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                <span className="material-symbols-outlined text-[16px]">balance</span>
                <span>3. Selected Legal Advocate</span>
              </div>
              <p className="text-base font-bold text-on-surface">Migrant Justice Legal Clinic</p>
              <p className="text-xs text-on-surface-variant">Free pro bono representation &amp; WPS claim filing.</p>
            </div>
          </div>

          {/* Submit Application Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-container-high/60">
            <span className="text-xs text-on-surface-variant">
              By submitting, your verified credential is transferred through an encrypted channel to the assigned casework team.
            </span>

            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-on-primary-fixed-variant transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{isSubmitting ? 'Transferring Dossier...' : t.support.applyButton}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Submission Success Modal */}
      {submissionSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-center border border-primary/20">
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface">
              Application Successfully Transferred
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your confirmed claim and evidence have been sent to <strong className="text-on-surface font-semibold">Migrant Justice Legal Clinic</strong>. You can monitor progress and advocate notes on the Live Tracking dashboard.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmissionSuccess(false);
                  navigate('/applications');
                }}
                className="w-full py-3 px-6 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 cursor-pointer"
              >
                <span>Go to Applications &amp; Live Tracking</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
