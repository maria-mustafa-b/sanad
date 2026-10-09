# SANAD — ISDIA 2027 Author Actions (blocking items before upload)

Manuscript is build-complete and template-compliant (`SANAD_ISDIA_2027_Final.docx`,
12 pages). The items below need human decisions or accounts and could not be done by
tooling. Deadline: **Phase-II submissions close 15 October 2026** (6 days from 9 Oct).

## 1. Author e-mails (required by ISDIA editorial policy) — BLOCKING

ISDIA: "All authors name, affiliation and mail ids must be specified." No e-mails were
invented. Actions:

- **Sanmeet Singh Kohli** — confirm `sanmeetsinghkohli@gmail.com` (found in this
  repository's git history) is the address you want published.
- **Maria Mustafa** — confirm `mariabaranwala@gmail.com` (found in git history).
- **Sakshi Himpalnerkar** — provide e-mail (no project evidence exists).
- **Haitham Yash** — provide e-mail (no project evidence exists).

Then add the e-mail line to the title page in `paper/build_paper.py` (authorinfo block),
rebuild (`PYTHONIOENCODING=utf-8 SANAD_PAPER_OUT="SANAD_ISDIA_2027_Final.docx" python
paper/build_paper.py`) and re-export the PDF. Adding four e-mail lines may push the
document past 12 pages — re-check the exported PDF page count afterwards.

## 2. Corresponding author asterisk — BLOCKING

ISDIA requires the corresponding author to be marked with an asterisk. No choice was
assumed. Decide who is corresponding, then mark them in the builder (change their
superscript from `1`/`2` to `*` and add the asterisk footnote with their e-mail).

## 3. AI-assistance / originality position — BLOCKING

ISDIA editorial policy: "The work must be original (not machine generated)"; AI-found
content can lead to removal from proceedings. The text is written in the authors'
voice and every claim is evidence-backed, but the **authors must read the full
manuscript, be able to defend every section, and decide their disclosure position**
on tooling assistance consistent with the policy. Do not submit text no author has
reviewed line by line.

## 4. Similarity check — before upload

Run the manuscript through Turnitin/iThenticate per the conference's similarity
process (institutional access usually suffices) and keep the report. Nothing in the
revision was written to evade detection; a clean report is the authors' evidence.

## 5. Submission logistics — by 15 October 2026

- Submission is via **Microsoft CMT — `cmt3.research.microsoft.com/ISDIA2027`** (found
  on the ISDIA site during the round-1 audit; it was not repeated on the
  important-dates/editorial-policy/call-for-papers pages re-checked this round).
  Confirm you can open the CMT page and check whether review is single- or
  double-blind (if blind, the conference page will say whether to strip author names).
- Upload `SANAD_ISDIA_2027_Final.docx` (Word, LNCS template — not the PDF, unless the
  portal asks otherwise). Do **not** submit the older `SANAD_ISDIA_2027_Revised_v2.docx`.
- After acceptance (final notices are rolling; final acceptance 15 Dec 2026): produce
  the Springer **CRC** version and do **not** upload the CRC file to the portal
  (explicit ISDIA rule).
- Register at least one author for the hybrid event **9–10 January 2027** and plan
  for in-person or virtual presentation as the rules specify.

## 6. Verify the reproducibility artifacts you are claiming

- Benchmark: confirm you are happy publishing the numbers from
  `paper/eval_results.json` (run 2, headline: 16/16 hit@1/@3, mean grounding 2.69,
  median 1468 ms) and `paper/eval_results_run1_saved.json` (run 1: 2.63, 1378 ms).
- Contract: re-run `node scripts/verify-bytecode.mjs 0x13798285e9fa1aCd15930e8D510A34BB983F1484 https://polygon-amoy-bor-rpc.publicnode.com`
  yourself; the paper's bytecode-equivalence claim rests on it.

## 7. Carry-over security item (from earlier review rounds)

Provider-side rotation of any keys that ever entered git history still stands as a
team task. Per the owner's standing instruction, the local `.env.local` keys are
**not** to be deleted or edited — rotation happens only at the provider.
