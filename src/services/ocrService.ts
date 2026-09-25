import { DocumentEvidence } from '../types';

export interface OcrResult {
  extractedFields: Record<string, string>;
  prohibitedClauses: string[];
  confidence: number;
  documentType: 'salary_slip' | 'contract' | 'passport' | 'other';
  summary: string;
}

export const processDocumentOcr = async (
  fileName: string,
  _fileData?: string
): Promise<OcrResult> => {
  // Simulate OCR latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lower = fileName.toLowerCase();

  if (lower.includes('salary') || lower.includes('wps') || lower.includes('slip') || lower.includes('pay')) {
    return {
      documentType: 'salary_slip',
      confidence: 0.96,
      summary: 'August 2026 WPS Electronic Payroll Slip. Confirms registered basic wage of AED 3,200 and housing allowance of AED 1,650 (Total AED 4,850). Status flagged non-remitted.',
      extractedFields: {
        'Employer Entity': 'Al-Noor Contracting LLC',
        'Worker Name': 'Rashid Khan',
        'Registered Base Wage': 'AED 3,200',
        'Designated Allowances': 'AED 1,650',
        'Total Expected Remittance': 'AED 4,850',
        'Transaction Status': 'Rejected / Return Code 402 (Unpaid)',
        'Payment Cycle': 'August 2026 (01/08/2026 - 31/08/2026)',
        'WPS Routing Hash': 'WPS-9921-AE-8842'
      },
      prohibitedClauses: []
    };
  }

  // Contract analysis
  return {
    documentType: 'contract',
    confidence: 0.94,
    summary: 'Standard Ministry of Human Resources & Emiratisation (MOHRE) Labour Contract. Duration: 2 years limited. Contains 1 prohibited passport retention clause.',
    extractedFields: {
      'Contract Registration No.': 'MOL-993-2022',
      'First Party (Employer)': 'Al-Noor Contracting LLC',
      'Second Party (Worker)': 'Rashid Khan',
      'Job Title': 'Structural Mason / Team Lead',
      'Basic Monthly Salary': 'AED 3,200',
      'Accommodation Allowance': 'Company Provided or AED 1,000',
      'Notice Period': '30 Calendar Days',
      'Probation Period': 'Completed (Past 6 Months)'
    },
    prohibitedClauses: [
      '⚠️ Unlawful Clause 14: "Worker agrees to surrender physical passport to company HR for visa security." — Void under Ministerial Decree 267 of 2015.',
      '⚠️ Penalty Clause 19: "Company reserves right to deduct 2 days pay for minor defects without tribunal consent." — Void under Federal Decree-Law No. 33 Art. 25.'
    ]
  };
};

export const createDocumentEvidence = (
  name: string,
  ocrResult: OcrResult
): DocumentEvidence => {
  return {
    id: `doc_${Date.now()}`,
    name,
    type: ocrResult.documentType,
    sha256: `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    fileSize: `${(1.2 + Math.random() * 2.3).toFixed(1)} MB`,
    ocrExtractedData: ocrResult.extractedFields,
    prohibitedClausesFound: ocrResult.prohibitedClauses,
    status: 'verified'
  };
};
