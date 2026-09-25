# SANAD | سند
Understand your situation. Prove what matters. Find the support you need.

A hackathon project connecting multilingual situation understanding, user-confirmed claims, portable credentials and accessible support-service journeys.

## Current status — foundation implemented; integrations pending
Working: responsive Next.js frontend, local-only situation input example, trust-model explanation, health API, environment validation, initial relational migration, automated configuration and database-isolation tests, CI configuration.

Not yet implemented: login, AI extraction, persisted claims, credential issuance, Solidity/Amoy transactions, service retrieval, document upload, applications, admin, public credential lookup or deployed hosting. The example is illustrative and never passed off as AI analysis. See docs/BUILD_PLAN.md.

## Run locally
Requires Node.js 22+ and npm.

```bash
git clone https://github.com/maria-mustafa-b/sanad.git
cd sanad
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The foundation works without secrets. Keep `.env.local` private.

## Verify
```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests require a working Chromium download. Current local results and limitations are in docs/VALIDATION.md. CI performs these checks on pushes and pull requests; a workflow file alone does not mean a successful CI run.

## Stack and architecture
Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-compatible Radix/CVA UI primitives, Zod, Supabase/PostgreSQL. Planned configurable AI adapters and Polygon Amoy credentials. See docs/architecture.md, docs/database.md and docs/setup.md.

## Trust model
User-reported → AI-extracted → user-confirmed are separate evidence stages. Issuer verification requires actual evidence and an authorized issuer. A valid credential proves integrity and issuance, not factual truth or service eligibility. No personal information belongs on-chain. Simulated government applications and blockchain results must be labelled.

## Development
Logical milestone commits are pushed to main after checks. Secrets, user documents and real personal data must never enter Git. External account configuration pauses follow the original brief. Vercel/Supabase/Amoy deployment is phase 12 and is not yet performed.
