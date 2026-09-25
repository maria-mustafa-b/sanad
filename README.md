# SANAD | سند

**Understand your situation. Prove what matters. Find the support you need.**

SANAD is a multilingual situation navigator and portable-credential hackathon prototype. A person can explain a situation in mixed language, review extracted facts, explicitly confirm them, receive a verifiable record, find potentially relevant official-source resources, attach evidence to a SANAD journey, receive accessible updates and share an ID or QR link for independent credential verification.

The local demo runs without an account or external secrets. It labels its rule-based example analysis, local credential simulation and application journey. It does **not** claim that a blockchain proves factual truth or that a government application was submitted. Actual service eligibility remains with the relevant authority.

## Quick start

Requires Node.js 24 and npm. From the repository root:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 and choose **Try Demo**. The sample is fictional: “Meri job chali gayi hai aur August ki salary bhi nahi mili.” Demo sessions and uploaded files remain on this server under `.sanad-demo/`, which Git ignores. Run the same server process for the session; the local demo is for development, not shared hosting.

## What works

- Supabase email/password sign-up, sign-in, refresh, sign-out and authenticated profile API when configured; local isolated demo sessions otherwise.
- Zod-validated situation extraction with configurable OpenAI, Azure OpenAI and Gemini adapters; local rule-based sample fallback, explicitly labelled.
- Editable facts, clarification inputs, guarded confirmation states and user-owned claims.
- Salted deterministic snapshot hashes; issuer-restricted Solidity issue/verify/revoke on Polygon Amoy, or a labelled local simulation. QR and public metadata-only verification, including revocation.
- A curated catalog of 22 official UAE government resource pages and service links, matching reasons and relevance scores labelled as relevance rather than official eligibility.
- Private document vault with MIME/magic/size checks, owner-scoped download, text/PDF extraction and AI image extraction when configured; user confirmation of tentative fields.
- Simulated application journeys with credential/document evidence, timelines, notifications, status transitions and live screen-reader announcements.
- Role-guarded administration with service publishing and aggregate metrics; responsive desktop/mobile pages, keyboard-visible focus, larger text and reduced-motion preferences.

## Architecture and deployment

Next.js App Router, React, TypeScript, Tailwind, Supabase Auth/PostgreSQL/private Storage, provider-neutral AI entry points, Solidity and ethers. API routes verify the actor and record ownership. Supabase RLS denies client writes to workflows; service-role access is server-only. See [architecture](docs/architecture.md), [database](docs/database.md), [blockchain](docs/blockchain.md) and [API reference](docs/api.md).

For hosted use, set `SANAD_MODE=supabase`, configure Supabase keys and run all migrations in order. Local file-backed demo mode intentionally refuses Vercel's ephemeral filesystem. For Amoy issuance, deploy the contract from a locally funded issuer wallet, set the contract address, RPC and issuer private key as server secrets, and set `BLOCKCHAIN_MODE=real`. Detailed user-owned steps are in [setup](docs/setup.md). Live Supabase, AI-provider and Amoy integrations have **not** been exercised without those user-owned credentials; local adapters and contract logic are tested. No production deployment is claimed.

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run test:contract
npm run build
npm run test:integration
npx playwright install chromium
npm run test:e2e
```

CI performs the same checks. [Validation details](docs/VALIDATION.md) distinguish executed local checks from live integrations. [Demo guide](docs/demo.md) gives a presentation sequence. [Build plan](docs/BUILD_PLAN.md) tracks the phased delivery and remaining hosted-service gates.

## Trust and privacy

Provenance distinguishes user-reported, AI-extracted, user-confirmed and issuer-verified facts. SANAD currently issues **user-confirmed** claims; issuer-verified truth is not asserted without an authorized evidence review. The registry stores opaque IDs and hashes, with no personal data on-chain. Public verification exposes only status, claim type, issuer, issue date and transaction status; it does not expose a claim's private facts or documents. Government submission is a prototype simulation.
