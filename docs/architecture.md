# Architecture

## Implemented foundation
- app/: server-rendered routes, metadata, errors and health API.
- components/ui/: Tailwind/Radix/CVA button primitive, configured for shadcn expansion.
- components/claims/: local input preview with no network persistence.
- components/accessibility/: reusable polite live announcer.
- lib/config.ts: Zod environment validation, mock default, real-mode requirements.
- lib/api/: consistent non-cacheable error responses.
- supabase/migrations/: relational ownership model and RLS.
- tests/: configuration, SQL isolation, browser navigation and API checks.

## Planned integration boundaries
lib/ai/ will expose one validated provider-neutral analysis contract to OpenAI, Azure OpenAI and Gemini adapters. Retrieval will be constrained to verified service records. lib/database/ will provide authenticated session-aware queries; privileged writes require explicit ownership/role checks. lib/credentials/ will implement immutable canonical snapshots and salted hashes; lib/blockchain/ will isolate real and mock adapters. No privileged keys are exported to the browser.

## State and privacy boundaries
A claim cannot be issued until explicitly confirmed. Credential issuance and revocation require durable pending/failed/confirmed states and idempotency. Existing credentials retain their original immutable snapshot even if a claim is later edited. Public verification must return only a deliberate metadata allowlist. Application submissions are prototype simulations until an official integration is established.

## Accessibility
Semantic landmarks, skip navigation, visible focus, labelled textarea, aria-live announcements and reduced-motion support start in phase 1. Full keyboard, focus, contrast and screen-reader review remains a delivery gate. Languages are advertised as planned, not implemented translations.
