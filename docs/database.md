# Database foundation

Migration: supabase/migrations/202609250001_foundation.sql.

Tables: users, profiles, claims, claim_facts, credentials, credential_events, services, service_requirements, service_sources, documents, applications, journeys, application_documents, application_credentials, application_events, notifications, escalations, escalation_messages and analytics_events.

All use UUID primary keys and created_at/updated_at; timestamps are maintained by triggers. Supabase auth.users owns authentication. An insert trigger creates a public user and profile. Roles are never taken from user-editable metadata. New accounts start as user.

Private table SELECT is limited to the authenticated owner. Anonymous callers can read published services and their sources/requirements, but cannot SELECT claims or credentials. Client write permissions are initially denied except editable profile fields. Future server workflows must enforce ownership and transitions before privileged writes. service_role bypasses RLS and must remain server-only.

Composite foreign keys bind linked evidence and records to the same user. Credential snapshots and salts are private. Public verification has no direct database access policy; phase 9 must implement a metadata-only server response. Storage buckets, document MIME validation, transition functions, service publishing validation and hosted integration tests remain pending.

The migration is executed by an automated PGlite PostgreSQL test with a minimal Supabase auth/role harness. It checks two-user read isolation, anonymous credential denial, denied role escalation, denied direct claim inserts and cross-owner fact rejection. This is not a substitute for testing on the actual configured Supabase project.

Design references: https://supabase.com/docs/guides/database/postgres/row-level-security and https://supabase.com/docs/guides/auth/managing-user-data.
