# Validation log — 25 September 2026

- `npm run lint`, `npm run typecheck`: passed.
- `npm test`: 12 tests passed, including migration/RLS harness, phonetic mixed-language extraction, hash tampering and curated matching.
- `npm run test:contract`: passed with local compiled Solidity and Ganache; outsider issuance/revocation rejected.
- Contract registry now also asserts a positive on-chain issue timestamp. The Amoy deployment script loads `.env.local` when present; live deployment remains unexecuted.
- `npm run build`: passed; all UI and API routes built.
- `npm run test:integration`: complete local API golden path passed (analysis → confirmation → credential → source match → evidence upload/analysis/attachment → simulated application → notification → public/QR verify → revoke); a second demo user was denied access and admin requests were forbidden.
- `npm run test:e2e`: 6 passed, desktop and mobile Chromium, covering navigation, complete golden-path UI and responsive width. Local Chromium was extracted from the packaged test binary because Playwright's direct download returned an invalid archive in this environment.
- Hosted-mode UI smoke check with `SANAD_MODE=supabase` and no credentials: `/` and `/onboarding` returned 200 with no Try Demo action; `/api/health` returned 503 rather than claiming a missing database was connected. This does not test SANAD_2 itself.
- Live Supabase/Auth/Storage, remote AI provider calls, deployed Polygon Amoy transaction, Vercel URL, manual screen-reader review and complete translation: **not executed** without user-owned accounts/keys/deployment. These are remaining release gates, not simulated successes.

CI runs independent checks from a clean checkout. Check the GitHub Actions run for the latest commit separately.
