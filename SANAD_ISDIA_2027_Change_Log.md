# SANAD — ISDIA 2027 Final Submission: Change Log

## Round 5 (2026-10-14): authors' architecture diagram, name fix, humanizer pass

- **Fig. 1 replaced with the authors' own system-architecture diagram** (the one embedded
  in `SANAD_ISDIA_2027_Reviewed.docx`). The embedded image was a Mermaid render
  1055 px wide (about 220 dpi at the 12.2 cm column, below ISDIA's 800 dpi rule) on a
  black background, with icon codes printed as literal text ("fa:fa-shield-halved",
  "fa:fa-robot", ...). It was redrawn, not pasted: same four numbered groups (User
  Interface & Input; Application Backend; AI Processing & Gov.-Service Navigation;
  Storage, Credential Issuance & Evaluation), same nodes, flows, legend (solid = runtime,
  dotted = non-runtime, dashed border = external boundary, cylinder = storage) and the
  same five notes. Laid out landscape so it fits the column without adding a page.
  Source: `paper/make_fig1_user.py` -> `paper/fig1_architecture_user.png`,
  4392x1920 px = 914 dpi at 12.2 cm. The extracted original is kept at
  `paper/reviewed_media/image1.png`.
- **Fig. 1 caption and the Sect. 3 lead-in** rewritten to describe the four layers. The
  caption keeps the boundary facts: snapshot and salt stay off-chain; only an opaque
  identifier and a SHA-256 commitment reach the testnet contract, which attests existence
  and revocation status, never content or truth.
- **Fourth author renamed "Haitham Yaish"** (was "Yash"), as instructed by the authors.
- **Humanizer pass 2** (humanizer skill invoked explicitly). Removed every spaced-hyphen
  dash in the prose, the "Crucially" opener, staged contrasts ("not mitigated away",
  "rather than polish", "rather than hidden"), the "what ... does not hide is equally
  important" run-up, and the closing send-off line of the Conclusion ("We invite
  evaluation ... none overstated"). No number, citation, caveat or claim was changed.
- **Layout fixes:** table cells are now left-aligned (Table 1 had justified gaps such as
  "PII  /  content"); tables are kept on one page (Table 2 had split across pages 10-11);
  Listing 1 now breaks before `status()` instead of orphaning two closing braces.
- **Result:** 12 pages (PyMuPDF on the exported PDF), abstract 150 words.

## Round 4 (2026-10-14): external audit pass

An external editorial audit (8.2/10-style review, scored Technical 8 / Evaluation 6 /
Security 8 / Impact 4) was executed as a work order. Note: the audit reviewed an **older
16-page copy** (`SANAD_ISDIA_2027_Reviewed.docx`), so several of its items (page count,
[1, 2] citation merging, UN-ranking attribution, separated §6 check categories) were
already satisfied in the 12-page Final. Items that applied were fixed:

- **Zero-PII scope in the abstract.** The abstract was rebuilt into design /
  implementation / evaluation sentences (reviewer's structure request) and now states
  "Zero-PII scopes to the public anchor; application data remains personal and
  access-controlled." Still 150 words (LNCS cap).
- **Identifier linkability (overclaim removed).** §4.1 previously said hex-padding meant
  "no user-facing identifier appears on-chain" — wrong per `lib/blockchain/chain.ts`
  (UUIDs are zero-left-padded, not hashed, and correlatable). Now states the on-chain
  identifier is deliberately linkable to its credential record, and that the salt
  protects the snapshot digest, not the identifier.
- **Canonicalisation defined precisely.** §4.1 now spells out the encoder (sorted object
  keys, recursive array normalisation, JSON-escaped strings, JSON forms for
  numbers/booleans/nulls) and adds the honest caveat that recomputation is server-side
  through the same code path, so byte-for-byte reproduction by a third-party verifier is
  not guaranteed.
- **Three-property separation.** §5 now distinguishes catalogue validity, recommendation
  relevance and eligibility correctness: first evidenced, second preliminarily tested,
  third not established. Also: confidence values are declared as model scores, not
  calibrated probabilities (matches code: the match route returns High/Medium/Low
  relevance, no calibrated number).
- **Out-of-catalogue metric honesty.** The harness's `out_of_catalog_ids: 0` is a
  by-product of the route filtering non-catalogue ids before responding
  (`paper/eval_match.mjs:78`). §6.1, the abstract and Table 2 now say "0
  out-of-catalogue identifiers delivered (route filter)" and state the result evidences
  the filter, not the model's hallucination rate.
- **Benchmark statistics recomputed from raw observations.** Verified against
  `paper/eval_results.json` and `paper/eval_results_run1_saved.json`: 16/16 hit@1 and
  hit@3, 0 errors, all first-try. Mean services returned per case 2.69 (run 2) / 2.63
  (run 1) confirmed; the paper now also reports that on average 2.38 of the returned
  services per case lie within the acceptable set. Medians are now computed with the
  standard definition from the 16 per-case latencies: 1468 ms (run 2, from 1467.5) and
  **1376 ms** (run 1; the saved summary's 1378 was an upper-middle convention). Fig. 3
  footer updated to match ("0 out-of-catalog IDs delivered", "2.69 services/case");
  chart, footer and caption still describe run 2.
- **Reproducibility artifacts.** Confirmed the saved files contain all 16 inputs,
  acceptable-id label sets, returned ids and per-case timings; `eval_match.mjs` now also
  archives the full raw model response per case for future runs. Limitation unchanged:
  the two already-saved runs do not contain raw response bodies.
- **Contract test coverage extended.** The audit's checks were verified against
  `contracts/SANADCredential.sol`: immutable constructor-assigned issuer, revoke guards
  (NotIssued/AlreadyRevoked), one-way revocation, hash never overwritten, issuedAt==0
  sentinel safe (no caller-supplied timestamps). Two claims were only partly covered by
  tests (revoking an unknown id; digest immutability asserted after revoke) — both tests
  were added and the suite passes (`node tests/contract/registry.mjs`, 8 checks).
- **Citation and terminology polish.** Multi-citations merged to LNCS form ([1, 2],
  [3, 4]); ref [5] corrected to Bapat, C.P. per the arXiv record; "live production
  endpoint" → "live application endpoint" (testnet prototype); introduction gap wording
  softened from asserted prevalence to design motivation; spelling audit confirmed
  consistent British -ise forms + "artifact" throughout.
- **Prose pass used the humanizer skill** (AI-tell removal without content change):
  long abstract sentence split; no staging contrasts, closers or triads added; all
  numbers, citations and caveats preserved.
- **Rebuilt and revalidated:** `SANAD_ISDIA_2027_Final.docx` / `.pdf` — **12 pages**
  (Word-exported PDF, PyMuPDF count), Listing 1 break still clean, abstract 150 words,
  figures unchanged at ≥800 dpi.
- **Open author item surfaced by the audit:** the reviewed copy spells the fourth author
  "Haitham **Yaish**"; every project artifact says "Haitham **Yash**". The repo spelling
  was kept — authors must confirm the correct legal spelling before upload.

## Rounds 1–3 (2026-10-09)

Deliverables created (existing manuscript files were **not** overwritten):

- `SANAD_ISDIA_2027_Final.docx` — final manuscript, Springer LNCS template
- `SANAD_ISDIA_2027_Final.pdf` — Word-exported PDF used as the page-count ground truth
- `SANAD_ISDIA_2027_Change_Log.md` — this file
- `SANAD_ISDIA_2027_Submission_Checklist.md`
- `SANAD_ISDIA_2027_Author_Actions.md`

Prior rounds remain in place for history: `SANAD_ISDIA_2027_Revised_v2.docx`,
`paper/SANAD_ISDIA_2027_Revised.pdf`, and the round-1/round-2 reports under `paper/`.

## 1. Page-count claim resolved (no formatting tricks)

The earlier "15 pages" report came from Word's `ComputeStatistics` field, which is a
pre-layout estimate and is unreliable for this document (it now reports 16 for the
12-page final). The authoritative measurement is the Word-exported PDF:
`SANAD_ISDIA_2027_Final.pdf` = **12 pages** (counted programmatically with PyMuPDF,
and matching the user's own Word display). ISDIA requires at least 10 pages on the
Springer template; papers beyond 12 pages incur extra-page fees. 12 pages is compliant.
The page reduction was achieved only by honest prose trimming (round 2) and by fixing
one bad page-break behaviour (below) — no font, margin or spacing manipulation.

## 2. Listing 1 page-break fix

The abridged Solidity listing previously left an orphaned `}` alone at the top of
page 7 (and an over-bound variant pushed the whole block to a new page, creating a
13th page). Fixed by binding only the final two code lines to the caption
(`keep_with_next` on the last two paragraphs). Verified in the final PDF: page 6 ends
mid-listing with ~2.5 cm bottom whitespace (normal for a long listing), page 7 opens
with the paired closing braces followed immediately by "Listing 1." — no orphans,
no whole-block jumps, no other page affected.

## 3. Author e-mails — not fabricated

ISDIA requires all author e-mails on the title page. No verified e-mail exists in the
project for two of the four authors, so none were invented. Repository evidence found
(from git history, pending author confirmation): Sanmeet Singh Kohli —
`sanmeetsinghkohli@gmail.com`; Maria Mustafa — `mariabaranwala@gmail.com`. No evidence
for Sakshi Himpalnerkar or Haitham Yash. The title page therefore currently carries
names and affiliations only; e-mails and the corresponding-author asterisk are listed
as blocking author actions (`SANAD_ISDIA_2027_Author_Actions.md`).

## 4. Reference re-audit (live checks, round 3)

- **[1] UN E-Government Survey 2024.** The survey itself confirms the UAE as
  *highest-ranked country in Western Asia* with an EDGI of **0.9533**; the "11th
  worldwide / 1st in e-Government Literacy" figures are the UAE government's own
  account (ref [2], u.ae). §1 now attributes each claim to the correct source.
- **[6] Code-switched NLP survey.** Corrected author list (4th author is
  **H. Beniwal**, not "B. Himanshu"-style error), corrected title ("A Survey **on**
  Code-Switched NLP…"), and upgraded from the arXiv preprint to the **ACL 2026 Long
  Papers** version with DOI `10.18653/v1/2026.acl-long.386` (verified against
  Crossref).
- **[11] UAE population.** The MOFA "Facts and Figures – Population by Nationality"
  page lists 947,997 nationals vs 7,316,073 non-nationals (2017); it does **not**
  state "88%". §1 now says the majority-foreign-born character is "the government's
  own account [11], a figure commonly cited at roughly 88%" — derivable from, but not
  printed by, the source.

## 5. Figures — 800 dpi requirement found and met

**Correction to an earlier report:** `paper/SUBMISSION_CHECKLIST.md` (round 2) stated
the ISDIA site has no dpi rule. That was wrong — isdia.org/editorial-policy states
"The figures given in the papers should be 800dpi." All three figures were
regenerated at 3× supersampling and their **actual embedded pixel dimensions were
measured** in the final DOCX:

| Figure | Pixels | Effective dpi at 12.2 cm column |
|---|---|---|
| Fig. 1 architecture | 4392 × 1980 | **914 dpi** |
| Fig. 2 prototype screens | 3879 × 2759 | **808 dpi** |
| Fig. 3 benchmark | 3900 × 2340 | **812 dpi** |

Fig. 2 was re-cropped so the app toolbar is intact and the /verify panel is not cut.
Fig. 3's chart, in-figure footer statistics and PDF caption all describe the **same
run** (run 2: 16/16 hit@1 and hit@3, 0 out-of-catalogue, mean grounding score 2.69,
median latency 1468 ms, range 1217–1910 ms); run 1 (2.63 / 1378 ms) is preserved in
`paper/eval_results_run1_saved.json` and reported in §5 as the repeat run. No measurement
was hand-edited.

## 6. Writing and qualification pass

- Abstract trimmed to **149 words** (LNCS limit 150), opener made accurate
  ("among the world's leading digital governments").
- "Zero-PII" is now consistently qualified as a statement about the **public
  artifact**, not a legal conclusion (§2.1, §4.4, §6 limitations), including the
  wallet-address/session-metadata caveat.
- §4.4 privacy wording: a salted digest means an observer "cannot recover claim
  content through a dictionary attack" (was overclaiming resistance).
- All limitations added in rounds 1–2 retained (single annotator, unbalanced language
  sample, issuer-key trust, deletion not yet shipped, chain attests existence not
  truth).
- On-chain claim re-verified: deployed bytecode at
  `0x13798285e9fa1aCd15930e8D510A34BB983F1484` (Polygon Amoy) is byte-identical to the
  locally compiled `SANADCredential.sol` (`node scripts/verify-bytecode.mjs …`,
  publicnode RPC).

## 7. Ethics / AI-policy posture

No content was fabricated; every number traces to `paper/eval_results*.json`, the
repository, or a live-checked public source. No similarity-manipulation techniques
(paraphrase-to-evade, citation padding, hidden text) were used. ISDIA's editorial
policy requires original, non-machine-generated work: the authors must review and own
the final text and decide their AI-assistance disclosure position — recorded as an
author action, not resolved by this tooling.
