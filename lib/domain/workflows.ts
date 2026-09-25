import { z } from "zod";
import { assert } from "@/lib/api/errors";
import { analyze } from "@/lib/ai/analyze";
import { newSalt, makeHash, factsSchema } from "@/lib/credentials/crypto";
import { actor } from "@/lib/auth/session";
import { get, insert, list, update } from "@/lib/database/repository";
import {
  mode,
  issue as chainIssue,
  revoke as chainRevoke,
  verify as chainVerify,
  transaction as chainTransaction,
} from "@/lib/blockchain/chain";
import { services, matchServices } from "@/lib/services/catalog";
import type { Actor, Row } from "@/lib/domain/types";

export const uuid = z.uuid();
export const situationSchema = z.object({
  text: z.string().trim().min(10).max(4000),
});
export const claimEditSchema = z.object({
  facts: factsSchema,
  original_text: z.string().trim().min(10).max(4000).optional(),
});
export const verifyPublicSchema = z.object({ credentialId: uuid });
const owner = async () => actor();
export async function analyzeSituation(input: unknown) {
  const { text } = situationSchema.parse(input);
  return analyze(text);
}
export async function createClaim(input: unknown) {
  const user = await owner();
  const { text } = situationSchema.parse(input);
  const result = await analyze(text);
  const claim = await insert("claims", {
    user_id: user.id,
    original_text: text,
    status: "WAITING_FOR_CONFIRMATION",
    intent: result.analysis.intent,
    confidence: result.analysis.confidence,
    facts: result.analysis.facts,
    missing_information: result.analysis.missing_information,
    analysis: { ...result.analysis, method: result.method },
  });
  for (const [name, value] of Object.entries(result.analysis.facts))
    await insert("claim_facts", {
      user_id: user.id,
      claim_id: claim.id,
      name,
      value,
      provenance: "AI_EXTRACTED",
    });
  return claim;
}
export async function editClaim(id: string, input: unknown) {
  const user = await owner();
  const claim = await get("claims", id, user.id);
  assert(
    ["DRAFT", "AI_ANALYZED", "WAITING_FOR_CONFIRMATION"].includes(claim.status),
    "IMMUTABLE_CLAIM",
    "Confirmed claims cannot be edited. Start a new claim.",
    409,
  );
  const body = claimEditSchema.parse(input);
  return update(
    "claims",
    id,
    {
      ...body,
      status: "WAITING_FOR_CONFIRMATION",
      analysis: { ...claim.analysis, method: "user_edited" },
    },
    user.id,
    { status: claim.status },
  );
}
export async function confirmClaim(id: string) {
  const user = await owner();
  const claim = await get("claims", id, user.id);
  assert(
    claim.status === "WAITING_FOR_CONFIRMATION",
    "INVALID_TRANSITION",
    "Review the facts before confirming.",
    409,
  );
  const facts = factsSchema.parse(claim.facts);
  assert(
    Object.keys(facts).length > 0,
    "MISSING_FACTS",
    "Add at least one fact before confirming.",
  );
  const confirmed = await update(
    "claims",
    id,
    { status: "USER_CONFIRMED", confirmed_at: new Date().toISOString(), facts },
    user.id,
    { status: "WAITING_FOR_CONFIRMATION" },
  );
  const previous = await list("claim_facts", {
    claim_id: id,
    user_id: user.id,
  });
  for (const [name, value] of Object.entries(facts)) {
    const old = previous.find((row) => row.name === name);
    if (old)
      await update(
        "claim_facts",
        old.id,
        { value, provenance: "USER_CONFIRMED" },
        user.id,
      );
    else
      await insert("claim_facts", {
        user_id: user.id,
        claim_id: id,
        name,
        value,
        provenance: "USER_CONFIRMED",
      });
  }
  return confirmed;
}
export async function issueCredential(claimId: string) {
  const user = await owner();
  const claim = await get("claims", claimId, user.id);
  assert(
    claim.status === "USER_CONFIRMED",
    "CONFIRMATION_REQUIRED",
    "Confirm the situation before issuing a credential.",
    409,
  );
  const existing = (
    await list("credentials", { user_id: user.id, claim_id: claimId })
  ).find((r) => ["PENDING", "VALID", "REVOKING"].includes(r.status));
  assert(
    !existing,
    "ALREADY_ISSUED",
    "This claim already has an active credential.",
    409,
  );
  const snapshot = {
    type: claim.intent,
    facts: claim.facts,
    confirmed_at: claim.confirmed_at,
    provenance: "USER_CONFIRMED",
  };
  const salt = newSalt(),
    hash = makeHash(snapshot, salt);
  const credential = await insert("credentials", {
    user_id: user.id,
    claim_id: claimId,
    snapshot,
    salt,
    record_hash: hash,
    issuer: "SANAD prototype issuer",
    mode: mode(),
    status: "PENDING",
  });
  let chain: Awaited<ReturnType<typeof chainIssue>>;
  try {
    chain = await chainIssue(credential.id, hash, async (transaction_hash) => {
      await update(
        "credentials",
        credential.id,
        {
          transaction_hash,
          chain_id: 80002,
          contract_address: process.env.SANAD_CONTRACT_ADDRESS,
        },
        user.id,
        { status: "PENDING" },
      );
    });
  } catch (error) {
    const current = await get("credentials", credential.id, user.id);
    if (!current.transaction_hash)
      await update(
        "credentials",
        credential.id,
        { status: "FAILED" },
        user.id,
        { status: "PENDING" },
      );
    throw error;
  }
  {
    const issued = await update(
      "credentials",
      credential.id,
      {
        status: "VALID",
        issued_at: new Date().toISOString(),
        transaction_hash: chain.transaction_hash,
        chain_id: chain.chain_id,
        contract_address:
          chain.mode === "real" ? process.env.SANAD_CONTRACT_ADDRESS : null,
      },
      user.id,
      { status: "PENDING" },
    );
    await update("claims", claimId, { status: "ISSUED" }, user.id, {
      status: "USER_CONFIRMED",
    });
    await insert("credential_events", {
      user_id: user.id,
      credential_id: credential.id,
      event_type: "ISSUED",
      metadata: { mode: mode() },
    });
    return issued;
  }
}
export async function revokeCredential(id: string) {
  const user = await owner();
  const credential = await get("credentials", id, user.id);
  assert(
    credential.status === "VALID",
    "INVALID_TRANSITION",
    "Only valid credentials can be revoked.",
    409,
  );
  await update("credentials", id, { status: "REVOKING" }, user.id, {
    status: "VALID",
  });
  let result: Awaited<ReturnType<typeof chainRevoke>>;
  try {
    result = await chainRevoke(id, async (revocation_transaction_hash) => {
      await update(
        "credentials",
        id,
        { revocation_transaction_hash },
        user.id,
        { status: "REVOKING" },
      );
    });
  } catch (error) {
    const current = await get("credentials", id, user.id);
    if (!current.revocation_transaction_hash)
      await update("credentials", id, { status: "VALID" }, user.id, {
        status: "REVOKING",
      });
    throw error;
  }
  {
    const revoked = await update(
      "credentials",
      id,
      {
        status: "REVOKED",
        revoked_at: new Date().toISOString(),
        revocation_transaction_hash: result.transaction_hash,
      },
      user.id,
      { status: "REVOKING" },
    );
    await update(
      "claims",
      credential.claim_id,
      { status: "REVOKED" },
      user.id,
      { status: "ISSUED" },
    );
    await insert("credential_events", {
      user_id: user.id,
      credential_id: id,
      event_type: "REVOKED",
      metadata: { mode: credential.mode },
    });
    return revoked;
  }
}
export async function reconcileCredential(id: string) {
  const user = await owner();
  const credential = await get("credentials", id, user.id);
  assert(
    ["PENDING", "REVOKING"].includes(credential.status),
    "INVALID_TRANSITION",
    "Only pending transactions can be reconciled.",
    409,
  );
  const issuance = credential.status === "PENDING";
  const hash = issuance
    ? credential.transaction_hash
    : credential.revocation_transaction_hash;
  assert(
    hash,
    "TRANSACTION_PENDING",
    "No transaction has been broadcast yet.",
    409,
  );
  const receipt = await chainTransaction(hash);
  if (receipt.status === null) return publicCredential(credential);
  if (receipt.status !== 1) {
    const failed = await update(
      "credentials",
      id,
      { status: issuance ? "FAILED" : "VALID" },
      user.id,
      { status: credential.status },
    );
    return publicCredential(failed);
  }
  if (issuance) {
    const confirmed = await update(
      "credentials",
      id,
      { status: "VALID", issued_at: new Date().toISOString() },
      user.id,
      { status: "PENDING" },
    );
    await update("claims", credential.claim_id, { status: "ISSUED" }, user.id, {
      status: "USER_CONFIRMED",
    });
    await insert("credential_events", {
      user_id: user.id,
      credential_id: id,
      event_type: "ISSUED",
      metadata: { mode: "real", reconciled: true },
    });
    return publicCredential(confirmed);
  }
  const revoked = await update(
    "credentials",
    id,
    { status: "REVOKED", revoked_at: new Date().toISOString() },
    user.id,
    { status: "REVOKING" },
  );
  await update("claims", credential.claim_id, { status: "REVOKED" }, user.id, {
    status: "ISSUED",
  });
  await insert("credential_events", {
    user_id: user.id,
    credential_id: id,
    event_type: "REVOKED",
    metadata: { mode: "real", reconciled: true },
  });
  return publicCredential(revoked);
}
export async function publicVerify(id: string) {
  uuid.parse(id);
  const credential = await get("credentials", id);
  const integrity =
    makeHash(credential.snapshot, credential.salt) === credential.record_hash;
  const onChain =
    credential.mode === "real" && integrity
      ? await chainVerify(id, credential.record_hash)
      : null;
  const valid =
    integrity &&
    credential.status === "VALID" &&
    (credential.mode === "mock" || onChain?.verified === true);
  return {
    credentialId: credential.id,
    valid,
    status: credential.status,
    integrity,
    mode: credential.mode,
    issuer: credential.issuer,
    issuedAt: credential.issued_at,
    claimType: credential.snapshot?.type ?? "unspecified",
    blockchainVerification: onChain?.verified ?? false,
    transactionHash: credential.transaction_hash ?? null,
    revoked: credential.status === "REVOKED",
    notice:
      credential.mode === "mock"
        ? "Demo/Testnet Simulation — no blockchain transaction"
        : "A valid credential proves issuance and integrity, not the truth of the claim or eligibility.",
  };
}
export async function relevantServices(claimId: string) {
  const user = await owner(),
    claim = await get("claims", claimId, user.id);
  assert(
    ["USER_CONFIRMED", "ISSUED"].includes(claim.status),
    "CONFIRMATION_REQUIRED",
    "Confirm facts before matching support.",
    409,
  );
  return matchServices(await services(), claim.facts);
}
export async function createApplication(input: unknown) {
  const user = await owner(),
    { service_id, credential_id } = z
      .object({ service_id: uuid, credential_id: uuid.optional() })
      .parse(input);
  const service = await get("services", service_id);
  assert(service.published, "NOT_FOUND", "Service unavailable.", 404);
  if (credential_id) {
    const credential = await get("credentials", credential_id, user.id);
    assert(
      credential.status === "VALID",
      "INVALID_CREDENTIAL",
      "A valid credential is required.",
    );
  }
  const application = await insert("applications", {
    user_id: user.id,
    service_id,
    status: "DRAFT",
    is_simulation: true,
  });
  await insert("application_events", {
    user_id: user.id,
    application_id: application.id,
    event_type: "CREATED",
    description: "Application journey created (simulation).",
  });
  await insert("journeys", {
    user_id: user.id,
    application_id: application.id,
    current_step: 0,
    responses: {},
  });
  if (credential_id) {
    await insert("application_credentials", {
      user_id: user.id,
      application_id: application.id,
      credential_id,
    });
    await insert("application_events", {
      user_id: user.id,
      application_id: application.id,
      event_type: "CREDENTIAL_ATTACHED",
      description: "SANAD credential attached as user-confirmed evidence.",
    });
  }
  return application;
}
export async function attachEvidence(
  applicationId: string,
  documentId: string,
  kind: "document" | "credential",
) {
  const user = await owner();
  const application = await get("applications", applicationId, user.id);
  assert(
    application.status === "DRAFT",
    "INVALID_TRANSITION",
    "Only draft applications can be edited.",
    409,
  );
  const table = kind === "document" ? "documents" : "credentials";
  const item = await get(table, documentId, user.id);
  if (kind === "credential")
    assert(
      item.status === "VALID",
      "INVALID_CREDENTIAL",
      "Only valid credentials can be attached.",
    );
  const link =
    kind === "document" ? "application_documents" : "application_credentials";
  const key = kind === "document" ? "document_id" : "credential_id";
  const existing = await list(link, {
    application_id: applicationId,
    [key]: documentId,
    user_id: user.id,
  });
  if (existing[0]) return existing[0];
  const created = await insert(link, {
    user_id: user.id,
    application_id: applicationId,
    [key]: documentId,
  });
  await insert("application_events", {
    user_id: user.id,
    application_id: applicationId,
    event_type: "EVIDENCE_ATTACHED",
    description: `${kind === "document" ? "Document" : "Credential"} attached.`,
  });
  return created;
}
export async function submitApplication(id: string) {
  const user = await owner();
  await get("applications", id, user.id);
  const app = await update(
    "applications",
    id,
    { status: "SUBMITTED", submitted_at: new Date().toISOString() },
    user.id,
    { status: "DRAFT" },
  );
  await insert("application_events", {
    user_id: user.id,
    application_id: id,
    event_type: "SUBMITTED",
    description:
      "Submitted to SANAD demo journey. No government application was filed.",
  });
  await insert("notifications", {
    user_id: user.id,
    application_id: id,
    message:
      "Application status changed. Your SANAD demo journey was submitted; no government application was filed.",
  });
  return app;
}
export async function simulateStatus(id: string, status: string) {
  const user = await owner();
  const app = await get("applications", id, user.id);
  const allowed: Record<string, string[]> = {
    SUBMITTED: ["UNDER_REVIEW"],
    UNDER_REVIEW: ["ADDITIONAL_DOCUMENTS_REQUIRED", "VERIFIED"],
    ADDITIONAL_DOCUMENTS_REQUIRED: ["UNDER_REVIEW"],
    VERIFIED: ["COMPLETED"],
  };
  assert(
    user.demo,
    "SIMULATION_ONLY",
    "Status simulation is available only in demo mode.",
    403,
  );
  assert(
    allowed[app.status]?.includes(status),
    "INVALID_TRANSITION",
    "This status change is not allowed.",
    409,
  );
  const updated = await update("applications", id, { status }, user.id, {
    status: app.status,
  });
  const readable = status.replaceAll("_", " ").toLowerCase();
  const message = `Application status changed. ${readable[0].toUpperCase() + readable.slice(1)}. Demo simulation.`;
  await insert("application_events", {
    user_id: user.id,
    application_id: id,
    event_type: status,
    description: message,
  });
  await insert("notifications", {
    user_id: user.id,
    application_id: id,
    message,
  });
  return updated;
}
export async function applicationDetails(id: string, user: Actor) {
  const application = await get("applications", id, user.id);
  const [timeline, attachedDocuments, attachedCredentials, journeys] =
    await Promise.all([
      list("application_events", { application_id: id, user_id: user.id }),
      list("application_documents", { application_id: id, user_id: user.id }),
      list("application_credentials", { application_id: id, user_id: user.id }),
      list("journeys", { application_id: id, user_id: user.id }),
    ]);
  return {
    ...application,
    timeline,
    attachedDocuments,
    attachedCredentials,
    journey: journeys[0] ?? null,
  };
}
export function publicCredential(response: Row) {
  return {
    id: response.id,
    claim_id: response.claim_id,
    status: response.status,
    mode: response.mode,
    issuer: response.issuer,
    issued_at: response.issued_at,
    record_hash: response.record_hash,
    transaction_hash: response.transaction_hash,
    revocation_transaction_hash: response.revocation_transaction_hash,
  };
}
