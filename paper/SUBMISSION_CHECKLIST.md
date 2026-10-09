# Submission Checklist — ISDIA-2027 (Springer LNNCS)

Verified against isdia.org on 2026-10-09. Conference: 11th International
Conference on Information System Design and Intelligent Applications,
Sofitel Dubai Jumeirah Beach, 9–10 Jan 2027. Proceedings: Springer **Lecture
Notes in Networks and Systems (LNNCS)**. Submit via Microsoft CMT:
cmt3.research.microsoft.com/ISDIA2027.

| # | Requirement (official) | Status | Note |
|---|---|---|---|
| 1 | Springer format / official template | PASS | Built on the Springer LNCS Word template. ISDIA's proceedings series is LNNCS, not LNCS — confirm the camera-ready uses the LNNCS template if a different one is linked on CMT. |
| 2 | 10–12 pages (camera-ready) | PASS | Rendered PDF = **12 pages**. Short papers (<10 pp) may not be considered; we are at the top of the range. |
| 3 | 3–5 keywords after abstract | PASS | Exactly 5. |
| 4 | Abstract, no sub-headings, no disconnected words | PASS | 147 words, single justified block, no headings. |
| 5 | All author names, affiliations, **mail ids**; no designations | **BLOCKED** | Names + affiliations present, no designations. E-mails are mandatory and must be supplied by the authors (see action list #1). No placeholder is printed in the copy. |
| 6 | Complete references (year, vol., issue, pages where applicable) | PASS* | 11 references, all live-verified; numbered LNCS style, every in-text cite maps to a reference and vice-versa. Web-first sources carry URLs + access dates instead of vol/pages (appropriate). |
| 7 | Original work, **not machine generated** | **AUTHOR RISK** | ISDIA drops papers traced as AI-generated; no disclosure path exists. Authors must review/own the text. See action list #2. |
| 8 | Figures legible at paper size | PASS | Fig 1 at 12.2 cm, Fig 2 montage ~305 dpi source, Fig 3 charts legible; captions self-contained. |
| 9 | No PII / secrets in screenshots | PASS | Reviewed all four panels: no keys, tokens, emails or personal data. |
| 10 | Submission window | NOTE | Phase-I 15 Sep 2026 (passed); **Phase-II 15 Oct 2026**; notices rolling; final acceptance 15 Dec 2026. |

## Remaining risks to acceptance
1. **AI-generated-content policy** — the single largest risk; only the human
   authors can mitigate it by reviewing and taking ownership of the prose.
2. **Missing author e-mails** — blocks a compliant submission outright.
3. **Template series mismatch** — LNCS vs LNNCS; verify the exact template
   linked in the CMT submission instructions before camera-ready.
4. **Novelty framing** — honest-limitations style is a strength with most
   reviewers but can read as "no results" to some; the 12/12 suite, live RLS
   tests and 16/16 benchmark are the counterweight — keep them prominent.
5. **12-page ceiling** — any author-added e-mail lines or reviewer-requested
   additions could push to 13; trim Sect. 7 first if needed.

## Files
- Manuscript: `SANAD_ISDIA_2027_Revised.docx` (root)
- Rendered PDF: `paper/SANAD_ISDIA_2027_Revised.pdf`
- Previews: `paper/preview_isdia/p01..p12.png`
- Builder: `paper/build_paper.py` (set `SANAD_PAPER_OUT` to change output name)
- Change log: `paper/CHANGELOG_ISDIA.md`
- Verification: `paper/VERIFICATION_REPORT.md`
- Author actions: `paper/AUTHOR_ACTION_LIST.md`
