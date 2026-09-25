# Database

Run migrations in order:

1. `202609250001_foundation.sql`: users/profiles, claims/facts, credentials/events, services/sources/requirements, documents, journeys, applications/evidence/events, notifications, escalations and analytics. UUID keys, timestamps, foreign keys, ownership indexes, private RLS.
2. `202609250002_workflows.sql`: structured analysis/facts, chain metadata, one-live-credential constraint and private `sanad-documents` bucket (PDF/PNG/JPEG/text, 10 MB).
3. `202609250003_service_catalog.sql`: 22 official UAE resource entries and source URLs, marked as a prototype snapshot reviewed 25 September 2026. Recheck official conditions before relying on them.
4. `202609250004_verification_metrics.sql`: server-only aggregate verification-event table.

Supabase Auth owns `auth.users`. A security-definer trigger inserts application user and profile rows. Every private table has RLS, with owner SELECT and no client workflow writes. Server service-role access requires per-request actor verification and explicit owner predicates; the service-role key must never reach the browser. Composite foreign keys tie attachments to the same owner. The public service catalog is readable only when published. Public verification goes through a metadata-filtering Route Handler; it has no anonymous SELECT on credentials or documents.

The local demo repository implements ownership checks and atomic file replacement. It is for single-server hackathon demonstrations, not a substitute for PostgreSQL in production. The PGlite test runs the four migrations and checks owner isolation, private-record denial, role escalation and all catalog records. Hosted Supabase integration still requires configured project credentials and manual verification.
