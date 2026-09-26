import {
  DossierClaim,
  UserProfile,
  VerifiableCredential,
  ApplicationCase,
  DocumentEvidence,
  NotificationItem,
} from '../types';

/** Empty signed-out worker — no seed claims or fake credentials */
export const emptyUser: UserProfile = {
  id: '',
  name: 'Worker',
  phone: '',
  preferredLanguage: 'en',
  isGuest: true,
};

export const emptyDossier: DossierClaim = {
  id: '',
  category: 'general_grievance',
  categoryLabel: 'No situation yet',
  status: 'draft',
  employmentStatus: '',
  employerName: '',
  incidentPeriod: '',
  claimedAmount: '',
  narrativeSummary: '',
  verbatimTranscript: '',
  detectedLanguages: [],
  facts: [],
  missingInformation: [],
  aiConfidence: 0,
  createdAt: '',
  updatedAt: '',
};

export const emptyCredentials: VerifiableCredential[] = [];
export const emptyApplications: ApplicationCase[] = [];
export const emptyDocuments: DocumentEvidence[] = [];
export const emptyNotifications: NotificationItem[] = [];
