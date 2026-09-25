# SANAD architecture

## Request path

Browser → Next.js App Router UI → validated API routes → authenticated actor → server-owned repository → Supabase Auth/PostgreSQL/Storage or local demo repository. AI extraction is isolated in `lib/ai/`; hash and snapshot rules in `lib/credentials/`; testnet contract operations in `lib/blockchain/`; match explanations are restricted to `lib/services/catalog.ts` and its seeded official-source records.

The local demo persists private session-signed data and uploaded files on disk; it is refused on Vercel. Hosted mode requires `SANAD_MODE=supabase` and all four migrations. Next.js Route Handlers enforce actor ownership, while SQL constraints and RLS provide a second boundary. The server service-role key never enters client code. Ordinary users cannot change their role. Server APIs are non-cacheable and sanitize errors.

## Domain lifecycle

Claim: DRAFT/AI_ANALYZED/WAITING_FOR_CONFIRMATION → USER_CONFIRMED → ISSUED → REVOKED. Editing is allowed before confirmation; a confirmed claim is immutable, and subsequent changes require a new claim. Credential snapshots include the confirmed facts, confirmation timestamp and provenance, salted and canonicalized before SHA-256 hashing. Credential states: PENDING → VALID → REVOKING → REVOKED, or FAILED. Actual Amoy issuance is guarded by issuer-only Solidity functions. Demo issuance has no blockchain transaction and says so.

Services are curated records with source URLs and dates, indexed by supported situation terms. Matching produces a relevance explanation and score, never a legal eligibility determination. Application journeys are labelled simulations. Evidence links use composite `(id,user_id)` foreign keys to stop cross-owner attachments. Notifications and semantic timelines capture status changes.

## Privacy and accessibility

Public credential lookup recomputes the private snapshot hash, checks revocation and calls Amoy for real credentials. Only metadata in a strict allowlist is returned. No private facts, salt, stored documents or permanent address appear in public results or the Solidity registry.

The UI uses semantic headings/landmarks, skip navigation, labelled inputs, keyboard-accessible controls, visible focus, screen-reader `aria-live` announcements, reduced motion and responsive layout. The golden path is browser-tested on desktop and mobile Chromium. Further manual assistive-technology review is appropriate before real-world use. Preferred language is stored; full UI translation is not yet implemented.

## Known integration boundary

The current repository includes Supabase, AI and Amoy adapters, but those live services require account-owned URLs, keys, wallet funding and deployment. Local tests cover PostgreSQL migrations in PGlite, contract behavior in Ganache, API ownership and desktop/mobile golden path. Live third-party connectivity is a separate release gate.
