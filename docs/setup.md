# Setup and user-owned configuration

## Foundation
Clone the repository, run `npm ci`, copy `.env.example` to `.env.local`, then `npm run dev`. No external account is needed for the current preview.

## Your action for phase 2: Supabase
1. Go to https://supabase.com/dashboard and create a new project named SANAD in your own organization.
2. Choose a region and set a strong database password. Save it privately; do not paste it in chat.
3. Open the project's Connect dialog or Settings → API section. Copy the project URL and browser-safe publishable key (or legacy anon key).
4. Put the URL in `NEXT_PUBLIC_SUPABASE_URL` and the browser-safe key in `NEXT_PUBLIC_SUPABASE_ANON_KEY` inside your local `.env.local`.
5. If using the legacy server service-role key, put it only in `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Do not use a service-role/secret key in a NEXT_PUBLIC variable or share it in chat. Server credential handling will be implemented in phase 2.
6. For the foundation schema, open SQL Editor, paste the full `supabase/migrations/202609250001_foundation.sql`, and run once against this new empty project. It is not an idempotent repeatable script.
7. Tell the assistant the project is ready. It is safe to share a redacted error if migration fails. Never share passwords, service-role keys or wallet keys.

The local `.env.local` is on your computer; the assistant cannot assume it can read it here. Supabase integration testing on your project will require you to run the supplied checks locally unless an authorized connection becomes available.

## Later phases
AI: select a provider and place its key/model in local environment variables when requested. Azure also needs endpoint and API version. No external AI call is implemented in phase 1.
Blockchain: keep BLOCKCHAIN_MODE=mock until contract deployment, Amoy wallet, test funds and RPC setup are complete. Keep the wallet private key local. No transaction is submitted by this foundation.
Deployment: planned Vercel deployment with Supabase and Amoy; provider accounts, redirects and secret configuration will be handled in phase 12. No domain is required for local work.
