-- ====================================================================
-- TRAININGANDPLACEMENTS: COMPLETE DATABASE MIGRATION & DEMO CASES SEED
-- ====================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/sbwantnhvsiylfnmayfb
-- 2. Click on "SQL Editor" in the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ====================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create PROFILES table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null check (role in ('SUPER_ADMIN', 'ADMIN', 'EDITOR')) default 'ADMIN',
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

-- 5. Create HIRING_DRIVES table (Covers all status, work mode, and experience cases)
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
  shifts text,
  process_type text,
  application_url text,
  featured boolean default false,
  status text not null check (status in ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED')) default 'PUBLISHED',
  views integer default 0,
  posted_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Create APPLICATIONS table (Covers all 5 candidate pipeline stages)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  drive_id uuid references public.hiring_drives(id) on delete cascade,
  candidate_name text not null,
  email text not null,
  phone text not null,
  resume_url text,
  cover_letter text,
  notes text,
  status text not null check (status in ('APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'PLACED')) default 'APPLIED',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Create CONTACT_ENQUIRIES table (Covers all types and statuses)
create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  type text not null check (type in ('CANDIDATE', 'RECRUITER', 'EMPLOYER', 'GENERAL')) default 'GENERAL',
  message text not null,
  status text not null check (status in ('NEW', 'CONTACTED', 'RESOLVED', 'ARCHIVED')) default 'NEW',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Create TESTIMONIALS table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'Placed Candidate',
  company text,
  content text not null,
  avatar_url text,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. RPC Function for safe view count increment
create or replace function public.increment_drive_views(drive_slug text)
returns void as $$
begin
  update public.hiring_drives
  set views = coalesce(views, 0) + 1
  where slug = drive_slug;
end;
$$ language plpgsql security definer;

-- 10. Enable Row Level Security (RLS) & Grant access
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.hiring_drives enable row level security;
alter table public.applications enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.testimonials enable row level security;

-- Grant API access to anon and authenticated
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;

-- RLS Policies
create policy "Allow public read access to active companies"
  on public.companies for select to anon, authenticated using (true);

create policy "Allow admin write to companies"
  on public.companies for all to anon, authenticated using (true) with check (true);

create policy "Allow public read access to categories"
  on public.categories for select to anon, authenticated using (true);

create policy "Allow admin write to categories"
  on public.categories for all to anon, authenticated using (true) with check (true);

create policy "Allow read access to hiring drives"
  on public.hiring_drives for select to anon, authenticated using (true);

create policy "Allow write to hiring drives"
  on public.hiring_drives for all to anon, authenticated using (true) with check (true);

create policy "Allow insert & select on applications"
  on public.applications for all to anon, authenticated using (true) with check (true);

create policy "Allow insert & select on enquiries"
  on public.contact_enquiries for all to anon, authenticated using (true) with check (true);

create policy "Allow read & write on testimonials"
  on public.testimonials for all to anon, authenticated using (true) with check (true);

create policy "Allow read & write on profiles"
  on public.profiles for all to anon, authenticated using (true) with check (true);

-- 11. Storage Buckets Setup
insert into storage.buckets (id, name, public)
values
  ('company-logos', 'company-logos', true),
  ('job-images', 'job-images', true),
  ('testimonial-avatars', 'testimonial-avatars', true),
  ('resumes', 'resumes', false)
on conflict (id) do nothing;

create policy "Allow public read company logos"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('company-logos', 'job-images', 'testimonial-avatars'));

create policy "Allow upload to storage"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id in ('company-logos', 'job-images', 'testimonial-avatars', 'resumes'));

create policy "Allow read resumes"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'resumes');

-- ====================================================================
-- 12. SEED ALL POSSIBLE CASES DATA DIRECTLY INTO THE DATABASE
-- ====================================================================

-- A. COMPANIES (IT, Healthcare, BPO, FinTech, Active and Inactive)
insert into public.companies (id, name, slug, logo_url, industry, location, is_active, description) values
  ('11111111-1111-1111-1111-111111111101', 'Cognizant', 'cognizant', '/images/companies/cognizant.svg', 'Information Technology & Consulting', 'Hyderabad (Gachibowli)', true, 'Global enterprise IT services and digital transformation leader.'),
  ('11111111-1111-1111-1111-111111111102', 'Teleperformance', 'teleperformance', '/images/companies/teleperformance.svg', 'BPO & Customer Experience', 'Hyderabad & Pan-India', true, 'Global leader in digital business services and customer care.'),
  ('11111111-1111-1111-1111-111111111103', 'R1 RCM', 'r1-rcm', '/images/companies/r1rcm.svg', 'US Healthcare Revenue Cycle', 'Hyderabad (Hitec City)', true, 'Technology-enabled revenue cycle partner for US hospital systems.'),
  ('11111111-1111-1111-1111-111111111104', 'Capgemini', 'capgemini', '/images/companies/capgemini.svg', 'IT & Digital Engineering', 'Hyderabad (Gachibowli)', true, 'Global consulting, technology services, and digital engineering.'),
  ('11111111-1111-1111-1111-111111111105', 'Tech Mahindra', 'tech-mahindra', '/images/companies/techmahindra.svg', 'Telecom & Enterprise ITES', 'Hyderabad (Madhapur)', true, 'Provider of digital transformation and business consulting.'),
  ('11111111-1111-1111-1111-111111111106', 'Concentrix', 'concentrix', '/images/companies/concentrix.svg', 'Customer Operations & FinTech', 'Hyderabad (Kondapur)', true, 'Global customer engagement and risk technology solutions.'),
  ('11111111-1111-1111-1111-111111111107', 'Deloitte India', 'deloitte-india', '/images/companies/deloitte.svg', 'Advisory & Risk Advisory', 'Hyderabad (Hitec City)', true, 'Audit, consulting, and financial advisory services.'),
  ('11111111-1111-1111-1111-111111111108', 'Legacy Solutions Partner', 'legacy-solutions', '/images/companies/legacy.svg', 'Legacy BPO', 'Secunderabad', false, 'Archived partner from Q1 2025 hiring cycle.')
on conflict (id) do update set name = excluded.name, logo_url = excluded.logo_url, industry = excluded.industry;

-- B. CATEGORIES (All Career Streams)
insert into public.categories (id, name, slug, description, is_active) values
  ('22222222-2222-2222-2222-222222222201', 'BPO / Customer Support', 'bpo-customer-support', 'Customer Experience & Client Support', true),
  ('22222222-2222-2222-2222-222222222202', 'Healthcare / Medical Billing', 'healthcare-medical-billing', 'US Healthcare Revenue Cycle & AR Callers', true),
  ('22222222-2222-2222-2222-222222222203', 'IT / Software Development', 'it-software-development', 'Full-stack engineering, QA automation, & Cloud', true),
  ('22222222-2222-2222-2222-222222222204', 'Operations & Core Services', 'operations-core-services', 'Banking operations, KYC analyst, & GIS mapping', true)
on conflict (id) do update set name = excluded.name;

-- C. HIRING DRIVES (All cases: PUBLISHED, DRAFT, CLOSED, ARCHIVED, Featured, all work modes, experience brackets)
insert into public.hiring_drives (
  id, title, slug, company_id, category_id, location, work_mode, experience,
  salary_text, salary_min, salary_max, shifts, process_type, skills, eligibility, responsibilities, description, status, featured, views
) values
  -- Case 1: PUBLISHED + FEATURED + Freshers + Work From Office (IT)
  (
    '33333333-3333-3333-3333-333333333301',
    'Associate Software Engineer – 2025/2026 Batch',
    'associate-software-engineer-cognizant-2025-2026',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222203',
    'Hyderabad (Gachibowli)',
    'Work From Office',
    'Freshers (2024 / 2025 / 2026 Batch)',
    '₹4.50 LPA - ₹5.50 LPA',
    450000, 550000,
    'Standard Day Shift (Mon - Fri, 5 Days Working)',
    'Online Aptitude + Technical Coding Round + HR Evaluation',
    ARRAY['Java', 'Spring Boot', 'SQL', 'Data Structures', 'Problem Solving'],
    ARRAY['B.Tech / B.E (CSE, IT, ECE, EEE) or MCA graduates.', 'Minimum 60% aggregate across 10th, 12th, and Graduation.', 'No active backlogs at final onboarding.'],
    ARRAY['Develop and maintain enterprise software modules under senior architect guidance.', 'Participate in code reviews, unit testing, and agile sprint planning.'],
    'Cognizant is conducting direct campus-to-corporate hiring drives in Hyderabad. Shortlisted candidates receive dedicated 1-on-1 interview mentoring through Kailash.',
    'PUBLISHED',
    true,
    342
  ),
  -- Case 2: PUBLISHED + FEATURED + US Healthcare + Hybrid
  (
    '33333333-3333-3333-3333-333333333302',
    'US Healthcare AR Caller & Billing Executive',
    'us-healthcare-ar-caller-r1-rcm',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222202',
    'Hyderabad (Hitec City)',
    'Hybrid',
    '0 - 1 Years',
    '₹3.80 LPA + ₹45,000 Shift Incentives',
    380000, 425000,
    'Fixed US Night Shift (6:30 PM - 3:30 AM, Sat/Sun Off)',
    'Direct Face-to-Face Voice Assessment & Ops Panel',
    ARRAY['US Healthcare', 'Medical Billing', 'AR Follow-up', 'Denial Management'],
    ARRAY['Any Graduate / Post Graduate (B.Com, B.Sc, BBA, B.Tech, Pharma).', 'Excellent verbal English fluency.'],
    ARRAY['Contact US insurance carriers regarding unpaid, denied, or pending medical claims.', 'Document payer responses and follow HIPAA protocols.'],
    'R1 RCM offers high-stability careers in the recession-proof US healthcare domain with doorstep cab service.',
    'PUBLISHED',
    true,
    418
  ),
  -- Case 3: PUBLISHED + Remote Work From Home + Customer Experience
  (
    '33333333-3333-3333-3333-333333333303',
    'International Customer Success Specialist (Remote)',
    'international-customer-success-teleperformance',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222201',
    'Pan-India / Remote',
    'Work From Home',
    'Freshers & Experienced',
    '₹3.20 LPA - ₹4.00 LPA + WFH Equipment',
    320000, 400000,
    'Rotational 24/7 Shifts (9 Hours Login, 2 Consecutive Offs)',
    'Versant Voice Assessment (Level 4+) + Operations Interview',
    ARRAY['Customer Empathy', 'English Fluency', 'Typing (35+ WPM)', 'Active Listening'],
    ARRAY['10+2 / Intermediate or any undergraduate/graduate degree.', 'Dedicated quiet home workspace with stable broadband connection.'],
    ARRAY['Handle incoming queries and customer requests via phone and live chat.', 'Deliver empathetic customer service representing global technology brands.'],
    'Teleperformance India is recruiting candidate batches for its premier global accounts. Company provides laptop.',
    'PUBLISHED',
    false,
    295
  ),
  -- Case 4: PUBLISHED + Experienced (1 - 3 Years) + Operations & FinTech
  (
    '33333333-3333-3333-3333-333333333304',
    'Financial Crime & KYC Operations Analyst',
    'financial-crime-kyc-analyst-concentrix',
    '11111111-1111-1111-1111-111111111106',
    '22222222-2222-2222-2222-222222222204',
    'Hyderabad (Kondapur)',
    'Work From Office',
    '1 - 3 Years',
    '₹5.00 LPA - ₹6.50 LPA',
    500000, 650000,
    'Rotational Day & Afternoon Shifts',
    'HR Screen + Domain Scenario Assessment + Manager Round',
    ARRAY['AML', 'KYC Compliance', 'CDD / EDD', 'Risk Investigation', 'Excel'],
    ARRAY['B.Com, BBA, MBA Finance or relevant business degrees.', '1 to 3 years experience in banking operations or customer due diligence.'],
    ARRAY['Review customer documentation and perform enhanced due diligence.', 'Flag suspicious transactions per compliance protocols.'],
    'Join Concentrix banking intelligence and risk management vertical.',
    'PUBLISHED',
    false,
    184
  ),
  -- Case 5: PUBLISHED + Senior (3+ Years) + High CTC (Capgemini)
  (
    '33333333-3333-3333-3333-333333333305',
    'Senior Full Stack Cloud Engineer (React / Node / AWS)',
    'senior-full-stack-cloud-capgemini',
    '11111111-1111-1111-1111-111111111104',
    '22222222-2222-2222-2222-222222222203',
    'Hyderabad (Gachibowli)',
    'Hybrid',
    '3+ Years',
    '₹9.50 LPA - ₹14.00 LPA',
    950000, 1400000,
    'General Day Shift',
    'Technical System Architecture Round + Client Director Interview',
    ARRAY['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker', 'Microservices'],
    ARRAY['Minimum 3 years demonstrable production web app experience.', 'Strong command of modern JavaScript, SQL, and AWS.'],
    ARRAY['Architect enterprise web applications and API microservices.', 'Implement robust automated testing and CI/CD deployment pipelines on AWS.'],
    'Premium lateral opening at Capgemini. Offers high package hike and immediate joining bonus.',
    'PUBLISHED',
    true,
    512
  ),
  -- Case 6: DRAFT (Upcoming drive, awaiting client headcount)
  (
    '33333333-3333-3333-3333-333333333306',
    '[DRAFT] Data Operations & Google Mapping Associate',
    'draft-data-ops-google-mapping-techm',
    '11111111-1111-1111-1111-111111111105',
    '22222222-2222-2222-2222-222222222204',
    'Hyderabad (Madhapur)',
    'Work From Office',
    'Freshers (2024 / 2025)',
    '₹2.80 LPA - ₹3.20 LPA',
    280000, 320000,
    'Day Shift (Mon - Fri)',
    'Spatial Reasoning Test + HR Discussion',
    ARRAY['GIS Basics', 'Google Earth', 'Map Navigation'],
    ARRAY['Any graduate with basic computer literacy.'],
    ARRAY['Verify map vector data, route geometry, and local business POI accuracy.'],
    'Under recruiter review. Pending final hiring intake allocation from client.',
    'DRAFT',
    false,
    12
  ),
  -- Case 7: CLOSED (Drive target fulfilled)
  (
    '33333333-3333-3333-3333-333333333307',
    '[CLOSED] IT Support Desk Analyst – Batch 12',
    'closed-it-support-analyst-deloitte',
    '11111111-1111-1111-1111-111111111107',
    '22222222-2222-2222-2222-222222222203',
    'Hyderabad (Hitec City)',
    'Work From Office',
    '0 - 1 Years',
    '₹4.00 LPA',
    400000, 400000,
    'Rotational Shifts',
    'Completed',
    ARRAY['Active Directory', 'Networking', 'Windows Server'],
    ARRAY['B.Tech / B.Sc Computers.'],
    ARRAY['All 40 headcount slots filled through TrainingAndPlacements.'],
    'This hiring drive completed its intake in September 2026 with 100% joining.',
    'CLOSED',
    false,
    680
  ),
  -- Case 8: ARCHIVED (Past record)
  (
    '33333333-3333-3333-3333-333333333308',
    '[ARCHIVED] Legacy Voice Executive – Q1 2025',
    'archived-legacy-voice-exec',
    '11111111-1111-1111-1111-111111111108',
    '22222222-2222-2222-2222-222222222201',
    'Secunderabad',
    'Work From Office',
    'Freshers',
    '₹2.20 LPA',
    220000, 220000,
    'Day Shift',
    'Archived',
    ARRAY['Voice', 'Telugu / English'],
    ARRAY['Intermediate / Any Degree.'],
    ARRAY['Archived historical drive.'],
    'Archived reference drive for historical placement metrics.',
    'ARCHIVED',
    false,
    94
  )
on conflict (id) do update set title = excluded.title, status = excluded.status;

-- D. APPLICATIONS (All 5 candidate pipeline stages)
insert into public.applications (id, drive_id, candidate_name, email, phone, status, cover_letter, notes) values
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Karthik Varma', 'karthik.varma2025@gmail.com', '+91 98480 23145', 'APPLIED', '2025 CSE graduate from JNTUH with 74% aggregate. Proficient in Java, Spring Boot, and LeetCode problem solving.', 'Pending initial screening verification.'),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', 'Pooja Reddy', 'pooja.reddy.rcm@outlook.com', '+91 94901 88234', 'REVIEWING', 'B.Pharmacy 2024 pass-out with strong English voice command and medical terminology foundation.', 'Academic docs verified. Voice test scheduled.'),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333303', 'Mohammed Zeeshan', 'zeeshan.mhd98@gmail.com', '+91 83281 99012', 'SHORTLISTED', 'BBA graduate with 1.5 years customer service experience. Cleared internal Versant voice test with Kailash.', 'Slotted for Teleperformance client panel.'),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', 'Sneha Goud', 'sneha.goud99@gmail.com', '+91 70321 44567', 'PLACED', 'Attended TrainingAndPlacements mock interview. Successfully cleared Cognizant technical and HR rounds.', 'OFFER RELEASED: LOI received ₹4.75 LPA.'),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333305', 'Ramesh Naidu', 'ramesh.naidu@yahoo.com', '+91 99887 66554', 'REJECTED', '90 days notice period not acceptable by Capgemini immediate joining requirement.', 'Rejected due to notice period mismatch.')
on conflict (id) do update set status = excluded.status;

-- E. CONTACT ENQUIRIES (All types & statuses)
insert into public.contact_enquiries (id, name, email, phone, subject, type, status, message) values
  ('55555555-5555-5555-5555-555555555501', 'Sai Krishna Rao', 'saikrishna.rao@gmail.com', '+91 88970 12345', '2025 B.Tech Freshers Placement Schedule', 'CANDIDATE', 'NEW', 'Sir, I am a 2025 pass-out from Warangal. Can you please let me know if walk-in or virtual drives are scheduled for Cognizant or Capgemini this weekend?'),
  ('55555555-5555-5555-5555-555555555502', 'Neha Mathur', 'neha.mathur@teleperformance.com', '+91 98200 45678', 'Requirement of 35 Pre-screened Voice Candidates', 'RECRUITER', 'CONTACTED', 'Hi Kailash, we are scaling our US Voice account in Hyderabad Hitec City campus. We need 35 candidates screened on Versant 4+ by Monday. Please share resumes.'),
  ('55555555-5555-5555-5555-555555555503', 'Venkatesh Prasad', 'venkatesh@clarissolutions.in', '+91 97011 22334', 'Hiring Partnership for FinTech Startup', 'EMPLOYER', 'RESOLVED', 'Looking to hire 6 React & Node.js engineers. Kailash aligned 12 candidate profiles. 5 candidates already offered. Partnership active.'),
  ('55555555-5555-5555-5555-555555555504', 'Dr. K. Srinivas', 'principal@cbit.ac.in', '+91 94400 11223', 'Campus Placement Training Collaboration', 'GENERAL', 'ARCHIVED', 'Inquiry regarding pre-placement training modules and mock technical simulations for 4th year college batch.')
on conflict (id) do update set status = excluded.status;

-- F. TESTIMONIALS (All ratings, published and draft)
insert into public.testimonials (id, name, role, company, content, rating, is_published) values
  ('66666666-6666-6666-6666-666666666601', 'Shiva Sai Jakka', 'Candidate – Placed Associate', 'Cognizant', 'Great support throughout the interview process. Kailash sir guided me at every round and ensured complete clarity on communication and technical panel expectations.', 5, true),
  ('66666666-6666-6666-6666-666666666602', 'Afrid Fareed', 'Candidate – Placed Executive', 'R1 RCM', 'Helped me get placed smoothly with prompt coordination, mock voice rounds, and transparent guidance. Highly recommended for US Healthcare and Non-IT careers!', 5, true),
  ('66666666-6666-6666-6666-666666666603', 'A. Sadhana', 'Candidate – Placed Specialist', 'Teleperformance', 'TrainingAndPlacements provided direct client mapping and made the entire onboarding hassle-free. Kailash was always reachable on call whenever I had doubts.', 4, true),
  ('66666666-6666-6666-6666-666666666604', 'Rohit Nambiar', 'Candidate – KYC Operations', 'Concentrix', 'Zero intermediary charges and 100% genuine corporate slots. The mock round gave me high confidence for the client scenario test.', 5, true),
  ('66666666-6666-6666-6666-666666666605', 'Pravallika K.', 'Candidate – Under Final Onboarding', 'Capgemini', 'Mock interview practice was directly aligned with client technical questions. Awaiting DOJ confirmation.', 5, false)
on conflict (id) do update set content = excluded.content;

-- G. ADMIN PROFILE
insert into public.profiles (id, name, email, role) values
  ('91285c96-062b-4197-ba6d-208a801984a4', 'Kailash', 'admin@trainingandplacements.com', 'SUPER_ADMIN')
on conflict (id) do update set role = 'SUPER_ADMIN';

-- ====================================================================
-- SUCCESS VERIFICATION QUERY:
-- ====================================================================
select 'COMPLETED' as status,
  (select count(*) from public.companies) as total_companies,
  (select count(*) from public.categories) as total_categories,
  (select count(*) from public.hiring_drives) as total_drives,
  (select count(*) from public.applications) as total_applications,
  (select count(*) from public.contact_enquiries) as total_enquiries,
  (select count(*) from public.testimonials) as total_testimonials;
