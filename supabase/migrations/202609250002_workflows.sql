begin;
alter table public.claims add column analysis jsonb not null default '{}';
alter table public.claims add column facts jsonb not null default '{}';
alter table public.claims add column missing_information jsonb not null default '[]';
alter table public.credentials add column chain_id integer;
alter table public.credentials add column contract_address text;
alter table public.credentials add column revocation_transaction_hash text;
create unique index one_live_credential_per_claim on public.credentials(claim_id) where status in ('PENDING','VALID','REVOKING');
alter table public.services add column details jsonb not null default '{}';
alter table public.documents add column analysis_status text not null default 'PENDING';
-- Storage is private. All uploads/downloads go through ownership-checked server routes.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('sanad-documents','sanad-documents',false,10485760,array['application/pdf','image/png','image/jpeg','text/plain']) on conflict(id) do nothing;
commit;
