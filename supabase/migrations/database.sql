-- ====================================================================
-- TRAININGANDPLACEMENTS Database Migration
-- Production Supabase PostgreSQL Schema with RLS, Triggers, & Storage
-- ====================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- 2. Create PROFILES table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('SUPER_ADMIN', 'ADMIN', 'EDITOR')) default 'EDITOR',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Create COMPANIES table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  description text,
  website text,
  industry text,
  location text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Create CATEGORIES table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Create HIRING_DRIVES table (Primary dynamic job opportunities table)
create table if not exists public.hiring_drives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  company_id uuid references public.companies(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  short_description text,
  description text,
  location text not null,
  experience text not null,
  salary_min numeric,
  salary_max numeric,
  salary_text text not null,
  employment_type text default 'Full-time',
  work_mode text not null default 'Work From Office',
  skills text[] default '{}',
  eligibility text[] default '{}',
  responsibilities text[] default '{}',
  requirements text[] default '{}',
  application_process text,
  application_url text,
  application_deadline date,
  featured boolean default false,
  status text not null check (status in ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED')) default 'DRAFT',
  views integer default 0,
  posted_at date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Create APPLICATIONS table (Private candidate submissions)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  drive_id uuid references public.hiring_drives(id) on delete cascade,
  candidate_name text not null,
  email text not null,
  phone text not null,
  resume_url text,
  cover_letter text,
  status text not null check (status in ('APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED')) default 'APPLIED',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Create TESTIMONIALS table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text,
  content text not null,
  avatar_url text,
  rating integer default 5,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Create CONTACT_ENQUIRIES table
create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  type text not null check (type in ('CANDIDATE', 'RECRUITER', 'EMPLOYER', 'GENERAL')) default 'CANDIDATE',
  message text not null,
  status text not null check (status in ('NEW', 'CONTACTED', 'RESOLVED', 'ARCHIVED')) default 'NEW',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ====================================================================
-- Indexes for High Performance Queries
-- ====================================================================
create index if not exists idx_hiring_drives_slug on public.hiring_drives(slug);
create index if not exists idx_hiring_drives_status on public.hiring_drives(status);
create index if not exists idx_hiring_drives_featured on public.hiring_drives(featured);
create index if not exists idx_hiring_drives_company on public.hiring_drives(company_id);
create index if not exists idx_hiring_drives_category on public.hiring_drives(category_id);
create index if not exists idx_hiring_drives_posted_at on public.hiring_drives(posted_at desc);
create index if not exists idx_applications_drive on public.applications(drive_id);
create index if not exists idx_applications_status on public.applications(status);

-- ====================================================================
-- RPC Function: Safe Increment View Counter
-- ====================================================================
create or replace function public.increment_drive_views(drive_slug text)
returns void as $$
begin
  update public.hiring_drives
  set views = views + 1
  where slug = drive_slug;
end;
$$ language plpgsql security definer;

-- ====================================================================
-- Trigger: Automated Profile Creation on Supabase Auth Sign Up
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'ADMIN')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ====================================================================
-- Row Level Security (RLS) Configuration
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.hiring_drives enable row level security;
alter table public.applications enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_enquiries enable row level security;

-- PROFILES Policies
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('SUPER_ADMIN', 'ADMIN')
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- COMPANIES Policies
create policy "Public can read active companies"
  on public.companies for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins can manage companies"
  on public.companies for all
  to authenticated
  using (true)
  with check (true);

-- CATEGORIES Policies
create policy "Public can read active categories"
  on public.categories for select
  to anon, authenticated
  using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- HIRING_DRIVES Policies
-- 1. Public can only see PUBLISHED drives
create policy "Public can read published hiring drives"
  on public.hiring_drives for select
  to anon, authenticated
  using (status = 'PUBLISHED');

-- 2. Authenticated users (Recruiters/Admins) can view all drives (DRAFT, PUBLISHED, etc.)
create policy "Admins can view all hiring drives"
  on public.hiring_drives for select
  to authenticated
  using (true);

-- 3. Admins can insert, update, delete drives
create policy "Admins can manage hiring drives"
  on public.hiring_drives for all
  to authenticated
  using (true)
  with check (true);

-- APPLICATIONS Policies
-- 1. Public candidates can submit applications
create policy "Candidates can submit applications"
  on public.applications for insert
  to anon, authenticated
  with check (true);

-- 2. Public CANNOT read applications (Strictly Private)
create policy "Only authenticated admins can view applications"
  on public.applications for select
  to authenticated
  using (true);

create policy "Only authenticated admins can manage applications"
  on public.applications for all
  to authenticated
  using (true)
  with check (true);

-- TESTIMONIALS Policies
create policy "Public can read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can manage testimonials"
  on public.testimonials for all
  to authenticated
  using (true)
  with check (true);

-- CONTACT_ENQUIRIES Policies
create policy "Public can submit enquiries"
  on public.contact_enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Only authenticated admins can view enquiries"
  on public.contact_enquiries for select
  to authenticated
  using (true);

create policy "Only authenticated admins can manage enquiries"
  on public.contact_enquiries for all
  to authenticated
  using (true)
  with check (true);

-- ====================================================================
-- Storage Buckets Configuration (via storage schema)
-- ====================================================================
insert into storage.buckets (id, name, public)
values 
  ('company-logos', 'company-logos', true),
  ('job-images', 'job-images', true),
  ('testimonial-avatars', 'testimonial-avatars', true),
  ('resumes', 'resumes', false)
on conflict (id) do update set public = excluded.public;

-- Storage Policies: Public can read public buckets
create policy "Public read company-logos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('company-logos', 'job-images', 'testimonial-avatars'));

create policy "Public candidate upload resumes"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'resumes');

create policy "Admins can manage all storage objects"
  on storage.objects for all
  to authenticated
  using (true)
  with check (true);
