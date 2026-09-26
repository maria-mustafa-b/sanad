import { DossierClaim, ExtractedFact, GrievanceCategory, LanguageCode } from '../types';
import { analyzeCodeSwitching } from './speechService';

export interface StructuringResult {
  category: GrievanceCategory;
  categoryLabel: string;
  employmentStatus: string;
  employerName: string;
  incidentPeriod: string;
  claimedAmount: string;
  narrativeSummary: string;
  facts: ExtractedFact[];
  confidence: number;
  plainBullets: string[];
  empatheticResponse: {
    nativeText: string;
    englishSynopsis: string;
  };
}

/** Simple plain-language bullets for the worker confirmation screen */
export const buildPlainSituationBullets = (input: {
  employmentStatus: string;
  category: GrievanceCategory;
  incidentPeriod: string;
  employerName: string;
  rawText?: string;
}): string[] => {
  const lower = (input.rawText || '').toLowerCase();
  const bullets: string[] = [];

  const jobEnded =
    /chali gayi|job loss|terminated|ended|fired|left job|naukri/.test(lower) ||
    /ended|terminated/i.test(input.employmentStatus);

  if (jobEnded) {
    bullets.push('Your job ended');
  }

  if (
    input.category === 'unpaid_wages' ||
    /salary|pagar|wages|nahi mila|nahi mil/.test(lower)
  ) {
    if (/august|अगस्त|أغسطس/.test(lower) || /august/i.test(input.incidentPeriod)) {
      bullets.push('You have not received your August salary');
    } else {
      bullets.push('You have not received your salary');
    }
  }

  if (input.employerName.includes('Not Provided') || !input.employerName) {
    bullets.push("We don't yet know your employer's name");
  }

  bullets.push("We don't yet know whether your employer has responded");

  if (bullets.length === 1) {
    bullets.unshift('You described a work-related problem');
  }

  return bullets;
};

export const structureWorkerNarrative = async (
  rawText: string,
  userLanguage: LanguageCode
): Promise<StructuringResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const lower = rawText.toLowerCase();
  const analysis = analyzeCodeSwitching(rawText);

  let category: GrievanceCategory = 'general_grievance';
  let categoryLabel = 'Work-related problem';

  const mentionsWage =
    lower.includes('salary') ||
    lower.includes('pagar') ||
    lower.includes('पगार') ||
    lower.includes('বেতন') ||
    lower.includes('أجر') ||
    lower.includes('راتب') ||
    lower.includes('wages') ||
    lower.includes('nahi mila') ||
    lower.includes('nahi mil');
  const mentionsJobLoss =
    lower.includes('job chali') ||
    lower.includes('chali gayi') ||
    lower.includes('job loss') ||
    lower.includes('terminated') ||
    lower.includes('fired') ||
    lower.includes('left job') ||
    lower.includes('naukri');

  if (mentionsWage || mentionsJobLoss) {
    category = 'unpaid_wages';
    categoryLabel =
      mentionsJobLoss && mentionsWage
        ? 'Job ended + unpaid wages'
        : mentionsWage
        ? 'Unpaid wages'
        : 'Job ended';
  } else if (
    lower.includes('passport') ||
    lower.includes('جواز') ||
    lower.includes('पासपोर्ट') ||
    lower.includes('পাসপোর্ট')
  ) {
    category = 'passport_withholding';
    categoryLabel = 'Passport held by employer';
  } else if (
    lower.includes('contract') ||
    lower.includes('عقد') ||
    lower.includes('अनुबंध') ||
    lower.includes('চুক্তি')
  ) {
    category = 'contract_violation';
    categoryLabel = 'Contract problem';
  } else if (
    lower.includes('clinic') ||
    lower.includes('hospital') ||
    lower.includes('sick') ||
    lower.includes('طبيب') ||
    lower.includes('علاج')
  ) {
    category = 'medical_denial';
    categoryLabel = 'Medical care denied';
  } else if (
    lower.includes('visa') ||
    lower.includes('iqama') ||
    lower.includes('إقامة') ||
    lower.includes('absconding')
  ) {
    category = 'work_permit_issue';
    categoryLabel = 'Visa / work permit issue';
  }

  let employerName = 'Not provided yet';
  if (lower.includes('al-noor') || lower.includes('al noor')) {
    employerName = 'Al-Noor Contracting LLC';
  } else if (
    lower.includes('company') ||
    lower.includes('شركة') ||
    lower.includes('कंपनी') ||
    lower.includes('কোম্পানি')
  ) {
    employerName = 'Employer (spoken about, name unclear)';
  }

  let incidentPeriod = 'Period not specified yet';
  if (lower.includes('august') || lower.includes('أغسطس') || lower.includes('अगस्त') || lower.includes('আগস্ট')) {
    incidentPeriod = 'August';
  } else if (
    lower.includes('2 months') ||
    lower.includes('3 months') ||
    lower.includes('दो महीने') ||
    lower.includes('৩ মাস') ||
    lower.includes('شهرين')
  ) {
    incidentPeriod = 'About 2–3 months';
  }

  let claimedAmount = 'Amount not stated yet';
  const amountMatch = rawText.match(/(\d+[\d,]*)\s*(aed|dirham|rs|rupees|টাকা|درهم)?/i);
  if (amountMatch) {
    claimedAmount = `AED ${amountMatch[1]}`;
  }

  let employmentStatus = 'Still employed / unclear';
  if (
    mentionsJobLoss ||
    lower.includes('left') ||
    lower.includes('ended') ||
    lower.includes('terminated') ||
    lower.includes('chhod') ||
    lower.includes('نهاية') ||
    lower.includes('چھوڑ')
  ) {
    employmentStatus = 'Job ended';
  }

  const plainBullets = buildPlainSituationBullets({
    employmentStatus,
    category,
    incidentPeriod,
    employerName,
    rawText,
  });

  const facts: ExtractedFact[] = [
    {
      key: 'employment_status',
      label: 'Job status',
      value: employmentStatus,
      isAiExtracted: true,
      confidence: 0.96,
    },
    {
      key: 'primary_issue',
      label: 'Main issue',
      value: categoryLabel,
      isAiExtracted: true,
      confidence: 0.98,
    },
    {
      key: 'employer',
      label: 'Employer',
      value: employerName,
      isAiExtracted: true,
      confidence: employerName.includes('Not') ? 0.7 : 0.94,
    },
    {
      key: 'period',
      label: 'When',
      value: incidentPeriod,
      isAiExtracted: true,
      confidence: 0.92,
    },
    {
      key: 'amount',
      label: 'Amount',
      value: claimedAmount,
      isAiExtracted: true,
      confidence: claimedAmount.includes('not') ? 0.75 : 0.91,
    },
    {
      key: 'employer_response',
      label: 'Employer response',
      value: 'Unknown so far',
      isAiExtracted: true,
      confidence: 0.85,
    },
  ];

  if (category === 'passport_withholding' || lower.includes('passport') || lower.includes('جواز')) {
    facts.push({
      key: 'document_withheld',
      label: 'Document held',
      value: 'Passport held by employer',
      isAiExtracted: true,
      confidence: 0.97,
    });
  }

  const responsesByLang: Record<LanguageCode, { nativeText: string; englishSynopsis: string }> = {
    en: {
      nativeText:
        'We listened carefully. It sounds like your job ended and your August salary was not paid. Please check if we understood correctly.',
      englishSynopsis: 'Job ended + unpaid August wages. Ready for you to confirm.',
    },
    ar: {
      nativeText:
        'استمعنا إليك بعناية. يبدو أن عملك انتهى ولم تستلم راتب أغسطس. تأكد معنا إن كان هذا صحيحاً.',
      englishSynopsis: 'Job ended + unpaid August wages. Ready for you to confirm.',
    },
    hi: {
      nativeText:
        'हमने आपकी बात समझ ली: आपकी नौकरी चली गई और अगस्त का वेतन नहीं मिला। कृपया जाँचें कि हमने सही समझा।',
      englishSynopsis: 'Job ended + unpaid August wages. Ready for you to confirm.',
    },
    ur: {
      nativeText:
        'ہم نے آپ کی بات سمجھ لی: آپ کی نوکری ختم ہو گئی اور اگست کی تنخواہ نہیں ملی۔ براہ کرم تصدیق کریں۔',
      englishSynopsis: 'Job ended + unpaid August wages. Ready for you to confirm.',
    },
    bn: {
      nativeText:
        'আমরা বুঝেছি: আপনার চাকরি শেষ হয়েছে এবং আগস্টের বেতন পাননি। অনুগ্রহ করে নিশ্চিত করুন।',
      englishSynopsis: 'Job ended + unpaid August wages. Ready for you to confirm.',
    },
  };

  const empatheticResponse = responsesByLang[userLanguage] || responsesByLang.en;

  const narrativeSummary = plainBullets.join('. ') + '.';

  return {
    category,
    categoryLabel,
    employmentStatus,
    employerName,
    incidentPeriod,
    claimedAmount,
    narrativeSummary,
    facts,
    confidence: analysis.confidence,
    plainBullets,
    empatheticResponse,
  };
};

export const getSituationBulletsFromDossier = (dossier: DossierClaim): string[] =>
  buildPlainSituationBullets({
    employmentStatus: dossier.employmentStatus,
    category: dossier.category,
    incidentPeriod: dossier.incidentPeriod,
    employerName: dossier.employerName,
    rawText: dossier.verbatimTranscript,
  });
