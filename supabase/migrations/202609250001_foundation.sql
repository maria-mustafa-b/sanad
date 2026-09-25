-- Foundation schema. Run once on a new SANAD Supabase project.
-- No client writes to workflow state: future authenticated server services own transitions.
begin;
create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade, role text not null default 'user' check (role in ('user','admin','issuer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.users enable row level security;
revoke all on public.users from anon, authenticated;
grant all on public.users to service_role;
create trigger updated_at before update on public.users for each row execute function public.set_updated_at();
grant select on public.users to authenticated;
create policy own_read on public.users for select to authenticated using (id = (select auth.uid()));

create table public.profiles (
  id uuid primary key references public.users(id) on delete cascade, display_name text, preferred_language text not null default 'en' check(preferred_language in ('en','ar','hi','ur')), accessibility jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant all on public.profiles to service_role;
create trigger updated_at before update on public.profiles for each row execute function public.set_updated_at();
grant select on public.profiles to authenticated;
create policy own_read on public.profiles for select to authenticated using (id = (select auth.uid()));

create table public.claims (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), original_text text not null, status text not null default 'DRAFT' check(status in ('DRAFT','AI_ANALYZED','WAITING_FOR_CONFIRMATION','USER_CONFIRMED','ISSUED','REVOKED')), intent text, confidence numeric check(confidence between 0 and 1), confirmed_at timestamptz, unique(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.claims enable row level security;
revoke all on public.claims from anon, authenticated;
grant all on public.claims to service_role;
create trigger updated_at before update on public.claims for each row execute function public.set_updated_at();
grant select on public.claims to authenticated;
create policy own_read on public.claims for select to authenticated using (user_id = (select auth.uid()));
create index claims_owner_idx on public.claims(user_id);

create table public.claim_facts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), claim_id uuid not null, name text not null, value jsonb not null, provenance text not null check(provenance in ('USER_REPORTED','AI_EXTRACTED','USER_CONFIRMED','ISSUER_VERIFIED')), foreign key(claim_id,user_id) references public.claims(id,user_id) on delete cascade, unique(claim_id,name),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.claim_facts enable row level security;
revoke all on public.claim_facts from anon, authenticated;
grant all on public.claim_facts to service_role;
create trigger updated_at before update on public.claim_facts for each row execute function public.set_updated_at();
grant select on public.claim_facts to authenticated;
create policy own_read on public.claim_facts for select to authenticated using (user_id = (select auth.uid()));
create index claim_facts_owner_idx on public.claim_facts(user_id);

create table public.credentials (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), claim_id uuid not null, record_hash text not null unique check(record_hash ~ '^0x[0-9a-f]{64}$'), issuer text not null, snapshot jsonb not null, salt text not null, mode text not null check(mode in ('real','mock')), status text not null default 'PENDING' check(status in ('PENDING','VALID','REVOKING','REVOKED','FAILED')), transaction_hash text, issued_at timestamptz, revoked_at timestamptz, foreign key(claim_id,user_id) references public.claims(id,user_id), unique(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.credentials enable row level security;
revoke all on public.credentials from anon, authenticated;
grant all on public.credentials to service_role;
create trigger updated_at before update on public.credentials for each row execute function public.set_updated_at();
grant select on public.credentials to authenticated;
create policy own_read on public.credentials for select to authenticated using (user_id = (select auth.uid()));
create index credentials_owner_idx on public.credentials(user_id);

create table public.credential_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), credential_id uuid not null, event_type text not null, metadata jsonb not null default '{}', foreign key(credential_id,user_id) references public.credentials(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.credential_events enable row level security;
revoke all on public.credential_events from anon, authenticated;
grant all on public.credential_events to service_role;
create trigger updated_at before update on public.credential_events for each row execute function public.set_updated_at();
grant select on public.credential_events to authenticated;
create policy own_read on public.credential_events for select to authenticated using (user_id = (select auth.uid()));
create index credential_events_owner_idx on public.credential_events(user_id);

create table public.services (
  id uuid primary key default gen_random_uuid(), title text not null, description text not null, category text not null, eligibility_guidance text not null, steps jsonb not null default '[]', keywords text[] not null default '{}', supported_situations text[] not null default '{}', published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.services enable row level security;
revoke all on public.services from anon, authenticated;
grant all on public.services to service_role;
create trigger updated_at before update on public.services for each row execute function public.set_updated_at();
grant select on public.services to anon, authenticated;
create policy published_read on public.services for select to anon, authenticated using (published);

create table public.service_requirements (
  id uuid primary key default gen_random_uuid(), service_id uuid not null references public.services(id) on delete cascade, title text not null, description text not null, required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.service_requirements enable row level security;
revoke all on public.service_requirements from anon, authenticated;
grant all on public.service_requirements to service_role;
create trigger updated_at before update on public.service_requirements for each row execute function public.set_updated_at();
grant select on public.service_requirements to anon, authenticated;
create policy published_read on public.service_requirements for select to anon, authenticated using (exists(select 1 from public.services s where s.id = service_id and s.published));
create index service_requirements_service_idx on public.service_requirements(service_id);

create table public.service_sources (
  id uuid primary key default gen_random_uuid(), service_id uuid not null references public.services(id) on delete cascade, official_url text not null check(official_url like 'https://%'), last_verified timestamptz not null, verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.service_sources enable row level security;
revoke all on public.service_sources from anon, authenticated;
grant all on public.service_sources to service_role;
create trigger updated_at before update on public.service_sources for each row execute function public.set_updated_at();
grant select on public.service_sources to anon, authenticated;
create policy published_read on public.service_sources for select to anon, authenticated using (exists(select 1 from public.services s where s.id = service_id and s.published));
create index service_sources_service_idx on public.service_sources(service_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), storage_path text not null unique, original_name text not null, mime_type text not null, size_bytes bigint not null check(size_bytes between 1 and 10485760), extraction jsonb, confirmed_at timestamptz, unique(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.documents enable row level security;
revoke all on public.documents from anon, authenticated;
grant all on public.documents to service_role;
create trigger updated_at before update on public.documents for each row execute function public.set_updated_at();
grant select on public.documents to authenticated;
create policy own_read on public.documents for select to authenticated using (user_id = (select auth.uid()));
create index documents_owner_idx on public.documents(user_id);

create table public.applications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), service_id uuid not null references public.services(id), status text not null default 'DRAFT' check(status in ('DRAFT','SUBMITTED','UNDER_REVIEW','ADDITIONAL_DOCUMENTS_REQUIRED','VERIFIED','COMPLETED')), is_simulation boolean not null default true, submitted_at timestamptz, unique(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.applications enable row level security;
revoke all on public.applications from anon, authenticated;
grant all on public.applications to service_role;
create trigger updated_at before update on public.applications for each row execute function public.set_updated_at();
grant select on public.applications to authenticated;
create policy own_read on public.applications for select to authenticated using (user_id = (select auth.uid()));
create index applications_owner_idx on public.applications(user_id);

create table public.journeys (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), application_id uuid not null, current_step integer not null default 0 check(current_step >= 0), responses jsonb not null default '{}', foreign key(application_id,user_id) references public.applications(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.journeys enable row level security;
revoke all on public.journeys from anon, authenticated;
grant all on public.journeys to service_role;
create trigger updated_at before update on public.journeys for each row execute function public.set_updated_at();
grant select on public.journeys to authenticated;
create policy own_read on public.journeys for select to authenticated using (user_id = (select auth.uid()));
create index journeys_owner_idx on public.journeys(user_id);

create table public.application_documents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), application_id uuid not null, document_id uuid not null, foreign key(application_id,user_id) references public.applications(id,user_id), foreign key(document_id,user_id) references public.documents(id,user_id), unique(application_id,document_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.application_documents enable row level security;
revoke all on public.application_documents from anon, authenticated;
grant all on public.application_documents to service_role;
create trigger updated_at before update on public.application_documents for each row execute function public.set_updated_at();
grant select on public.application_documents to authenticated;
create policy own_read on public.application_documents for select to authenticated using (user_id = (select auth.uid()));
create index application_documents_owner_idx on public.application_documents(user_id);

create table public.application_credentials (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), application_id uuid not null, credential_id uuid not null, foreign key(application_id,user_id) references public.applications(id,user_id), foreign key(credential_id,user_id) references public.credentials(id,user_id), unique(application_id,credential_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.application_credentials enable row level security;
revoke all on public.application_credentials from anon, authenticated;
grant all on public.application_credentials to service_role;
create trigger updated_at before update on public.application_credentials for each row execute function public.set_updated_at();
grant select on public.application_credentials to authenticated;
create policy own_read on public.application_credentials for select to authenticated using (user_id = (select auth.uid()));
create index application_credentials_owner_idx on public.application_credentials(user_id);

create table public.application_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), application_id uuid not null, event_type text not null, description text not null, foreign key(application_id,user_id) references public.applications(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.application_events enable row level security;
revoke all on public.application_events from anon, authenticated;
grant all on public.application_events to service_role;
create trigger updated_at before update on public.application_events for each row execute function public.set_updated_at();
grant select on public.application_events to authenticated;
create policy own_read on public.application_events for select to authenticated using (user_id = (select auth.uid()));
create index application_events_owner_idx on public.application_events(user_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), application_id uuid, message text not null, read_at timestamptz, foreign key(application_id,user_id) references public.applications(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
revoke all on public.notifications from anon, authenticated;
grant all on public.notifications to service_role;
create trigger updated_at before update on public.notifications for each row execute function public.set_updated_at();
grant select on public.notifications to authenticated;
create policy own_read on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create index notifications_owner_idx on public.notifications(user_id);

create table public.escalations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), application_id uuid, subject text not null, status text not null default 'OPEN' check(status in ('OPEN','IN_PROGRESS','CLOSED')), foreign key(application_id,user_id) references public.applications(id,user_id), unique(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.escalations enable row level security;
revoke all on public.escalations from anon, authenticated;
grant all on public.escalations to service_role;
create trigger updated_at before update on public.escalations for each row execute function public.set_updated_at();
grant select on public.escalations to authenticated;
create policy own_read on public.escalations for select to authenticated using (user_id = (select auth.uid()));
create index escalations_owner_idx on public.escalations(user_id);

create table public.escalation_messages (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), escalation_id uuid not null, body text not null, foreign key(escalation_id,user_id) references public.escalations(id,user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.escalation_messages enable row level security;
revoke all on public.escalation_messages from anon, authenticated;
grant all on public.escalation_messages to service_role;
create trigger updated_at before update on public.escalation_messages for each row execute function public.set_updated_at();
grant select on public.escalation_messages to authenticated;
create policy own_read on public.escalation_messages for select to authenticated using (user_id = (select auth.uid()));
create index escalation_messages_owner_idx on public.escalation_messages(user_id);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), event_name text not null, metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;
grant all on public.analytics_events to service_role;
create trigger updated_at before update on public.analytics_events for each row execute function public.set_updated_at();
grant select on public.analytics_events to authenticated;
create policy own_read on public.analytics_events for select to authenticated using (user_id = (select auth.uid()));
create index analytics_events_owner_idx on public.analytics_events(user_id);

grant update(display_name, preferred_language, accessibility) on public.profiles to authenticated;
create policy own_profile_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$ begin insert into public.users(id) values(new.id); insert into public.profiles(id) values(new.id); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
revoke all on function public.handle_new_user() from public;
-- Public credential verification will use an explicit server-side metadata allowlist.
-- No anonymous SELECT policy on credentials, claims or documents.
commit;
