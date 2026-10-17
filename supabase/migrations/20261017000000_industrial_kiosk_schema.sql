-- SOP Kiosk: Priemyselná Onboardingová Platforma
-- Migration: 20261017000000_industrial_kiosk_schema.sql
-- Podľa technickej a systémovej analýzy MVP

-- 1. ENUM TYPY
create type user_role as enum ('admin', 'foreman', 'operator');
create type sop_status as enum ('draft', 'processing', 'review', 'published', 'archived');
create type job_status as enum ('queued', 'transcribing', 'structuring', 'cutting', 'done', 'failed');

-- 2. TABUĽKA ORGANIZÁCIÍ (Fabriky / Závody)
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subscription_tier text not null default 'pilot',
  supported_languages text[] not null default '{"sk","uk","sr","en"}',
  created_at timestamptz not null default now()
);

-- 3. POUŽÍVATELIA & OPERÁTORI
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  auth_user_id uuid unique, -- priradené len pre admina a majstra
  full_name text not null,
  employee_no text,
  role user_role not null default 'operator',
  preferred_lang text not null default 'sk',
  badge_hash text,          -- sha256(org_id || nfc_serial)
  qr_token text unique,     -- unikátny rotovateľný token pre QR menovku
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (org_id, badge_hash)
);

-- 4. PRACOVNÉ STANICE / STROJE
create table if not exists workstations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,       -- napr. "Lis 04 - Dverový modul"
  qr_code text unique not null,
  created_at timestamptz not null default now()
);

-- 5. TABLETOVÉ KIOSKY (Zariadenia pri linke)
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  workstation_id uuid references workstations(id) on delete set null,
  label text not null,      -- napr. "Tablet Samsung Tab A9+ #01"
  secret_hash text not null,
  last_sync_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. SOP (Štandardné operačné postupy)
create table if not exists sops (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  workstation_id uuid not null references workstations(id) on delete cascade,
  title text not null,
  status sop_status not null default 'draft',
  current_version_id uuid,  -- priradí sa po vytvorení sop_versions
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

-- 7. SOP VERZIE (Nemenné pre ISO / IATF audit)
create table if not exists sop_versions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  sop_id uuid not null references sops(id) on delete cascade,
  version int not null,
  estimated_time_sec int default 120,
  source_video_key text,
  transcript jsonb,
  published_at timestamptz,
  published_by uuid references users(id),
  created_at timestamptz not null default now(),
  unique (sop_id, version)
);

-- Prepojenie aktuálnej verzie
alter table sops 
  add constraint fk_current_version 
  foreign key (current_version_id) 
  references sop_versions(id) 
  on delete set null;

-- 8. KROKY SOP
create table if not exists sop_steps (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  sop_version_id uuid not null references sop_versions(id) on delete cascade,
  step_order int not null,
  start_time numeric(6,2),
  end_time numeric(6,2),
  video_key text,
  video_bytes int,
  image_ok_key text,
  image_nok_key text,
  translations jsonb not null default '{}'::jsonb,
  quiz_question jsonb,
  created_at timestamptz not null default now(),
  unique (sop_version_id, step_order)
);

-- 9. AI MEDIA JOBS (Spracovanie Whisper + LLM + FFmpeg)
create table if not exists media_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  sop_version_id uuid not null references sop_versions(id) on delete cascade,
  status job_status not null default 'queued',
  attempts int not null default 0,
  error text,
  cost_usd numeric(8,4) default 0.0000,
  updated_at timestamptz not null default now()
);

-- 10. AUDITNÉ LOGY ZAŠKOLENIA (Training Logs)
create table if not exists training_logs (
  id uuid primary key, -- UUIDv7 z tabletu pre idempotentnú synchronizáciu
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  sop_version_id uuid not null references sop_versions(id) on delete cascade,
  device_id uuid references devices(id) on delete set null,
  lang text not null default 'sk',
  started_at timestamptz not null,
  completed_at timestamptz,
  quiz_score numeric(5,2) default 0,
  passed boolean default false,
  quiz_answers jsonb default '[]'::jsonb,
  step_durations jsonb default '{}'::jsonb,
  sos_events jsonb default '[]'::jsonb,
  synced_at timestamptz not null default now()
);

-- INDEXY
create index if not exists idx_training_logs_org_user on training_logs (org_id, user_id);
create index if not exists idx_training_logs_sop on training_logs (org_id, sop_version_id);
create index if not exists idx_sop_steps_version on sop_steps (sop_version_id);

-- RLS (Row Level Security)
alter table organizations enable row level security;
alter table users enable row level security;
alter table workstations enable row level security;
alter table devices enable row level security;
alter table sops enable row level security;
alter table sop_versions enable row level security;
alter table sop_steps enable row level security;
alter table media_jobs enable row level security;
alter table training_logs enable row level security;

-- Východzie politiky pre anon / service role prístup v MVP
create policy "Allow read for all active sessions" on organizations for select using (true);
create policy "Allow read users for active org" on users for select using (true);
create policy "Allow read workstations" on workstations for select using (true);
create policy "Allow read sops" on sops for select using (true);
create policy "Allow read sop_versions" on sop_versions for select using (true);
create policy "Allow read sop_steps" on sop_steps for select using (true);
create policy "Allow insert training_logs" on training_logs for insert with check (true);
create policy "Allow read training_logs" on training_logs for select using (true);
