-- ====================================================================
-- SOP KIOSK: PRIEMYSELNÁ ONBOARDINGOVÁ PLATFORMA
-- Kompletný SQL skript pre vytvorenie tabuliek a východzích dát v Supabase
-- ====================================================================

-- 1. ROZŠÍRENIA (EXTENSIONS)
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 2. ENUM TYPY (Bezpečné vytvorenie bez pádu pri opakovanom spustení)
do $$ begin
  create type user_role as enum ('admin', 'foreman', 'operator');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type sop_status as enum ('draft', 'processing', 'review', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type job_status as enum ('queued', 'transcribing', 'structuring', 'cutting', 'done', 'failed');
exception
  when duplicate_object then null;
end $$;

-- 3. ORGANIZÁCIE (Závody / Fabriky)
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subscription_tier text not null default 'pilot',
  supported_languages text[] not null default '{"sk","uk","sr","en"}',
  created_at timestamptz not null default now()
);

-- 4. POUŽÍVATELIA & OPERÁTORI
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  auth_user_id uuid unique,
  full_name text not null,
  employee_no text,
  role user_role not null default 'operator',
  preferred_lang text not null default 'sk',
  badge_hash text,
  qr_token text unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (org_id, badge_hash)
);

-- 5. PRACOVNÉ STANICE (Stroje / Linky)
create table if not exists workstations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  qr_code text unique not null,
  created_at timestamptz not null default now()
);

-- 6. TABLETOVÉ KIOSKY (Zariadenia)
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  workstation_id uuid references workstations(id) on delete set null,
  label text not null,
  secret_hash text not null,
  last_sync_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. ŠTANDARDNÉ OPERAČNÉ POSTUPY (SOP)
create table if not exists sops (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  workstation_id uuid not null references workstations(id) on delete cascade,
  title text not null,
  status sop_status not null default 'draft',
  current_version_id uuid,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

-- 8. VERZIE POSTUPOV (Nemenné pre ISO/IATF audit)
create table if not exists sop_versions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  sop_id uuid not null references sops(id) on delete cascade,
  version int not null,
  estimated_time_sec int default 120,
  source_video_key text,
  transcript jsonb,
  published_at timestamptz,
  published_by text,
  created_at timestamptz not null default now(),
  unique (sop_id, version)
);

-- Spätná väzba pre sops.current_version_id
do $$ begin
  alter table sops 
    add constraint fk_current_version 
    foreign key (current_version_id) 
    references sop_versions(id) 
    on delete set null;
exception
  when duplicate_object then null;
end $$;

-- 9. KROKY SOP POSTUPU
create table if not exists sop_steps (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  sop_version_id uuid not null references sop_versions(id) on delete cascade,
  step_order int not null,
  start_time numeric(6,2),
  end_time numeric(6,2),
  video_key text,
  video_url text,
  video_bytes int,
  image_ok_key text,
  image_ok_url text,
  image_nok_key text,
  image_nok_url text,
  translations jsonb not null default '{}'::jsonb,
  quiz_question jsonb,
  created_at timestamptz not null default now(),
  unique (sop_version_id, step_order)
);

-- 10. AI MEDIA WORKER JOBS
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

-- 11. AUDITNÉ LOGY ZAŠKOLENIA (Training Logs)
create table if not exists training_logs (
  id uuid primary key,
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

-- 12. INDEXY PRE VYSOKÝ VÝKON
create index if not exists idx_users_org on users (org_id);
create index if not exists idx_workstations_org on workstations (org_id);
create index if not exists idx_sops_workstation on sops (workstation_id);
create index if not exists idx_sop_versions_sop on sop_versions (sop_id);
create index if not exists idx_sop_steps_version on sop_steps (sop_version_id);
create index if not exists idx_training_logs_org_user on training_logs (org_id, user_id);
create index if not exists idx_training_logs_sop on training_logs (org_id, sop_version_id);

-- 13. ROW LEVEL SECURITY (RLS)
alter table organizations enable row level security;
alter table users enable row level security;
alter table workstations enable row level security;
alter table devices enable row level security;
alter table sops enable row level security;
alter table sop_versions enable row level security;
alter table sop_steps enable row level security;
alter table media_jobs enable row level security;
alter table training_logs enable row level security;

-- Politiky prístupu (Public anon read & insert pre pilotný kiosk)
drop policy if exists "Allow read organizations" on organizations;
create policy "Allow read organizations" on organizations for select using (true);

drop policy if exists "Allow read users" on users;
create policy "Allow read users" on users for select using (true);

drop policy if exists "Allow read workstations" on workstations;
create policy "Allow read workstations" on workstations for select using (true);

drop policy if exists "Allow read devices" on devices;
create policy "Allow read devices" on devices for select using (true);

drop policy if exists "Allow read sops" on sops;
create policy "Allow read sops" on sops for select using (true);

drop policy if exists "Allow read sop_versions" on sop_versions;
create policy "Allow read sop_versions" on sop_versions for select using (true);

drop policy if exists "Allow read sop_steps" on sop_steps;
create policy "Allow read sop_steps" on sop_steps for select using (true);

drop policy if exists "Allow insert training_logs" on training_logs;
create policy "Allow insert training_logs" on training_logs for insert with check (true);

drop policy if exists "Allow read training_logs" on training_logs;
create policy "Allow read training_logs" on training_logs for select using (true);

-- ====================================================================
-- 14. INICIALIZAČNÉ DÁTA (SEED) PRE LINKU 04 - ZÁVOD TRNAVA
-- ====================================================================

-- Organizácia
insert into organizations (id, name, subscription_tier, supported_languages)
values (
  'e2b4f971-1234-4567-89ab-cdef01234567',
  'Závod Trnava - Komponenty & Montáž',
  'enterprise_pilot',
  '{"sk","uk","sr","en"}'
)
on conflict (id) do nothing;

-- Používatelia (Majster a Operátori)
insert into users (id, org_id, full_name, employee_no, role, preferred_lang, badge_hash, qr_token)
values
  ('11111111-1111-1111-1111-111111111111', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Peter Horváth', 'M-1024', 'foreman', 'sk', 'hash_peter_01', 'QR-PETER-H'),
  ('22222222-2222-2222-2222-222222222222', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Oleksandr Kovalenko', 'OP-8821', 'operator', 'uk', '04A1B2C3D4', 'QR-OLEKSANDR-K'),
  ('33333333-3333-3333-3333-333333333333', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Milan Varga', 'OP-4412', 'operator', 'sk', '14B2C3D4E5', 'QR-MILAN-V'),
  ('44444444-4444-4444-4444-444444444444', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Dragan Nikolić', 'OP-9103', 'operator', 'sr', '24C3D4E5F6', 'QR-DRAGAN-N')
on conflict (id) do nothing;

-- Pracovné stanice
insert into workstations (id, org_id, name, qr_code)
values
  ('a1111111-1111-1111-1111-111111111111', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Stanica 01: Predmontáž rámu a tesnenia', 'WS-TRN-01-FRAME'),
  ('a2222222-2222-2222-2222-222222222222', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Stanica 02: Zalisovanie konektorov dverí', 'WS-TRN-02-CONN'),
  ('a3333333-3333-3333-3333-333333333333', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Stanica 03: Lis hydraulický 40T', 'WS-TRN-03-PRESS'),
  ('a4444444-4444-4444-4444-444444444444', 'e2b4f971-1234-4567-89ab-cdef01234567', 'Stanica 04: Výstupná optická kontrola', 'WS-TRN-04-QC')
on conflict (id) do nothing;

-- Tabletové Kiosky
insert into devices (id, org_id, workstation_id, label, secret_hash, last_sync_at)
values
  ('b1111111-1111-1111-1111-111111111111', 'e2b4f971-1234-4567-89ab-cdef01234567', 'a2222222-2222-2222-2222-222222222222', 'Tablet Samsung Tab A9+ #01', 'sec_01', now()),
  ('b2222222-2222-2222-2222-222222222222', 'e2b4f971-1234-4567-89ab-cdef01234567', 'a3333333-3333-3333-3333-333333333333', 'Tablet Samsung Tab A9+ #02', 'sec_02', now())
on conflict (id) do nothing;

-- SOP Postup
insert into sops (id, org_id, workstation_id, title, status)
values (
  'c1111111-1111-1111-1111-111111111111',
  'e2b4f971-1234-4567-89ab-cdef01234567',
  'a2222222-2222-2222-2222-222222222222',
  'Montáž tesnenia a zalisovanie konektora dverového modulu',
  'published'
)
on conflict (id) do nothing;

-- Verzia 2.0 (Nemenná)
insert into sop_versions (id, org_id, sop_id, version, estimated_time_sec, published_by, published_at)
values (
  'd1111111-1111-1111-1111-111111111111',
  'e2b4f971-1234-4567-89ab-cdef01234567',
  'c1111111-1111-1111-1111-111111111111',
  2,
  54,
  'Peter Horváth',
  now()
)
on conflict (id) do nothing;

update sops set current_version_id = 'd1111111-1111-1111-1111-111111111111'
where id = 'c1111111-1111-1111-1111-111111111111';

-- Kroky SOP (Krok 1, Krok 2, Krok 3 s prekladmi a kvízom)
insert into sop_steps (
  id, org_id, sop_version_id, step_order, start_time, end_time,
  video_url, image_ok_url, image_nok_url, translations, quiz_question
)
values
(
  'e1111111-1111-1111-1111-111111111111',
  'e2b4f971-1234-4567-89ab-cdef01234567',
  'd1111111-1111-1111-1111-111111111111',
  1,
  0.0,
  12.5,
  'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-mechanic-working-with-tools-42861-large.mp4',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  '{
    "sk": {
      "title": "Kontrola gumového tesnenia a odmastenie",
      "bullets": [
        "Vizuálne skontrolujte neporušenosť tesniaceho profilu po celej dĺžke.",
        "Očistite dosadaciu plochu dverového rámu izopropylalkoholom.",
        "Uistite sa, že drážka neobsahuje kovové špony ani mastnotu."
      ],
      "safety": "Povinné použitie ochranných nitrilových rukavíc a okuliarov pri práci s odmasťovačom."
    },
    "uk": {
      "title": "Перевірка гумового ущільнювача та знежирення",
      "bullets": [
        "Візуально перевірте цілісність ущільнювального профілю по всій довжині.",
        "Очистіть прилеглу поверхню рами дверей ізопропіловим спиртом.",
        "Переконайтеся, що паз не містить металевої стружки або мастила."
      ],
      "safety": "Обов’язково використовуйте захисні рукавички та окуляри при роботі зі знежирювачем."
    },
    "sr": {
      "title": "Provera gumene zaptivke i odmašćivanje",
      "bullets": [
        "Vizuelno proverite integritet profila zaptivke celom dužinom.",
        "Očistite kontaktnu površinu okvira vrata izopropil alkoholom.",
        "Uverite se da žleb nema metalnih opiljaka ili masnoće."
      ],
      "safety": "Obavezna upotreba zaštitnih nitrilnih rukavica i naočara pri radu sa odmašćivačem."
    },
    "en": {
      "title": "Rubber Seal Inspection & Degreasing",
      "bullets": [
        "Visually inspect sealing strip integrity along the entire perimeter.",
        "Wipe mating groove surface with isopropyl alcohol cleaner.",
        "Ensure groove is completely free from metal shavings and grease."
      ],
      "safety": "Mandatory nitrile gloves and safety glasses during chemical surface preparation."
    }
  }'::jsonb,
  '{
    "type": "photo_ab",
    "correct_index": 0,
    "i18n": {
      "sk": { "question": "Ktoré usadenie tesnenia je správne (OK)?", "options": ["Variant A: Plynulé zatlačenie bez vĺn", "Variant B: Prehnuté tesnenie s medzerou"] },
      "uk": { "question": "Яка посадка ущільнювача є правильною (OK)?", "options": ["Варіант A: Рівномірне прилягання без хвиль", "Варіант B: Зім’ятий ущільнювач із зазором"] },
      "sr": { "question": "Koje postavljanje zaptivke je ispravno (OK)?", "options": ["Varijanta A: Ravnomerno pritisnuto bez talasa", "Varijanta B: Savijena zaptivka sa razmakom"] },
      "en": { "question": "Which seal alignment is correct (OK)?", "options": ["Option A: Continuous flush seating", "Option B: Buckled seal with air gap"] }
    }
  }'::jsonb
),
(
  'e2222222-2222-2222-2222-222222222222',
  'e2b4f971-1234-4567-89ab-cdef01234567',
  'd1111111-1111-1111-1111-111111111111',
  2,
  12.5,
  26.0,
  'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-with-machinery-42862-large.mp4',
  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
  '{
    "sk": {
      "title": "Zasunutie modrého konektora kabeláže a poistka",
      "bullets": [
        "Uchopte 12-pinový modrý konektor za telo, nikdy neťahajte za vodiče.",
        "Zasuňte konektor do protikusu až do zreteľného akustického kliknutia.",
        "Zaistite žltú mechanickú poistku (CPA lock) zatlačením dopredu."
      ],
      "safety": "Nepoužívajte nadmernú silu. Pri poškodení pinov vymeňte celý zväzok."
    },
    "uk": {
      "title": "Підключення синього роз’єму та блокування фіксатора",
      "bullets": [
        "Тримайте 12-контактний синій конектор за корпус, ніколи не тягніть за дроти.",
        "Вставте роз’єм у відповідну частину до відчутного клацання.",
        "Заблокуйте жовтий фіксатор (CPA lock), натиснувши його вперед."
      ],
      "safety": "Не застосовуйте надмірну силу. При пошкодженні контактів замініть весь джгут."
    },
    "sr": {
      "title": "Ubacivanje plavog konektora i osigurač",
      "bullets": [
        "Uhvatite 12-pinski plavi konektor za kućište, nikada ne vucite za žice.",
        "Gurnite konektor u ležište dok ne čujete jasan klik.",
        "Osigurajte žutu mehaničku bravicu (CPA lock) guranjem unapred."
      ],
      "safety": "Ne primenjujte preteranu silu. Ako su pinovi oštećeni, zamenite ceo snop."
    },
    "en": {
      "title": "Insert Blue Harness Connector & CPA Lock",
      "bullets": [
        "Grip 12-pin blue connector housing firmly, never pull directly on leads.",
        "Push into mating socket until tactile and audible click is heard.",
        "Engage yellow secondary lock (CPA) by pushing forward firmly."
      ],
      "safety": "Do not use excessive force. If pins are bent, quarantine harness immediately."
    }
  }'::jsonb,
  '{
    "type": "multiple_choice",
    "correct_index": 1,
    "i18n": {
      "sk": { "question": "Ako spoznáte, že konektor je správne zablokovaný?", "options": ["Keď sa vodiče napnú", "Zacvakne zámok a žltá poistka CPA je zatlačená dopredu", "Konektor sa voľne hýbe v puzdre"] },
      "uk": { "question": "Як переконатися, що роз’єм заблоковано правильно?", "options": ["Коли дроти натягнуті", "Клацнув замок і жовтий фіксатор CPA засунутий вперед", "Роз’єм вільно рухається в гнізді"] },
      "sr": { "question": "Kako prepoznati da je konektor ispravno zaključan?", "options": ["Kada se žice zategnu", "Škljocne brava i žuti osigurač CPA je pritisnut unapred", "Konektor se slobodno pomera u kućištu"] },
      "en": { "question": "How do you verify proper connector engagement?", "options": ["When wiring harness is taut", "Audible click heard and yellow CPA lock is fully depressed forward", "Connector has rotational play inside housing"] }
    }
  }'::jsonb
)
on conflict (id) do nothing;
