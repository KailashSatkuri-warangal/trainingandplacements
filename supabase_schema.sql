-- ================================================================
-- TrainingAndPlacements Database Schema for PostgreSQL / Supabase
-- ================================================================

-- 1. Create the `jobs` table
create table if not exists public.jobs (
  id text primary key,
  company text not null,
  company_category text,
  title text not null,
  category text not null,
  location text not null,
  work_mode text not null,
  experience text not null,
  salary text not null,
  salary_min numeric,
  salary_max numeric,
  featured boolean default false,
  hiring_status text,
  shifts text,
  process_type text,
  description text,
  skills text[] default '{}',
  eligibility text[] default '{}',
  responsibilities text[] default '{}',
  apply_url text,
  posted_date date default current_date,
  created_at timestamptz default now()
);

-- 2. Create index on category, location, and featured for fast queries
create index if not exists idx_jobs_category on public.jobs(category);
create index if not exists idx_jobs_featured on public.jobs(featured);
create index if not exists idx_jobs_posted_date on public.jobs(posted_date desc);

-- 3. Enable Row Level Security (RLS)
alter table public.jobs enable row level security;

-- 4. Policies:
-- Allow anyone (public/anon) to read active job postings
create policy "Allow public read access to jobs"
  on public.jobs
  for select
  to anon, authenticated
  using (true);

-- Allow inserting, updating, and deleting jobs
create policy "Allow authenticated/admin insert to jobs"
  on public.jobs
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated/admin update to jobs"
  on public.jobs
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow authenticated/admin delete to jobs"
  on public.jobs
  for delete
  to anon, authenticated
  using (true);
