# SANAD API reference

Base URL `/api`. JSON requests use `Content-Type: application/json`; file upload uses `multipart/form-data`. Success returns `{ "success": true, "data": ... }`. Errors return `{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Check the request fields and try again." } }` with a suitable 4xx/5xx status and no stack traces. All dynamic responses are non-cacheable. UUID path parameters must be valid UUIDs. `auth` means a valid demo session or a Supabase email session; `admin` means a server-verified admin role. Other-user records return 404.

| Method | Path | Access | Request → response |
|---|---|---|---|
| POST | `/auth/demo` | public, local demo only | `{}` → `{id,demo:true}`; sets HttpOnly demo cookie. |
| POST | `/auth/register` | public, Supabase only | `{email,password}` → `{confirmationRequired}`. |
| POST | `/auth/login` | public, Supabase only | `{email,password}` → actor. |
| POST | `/auth/logout` | auth | `{}` → `{signedOut:true}`. |
| GET | `/auth/me` | auth | actor `{id,email?,role,demo}`. |
| POST | `/auth/refresh` | Supabase auth | `{}` → `{refreshed:true}`. |
| GET/PATCH | `/profile` | auth | PATCH `{display_name,preferred_language,accessibility:{larger_text,reduced_motion,screen_reader}}` → profile. |
| POST | `/ai/analyze` | auth | `{text}` → `{analysis,method}`; method is `provider` or `demo_rules`. |
| POST | `/ai/analyze-voice` | auth | `{transcript}` → `{analysis,method,transcript}`. Browser captures speech. |
| POST | `/ai/clarify` | auth | `{text,answers:{field:value}}` → validated analysis. |
| POST | `/ai/confirm` | auth | `{claimId}` → confirmed claim. |
| POST/GET | `/claims` | auth | POST `{text}` → created analyzed claim; GET → owned list. |
| GET/PATCH | `/claims/:id` | owner | PATCH `{facts,original_text?}` → edited pre-confirmation claim. |
| POST | `/claims/:id/confirm` | owner | `{}` → user-confirmed claim. |
| POST | `/claims/:id/revoke` | owner | `{}` → revoked active credential. |
| POST | `/credentials/issue` | owner | `{claimId}` → credential metadata after confirmation. |
| GET | `/credentials` | auth | owned list without private salt/snapshot. |
| GET | `/credentials/:id` | owner | metadata only. |
| GET | `/credentials/:id/status` | owner | verification status. |
| POST | `/credentials/:id/revoke` | owner | `{}` → revoked credential. |
| POST | `/credentials/:id/reconcile` | owner | Check an Amoy receipt for a pending issue or revocation and settle its status. |
| GET | `/credentials/:id/qr` | owner | PNG verification QR. |
| POST | `/blockchain/issue` | owner | `{claimId}` → credential metadata. |
| GET | `/blockchain/verify/:credentialId` | public | metadata-only verification; simulation labelled. |
| POST | `/blockchain/revoke` | owner | `{credentialId}` → revoked metadata. |
| GET | `/blockchain/transaction/:txHash` | owner | only an owned transaction → confirmation/explorer link. |
| GET | `/services` | public | published official-source resource list. |
| GET | `/services/:id` | public | resource details and official URL. |
| POST | `/services/search` | public | `{query}` → matching published records. |
| POST | `/services/match` | auth | `{claimId}` → confirmed-fact matches with `relevance_score` and `why`. |
| GET | `/services/categories` | public | category names. |
| GET | `/services/:id/journey` | public | steps and simulation notice. |
| POST | `/services/:id/start` | auth | `{credential_id?}` → SANAD simulated application. |
| GET/PATCH | `/journeys/:id` | owner | PATCH `{current_step,responses}` → draft journey. |
| POST | `/journeys/:id/submit` | owner | `{}` → submitted SANAD simulation. |
| POST/GET | `/documents` | auth | multipart field `file` → private document metadata; GET owned list. |
| GET/DELETE | `/documents/:id` | owner | GET metadata, DELETE only if unattached. |
| GET | `/documents/:id/download` | owner | private streamed attachment. |
| POST | `/documents/:id/analyze` | owner | `{consent:true}` → tentative extraction. |
| POST | `/documents/:id/confirm` | owner | `{extraction:{document_type,date,employer_name,salary_period}}` → user-confirmed fields. |
| POST/GET | `/applications` | auth | POST `{service_id,credential_id?}` → simulated draft; GET owned list. |
| GET/PATCH | `/applications/:id` | owner | GET timeline/evidence; PATCH `{status}` available only to local demo status simulation. |
| POST | `/applications/:id/submit` | owner | `{}` → submitted SANAD journey (never government filing). |
| GET | `/applications/:id/timeline` | owner | ordered application events. |
| GET | `/applications/:id/updates` | owner | related notifications. |
| POST | `/applications/:id/attach` | owner | `{kind:"document"|"credential",evidence_id}` → owned evidence link. |
| GET/POST | `/notifications` | auth | GET owned list; POST `{message}` → own notification. |
| PATCH | `/notifications/:id/read` | owner | marks read. |
| GET/POST | `/escalation` | auth | GET owned list; POST `{subject,application_id?}` → escalation. |
| GET | `/escalation/:id` | owner | escalation and messages. |
| POST | `/escalation/:id/message` | owner | `{message}` → reply. |
| GET | `/verify/:credentialId` | public | metadata-only status, issuer, hash integrity, revocation and mode. |
| POST | `/verify` | public | `{credentialId}` → same status. |
| GET | `/verify/hash/:hash` | public | hash lookup → same metadata. |
| POST | `/analytics/event` | auth | `{event_name}` → non-PII event. |
| GET | `/analytics/overview` | admin | aggregate counts and distributions. |
| GET | `/admin/services` | admin | all draft and published records. |
| POST | `/admin/services` | admin | `{title,description,category,eligibility_guidance,details:{official_url,last_verified,kind},steps,keywords,supported_situations,published}` → draft/record. Official UAE HTTPS source required. |
| PATCH | `/admin/services/:id` | admin | selected service fields → updated resource. |
| GET | `/health` | public | process health only. |
| GET | `/health/database` | auth | persistence availability/mode. |
| GET | `/health/ai` | public | configuration indicator (never key). |
| GET | `/health/blockchain` | public | mode/configuration indicator. |

Common failures: 400 `VALIDATION_ERROR` or `INVALID_JSON`; 401 `UNAUTHORIZED`; 403 `FORBIDDEN`/`ORIGIN_REJECTED`; 404 `NOT_FOUND`; 409 `INVALID_TRANSITION`/`CONFLICT`/`ALREADY_ISSUED`; 413 `TOO_LARGE`; 422 `OCR_REQUIRED`; 429 `RATE_LIMITED`; 502 provider/chain errors; 503 missing configured service. The UI displays retry paths. Public verification never returns personal facts or uploaded files.

Example:

```http
POST /api/ai/analyze
Content-Type: application/json

{"text":"Meri job chali gayi hai aur August ki salary bhi nahi mili."}
```

```json
{"success":true,"data":{"analysis":{"intent":"employment_support","confidence":0.81,"languageSignals":["Romanized South Asian language","English"],"facts":{"employment_status":"lost_job","issue":"unpaid_wages","salary_period":"August"},"missing_information":["employment_end_date"],"potential_categories":["unpaid_wages","job_loss","employment_support"]},"method":"demo_rules"}}
```
