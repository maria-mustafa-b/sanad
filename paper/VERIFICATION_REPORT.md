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
- Benchmark: two genuine live runs, both raw files shipped. Run 1
  (`paper/eval_results_run1_saved.json`): 16/16 hit@1, 16/16 hit@3, 0
  out-of-catalogue, 2.63 avg matches, median 1378 ms, range 1056–2120 ms.
  Run 2 (`paper/eval_results.json`, re-run shortly before submission and
  reported as the headline in Sect. 6.1/Fig. 3): identical hit@1/hit@3/
  out-of-catalogue results; 2.69 avg matches, median 1468 ms, range
  1217–1910 ms. Language counts (11/2/1/1/1) match per-case `lang` fields
  in both runs. Both runs used model `gemini-flash-latest` with 16/16
  first-try API success. No number was hand-edited.
- Deployed contract (round 2): live read-only checks against Amoy via
  `https://polygon-amoy-bor-rpc.publicnode.com` — code exists at
  `0x13798285e9fa1aCd15930e8D510A34BB983F1484` (1009 bytes), `issuer()`
  returns `0x09ae9a82d13ac708ffe68ed4e7139ea68554da50`, and a
  **bytecode-equivalence check** (`node scripts/verify-bytecode.mjs
  <address> <rpc>`) confirms the deployed runtime is a substring of the
  locally compiled `SANADCredential.sol` creation code after stripping the
  CBOR metadata hash and normalising the immutable-issuer PUSH32 literal.
  (`rpc-amoy.polygon.technology` was unresolvable from this network; the
  publicnode endpoint was used instead.)
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
- Deployed contract — interface agreement (ABI preflight) **and** runtime
  bytecode equivalence are verified (see above); what remains unperformed is
  third-party **source verification on a block explorer**, which Sect. 6 of
  the paper discloses explicitly.
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
- Whether specific credential IDs still hold issued records on Amoy (the
  contract's existence, interface and bytecode are re-verified today; a
  per-credential status sweep was not re-run).
- ISDIA review anonymity (double/single-blind): not stated anywhere on
  isdia.org; author details are required, suggesting non-blinded.

## ROUND 2 — checks added for the external review (2026-10-09, later run)
- **Page count (review item 1).** The "15 pages" is Word's
  `ComputeStatistics(2)` pre-layout estimate. The authoritative fixed-layout
  render (Word `ExportAsFixedFormat` → PDF) is **12 pages**, confirmed by two
  independent PDF readers with clean per-page content flow. 12 ≤ ISDIA's
  stated 10–12 camera-ready window.
- **Deletion semantics (item 4).** Code inspection: the only implemented
  user-facing deletion is document deletion (`deleteDocument` in
  `lib/api/domain-router.ts`); no claim/snapshot/salt deletion path exists.
  Sect. 4.4 now states this and the resulting semantics (anchor becomes
  unverifiable, not deleted).
- **Provider data flow (item 5).** Situation text and documents are sent to
  Google's Gemini API through the Vercel AI SDK (`@ai-sdk/google`,
  `generateObject`); confirmed in `app/api/services/match/route.ts` and
  `lib/api/*`. Sect. 4.4 names the provider and states this is outside RLS.
- **Benchmark integrity (item 7).** Run 2 was executed against the live
  local endpoint (server started from the committed build, port 3111);
  raw JSON preserved; paper text generated from the JSON, never hand-typed.
- **Figures (item 8).** Effective print resolution recomputed from final
  PNG pixel sizes at 12.2 cm column width: fig1 ~610 dpi, fig2 ~800 dpi,
  fig3 ~540 dpi — all above Springer's 300 dpi guidance; ISDIA's site itself
  states no dpi rule. Fig. 2 crop bug (translate-toolbar border and a
  half-sliced nav on the verifier panel) fixed; all four panels visually
  re-inspected.
- **Mocked vs live (item 11).** Vitest 12/12 runs against a live local
  PostgreSQL for the RLS isolation tests; the ABI preflight and benchmark
  hit the live Amoy RPC and live local API respectively; the bytecode check
  is a code check, not a security audit — the paper says so.
