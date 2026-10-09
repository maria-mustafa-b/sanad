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
