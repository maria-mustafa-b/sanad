# Verification Report — SANAD ISDIA 2027 revision

Every substantive paper claim, checked against the repository, live endpoint data,
or external sources (2026-10-09). Re-verified this session: `tsc --noEmit` clean;
ESLint 0 errors / 10 warnings; Vitest 12/12 incl. live-PostgreSQL RLS isolation
(14.95 s); `next build` completes all 24 routes (13 static, 11 dynamic).

## VERIFIED (code, tests, or live data)
- Stack facts: Next.js 16 (16.3.6), React 19, TypeScript strict, ethers v6.17,
  Vercel AI SDK `generateObject` + Zod schema, `@supabase/ssr`, Polygon Amoy
  chain ID 80002. (`package.json`)
- Digest mechanism: `h = SHA-256("SANAD:v1:" ‖ salt ‖ ":" ‖ canonical(snapshot))`,
  32 random bytes salt per credential, recursive key-sorting canonicaliser,
  salt+snapshot in RLS tables only, UUID→bytes32 by hex-pad else SHA-256.
  (`lib/credentials/crypto.ts`, `lib/blockchain/chain.ts`)
- Contract semantics: immutable issuer, onlyIssuer, duplicate-reject, one-way
  revoke, hash never overwritten, Issued/Revoked events.
  (`contracts/SANADCredential.sol` + test harnesses)
- Catalogue: 28 entries; every URL on u.ae or mohre.gov.ae; out-of-catalogue
  ids dropped server-side before rendering. (`lib/services/catalog.ts`,
  `app/api/services/match/route.ts`)
- Honest degradation: 503 without key; sample fallback labelled
  `sample_fallback` at confidence 0; issuance blocked for sample sources.
- Benchmark numbers in Sect. 6.1 and Fig. 3 match `paper/eval_results.json`
  exactly: 16 cases, hit@1 16/16, hit@3 16/16, 0 out-of-catalogue ids, 2.63
  avg matches, median 1378 ms, range 1056–2120 ms, 16/16 first-try in the
  final run, model gemini-flash-latest. Language counts (11/2/1/1/1) match
  per-case `lang` fields.
- RLS isolation, route counts, lint/typecheck/build status (re-run today).
- Voice intake exists (browser SpeechRecognition in `app/chat/page.tsx`);
  5 hand-curated locales + extended machine-translated languages
  (`src/locales/index.ts`).
- References [1],[2],[6],[7],[8],[9],[10] verified live, incl. UAE EGDI 2024
  rank 11 / score 0.9533 / first in e-Government Literacy sub-index.

## PARTIALLY VERIFIED (true with stated caveats — caveats are now in the paper)
- "Zero-PII" — true of the public on-chain artifact only; logs, session ids,
  wallet address and transaction metadata can correlate activity; model
  provider receives situation text and documents under its own terms.
  (Sect. 4.4, new paragraph.)
- Grounding — prevents invented services reaching the user; does not prevent
  a wrong-but-valid catalogue match. (Sects. 1, 2.3, 5, 6.1 wording fixed.)
- Deployed contract — ABI preflight on Amoy confirms interface agreement;
  **on-chain source verification was not performed**, so local/deployed
  equivalence rests on the preflight. (Disclosed in Sect. 6.)
- Listing 1 — abridged excerpt (constructor, Revoked event, revoke body,
  NotIssued/AlreadyRevoked omitted). (Labelled in Sect. 4.2 + caption.)
- Reference [3] updated to VC Data Model **v2.0** (2025 Recommendation; the
  cited URL serves v2.0, not 1.0/2019). Reference [4] re-attributed to MIT
  Media Lab & Learning Machine. Reference [5] corrected to sole author
  **Bapat, C.** (was "Bapat, P., et al."). Added [11] MOFA population source
  for the "roughly 88%" indicative figure.
- Issuer = project team wallet, **not** a government authority; anchors are
  not official verification. (Stated in Sect. 4.2.)

## UNVERIFIED / NOT CLAIMED (paper says so explicitly)
- Factual truth of user claims (chain attests existence only).
- Catalogue URL freshness over time (Table 2).
- Document-extraction accuracy (no consented-document study).
- Real-world usability (no user study).
- Production readiness (testnet; key rotation pending).
- Demo-mode signed cookie as an identity mechanism (hackathon convenience).

## NOT VERIFIABLE THIS SESSION
- Whether the Amoy deployment still holds issued records right now (preflight
  was run at audit time; no block-explorer source check).
- ISDIA review anonymity (double/single-blind): not stated anywhere on
  isdia.org; author details are required, suggesting non-blinded.
