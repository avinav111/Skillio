-- Glide MVP progress (optional Supabase backend)
-- Apply in Supabase SQL editor or via supabase db push

create table if not exists public.glide_profiles (
  id uuid primary key,
  skill_level text,
  instrument_type text,
  microphone_ok boolean default true,
  weak_areas text[] not null default '{}',
  completed_lesson_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.glide_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.glide_profiles (id) on delete cascade,
  lesson_id text not null,
  exercise_id text not null,
  transcription jsonb,
  evaluation jsonb,
  created_at timestamptz not null default now()
);

create index if not exists glide_attempts_user_created_idx
  on public.glide_attempts (user_id, created_at desc);

alter table public.glide_profiles enable row level security;
alter table public.glide_attempts enable row level security;

-- Service role bypasses RLS; anon has no access until you add policies + auth.
