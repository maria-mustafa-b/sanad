import { 
  DossierClaim, 
  VerifiableCredential, 
  SupportOrganization, 
  ApplicationCase, 
  DocumentEvidence, 
  NotificationItem, 
  RightsArticle,
  UserProfile 
} from '../types';

export const mockUser: UserProfile = {
  id: 'usr_demo_8842',
  name: 'Rashid Khan',
  phone: '+971 50 123 4567',
  preferredLanguage: 'en',
  nationality: 'South Asian Migrant Worker',
  isGuest: true,
};

export const preloadedDossier: DossierClaim = {
  id: 'SND-2024-8842-DXB',
  category: 'unpaid_wages',
  categoryLabel: 'Unpaid Wages & Withheld Documents',
  status: 'proof_generated',
  employmentStatus: 'Recently ended',
  employerName: 'Al-Noor Contracting LLC',
  incidentPeriod: 'August 2026 (42-day non-remittance)',
  claimedAmount: 'AED 4,850',
  narrativeSummary: 'Worker was employed for 18 months at Al-Noor Contracting LLC. Employment was concluded in August 2026. The final monthly wage of AED 4,850 and statutory end-of-service gratuity remain unpaid past 42 days. Furthermore, the company HR has retained the original passport and has not provided return repatriation ticketing.',
  verbatimTranscript: '',
  detectedLanguages: ['Hindi', '', 'English legal intent'],
  facts: [
    { key: 'employment_status', label: 'Employment Status', value: 'Recently ended', isAiExtracted: true, confidence: 0.98 },
    { key: 'primary_issue', label: 'Primary Issue Reported', value: 'Unpaid wages & non-settlement', isAiExtracted: true, confidence: 0.99 },
    { key: 'period', label: 'Incident Period', value: 'August 2026 (42 days delayed)', isAiExtracted: true, confidence: 0.96 },
    { key: 'employer', label: 'Reported Employer', value: 'Al-Noor Contracting LLC', isAiExtracted: true, confidence: 0.95 },
    { key: 'passport', label: 'Document Withholding', value: 'Passport retained by sponsor', isAiExtracted: true, confidence: 0.94 },
    { key: 'amount', label: 'Claimed Unpaid Balance', value: 'AED 4,850 + statutory severance', isAiExtracted: true, confidence: 0.92 },
  ],
  createdAt: '2026-09-25T14:32:00Z',
  updatedAt: '2026-09-25T15:10:00Z',
};

export const preloadedCredential: VerifiableCredential = {
  id: 'SANAD-VC-00124',
  dossierId: 'SND-2024-8842-DXB',
  subjectPseudonym: 'did:sanad:worker:ae82-994f-712b',
  issuanceDate: '2026-09-25',
  status: 'valid',
  claimSummary: 'Unpaid wages (August 2026) & recently ended employment with withheld passport attestation',
  merkleHash: '0x9e12bf4097f519c288d30e386ab7210e7ccb0a991f80312014168ad08291a84f',
  digitalSignature: 'edsig:z3mKx8U2vNP819...QW3pLo892NZa',
  zkAttestation: {
    trustNode: 'SANAD Independent Sovereign Trust Root Node',
    standard: 'W3C Verifiable Credentials Data Model v2.0 (Selective Disclosure)',
    verifiedProperties: [
      'Grievance Category: Wage Non-Payment Verified',
      'Employment Existence: Ministry Contract Hash Verified',
      'Worker Attestation: Sealed Without PII Leakage',
      'Revocation Status: Active on Merkle Accumulator'
    ],
    piiProtected: true,
  },
  rawJson: JSON.stringify({
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": "urn:uuid:sanad-vc-00124",
    "type": ["VerifiableCredential", "WorkerRightsAttestation"],
    "issuer": "did:sanad:node:authority-independent-uae",
    "issuanceDate": "2026-09-25T15:10:00Z",
    "credentialSubject": {
      "id": "did:sanad:worker:ae82-994f-712b",
      "claim": "Unpaid wages & recently ended employment",
      "claimPeriod": "August 2026",
      "confirmationType": "User Confirmed Attestation",
      "evidenceHash": "sha256:8f3c442291a27e81"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2026-09-25T15:10:00Z",
      "verificationMethod": "did:sanad:node:authority-independent-uae#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSI...9xZ"
    }
  }, null, 2)
};

export const supportOrganizations: SupportOrganization[] = [
  {
    id: 'org_migrant_legal',
    name: 'Migrant Justice Legal Clinic (مركز العدالة العمالية)',
    type: 'legal_aid',
    supportedCategories: ['unpaid_wages', 'contract_violation', 'passport_withholding'],
    languages: ['en', 'ar', 'hi', 'ur', 'bn'],
    region: 'Gulf & Middle East Corridors',
    hotline: '+971 800 53425',
    turnaroundTime: '< 15 mins triage',
    feePolicy: '100% Free Pro Bono for Workers',
    description: 'Specialized labour court advocacy, wage protection dispute filings, and statutory severance recovery with zero legal fees.',
  },
  {
    id: 'org_worker_shelter',
    name: 'Dignity Worker Shelter & Human Sanctuary (مأوى الكرامة الآمن)',
    type: 'shelter',
    supportedCategories: ['passport_withholding', 'general_grievance', 'medical_denial'],
    languages: ['en', 'ar', 'hi', 'ur', 'bn'],
    region: 'Dubai, Sharjah & Northern Emirates',
    hotline: '800-SANAD-SOS (Option 2)',
    turnaroundTime: 'Immediate 24/7 Dispatch',
    feePolicy: 'Free Safe Housing & Meals',
    description: 'Crisis emergency shelter, medical assistance, embassy liaison, and safe repatriation for workers facing abuse or passport retention.',
  },
  {
    id: 'org_consulate_liaison',
    name: 'South Asian Bilateral Worker Mission (بعثة رعاية العمالة)',
    type: 'consulate',
    supportedCategories: ['passport_withholding', 'unpaid_wages', 'work_permit_issue'],
    languages: ['hi', 'ur', 'bn', 'en'],
    region: 'Bilateral Consular Section',
    hotline: '+971 4 397 1222',
    turnaroundTime: '24-48 Hours',
    feePolicy: 'Free Consular Attestation',
    description: 'Emergency travel certificates, outpass processing, and diplomatic pressure on sponsor companies refusing passport return.',
  }
];

export const preloadedApplication: ApplicationCase = {
  id: 'APP-2026-9912',
  dossierId: 'SND-2024-8842-DXB',
  credentialId: 'SANAD-VC-00124',
  orgId: 'org_migrant_legal',
  orgName: 'Migrant Justice Legal Clinic',
  title: 'August Unpaid Salary & Repatriation Assistance',
  category: 'unpaid_wages',
  status: 'advocate_assigned',
  submittedDate: '2026-09-25T16:00:00Z',
  lastUpdated: '2026-09-25T18:45:00Z',
  notes: 'Volunteer advocate Fatima Al-Hashemi assigned. WPS digital payroll statement verified against MOL registration. Pre-filing notice dispatched to employer.',
  timeline: [
    { title: 'Case Intake & SANAD Proof Sealed', date: '25 Sep 2026, 15:10', completed: true, description: 'Tamper-evident W3C credential generated and signed.' },
    { title: 'Triage & Independent Verification', date: '25 Sep 2026, 16:30', completed: true, description: 'Zero-knowledge verification confirmed claim authenticity.' },
    { title: 'Pro Bono Legal Advocate Assigned', date: '25 Sep 2026, 18:45', completed: true, current: true, description: 'Advocate Fatima reviewing WPS wage slip discrepancy.' },
    { title: 'Formal Employer Mediation Hearing', date: 'Upcoming (28 Sep 2026)', completed: false, description: 'Amicable settlement meeting scheduled with labour tribunal.' },
    { title: 'Wage Recovery & Passport Release', date: 'Pending Resolution', completed: false, description: 'Execution of settlement cheque and safe exit pass.' },
  ]
};

export const preloadedDocuments: DocumentEvidence[] = [
  {
    id: 'doc_wps_slip',
    name: 'August 2026 Bank Salary Statement (WPS Slip)',
    type: 'salary_slip',
    sha256: '8f3c442291a27e81...291a',
    uploadDate: '25 Sep 2026',
    fileSize: '1.2 MB',
    status: 'verified',
    ocrExtractedData: {
      employer: 'Al-Noor Contracting LLC',
      employeeName: 'Rashid Khan',
      expectedWage: 'AED 4,850',
      statusReported: 'Unpaid / Returned Non-Remitted',
      period: '01/08/2026 - 31/08/2026'
    }
  },
  {
    id: 'doc_contract_mol',
    name: 'Ministry Standard Labour Contract (MOL-993-2022)',
    type: 'contract',
    sha256: 'e17b892fca12093...77ba',
    uploadDate: '25 Sep 2026',
    fileSize: '3.4 MB',
    status: 'verified',
    ocrExtractedData: {
      contractNumber: 'MOL-993-2022',
      jobTitle: 'Structural Mason / Team Lead',
      basicSalary: 'AED 3,200',
      allowances: 'AED 1,650 (Housing & Food)',
      noticePeriod: '30 Days Guaranteed'
    },
    prohibitedClausesFound: [
      'Prohibited Article: Clause 14 mentions passport surrender for visa safekeeping (Illegal under Federal Labour Law Art. 13)',
      'Arbitrary Deduction: Overtime penalty clause void under statutory regulations'
    ]
  }
];

export const preloadedNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Caseworker Assigned to Your Dossier',
    message: 'Fatima Al-Hashemi from Migrant Justice Legal Clinic has taken up your unpaid wage claim SND-2024-8842-DXB.',
    category: 'case_update',
    timestamp: '2 hours ago',
    read: false,
    relatedRoute: '/applications',
  },
  {
    id: 'notif_2',
    title: 'Verifiable Proof SANAD-VC-00124 Issued',
    message: 'Your situation statement has been cryptographically sealed. You can now present this proof to any support partner.',
    category: 'security',
    timestamp: '4 hours ago',
    read: false,
    relatedRoute: '/my-proof',
  },
  {
    id: 'notif_3',
    title: 'Heat Stress Advisory & Midday Break Rules',
    message: 'Learn about mandatory midday rest hours and your legal right to water, electrolytes, and shaded rest periods.',
    category: 'rights',
    timestamp: '1 day ago',
    read: true,
    relatedRoute: '/worker-rights',
  },
];

export const rightsArticles: RightsArticle[] = [
  {
    id: 'unpaid-wages',
    category: 'Wages & Severance',
    title: 'Delayed Salaries & End-of-Service Gratuity (EOSB)',
    summary: 'Everything you need to know about the Wage Protection System (WPS), penalties for late payment, and calculating severance pay.',
    arabicTitle: 'الأجور المتأخرة وحساب مكافأة نهاية الخدمة',
    keyPoints: [
      'Employers must pay wages within 10 days of the due date through certified digital payroll (WPS).',
      'After 15 days of delay, employer permits are suspended; after 30 days, legal proceedings commence without court fees.',
      'End of service gratuity is calculated as 21 days basic wage per year for the first 5 years, and 30 days for each additional year.',
      'Employers cannot make arbitrary salary deductions for uniform, visa expenses, or normal wear-and-tear of equipment.'
    ],
    legalReference: 'UAE Federal Decree-Law No. 33 of 2021 (Articles 22, 51 & 54)',
    faqs: [
      {
        question: 'What if my employer claims business was slow and promises to pay later?',
        answer: 'Economic slowdown is legally not a valid reason to withhold wages. You are entitled to immediate filing without risking your residency status.'
      },
      {
        question: 'Do I have to pay legal fees to file a claim in the Labour Court?',
        answer: 'No. Labor claims by workers for amounts under AED 100,000 are 100% exempt from all judicial and court fees at all stages.'
      }
    ]
  },
  {
    id: 'passport-withholding',
    category: 'Personal Freedom',
    title: 'Passport Retention & Travel Document Freedom',
    summary: 'Your passport is personal property. It is strictly unlawful for sponsors, employers, or recruiters to withhold your passport.',
    arabicTitle: 'حظر حجز جواز السفر والوثائق الرسمية',
    keyPoints: [
      'Employers cannot legally confiscate or hold your passport for "safekeeping" without your explicit written request.',
      'Retaining a worker’s passport carries heavy financial penalties and criminal referral for the offending employer.',
      'You are entitled to keep your passport, national ID card, and health insurance card at all times.',
      'If your passport is withheld, SANAD can connect you to emergency consular and police dispatch for immediate retrieval.'
    ],
    legalReference: 'Ministerial Directive No. 267 of 2015 & Judicial Court Precedents',
    faqs: [
      {
        question: 'My contract has a clause saying I agreed to hand over my passport. Is that binding?',
        answer: 'No. Any contract clause requiring passport surrender is automatically null and void under labor statutes, even if you signed it.'
      },
      {
        question: 'How fast can I get my passport back through an emergency grievance?',
        answer: 'Police and labour inspection teams typically issue an urgent return notice within 24 to 48 hours.'
      }
    ]
  },
  {
    id: 'heat-stress-safety',
    category: 'Workplace Safety',
    title: 'Heat Stress Protection & Safe Working Conditions',
    summary: 'Statutory protections against summer heat, dehydration, and unsafe construction or domestic conditions.',
    arabicTitle: 'حظر العمل وقت الظهيرة والوقاية من الإجهاد الحراري',
    keyPoints: [
      'Mandatory midday work ban between 12:30 PM and 3:00 PM during peak summer months for all outdoor laborers.',
      'Employers must provide shaded rest stations, clean cold drinking water, electrolyte salts, and first-aid kits on-site.',
      'Workers have the legal right to stop work immediately if they detect imminent danger to life or health without retaliation.',
      'Emergency medical treatment for heat exhaustion or workplace injury is free by law.'
    ],
    legalReference: 'Occupational Safety and Health Standards & Annual Midday Work Ban Regulations',
    faqs: [
      {
        question: 'Can my company fire me if I report unsafe scaffoldings or heat exhaustion?',
        answer: 'No. Retaliatory termination for safety whistleblowing is illegal and qualifies for up to 3 months punitive compensation.'
      }
    ]
  },
  {
    id: 'contracts-absconding',
    category: 'Contracts & Visas',
    title: 'Job Transfers & Defending Unlawful Absconding Claims',
    summary: 'How to transition to a new job legally and clear malicious runaway/absconding notices filed by bad-faith sponsors.',
    arabicTitle: 'الانتقال لعمل جديد وإلغاء بلاغات الهروب الكيدية',
    keyPoints: [
      'Workers can change jobs upon completion of notice period without requiring an NOC (No Objection Certificate) from previous employer.',
      'If wages have been unpaid for over 60 days, workers can transfer immediately without notice or penalty.',
      'Malicious absconding notices filed while wages are owed can be cancelled at the Ministry with wage proof (like your SANAD dossier).',
      'Workers are granted a 60 to 180 day grace period upon contract termination to find new employment or depart safely.'
    ],
    legalReference: 'Labour Law Implementing Regulations, Article 29 & Ministry Grievance Procedures',
    faqs: [
      {
        question: 'What should I do if my boss threatens to put an absconding ban on me because I asked for salary?',
        answer: 'Immediately record your complaint in SANAD to create a time-stamped proof of wage claim. A wage dispute record proves the absconding notice was retaliatory and gets it dismissed.'
      }
    ]
  }
];


