# SANAD — Author Action List (ISDIA 2027)

Items only a human author can resolve. The revised paper
(`SANAD_ISDIA_2027_Revised_v2.docx`, round 2) is NOT submission-ready until #1
and #2 are done. Rename it to `SANAD_ISDIA_2027_Revised.docx` after closing the
older copy in Word.

1. **Author e-mails (submission-blocking).**
   ISDIA's submission guidelines state: "All authors name, affiliation and mail ids
   must be specified; do not mention designation." No e-mail line was printed in the
   revised copy (the old `{to be supplied by the authors}` placeholder was removed per
   the revision instructions, and inventing addresses is not allowed). Before
   submitting, add the four authors' real e-mail addresses to the title page —
   ask the assistant to rebuild the DOCX with them (a one-line change in
   `paper/build_paper.py`).

2. **AI-use policy (acceptance risk — authors' decision).**
   ISDIA's editorial policy states the work "must be original (not machine
   generated)" and that papers traced as AI-generated "will be dropped"; the site
   offers no disclosure mechanism. This manuscript was drafted with substantial
   AI assistance. The human authors must review, take ownership of, and adapt the
   text to satisfy this policy before submission. This is an authorship-integrity
   decision we cannot make for you.

3. **Corresponding author.**
   The site does not define a corresponding-author convention; if the CMT form or
   the camera-ready template asks for one, designate it among the authors.

4. **Confirm the affiliation of Prof. Haitham Yash** as currently printed
   ("University of Wollongong in Dubai") and that all four author names are spelled
   exactly as the authors want them published (no designations, per guidelines).

5. **Deadline.** ISDIA-2027 Phase-II full-paper submission is **15 Oct 2026**
   (Phase-I 15 Sep 2026 already passed; notices are on a rolling basis). Submission
   is via Microsoft CMT: cmt3.research.microsoft.com/ISDIA2027.

6. **Leaked credentials (project risk, unrelated to paper but still open).**
   The wallet private key, Supabase service key and Gemini key that entered git
   history still need rotation on your accounts (force-push is forbidden by the
   repo agreement, so history cannot be rewritten). Rotate only on the provider
   side (Google/Supabase/wallet); your local `.env.local` keys are yours and are
   never touched or removed by repo tooling.

7. **Re-check the deployment before camera-ready.** Run
   `node scripts/verify-bytecode.mjs 0x13798285e9fa1aCd15930e8D510A34BB983F1484 https://polygon-amoy-bor-rpc.publicnode.com`
   (read-only) and, if you want explorer-grade evidence, do the one-time
   standard-json source verification on polygonscan.com/amoy yourself.

8. **Verify the MOHRE/u.ae catalogue freshness** before the conference: the paper
   states URL freshness is unverified (Table 2).
