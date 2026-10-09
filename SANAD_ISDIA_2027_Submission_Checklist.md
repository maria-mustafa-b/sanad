# SANAD — ISDIA 2027 Submission Checklist (Final, Round 3)

Manuscript: `SANAD_ISDIA_2027_Final.docx` / `SANAD_ISDIA_2027_Final.pdf`
Checked against: isdia.org — *important-dates*, *editorial-policy*, *call-for-papers*
(retrieved 2026-10-09). Status legend: ✅ verified met · ⚠️ author action required ·
❓ could not be verified from the official pages checked.

## Template and structure

| Requirement | Status | Evidence |
|---|---|---|
| Springer LNCS template (Springer LNNCS proceedings) | ✅ | Built from the official LNCS Word template; A4, 12.2 cm text column, LNCS styles (title/author/abstract/heading1/programcode/figure legend/reference) |
| At least 10 pages on the Springer template | ✅ | 12 pages (Word-exported PDF, counted programmatically; Word's `ComputeStatistics` estimate is pre-layout and unreliable) |
| More than 12 pages incurs extra-page fees | ✅ | Exactly 12 pages — no fee exposure |
| Title, authors, affiliations; **no designations** | ✅ | Four authors with ¹UOWD / ²MIT Chhatrapati Sambhajinagar; no job titles anywhere |
| All author e-mails on title page | ⚠️ | Not fabricated; two candidate addresses from git history await confirmation, two are missing → see Author Actions |
| Corresponding author marked with asterisk | ⚠️ | Decision pending (authors) |
| Abstract ≤ 150 words | ✅ | 149 words (`paper/count_abstract.py`) |
| Keywords | ✅ | 5 LNCS keywords |
| Tables must be editable (not images) | ✅ | Tables 1–2 are native Word tables (DOCX contains 2 `<w:tbl>` objects) |
| Equations MathType-compatible | ✅ | No display equations; all math is inline text |
| Figures at 800 dpi | ✅ | Measured embedded pixels: Fig.1 914 dpi, Fig.2 808 dpi, Fig.3 812 dpi effective at 12.2 cm width |

## Scientific and editorial integrity

| Requirement | Status | Evidence |
|---|---|---|
| Original work, not machine-generated | ⚠️ | Authors must review/own final text and settle AI-assistance disclosure per ISDIA policy; no fabricated content or citations (all 11 refs live-verified, incl. ref [6] upgraded to its ACL 2026 DOI) |
| No similarity manipulation | ✅ | No paraphrase-to-evade, hidden text or citation padding; similarity checker run is still the authors' step (⚠️ below) |
| Claims consistent with evidence | ✅ | Benchmark numbers trace to `paper/eval_results.json` (run 2) and `paper/eval_results_run1_saved.json` (run 1); Fig. 3 chart, footer and caption describe the same run; contract claim proven by bytecode equivalence (`scripts/verify-bytecode.mjs` vs Polygon Amoy `0x1379…1484`) |
| Limitations retained | ✅ | Single annotator, unbalanced language sample, issuer-key trust, deletion not shipped, "verifiable" ≠ factual truth, "zero-PII" scoped to the public artifact |
| Ethics / data protection | ✅ | PDPL discussed as design context, not compliance certification; no public PII; AI demo fallbacks labelled in the product and excluded from credential issuance |

## Process requirements (from official pages)

| Requirement | Status |
|---|---|
| Phase-II submission deadline **15 October 2026** (today is 9 Oct — 6 days left) | ⚠️ upload by authors |
| Rolling review notices; final acceptance 15 December 2026 | ❓ dates noted; process is external |
| At least one author registers and presents (hybrid event 9–10 Jan 2027) | ⚠️ author commitment needed |
| Final accepted (CRC) version must **not** be uploaded to the conference portal | ⚠️ applies at camera-ready stage |
| Similarity check before acceptance | ⚠️ run Turnitin/iThenticate before upload |
| Submission portal (CMT) URL and review anonymity (single/double-blind) | ❓ not stated on the three pages checked — confirm on isdia.org main/submission page |

## Files to submit

Primary: `SANAD_ISDIA_2027_Final.docx` (and the PDF for self-check). The earlier
`SANAD_ISDIA_2027_Revised_v2.docx` is superseded but kept for history — do not submit both.
