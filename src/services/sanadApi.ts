import { apiFetch, ApiError } from './apiClient';
import { DossierClaim, ExtractedFact, GrievanceCategory, LanguageCode, VerifiableCredential } from '../types';

/** Backend Gemini / demo_rules analysis payload */
export interface BackendAnalysis {
  intent: string;
  confidence: number;
  languageSignals: string[];
  facts: Record<string, string>;
  missing_information: string[];
  potential_categories: string[];
}

export interface UnderstandResult {
  analysis: BackendAnalysis;
  method: 'provider' | 'demo_rules';
  transcript?: string;
  notice?: string;
}

export interface BackendClaim {
  id: string;
  original_text?: string;
  status?: string;
  intent?: string;
  confidence?: number;
  facts?: Record<string, string>;
  missing_information?: string[];
  analysis?: BackendAnalysis & { method?: string };
  created_at?: string;
  updated_at?: string;
}

export interface BackendActor {
  id: string;
  email?: string;
  role: 'user' | 'admin' | 'issuer';
  demo?: boolean;
}

export interface BackendService {
  id: string;
  title: string;
  description: string;
  category: string;
  eligibility_guidance?: string;
  official_url?: string;
  supported_situations?: string[];
  steps?: string[];
  details?: { kind?: string; last_verified?: string; official_url?: string };
  published?: boolean;
  matchScore?: number;
}

export interface BackendCredential {
  id: string;
  claim_id?: string;
  status: string;
  mode?: string;
  issuer?: string;
  issued_at?: string;
  record_hash?: string;
  transaction_hash?: string;
}

export interface BackendVerifyResult {
  credentialId: string;
  valid: boolean;
  status: string;
  integrity?: boolean;
  mode?: string;
  issuer?: string;
  issuedAt?: string;
  claimType?: string;
  blockchainVerification?: boolean;
  transactionHash?: string | null;
  revoked?: boolean;
}

export interface BackendDocument {
  id: string;
  file_name?: string;
  name?: string;
  analysis_status?: string;
  extraction?: {
    document_type?: string | null;
    date?: string | null;
    employer_name?: string | null;
    salary_period?: string | null;
    extractedText?: string;
  };
  confidence?: number;
  documentType?: string;
  extractedText?: string;
  flags?: string[];
}

const FACT_LABELS: Record<string, string> = {
  employment_status: 'Job status',
  issue: 'Main issue',
  unpaid_wages: 'Main issue',
  salary_period: 'When',
  unpaid_wages_period: 'When',
  employer_name: 'Employer',
  employer: 'Employer',
  amount: 'Amount',
  employer_response: 'Employer response',
};

/**
 * Official UAE service catalog (same seed as backend lib/services/catalog.ts).
 * Used only when GET /api/services returns [] (empty Supabase table).
 */
export const OFFICIAL_SERVICE_FALLBACK: BackendService[] = [
  {
    id: 'seed-labour-complaint',
    title: 'Private-sector labour complaint',
    category: 'Labour',
    description:
      'A Ministry of Human Resources and Emiratisation complaint route for private-sector employees.',
    official_url:
      'https://mohre.gov.ae/en/services/register-labor-complaints-private-sector-employees-2022',
    supported_situations: ['unpaid_wages', 'job_loss', 'labour_dispute'],
    steps: ['Prepare your confirmed situation', 'Gather salary evidence if available', 'Register via MOHRE'],
    published: true,
  },
  {
    id: 'seed-wages-guidance',
    title: 'Payment of wages guidance',
    category: 'Labour',
    description: 'Official information about wages in private-sector employment.',
    official_url:
      'https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/payment-of-wages',
    supported_situations: ['unpaid_wages'],
    steps: ['Read official wage rules', 'Compare with your confirmed dates'],
    published: true,
  },
  {
    id: 'seed-labour-dispute',
    title: 'Resolving labour disputes',
    category: 'Labour',
    description: 'Official overview of labour disputes and resolution.',
    official_url:
      'https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/labour-dispute',
    supported_situations: ['labour_dispute', 'unpaid_wages'],
    steps: ['Review dispute overview', 'Use matched complaint route if needed'],
    published: true,
  },
  {
    id: 'seed-worker-rights',
    title: 'Worker rights guidance',
    category: 'Labour',
    description: 'Official guidance about private-sector worker rights.',
    official_url:
      'https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/labour-rights',
    supported_situations: ['labour_dispute', 'unpaid_wages', 'job_loss'],
    steps: ['Read rights overview', 'Confirm your situation with SANAD'],
    published: true,
  },
  {
    id: 'seed-termination',
    title: 'Terminating an employment contract',
    category: 'Labour',
    description: 'Official guidance for employment termination and related procedures.',
    official_url:
      'https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/job-offers-and-work-permits-and-contracts/terminating-employment-contracts',
    supported_situations: ['job_loss', 'termination'],
    steps: ['Check termination guidance', 'Note dates from your statement'],
    published: true,
  },
  {
    id: 'seed-unemployment',
    title: 'Unemployment insurance information',
    category: 'Employment support',
    description:
      'Official guidance on the unemployment insurance scheme; conditions and timing should be checked.',
    official_url: 'https://u.ae/en/information-and-services/jobs/insurance/unemployment-insurance-scheme',
    supported_situations: ['job_loss', 'employment_support'],
    steps: ['Check scheme conditions on u.ae', 'SANAD does not decide eligibility'],
    published: true,
  },
  {
    id: 'seed-eos',
    title: 'End-of-service benefits guidance',
    category: 'Labour',
    description: 'Official overview of end-of-service benefits.',
    official_url:
      'https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/end-of-service-benefits-for-employees-in-the-private-sector',
    supported_situations: ['job_loss', 'termination'],
    steps: ['Read end-of-service overview'],
    published: true,
  },
  {
    id: 'seed-legal-aid',
    title: 'Free legal aid and advice services',
    category: 'Justice & Law',
    description:
      'Official Ministry of Justice and judicial department guidance on obtaining free legal aid.',
    official_url: 'https://u.ae/en/information-and-services/justice-safety-and-the-law/legal-aid',
    supported_situations: ['legal_aid', 'court_case', 'lawyer_support', 'labour_dispute'],
    steps: ['Review legal aid options', 'Talk to a human advisor if unsure'],
    published: true,
  },
];

function mapCategory(categories: string[] = [], intent = ''): GrievanceCategory {
  const joined = [...categories, intent].join(' ').toLowerCase();
  if (joined.includes('passport')) return 'passport_withholding';
  if (joined.includes('contract')) return 'contract_violation';
  if (joined.includes('medical')) return 'medical_denial';
  if (joined.includes('visa') || joined.includes('residency') || joined.includes('permit')) {
    return 'work_permit_issue';
  }
  if (
    joined.includes('wage') ||
    joined.includes('salary') ||
    joined.includes('job_loss') ||
    joined.includes('job loss') ||
    joined.includes('employment') ||
    joined.includes('labour') ||
    joined.includes('labor')
  ) {
    return 'unpaid_wages';
  }
  return 'general_grievance';
}

function humanizeFactValue(key: string, value: string): string {
  const v = value.toLowerCase().replace(/_/g, ' ');
  if (key === 'employment_status' && (v.includes('lost') || v.includes('ended'))) return 'Job ended';
  if ((key === 'issue' || key === 'unpaid_wages') && v.includes('unpaid')) return 'Unpaid wages';
  return value.replace(/_/g, ' ');
}

function categoryLabel(category: GrievanceCategory, facts: Record<string, string>): string {
  const emp = (facts.employment_status || '').toLowerCase();
  const lost = emp.includes('lost') || emp.includes('ended') || emp === 'lost_job';
  const wages =
    facts.issue === 'unpaid_wages' ||
    Boolean(facts.unpaid_wages_period) ||
    Boolean(facts.salary_period) ||
    /unpaid|wage|salary/i.test(facts.issue || '') ||
    /unpaid|wage/i.test(facts.unpaid_wages || '');
  if (lost && wages) return 'Job ended + unpaid wages';
  if (wages) return 'Unpaid wages';
  if (lost) return 'Job ended';
  if (category === 'passport_withholding') return 'Passport held by employer';
  return 'Work-related problem';
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

/** POST /api/ai/analyze — no auth required */
export async function understandSituation(text: string): Promise<UnderstandResult> {
  return apiFetch<UnderstandResult>('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

/** POST /api/ai/analyze-voice — no auth required */
export async function understandVoiceTranscript(transcript: string): Promise<UnderstandResult> {
  return apiFetch<UnderstandResult>('/api/ai/analyze-voice', {
    method: 'POST',
    body: JSON.stringify({ transcript }),
  });
}

export async function getAuthMe(): Promise<BackendActor> {
  return apiFetch<BackendActor>('/api/auth/me');
}

export async function loginWithPassword(email: string, password: string): Promise<BackendActor> {
  return apiFetch<BackendActor>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerWithPassword(
  email: string,
  password: string
): Promise<{ confirmationRequired?: boolean } | BackendActor> {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutApi(): Promise<void> {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) });
  } catch {
    /* ignore */
  }
}

export async function fetchClaims(): Promise<BackendClaim[]> {
  const data = await apiFetch<BackendClaim[] | { data?: BackendClaim[] }>('/api/claims');
  return Array.isArray(data) ? data : [];
}

export async function createClaimFromText(text: string): Promise<BackendClaim> {
  return apiFetch<BackendClaim>('/api/claims', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function confirmClaim(claimId: string): Promise<BackendClaim> {
  return apiFetch<BackendClaim>(`/api/claims/${claimId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function issueCredential(claimId: string): Promise<BackendCredential> {
  return apiFetch<BackendCredential>('/api/credentials/issue', {
    method: 'POST',
    body: JSON.stringify({ claimId }),
  });
}

export async function fetchCredentials(): Promise<BackendCredential[]> {
  const data = await apiFetch<BackendCredential[]>('/api/credentials');
  return Array.isArray(data) ? data : [];
}

export async function verifyCredentialRemote(credentialId: string): Promise<BackendVerifyResult> {
  return apiFetch<BackendVerifyResult>('/api/verify', {
    method: 'POST',
    body: JSON.stringify({ credentialId }),
  });
}

export async function verifyCredentialByGet(credentialId: string): Promise<BackendVerifyResult> {
  return apiFetch<BackendVerifyResult>(`/api/verify/${credentialId}`);
}

export async function fetchServices(): Promise<BackendService[]> {
  const data = await apiFetch<BackendService[]>('/api/services');
  return Array.isArray(data) ? data : [];
}

export async function matchServicesForClaim(claimId: string): Promise<BackendService[]> {
  const data = await apiFetch<BackendService[]>('/api/services/match', {
    method: 'POST',
    body: JSON.stringify({ claimId }),
  });
  return Array.isArray(data) ? data : [];
}

export async function uploadDocument(file: File): Promise<BackendDocument> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<BackendDocument>('/api/documents', {
    method: 'POST',
    body: formData,
  });
}

export async function analyzeDocument(documentId: string): Promise<BackendDocument> {
  return apiFetch<BackendDocument>(`/api/documents/${documentId}/analyze`, {
    method: 'POST',
    body: JSON.stringify({ consent: true }),
  });
}

/** Rank official/API services against the worker's dossier keywords */
export function rankServicesForDossier(
  services: BackendService[],
  dossier: DossierClaim
): BackendService[] {
  const tags = new Set<string>();
  const blob = [
    dossier.category,
    dossier.categoryLabel,
    dossier.employmentStatus,
    dossier.narrativeSummary,
    dossier.verbatimTranscript,
    ...dossier.facts.map((f) => `${f.key} ${f.value}`),
  ]
    .join(' ')
    .toLowerCase();

  if (/wage|salary|unpaid|pagar/.test(blob)) tags.add('unpaid_wages');
  if (/job|lost|ended|terminat|chali/.test(blob)) tags.add('job_loss');
  if (/labour|labor|dispute/.test(blob)) tags.add('labour_dispute');
  if (/passport/.test(blob)) tags.add('passport');
  if (/visa|residenc/.test(blob)) tags.add('residency');

  return services
    .map((s) => {
      const situations = s.supported_situations || [];
      let score = 0;
      for (const tag of tags) {
        if (situations.some((x) => x.toLowerCase().includes(tag) || tag.includes(x.toLowerCase()))) {
          score += 2;
        }
      }
      const hay = `${s.title} ${s.description} ${s.category}`.toLowerCase();
      if (tags.has('unpaid_wages') && /wage|salary|complaint|labour|labor/.test(hay)) score += 2;
      if (tags.has('job_loss') && /terminat|unemployment|end-of-service|job/.test(hay)) score += 1;
      return { ...s, matchScore: score };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

export async function loadMatchedServices(dossier: DossierClaim): Promise<{
  services: BackendService[];
  source: 'api' | 'api-match' | 'empty';
  message?: string;
}> {
  try {
    if (isUuid(dossier.id)) {
      try {
        const matched = await matchServicesForClaim(dossier.id);
        if (matched.length) return { services: matched, source: 'api-match' };
      } catch (e) {
        console.warn('Service match unavailable', e);
      }
    }
    const remote = await fetchServices();
    if (remote.length) {
      return { services: rankServicesForDossier(remote, dossier), source: 'api' };
    }
    return {
      services: [],
      source: 'empty',
      message:
        "I couldn't find a sufficiently relevant service in SANAD's verified service database.",
    };
  } catch (e) {
    console.warn('Services API unavailable', e);
    return {
      services: [],
      source: 'empty',
      message: 'This service could not be retrieved from the verified knowledge base.',
    };
  }
}

export async function clarifySituation(
  text: string,
  answers: Record<string, string>
): Promise<UnderstandResult> {
  return apiFetch<UnderstandResult>('/api/ai/clarify', {
    method: 'POST',
    body: JSON.stringify({ text, answers }),
  });
}

export async function fetchBlockchainHealth(): Promise<{ mode: string; configured: boolean }> {
  return apiFetch('/api/health/blockchain');
}

export async function createApplicationApi(input: {
  service_id: string;
  credential_id?: string;
}): Promise<{ id: string; status: string; is_simulation?: boolean }> {
  return apiFetch('/api/applications', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function submitApplicationApi(applicationId: string): Promise<{ id: string; status: string }> {
  return apiFetch(`/api/applications/${applicationId}/submit`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function fetchApplications(): Promise<unknown[]> {
  const data = await apiFetch<unknown[]>('/api/applications');
  return Array.isArray(data) ? data : [];
}

export async function fetchNotifications(): Promise<unknown[]> {
  const data = await apiFetch<unknown[]>('/api/notifications');
  return Array.isArray(data) ? data : [];
}

export async function createEscalation(input: {
  subject: string;
  application_id?: string;
}): Promise<{ id: string; status: string }> {
  return apiFetch('/api/escalation', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function analysisToExtractedFacts(
  analysis: BackendAnalysis,
  confidenceFallback = 0.8
): ExtractedFact[] {
  const facts: ExtractedFact[] = Object.entries(analysis.facts || {}).map(([key, value]) => ({
    key,
    label: FACT_LABELS[key] || key.replace(/_/g, ' '),
    value: humanizeFactValue(key, value),
    isAiExtracted: true,
    confidence: analysis.confidence ?? confidenceFallback,
  }));

  if (!facts.some((f) => f.key === 'employer_response')) {
    facts.push({
      key: 'employer_response',
      label: 'Employer response',
      value: 'Unknown so far',
      isAiExtracted: true,
      confidence: 0.7,
    });
  }

  if (analysis.missing_information?.length) {
    facts.push({
      key: 'missing',
      label: 'Still needed',
      value: analysis.missing_information.join(', ').replace(/_/g, ' '),
      isAiExtracted: true,
      confidence: analysis.confidence,
    });
  }

  return facts;
}

export function analysisToDossierPatch(
  text: string,
  result: UnderstandResult,
  claimId?: string
): Partial<DossierClaim> {
  const { analysis } = result;
  const category = mapCategory(analysis.potential_categories, analysis.intent);
  const facts = analysisToExtractedFacts(analysis);
  const empRaw = analysis.facts.employment_status || 'Still employed / unclear';
  const employment = humanizeFactValue('employment_status', empRaw);
  const period =
    analysis.facts.salary_period ||
    analysis.facts.unpaid_wages_period ||
    'Period not specified yet';
  const employer = analysis.facts.employer_name || analysis.facts.employer || 'Not provided yet';
  const bullets: string[] = [];
  const empLower = empRaw.toLowerCase();
  if (empLower.includes('lost') || empLower.includes('ended') || empLower.includes('terminated')) {
    bullets.push('Your job ended');
  }
  const hasWageFact =
    Boolean(analysis.facts.unpaid_wages_period) ||
    Boolean(analysis.facts.salary_period) ||
    analysis.facts.issue === 'unpaid_wages' ||
    /unpaid|wage/i.test(analysis.facts.issue || '') ||
    (analysis.potential_categories || []).some((c) => /wage|salary/i.test(c));
  if (hasWageFact) {
    bullets.push(
      period && period !== 'Period not specified yet'
        ? `You have not received your ${period} salary`
        : 'You have not received your salary'
    );
  }
  if (employer.includes('Not provided')) {
    bullets.push("We don't yet know your employer's name");
  }
  bullets.push("We don't yet know whether your employer has responded");
  if (bullets.length === 1) {
    bullets.unshift('You described a work-related problem');
  }

  return {
    ...(claimId ? { id: claimId } : {}),
    category,
    categoryLabel: categoryLabel(category, analysis.facts),
    employmentStatus: employment,
    employerName: employer,
    incidentPeriod: period,
    claimedAmount: analysis.facts.amount || 'Amount not stated yet',
    narrativeSummary: bullets.join('. ') + '.',
    verbatimTranscript: text,
    detectedLanguages: analysis.languageSignals || [],
    facts,
    missingInformation: analysis.missing_information || [],
    aiConfidence: analysis.confidence ?? 0,
    status: 'draft',
  };
}

export function claimToDossier(claim: BackendClaim): Partial<DossierClaim> {
  const analysis: BackendAnalysis = claim.analysis || {
    intent: claim.intent || 'general_support',
    confidence: Number(claim.confidence) || 0.5,
    languageSignals: [],
    facts: claim.facts || {},
    missing_information: claim.missing_information || [],
    potential_categories: [],
  };
  return analysisToDossierPatch(claim.original_text || '', { analysis, method: 'provider' }, claim.id);
}

export function backendCredentialToLocal(
  cred: BackendCredential,
  claimSummary: string
): VerifiableCredential {
  const status =
    cred.status === 'VALID' || cred.status === 'valid'
      ? 'valid'
      : cred.status === 'REVOKED' || cred.status === 'revoked'
      ? 'revoked'
      : 'expired';
  return {
    id: cred.id,
    dossierId: cred.claim_id || '',
    subjectPseudonym: 'did:sanad:worker:protected',
    issuanceDate: cred.issued_at || new Date().toISOString(),
    status,
    claimSummary,
    merkleHash: cred.record_hash || '',
    digitalSignature: cred.transaction_hash || '',
    zkAttestation: {
      trustNode: cred.issuer || 'SANAD',
      standard: 'W3C VC Data Model 2.0',
      verifiedProperties: ['claim summary', 'issuer status'],
      piiProtected: true,
    },
  };
}

export function languageToApiCode(lang: LanguageCode): string {
  if (lang === 'bn') return 'en';
  return lang;
}

export { ApiError };
