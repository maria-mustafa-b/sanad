# Change Log — SANAD paper, ISDIA 2027 revision (v2 → SANAD_ISDIA_2027_Revised)

Baseline: `SANAD_Research_Paper_v2.docx` (kept unchanged). Revised copy built from
the same `paper/build_paper.py` (extended), same LNCS template, same figures.

## Submission-critical
- **Keywords trimmed 7 → 5** (electronic government, verifiable credentials,
  blockchain, large language models, United Arab Emirates) to meet ISDIA's
  "three to five keywords" rule.
- **E-mail placeholder removed** from the title page; real addresses are tracked
  in `AUTHOR_ACTION_LIST.md` (ISDIA requires mail ids — blocking until supplied).
- Page count on the rendered document: **12 pages** (ISDIA camera-ready
  limit is 10–12; verified on the Word-exported PDF, not word count).

## Claim-accuracy corrections (per master-prompt §3–§7)
- **Contribution 1 (Sect. 1):** "hallucinated services are structurally
  impossible" → out-of-catalogue services cannot reach the user, but an
  incorrect match to a valid catalogue entry remains possible (cross-referenced
  to Sect. 6.1).
- **Sect. 2.1:** "the ledger cannot be used to learn, correlate or enumerate
  anything about the holder" → narrowed to what is actually true: the ledger
  reveals no claim content and resists dictionary enumeration.
- **Sect. 2.3:** "publishable without consent risk" → "reduces – though does
  not eliminate – consent risk"; "grounded by construction" → "outputs are
  constrained to a curated catalogue". Added in-text reference to Table 1.
- **Sect. 4.2:** Listing 1 explicitly labelled an **abridged excerpt** (the
  constructor, Revoked event and revoke body with NotIssued/AlreadyRevoked
  guards are omitted; full source in repo). Added: the issuer account is the
  project team's wallet, **not a government authority**; an anchor is not
  official verification.
- **Sect. 4.4:** new paragraph on what salted digests do **not** hide:
  public transaction metadata (issuer address, event ordering, timestamps),
  logs/session identifiers/wallet as potentially personal data under PDPL,
  model-provider transmission of situation text and documents governed by
  provider retention terms, and the statement that a digest is a commitment
  to a representation, not anonymity or truth.
- **Sect. 5:** added that grounding excludes invented services but not
  wrong-but-valid catalogue choices.
- **Sect. 6:** disclosed that the deployed contract's source was **not**
  verified on a block explorer; local/deployed equivalence rests on the ABI
  preflight alone.
- **Sect. 6.1 (benchmark consistency):** the "five input languages" list that
  named six varieties is reconciled: **five input-language groups covering six
  written varieties** — English (11), Hinglish + Roman Urdu (2, grouped as
  Latin-script mixed transcriptions), Arabic (1), Devanagari Hindi (1),
  Bengali (1). Added: single-annotator authorship of cases, deliberate
  English-heavy imbalance with no equal-coverage claim, latency composition
  (server route incl. provider round trip, excl. client rendering), first-try
  success of the final run, and that the two 500s were from earlier
  development runs. "Confirming the structural grounding claim end to end"
  softened to "consistent with the grounding design". In-text reference to
  Figure 3 added.
- **Fig. 3 caption:** now states the n per group and the unbalanced sample.
- **Table 2:** "Proven" → "Verified" throughout (prototype scope); registry
  row says "Amoy ABI preflight".
- **Sect. 7:** ethics paragraph corrected (situation text also goes to the
  provider, not only document images); future-work sentence added (independent
  annotation, ambiguous/out-of-scope/adversarial cases, consented-document
  extraction study).
- **Sect. 8:** "Next steps are a 90-day innovation pilot with a government
  partner" (implied commitment) → "next steps we propose, rather than claim
  as arranged"; benchmark wording updated.
- **Abstract:** rewritten wording to match evidence ("16-case grounded-matcher
  benchmark returns 16 of 16 acceptable top matches"); now **147 words**
  (limit 150).

## References (audited against live sources)
- [1] full survey title + official UN URL added; UAE rank 11 / 0.9533 /
  first in e-Government Literacy sub-index **confirmed** against UN and u.ae.
- [3] corrected to VC Data Model **v2.0**, W3C Recommendation 15 May 2025
  (was "1.0 … (2019)" at a URL that now serves v2.0).
- [4] re-attributed to **MIT Media Lab and Learning Machine** (was "MIT
  Digital Currency Initiative"; t3n paper not cited as it could not be
  confirmed as a primary record).
- [5] corrected to sole author **Bapat, C.** (was "Bapat, P., et al.");
  Sect. 2.1 wording adjusted (short paper, not a survey).
- [6] full author list added (Sheth, Sinha, Patil, Beniwal, Singh) — verified.
- [7] official name "Concerning the Protection…" + uaelegislation.gov.ae URL.
- [8] W3C Recommendation date 5 Oct 2023 stated.
- [9] bitcoin.org PDF URL added.
- [11] **new**: UAE MOFA Facts & Figures as the source anchor for the
  "roughly 88% foreign-born" indicative figure in Sect. 1.
- Every in-text citation [1]–[11] has a reference and vice-versa (checked).

## Unchanged (verified, no discrepancy found)
- Tech-stack facts (Next.js 16, ethers v6, AI SDK + Zod, Supabase RLS, chain
  ID 80002, 28-entry catalogue, 5 locales + voice via browser SpeechRecognition,
  24 routes, 12/12 Vitest incl. live-PostgreSQL RLS).
- Benchmark numbers (re-checked against `paper/eval_results.json`: 16/16,
  0 out-of-catalogue, 2.63 avg, median 1378 ms, range 1056–2120 ms).
- Figures 1–3, Tables 1–2 content, section structure, LNCS styling.
- Screenshots reviewed: no keys, tokens or personal data visible.

## Round 2 — external review (scored 8.2/10) addressed in `SANAD_ISDIA_2027_Revised_v2.docx`
- **Page-count mystery resolved.** The reviewer saw 15 pages: that is Word's
  `ComputeStatistics` pre-layout estimate. The fixed-layout export
  (Word → PDF, cross-checked with two independent PDF readers) is **12 pages**
  — inside ISDIA's 10–12 camera-ready window. No content was cut for pagination.
- **Sect. 2.1** "reveals no claim content" → "the design is intended to prevent
  direct disclosure of claim contents through the public artifact and to resist
  dictionary enumeration", cross-referenced to the Sect. 4.4 caveats.
- **Sect. 4.4 observer** "cannot learn, correlate or enumerate holders or
  claims" → narrowed to "cannot recover claim content by dictionary guessing"
  (metadata correlation is explicitly conceded in the same paragraph).
- **Sect. 4.4 deletion semantics** corrected against the code: the only
  user-facing deletion implemented is document deletion
  (`lib/api/domain-router.ts`, `deleteDocument`); claim-level deletion of
  snapshots/salts is labelled a designed control the prototype does not yet
  ship, with the exact semantics stated (deletion removes nothing on-chain; it
  only withdraws recompute ability, making the anchor unverifiable).
- **Sect. 4.4 provider flow** named: Google's Gemini API reached through the
  Vercel AI SDK, and stated to be outside RLS's protection entirely.
- **Sect. 6 deployment verification upgraded**: from "ABI preflight alone" to
  a read-only **bytecode-equivalence check** (`scripts/verify-bytecode.mjs`):
  deployed runtime at `0x13798285e9fa1aCd15930e8D510A34BB983F1484` (Amoy
  80002) is identical to the locally compiled `SANADCredential.sol` once solc
  CBOR metadata and the deploy-time immutable-issuer literal are normalised
  out. Block-explorer source verification is still disclosed as not performed.
- **Benchmark genuinely re-run** before submission (review item 7): run 2
  reproduces 16/16 hit@1, 16/16 hit@3, 0 out-of-catalogue ids; aggregates
  shifted slightly (2.69 vs 2.63 matches/case; median 1468 vs 1378 ms; range
  1217–1910 vs 1056–2120 ms). Sect. 6.1 and Fig. 3 now report run 2, and a new
  reproducibility sentence reports the delta honestly and notes both raw JSON
  files ship with the harness (`eval_results.json`,
  `eval_results_run1_saved.json`). No numbers were hand-edited.
- **Figure resolution** (review item 8): all three figures re-rendered at 2×
  raster scale — fig1 2928×1320 (~610 dpi at 12.2 cm), fig2 3879×2759 from
  device-scale-factor-3 screenshots (~800 dpi effective), fig3 2600×1560
  (~540 dpi). ISDIA's site states no dpi rule (defers to Springer); all
  figures now exceed Springer's 300 dpi guidance. Fig. 2 toolbar crop fixed
  (translate bar fully removed, app headers intact).
