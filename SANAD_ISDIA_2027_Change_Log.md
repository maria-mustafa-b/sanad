# SANAD — ISDIA 2027 Final Submission: Change Log (Round 3)

Date: 2026-10-09
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
