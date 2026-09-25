import { z } from "zod";
import QRCode from "qrcode";
import { actor } from "@/lib/auth/session";
import { AppError, assert } from "./errors";
import { jsonBody, rateLimit } from "./security";
import { ok } from "./router";
import { demoMode, get, insert, list, update } from "@/lib/database/repository";
import {
  analyzeSituation,
  createClaim,
  editClaim,
  confirmClaim,
  issueCredential,
  revokeCredential,
  reconcileCredential,
  publicVerify,
  relevantServices,
  createApplication,
  attachEvidence,
  submitApplication,
  simulateStatus,
  applicationDetails,
  publicCredential,
  uuid,
} from "@/lib/domain/workflows";
import { services, manageService } from "@/lib/services/catalog";
import { analyze } from "@/lib/ai/analyze";
import { mode, transaction } from "@/lib/blockchain/chain";
import {
  uploadDocument,
  downloadDocument,
  deleteDocument,
  analyzeDocument,
} from "@/lib/documents/files";

export async function domainRoute(
  request: Request,
  p: string[],
  method: string,
): Promise<Response> {
  const body = () => jsonBody(request);
  const id = (i: number) => uuid.parse(p[i]);
  const user = () => actor();
  if (p[0] === "verify") {
    rateLimit(
      "verify:" + (request.headers.get("x-forwarded-for") || "local"),
      30,
    );
    if (method === "GET" && p[1] && p[1] !== "hash")
      return ok(await verifyAndCount(id(1)));
    if (method === "POST" && p.length === 1)
      return ok(
        await publicVerify(
          z.object({ credentialId: uuid }).parse(await body()).credentialId,
        ),
      );
    if (method === "GET" && p[1] === "hash") {
      const hash = z
        .string()
        .regex(/^0x[0-9a-f]{64}$/)
        .parse(p[2]);
      const match = (await list("credentials", { record_hash: hash }))[0];
      if (!match) throw new AppError("NOT_FOUND", "Credential not found.", 404);
      return ok(await verifyAndCount(match.id));
    }
  }
  if (p[0] === "ai") {
    if (p[1] === "analyze" && method === "POST") {
      await user();
      rateLimit(
        "ai:" + (request.headers.get("x-forwarded-for") || "local"),
        20,
      );
      return ok(await analyzeSituation(await body()));
    }
    if (p[1] === "analyze-voice" && method === "POST") {
      await user();
      const input = z
        .object({ transcript: z.string().min(10).max(4000) })
        .parse(await body());
      return ok({
        ...(await analyze(input.transcript)),
        transcript: input.transcript,
        notice:
          "Transcript supplied by browser speech recognition; unsupported browsers can type instead.",
      });
    }
    if (p[1] === "clarify" && method === "POST") {
      await user();
      const input = z
        .object({
          text: z.string().min(10).max(4000),
          answers: z.record(z.string(), z.string().max(300)),
        })
        .parse(await body());
      const result = await analyze(
        input.text +
          "\nClarifications: " +
          Object.entries(input.answers)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; "),
      );
      return ok(result);
    }
    if (p[1] === "confirm" && method === "POST") {
      const claim = z.object({ claimId: uuid }).parse(await body());
      return ok(await confirmClaim(claim.claimId));
    }
  }
  if (p[0] === "claims") {
    if (p.length === 1) {
      if (method === "POST") return ok(await createClaim(await body()), 201);
      if (method === "GET")
        return ok(await list("claims", { user_id: (await user()).id }));
    }
    const claimId = id(1),
      owner = await user();
    if (p.length === 2) {
      if (method === "GET") return ok(await get("claims", claimId, owner.id));
      if (method === "PATCH") return ok(await editClaim(claimId, await body()));
    }
    if (p[2] === "confirm" && method === "POST")
      return ok(await confirmClaim(claimId));
    if (p[2] === "revoke" && method === "POST") {
      const cred = (
        await list("credentials", { claim_id: claimId, user_id: owner.id })
      ).find((c) => c.status === "VALID");
      if (!cred)
        throw new AppError(
          "NOT_FOUND",
          "No active credential for this claim.",
          404,
        );
      return ok(await revokeCredential(cred.id));
    }
  }
  if (p[0] === "credentials") {
    if (p.length === 1) {
      if (method === "GET")
        return ok(
          (await list("credentials", { user_id: (await user()).id })).map(
            publicCredential,
          ),
        );
    }
    if (p[1] === "issue" && method === "POST") {
      const { claimId } = z.object({ claimId: uuid }).parse(await body());
      return ok(publicCredential(await issueCredential(claimId)), 201);
    }
    const credentialId = id(1),
      owner = await user(),
      cred = await get("credentials", credentialId, owner.id);
    if (p.length === 2 && method === "GET") return ok(publicCredential(cred));
    if (p[2] === "status" && method === "GET")
      return ok(await publicVerify(credentialId));
    if (p[2] === "revoke" && method === "POST")
      return ok(publicCredential(await revokeCredential(credentialId)));
    if (p[2] === "reconcile" && method === "POST")
      return ok(await reconcileCredential(credentialId));
    if (p[2] === "qr" && method === "GET") {
      const url = `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/verify?id=${encodeURIComponent(credentialId)}`;
      const png = await QRCode.toBuffer(url, { width: 320, margin: 2 });
      return new Response(new Uint8Array(png), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "private, no-store",
        },
      });
    }
  }
  if (p[0] === "blockchain") {
    if (p[1] === "issue" && method === "POST") {
      const { claimId } = z.object({ claimId: uuid }).parse(await body());
      return ok(publicCredential(await issueCredential(claimId)), 201);
    }
    if (p[1] === "verify" && method === "GET")
      return ok(await publicVerify(id(2)));
    if (p[1] === "revoke" && method === "POST") {
      const { credentialId } = z
        .object({ credentialId: uuid })
        .parse(await body());
      return ok(publicCredential(await revokeCredential(credentialId)));
    }
    if (p[1] === "transaction" && method === "GET") {
      await user();
      const hash = z
        .string()
        .regex(/^0x[0-9a-fA-F]{64}$/)
        .parse(p[2]);
      assert(
        (await list("credentials", { user_id: (await user()).id })).some(
          (c) =>
            c.transaction_hash === hash ||
            c.revocation_transaction_hash === hash,
        ),
        "NOT_FOUND",
        "Transaction not found.",
        404,
      );
      return ok(await transaction(hash));
    }
  }
  if (p[0] === "services") {
    const all = await services();
    if (p.length === 1 && method === "GET") return ok(all);
    if (p[1] === "categories" && method === "GET")
      return ok([...new Set(all.map((s) => s.category))]);
    if (p[1] === "search" && method === "POST") {
      const { query } = z
        .object({ query: z.string().trim().min(1).max(150) })
        .parse(await body());
      const q = query.toLowerCase();
      return ok(
        all.filter((s) =>
          `${s.title} ${s.description} ${s.category}`.toLowerCase().includes(q),
        ),
      );
    }
    if (p[1] === "match" && method === "POST") {
      const { claimId } = z.object({ claimId: uuid }).parse(await body());
      return ok(await relevantServices(claimId));
    }
    const serviceId = id(1),
      service = all.find((s) => s.id === serviceId);
    assert(service, "NOT_FOUND", "Service not found.", 404);
    if (p.length === 2 && method === "GET") return ok(service);
    if (p[2] === "journey" && method === "GET")
      return ok({
        service,
        steps: service.steps,
        notice:
          "SANAD tracks a simulated journey. Official applications must be made with the authority.",
      });
    if (p[2] === "start" && method === "POST")
      return ok(
        await createApplication({
          service_id: serviceId,
          ...z.object({ credential_id: uuid.optional() }).parse(await body()),
        }),
        201,
      );
  }
  if (p[0] === "applications") {
    if (p.length === 1) {
      if (method === "POST")
        return ok(await createApplication(await body()), 201);
      if (method === "GET")
        return ok(await list("applications", { user_id: (await user()).id }));
    }
    const applicationId = id(1),
      owner = await user();
    if (p.length === 2 && method === "GET")
      return ok(await applicationDetails(applicationId, owner));
    if (p.length === 2 && method === "PATCH") {
      const { status } = z
        .object({
          status: z.enum([
            "UNDER_REVIEW",
            "ADDITIONAL_DOCUMENTS_REQUIRED",
            "VERIFIED",
            "COMPLETED",
          ]),
        })
        .parse(await body());
      return ok(await simulateStatus(applicationId, status));
    }
    if (p[2] === "submit" && method === "POST")
      return ok(await submitApplication(applicationId));
    if (p[2] === "timeline" && method === "GET") {
      await get("applications", applicationId, owner.id);
      return ok(
        await list("application_events", {
          application_id: applicationId,
          user_id: owner.id,
        }),
      );
    }
    if (p[2] === "updates" && method === "GET") {
      await get("applications", applicationId, owner.id);
      return ok(
        await list("notifications", {
          application_id: applicationId,
          user_id: owner.id,
        }),
      );
    }
    if (p[2] === "attach" && method === "POST") {
      const input = z
        .object({ kind: z.enum(["document", "credential"]), evidence_id: uuid })
        .parse(await body());
      return ok(
        await attachEvidence(applicationId, input.evidence_id, input.kind),
        201,
      );
    }
  }
  if (p[0] === "journeys") {
    const journeyId = id(1),
      owner = await user(),
      journey = await get("journeys", journeyId, owner.id);
    if (p.length === 2 && method === "GET") return ok(journey);
    if (p.length === 2 && method === "PATCH") {
      const v = z
        .object({
          current_step: z.number().int().min(0).max(20),
          responses: z.record(z.string().max(80), z.string().max(1000)),
        })
        .parse(await body());
      const app = await get("applications", journey.application_id, owner.id);
      assert(
        app.status === "DRAFT",
        "INVALID_TRANSITION",
        "This journey has already been submitted.",
        409,
      );
      return ok(await update("journeys", journeyId, v, owner.id));
    }
    if (p[2] === "submit" && method === "POST")
      return ok(await submitApplication(journey.application_id));
  }
  if (p[0] === "documents") {
    const owner = await user();
    if (p.length === 1) {
      if (method === "POST")
        return ok(await uploadDocument(request, owner), 201);
      if (method === "GET")
        return ok(await list("documents", { user_id: owner.id }));
    }
    const documentId = id(1),
      doc = await get("documents", documentId, owner.id);
    if (p.length === 2 && method === "GET")
      return ok({ ...doc, storage_path: undefined });
    if (p.length === 2 && method === "DELETE") {
      await deleteDocument(doc, owner);
      return ok({ deleted: true });
    }
    if (p[2] === "download" && method === "GET")
      return downloadDocument(doc, owner);
    if (p[2] === "confirm" && method === "POST") {
      const input = z
        .object({
          extraction: z.object({
            document_type: z.string().max(100),
            date: z.string().max(40).nullable(),
            employer_name: z.string().max(200).nullable(),
            salary_period: z.string().max(100).nullable(),
          }),
        })
        .parse(await body());
      return ok(
        await update(
          "documents",
          documentId,
          {
            extraction: input.extraction,
            analysis_status: "CONFIRMED",
            confirmed_at: new Date().toISOString(),
          },
          owner.id,
        ),
      );
    }
    if (p[2] === "analyze" && method === "POST") {
      const consent = z
        .object({ consent: z.literal(true) })
        .parse(await body());
      void consent;
      return ok(await analyzeDocument(doc, owner));
    }
  }
  if (p[0] === "notifications") {
    const owner = await user();
    if (p.length === 1) {
      if (method === "GET")
        return ok(await list("notifications", { user_id: owner.id }));
      if (method === "POST") {
        const { message } = z
          .object({ message: z.string().min(1).max(400) })
          .parse(await body());
        return ok(
          await insert("notifications", { user_id: owner.id, message }),
          201,
        );
      }
    }
    if (p[2] === "read" && method === "PATCH")
      return ok(
        await update(
          "notifications",
          id(1),
          { read_at: new Date().toISOString() },
          owner.id,
        ),
      );
  }
  if (p[0] === "escalation") {
    const owner = await user();
    if (p.length === 1) {
      if (method === "GET")
        return ok(await list("escalations", { user_id: owner.id }));
      if (method === "POST") {
        const input = z
          .object({
            subject: z.string().min(5).max(200),
            application_id: uuid.optional(),
          })
          .parse(await body());
        if (input.application_id)
          await get("applications", input.application_id, owner.id);
        return ok(
          await insert("escalations", {
            ...input,
            user_id: owner.id,
            status: "OPEN",
          }),
          201,
        );
      }
    }
    const escalation = await get("escalations", id(1), owner.id);
    if (p.length === 2 && method === "GET")
      return ok({
        ...escalation,
        messages: await list("escalation_messages", {
          escalation_id: escalation.id,
          user_id: owner.id,
        }),
      });
    if (p[2] === "message" && method === "POST") {
      const { message } = z
        .object({ message: z.string().min(1).max(2000) })
        .parse(await body());
      return ok(
        await insert("escalation_messages", {
          user_id: owner.id,
          escalation_id: escalation.id,
          body: message,
        }),
        201,
      );
    }
  }
  if (p[0] === "analytics") {
    const owner = await user();
    if (p[1] === "event" && method === "POST") {
      const { event_name } = z
        .object({ event_name: z.string().regex(/^[a-z_]{1,60}$/) })
        .parse(await body());
      return ok(
        await insert("analytics_events", { user_id: owner.id, event_name }),
        201,
      );
    }
    if (p[1] === "overview" && method === "GET") {
      assert(
        owner.role === "admin",
        "FORBIDDEN",
        "Administrator access required.",
        403,
      );
      const [users, claims, credentials, applications, escalations] =
        await Promise.all([
          list("users"),
          list("claims"),
          list("credentials"),
          list("applications"),
          list("escalations"),
        ]);
      return ok({
        totalUsers: users.length,
        claims: claims.length,
        credentials: credentials.length,
        applications: applications.length,
        pendingApplications: applications.filter(
          (a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW",
        ).length,
        escalations: escalations.length,
        verificationRequests: (
          await list("analytics_events", { event_name: "verification" })
        ).length,
        claimsByCategory: counts(claims, "intent"),
        applicationsByStatus: counts(applications, "status"),
        aiConfidence: claims
          .map((c) => Number(c.confidence))
          .filter(Number.isFinite),
      });
    }
  }
  if (p[0] === "admin") {
    const owner = await user();
    assert(
      owner.role === "admin",
      "FORBIDDEN",
      "Administrator access required.",
      403,
    );
    if (p[1] === "services" && p.length === 2 && method === "GET")
      return ok(await list("services"));
    if (p[1] === "services" && method === "POST")
      return ok(
        await manageService(
          undefined,
          z
            .object({
              title: z.string().min(5),
              description: z.string().min(10),
              category: z.string().min(2),
              eligibility_guidance: z.string().min(10),
              details: z.object({
                official_url: z.url().refine((value) => {
                  try {
                    const host = new URL(value).hostname.toLowerCase();
                    return (
                      new URL(value).protocol === "https:" &&
                      (host === "u.ae" || host.endsWith(".gov.ae"))
                    );
                  } catch {
                    return false;
                  }
                }, "Use an official UAE government HTTPS URL"),
                last_verified: z.string(),
                kind: z.string(),
              }),
              steps: z.array(z.string()),
              keywords: z.array(z.string()),
              supported_situations: z.array(z.string()),
              published: z.boolean(),
            })
            .parse(await body()),
        ),
        201,
      );
    if (p[1] === "services" && p[2] && method === "PATCH")
      return ok(
        await manageService(
          id(2),
          z
            .object({
              title: z.string().min(5).optional(),
              description: z.string().min(10).optional(),
              category: z.string().min(2).optional(),
              published: z.boolean().optional(),
              eligibility_guidance: z.string().min(10).optional(),
              steps: z.array(z.string()).optional(),
            })
            .parse(await body()),
        ),
      );
  }
  if (p[0] === "health") {
    if (p[1] === "ai")
      return ok({
        configured: !!process.env.AI_API_KEY,
        provider: process.env.AI_PROVIDER || "OPENAI",
        demoRules: demoMode(),
      });
    if (p[1] === "blockchain")
      return ok({
        mode: mode(),
        configured:
          mode() === "mock" ||
          !!(
            process.env.POLYGON_AMOY_RPC_URL &&
            process.env.SANAD_CONTRACT_ADDRESS
          ),
      });
  }
  throw new AppError("NOT_FOUND", "Endpoint not found.", 404);
}
function counts(rows: { [key: string]: unknown }[], key: string) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const value = String(row[key] || "unknown");
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

async function verifyAndCount(id: string) {
  const result = await publicVerify(id);
  try {
    await insert("verification_events", {
      credential_id: id,
      outcome: result.valid ? "VALID" : "INVALID",
    });
  } catch {}
  return result;
}
