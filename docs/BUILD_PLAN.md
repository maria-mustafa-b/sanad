# SANAD build plan

SANAD connects natural-language situation understanding, user confirmation, portable credentials, relevant support and accessible application tracking.

## Delivery agreement
Build incrementally and push a logical commit after each verified milestone to maria-mustafa-b/sanad. Never commit secrets or claim unrun checks passed. Pause for user-owned account, key, wallet and deployment setup. Record current progress here on every milestone.

## Phases and acceptance gates
1. **Foundation** — Next.js/React/TypeScript, Tailwind, UI primitives, frontend shell, environment schema, API error conventions, initial database migration, CI and architecture. Gate: lint, typecheck, unit tests and production build.
2. **Database and authentication** — Supabase email authentication, server sessions, ownership enforcement, RLS and private storage. Gate: two-user isolation and session tests on configured Supabase.
3. **AI pipeline** — configurable OpenAI/Azure/Gemini adapters, Zod structured extraction, clarification, voice fallback and confidence handling. Gate: multilingual fixtures, invalid-provider responses and timeout tests.
4. **Claims** — editable facts, explicit confirmation, persistence and guarded state transitions. Gate: no issuance before confirmation.
5. **Blockchain credentials** — canonical salted record hashes, Solidity issuer authorization, issue/verify/revoke, transaction lifecycle and clearly labelled mock mode. Gate: contract tests; actual Amoy transaction only after wallet/RPC/funding setup.
6. **Services and RAG** — 20–30 official-source service records with verification dates, retrieval, document requirements and relevance explanations. Gate: no unsupported services or definitive eligibility claims.
7. **Applications** — private documents, journeys, evidence attachment, submission simulation, timelines, notifications and escalation. Gate: cross-owner access denied and transitions tested. Government submission must be explicitly simulated without an official integration.
8. **Accessibility** — live announcements, focus handling, keyboard operation, reduced motion, larger text and responsive QA. Accessibility starts in phase 1.
9. **Public verification** — ID/QR lookup, integrity and revocation checks, minimal metadata, no personal claims disclosure. Gate: issued, revoked, missing and tampered cases.
10. **Admin** — role-guarded service management and real aggregate metrics. Gate: ordinary users denied.
11. **End-to-end validation** — full golden path; unit, integration, contract, keyboard, mobile/tablet/desktop and failure cases; full OpenAPI reference and demo guide.
12. **Deployment** — user-configured Vercel/Supabase/Amoy, migrations, secret setup and deployed smoke checks. Never call the prototype production-ready before these gates pass.

## Trust invariants
- USER_REPORTED, AI_EXTRACTED, USER_CONFIRMED and ISSUER_VERIFIED are distinct provenance states.
- A valid credential proves integrity/issuance/revocation state, not factual truth or legal eligibility.
- No PII on chain. Public verification uses a minimal allowlist.
- Demo/Testnet Simulation is visible wherever simulated results appear.
- No API keys, service-role keys or private wallet keys in browser bundles, commits or chat.

## Golden path
Mixed-language worker statement → extracted facts → clarification → user confirmation → credential/hash → Amoy or labelled simulation → potentially relevant support → attach evidence → simulated application → visible/live status update → QR/public verification → revocation.

## Current progress
- Repository inspected: empty, default branch main; connected account has push access.
- Build plan created before implementation.
- Phase 1 foundation implemented: shell, API conventions, environment validation, initial SQL migration, CI, documentation and tests.
- Lint, typecheck, 6 tests and production build passed. Browser E2E/visual checks remain blocked by an invalid Chromium download.
- Phase 2 awaits the user-owned Supabase setup described in docs/setup.md, per the brief’s human-in-the-loop instruction.
- Phases 2–12 pending; no hosted integration or deployment is claimed.
