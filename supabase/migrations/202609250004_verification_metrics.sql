begin;
create table public.verification_events (
 id uuid primary key default gen_random_uuid(), credential_id uuid references public.credentials(id) on delete set null,
 outcome text not null check (outcome in ('VALID','INVALID')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.verification_events enable row level security;
revoke all on public.verification_events from anon,authenticated;
grant all on public.verification_events to service_role;
create trigger updated_at before update on public.verification_events for each row execute function public.set_updated_at();
create index verification_events_created_idx on public.verification_events(created_at);
commit;
