"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface ServiceCard {
  id: string;
  category: string;
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  badge: string;
  badgeColor: string;
  detail: string;
  detailIcon: string;
  ctaLabel: string;
  ctaRoute?: string;
  ctaUrl?: string;
  ctaIcon: string;
  urgent?: boolean;
}

const CATEGORIES = [
  'All (28)',
  'Labour & Wages',
  'Housing & Ejari',
  'Visas & ICP',
  'Employment & ILOE',
  'Legal Aid & Courts',
  'Health & Safety',
  'Humanitarian & SOS'
];

const SERVICE_CARDS: ServiceCard[] = [
  // 1. Labour & Wages
  {
    id: 'wages-calc',
    category: 'Labour & Wages',
    icon: 'calculate',
    title: 'Unpaid Wages & End of Service Calculation',
    titleAr: 'حساب مكافأة نهاية الخدمة والأجور المتأخرة',
    description: 'Calculate statutory gratuity, overtime dues, delayed monthly salary penalties, and unpaid leave indemnities under certified UAE labor law.',
    badge: 'Instant Calculator',
    badgeColor: 'bg-primary/10 text-primary',
    detail: 'Formula: 21 days basic salary/year (first 5 yrs) + 30 days thereafter',
    detailIcon: 'payments',
    ctaLabel: 'Open Gratuity & Wage Calculator',
    ctaRoute: '/',
    ctaIcon: 'arrow_forward',
  },
  {
    id: 'mohre-complaint',
    category: 'Labour & Wages',
    icon: 'gavel',
    title: 'MOHRE Labour Complaint & Dispute Filing',
    titleAr: 'تسجيل شكوى عمالية لدى وزارة الموارد البشرية والتوطين',
    description: 'Official Ministry of Human Resources and Emiratisation complaint route for private sector and free-zone employees facing unpaid wages or arbitrary dismissal.',
    badge: 'Official MOHRE',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    detail: 'Direct MOHRE Case Submission • 100% Free Triage',
    detailIcon: 'balance',
    ctaLabel: 'Start Labour Complaint',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'balance',
  },
  {
    id: 'wps-verification',
    category: 'Labour & Wages',
    icon: 'receipt_long',
    title: 'Wage Protection System (WPS) Audit',
    titleAr: 'فحص سجل حماية الأجور وتحويلات الرواتب المصرفية',
    description: 'Verify if your monthly salary was reported accurately through the Central Bank digital payroll system, and document wage delays past 15/30 days.',
    badge: 'Central Bank WPS',
    badgeColor: 'bg-surface text-primary font-bold',
    detail: 'Automated WPS wage statement reconciliation against contract',
    detailIcon: 'verified',
    ctaLabel: 'Audit My Salary Slips',
    ctaRoute: '/document-reader',
    ctaIcon: 'upload_file',
  },
  {
    id: 'contract-scanner',
    category: 'Labour & Wages',
    icon: 'document_scanner',
    title: 'Employment Contract Verifier & OCR Scan',
    titleAr: 'قارئ العقود الذكي وكشف الشروط غير القانونية',
    description: 'Take a photo of any physical contract or offer letter. SANAD checks for prohibited wage deductions, passport surrender terms, or unlawful penalty clauses.',
    badge: 'OCR & AI Scanner',
    badgeColor: 'bg-primary/10 text-primary',
    detail: 'Detects prohibited clauses under Federal Decree-Law No. 33',
    detailIcon: 'photo_camera',
    ctaLabel: 'Upload or Snap Document',
    ctaRoute: '/document-reader',
    ctaIcon: 'upload_file',
  },
  {
    id: 'freezone-complaint',
    category: 'Labour & Wages',
    icon: 'domain',
    title: 'Free-Zone Labour Dispute Portal',
    titleAr: 'بوابة النزاعات العمالية للمناطق الحرة (DIFC, ADGM, JAFZA)',
    description: 'Guidelines and dispute filing assistance tailored specifically for free-zone entities, technology hubs, and financial jurisdiction workers.',
    badge: 'Free Zones',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    detail: 'Specialized arbitration rules for 30+ UAE Free Zones',
    detailIcon: 'policy',
    ctaLabel: 'Free-Zone Guidance',
    ctaRoute: '/worker-rights',
    ctaIcon: 'info',
  },

  // 2. Housing & Ejari
  {
    id: 'ejari-registration',
    category: 'Housing & Ejari',
    icon: 'home_work',
    title: 'Ejari Registration & Tenancy Contract Verifier',
    titleAr: 'توثيق عقود الإيجار (إيجاري) وفحص بنود السكن',
    description: 'Verify your rental agreement on the official Land Department system, prevent unauthorized rent increases, and protect tenant occupancy rights.',
    badge: 'Housing Protection',
    badgeColor: 'bg-primary/10 text-primary',
    detail: 'RERA Rental Index Calculator & Official Ejari Verification',
    detailIcon: 'real_estate_agent',
    ctaLabel: 'Verify Rental Agreement',
    ctaRoute: '/document-reader',
    ctaIcon: 'fact_check',
  },
  {
    id: 'rental-dispute-rdc',
    category: 'Housing & Ejari',
    icon: 'gavel',
    title: 'Rental Dispute Settlement Centre (RDC)',
    titleAr: 'مركز فض المنازعات الإيجارية والدفاع ضد الإخلاء القسري',
    description: 'Legal support and dispute resolution against unlawful lockouts, utility cuts, or eviction threats by landlords without formal 12-month notarized notice.',
    badge: 'RDC Dispute',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    detail: 'Enjoin unlawful eviction • File emergency restoration petition',
    detailIcon: 'shield',
    ctaLabel: 'File Housing Grievance',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'balance',
  },
  {
    id: 'deposit-recovery',
    category: 'Housing & Ejari',
    icon: 'currency_exchange',
    title: 'Security Deposit & Maintenance Recovery',
    titleAr: 'استرداد مبالغ التأمين الإيجاري ونزاعات الصيانة',
    description: 'Step-by-step resolution for claiming full refund of security deposits and compelling landlords to perform statutory major structural repairs.',
    badge: 'Tenant Rights',
    badgeColor: 'bg-surface text-tertiary',
    detail: 'Pre-drafted statutory demand letter to landlord',
    detailIcon: 'description',
    ctaLabel: 'Generate Demand Notice',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'post_add',
  },

  // 3. Employment Protection & ILOE
  {
    id: 'iloe-insurance',
    category: 'Employment & ILOE',
    icon: 'shield_person',
    title: 'UAE Involuntary Loss of Employment (ILOE)',
    titleAr: 'التأمين ضد التعطل عن العمل (ILOE) وحساب التعويض',
    description: 'Claim up to 60% of basic monthly salary for 3 consecutive months following involuntary job termination under the statutory UAE ILOE scheme.',
    badge: 'Statutory ILOE',
    badgeColor: 'bg-primary/10 text-primary',
    detail: 'Max AED 10,000 - 20,000/month benefit for up to 3 months',
    detailIcon: 'health_and_safety',
    ctaLabel: 'Check ILOE Eligibility',
    ctaRoute: '/worker-rights',
    ctaIcon: 'security',
  },
  {
    id: 'unlawful-dismissal',
    category: 'Employment & ILOE',
    icon: 'work_off',
    title: 'Arbitrary & Unlawful Termination Compensation',
    titleAr: 'التعويض عن الفصل التعسفي وإنهاء الخدمة غير المشروع',
    description: 'Claim up to 3 months full gross wages in punitive damages if your employer terminated your employment contract in bad faith or retaliation.',
    badge: 'Court Remedy',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    detail: 'Article 47 UAE Labour Law: Up to 3 months gross salary',
    detailIcon: 'balance',
    ctaLabel: 'Claim Termination Relief',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'arrow_forward',
  },
  {
    id: 'job-transfer-right',
    category: 'Employment & ILOE',
    icon: 'transfer_within_a_station',
    title: 'Job Transfer & NOC-Free Transition',
    titleAr: 'حقوق الانتقال لعمل جديد دون موافقة الكفيل (بدون NOC)',
    description: 'Transition to a new employer safely upon notice completion or immediately if wages have been delayed past 60 days without requiring sponsor consent.',
    badge: 'Career Mobility',
    badgeColor: 'bg-surface text-primary font-bold',
    detail: 'Statutory exemption from non-compete for unpaid wages',
    detailIcon: 'check_circle',
    ctaLabel: 'Check Transfer Rights',
    ctaRoute: '/worker-rights',
    ctaIcon: 'search_check',
  },

  // 4. Visas & Residency ICP
  {
    id: 'icp-status',
    category: 'Visas & ICP',
    icon: 'badge',
    title: 'Emirates ID & Visa Status (ICP / GDRFA)',
    titleAr: 'متابعة صلاحية الإقامة والهوية الاتحادية وتصاريح العمل',
    description: 'Verify residency status, check active visa validity, track outpass issuance, and check for malicious or retaliatory runaway (absconding) notices.',
    badge: 'ICP & GDRFA',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    detail: '60 to 180-Day Grace Period Protection after Contract End',
    detailIcon: 'search_check',
    ctaLabel: 'Check Permit & Visa Status',
    ctaRoute: '/worker-rights',
    ctaIcon: 'search_check',
  },
  {
    id: 'absconding-defense',
    category: 'Visas & ICP',
    icon: 'rule',
    title: 'Cancellation of Retaliatory Absconding Reports',
    titleAr: 'إلغاء بلاغات الهروب الكيدية والدفاع العمالي',
    description: 'Dismiss bad-faith absconding circulars filed by employers while unpaid wages or labor grievances were already outstanding.',
    badge: 'Urgent Defense',
    badgeColor: 'bg-error/15 text-error font-bold',
    detail: 'MOHRE Circular Cancelation with sealed SANAD proof',
    detailIcon: 'warning',
    ctaLabel: 'Clear Absconding Notice',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'gavel',
  },
  {
    id: 'outpass-travel',
    category: 'Visas & ICP',
    icon: 'flight_takeoff',
    title: 'Emergency Travel Document & Consular Outpass',
    titleAr: 'تصريح السفر الاضطراري والعودة الآمنة للوطن',
    description: 'Assistance in obtaining emergency consular travel certificates, immigration fine waivers, and safe repatriation when passports are withheld.',
    badge: 'Consular Assistance',
    badgeColor: 'bg-primary/10 text-primary',
    detail: 'Coordinated with 18 bilateral Asian & African embassies',
    detailIcon: 'public',
    ctaLabel: 'Request Outpass Support',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'flight_takeoff',
  },

  // 5. Legal Aid & Courts
  {
    id: 'pro-bono-lawyer',
    category: 'Legal Aid & Courts',
    icon: 'balance',
    title: 'Ministry of Justice Pro-Bono Legal Aid (MOJ)',
    titleAr: 'المساعدة القانونية المجانية وتعيين محامٍ متطوع',
    description: 'Free legal representation and court advocacy by certified UAE advocates for workers and low-income individuals facing complex tribunal disputes.',
    badge: '100% Free Legal Aid',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    detail: 'No attorney fees • Zero court filing fees under AED 100,000',
    detailIcon: 'verified',
    ctaLabel: 'Connect to Pro Bono Lawyer',
    ctaRoute: '/evidence-application',
    ctaIcon: 'connect_without_contact',
  },
  {
    id: 'court-fee-exemption',
    category: 'Legal Aid & Courts',
    icon: 'money_off',
    title: 'Labour Court Fee Exemption Certificates',
    titleAr: 'شهادة الإعفاء الشامل من الرسوم القضائية للعمال',
    description: 'Automatic statutory exemption from all judicial, appeal, execution, and translation fees across UAE Federal and Local Labour Courts.',
    badge: 'Fee Waiver Law',
    badgeColor: 'bg-surface text-primary font-bold',
    detail: 'Article 10 UAE Labour Law: Total fee exemption for workers',
    detailIcon: 'check_circle',
    ctaLabel: 'Generate Fee Waiver Dossier',
    ctaRoute: '/confirm-situation',
    ctaIcon: 'verified_user',
  },

  // 6. Health & Safety
  {
    id: 'clinic-locator',
    category: 'Health & Safety',
    icon: 'local_hospital',
    title: 'Emergency Health Clinic & Walk-In Locator',
    titleAr: 'التأمين الصحي والمراكز الطبية المجانية للعمال',
    description: 'Find partner clinics that treat workers without upfront cash demands or insurance rejections. Emergency care is guaranteed for heat stress & injury.',
    badge: 'Free / Subsidized',
    badgeColor: 'bg-surface text-primary font-bold',
    detail: '34 Clinics Within Corridor • Acute Pain & Heat Stroke Walk-in',
    detailIcon: 'location_on',
    ctaLabel: 'Find Closest Worker Clinic',
    ctaRoute: '/help',
    ctaIcon: 'near_me',
  },
  {
    id: 'midday-break-safety',
    category: 'Health & Safety',
    icon: 'wb_sunny',
    title: 'Midday Work Ban & Heat Stress Protection',
    titleAr: 'حظر العمل وقت الظهيرة والسلامة المهنية من الإجهاد الحراري',
    description: 'Mandatory midday break enforcement (12:30 PM - 3:00 PM), statutory rights to cold drinking water, shaded rest shelters, and free electrolyte salts.',
    badge: 'Safety Law',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    detail: 'Whistleblower protection against employer retaliatory action',
    detailIcon: 'security',
    ctaLabel: 'Report Unsafe Conditions',
    ctaRoute: '/tell-sanad',
    ctaIcon: 'report',
  },

  // 7. Humanitarian & SOS
  {
    id: 'sos-helpline',
    category: 'Humanitarian & SOS',
    icon: 'emergency_share',
    title: '24/7 Emergency Worker Crisis Hotline & Shelter',
    titleAr: 'خط الإغاثة الطارئ 800-SANAD-SOS ومراكز الإيواء الآمنة',
    description: 'Immediate 24/7 rescue and emergency accommodation for workers facing abuse, physical confinement, withheld passports, or acute crisis.',
    badge: 'SOS Priority',
    badgeColor: 'bg-error text-on-error font-bold',
    detail: '800-SANAD-SOS (800-72623) • Multilingual Emergency Dispatch',
    detailIcon: 'phone_in_talk',
    ctaLabel: 'Immediate Emergency Rescue',
    ctaRoute: '/help',
    ctaIcon: 'emergency_share',
    urgent: true,
  },
  {
    id: 'red-crescent-aid',
    category: 'Humanitarian & SOS',
    icon: 'volunteer_activism',
    title: 'Emirates Red Crescent Emergency Food & Rent Relief',
    titleAr: 'المساعدات الإغاثية والغذائية والغذائية من الهلال الأحمر',
    description: 'Direct humanitarian relief packages, temporary living stipends, medical subsidies, and food support for distressed worker families.',
    badge: 'Humanitarian Aid',
    badgeColor: 'bg-primary/10 text-primary font-bold',
    detail: 'Partnered with Red Crescent & Community Development Authority',
    detailIcon: 'favorite',
    ctaLabel: 'Apply for Humanitarian Aid',
    ctaRoute: '/evidence-application',
    ctaIcon: 'handshake',
  }
];

const LANGUAGE_GRID = [
  { code: 'en', label: 'English', sublabel: 'Default UI', region: 'Global', dir: 'ltr' },
  { code: 'ar', label: 'العربية', sublabel: 'Arabic • فصحى ولغات محلية', region: 'Middle East', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी', sublabel: 'Hindi • आवाज और फॉर्म', region: 'South Asia', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', sublabel: 'Bengali • শ্রমিক সহায়তা', region: 'South Asia', dir: 'ltr' },
  { code: 'ur', label: 'اردو', sublabel: 'Urdu • محنت کش قانونی مدد', region: 'South Asia', dir: 'rtl' },
  { code: 'tl', label: 'Tagalog', sublabel: 'Filipino • Gabay sa Manggagawa', region: 'Southeast Asia', dir: 'ltr' },
  { code: 'ta', label: 'தமிழ்', sublabel: 'Tamil • தொழிலாளர் உரிமை', region: 'South Asia', dir: 'ltr' },
  { code: 'te', label: 'తెలుగు', sublabel: 'Telugu • కార్మికుల రక్షణ', region: 'South Asia', dir: 'ltr' },
  { code: 'ml', label: 'മലയാളം', sublabel: 'Malayalam • പ്രവാസി സഹായം', region: 'South Asia', dir: 'ltr' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', sublabel: 'Punjabi • ਮਜ਼ਦੂਰ ਅਧਿਕਾਰ', region: 'South Asia', dir: 'ltr' },
  { code: 'si', label: 'සිංහල', sublabel: 'Sinhala • සේවක සුරැකුම', region: 'South Asia', dir: 'ltr' },
  { code: 'ne', label: 'नेपाली', sublabel: 'Nepali • श्रमिक सहायता', region: 'South Asia', dir: 'ltr' },
  { code: 'fr', label: 'Français', sublabel: 'Droits des Travailleurs', region: 'Africa / Europe', dir: 'ltr' },
  { code: 'sw', label: 'Kiswahili', sublabel: 'Haki za Wafanyakazi', region: 'East Africa', dir: 'ltr' },
];

const EXTENDED_DIALECTS = [
  'አማርኛ (Amharic)', 'پښتو (Pashto)', 'Tiếng Việt', 'Bahasa Indonesia',
  'Oromoo (Oromo)', 'ትግርኛ (Tigrinya)', 'ဗမာစာ (Burmese)', 'Türkçe (Turkish)',
  'বাংলা (Sylheti)', 'کوردی (Kurdish)', 'Marwari / मारवाड़ी', 'Bhojpuri / भोजपुरी',
];

const VOICE_PRESETS = [
  { text: 'मेरा 3 महीने का पगार नहीं मिला और कंपनी छुट्टी भी नहीं दे रही...', label: 'Unpaid wage dispute (Hindi)' },
  { text: 'كفيلي حجز جواز سفري ويرفض دفع تذكرة العودة بعد انتهاء العقد...', label: 'Passport retention & return flight (Arabic)' },
  { text: 'May sakit ako pero hindi ako binibigyan ng clinic pass ng employer ko...', label: 'Medical denial grievance (Tagalog)' },
  { text: 'আমার চুক্তি অনুযায়ী বেতন দেয় নাই, অতিরিক্ত কাজ করায়...', label: 'Overtime & contract breach (Bengali)' },
];

export const WorkerDignityView: React.FC = () => {
  const { navigate, setLanguage, language, toggleSosModal } = useApp();
  const [activeCategory, setActiveCategory] = useState('All (28)');
  const [langSearch, setLangSearch] = useState('');
  const [showExtended, setShowExtended] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const filteredServices = SERVICE_CARDS.filter(card => {
    const matchesCategory = activeCategory === 'All (28)' || card.category === activeCategory;
    const matchesSearch = !searchQuery || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.titleAr.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const filteredLangs = LANGUAGE_GRID.filter(l =>
    !langSearch || l.label.toLowerCase().includes(langSearch.toLowerCase()) || l.sublabel.toLowerCase().includes(langSearch.toLowerCase())
  );

  const handleLangSelect = (code: string) => {
    setSelectedLang(code as any);
    setLanguage(code as any);
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn space-y-12">
      {/* Language Detection Banner */}
      {!bannerDismissed && (
        <div className="w-full bg-secondary-container text-on-secondary-container px-4 sm:px-8 py-3.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[19px]">translate</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 leading-snug">
                <span className="font-bold text-on-surface">Auto-Detected:</span>
                <span>Your device defaults to <strong className="text-primary font-bold">English (US)</strong>. Would you prefer this interface or your native script?</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
              <button
                onClick={() => setBannerDismissed(true)}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 shadow-sm transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">check</span> Yes, continue in English
              </button>
              <a href="#language-hub" className="px-3.5 py-1.5 rounded-lg bg-surface text-on-surface font-semibold text-xs shadow-sm hover:bg-surface-container-high transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">public</span> Change Language
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero + Omnibar */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                24+ Official UAE Government &amp; Protection Resources
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">
                Worker Dignity &amp; Multilingual Sanctuary
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
                Instant legal aid, Ejari tenancy protection, emergency housing, voice translation, and wage reconciliation. Speak naturally in your native language — we listen, protect, and advocate.
              </p>
            </div>
            {/* Quick Action Badges */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleSosModal(true)}
                className="px-4 py-2.5 rounded-xl bg-error text-on-error font-bold text-xs flex items-center gap-2 shadow-sm hover:opacity-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                <span>24/7 SOS Emergency</span>
              </button>
            </div>
          </div>

          {/* Omnibar */}
          <div className="relative bg-surface-container-low rounded-2xl p-3 sm:p-4 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-1 bg-surface rounded-xl border border-surface-container-high">
                <span className="material-symbols-outlined text-primary text-2xl">search</span>
                <input
                  className="w-full bg-transparent text-sm sm:text-base text-on-surface placeholder:text-outline focus:outline-none py-2"
                  placeholder="Search 28 UAE services, Ejari, MOHRE complaints, salary disputes, or speak naturally..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-outline-variant hover:text-on-surface p-1">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setVoiceActive(v => !v)}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all ${voiceActive ? 'bg-error text-on-error animate-pulse' : 'bg-primary text-on-primary'}`}
                >
                  <span className="material-symbols-outlined text-xl">{voiceActive ? 'stop_circle' : 'mic'}</span>
                  <span>{voiceActive ? 'Listening...' : 'Speak Naturally'}</span>
                </button>
                <button
                  onClick={() => navigate('/tell-sanad')}
                  className="px-4 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-surface-variant transition-colors"
                >
                  <span>Start Claim</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Quick intent chips */}
            <div className="mt-3 pt-3 flex flex-wrap items-center gap-2 text-xs border-t border-surface-container-high/60">
              <span className="text-on-surface-variant font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-tertiary">bolt</span> Popular:
              </span>
              {[
                { label: '💰 Unpaid Wages & EOSB', q: 'unpaid wages' },
                { label: '🏠 Ejari & Tenancy Dispute', q: 'ejari' },
                { label: '🛂 Withheld Passport Rescue', q: 'passport' },
                { label: '📄 Scan Contract OCR', q: 'contract' },
                { label: '🛡️ ILOE Unemployment Cash', q: 'iloe' },
                { label: '⚖️ Free Legal Aid (MOJ)', q: 'legal aid' }
              ].map(chip => (
                <button
                  key={chip.label}
                  onClick={() => setSearchQuery(chip.q)}
                  className="px-3 py-1 rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors border border-surface-container-high"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 28-Resource Catalog with Category Filter Tabs */}
      <section className="w-full px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Official UAE Government Resources &amp; Protections
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface mt-1">
                Comprehensive Protection Catalog
              </h2>
              <p className="text-sm text-on-surface-variant">
                Matching user situations across Labour, Housing, Visas, Legal Aid, Unemployment Insurance, and Healthcare.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant border border-surface-container-high">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Showing <strong>{filteredServices.length}</strong> active resources
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    isActive
                      ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(card => (
              <div
                key={card.id}
                className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between group border border-surface-container-high/60"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.urgent ? 'bg-error/15 text-error' : 'bg-primary/10 text-primary'}`}>
                      <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                        title="Read this card aloud"
                        onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(card.title))}
                      >
                        <span className="material-symbols-outlined text-[18px]">volume_up</span>
                      </button>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1">
                      {card.category}
                    </span>
                    <h3 className={`text-lg font-headline font-bold text-on-surface transition-colors ${card.urgent ? 'group-hover:text-error' : 'group-hover:text-primary'}`}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-outline mt-0.5" dir="rtl">{card.titleAr}</p>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                  <div className="p-3 bg-surface rounded-xl flex items-center justify-between text-xs border border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined ${card.urgent ? 'text-error text-xl' : 'text-tertiary'}`}>
                        {card.detailIcon}
                      </span>
                      <span className="text-on-surface font-medium text-[11px] sm:text-xs">
                        {card.detail}
                      </span>
                    </div>
                    {card.urgent && <span className="inline-flex h-2 w-2 rounded-full bg-error animate-ping" />}
                  </div>
                </div>
                <div className="pt-6 mt-2">
                  <button
                    onClick={() => card.ctaRoute ? navigate(card.ctaRoute) : {}}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                      card.urgent
                        ? 'bg-error text-on-error font-bold hover:opacity-90'
                        : 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {card.ctaIcon}
                    </span>
                    <span>{card.ctaLabel}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Sanctuary Banner */}
      <section className="w-full px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-surface-container-low via-surface-container to-secondary-container rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-primary/5 rounded-full pointer-events-none blur-2xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Copy & presets */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                  Universal Voice Sanctuary &amp; Dialect Freedom
                </div>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface leading-tight">
                  Speak or type naturally. Mix languages or speak your dialect freely.
                </h2>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                  No need to struggle with official English or legal jargon. Speak Hindi mixed with Punjabi, Egyptian Arabic, Taglish, Bengali, or Swahili. SANAD interprets context, emotional urgency, and labor rights principles instantly.
                </p>
                <div className="space-y-2 pt-2">
                  <span className="text-xs uppercase tracking-wider text-outline font-bold">Try saying or tapping one:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {VOICE_PRESETS.map(preset => (
                      <button
                        key={preset.text}
                        onClick={() => navigate('/tell-sanad')}
                        className="text-left p-3 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-start gap-2 shadow-sm border border-surface-container-high"
                      >
                        <span className="material-symbols-outlined text-primary text-lg shrink-0">chat_bubble</span>
                        <div>
                          <strong className="text-on-surface block font-semibold leading-snug">"{preset.text}"</strong>
                          <span className="text-outline text-[11px]">{preset.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right: Waveform card */}
              <div className="lg:col-span-5 bg-surface rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping" />
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wide">Audio Engine: Ready</span>
                  </div>
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-mono font-medium">96 Khz Multi-DSP</span>
                </div>
                <div className="py-4 px-2 bg-surface-container-low rounded-xl flex items-center justify-center gap-1.5 h-24 overflow-hidden">
                  {[8,14,20,10,16,12,6,16,10,18,8,14,6].map((h, i) => (
                    <div key={i} className={`w-1.5 rounded-full ${i % 3 === 0 ? 'bg-tertiary' : 'bg-primary'} animate-pulse`} style={{ height: `${h * 4}px`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface leading-relaxed">
                    <span className="font-bold text-primary">Microphone status:</span> Tap the button below to dictate your problem in any language. Audio is processed confidentially and never shared with employers.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/tell-sanad')}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-base">mic</span>
                      Start Audio Dictation
                    </button>
                    <button className="p-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-base">volume_up</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selector Hub */}
      <section className="w-full px-4 sm:px-6 lg:px-12" id="language-hub">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[17px]">language</span>
                Global Mother Tongue Matrix
              </div>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">Choose Your Preferred Native Language</h2>
              <p className="text-sm text-on-surface-variant">Instant, seamless switch. All legal forms, voice tools, and helpline routing immediately update.</p>
            </div>
            <div className="w-full md:w-80">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl text-xs">
                <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                <input
                  className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none"
                  placeholder="Search language or native script..."
                  value={langSearch}
                  onChange={e => setLangSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {filteredLangs.map(lang => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLangSelect(lang.code)}
                  className={`text-left p-4 rounded-xl shadow-sm hover:scale-[1.02] transition-all relative group ${isSelected ? 'bg-primary text-on-primary ring-2 ring-primary/40' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-on-primary" />
                    </span>
                  )}
                  <span className={`text-xs uppercase tracking-wider opacity-85 block mb-1 ${isSelected ? '' : 'text-tertiary font-bold'}`}>{lang.region}</span>
                  <span className="text-xl font-headline font-bold block" dir={lang.dir}>{lang.label}</span>
                  <span className={`text-xs block mt-1 ${isSelected ? 'opacity-90' : 'text-on-surface-variant'}`}>{lang.sublabel}</span>
                </button>
              );
            })}
          </div>

          {/* Extended dialects expander */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-surface-container-high">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-surface text-primary">
                <span className="material-symbols-outlined text-xl">travel_explore</span>
              </span>
              <div>
                <span className="text-sm font-bold text-on-surface block">Looking for Amharic, Pashto, Vietnamese, Indonesian, or others?</span>
                <span className="text-xs text-on-surface-variant">Over 65 regional dialects and mother tongues are supported in audio and real-time translation.</span>
              </div>
            </div>
            <button
              onClick={() => setShowExtended(e => !e)}
              className="shrink-0 px-4 py-2 rounded-xl bg-surface hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm border border-surface-container-high"
            >
              <span>{showExtended ? 'Hide Dialects' : 'Show All 65+ Dialects'}</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${showExtended ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
          </div>

          {showExtended && (
            <div className="bg-surface-container p-6 rounded-2xl space-y-4 animate-fadeIn">
              <div className="text-xs uppercase tracking-wider font-bold text-primary">Extended Dialect Directory</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs text-on-surface">
                {EXTENDED_DIALECTS.map(d => (
                  <span key={d} className="p-2.5 rounded-lg bg-surface font-medium">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
