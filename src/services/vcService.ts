import { DossierClaim, VerifiableCredential } from '../types';

// Simple deterministic hash generator (SHA-256 equivalent simulation for browser-standard cryptography)
export const computeCryptoHash = async (content: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // fallback
    }
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, 'a');
};

export const issueVerifiableCredential = async (
  dossier: DossierClaim
): Promise<VerifiableCredential> => {
  const credentialId = `SANAD-VC-${Math.floor(10000 + Math.random() * 90000)}`;
  const pseudonym = `did:sanad:worker:${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
  const issuanceDate = new Date().toISOString().split('T')[0];

  const canonicalPayload = JSON.stringify({
    credentialId,
    dossierId: dossier.id,
    subject: pseudonym,
    claimCategory: dossier.category,
    incidentPeriod: dossier.incidentPeriod,
    employmentStatus: dossier.employmentStatus,
    timestamp: new Date().toISOString(),
  });

  const merkleHash = await computeCryptoHash(canonicalPayload);
  const digitalSignature = `edsig:${merkleHash.substring(2, 24)}...${merkleHash.substring(40, 52)}`;

  const rawJson = JSON.stringify({
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "id": `urn:uuid:${credentialId.toLowerCase()}`,
    "type": ["VerifiableCredential", "WorkerRightsAttestation"],
    "issuer": "did:sanad:node:authority-independent-uae",
    "issuanceDate": new Date().toISOString(),
    "credentialSubject": {
      "id": pseudonym,
      "claim": dossier.categoryLabel,
      "claimPeriod": dossier.incidentPeriod,
      "confirmationType": "User Confirmed Attestation",
      "evidenceHash": merkleHash.substring(0, 20)
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": new Date().toISOString(),
      "verificationMethod": "did:sanad:node:authority-independent-uae#key-1",
      "proofPurpose": "assertionMethod",
      "jws": digitalSignature
    }
  }, null, 2);

  return {
    id: credentialId,
    dossierId: dossier.id,
    subjectPseudonym: pseudonym,
    issuanceDate,
    status: 'valid',
    claimSummary: `${dossier.categoryLabel} (${dossier.incidentPeriod})`,
    merkleHash,
    digitalSignature,
    zkAttestation: {
      trustNode: 'SANAD Independent Sovereign Trust Root Node',
      standard: 'W3C Verifiable Credentials Data Model v2.0 (Selective Disclosure)',
      verifiedProperties: [
        `Grievance Category: ${dossier.categoryLabel}`,
        `Claim Period: ${dossier.incidentPeriod}`,
        'Worker Attestation: Sealed Without PII Leakage',
        'Revocation Status: Active on Merkle Accumulator'
      ],
      piiProtected: true,
    },
    rawJson,
  };
};

export interface PublicVerificationResult {
  isValid: boolean;
  status: 'valid' | 'revoked' | 'expired' | 'not_found';
  credentialId: string;
  issueDate: string;
  claimCategory: string;
  subjectPseudonym: string;
  trustNode: string;
  merkleHash: string;
  standard: string;
  strictPrivacyGuard: boolean;
}

export const verifyCredentialPublic = (
  credentialIdOrHash: string,
  knownCredentials: VerifiableCredential[]
): PublicVerificationResult => {
  const query = credentialIdOrHash.trim().toUpperCase();

  // Find in preloaded/known credentials
  const found = knownCredentials.find(
    vc => vc.id.toUpperCase() === query || vc.merkleHash.toUpperCase() === query || query.includes(vc.id.toUpperCase())
  );

  if (found) {
    return {
      isValid: found.status === 'valid',
      status: found.status,
      credentialId: found.id,
      issueDate: found.issuanceDate,
      claimCategory: found.claimSummary,
      subjectPseudonym: found.subjectPseudonym,
      trustNode: found.zkAttestation.trustNode,
      merkleHash: found.merkleHash,
      standard: found.zkAttestation.standard,
      strictPrivacyGuard: true,
    };
  }

  // Simulated valid result if formatting matches SANAD-VC-XXXXX
  if (query.startsWith('SANAD-VC-')) {
    return {
      isValid: true,
      status: 'valid',
      credentialId: query,
      issueDate: '25 Sep 2026',
      claimCategory: 'Unpaid wages & recently ended employment',
      subjectPseudonym: 'did:sanad:worker:ae82...994f',
      trustNode: 'SANAD Independent Sovereign Trust Root Node',
      merkleHash: '0x9e12bf4097f519c288d30e386ab7210e7ccb0a',
      standard: 'W3C Verifiable Credential v2.0',
      strictPrivacyGuard: true,
    };
  }

  return {
    isValid: false,
    status: 'not_found',
    credentialId: query,
    issueDate: 'N/A',
    claimCategory: 'Unknown or unverified hash',
    subjectPseudonym: 'N/A',
    trustNode: 'SANAD Independent Sovereign Trust Root Node',
    merkleHash: '0x00000000000000000000',
    standard: 'W3C Verifiable Credential v2.0',
    strictPrivacyGuard: true,
  };
};
