# Setup, secrets and deployment

## Local working demo

Install Node.js 24. Run `git clone https://github.com/maria-mustafa-b/sanad.git`, `cd sanad`, `npm ci`, copy `.env.example` to `.env.local`, then `npm run dev`. Leave `SANAD_MODE=demo` and `BLOCKCHAIN_MODE=mock`. Open http://localhost:3000 and click Try Demo. The server stores fictional local state under ignored `.sanad-demo/`; no external service credentials are needed.

## Supabase hosted mode — your account-owned setup

1. Create or open your SANAD project at https://supabase.com/dashboard. Keep its database password private.
2. In the project SQL Editor run all four files under `supabase/migrations/` **in numeric order**. If you already ran migration 001, start from 002; never repeat 001. Review each file before running it.
3. In project Connect / Settings → API, copy the project URL and publishable/legacy anon key to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in local `.env.local`. Place the legacy service-role key in `SUPABASE_SERVICE_ROLE_KEY` only. Do not put server secrets into `NEXT_PUBLIC_` variables or chat.
4. Set `SANAD_MODE=supabase`. Set `NEXT_PUBLIC_APP_URL` to the exact site origin (e.g. `http://localhost:3000` locally or your deployed HTTPS origin). In Supabase Auth settings allow the site URL and appropriate email confirmation redirect. Email verification may need an SMTP provider for wider use.
5. Sign up in the app and confirm your email if the project requires it. To authorize a trusted admin, run the following manually in SQL Editor after that user exists (replace the email locally): `update public.users set role='admin' where id=(select id from auth.users where email='YOUR_ADMIN_EMAIL');`. Never expose an admin-granting API to ordinary users.
6. Confirm a second account cannot read the first account's claims, documents or credentials. The local RLS harness is not a substitute for this hosted check.

## AI provider (optional demo; required for live AI)

Set `AI_PROVIDER=OPENAI`, `AZURE_OPENAI` or `GEMINI`, `AI_API_KEY` and `AI_MODEL` in the server environment. Azure additionally needs `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_VERSION`. The default local demo rule-based analysis is labelled. Keep provider keys off the client. Document analysis sends a selected document to that provider only after the user chooses Analyze and explicitly checks consent.

## Polygon Amoy (optional testnet)

Create a dedicated testnet wallet privately, fund it with test POL from a legitimate Amoy faucet, and use a reliable chain-ID-80002 RPC endpoint. Set `POLYGON_AMOY_RPC_URL` and `BLOCKCHAIN_PRIVATE_KEY` privately. Run `npm run test:contract`, then `npm run deploy:contract`. Put the resulting address in `SANAD_CONTRACT_ADDRESS` and set `BLOCKCHAIN_MODE=real`. Verify the contract and issuer address before issuing any test credential. Never share the private key, seed phrase or production wallet in chat. Testnet records are not government credentials.

## Vercel deployment

Import this GitHub repository into your Vercel account as a Next.js project. Set `SANAD_MODE=supabase` and the Supabase variables, `NEXT_PUBLIC_APP_URL` to the exact HTTPS deployment origin, plus optional AI and blockchain server secrets. Run migrations and verify Auth redirect URLs before use. Run a preview deployment, sign in, verify server APIs and private storage, test a public credential URL, inspect mobile layout and only then promote to production. The local file-backed demo refuses Vercel ephemeral storage. No Vercel account connection or live deployment was available for automated end-to-end verification here.
