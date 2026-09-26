export type LanguageCode = 'en' | 'ar' | 'hi' | 'ur' | 'bn';

export type TextScale = 'normal' | 'large' | 'xlarge';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  preferredLanguage: LanguageCode;
  nationality?: string;
  isGuest: boolean;
}

export interface ExtractedFact {
  key: string;
  label: string;
  value: string;
  isAiExtracted: boolean;
  confidence: number;
}

export type GrievanceCategory = 
  | 'unpaid_wages'
  | 'passport_withholding'
  | 'contract_violation'
  | 'medical_denial'
  | 'work_permit_issue'
  | 'general_grievance';

export interface DossierClaim {
  id: string;
  category: GrievanceCategory;
  categoryLabel: string;
  status: 'draft' | 'confirmed' | 'proof_generated' | 'submitted';
  employmentStatus: string;
  employerName: string;
  incidentPeriod: string;
  claimedAmount: string;
  narrativeSummary: string;
  verbatimTranscript: string;
  detectedLanguages: string[];
  facts: ExtractedFact[];
  missingInformation: string[];
  aiConfidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface VerifiableCredential {
  id: string; // e.g. "SANAD-VC-00124"
  dossierId: string;
  subjectPseudonym: string; // e.g. "did:sanad:worker:ae82...994f"
  issuanceDate: string;
  status: 'valid' | 'revoked' | 'expired';
  claimSummary: string;
  merkleHash: string;
  digitalSignature: string;
  zkAttestation: {
    trustNode: string;
    standard: string;
    verifiedProperties: string[];
    piiProtected: boolean;
  };
  rawJson?: string;
}

export interface SupportOrganization {
  id: string;
  name: string;
  type: 'ngo' | 'legal_aid' | 'consulate' | 'shelter';
  supportedCategories: GrievanceCategory[];
  languages: LanguageCode[];
  region: string;
  hotline: string;
  turnaroundTime: string;
  feePolicy: string;
  description: string;
}

export interface TimelineStep {
  title: string;
  date: string;
  completed: boolean;
  current?: boolean;
  description?: string;
}

export interface ApplicationCase {
  id: string;
  dossierId: string;
  credentialId: string;
  orgId: string;
  orgName: string;
  title: string;
  category: GrievanceCategory;
  status: 'submitted' | 'triaged' | 'evidence_reviewed' | 'advocate_assigned' | 'in_progress' | 'resolved';
  submittedDate: string;
  lastUpdated: string;
  notes: string;
  timeline: TimelineStep[];
}

export interface DocumentEvidence {
  id: string;
  name: string;
  type: 'salary_slip' | 'contract' | 'passport' | 'chat_log' | 'other';
  sha256: string;
  uploadDate: string;
  fileSize: string;
  ocrExtractedData?: Record<string, string>;
  prohibitedClausesFound?: string[];
  status: 'processing' | 'verified' | 'unverified';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'system' | 'case_update' | 'security' | 'rights';
  timestamp: string;
  read: boolean;
  relatedRoute?: string;
}

export interface RightsArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  arabicTitle?: string;
  keyPoints: string[];
  legalReference: string;
  faqs: { question: string; answer: string }[];
}
